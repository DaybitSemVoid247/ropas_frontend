import { Outlet } from "react-router-dom";

export const LoginLayout = () => {
  return (
    <>
      <div>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default LoginLayout;
