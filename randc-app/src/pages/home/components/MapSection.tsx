// src/pages/home/components/MapAndInfoSection.tsx

import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapAndInfoSection() {
  // Approx coords for Old Hickory, TN
  const center: LatLngExpression = [36.2523, -86.6377];

  return (
    <section className="w-full bg-gradient-to-r from-blue-50 to-gray-50 py-10 overflow-hidden">
      <div
        className="
          max-w-7xl 
          mx-auto 
          px-4 
          grid
          grid-cols-1 
          md:grid-cols-5
          gap-6
          items-stretch
        "
        style={{ minHeight: '450px' }}
      >
        {/* LEFT COLUMN: MAP */}
        <motion.div
          className="
            bg-white
            rounded
            shadow
            overflow-hidden
            h-[300px]
            md:h-auto
            md:col-span-3
            w-full
          "
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <MapContainer
            center={center}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={center}>
              <Popup>R&C Corporate HQ</Popup>
            </Marker>
          </MapContainer>
        </motion.div>

        {/* RIGHT COLUMN: INFO CARD */}
        <motion.div
          className="
            bg-white
            rounded
            shadow
            p-6
            flex
            flex-col
            justify-center
            md:col-span-2
          "
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-blue-800 mb-3">
            R&C Cleaning Corporate
          </h2>
          <p className="text-gray-700 mb-4">
            We proudly connect professional cleaners with clients across the nation.
            Our marketplace ensures top-tier cleaning services, flexible bookings,
            and a commitment to quality—every time.
          </p>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Address
            </h3>
            <p className="text-gray-600 leading-relaxed">
              1108 Berry Street,<br />
              Old Hickory, TN 37138<br />
              United States
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default MapAndInfoSection;
