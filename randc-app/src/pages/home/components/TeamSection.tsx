// src/pages/home/components/TeamSection.tsx

import { motion } from 'framer-motion';

// Example images for team members. Replace with your own
import team1 from '../../../assets/images/image1.png';
import team2 from '../../../assets/images/image2.png';
import team3 from '../../../assets/images/image3.png';
import team4 from '../../../assets/images/image4.png';

interface TeamMember {
  image: string;
  name: string;
  role: string;
}

const teamMembers: TeamMember[] = [
  {
    image: team1,
    name: 'John Carter',
    role: 'Senior Cleaner',
  },
  {
    image: team2,
    name: 'Alice Wang',
    role: 'Operations Manager',
  },
  {
    image: team3,
    name: 'Mark Johnson',
    role: 'Deep-Clean Specialist',
  },
  {
    image: team4,
    name: 'Sara Morgan',
    role: 'Eco-Friendly Lead',
  },
];

function TeamSection() {
  return (
    <section
    className="
      relative
      w-full
      py-16
      overflow-hidden
      h-auto
      bg-gradient-to-r
      from-[#918BFF]
      to-[#023e8a]
    "
    style={{
      clipPath: 'polygon(0 0, 100% 0, 95% 97%, 0 94%)',
    }}
  >
      {/* -- BUBBLES / SHAPES BACKGROUND -- */}
      {/* 1) Large bubble on the left */}
      <motion.div
        className="absolute w-32 h-32 bg-white bg-opacity-40 rounded-full top-10 left-4 z-0"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
      />
      {/* 2) Bubble on the right */}
      <motion.div
        className="absolute w-20 h-20 bg-pink-300 bg-opacity-30 rounded-full top-20 right-8 z-0"
        initial={{ opacity: 0, y: 1 }}
        animate={{ opacity: 1, y: -1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
      />
      {/* 3) Smaller bubble near center */}
      <motion.div
        className="absolute w-10 h-10 bg-white bg-opacity-20 rounded-full top-14 left-[40%] z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      {/* 4) Even more small bubbles scattered */}
      <motion.div
        className="absolute w-6 h-6 bg-white bg-opacity-30 rounded-full bottom-4 right-4 z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div
        className="absolute w-6 h-6 bg-white bg-opacity-50 rounded-full bottom-60 right-60 z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div
        className="absolute w-6 h-6 bg-white bg-opacity-30 rounded-full bottom-4 left-4 z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div
        className="absolute w-6 h-6 bg-white bg-opacity-30 rounded-full bottom-40 left-40 z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* -- CONTENT WRAPPER -- */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm text-gray-100 font-semibold uppercase tracking-widest">
            Our Amazing Team
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Meet the Experts Behind R&C
          </h2>
          <p className="text-gray-200 mt-4 max-w-2xl mx-auto">
            Our committed professionals bring years of experience, a passion for
            cleanliness, and a drive to exceed your expectations, every time.
          </p>
        </div>

        {/* Grid of Team Images with bigger cards & hover overlay */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              className="
                group
                relative
                bg-white
                rounded-tl-[60px]
                rounded-br-[60px]
                overflow-hidden
                shadow-md
                hover:shadow-xl
                transform
                hover:-translate-y-1
                transition
              "
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-80 object-cover"
              />
              {/* HOVER OVERLAY */}
              <div
                className="
                  absolute
                  inset-0
                  bg-black
                  bg-opacity-0
                  group-hover:bg-opacity-50
                  transition
                  flex
                  items-center
                  justify-center
                  opacity-0
                  group-hover:opacity-100
                "
              >
                <div className="text-center px-4">
                  <h3 className="text-white text-lg font-bold mb-1">
                    {member.name}
                  </h3>
                  <p className="text-white text-sm">{member.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
