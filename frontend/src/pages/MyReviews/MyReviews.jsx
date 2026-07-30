import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getSellerReviews } from "../../api/reviewApi";
import "./MyReviews.css";

export default function MyReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sellerId = user?._id || user?.id;

  useEffect(() => {
    if (!sellerId) return;

    let cancelled = false;
    setLoading(true);

    getSellerReviews(sellerId, page)
      .then((data) => {
        if (cancelled) return;
        setReviews(data.reviews);
        setPagination(data.pagination);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load reviews");
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [sellerId, page]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <main className="my-reviews-page">
      <div className="my-reviews-shell">
        <Link to="/dashboard" className="my-reviews-back">
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <h1>My Reviews</h1>
        <p className="my-reviews-sub">See what buyers are saying about deals with you.</p>

        {loading && <p>Loading reviews...</p>}
        {error && <p className="my-reviews-error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="my-reviews-summary">
              <Star size={24} fill="#f5a623" color="#f5a623" />
              <span>{averageRating.toFixed(1)}</span>
              <p>{pagination?.total ?? reviews.length} total review{pagination?.total === 1 ? "" : "s"}</p>
            </div>

            {reviews.length === 0 ? (
              <p className="no-reviews">
                No reviews yet. They'll show up here once buyers complete a deal with you.
              </p>
            ) : (
              <ul className="my-reviews-list">
                {reviews.map((review) => (
                  <li key={review._id} className="my-review-item">
                    <div className="review-stars">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    {review.comment && <p>{review.comment}</p>}
                    <div className="review-meta">
                      {review.reviewer?.fullName || "Anonymous buyer"} ·{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="review-pagination">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </button>
                <span>
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}