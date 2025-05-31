import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductOrderPage from "./ProductOrderPage";
import axios from "axios";
import { updatePostSpecificInformation } from "../../../Server/utils/api";
import { useNavigate, useParams } from "react-router-dom";
import GalleryWayItems from "./GaleryType";

const UserProfile = ({ setUser, fetchUser, allusers }) => {
  const [OnEditMode, setOnEditMode] = useState(false);
  const nevigate = useNavigate();
  const { userId } = useParams();
  // setUser(User);
  const User = allusers?.find((u) => u._id === userId);
  setUser(User);
  // fetchUser();
  console.log("UserProfile component User:", User, allusers, userId);

  const onEditMode = () => {
    // setOnEditMode(!OnEditMode)
    // nevigate(`/user/EditProfile/${User.id}`);
  };

  const HandelFollower = async () => {
    // try {
    //   await axios
    //     .put("http://localhost:3000/api/followed", {
    //       userId: User?.id,
    //     })
    //     .then((res) => {
    //       console.log("follower UserProfile at line: 31 component", res.data);
    //       setUser(res.data);
    //       fetchUser();
    //     });
    // } catch (error) {
    //   console.error("❌ Error updating follower:", error);
    // }
  };

  return (
    <div
      className="d-flex flex-column bg-black text-white"
      style={{ maxWidth: "881px", margin: "auto" }}
    >
      <div
        className="photoHeader w-100 position-relative"
        style={{ height: "calc(120px + 20dvw)", maxHeight: "400px" }}
      >
        <div
          className="text-center position-absolute ps-3"
          style={{ bottom: "calc(-50px)" }}
        >
          <img
            src={User?.profil_pic}
            className="rounded-circle"
            alt="Profile"
            width="100"
            height="100"
          />
        </div>
        <img
          src={User?.cover_pic}
          alt="cover"
          className="w-100 h-100"
          style={{ objectFit: "cover", maxHeight: "400px" }}
        />
      </div>

      <div className="text-end pe-3 pt-3" style={{ height: "60px" }}>
        <button
          className="btn btn-outline-light btn-sm me-2"
          onClick={onEditMode}
        >
          Edit Profile
        </button>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => {
            HandelFollower();
          }}
        >
          Follow
        </button>
      </div>

      <div className="ps-3 d-flex justify-content-between">
        <div>
          <h4 className="mt-3">{User?.full_name}</h4>
          <p className="mb-1">{User?.channel_name}</p>
          <p className="small">{User?.bio}</p>
          <p className="small">{User?.about_user}</p>
        </div>
        <div className="d-flex gap-3 ps-3 pe-3 mt-3">
          <span className="text-center">
            <span>Followers</span>
            <h5>{User?.followers?.length || 0}</h5>
          </span>
          <span className="text-center">
            <span>Following</span>
            <h5>{User?.following?.length || 0}</h5>
          </span>
        </div>
      </div>

      <hr className="bg-light" />
      <h4 className="ps-3">Explore My Shop</h4>

      <div
        className="d-grid gap-4 p-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px , 1fr))" }}
      >
        <GalleryWayItems user={User} />
      </div>

      <div className="p-3">
        {User?.posts?.map((post, i) => (
          <ProductOrderPage
            setUser={setUser}
            key={`products${i}`}
            post={post}
            User={User}
            fetchUser={fetchUser}
          />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
