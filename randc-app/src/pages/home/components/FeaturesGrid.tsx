import React from "react";
import {
  AiOutlineCalendar,
  AiOutlineLaptop,
  AiOutlineShop,
  AiOutlineCreditCard,
  AiOutlineUsergroupAdd,
  AiOutlineForm,
  AiOutlineBarChart,
  AiOutlineCarryOut,
  AiOutlineGift,
  AiOutlineGlobal,
  AiOutlineMessage,
  AiOutlineMobile,
} from "react-icons/ai";
import { FaMoneyCheckAlt, FaBolt, FaRegClock } from "react-icons/fa";
import { IoIosApps } from "react-icons/io";
import { MdOutlineIntegrationInstructions } from "react-icons/md";

interface FeatureItem {
  title: string;
  Icon: React.ElementType;
}

// Column definitions — adjust, add, or remove features as you like
const column1: FeatureItem[] = [
  { title: "Calendar & Scheduling", Icon: AiOutlineCalendar },
  { title: "Online Booking", Icon: AiOutlineLaptop },
  { title: "Retail & Inventory", Icon: AiOutlineShop },
  { title: "Memberships & Packages", Icon: FaRegClock },
  { title: "Mobile Apps", Icon: IoIosApps },
  { title: "Marketing & Automation", Icon: FaBolt },
];

const column2: FeatureItem[] = [
  { title: "Payments & Point-of-Sale", Icon: AiOutlineCreditCard },
  { title: "Express Booking™", Icon: FaMoneyCheckAlt },
  { title: "Staff Management", Icon: AiOutlineUsergroupAdd },
  { title: "Integrated Forms", Icon: AiOutlineForm },
  { title: "Reporting", Icon: AiOutlineBarChart },
  { title: "Payroll Processing", Icon: AiOutlineCarryOut },
];

const column3: FeatureItem[] = [
  { title: "Client Management", Icon: AiOutlineUsergroupAdd },
  { title: "Two-Way Texting", Icon: AiOutlineMessage },
  { title: "Virtual Waiting Room", Icon: AiOutlineCalendar },
  { title: "Gift Cards", Icon: AiOutlineGift },
  { title: "Multi-Location", Icon: AiOutlineGlobal },
  { title: "Integrations", Icon: MdOutlineIntegrationInstructions },
];

const FeaturesGrid: React.FC = () => {
  return (
    <section className="relative w-full bg-white text-[#101820] overflow-hidden py-20 lg:py-28">
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-center text-amber-400">
          Explore Our Features
        </h2>

        {/* Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="space-y-2">
            {column1.map((item, idx) => (
              <FeatureCard key={idx} title={item.title} Icon={item.Icon} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            {column2.map((item, idx) => (
              <FeatureCard key={idx} title={item.title} Icon={item.Icon} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="space-y-2">
            {column3.map((item, idx) => (
              <FeatureCard key={idx} title={item.title} Icon={item.Icon} />
            ))}
          </div>
        </div>
      </div>

      {/* Wave Shape Divider (Bottom) */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none">
        <svg
          className="block w-full h-20 md:h-32 lg:h-40"
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#f9fafb"
            fillOpacity="1"
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,160C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

// Reusable feature card
interface FeatureCardProps {
  title: string;
  Icon: React.ElementType;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, Icon }) => {
  return (
    <div className="bg-white rounded-xl p-6 flex items-center space-x-4 transition-all hover:shadow-lg border border-gray-100 hover:border-amber-100">
      <div className="text-amber-500 text-3xl p-3 bg-amber-50 rounded-lg">
        <Icon />
      </div>
      <span className="text-lg font-semibold text-gray-800">{title}</span>
    </div>
  );
};

export default FeaturesGrid;