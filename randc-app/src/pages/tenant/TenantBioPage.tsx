// src/pages/TenantBioPage.tsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Country, State } from "country-state-city";
import { useAppSelector } from "../../app/hooks";

// RTK Query
import {
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
} from "../../features/tenant/tenantApi";

// UI Components
import Toast from "../../components/ui/Toast"; // your custom Toast component

// Icon Imports
import { FaEdit, FaSave, FaTimes, FaSpinner } from "react-icons/fa";

// Cloudinary helper to upload images
import { uploadMultipleImages } from "../../util/cloudinary";

/** 
 * The shape of your form data
 * Adjust if your tenant doc has more/less fields. 
 */
interface TenantBioFormData {
  aboutUs: string;
  companyPhoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactPerson: {
    name: string;
    phoneNumber: string;
    email: string;
  };
  bannerImages: string[]; // existing banner URLs
}

const TenantBioPage: React.FC = () => {
  // 1) Grab tenantId from Redux state
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  // 2) Fetch tenant data from server
  const {
    data: tenantData,
    isLoading: isTenantLoading,
    isError: isTenantError,
    error: tenantError,
    refetch,
  } = useGetTenantByIdQuery(tenantId!, {
    skip: !tenantId,
  });

  // 3) Update mutation
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation();

  // 4) Local form state
  const [formData, setFormData] = useState<TenantBioFormData>({
    aboutUs: "",
    companyPhoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    contactPerson: {
      name: "",
      phoneNumber: "",
      email: "",
    },
    bannerImages: [], // existing images
  });

  // 5) Local state for new banner files
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);

  // 6) Toast
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 7) Editing mode
  const [isEditing, setIsEditing] = useState(false);

  // 8) Populate form once we have tenantData
  useEffect(() => {
    if (tenantData) {
      setFormData({
        aboutUs: tenantData.aboutUs || "",
        companyPhoneNumber: tenantData.companyPhoneNumber || "",
        address: {
          street: tenantData.address?.street || "",
          city: tenantData.address?.city || "",
          state: tenantData.address?.state || "",
          postalCode: tenantData.address?.postalCode || "",
          country: tenantData.address?.country || "",
        },
        contactPerson: {
          name: tenantData.contactPerson?.name || "",
          phoneNumber: tenantData.contactPerson?.phoneNumber || "",
          email: tenantData.contactPerson?.email || "",
        },
        bannerImages: tenantData.bannerImages || [],
      });
    }
  }, [tenantData]);

  // 9) Generic input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    path: string[]
  ) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev };
      let pointer: any = updated;
      for (let i = 0; i < path.length - 1; i++) {
        pointer = pointer[path[i]];
      }
      pointer[path[path.length - 1]] = value;
      return updated;
    });
  };

  const handleSelectChange = (value: string, path: string[]) => {
    setFormData((prev) => {
      const updated = { ...prev };
      let pointer: any = updated;
      for (let i = 0; i < path.length - 1; i++) {
        pointer = pointer[path[i]];
      }
      pointer[path[path.length - 1]] = value;
      return updated;
    });
  };

  // 10) Banner files selection
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    // existing banner count
    const existingCount = formData.bannerImages.length;
    const allowed = 3 - existingCount;

    if (newFiles.length > allowed) {
      setToastMessage(`You can only add ${allowed} more banner image(s).`);
      setShowToast(true);
      return;
    }
    setBannerFiles(newFiles);
  };

  // Remove an existing banner URL
  const removeExistingBanner = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      bannerImages: prev.bannerImages.filter((item) => item !== url),
    }));
  };

  // Remove a local file from the preview
  const removeLocalFile = (index: number) => {
    setBannerFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 11) Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) {
      setToastMessage("Tenant ID is not available.");
      setShowToast(true);
      return;
    }

    try {
      // Upload new files if any
      let newlyUploadedUrls: string[] = [];
      if (bannerFiles.length > 0) {
        const existingCount = formData.bannerImages.length;
        const allowedCount = 3 - existingCount;
        if (bannerFiles.length > allowedCount) {
          throw new Error(`Cannot exceed 3 total banners. Already have ${existingCount}`);
        }

        newlyUploadedUrls = await uploadMultipleImages(bannerFiles, {
          folder: "tenant-banners",
          tags: ["tenant", "banners"],
        });
      }

      // Combine existing + new
      const finalBanners = [...formData.bannerImages, ...newlyUploadedUrls];
      if (finalBanners.length > 3) {
        throw new Error("Cannot exceed 3 total banner images");
      }

      // Build update payload
      const updates = {
        aboutUs: formData.aboutUs,
        companyPhoneNumber: formData.companyPhoneNumber,
        address: { ...formData.address },
        contactPerson: { ...formData.contactPerson },
        bannerImages: finalBanners,
      };

      // Submit to server
      await updateTenant({ tenantId, data: updates }).unwrap();

      setToastMessage("Tenant bio updated successfully!");
      setShowToast(true);
      setIsEditing(false);
      setBannerFiles([]); // Clear local files
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to update tenant";
      setToastMessage(msg);
      setShowToast(true);
      console.error("Error updating tenant =>", err);
    }
  };

  // 12) Loading / error states
  if (isTenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <FaSpinner className="animate-spin mr-2" />
        <span>Loading tenant data...</span>
      </div>
    );
  }
  if (isTenantError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500 p-4">
        <p className="mb-2">Failed to load tenant data: {String(tenantError)}</p>
        <button onClick={() => refetch()} className="underline text-blue-600">
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen text-gray-800">
      {/* --- Top Wave Divider --- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />
      {/* Sticky Banner */}
      <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
    
        Welcome, {user?.firstName}! Here's your Company Page!
      </div>

      {/* Toast Notification */}
      <Toast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto pt-8 pb-20 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-cyan-300 to-blue-300 pointer-events-none" />
          <h1 className="text-2xl font-bold text-gray-800 relative">
            Tenant Bio: {tenantData?.name}
          </h1>
          <p className="text-gray-500 mt-1 relative">
            Domain: {tenantData?.domain || "—"}
          </p>
        </div>

        {/* Form card */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-300 to-indigo-300 pointer-events-none" />

          {/* Edit Toggle Buttons */}
          <div className="flex justify-end mb-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaSave className="mr-2" />
                  )}
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Reset form from tenantData
                    if (tenantData) {
                      setFormData({
                        aboutUs: tenantData.aboutUs || "",
                        companyPhoneNumber: tenantData.companyPhoneNumber || "",
                        address: {
                          street: tenantData.address?.street || "",
                          city: tenantData.address?.city || "",
                          state: tenantData.address?.state || "",
                          postalCode: tenantData.address?.postalCode || "",
                          country: tenantData.address?.country || "",
                        },
                        contactPerson: {
                          name: tenantData.contactPerson?.name || "",
                          phoneNumber: tenantData.contactPerson?.phoneNumber || "",
                          email: tenantData.contactPerson?.email || "",
                        },
                        bannerImages: tenantData.bannerImages || [],
                      });
                    }
                    setBannerFiles([]);
                    setIsEditing(false);
                  }}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* About Us, Company Phone */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">About Us</label>
              <textarea
                rows={4}
                value={formData.aboutUs}
                onChange={(e) => handleInputChange(e, ["aboutUs"])}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Company Phone Number</label>
              <input
                type="text"
                value={formData.companyPhoneNumber}
                onChange={(e) => handleInputChange(e, ["companyPhoneNumber"])}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Address */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Country</label>
                <select
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  value={formData.address.country}
                  onChange={(e) =>
                    handleSelectChange(e.target.value, ["address", "country"])
                  }
                  disabled={!isEditing}
                >
                  <option value="">Select a country</option>
                  {Country.getAllCountries().map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">State</label>
                <select
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  value={formData.address.state}
                  onChange={(e) =>
                    handleSelectChange(e.target.value, ["address", "state"])
                  }
                  disabled={!isEditing || !formData.address.country}
                >
                  <option value="">Select a state</option>
                  {formData.address.country &&
                    State.getStatesOfCountry(formData.address.country).map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange(e, ["address", "city"])}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  placeholder="City name"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Street</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange(e, ["address", "street"])}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Postal Code</label>
                <input
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) => handleInputChange(e, ["address", "postalCode"])}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Contact Person</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={formData.contactPerson.name}
                  onChange={(e) => handleInputChange(e, ["contactPerson", "name"])}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.contactPerson.phoneNumber}
                  onChange={(e) => handleInputChange(e, ["contactPerson", "phoneNumber"])}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contactPerson.email}
                  onChange={(e) => handleInputChange(e, ["contactPerson", "email"])}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Banner Images Field */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Banner Images (up to 3)</h2>

            {/* Existing banner preview */}
            <div className="flex flex-wrap gap-3 mb-2">
              {formData.bannerImages.map((url) => (
                <div key={url} className="relative w-24 h-24 bg-gray-100">
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 hover:text-red-700"
                    disabled={!isEditing}
                    onClick={() => removeExistingBanner(url)}
                  >
                    <FaTimes />
                  </button>
                  <img
                    src={url}
                    alt="Banner"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>

            {/* Local files preview */}
            <div className="flex flex-wrap gap-3 mb-2">
              {bannerFiles.map((file, idx) => {
                const localUrl = URL.createObjectURL(file);
                return (
                  <div key={`${file.name}-${idx}`} className="relative w-24 h-24 bg-gray-100">
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 hover:text-red-700"
                      onClick={() => removeLocalFile(idx)}
                      disabled={!isEditing}
                    >
                      <FaTimes />
                    </button>
                    <img
                      src={localUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                );
              })}
            </div>

            {/* File input */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleBannerFileChange}
              className={`block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
              `}
              disabled={!isEditing}
            />
          </div>
        </motion.form>
      </motion.div>

      {/* --- Bottom Wave Divider --- */}
      <div className="absolute bottom-0 w-full leading-[0] z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default TenantBioPage;
