// src/pages/tenant/TenantSettings.tsx

import React, { useState, ChangeEvent, FormEvent } from "react";

interface TenantData {
  id: number;
  name: string;
  contactEmail: string;
  domain: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
}

// Mock tenant settings data
const mockTenantData: TenantData = {
  id: 1,
  name: "Acme Corp",
  contactEmail: "support@acme.com",
  domain: "acme.io",
  plan: "Enterprise",
  isActive: true,
  createdAt: "2024-05-10",
};

function TenantSettings() {
  const [tenant, setTenant] = useState<TenantData>(mockTenantData);

  // Handle changes for text inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTenant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle toggling isActive
  const handleIsActiveToggle = () => {
    setTenant((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  // Simulate a submit to an API
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Updating tenant settings:", tenant);
    alert("Tenant settings updated!");
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* --- Top Wave Divider (Rotated) --- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />


      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Tenant Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded">
          {/* Tenant Name */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Tenant Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={tenant.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="contactEmail"
            >
              Contact Email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={tenant.contactEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {/* Domain */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="domain">
              Domain
            </label>
            <input
              id="domain"
              name="domain"
              type="text"
              value={tenant.domain}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {/* Plan */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="plan">
              Plan
            </label>
            <select
              id="plan"
              name="plan"
              value={tenant.plan}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          {/* Active toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Is Active:</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tenant.isActive}
                onChange={handleIsActiveToggle}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2 text-sm">
                {tenant.isActive ? "Active" : "Inactive"}
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Update Settings
          </button>
        </form>

        {/* Display additional info */}
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <p className="text-gray-700 text-sm">
            <strong>ID:</strong> {tenant.id}
          </p>
          <p className="text-gray-700 text-sm">
            <strong>Created At:</strong> {tenant.createdAt}
          </p>
        </div>
      </div>

      {/* --- Bottom Wave Divider --- */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
}

export default TenantSettings;
