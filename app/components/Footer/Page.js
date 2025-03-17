import React from "react";
import { useUserAuth } from "@/app/utils/auth-context";


const Footer = () => {
  const { user } = useUserAuth();

  return (
<footer id="footer" className="bg-gray-800 text-white py-8">
<div id="footer-content" className="container mx-auto px-6 flex flex-col items-center">
  <p id="footer-copy" className="text-center mb-4">&copy; {new Date().getFullYear()} EchoDeals. All Rights Reserved.</p>

  <nav id="footer-nav" className="flex space-x-8">
    <ul id="footer-links" className="flex space-x-4">
      <li id="about-link" className="text-white hover:text-gray-400"><a href="/about">About</a></li>
      <li id="contact-link" className="text-white hover:text-gray-400"><a href="/contact">Contact</a></li>
      <li id="terms-link" className="text-white hover:text-gray-400"><a href="/terms">Terms of Service</a></li>
      <li id="privacy-link" className="text-white hover:text-gray-400"><a href="/privacy">Privacy Policy</a></li>
    </ul>
  </nav>
</div>
</footer>


  );
};

export default Footer;
