import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

// Example images
import bannerImage from '../../../assets/images/image6.png';
import imgStatic from '../../../assets/images/r2.png';
import imgSet1A from '../../../assets/images/r3.png';
import imgSet1B from '../../../assets/images/r1.png';
import imgSet2A from '../../../assets/images/r4.png';
import imgSet2B from '../../../assets/images/banner.jpeg';
import imgSet3 from '../../../assets/images/stock1.png';
import imgSet4 from '../../../assets/images/stock2.png';
import imgSet5 from '../../../assets/images/stock3.png';
import imgSet6 from '../../../assets/images/stock4.png';
import imgSet7 from '../../../assets/images/stock5.png';
import imgSet8 from '../../../assets/images/stock6.png';
import imgSet9 from '../../../assets/images/stock7.png';
import imgSet10 from '../../../assets/images/stock8.png';
import imgSet11 from '../../../assets/images/stock9.png';
import imgSet12 from '../../../assets/images/image4.png';
import imgSet13 from '../../../assets/images/image1.png';

interface Cleaner {
  id: string;
  name: string;
  image: string;
  shortDesc: string;
  priceStart: number;
  isNew?: boolean;
}

// 17 total
const recommendedCleaners: Cleaner[] = [
  {
    id: 'c1',
    name: 'Alice',
    image: bannerImage,
    shortDesc: 'Eco-friendly cleaning expert.',
    priceStart: 50,
    isNew: true,
  },
  {
    id: 'c2',
    name: 'DeepClean',
    image: imgSet1A,
    shortDesc: 'Specializes in move-out cleans.',
    priceStart: 75,
  },
  {
    id: 'c3',
    name: 'SwiftClean',
    image: imgSet1B,
    shortDesc: 'Efficient cleaning.',
    priceStart: 60,
  },
  {
    id: 'c4',
    name: 'Scrubber',
    image: imgSet2A,
    shortDesc: 'Industrial cleaning.',
    priceStart: 90,
  },
  {
    id: 'c5',
    name: 'Erin Refresh',
    image: imgSet2B,
    shortDesc: 'Post-renovation guru.',
    priceStart: 120,
  },
  {
    id: 'c6',
    name: 'Frank Shine',
    image: imgStatic,
    shortDesc: 'All-around cleaning star.',
    priceStart: 70,
    isNew: true,
  },
  {
    id: 'c7',
    name: 'Grace Clean',
    image: imgSet3,
    shortDesc: 'Specializes in cleaning.',
    priceStart: 100,
  },
  {
    id: 'c8',
    name: 'Hannah Clean',
    image: imgSet4,
    shortDesc: 'Expert in gardening and landscaping.',
    priceStart: 110,
  },
  {
    id: 'c9',
    name: 'Isaac Clean',
    image: imgSet5,
    shortDesc: 'Post-renovation cleaning.',
    priceStart: 130,
  },
  {
    id: 'c10',
    name: 'Jack Clean',
    image: imgSet6,
    shortDesc: 'Expert in post-event cleaning.',
    priceStart: 140,
  },
  {
    id: 'c11',
    name: 'Kathy Clean',
    image: imgSet7,
    shortDesc: 'Specializes in window cleaning.',
    priceStart: 80,
  },
  {
    id: 'c12',
    name: 'Leo Clean',
    image: imgSet8,
    shortDesc: 'Specializes in carpet cleaning.',
    priceStart: 85,
  },
  {
    id: 'c13',
    name: 'Maya Clean',
    image: imgSet9,
    shortDesc: 'Specializes in upholstery cleaning.',
    priceStart: 90,
  },
  {
    id: 'c14',
    name: 'Nina Clean',
    image: imgSet10,
    shortDesc: 'Pressure washing pro.',
    priceStart: 150,
  },
  {
    id: 'c15',
    name: 'Oscar Clean',
    image: imgSet11,
    shortDesc: 'Graffiti removal specialist.',
    priceStart: 160,
  },
  {
    id: 'c16',
    name: 'Peter Clean',
    image: imgSet12,
    shortDesc: 'Specializes in laundry.',
    priceStart: 100,
  },
  {
    id: 'c17',
    name: 'Quinn Clean',
    image: imgSet13,
    shortDesc: 'Specializes in pet grooming.',
    priceStart: 110,
    isNew: true,
  },
];

function RecommendedPyramid() {
  // 3 rows: row1 => 7, row2 => 6, row3 => 4
  const row1 = recommendedCleaners.slice(0, 7);
  const row2 = recommendedCleaners.slice(7, 13);
  const row3 = recommendedCleaners.slice(13, 17);

  return (
    <section className="py-16 bg-gradient-to-t from-blue-200 relative">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Recommended Cleaners
          </h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Top-notch cleaning services around you!
          </p>
        </div>

        <div className="relative flex flex-col items-center max-w-7xl mx-auto">
          {/* ROW 1 */}
          <div className="flex flex-wrap lg:flex-nowrap justify-center gap-2">
            {row1.map((c) => (
              <div
                key={c.id}
                className="
                  relative
                  bg-white
                  rounded-lg
                  shadow
                  p-2
                  flex
                  flex-col
                  hover:shadow-lg
                  w-full
                  sm:w-32
                  md:w-32
                  lg:w-40
                "
              >
                {c.isNew && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    New
                  </div>
                )}

                <div className="relative">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  {/* Price + Visit overlay */}
                  <div className="absolute bottom-1 right-1 flex items-center space-x-2 bg-white/90 px-2 py-1 rounded shadow">
                    <span className="text-blue-600 font-bold text-xs">
                      ${c.priceStart}
                    </span>
                    <button
                      onClick={() => console.log('Go to detail for', c.id)}
                      className="flex items-center text-blue-600 text-xs hover:text-blue-500 relative"
                    >
                      <FaArrowRight className="text-yellow-500" />
                      <span className="font-semibold ml-1">Visit</span>
                    </button>
                  </div>
                </div>

                <h3 className="mt-1 text-base font-bold text-gray-800">
                  {c.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1 flex-1">
                  {c.shortDesc}
                </p>
              </div>
            ))}
          </div>

          {/* ROW 2 */}
          <div
            className="
              flex
              flex-wrap
              lg:flex-nowrap
              justify-center
              gap-2
              mt-4
              lg:-mt-3
              z-10
            "
          >
            {row2.map((c) => (
              <div
                key={c.id}
                className="
                  relative
                  bg-white
                  rounded-lg
                  shadow
                  p-2
                  flex
                  flex-col
                  hover:shadow-lg
                  w-full
                  sm:w-32
                  md:w-32
                  lg:w-40
                "
              >
                {c.isNew && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    New
                  </div>
                )}

                <div className="relative">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="absolute bottom-1 right-1 flex items-center space-x-2 bg-white/90 px-2 py-1 rounded shadow">
                    <span className="text-blue-600 font-bold text-xs">
                      ${c.priceStart}
                    </span>
                    <button
                      onClick={() => console.log('Go to detail for', c.id)}
                      className="flex items-center text-blue-600 text-xs hover:text-blue-500 relative"
                    >
                      <FaArrowRight className="text-yellow-500" />
                      <span className="font-semibold ml-1">Visit</span>
                    </button>
                  </div>
                </div>

                <h3 className="mt-1 text-base font-bold text-gray-800">
                  {c.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1 flex-1">
                  {c.shortDesc}
                </p>
              </div>
            ))}
          </div>

          {/* ROW 3 */}
          <div
            className="
              flex
              flex-wrap
              lg:flex-nowrap
              justify-center
              gap-2
              mt-4
              lg:-mt-3
              z-20
            "
          >
            {row3.map((c) => (
              <div
                key={c.id}
                className="
                  relative
                  bg-white
                  rounded-lg
                  shadow
                  p-2
                  flex
                  flex-col
                  hover:shadow-lg
                  w-full
                  sm:w-32
                  md:w-32
                  lg:w-40
                "
              >
                {c.isNew && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    New
                  </div>
                )}

                <div className="relative">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="absolute bottom-1 right-1 flex items-center space-x-2 bg-white/90 px-2 py-1 rounded shadow">
                    <span className="text-blue-600 font-bold text-xs">
                      ${c.priceStart}
                    </span>
                    <button
                      onClick={() => console.log('Go to detail for', c.id)}
                      className="flex items-center text-blue-600 text-xs hover:text-blue-500 relative"
                    >
                      <FaArrowRight className="text-yellow-500" />
                      <span className="font-semibold ml-1">Visit</span>
                    </button>
                  </div>
                </div>

                <h3 className="mt-1 text-base font-bold text-gray-800">
                  {c.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1 flex-1">
                  {c.shortDesc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optional decorative strip at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-[#4FBF96] -z-10" />
    </section>
  );
}

export default RecommendedPyramid;
