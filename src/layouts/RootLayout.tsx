import { Outlet } from "react-router-dom";
import { Navbar } from "../components/commons/navbar";
import { Footer } from "../components/commons/Footer";

export const RootLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <Outlet />

      <Footer />
    </div>
  );
};
