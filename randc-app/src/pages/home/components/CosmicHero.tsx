import React from 'react';
import CosmicHeroImg from '../../../assets/images/stock8.png';
// Replace the path below with the actual import for your construction image
import constructionHeroImg from "../../../assets/images/stock8.png";
import { AiFillHome } from "react-icons/ai";

interface ContactHeroProps {
  title?: string;
  subtitle?: string;
  btnText?: string;
  imageSrc?: string;
}

const ContactHero: React.FC<ContactHeroProps> = ({
  title = "Contact R&C and Let’s Build Together",
  subtitle = "We’re here to help you with your next project. Get in touch with our team to discuss your ideas, goals, and how we can help you achieve them.",
  btnText = "Contact Us →",
  imageSrc = constructionHeroImg,
}) => {
  return (
    <section className="relative w-full bg-[#101820] text-white overflow-hidden">
      {/* Wave Shape Divider (Top) - optional */}
      <div className="absolute top-0 w-full rotate-180 overflow-hidden leading-[0]">
        <svg
          className="block w-[200%] h-32 md:h-40 lg:h-56 ml-[-50%]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#101820"
            fillOpacity="1"
            d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,165.3C672,149,768,139,864,160C960,181,1056,235,1152,250.7C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 gap-8">
        {/* Left Side: Text & Icon */}
        <div className="flex-1 order-2 md:order-1">
          {/* Small label with icon */}
          <div className="flex items-center space-x-2 mb-4 text-amber-400 uppercase tracking-wider">
            <AiFillHome className="text-xl" />
            <span className="text-sm font-semibold">Contact Us</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mb-8">
            {subtitle}
          </p>
          <button
            className="inline-block bg-amber-400 hover:bg-amber-500 text-gray-800 font-semibold text-sm md:text-base py-3 px-6 rounded-md shadow-md transition-transform transform hover:-translate-y-0.5 hover:scale-105"
          >
            {btnText}
          </button>
        </div>

        {/* Right Side: Image */}
        <div className="flex-1 order-1 md:order-2 w-full h-auto">
          <img
            src={imageSrc}
            alt="Contact Hero"
            className="w-full h-auto object-cover rounded-md shadow-lg"
          />
        </div>
      </div>

      {/* Wave Shape Divider (Bottom) */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff"
            fillOpacity="1"
            d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,165.3C672,149,768,139,864,160C960,181,1056,235,1152,250.7C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default ContactHero;

