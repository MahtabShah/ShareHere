import { Fragment, useEffect, useState } from "react";
import { useQuote } from "../context/QueotrContext";
import { UserRing, FollowBtn } from "./EachPost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "../context/Theme";

const SuggetionSlip = () => {
  const { all_user, admin_user, lgbreakPoint } = useQuote();
  const { text_clrH, text_clrL, text_clrM, mainbg, bg1, bg2 } = useTheme();

  return (
    <>
      {lgbreakPoint && (
        <div
          className="user-update"
          style={{ position: "sticky", top: "96px", color: text_clrM }}
        >
          {admin_user && (
            <div className="d-flex flex-column gap-2">
              <div
                key={admin_user?.username}
                className="d-flex align-items-center gap-2 mb-2 rounded"
              >
                <UserRing user={admin_user} dm={50} />
                <a href={`/api/user/${admin_user?._id}`} className="small">
                  see profile
                </a>
              </div>
            </div>
          )}

          <p className="my-3 pb-2 small">Suggest For You</p>

          {all_user?.length > 0 && (
            <div className="d-flex flex-column gap-3 mt-2">
              <div className="d-flex flex-column gap-2">
                {all_user
                  .slice(-4)
                  .reverse()
                  .map(
                    (user) =>
                      user?._id != admin_user?._id && (
                        <div
                          key={user.username}
                          className="d-flex align-items-center gap-5 pb-3 rounded"
                        >
                          <UserRing user={user} style={{}} dm={52} />
                          <div>
                            <FollowBtn
                              id={user?._id}
                              cls={
                                "btn btn-outline-primary text-center rounded-1 p-1 ps-3 pe-3"
                              }
                              style={{
                                cursor: "pointer",
                                width: "104px",
                              }}
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
  const { all_user, admin_user, token } = useQuote();
  const [some_user, setsome_user] = useState(null);
  const { text_clrH, text_clrL, text_clrM, mainbg, bg1, bg2 } = useTheme();

  useEffect(() => {
    const rn = Math.floor(Math.random() * (all_user.length - 5) || 0);

    const some_u = all_user
      .filter((u) => !u?.followers?.includes(admin_user?._id))
      .slice(rn, rn + 5);

    setsome_user(some_u);
  }, [token]);

  // console.log(all_user, admin_user?._id);

  console.log(some_user);

  return (
    <>
      {some_user?.map((u, i) => {
        return (
          <Fragment key={`$i-${i}`}>
            <div
              className="d-flex rounded-2 flex-column position-relative align-items-center py-3 px-4  gap-2"
              style={{
                border: "1px solid #ccc",
                background: bg1,
                color: text_clrH,
              }}
            >
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
                <small
                  style={{
                    color: text_clrM,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  @{u.username.slice(0, 10)}
                </small>
                <FollowBtn
                  id={u?._id}
                  cls={"text-primary small"}
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
