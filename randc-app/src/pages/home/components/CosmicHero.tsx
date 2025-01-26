import React from 'react';
import CosmicHeroImg from '../../../assets/images/stock8.png';

interface CosmicHeroProps {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
}

const CosmicHero: React.FC<CosmicHeroProps> = ({
  title = 'In an Infinite Universe, Choose Infinite Cleanliness',
  subtitle = 'R&C Cleaning: Where Every Surface Glimmers Like the Cosmos',
  imageSrc = CosmicHeroImg,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
      {/* VITAL MESSAGE (sticky top) */}
      <div className="sticky top-0 z-50 bg-pink-600 px-4 py-2 shadow-lg">
        <p className="text-center text-white font-semibold">
          In an Infinite Universe, Choose Infinite Cleanliness
        </p>
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full h-screen flex flex-col">
        {/* 1) Animated Star Field (Background) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className=" bg-cover bg-center w-full h-full " />
        </div>

        {/* 2) Hero Image with Glass Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={imageSrc}
            alt="Cosmic Cup Hero"
            className="w-full h-full object-cover object-center rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:rotate-3"
          />
        </div>

        <div className="absolute inset-0 backdrop-blur-sm bg-white/5" />

        {/* 3) Wave Shape Divider at Bottom (Optional) */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-[0] rotate-180">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-20"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,26.29C895.56,56.06,805.48,85.64,709,95.87C606.21,107.31,506.31,99,402.45,76.36
              C339.81,62.37,275.55,47.16,211.13,34.08C163.5,24.94,112.79,16.53,63.21,13.42C42.39,12.16,18.21,11.8,0,12.67V120H1200V7.73
              C1125.74,23.88,1046.58,8.71,985.66,26.29Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        {/* 4) Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          <p className="max-w-2xl text-lg md:text-xl lg:text-2xl text-slate-100 mb-8">
            {subtitle}
          </p>
          <button
            className="bg-pink-600 hover:bg-pink-700 text-white text-base md:text-lg font-medium
                       py-3 px-6 rounded-lg shadow-lg transition-transform transform
                       hover:-translate-y-1 hover:scale-105"
          >
            Launch into Cleanliness
          </button>
        </div>
      </section>

      {/* OPTIONAL INFO / CTA SECTION */}
      <div className="relative bg-white text-gray-800 py-16 px-4 md:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Enter a New Dimension of Clean
        </h2>
        <p className="max-w-3xl mx-auto leading-relaxed">
          Experience stellar results with R&C Cleaning—where every speck of dust
          is lost to the cosmic abyss. Let us make your business space feel like
          a refreshing galactic breeze. Join our orbit of satisfied clients today!
        </p>
      </div>
    </div>
  );
};

export default CosmicHero;
