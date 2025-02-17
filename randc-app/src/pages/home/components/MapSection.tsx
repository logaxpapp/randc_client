import React from "react";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Continent {
  name: string;
  coords: LatLngTuple; // or [number, number]
  address: string;
}

// Example dataset: 7 continents with approximate center coords & short addresses
const continents: Continent[] = [
  {
    name: "North America",
    coords: [40, -100],
    address: "Serving the USA, Canada, & Mexico",
  },
  {
    name: "South America",
    coords: [-15, -60],
    address: "Working across Brazil, Argentina, Peru, etc.",
  },
  {
    name: "Europe",
    coords: [55, 10],
    address: "Central offices in Germany, France, & UK",
  },
  {
    name: "Africa",
    coords: [5, 20],
    address: "Operating throughout Nigeria, Kenya, & more",
  },
  {
    name: "Asia",
    coords: [30, 80],
    address: "Active in China, India, Japan, & beyond",
  },
  {
    name: "Australia",
    coords: [-25, 133],
    address: "Headquartered in Sydney, covering all states",
  },
  {
    name: "Antarctica",
    coords: [-77.85, 166.6], // near McMurdo Station
    address: "Yes, even Antarctica gets a tidy up!",
  },
];

// A small helper to dynamically fit bounds (optional)
function AutoFitBounds() {
  const map = useMapEvents({
    load() {
      const group = continents.map((c) => c.coords);
      map.fitBounds(group);
    },
  });
  return null;
}

function MapAndInfoSection() {
  // Center the map somewhere in the Atlantic for a global view
  const worldCenter: LatLngExpression = [20, 0];
  const zoomLevel = 2; // Enough to see most continents

  return (
    <section className="relative w-full bg-[#101820] text-white py-12 overflow-hidden">
      {/* ========== WAVE DIVIDER (TOP) ========== */}

      <div className="relative max-w-7xl mx-auto px-4 mb-20">
        {/* ========== TITLE / HEADER ========== */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-400">
            R&C Cleaning Around the Globe
          </h2>
          <p className="mt-2 text-gray-200 max-w-2xl mx-auto">
            We proudly connect professional cleaners with clients on every
            continent. Explore our global presence and find the perfect cleaning
            service near you!
          </p>
        </motion.header>

        {/* ========== MAIN CONTENT WRAPPER ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* ========== MAP SECTION ========== */}
          <motion.div
            className="relative rounded-lg overflow-hidden shadow-lg h-[300px] md:h-[450px]"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <MapContainer
              center={worldCenter}
              zoom={zoomLevel}
              style={{ width: "100%", height: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                  OpenStreetMap
                </a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Optional auto-fit to all markers */}
              <AutoFitBounds />

              {/* Place a marker for each continent */}
              {continents.map((c, idx) => (
                <Marker key={idx} position={c.coords}>
                  <Popup>
                    <div className="text-sm">
                      <h3 className="font-bold mb-1">{c.name}</h3>
                      <p>{c.address}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

           
          </motion.div>

          {/* ========== INFO SECTION ========== */}
          <motion.div
            className="flex flex-col justify-center rounded-lg shadow-lg p-6 md:p-8 bg-gradient-to-br from-[#101820] to-[#1f2937]"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-amber-400">
                Our Worldwide Commitment
              </h3>
              <p className="text-gray-300 mt-2 leading-relaxed">
                R&C Cleaning is committed to quality and professionalism across
                continents. Our global network of dedicated cleaners is ready to
                handle any task—no matter the location or scale.
              </p>
            </div>

            <div className=" pt-4">
              <h4 className="text-lg font-semibold text-gray-100 mb-2">
                Main Corporate Office
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                1108 Berry Street,
                <br />
                Old Hickory, TN 37138 (USA)
                <br />
                Phone: (615) 554-3592
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ========== WAVE DIVIDER (BOTTOM) ========== */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none z-10">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            fillOpacity="95"
            d="M0,224L48,197.3C96,171,192,117,288,101.3C384,85,480,107,576,112C672,117,768,107,864,128C960,149,1056,203,1152,208C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
}

export default MapAndInfoSection;
