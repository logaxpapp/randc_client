// src/pages/about/AboutPage.tsx
import React from "react";
import { motion } from "framer-motion";
// For the map, if using react-leaflet, import accordingly:
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
 import "leaflet/dist/leaflet.css";
 import L from "leaflet";
import Chris from "../../../assets/images/chris.png";

const AboutPage: React.FC = () => {
  // For demonstration, let’s pick some approximate coordinates in Old Hickory, TN
  const address = "1108 Berry Street, Old Hickory, TN 37138, United States";
  const phone = "+1 (615) 481-3592";

  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden p-16">
      {/* === Wave Divider (Top) === */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-10">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#101820"
            fillOpacity="1"
            d="M0,256L48,224C96,192,192,128,288,112C384,96,480,128,576,149.3C672,171,768,181,864,202.7C960,224,1056,256,1152,240C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-24">
        {/* Intro / Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
            About R&C Cleaning
          </h1>
          <p className="text-gray-600 mt-4">
            Founded by Christopher &amp; Renata Churchwell — a dynamic
            husband-and-wife team with one unwavering mission:
            <span className="font-bold"> “Cleanliness is our goal!”</span>
          </p>
        </motion.div>

        {/* Hero / Founders Story */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Text block */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-lime-600 mb-4">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Christopher &amp; Renata Churchwell began R&amp;C Cleaning with a
              simple vision: create a service that elevates cleanliness into a
              lifestyle. From humble beginnings—armed only with passion,
              resourcefulness, and a few mops—they set out to transform the
              cleaning industry.
            </p>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Driven by their unwavering motto,
              <span className="font-semibold"> “Cleanliness is our goal”</span>,
              they opened R&amp;C’s first branch in Old Hickory, Tennessee.
              Today, R&amp;C Cleaning has expanded nationwide, providing eco-
              friendly products, personalized scheduling solutions, and advanced
              cleaning methods that leave clients in awe.
            </p>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Whether you’re a homeowner seeking a refreshing living space or a
              business owner needing a sparkling environment, R&amp;C Cleaning
              stands ready. With every squeaky-clean floor and streak-free
              window, we aim to enrich lives—one spotless room at a time.
            </p>
          </div>

          <p className="text-gray-700 mt-4 leading-relaxed">
            <span className="font-semibold">Christopher &amp; Renata</span>
            Churchwell are passionate and dedicated individuals who have
            worked together since their humble beginnings. They have a deep
            appreciation for cleanliness, and they strive to create a
            beautiful, clean, and sustainable environment for their clients and
            their employees.
            <br />
            <br />
            <span className="font-semibold">Christopher</span> is a 28-year-old
            owner and a freelance graphic designer, who has a love for
            helping others create beautiful spaces. He is always eager to
            learn, and he is excited to share his knowledge and expertise
            with others.
            <br />
            <br />
            <span className="font-semibold">Renata</span> is a 32-year-old
          </p>
          <img
            src={Chris}
            alt="Christopher & Renata Churchwell"
            className="w-full h-auto object-cover rounded shadow-md"
          />
         
          <div className="w-full h-64 bg-lime-100 rounded-md flex items-center justify-center text-gray-500 text-center shadow-md">
          <img
            src={Chris}
            alt="Christopher & Renata Churchwell"
            className="w-full h-auto object-cover rounded shadow-md"
          />
          </div>
        </motion.div>

        {/* Contact / Map Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Contact Info */}
          <div className="bg-lime-50 p-6 rounded-md shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Visit or Contact Us
            </h3>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Address:</span> 1108 Berry Street,
              Old Hickory, TN 37138
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Phone:</span> +1 (615) 481-3592
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:info@rnc-cleaning.com"
                className="text-lime-600 hover:underline"
              >
                info@rnc-cleaning.com
              </a>
            </p>
          </div>

          
       
          <MapContainer
            center={[36.2523, -86.6377]} // approximate Old Hickory, TN coords
            zoom={13}
            style={{ width: "100%", height: "300px" }}
            scrollWheelZoom={false}
            className="rounded-md shadow-md"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[36.2523, -86.6377]}>
              <Popup>R&amp;C HQ in Old Hickory</Popup>
            </Marker>
          </MapContainer>
         

          
        </motion.div>
      </div>

      {/* === Wave Divider (Bottom) === */}
      <div className="absolute bottom-0 w-full leading-[0]">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#101820"
            fillOpacity="1"
            d="M0,32L48,42.7C96,53,192,75,288,85.3C384,96,480,96,576,122.7C672,149,768,203,864,224C960,245,1056,235,1152,218.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default AboutPage;
