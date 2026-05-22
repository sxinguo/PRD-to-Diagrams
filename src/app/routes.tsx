import { createBrowserRouter } from "react-router";
import { Root, EditorLayout } from "./Root";
import { Home } from "./pages/Home";
import { Pricing } from "./pages/Pricing";
import { EditorPage } from "./pages/Editor";
import { RefundPolicyPage } from "./pages/RefundPolicy";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicy";
import { FAQPage } from "./pages/FAQPage";
import HandleGenerateDebug from "./pages/HandleGenerateDebug";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "pricing", Component: Pricing },
      { path: "refund-policy", Component: RefundPolicyPage },
      { path: "privacy-policy", Component: PrivacyPolicyPage },
      { path: "faq", Component: FAQPage },
    ],
  },
  {
    path: "/editor",
    Component: EditorLayout,
    children: [
      { index: true, Component: EditorPage },
    ],
  },
  {
    path: "/debug",
    Component: HandleGenerateDebug,
  },
]);