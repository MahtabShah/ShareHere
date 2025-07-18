import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuote } from "../context/QueotrContext";
import axios from "axios";
import { Loading } from "../../TinyComponent/LazyLoading";
import { useTheme } from "../context/Theme";
const API = import.meta.env.VITE_API_URL;

const token = localStorage.getItem("token");

const EditUserProfile = () => {
  const { id } = useParams();
  const { all_user } = useQuote();
  const user = all_user?.find((u) => u?._id === id);
  const nevigate = useNavigate();
  const [name, setName] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [loading, setLoading] = useState(false);
  const [profile_pic, setProfile_pic] = useState(user?.profile_pic);
  const [cover_pic, setCover_pic] = useState(user?.cover_pic);

  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(res.data.name || "");
      setBio(res.data.bio || "");
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedProfileFile(file);
      setProfile_pic(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      setCover_pic(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedProfileUrl = profile_pic;
      let uploadedCoverUrl = cover_pic;

      // 1. Upload profile picture to Cloudinary if selected
      if (selectedProfileFile) {
        const profileData = new FormData();
        profileData.append("file", selectedProfileFile);
        profileData.append("upload_preset", "page_Image");

        const res1 = await axios.post(
          "https://api.cloudinary.com/v1_1/dft5cl5ra/image/upload",
          profileData
        );
        uploadedProfileUrl = res1.data.secure_url;
      }

      // 2. Upload cover picture to Cloudinary if selected
      if (selectedCoverFile) {
        const coverData = new FormData();
        coverData.append("file", selectedCoverFile);
        coverData.append("upload_preset", "page_Image");

        const res2 = await axios.post(
          "https://api.cloudinary.com/v1_1/dft5cl5ra/image/upload",
          coverData
        );
        uploadedCoverUrl = res2.data.secure_url;
      }

      // 3. Now send all data to your backend
      const payload = {
        name,
        bio,
        profile_pic: uploadedProfileUrl,
        cover_pic: uploadedCoverUrl,
      };

      const res = await axios.put(`${API}/api/crud/update_user`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Profile updated!");
      nevigate(`/api/user/${id}`);
      setProfile_pic(res.data.profile_pic);
      setCover_pic(res.data.cover_pic);
      setLoading(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed!");
    }

    setLoading(false);
  };

  const { text_clrH, text_clrL, text_clrM, mainbg } = useTheme();

  return (
    <section className="mb-5 pb-5">
      <div
        className="photoHeader w-100 position-relative border"
        style={{ height: "calc(140px + 16dvw)", maxHeight: "300px" }}
      >
        <div className="position-absolute w-100 h-100">
          <img
            src={cover_pic}
            alt="cover"
            className="w-100 h-100 border"
            style={{ objectFit: "cover" }}
          />
          <label
            htmlFor="cover_pic"
            className="position-absolute top-0 end-0 m-2 bg-white p-1 border"
            style={{ cursor: "pointer" }}
          >
            Edit Cover
          </label>
          <input
            type="file"
            id="cover_pic"
            accept="image/*"
            className="d-none"
            onChange={handleCoverChange}
          />
        </div>

        <div
          className="text-center position-absolute ps-3"
          style={{ bottom: "calc(-80px)" }}
        >
          <img
            src={profile_pic}
            className="rounded-circle border"
            alt="Profile"
            width="100"
            height="100"
            style={{ objectFit: "cover", background: user?.bg_clr }}
          />
          <label
            htmlFor="profile_pic"
            className="d-block mt-1 bg-light px-2 border"
            style={{ cursor: "pointer" }}
          >
            Edit DP
          </label>
          <input
            type="file"
            id="profile_pic"
            accept="image/*"
            className="d-none"
            onChange={handleProfileChange}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="needs-validation mt-5 pt-5">
        <div
          className="d-flex flex-column p-2 gap-3"
          // style={{ border: "1px solid #555" }}
        >
          <div
            className="d-flex align-items-center p-0 m-0 ps-2"
            style={{ border: "1px solid #555" }}
          >
            <div
              className="pe-2 form-lable"
              style={{ borderRight: "1px solid #555", color: text_clrM }}
            >
              Name
            </div>
            <input
              type="text"
              className="form-control rounded-0 w-100 border-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              spellCheck={false}
              style={{ background: mainbg, color: text_clrM }}
              // placeholder={user?.username}
            />
          </div>

          <div className="d-flex flex-column ps-0">
            <div className="p-2 pt-2 pb-0 pb-2" style={{ color: text_clrM }}>
              Bio
            </div>
            <textarea
              rows={4}
              className="w-100 h-100 p-2"
              value={bio || user?.bio}
              onChange={(e) => setBio(e.target.value)}
              required
              spellCheck={false}
              style={{
                background: mainbg,
                color: text_clrM,
                border: `1px solid ${text_clrL}`,
              }}
            />
          </div>

          <button
            className="btn btn-outline-danger rounded-0 mt-3 pe-3 ps-3"
            type="submit"
          >
            {loading ? <Loading dm={20} clr="text-danger" /> : "Submit"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditUserProfile;
