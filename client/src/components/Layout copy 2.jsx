import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen w-auto bg-gray-50">
      <Navbar />
      <main className="max-w-auto mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
