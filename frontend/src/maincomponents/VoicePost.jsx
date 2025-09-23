import web_img from "/src/assets/Screenshot 2025-07-01 130410.png";
import post_img1 from "/src/assets/Screenshot 2025-07-01 185041.png";
import post_img2 from "/src/assets/Screenshot 2025-07-01 185137.png";
import { FaArrowRight } from "react-icons/fa";

import { useQuote } from "../context/QueotrContext";
import { useState } from "react";

const VoicePost = () => {
  const { sm_break_point } = useQuote();
  const [video, setVideo] = useState(null);
  const handleVideo = (e) => {
    setVideo(e.target.value);
    console.log(e.target.value);
  };
  return (
    <div className="p-2 justify-content-center">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, illo
        nesciunt libero earum repellendus quisquam sequi repudiandae sunt nisi
        sint repellat, ut, perferendis distinctio fuga eaque. Odio aperiam ea
        placeat.
      </p>

      <input type="file" accept="video/*" onChange={handleVideo} />
      <img
        src={video}
        alt=""
        style={{ width: "200px", height: "200px", border: "1px solid red" }}
      />
      <video
        src={"C:/Users/mahta/OneDrive/Pictures/Camera imports/2023-11-03"}
        style={{ width: "200px", height: "200px", border: "1px solid red" }}
      ></video>
    </div>
  );
};

export default VoicePost;
