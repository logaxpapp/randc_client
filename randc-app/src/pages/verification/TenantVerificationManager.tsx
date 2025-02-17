// src/pages/verification/VerificationManage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "../../app/hooks";

// For Cloudinary uploading
import { uploadImage } from "../../util/cloudinary";

// RTK Query hooks
import {
  useListAllVerificationsQuery,
  useInitiateVerificationMutation,
  useUploadVerificationDocMutation,
  usePerformVerificationCheckMutation,
  useFinalizeVerificationMutation,
  TenantVerification,
} from "../../features/tenantVerification/tenantVerificationApi";

// "country-state-city" API
import { Country } from "country-state-city";

// Convert countries to options array
const countryOptions = Object.entries(Country.getAllCountries()).map(
  ([code, country]) => ({
    label: `${country.name} (${code})`,
    value: code,
  })
);

export default function VerificationManage() {
  // Get user details from Redux (including tenantId)
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  // RTK Query hooks
  const { data: verificationListRes, refetch } = useListAllVerificationsQuery();
  const verifications = verificationListRes?.verifications || [];

  const [initiateTenantVerification] = useInitiateVerificationMutation();
  const [uploadDoc] = useUploadVerificationDocMutation();
  const [performCheck] = usePerformVerificationCheckMutation();
  const [finalizeVerification] = useFinalizeVerificationMutation();

  // Local form states for "Upload Verification Doc"
  const [verificationId, setVerificationId] = useState("");
  const [docType, setDocType] = useState("PASSPORT");
  const [fileUrl, setFileUrl] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  // Local file state for Cloudinary upload
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Modal state for viewing a verification record
  const [selectedVerification, setSelectedVerification] = useState<TenantVerification | null>(null);

  // (1) Initiate Verification
  const handleInitiate = async () => {
    if (!tenantId) {
      alert("No Tenant ID found in global state.");
      return;
    }
    try {
      await initiateTenantVerification({ tenantId }).unwrap();
      alert("Verification initiated");
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // (2) Local File Selection + Cloudinary Upload
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLocalFile(e.target.files[0]);
    }
  };

  const handleFileUploadToCloudinary = async () => {
    if (!localFile) {
      alert("No file selected to upload.");
      return;
    }
    try {
      setIsUploading(true);
      const secureUrl = await uploadImage(localFile, {
        folder: "tenant-docs",
        tags: ["verification"],
      });
      setFileUrl(secureUrl);
      setIsUploading(false);
      alert("File uploaded to Cloudinary successfully!");
    } catch (err) {
      console.error("Error uploading file:", err);
      alert((err as Error).message);
      setIsUploading(false);
    }
  };

  // (3) Upload Verification Document
  const handleUploadDoc = async () => {
    if (!verificationId || !docType || !fileUrl || !countryValue) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await uploadDoc({
        verificationId,
        docType,
        fileUrl,
        country: countryValue,
        docNumber: docNumber || undefined,
        expirationDate: expirationDate || undefined,
      }).unwrap();
      alert("Doc uploaded");
      // Reset form states
      setVerificationId("");
      setDocType("PASSPORT");
      setFileUrl("");
      setCountryValue("");
      setDocNumber("");
      setExpirationDate("");
      setLocalFile(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // (4) Perform External Check
  const handlePerformCheck = async (verifId: string) => {
    try {
      await performCheck({ verificationId: verifId }).unwrap();
      alert("External check performed");
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // (5) Finalize Verification (Approve/Reject)
  const handleFinalize = async (
    verifId: string,
    status: "VERIFIED" | "REJECTED"
  ) => {
    try {
      await finalizeVerification({ verificationId: verifId, status }).unwrap();
      alert(`Verification ${status}`);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // Close the modal
  const closeModal = () => setSelectedVerification(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-lime-100 relative">
      {/* Vital Message Banner (Always Visible) */}
      <header className="sticky top-0 z-20 bg-yellow-200 text-yellow-800 p-1 shadow-md ">
        <strong>Vital Message:</strong> Manage Tenant Verifications Here!
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-6 space-y-6">
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold text-blue-800 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Tenant Verification Management
        </motion.h1>

        {/* Actions Grid */}
        <div className="gap-6 ">
          {/* Initiate Verification Card */}
          <motion.div
            className="bg-white shadow rounded p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Initiate Verification</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Tenant ID</label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-gray-100"
                value={tenantId ?? ""}
                readOnly
              />
            </div>
            <button
              onClick={handleInitiate}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              Initiate
            </button>
          </motion.div>

          {/* Upload Verification Document Card */}
          <motion.div
            className="bg-white shadow rounded p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-4">Upload Verification Doc</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Verification ID */}
              <div>
                <label className="block text-gray-700 mb-1">Verification ID</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Verification ID"
                  value={verificationId}
                  onChange={(e) => setVerificationId(e.target.value)}
                />
              </div>
              {/* Document Type */}
              <div>
                <label className="block text-gray-700 mb-1">Document Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="PASSPORT">Passport</option>
                  <option value="DRIVERS_LICENSE">Driver's License</option>
                  <option value="NATIONAL_ID">National ID</option>
                </select>
              </div>
              {/* Document Number */}
              <div>
                <label className="block text-gray-700 mb-1">Document Number</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 123456789"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                />
              </div>
              {/* Expiration Date */}
              <div>
                <label className="block text-gray-700 mb-1">Expiration Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
              </div>
              {/* Country */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Country</label>
                <select
                  className="w-full p-2 border rounded"
                  value={countryValue}
                  onChange={(e) => setCountryValue(e.target.value)}
                >
                  <option value="">-- Choose Country --</option>
                  {countryOptions.map((co) => (
                    <option key={co.value} value={co.value}>
                      {co.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* File URL */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">
                  File URL (Manual or from Cloudinary)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="File URL"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Local File Upload */}
            <div className="mt-4">
              <label className="block text-gray-700 mb-1">Select Local File</label>
              <input type="file" onChange={handleFileSelection} className="w-full mb-2" />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleFileUploadToCloudinary}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
                  disabled={!localFile || isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload to Cloudinary"}
                </button>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-600 text-sm underline"
                  >
                    View Uploaded File
                  </a>
                )}
              </div>
            </div>

            <button
              onClick={handleUploadDoc}
              className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              Upload Doc
            </button>
          </motion.div>
        </div>

        {/* List All Verifications */}
        <motion.div
          className="bg-white shadow rounded p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">All Verifications</h2>
          {verifications.length === 0 ? (
            <p className="text-gray-500">No verification records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border text-left">ID</th>
                    <th className="px-4 py-2 border text-left">Tenant</th>
                    <th className="px-4 py-2 border text-left">Status</th>
                    <th className="px-4 py-2 border text-left">Docs</th>
                    <th className="px-4 py-2 border text-left">Doc Number</th>
                    <th className="px-4 py-2 border text-left">Expiration Date</th>
                    <th className="px-4 py-2 border text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {verifications.map((v: TenantVerification) => (
                    <tr key={v._id}>
                      <td className="border px-4 py-2">{v._id}</td>
                      <td className="border px-4 py-2">{String(v.tenant)}</td>
                      <td className="border px-4 py-2">{v.status}</td>
                      <td className="border px-4 py-2">
                        {v.documents.map((doc, idx) => (
                          <div key={idx}>
                            {doc.docType} - {doc.country}
                          </div>
                        ))}
                      </td>
                      <td className="border px-4 py-2">{v.docNumber}</td>
                      <td className="border px-4 py-2">{v.expirationDate}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => setSelectedVerification(v)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* Modal for Viewing Verification Details */}
      {selectedVerification && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          {/* Modal Content */}
          <div className="relative bg-white rounded shadow-lg p-6 w-11/12 md:w-1/2 z-10 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Verification Details</h2>
            <p>
              <strong>ID:</strong> {selectedVerification._id}
            </p>
            <p>
            <strong>Tenant:</strong>{" "}
            {typeof selectedVerification.tenant === "object"
                ? (selectedVerification.tenant as { name?: string }).name || "N/A"
                : selectedVerification.tenant}
            </p>
            <p>
              <strong>Status:</strong> {selectedVerification.status}
            </p>
            <div className="mb-2">
              <strong>Documents:</strong>
              <ul className="list-disc pl-5">
                {selectedVerification.documents.map((doc, idx) => (
                  <li key={idx}>
                    {doc.docType} - {doc.country}
                  </li>
                ))}
              </ul>
            </div>
            <p>
              <strong>Doc Number:</strong> {selectedVerification.docNumber}
            </p>
            <p>
              <strong>Expiration Date:</strong> {selectedVerification.expirationDate}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Wave Divider */}
      <div className="relative">
        <svg
          className="w-full h-20 md:h-32 lg:h-48"
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
    </div>
  );
}
