import { useContext } from "react";
import { AuthContext } from "../../authContext";
import styles from "./home.module.css";

export default function Home() {
  const { user } = useContext(AuthContext);
  return (
    <div className={styles.home}>
      <div>
        Welcome to the application
        <span className={styles.username}>{` ${user?.name || 'Guest'}`}</span>.
      </div>
    </div>
  );
}
