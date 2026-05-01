import { Outlet } from "react-router-dom";
import TitleBar from "./TitleBar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-200">
      <TitleBar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
