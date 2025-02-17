import React, { useState, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBackground from "../../../assets/images/hall2.png";
import SuperSearchBar from "./SuperSearchBar";

const actionText = [
  "Empowering Cleaners & Clients",
  
  "Streamlining Your Business",
  "We Make Cleaning Make Sense",
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const advancedHeadlineVariants = [
  {
    initial: { opacity: 0, y: 40 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -40,
      transition: { duration: 0.6, ease: "easeIn" },
    },
  },
  {
    initial: { opacity: 0, scale: 0.5 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.6, ease: "easeIn" },
    },
  },
  {
    initial: { opacity: 0, rotate: -10 },
    animate: {
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      rotate: 10,
      transition: { duration: 0.6, ease: "easeIn" },
    },
  },
  {
    initial: { opacity: 0, x: -100 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.6, ease: "easeIn" },
    },
  },
];

const HeroSection: React.FC = () => {
  // ============ State ============
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // ============ Animated Headline ============
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % actionText.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const variantIndex = currentIndex % advancedHeadlineVariants.length;

  // ============ Handlers ============
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement search logic here (API calls, filtering, navigation, etc.)
    console.log("Advanced Search:", { searchTerm, location, category });
  };

  // ============ Layout & Structure ============
  return (
    <section className="relative w-full min-h-[80vh] text-white font-sans flex flex-col">
     

      {/* ======= Hero Background & Overlay ======= */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

      {/* ======= Header ======= */}
      <header className="relative z-20 flex items-center justify-between w-full px-4 md:px-10 lg:px-20">
        <Link
          to="/"
          className="text-lg md:text-xl font-black tracking-wider poppins-black"
        >
          
        </Link>
        <div className="flex items-center space-x-2">
          <AiOutlineUser className="text-2xl" />
          <Link
            to="/login"
            className="uppercase text-sm tracking-wider font-semibold"
          >
            My Account
          </Link>
        </div>
      </header>

      {/* ======= Hero Content ======= */}
      <motion.div
        className="relative z-10 container mx-auto px-6 md:px-12 lg:px-24 flex-grow flex flex-col  items-start pt-40 placeholder-fuchsia-300 text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <AnimatePresence mode="wait">
          <motion.h1
            key={actionText[currentIndex]}
            className="text-4xl md:text-5xl font-bold leading-tight  max-w-2xl poppins-black"
            variants={advancedHeadlineVariants[variantIndex]}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {actionText[currentIndex]}
          </motion.h1>
        </AnimatePresence>

        {/* ============ Advanced Search ============ */}
      
          <SuperSearchBar
            onResults={(data) => {
              
            }}
          />

        {/* ============ Supporting Text & Link ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mt-8">
          <motion.p
            className="text-base md:text-lg font-light poppins-thin-italic"
            variants={itemVariants}
          >
            We understand that a clean space is more than just a tidy appearance.
            It’s about creating a healthy and comfortable environment where you can
            truly relax and thrive. 
          </motion.p>

          <motion.div
            className="flex items-center md:justify-end mt-4 md:mt-0"
            variants={itemVariants}
          >
            <Link
              to="/marketplace"
              className="inline-flex items-center bg-amber-400 text-gray-800 font-semibold px-8 py-5 rounded shadow-md hover:bg-yellow-500 transition-transform transform hover:scale-105"
            >
              Explore MarketPlace →
            </Link>
          </motion.div>
        </div>
      </motion.div>

    
    </section>
  );
};

export default HeroSection;
