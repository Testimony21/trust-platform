import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import "./ErrorBoundary.css";

/**
 * Catches render-time errors (like the "X is not defined" crash from an
 * undefined component) anywhere in its subtree, so the user sees a
 * recoverable screen instead of a blank white page.
 *
 * Wrap this around <Layout /> (or individual page sections) in App.jsx.
 * NOTE: this does NOT catch errors inside async code like fetch/axios
 * calls - those are caught by each component's own try/catch, which your
 * pages already do. This is specifically for render-crash safety.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Swap this for a logging service (Sentry, LogRocket, etc.) later.
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-card">
            <AlertTriangle size={32} />
            <h2>Something went wrong</h2>
            <p>
              This page hit an unexpected error. Try reloading - if it keeps
              happening, let us know what you were doing.
            </p>
            <button onClick={this.handleReload}>
              <RefreshCw size={16} />
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}