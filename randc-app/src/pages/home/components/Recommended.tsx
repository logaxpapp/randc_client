import React, { useRef } from "react";
import { FaArrowRight, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";
// For Swiper 10+:
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// Example images
import bannerImage from "../../../assets/images/image6.png";
import imgStatic from "../../../assets/images/r2.png";
import imgSet1A from "../../../assets/images/r3.png";
import imgSet1B from "../../../assets/images/r1.png";
import imgSet2A from "../../../assets/images/r4.png";
import imgSet2B from "../../../assets/images/banner.jpeg";
import imgSet3 from "../../../assets/images/stock1.png";
import imgSet4 from "../../../assets/images/stock2.png";
import imgSet5 from "../../../assets/images/stock3.png";
import imgSet6 from "../../../assets/images/stock4.png";
import imgSet7 from "../../../assets/images/stock5.png";
import imgSet8 from "../../../assets/images/stock6.png";
import imgSet9 from "../../../assets/images/stock7.png";
import imgSet10 from "../../../assets/images/stock8.png";
import imgSet11 from "../../../assets/images/stock9.png";
import imgSet12 from "../../../assets/images/image4.png";
import imgSet13 from "../../../assets/images/image1.png";
import imgSet14 from "../../../assets/images/image2.png";


interface Cleaner {
  id: string;
  name: string;
  image: string;
  shortDesc: string;
  priceStart: number;
  isNew?: boolean;
  rating?: number;
  isExpired?: boolean;
}

const recommendedCleaners: Cleaner[] = [
  {
    id: "c1",
    name: "Alice",
    image: bannerImage,
    shortDesc: "Eco-friendly cleaning expert.",
    priceStart: 50,
    isNew: true,
    rating: 4.8,
    isExpired: true, // This one is expired
  },
  {
    id: "c2",
    name: "DeepClean",
    image: imgSet1A,
    shortDesc: "Specializes in move-out cleans.",
    priceStart: 75,
    rating: 4.9,
    isExpired: false,
  },
  {
    id: "c3",
    name: "SwiftClean",
    image: imgSet1B,
    shortDesc: "Efficient cleaning.",
    priceStart: 60,
    rating: 4.7,
    isExpired: false,
  },
  {
    id: "c4",
    name: "Scrubber",
    image: imgSet2A,
    shortDesc: "Industrial cleaning.",
    priceStart: 90,
    rating: 4.8,
    isExpired: false,
  },
  {
    id: "c5",
    name: "Erin Refresh",
    image: imgSet2B,
    shortDesc: "Post-renovation guru.",
    priceStart: 120,
    rating: 4.6,
    isExpired: false,
  },
  {
    id: "c6",
    name: "Frank Shine",
    image: imgStatic,
    shortDesc: "All-around cleaning star.",
    priceStart: 70,
    isNew: true,
    rating: 4.9,
    isExpired: false,
  },
  {
    id: "c7",
    name: "Grace Clean",
    image: imgSet3,
    shortDesc: "Specializes in cleaning.",
    priceStart: 100,
    rating: 4.7,
    isExpired: false,
  },
  {
    id: "c8",
    name: "Hannah Clean",
    image: imgSet4,
    shortDesc: "Expert in gardening and landscaping.",
    priceStart: 110,
    rating: 4.8,
    isExpired: false,
  },
  {
    id: "c9",
    name: "Isaac Clean",
    image: imgSet5,
    shortDesc: "Post-renovation cleaning.",
    priceStart: 130,
    rating: 4.9,
    isExpired: false,
  },
  {
    id: "c10",
    name: "Jack Clean",
    image: imgSet6,
    shortDesc: "Expert in post-event cleaning.",
    priceStart: 140,
    rating: 4.7,
    isExpired: false,
  },
  {
    id: "c11",
    name: "Kathy Clean",
    image: imgSet7,
    shortDesc: "Specializes in window cleaning.",
    priceStart: 80,
    rating: 4.8,
    isExpired: false,
  },
  {
    id: "c12",
    name: "Leo Clean",
    image: imgSet8,
    shortDesc: "Specializes in carpet cleaning.",
    priceStart: 85,
    rating: 4.7,
    isExpired: false,
  },
  {
    id: "c13",
    name: "Maya Clean",
    image: imgSet9,
    shortDesc: "Specializes in upholstery cleaning.",
    priceStart: 90,
    rating: 4.6,
    isExpired: false,
  },
  {
    id: "c14",
    name: "Nina Clean",
    image: imgSet10,
    shortDesc: "Pressure washing pro.",
    priceStart: 150,
    rating: 4.9,
    isExpired: false,
  },
  {
    id: "c15",
    name: "Oscar Clean",
    image: imgSet11,
    shortDesc: "Graffiti removal specialist.",
    priceStart: 160,
    rating: 4.8,
    isExpired: false,
  },
  {
    id: "c16",
    name: "Peter Clean",
    image: imgSet12,
    shortDesc: "Specializes in laundry.",
    priceStart: 100,
    rating: 4.7,
    isExpired: false,
  },
  {
    id: "c17",
    name: "Quinn Clean",
    image: imgSet13,
    shortDesc: "Specializes in pet grooming.",
    priceStart: 110,
    isNew: true,
    rating: 4.8,
    isExpired: false,
  },
  {
    id: "c18",
    name: "Rita Clean",
    image: imgSet14,
    shortDesc: "Specializes in organizing.",
    priceStart: 120,
    rating: 4.9,
    isExpired: false,
  },
];

/** Helper to render star rating with half stars supported */
function StarRating({ rating = 0 }: { rating: number }) {
  // Create an array of 5 to map over
  const stars = [...Array(5)].map((_, i) => {
    const starNumber = i + 1;
    // Check if the rating is at least this starNumber
    // If rating is fractional, show half-star
    if (rating >= starNumber) {
      return <FaStar key={i} className="text-amber-400" />;
    } else if (rating > starNumber - 1 && rating < starNumber) {
      return <FaStarHalfAlt key={i} className="text-amber-400" />;
    } else {
      return <FaRegStar key={i} className="text-amber-400" />;
    }
  });
  return <div className="flex">{stars}</div>;
}

/** Reusable Card with Framer Motion */
function CleanerCard({ cleaner }: { cleaner: Cleaner }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="cleaner-card relative rounded my-2 px-8 p-4
                 bg-white shadow-2xl text-gray-800 hover:bg-white/20
                 transition duration-300  flex flex-col"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {cleaner.isNew && (
        <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md uppercase">
          New
        </div>
      )}
      <img
        src={cleaner.image}
        alt={cleaner.name}
        className="w-full h-44 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-bold text-gray-900 mb-2">{cleaner.name}</h3>
      <p className="text-sm text-gray-700 mb-3 line-clamp-3 flex-grow">
        {cleaner.shortDesc}
      </p>

      {/* Rating */}
      {cleaner.rating && (
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={cleaner.rating} />
          <span className="text-indigo-900 text-sm">
            {cleaner.rating.toFixed(1)}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center mt-auto">
        <span className="text-amber-400 font-extrabold text-lg">
          ${cleaner.priceStart}
        </span>
        <button className="text-amber-400 hover:text-amber-500 flex items-center font-semibold">
          Visit
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </motion.div>
  );
}

const RecommendedCleaners = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };
  // Filter out expired cleaners
  const activeCleaners = recommendedCleaners.filter(
    (cleaner) => !cleaner.isExpired
  );

  return (
    <section className="relative py-8 bg-gradient-to-b from-black/90 via-black/80 to-black text-white overflow-hidden max-h-[70vh]">
      {/* Background image & overlays */}
     
      <div className="absolute inset-0 bg-gradient-to-b bg-white" />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-center text-amber-400">
            Top Cleaners Near You
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto">
            Discover top-rated cleaning professionals near you. From eco-friendly
            experts to heavy-duty pros, you’ll find just the right fit for your
            needs.
          </p>
        </div>

        {/* Cleaner Carousel using Swiper */}
        <motion.div
          className="cleaner-carousel py-8 mb-40"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            // pagination={{ clickable: true }}
            navigation={true}
            className="rounded-xl"
          >
            {activeCleaners.map((cleaner) => (
              <SwiperSlide key={cleaner.id}>
                <CleanerCard cleaner={cleaner} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

     
    </section>
  );
};

export default RecommendedCleaners;
