import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Star, Flag, Bookmark } from "lucide-react";
import { getSellerProfile, getUserById, getSellerReviews } from "../../api/reviewApi";
import "./SellerProfile.css";

export default function SellerProfilePage() {
  const { id } = useParams();

  const [seller, setSeller] = useState(null);
  const [sellerUser, setSellerUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [profile, userInfo, reviewData] = await Promise.all([
          getSellerProfile(id),
          getUserById(id),
          getSellerReviews(id, page),
        ]);

        if (cancelled) return;
        setSeller(profile);
        setSellerUser(userInfo);
        setReviews(reviewData.reviews);
        setPagination(reviewData.pagination);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load seller profile");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, page]);

  if (loading) {
    return <main className="seller-profile-page">Loading seller profile...</main>;
  }

  if (error) {
    return <main className="seller-profile-page seller-profile-error">{error}</main>;
  }

  const averageRating = seller?.averageRating ?? 0;
  const reviewCount = seller?.reviewCount ?? 0;

  return (
    <main className="seller-profile-page">
      <div className="seller-profile-shell">
        <Link to="/dashboard" className="seller-profile-back">
          <ArrowLeft size={17} />
          Back to search
        </Link>

        <section className="seller-profile-header">
          <div className="seller-profile-identity">
            <div className="seller-avatar">
              {(sellerUser?.fullName || seller?.displayName || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1>{seller?.displayName || sellerUser?.fullName || "Seller"}</h1>
              <span className={seller?.isVerified ? "tag-verified" : "tag-unverified"}>
                <ShieldCheck size={13} />
                {seller?.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>

          <div className="seller-profile-score">
            <span>{seller?.trustScore ?? 0}%</span>
            <small>Trust Score</small>
          </div>
        </section>

        <section className="seller-profile-rating-summary">
          <div className="rating-big">
            <Star size={28} fill="#f5a623" color="#f5a623" />
            <span>{averageRating.toFixed(1)}</span>
          </div>
          <div>
            <p className="rating-count">
              {reviewCount} review{reviewCount === 1 ? "" : "s"}
            </p>
            <p className="deal-stats">
              {seller?.successfulDeals ?? 0} successful deals out of {seller?.totalDeals ?? 0}
            </p>
          </div>
        </section>

        <section className="seller-profile-details">
          <div>
            <span>Email</span>
            <strong>{sellerUser?.email || "—"}</strong>
          </div>
          <div>
            <span>Phone</span>
            <strong>{seller?.phone || sellerUser?.phone || "—"}</strong>
          </div>
          <div>
            <span>Reports</span>
            <strong>{seller?.reports ?? 0}</strong>
          </div>
        </section>

        {seller?.bio && (
          <section className="seller-profile-bio">
            <h2>About</h2>
            <p>{seller.bio}</p>
          </section>
        )}

        <section className="seller-profile-reviews">
          <h2>Buyer reviews</h2>

          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet — be the first to deal with this seller and leave one.</p>
          ) : (
            <ul className="review-list">
              {reviews.map((review) => (
                <li key={review._id} className="review-list-item">
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
        </section>
      </div>
    </main>
  );
}