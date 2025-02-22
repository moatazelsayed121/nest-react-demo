import { Outlet } from "react-router-dom";
import { Header } from "../components";

export default function Layout() {
  return (
    <div>
      <Header />
      <main style={{ padding: "0 2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
