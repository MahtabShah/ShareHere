import { useState } from "react";

const PreImages = (img, idx) => {
  const [selected_img, setSelected_img] = useState(null);
  const [selected_indx, setSelected_indx] = useState(false);

  console.log(img);
  const GetSelected = (img, idx) => {
    setSelected_img(img);
    setSelected_indx(!selected_indx);
  };
  return (
    <div key={idx} className="">
      <img
        src={img.img}
        alt=""
        className="h-100 w-100"
        style={{
          aspectRatio: "17/14",
          border: `${selected_indx ? "2px solid #0d0" : "2px solid #f9f8fa"}`,
        }}
        onClick={() => {
          GetSelected(img, idx);
        }}
      />
    </div>
  );
};

export default PreImages;
