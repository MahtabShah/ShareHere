import { useEffect, useState } from "react";
import { useQuote } from "../context/QueotrContext";
import { UserRing, FollowBtn } from "./EachPost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { random } from "lodash";
const SuggetionSlip = () => {
  const { all_user, admin_user, lgbreakPoint } = useQuote();
  return (
    <>
      {lgbreakPoint && (
        <div className="user-update" style={{ position: "sticky", top: "0" }}>
          {admin_user && (
            <div className="d-flex flex-column gap-2">
              <div
                key={admin_user?.username}
                className="d-flex align-items-center gap-2 mb-2 rounded"
              >
                <UserRing user={admin_user} style={{}} />
                <a href={`/api/user/${admin_user?._id}`} className="small">
                  see profile
                </a>
              </div>
            </div>
          )}

          <p className="m-0 small">Suggest For You</p>

          {all_user?.length > 0 && (
            <div className="d-flex flex-column gap-2 mt-2 ">
              <div className="d-flex flex-column gap-2">
                {all_user
                  .slice(-4)
                  .reverse()
                  .map(
                    (user) =>
                      user?._id != admin_user?._id && (
                        <div
                          key={user.username}
                          className="d-flex align-items-center gap-4 pb-3 rounded"
                        >
                          <UserRing user={user} style={{}} />
                          <div>
                            <FollowBtn
                              user={user}
                              cls={
                                "text-primary rounded-1 border p-1 ps-2 pe-2"
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>
                      )
                  )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export const SuggetionSlipInPost = () => {
  const { all_user, sm_break_point } = useQuote();
  const rn = Math.random() * (all_user.length - 5) || 0;
  const some_user = all_user.slice(rn, rn + 5);

  return (
    <>
      <section
        className="d-flex gap-4 none-scroller overflow-x-auto"
        style={{
          // border: "2px solid red",
          width: `${sm_break_point ? "calc(100dvw - 104px)" : "calc(100%)"}`,
        }}
      >
        {some_user?.map((u, i) => {
          return (
            <>
              <div className="border d-flex flex-column position-relative align-items-center ps-4 pe-4  gap-3 p-2">
                <div
                  className="d-flex rounded-4 align-items-center position-absolute text-primary justify-content-center"
                  style={{
                    width: "24px",
                    height: "24px",
                    top: 0,
                    right: 0,
                    cursor: "pointer",
                  }}
                  title="follow"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <FollowBtn
                    user={u}
                    cls={"text-primary small position-absolute"}
                    style={{ opacity: 0 }}
                  />
                </div>
                <div className=" p" style={{ width: "120px", height: "120px" }}>
                  <a href={`/api/user/${u?._id}`}>
                    <img
                      src={u.profile_pic}
                      alt=""
                      className="h-100 w-100"
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                    />
                  </a>
                </div>
                <small className="d-flex fle-column gap-2 justify-content-center w-100">
                  <small>@{u.username.slice(0, 18)}</small>
                </small>
              </div>
            </>
          );
        })}
      </section>
    </>
  );
};

export default SuggetionSlip;
