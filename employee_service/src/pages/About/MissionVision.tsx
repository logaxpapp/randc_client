import React from 'react';

interface SectionProps {
  title: string;
  content: string;
}

const Section: React.FC<SectionProps> = ({ title, content }) => (
  <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 transition-shadow hover:shadow-xl hover:scale-105 transform duration-300">
    <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
    <p className="mt-4 text-gray-600 dark:text-gray-300">{content}</p>
  </div>
);

const MissionVision: React.FC = () => {
  return (
    <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <Section
        title="Our Mission"
        content="Our mission at LogaXP is to provide innovative, seamless solutions that enhance business operations and customer interactions. We strive to empower organizations across industries with tools that drive efficiency, foster collaboration, and deliver exceptional user experiences."
      />
      <Section
        title="Our Vision"
        content="Our vision is to be a global leader in digital solutions, continuously transforming the way businesses operate and connect with their customers. We aim to shape the future of business management by delivering adaptable, user-centric platforms that support sustainable growth and innovation."
      />
    </section>
  );
};

export default MissionVision;
