import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#000000]">
      <Navbar />
      {/* pt-16 = 64px — clears the fixed navbar (h-16) on every page */}
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
