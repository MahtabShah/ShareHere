export const Loading = ({ clr = "primary", dm }) => {
  return (
    <>
      <div
        className={`spinner-border text-${clr}`}
        role="status"
        style={{ height: dm || "20px", width: dm || "20px" }}
      >
        <span className="sr-only"></span>
      </div>
    </>
  );
};
