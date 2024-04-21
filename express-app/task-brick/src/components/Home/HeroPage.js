import React from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../../hooks/UseTitle';
import sampleTask from '../../assets/images/hero1.png';
import sampleProject from '../../assets/images/taskbrick.png';
import sampleProject2 from '../../assets/images/taskbrick2.png';
import sampleProject3 from '../../assets/images/taskbrick4.png';

const HeroPage = () => {
  useTitle('Home');

return (
  <div className="border-b dark:bg-gray-700">
    <section className="container mx-auto px-4 py-12">
      <div className=" grid lg:grid-cols-2 gap-8 items-center">
        <div className=" text-center lg:text-left">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2 ">
            Simplify your workflow
          </p>
          <h1 className="text-3xl max-w-xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Manage <span className="text-green-500">Task</span> & <span className="text-green-500">Projects</span> Effectively
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-20">
            A unified platform to seamlessly plan, track, and execute your work.
          </p>
          <div className="flex justify-center lg:justify-start gap-4 mb-4">
            <Link to="/start" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 animate-pulse">
              Start Your Free Trial
            </Link>
            <Link to="/how-it-works" className="bg-transparent border border-blue-500 text-blue-500 font-semibold py-2 px-4 rounded-lg  hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
              How It Works
            </Link>
          </div>
          <div className="flex justify-center lg:justify-start gap-4">
            <button className="border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-purple-200 transition duration-300">
              Kanban
            </button>
            <button className="border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-pink-200 transition duration-300">
              Scrum
            </button>
            <button className="border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-200 transition duration-300">
              Gantt Charts
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex justify-center lg:justify-start">
            <img src={sampleProject3} alt="A dashboard showing tasks and projects management" className="rounded-lg shadow-lg lg:w-auto" />
          </div>
          <div className="flex flex-col space-y-4">
            <img src={sampleProject2} alt="Design system task interface" className="rounded-lg shadow-lg h-20 w-full" />
            <img src={sampleProject} alt="Project management dashboard" className="rounded-lg shadow-lg h-80 w-full" />
          </div>
        </div>
      </div>
    </section>
  </div>
);
}

export default HeroPage;

