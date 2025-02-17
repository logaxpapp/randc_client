import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

// Your existing imports
import SubscriptionSection from "./components/SubscriptionSection";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import MapSection from "./components/MapSection";
import SearchBarDropdown from "../../components/SearchBarDropdown";
import TeamSection from "./components/TeamSection";
import Recommended from "./components/Recommended";
import CosmicHero from "./components/CosmicHero";
import LocationPrompt from "./components/LocationPrompt";
import HomePages from "./components/Category";
import FeaturesGrid from "./components/FeaturesGrid";
import CleaningSaaSPerformanceSection from "./components/CleaningSaaSPerformanceSection";
import WhatPeopleSay from "./components/WhatPeopleSay";

function HomePage() {
  // State to handle "Back to Top" button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after 300px of scroll
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="jost text-gray-900 relative scroll-smooth">
      <LocationPrompt />
      {/* <div className="hidden md:block">
        <SearchBarDropdown />
      </div> */}

      {/* Actual page sections */}
      <HeroSection />
      <Recommended />
      <TeamSection />
      <FeaturesGrid />
      <MapSection />
      <HomePages />
      <CosmicHero />
      <FeaturesSection />
      {/* <SubscriptionSection /> */}
      <CleaningSaaSPerformanceSection />
     <WhatPeopleSay />

      {/* =========== BACK TO TOP BUTTON =========== */}
      <button
        className={`fixed bottom-6 right-6 z-[9999] bg-lime-400 text-gray-800 p-3 rounded-full shadow-lg hover:bg-lime-500 transition-opacity duration-300 ${
          showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={scrollToTop}
        aria-label="Scroll back to top"
      >
        <FaArrowUp className="text-xl" />
      </button>
    </div>
  );
}

export default HomePage;