export const Loading = ({ clr = "primary", dm }) => {
  return (
    <>
      <div
        class={`spinner-border text-${clr}`}
        role="status"
        style={{ height: dm || "20px", width: dm || "20px" }}
      >
        <span class="sr-only"></span>
      </div>
    </>
  );
};
