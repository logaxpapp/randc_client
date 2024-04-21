import React from 'react';
import { FaCheckCircle, FaStream, FaRegCalendarCheck, FaRegChartBar, FaAdversal, FaRProject } from 'react-icons/fa';

const featureData = [
  {
    Icon: FaCheckCircle,
    title: 'Task Prioritization',
    description: 'Organize tasks by priority, enabling your team to focus on what matters most and deliver projects efficiently.',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    Icon: FaStream,
    title: 'Workflow Customization',
    description: 'Customize and automate your workflow to match your team’s process, ensuring everyone knows their next step.',
    color: 'bg-green-100 text-green-600',
  },
  {
    Icon: FaRegCalendarCheck,
    title: 'Scheduling & Calendars',
    description: 'Plan and visualize project timelines with integrated calendars to keep everyone aligned and on schedule.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    Icon: FaRegChartBar,
    title: 'Progress Tracking',
    description: 'Monitor project progress with real-time updates and detailed reports to stay informed on your team’s achievements.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    Icon: FaAdversal,
    title: 'Seamless Teamwork',
    description: 'Facilitate effective collaboration across teams with real-time updates and shared workspaces. Ensure everyone is on the same page, making collective progress towards common goals.',
    color: 'bg-gray-100 text-yellow-600',
},

{
  Icon: FaRProject,
  title: 'Strategic Planning',
  description: 'Streamline your project planning with our comprehensive tools. Organize tasks, set deadlines, and track progress to ensure successful project delivery.',
  color: 'bg-red-100 text-red-600',
},

];

const FeatureProduct = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-40 mt-40">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
        Streamline Your Team's Workflow with TaskBrick's Intuitive Tools
      </h2>
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center justify-center align-middle">
          Try our   <span className="text-blue-600">Free</span> 30-day trial today!
        </h2>
       
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {featureData.map((feature, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className={`flex-shrink-0 p-4 rounded-lg text-3xl ${feature.color}`}>
              <feature.Icon />
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 text-left">
              <h3 className="text-xl leading-6 font-medium text-gray-900">{feature.title}</h3>
              <p className="text-md mt-2 text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureProduct;
