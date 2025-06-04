import { Home, CardPost } from "./maincomponents/Home";
export const StatusRing = ({
  post,
  user,
  admin,
  fetchAllUsers,
  comment,
  isDisplayedLeftNav,
  fetchSentences,
}) => {
  const items = new Array(8).fill(0); // Simulate 8 status items

  return (
    <>
      <div className="d-flex gap-3 ps-2 overflow-x-auto status-parent align-items-center w-100 px-0">
        {items.map((_, idx) => (
          <div
            className="status-item d-flex align-items-center justify-content-center"
            key={idx}
          >
            <div className="status-ring d-flex align-items-center justify-content-center">
              <div className="status-image bg-light"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const StatusPage = ({
  post,
  user,
  admin,
  fetchAllUsers,
  comment,
  isDisplayedLeftNav,
  fetchSentences,
}) => {
  const items = new Array(8).fill(0); // Simulate 8 status items

  return (
    <>
      <div className="pt-3">
        <hr className="m-0 p-0" style={{ height: "4px", background: "#333" }} />
        <div className="d-flex gap-3 overflow-x-auto status-parent align-items-center w-100 p-2">
          <div className="status-item d-flex align-items-center justify-content-center gap-2">
            <div
              className="status-ring d-flex align-items-center justify-content-center"
              style={{ minWidth: "clamp(60px, 10vw, 80px)" }}
            >
              <div className="status-image bg-light"></div>
            </div>
            <div
              className="d-flex flex-column"
              style={{ minWidth: "max-content" }}
            >
              <span>Mahtab</span>
              <small>Today, 8:20</small>
            </div>
          </div>
        </div>
        <div className="border flex-grow-1">
          {comment?.pages?.map((pg, idx) => {
            return (
              <>
                <CardPost pg={pg} />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};
