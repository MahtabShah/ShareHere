const API = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

export const CommentSection = ({ post }) => {
  const nevigate = useNavigate();
  console.log("post 1", post);

  return (
    <>
      <div className=" pb-3">
        {post?.comments?.length > 0 ? (
          post?.comments?.map((pc, idx) => {
            return (
              <div className="d-flex gap-1 mt-3" key={`idx-post-${idx}`}>
                <div
                  className="d-flex align-items-center justify-content-center rounded-crcle text-white"
                  style={{
                    minWidth: "40px",
                    height: "40px",
                    borderRadius: "20px",
                    background: `${pc?.userId?.bg_clr}`,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    nevigate(`/api/user/${pc?.userId?._id}`);
                  }}
                >
                  <span>{pc?.userId?.username?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="small">
                  <small className="fw-semibold">@{pc?.userId?.username}</small>
                  <div key={idx} className="fs-6">
                    {pc?.text}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No comment</p>
        )}
      </div>
    </>
  );
};

export const CardPost = ({
  post,
  style = { height: "100%", width: "100%" },
}) => {
  // useEffect(() => {
  //   const observer = new ResizeObserver((entries) => {
  //     for (let entry of entries) {
  //       const width = entry.contentRect.width;

  //       // Scale logic: font size = width / 20, clamp it
  //       const newFontSize = Math.min(Math.min(width / 20)); // min 12px, max 36px
  //       setFontSize(newFontSize);
  //     }
  //   });

  //   if (containerRef.current) {
  //     observer.observe(containerRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, []);
  return (
    <>
      <div
        className="p-0 m-0 position-relative w-100"
        style={{
          // aspectRatio: "3/4",
          height: "100%",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        <div className="w-100 h-100 bg-image">
          <img
            src={post?.images[0]} // 400px for mobile-friendly width
            loading="lazy"
            style={{ objectFit: "contain", ...style }}
          />
        </div>
      </div>
    </>
  );
};
