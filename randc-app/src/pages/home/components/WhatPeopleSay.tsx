import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// import { useSwipeable } from 'react-swipeable'; // if needed

interface Testimonial {
  text: string;
  name: string;
}

const testimonials: Testimonial[] = [
  {
    text: "“R&C has transformed how we manage daily cleaning tasks. Absolutely amazing!”",
    name: "Sarah Collins",
  },
  {
    text: "“I’ve saved hours every week thanks to R&C’s intelligent scheduling features.”",
    name: "James Murphy",
  },
  {
    text: "“Our team has never been more organized—R&C is a total game-changer!”",
    name: "Linda Johnson",
  },
];

const containerVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? -100 : 100,
    opacity: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  }),
};

const WhatPeopleSay: React.FC = () => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const handleNext = () => {
    setDirection(+1);
    setPage((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setPage((prev) => (prev - 1 < 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleDotClick = (index: number) => {
    setDirection(index > page ? +1 : -1);
    setPage(index);
  };

  // Optional: swipe handling
  // const swipeHandlers = useSwipeable({
  //   onSwipedLeft: () => handleNext(),
  //   onSwipedRight: () => handlePrev(),
  //   trackMouse: true,
  // });

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoPlay]);

  const currentTestimonial = testimonials[page];

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          What People Say
        </h2>

        <div className="relative">
          {/* Left Arrow */}
          <motion.button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 focus:outline-none transition duration-300"
            aria-label="Previous testimonial"
            whileTap={{ scale: 0.9 }}
          >
            {/* <Icon or text> */}
          </motion.button>

          {/* Right Arrow */}
          <motion.button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 focus:outline-none transition duration-300"
            aria-label="Next testimonial"
            whileTap={{ scale: 0.9 }}
          >
            {/* <Icon or text> */}
          </motion.button>

          {/* Testimonial card */}
          <div className="w-full text-center overflow-hidden">
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={page}
                custom={direction}
                variants={containerVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="mx-auto text-center p-10 bg-white rounded-lg shadow-lg"
              >
                {/* Bigger, bolder text */}
                <p className="text-5xl md:text-6xl font-light italic text-gray-900 leading-snug">
                  {currentTestimonial.text}
                </p>
                <p className="mt-8 font-bold text-2xl md:text-3xl text-gray-800">
                  — {currentTestimonial.name}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-4 h-4 mx-1 rounded-full focus:outline-none transition duration-300 ${
                index === page
                  ? 'bg-indigo-500'
                  : 'bg-gray-400 hover:bg-indigo-300'
              }`}
              whileTap={{ scale: 0.8 }}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Autoplay toggle */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none transition duration-300"
          >
            {autoPlay ? 'Pause Auto-Play' : 'Resume Auto-Play'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhatPeopleSay;
