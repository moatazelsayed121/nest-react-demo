import { useContext } from "react";
import { AuthContext } from "./authContext";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, SignIn, SignUp, Layout } from "./pages";

function App() {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
