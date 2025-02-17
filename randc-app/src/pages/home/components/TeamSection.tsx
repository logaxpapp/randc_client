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
    <section className="relative w-full py-16 overflow-hidden  bg-gradient-to-br from-[#1f2937] to-[#111827]"> {/* Section wrapper */}
      {/* -- CONTENT WRAPPER -- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 "> {/* Responsive grid */}
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              className="group relative bg-white rounded-tl-[60px] rounded-br-[60px] overflow-hidden shadow-md hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-80 object-cover rounded-tl-[60px] rounded-br-[60px]"
              />
              {/* HOVER OVERLAY */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
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