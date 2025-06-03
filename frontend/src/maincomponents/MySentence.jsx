import { useEffect, useState } from "react";
import axios from "axios";
// const API = import.meta.env.VITE_API_URL;

function MySentences({ sentences, loading, admin }) {
  //
  const [newSentence, setNewSentence] = useState("");
  const [error, setError] = useState("");

  console.log("user admin ", admin);

  return (
    // <div>
    //   <h2>Your Sentences</h2>
    //   {sentences.length === 0 ? (
    //     <p>No sentences found.</p>
    //   ) : (
    //     <ul>
    //       {sentences.map((s) => (
    //         <li key={s._id}>{s.text}</li>
    //       ))}
    //     </ul>
    //   )}
    // </div>

    <div className=" mt-4">
      <h2 className="mb-4">My Sentences</h2>

      {/* Add sentence form */}
      {/* <form onSubmit={handleAddSentence} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new sentence"
            value={newSentence}
            onChange={(e) => setNewSentence(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Add
          </button>
        </div>
      </form> */}

      {/* Loading or error */}
      {!loading && <div>Loading sentences...</div>}
      {error && <div className="text-danger">{error}</div>}

      {/* Sentences list */}
      <div className="row">
        {sentences?.length === 0 && !loading && <p>No sentences to display.</p>}
        {sentences?.map((sentence) => (
          <div key={sentence?._id} className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <p className="card-text">{sentence?.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MySentences;
