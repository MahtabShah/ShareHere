import React, { useState } from "react";
import axios from "axios";
import { Loading } from "./LazyLoading";
import { useQuote } from "../src/context/QueotrContext";
import { Textarea } from "../src/maincomponents/CanvasStyled";

const ReportPost = ({ postId }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { API } = useQuote();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      setError("Please select a reason.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/api/crud/report_post`, {
        postId,
        reason,
        details,
      });

      setSubmitted(true);
      setLoading(false);
      setError("");
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div
      className="w-100 cardp-4 mb-4 py-3 rounded-0 "
      style={{
        borderTop: "1px solid var(--border-color)",
      }}>
      <h5 className="mb-3">Report This Post</h5>

      {submitted ? (
        <div className="alert alert-success" role="alert">
          Your report has been submitted. Thank you!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3 ">
            <label htmlFor="reason" className="form-label ">
              Reason
            </label>
            <select
              className="w-100 p-2 rounded"
              style={{
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required>
              <option value="">Select a reason</option>
              <option value="abuse">Abuse</option>
              <option value="hate">Hate Speech</option>
              <option value="nudity">Nudity</option>
              <option value="violence">Violence</option>
              <option value="spam">Spam or Scam</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="details" className="form-label">
              Additional Details (Optional)
            </label>
            <Textarea
              id="details"
              rows={6}
              value={details}
              style={{ height: "100px" }}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Add any extra information..."
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-danger rounded-0">
            {!loading ? "Submit Report" : <Loading dm={18} clr="light" />}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReportPost;
