import { useNavigate } from "react-router";
import { useContext, useLayoutEffect, useState } from "react";
import { AuthContext } from "../../authContext";
import styles from "./header.module.css";
import axionsInstance from "../../network/axiosInstance";

export default function Header() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout, setCurrentUser } = useContext(AuthContext);

  useLayoutEffect(() => {
    const fetchProfile = async () => {
      try {
        const userReponse = await axionsInstance.get("/auth/profile");
        setCurrentUser(userReponse.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.header}>
      <div
        className={styles.title}
        onClick={() => {
          navigate("/");
        }}
      >
        Demo App
      </div>
      <div className={styles.navigation}>
        {loading ? (
          <div className={styles.spinner} />
        ) : user ? (
          <div className={styles.userNameContainer}>
            <div className={styles.userName}>Hello {user?.name}</div>
            <button
              onClick={() => {
                axionsInstance
                  .post("/auth/logout", {})
                  .then(() => {})
                  .catch((e) => {
                    console.log(e);
                  })
                  .finally(() => {
                    logout();
                    navigate("/");
                  });
              }}
            >
              Log out
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                navigate("/sign-in");
              }}
            >
              Sign in
            </button>
            <button
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
}
