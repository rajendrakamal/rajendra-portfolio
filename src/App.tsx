import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";

// Code-split the blog routes: react-markdown + remark-gfm are only needed
// there, and most visitors (recruiters landing on the portfolio) never hit
// them — lazy-loading keeps that weight out of the home page's bundle.
const BlogIndexPage = lazy(() =>
  import("./pages/BlogIndexPage").then((m) => ({ default: m.BlogIndexPage })),
);
const BlogPostPage = lazy(() =>
  import("./pages/BlogPostPage").then((m) => ({ default: m.BlogPostPage })),
);

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/blog"
            element={
              <Suspense fallback={null}>
                <BlogIndexPage />
              </Suspense>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <Suspense fallback={null}>
                <BlogPostPage />
              </Suspense>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
