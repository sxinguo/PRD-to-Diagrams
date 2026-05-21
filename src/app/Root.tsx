import { Outlet } from "react-router";
import { LangProvider } from "./i18n";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export function Root() {
  return (
    <LangProvider>
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f7ff",
          color: "#1e0a3c",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </LangProvider>
  );
}

export function EditorLayout() {
  return (
    <LangProvider>
      <div
        style={{
          height: "100vh",
          background: "#f8f7ff",
          color: "#1e0a3c",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          overflow: "hidden",
        }}
      >
        <Outlet />
      </div>
    </LangProvider>
  );
}
