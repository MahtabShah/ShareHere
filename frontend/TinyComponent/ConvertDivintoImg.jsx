import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import axios from "axios";

const TextToImage = ({ captureRef }) => {
  const divRef = useRef();

  const handleCapture = async () => {
    const canvas = await html2canvas(captureRef?.current);
    const dataURL = canvas.toDataURL("image/png");

    // Optionally upload to Cloudinary
    const formData = new FormData();
    formData.append("file", dataURL);
    formData.append("upload_preset", "page_Image"); // Replace this
    formData.append("cloud_name", "dft5cl5ra"); // Replace this

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dft5cl5ra/image/upload",
      formData
    );

    console.log("Uploaded URL:", res.data.secure_url);
    alert("Image uploaded at: " + res.data.secure_url);
  };

  return (
    <div className="border bg-dark text-light" ref={divRef}>
      Hi Evryone Q!!
      <span
        onClick={handleCapture}
        className="mt-4 btn btn-outline-danger px-4 py-2 rounded"
      >
        Convert to Image
      </span>
    </div>
  );
};

export default TextToImage;
