import { Outlet } from "react-router-dom";
import { Navbar } from "../components/commons/navbar";

export const LoginLayout = () => {
  return (
    <>
      <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default LoginLayout;
