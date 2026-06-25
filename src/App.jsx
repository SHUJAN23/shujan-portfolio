import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "./components/layout/Layout";
import Loader from "./components/common/Loader";

// Lazy-loaded pages for performance
const Home = lazy(() => import("./pages/Home"));
const Games = lazy(() => import("./pages/Games"));
const Models = lazy(() => import("./pages/Models"));
const About = lazy(() => import("./pages/About"));

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Loader message="Loading" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/models" element={<Models />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
