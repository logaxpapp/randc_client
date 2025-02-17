import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

// Example images
import CatImage1 from '../../../assets/images/stock1.png';
import CatImage2 from '../../../assets/images/stock2.png';
import CatImage3 from '../../../assets/images/stock3.png';
import CatImage4 from '../../../assets/images/stock4.png';
import CatImage5 from '../../../assets/images/stock5.png';
import CatImage6 from '../../../assets/images/stock6.png';
import CatImage7 from '../../../assets/images/stock7.png';
import CatImage8 from '../../../assets/images/stock8.png';
import CatImage9 from '../../../assets/images/stock9.png';
import CatImage10 from '../../../assets/images/image5.png';
import CatImage11 from '../../../assets/images/image6.png';
import CatImage12 from '../../../assets/images/r4.png';

/** Category interface for TypeScript. */
interface Category {
  id: number;
  title: string;
  image: string;
}

/** Our array of categories (12 in this example). */
const CATEGORIES: Category[] = [
  { id: 0, title: 'Skincare Essentials', image: CatImage1 },
  { id: 1, title: 'Makeup Magic', image: CatImage2 },
  { id: 2, title: 'Haircare Haven', image: CatImage3 },
  { id: 3, title: 'Fragrance Collection', image: CatImage4 },
  { id: 4, title: 'Nail Art Designs', image: CatImage5 },
  { id: 5, title: 'Spa & Wellness', image: CatImage6 },
  { id: 6, title: 'Men’s Grooming', image: CatImage7 },
  { id: 7, title: 'Organic Beauty', image: CatImage8 },
  { id: 8, title: 'Luxury Bath', image: CatImage9 },
  { id: 9, title: 'Accessories & Tools', image: CatImage10 },
  { id: 10, title: 'Cosmetic Bags', image: CatImage11 },
  { id: 11, title: 'Beauty Books', image: CatImage12 },
];

/**
 * Array of gradients used for the overlay background
 * whenever a card is hovered (either physically or randomly).
 */
const OVERLAY_COLORS = [
  'bg-gradient-to-br from-pink-400 via-pink-500 to-red-500',
  'bg-gradient-to-br from-green-400 via-green-500 to-lime-500',
  'bg-gradient-to-br from-indigo-400 via-blue-500 to-purple-500',
  'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500',
  'bg-gradient-to-br from-fuchsia-400 via-purple-600 to-pink-600',
  'bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500',
];

/** Helper to pick a random item from an array. */
function getRandomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Categories() {
  // Which card is hovered (null = none).
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Store a random overlay color for each card while hovered.
  const [hoverColors, setHoverColors] = useState<{ [key: number]: string }>({});

  /** 
   * Automatically hover a random card every 3 seconds. 
   * Then unhover after 1.5 seconds.
   */
  useEffect(() => {
    const simulateHover = () => {
      const randomIndex = Math.floor(Math.random() * CATEGORIES.length);
      const randomColor = getRandomFromArray(OVERLAY_COLORS);
      setHoverColors((prev) => ({ ...prev, [randomIndex]: randomColor }));
      setHoveredIndex(randomIndex);

      setTimeout(() => {
        setHoveredIndex(null);
      }, 1500);
    };

    const intervalId = setInterval(simulateHover, 3000);
    return () => clearInterval(intervalId);
  }, []);

  /** Real mouse hover: pick random color for that card's overlay. */
  const handleMouseEnter = (cardId: number) => {
    const randomColor = getRandomFromArray(OVERLAY_COLORS);
    setHoverColors((prev) => ({ ...prev, [cardId]: randomColor }));
    setHoveredIndex(cardId);
  };

  const handleMouseLeave = (cardId: number) => {
    // If the user leaves, unhover (unless a new random hover overrides).
    setHoveredIndex((current) => (current === cardId ? null : current));
  };

  return (
    <section className="bg-white text-gray-900 py-16 px-6"> {/* Section wrapper, removed flex */}
      <div className="max-w-7xl mx-auto"> {/* Centering container */}
        <div className="text-center mb-12"> {/* Title and subtitle container */}
          <h2 className="text-4xl font-bold tracking-tight mb-4"> {/* Improved title styling */}
            Discover Our Categories
          </h2>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed"> {/* Subtitle */}
            The Future of Cleaning Services is Here! Explore our wide range of categories and find the perfect products for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8  mx-auto"> {/* Grid container */}
          {CATEGORIES.map((cat) => {
            const isHovered = hoveredIndex === cat.id;
            const overlayColor = hoverColors[cat.id] || OVERLAY_COLORS[0];

            return (
              <motion.div
                key={cat.id}
                className="relative rounded-lg shadow-lg overflow-hidden group transition duration-300 " // Added transition
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onMouseLeave={() => handleMouseLeave(cat.id)}
                whileHover={{ scale: 1.05 }} // Scale on hover
                transition={{ type: 'spring', stiffness: 300, damping: 20 }} // Smooth transition
              >
                <div
                  className="h-64 bg-center bg-cover rounded-t-lg rounded-tl-[60px] rounded-br-[60px]" // Consistent height, rounded top
                  style={{ backgroundImage: `url(${cat.image})` }}
                />

                {/* Overlay with conditional rendering */}
                {isHovered && (
                  <motion.div // Added motion.div for animation
                    initial={{ opacity: 0, y: 20 }} // Initial position off-screen
                    animate={{ opacity: 1, y: 0 }} // Animate to visible position
                    exit={{ opacity: 0, y: -20 }} // Animate out
                    transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
                    className={`absolute inset-0 flex flex-col items-center justify-center text-center transition duration-200 ${overlayColor} bg-opacity-90 rounded-t-lg rounded-tl-[60px] rounded-br-[60px]`}
                  >
                    <p className="text-white text-xl font-bold px-2 mb-2">
                      {cat.title}
                    </p>
                    <div className="flex items-center text-white text-sm font-medium animate-bounce">
                      Click to Explore <FaArrowRight className="ml-2" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}