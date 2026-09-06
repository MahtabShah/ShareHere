// utils/exportImage.js - Using html2canvas (Alternative)

import html2canvas from "html2canvas";
import axios from "axios";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

/**
 * Export element using html2canvas - EXACT COPY
 * This captures the element exactly as rendered
 */
export const exportElementToFile = async (element, options = {}) => {
  if (!element) {
    throw new Error("Element not found");
  }

  const {
    backgroundColor = "#940d6d",
    width = 300,
    height = 300,
    scale = 4, // Higher = better quality
  } = options;

  try {
    console.log("📸 Exporting with html2canvas...");

    if (element.offsetWidth === 0 || element.offsetHeight === 0) {
      throw new Error("Element has zero dimensions");
    }

    // Wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture with html2canvas - EXACT COPY
    const canvas = await html2canvas(element, {
      scale: scale || 4,
      backgroundColor: backgroundColor,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: width,
      height: height,
      // This ensures exact copy
      onclone: (clonedDoc, clonedElement) => {
        // No modifications - keep as-is
        return clonedElement;
      },
    });

    if (!canvas) {
      throw new Error("Canvas creation failed");
    }

    // Convert canvas to blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png", 1.0);
    });

    if (!blob || blob.size < 100) {
      throw new Error("Invalid blob created");
    }

    const file = new File([blob], `export_${Date.now()}.png`, {
      type: "image/png",
    });

    console.log("✅ File created:", file.size, "bytes");
    return file;
  } catch (error) {
    console.error("❌ Export error:", error);
    throw new Error("Export failed: " + error.message);
  }
};

/**
 * Upload file to Cloudinary
 */
export const uploadToCloudinary = async (file, options = {}) => {
  const {
    cloudName = CLOUDINARY_CLOUD_NAME,
    uploadPreset = "page_Image",
    onProgress = null,
  } = options;

  if (!file) {
    throw new Error("No file provided");
  }

  try {
    console.log("📤 Uploading to Cloudinary...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percent);
          }
        },
      },
    );

    console.log("✅ Upload successful:", response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error("❌ Upload error:", error);
    throw new Error("Upload failed: " + error.message);
  }
};

/**
 * Main function: Export and upload
 */
export const exportAndUpload = async (element, options = {}) => {
  const {
    backgroundColor = "#940d6d",
    width = 300,
    height = 300,
    scale = 2,
    onProgress = null,
    cloudName = CLOUDINARY_CLOUD_NAME,
    uploadPreset = "page_Image",
    retries = 3,
  } = options;

  try {
    console.log("🚀 Starting export and upload...");

    let file = null;
    let lastError = null;

    // Detect device
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    console.log("📱 Device:", isMobile ? "Mobile" : "Desktop");

    // Use appropriate scale for mobile
    const scaleValue = isMobile ? 1.5 : scale;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`📤 Export attempt ${attempt}/${retries}...`);

        file = await exportElementToFile(element, {
          backgroundColor,
          width,
          height,
          scale: scaleValue,
        });

        if (file && file.size > 100) {
          break;
        }
      } catch (error) {
        lastError = error;
        console.log(`⚠️ Attempt ${attempt} failed:`, error.message);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    if (!file || file.size < 100) {
      throw new Error(
        lastError?.message || "Failed to create image after multiple attempts",
      );
    }

    console.log("✅ File ready:", file.size, "bytes");

    const url = await uploadToCloudinary(file, {
      cloudName,
      uploadPreset,
      onProgress,
    });

    return url;
  } catch (error) {
    console.error("❌ Export and upload failed:", error);
    throw new Error("Failed to export and upload: " + error.message);
  }
};

/**
 * Simple function: Get URL directly
 */
export const getImageUrl = async (elementRef, options = {}) => {
  const {
    backgroundColor = "#940d6d",
    onProgress = null,
    retries = 3,
  } = options;

  if (!elementRef || !elementRef.current) {
    throw new Error("Element reference is invalid");
  }

  const d = elementRef.current.getBoundingClientRect();

  return await exportAndUpload(elementRef.current, {
    backgroundColor,
    scale: 10,
    width: d.width || 300,
    height: d.height || 300,
    onProgress,
    retries,
  });
};
