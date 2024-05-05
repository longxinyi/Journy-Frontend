import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  return (
    <div style={{ background: "linear-gradient(270deg, #196f5d, #f8f0ca)" }}>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
      <NavBar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
