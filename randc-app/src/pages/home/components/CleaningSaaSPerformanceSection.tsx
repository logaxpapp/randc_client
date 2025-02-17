import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

// Adjust your imports as needed:
import CleaningHeroImg from '../../../assets/images/stock7.png';

function CountUpNumber({ endValue, duration = 1 }: { endValue: number; duration?: number }) {
  const countValue = useMotionValue(0);
  const roundedValue = useTransform(countValue, (latest) => Math.floor(latest));

  useEffect(() => {
    const controls = animate(countValue, endValue, {
      duration,
      ease: 'easeInOut',
    });
    return () => controls.stop();
  }, [endValue, duration, countValue]);

  return (
    <motion.span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {roundedValue}
    </motion.span>
  );
}

const CleaningPerformanceSection: React.FC = () => {
  return (
    <section className="relative w-full py-12 bg-gradient-to-t from-black via-gray-800 to-black text-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title + short paragraph */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Clean Smarter, Not Harder
          </h2>
          <p className="mt-2 text-gray-200 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Our compact Cleaning SaaS solution optimizes your daily tasks,
            reduces costs, and keeps your team in sync. Take a quick look at the
            numbers below to see how efficient your workflow can be.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {/* Example stats */}
          <div className="bg-white/10 rounded-lg p-6 text-center shadow-md">
            <h3 className="text-5xl font-extrabold">
              <CountUpNumber endValue={99} duration={5.8} />
              <span className="align-top text-2xl">%</span>
            </h3>
            <p className="mt-1 text-xs text-gray-200 uppercase tracking-wider">
              Time Saved
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-6 text-center shadow-md">
            <h3 className="text-5xl font-extrabold">
              <CountUpNumber endValue={97} duration={4.5} />
              <span className="align-top text-2xl">%</span>
            </h3>
            <p className="mt-1 text-xs text-gray-200 uppercase tracking-wider">
              Cost Reduction
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-6 text-center shadow-md">
            <h3 className="text-5xl font-extrabold">
              <CountUpNumber endValue={95} duration={3.9} />
              <span className="align-top text-2xl">%</span>
            </h3>
            <p className="mt-1 text-xs text-gray-200 uppercase tracking-wider">
              Team Efficiency
            </p>
          </div>
        </motion.div>

        {/* One compact row: Image + minimal text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <img
              src={CleaningHeroImg}
              alt="Cleaning SaaS Example"
              className="rounded-lg shadow-lg max-w-xs md:max-w-sm"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-2">No More Mess</h3>
            <p className="text-sm md:text-base text-gray-200 leading-relaxed">
              With automated scheduling, real-time notifications, and in-depth
              reporting, our platform streamlines every cleaning task. Keep your
              focus on delivering spotless results for clients, while we handle
              the rest.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CleaningPerformanceSection;
