import React from 'react';
import { FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import TeamMember1 from '../../component/assets/images/team1.png';
import TeamMember2 from '../../component/assets/images/team2.png';
import TeamMember3 from '../../component/assets/images/team3.png';
import TeamMember4 from '../../component/assets/images/team4.png';
import TeamMember5 from '../../component/assets/images/team5.png';
import TeamMember6 from '../../component/assets/images/team6.png';

// Sample data for team members
const teamMembers = [
  { id: 1, name: "Christopher Adebajo", position: "Founder", img: TeamMember1 },
  { id: 2, name: "Gerry Eze", position: "Co-Founder", img: TeamMember2 },
  { id: 3, name: "Francis Obetta", position: "Co-Founder", img: TeamMember3 },
  { id: 4, name: "Rabi Usman", position: "Developer", img: TeamMember4 },
  { id: 5, name: "Nonso Jude", position: "Designer", img: TeamMember5 },
  { id: 6, name: "Oluwatobi Sule", position: "Tester", img: TeamMember6 },

  // ... more team members
];

const OurTeam = () => {
  return (
    <div className=" text-center p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 text-left  mb-8">Our Team</h2>
      <p className="text-gray-600 mb-6 text-left max-w-2xl">We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {teamMembers.map(member => (
          <div key={member.id} className="p-4">
            <img src={member.img} alt={member.name} className="w-40 h-40 rounded-lg mx-auto" />
            <h3 className="mt-4 font-bold">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.position}</p>
            <div className="flex justify-center mt-3">
              <a href="https://twitter.com" className="text-blue-500 hover:text-blue-600 mx-1">
                <FaTwitter size="20" />
              </a>
              <a href="https://linkedin.com" className="text-blue-500 hover:text-blue-600 mx-1">
                <FaLinkedin size="20" />
              </a>
              <a href="mailto:email@example.com" className="text-gray-500 hover:text-gray-600 mx-1">
                <FaEnvelope size="20" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTeam;
