import { Fragment, useEffect, useState } from "react";
import { useQuote } from "../context/QueotrContext";
import { UserRing, FollowBtn } from "./EachPost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "../context/Theme";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { random } from "lodash";
const SuggetionSlip = () => {
  const { all_user, admin_user, lgbreakPoint } = useQuote();
  const { text_clrH, text_clrL, text_clrM, mainbg } = useTheme();

  return (
    <>
      {lgbreakPoint && (
        <div
          className="user-update"
          style={{ position: "sticky", top: "0", color: text_clrM }}
        >
          {admin_user && (
            <div className="d-flex flex-column gap-2">
              <div
                key={admin_user?.username}
                className="d-flex align-items-center gap-2 mb-2 rounded"
              >
                <UserRing user={admin_user} dm={52} />
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
                          <UserRing user={user} style={{}} dm={52} />
                          <div>
                            <FollowBtn
                              user={user}
                              cls={
                                "text-primary rounded-1 border p-1 ps-3 pe-3"
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
  const { all_user, sm_break_point, mobile_break_point, admin_user } =
    useQuote();
  const rn = Math.floor(Math.random() * (all_user.length - 5) || 0);
  const some_user = all_user
    .filter((u) => !u?.followers?.includes(admin_user?.id))
    .slice(rn, rn + 5);

  console.log(all_user, admin_user?._id);

  return (
    <>
      {some_user?.map((u, i) => {
        return (
          <Fragment key={`$i-${i}`}>
            <div className="border-end border-start d-flex rounded-4 flex-column position-relative align-items-center ps-4 pe-4  gap-2">
              <div className="p-2" style={{ width: "120px", height: "120px" }}>
                <a href={`/api/user/${u?._id}`}>
                  <img
                    src={u.profile_pic}
                    alt=""
                    className="h-100 w-100"
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                  />
                </a>
              </div>
              <small className="d-flex fle-column gap-3 justify-content-center w-100 text-light">
                <small>@{u.username.slice(0, 18)}</small>
                <FollowBtn
                  user={u}
                  cls={"text-primary small "}
                  style={{ cursor: "pointer" }}
                />
              </small>
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

export default SuggetionSlip;
