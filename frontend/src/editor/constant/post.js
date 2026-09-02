import { toJpeg } from "html-to-image";
import axios from "axios";

export const getCapture = async () => {
  const editor = document.querySelector(".editor");

  const filter = (editor) => {
    const exclusionClasses = ["caret"];
    return !exclusionClasses.some((classname) =>
      editor.classList?.contains(classname)
    );
  };

  try {
    const dataUrl = await toJpeg(editor, {
      pixelRatio: 7, // Higher quality
      quality: 1,
      filter: filter,
    });

    return dataUrl;
  } catch (error) {
    console.error("Error exporting image:", error);
  }
};

export const getImageUrl = async () => {
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const dataURL = await getCapture();

  const formData = new FormData();
  formData.append("file", dataURL);
  formData.append("upload_preset", "page_Image");
  formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );

  console.log("Uploaded URL:", res.data.secure_url);

  return res.data.secure_url;
};

export const getPostObject = async () => {
  const url = await getImageUrl();

  const obj = {
    ready_url: url,
    text: "checing",
    mode: "Public",
    category: "All",
  };

  return obj;
};
