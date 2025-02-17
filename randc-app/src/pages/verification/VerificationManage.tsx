// src/pages/verification/VerificationManage.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaClipboardList,
  FaPlusCircle,
  FaCloudUploadAlt,
  FaFolderOpen,
} from 'react-icons/fa';

// For uploading to Cloudinary
import { uploadImage } from '../../util/cloudinary';

// For listing tenants
import { useListTenantsQuery } from '../../features/tenant/tenantApi';

// Your tenant verification RTK hooks
import {
  useListAllVerificationsQuery,
  useInitiateVerificationMutation,
  useUploadVerificationDocMutation,
  usePerformVerificationCheckMutation,
  useFinalizeVerificationMutation,
  TenantVerification,
} from '../../features/tenantVerification/tenantVerificationApi';

// For "react-select" country dropdown
import Select from 'react-select';

// 3) The "country-state-city" or "country-currency" library is an object, not an array
import { Country, State } from 'country-state-city';

/******************************************************************************
 * Convert the Country object into an array of { label, value }.
 * e.g. "US", { name: "United States", ... }
 ******************************************************************************/
function buildCountryOptions() {
  return Object.entries(Country.getAllCountries()).map(([code, country]) => ({
    label: `${country.name} (${code})`,
    value: code,
  }));
}

// We'll build this once. Or you can do it via useMemo:
const countryOptions = buildCountryOptions();

/******************************************************************************
 * Main VerificationManage Component
 ******************************************************************************/
export default function VerificationManage() {
  const [activeTab, setActiveTab] = useState<'initiate' | 'upload' | 'list'>('initiate');

  // 1) List all verifications
  const { data: verificationListRes, refetch } = useListAllVerificationsQuery();
  const verifications = verificationListRes?.verifications || [];

  // 2) RTK Query mutations
  const [initiateTenantVerification] = useInitiateVerificationMutation();
  const [uploadDoc] = useUploadVerificationDocMutation();
  const [performCheck] = usePerformVerificationCheckMutation();
  const [finalizeVerification] = useFinalizeVerificationMutation();

  // If you want to fetch tenants for a dropdown:
  const { data: tenantsData } = useListTenantsQuery();

  /******************************************************************************
   * Tab #1: Initiate Verification
   ******************************************************************************/
  const [selectedTenantId, setSelectedTenantId] = useState('');

  const handleInitiate = async () => {
    if (!selectedTenantId) {
      alert('Please select or enter a tenant ID');
      return;
    }
    try {
      await initiateTenantVerification({ tenantId: selectedTenantId }).unwrap();
      alert('Verification initiated successfully');
      setSelectedTenantId('');
      refetch();
    } catch (err) {
      console.error('Error initiating verification:', err);
    }
  };

  /******************************************************************************
   * Tab #2: Upload Verification Doc
   *    - Includes docNumber, expirationDate
   ******************************************************************************/
  const [verificationId, setVerificationId] = useState('');
  const [docType, setDocType] = useState('PASSPORT');
  const [fileUrl, setFileUrl] = useState('');
  const [countryValue, setCountryValue] = useState<string | null>(null);

  // NEW fields: docNumber and expirationDate
  const [docNumber, setDocNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  // The user picks a file, we upload to Cloudinary
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLocalFile(e.target.files[0]);
    }
  };

  // Actually upload the file to Cloudinary
  const handleFileUploadToCloudinary = async () => {
    if (!localFile) return;
    try {
      setIsUploading(true);
      const secureUrl = await uploadImage(localFile, {
        folder: 'tenant-docs', // optional
        tags: ['verification'], // optional
      });
      setFileUrl(secureUrl);
      setIsUploading(false);
      alert('File uploaded to Cloudinary successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      alert((err as Error).message);
      setIsUploading(false);
    }
  };

  // Once we have a "fileUrl" (Cloudinary URL) + verificationId + docType + country, etc.
  // we can call the "uploadDoc" mutation to attach that doc to the verification record
  const handleUploadDoc = async () => {
    if (!verificationId) {
      alert('Enter a verificationId');
      return;
    }
    if (!docType) {
      alert('Choose a docType');
      return;
    }
    if (!fileUrl) {
      alert('No fileUrl. Please upload a file first.');
      return;
    }
    if (!countryValue) {
      alert('Select a country');
      return;
    }
    // docNumber and expirationDate are optional, but let's include them anyway
    try {
      await uploadDoc({
        verificationId,
        docType,
        fileUrl,
        country: countryValue,
        docNumber: docNumber || undefined,
        expirationDate: expirationDate || undefined,
      }).unwrap();
      alert('Document recorded successfully in the verification record!');
      // Clear form
      setVerificationId('');
      setDocType('PASSPORT');
      setFileUrl('');
      setLocalFile(null);
      setCountryValue(null);
      setDocNumber('');
      setExpirationDate('');
      refetch();
    } catch (err) {
      console.error('Error uploading doc:', err);
    }
  };

  /******************************************************************************
   * Tab #3: List All Verifications
   ******************************************************************************/
  const handlePerformCheck = async (verifId: string) => {
    try {
      await performCheck({ verificationId: verifId }).unwrap();
      alert('External check performed');
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinalize = async (verifId: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      await finalizeVerification({ verificationId: verifId, status }).unwrap();
      alert(`Verification status changed to: ${status}`);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  /******************************************************************************
   * Render
   ******************************************************************************/
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
     <header className="sticky top-0 z-20 bg-yellow-200 text-yellow-800 p-1 shadow-md mb-4">
        <strong>Vital Message:</strong> Manage Tenant Verifications Here!
      </header>

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
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />

      <div className="relative z-10 max-w-5xl mx-auto p-4 space-y-4">
        {/* Main Heading */}
        <motion.h1
          className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaClipboardList className="text-gray-500" />
          Verification Dashboard
        </motion.h1>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <TabButton
            label="Initiate"
            icon={<FaPlusCircle />}
            active={activeTab === 'initiate'}
            onClick={() => setActiveTab('initiate')}
          />
          <TabButton
            label="Upload Doc"
            icon={<FaCloudUploadAlt />}
            active={activeTab === 'upload'}
            onClick={() => setActiveTab('upload')}
          />
          <TabButton
            label="All Verifications"
            icon={<FaFolderOpen />}
            active={activeTab === 'list'}
            onClick={() => setActiveTab('list')}
          />
        </div>

        {/* Tab Panels with AnimatePresence */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === 'initiate' && (
              <MotionPanel key="initiate-tab">
                <TabInitiate
                  tenantsData={tenantsData ?? []}
                  selectedTenantId={selectedTenantId}
                  setSelectedTenantId={setSelectedTenantId}
                  handleInitiate={handleInitiate}
                />
              </MotionPanel>
            )}

            {activeTab === 'upload' && (
              <MotionPanel key="upload-tab">
                <TabUploadDoc
                  verificationId={verificationId}
                  setVerificationId={setVerificationId}
                  docType={docType}
                  setDocType={setDocType}
                  fileUrl={fileUrl}
                  setFileUrl={setFileUrl}
                  countryValue={countryValue}
                  setCountryValue={setCountryValue}
                  handleUploadDoc={handleUploadDoc}
                  countryOptions={countryOptions}
                  localFile={localFile}
                  handleFileSelection={handleFileSelection}
                  handleFileUploadToCloudinary={handleFileUploadToCloudinary}
                  isUploading={isUploading}

                  /* NEW FIELDS */
                  docNumber={docNumber}
                  setDocNumber={setDocNumber}
                  expirationDate={expirationDate}
                  setExpirationDate={setExpirationDate}
                />
              </MotionPanel>
            )}

            {activeTab === 'list' && (
              <MotionPanel key="list-tab">
                <TabAllVerifications
                  verifications={verifications}
                  handlePerformCheck={handlePerformCheck}
                  handleFinalize={handleFinalize}
                />
              </MotionPanel>
            )}
          </AnimatePresence>
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
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,181,576,224C672,235,768,181,864,165.3C960,149,1056,75,1152,69.3C1248,64,1344,96,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
}

/******************************************************************************
 * Reusable TabButton
 ******************************************************************************/
interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}
function TabButton({ label, icon, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded border
        ${
          active
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/******************************************************************************
 * MotionPanel - a simple framer-motion wrapper for tab content
 ******************************************************************************/
function MotionPanel({ children, ...props }: { children: React.ReactNode }) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded p-4"
    >
      {children}
    </motion.div>
  );
}

/******************************************************************************
 * Tab #1: Initiate Verification
 ******************************************************************************/
interface Tenant {
  _id: string;
  name: string;
  // other fields if needed
}

interface TabInitiateProps {
  tenantsData: Tenant[];
  selectedTenantId: string;
  setSelectedTenantId: React.Dispatch<React.SetStateAction<string>>;
  handleInitiate: () => void;
}
function TabInitiate({
  tenantsData,
  selectedTenantId,
  setSelectedTenantId,
  handleInitiate,
}: TabInitiateProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Initiate Verification</h2>

      <label className="block text-sm text-gray-600 mb-1">Select Tenant</label>
      <select
        className="border rounded p-2 w-full"
        value={selectedTenantId}
        onChange={(e) => setSelectedTenantId(e.target.value)}
      >
        <option value="">-- Choose a Tenant --</option>
        {tenantsData.map((t) => (
          <option key={t._id} value={t._id}>
            {t.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleInitiate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Initiate
      </button>
    </div>
  );
}

/******************************************************************************
 * Tab #2: Upload Verification Doc (enhanced to handle local file -> Cloudinary)
 ******************************************************************************/
interface CountryOption {
  value: string;
  label: string;
  currency?: string;
}

interface TabUploadDocProps {
  verificationId: string;
  setVerificationId: React.Dispatch<React.SetStateAction<string>>;
  docType: string;
  setDocType: React.Dispatch<React.SetStateAction<string>>;
  fileUrl: string;
  setFileUrl: React.Dispatch<React.SetStateAction<string>>;
  countryValue: string | null;
  setCountryValue: React.Dispatch<React.SetStateAction<string | null>>;
  handleUploadDoc: () => void;
  countryOptions: CountryOption[];
  localFile: File | null;
  handleFileSelection: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUploadToCloudinary: () => Promise<void>;
  isUploading: boolean;

  // NEW FIELDS
  docNumber: string;
  setDocNumber: React.Dispatch<React.SetStateAction<string>>;
  expirationDate: string;
  setExpirationDate: React.Dispatch<React.SetStateAction<string>>;
}
function TabUploadDoc({
  verificationId,
  setVerificationId,
  docType,
  setDocType,
  fileUrl,
  setFileUrl,
  countryValue,
  setCountryValue,
  handleUploadDoc,
  countryOptions,
  localFile,
  handleFileSelection,
  handleFileUploadToCloudinary,
  isUploading,

  // NEW fields
  docNumber,
  setDocNumber,
  expirationDate,
  setExpirationDate,
}: TabUploadDocProps) {
  // We'll use ReactSelect for the country instead of a plain <select>
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    countryValue
      ? countryOptions.find((co) => co.value === countryValue) || null
      : null
  );

  // When user selects from ReactSelect
  const handleCountryChange = (option: CountryOption | null) => {
    setSelectedCountry(option);
    setCountryValue(option ? option.value : null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Upload Verification Doc</h2>

      {/* Verification ID */}
      <label className="block text-sm text-gray-600 mb-1">Verification ID</label>
      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="Verification ID"
        value={verificationId}
        onChange={(e) => setVerificationId(e.target.value)}
      />

      {/* Document Type */}
      <label className="block text-sm text-gray-600 mb-1">Document Type</label>
      <select
        className="border p-2 w-full rounded"
        value={docType}
        onChange={(e) => setDocType(e.target.value)}
      >
        <option value="PASSPORT">Passport</option>
        <option value="DRIVERS_LICENSE">Driver's License</option>
        <option value="NATIONAL_ID">National ID</option>
      </select>

      {/* NEW: Document Number */}
      <label className="block text-sm text-gray-600 mb-1">Document Number (Optional)</label>
      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="e.g. 123456789"
        value={docNumber}
        onChange={(e) => setDocNumber(e.target.value)}
      />

      {/* NEW: Expiration Date */}
      <label className="block text-sm text-gray-600 mb-1">Expiration Date (Optional)</label>
      <input
        type="date"
        className="border p-2 w-full rounded"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
      />

      {/* File input and Upload-to-Cloudinary section */}
      <label className="block text-sm text-gray-600 mb-1">Local File</label>
      <input type="file" onChange={handleFileSelection} className="w-full mb-2" />

      <button
        type="button"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        onClick={handleFileUploadToCloudinary}
        disabled={!localFile || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload to Cloudinary'}
      </button>

      {fileUrl && (
        <div className="text-sm text-green-600">
          Cloudinary URL:{' '}
          <a href={fileUrl} target="_blank" rel="noreferrer">
            {fileUrl}
          </a>
        </div>
      )}

      {/* ReactSelect for Country */}
      <label className="block text-sm text-gray-600 mb-1">Country</label>
      <Select
        options={countryOptions}
        value={selectedCountry}
        onChange={handleCountryChange}
        isClearable
        placeholder="Select Country..."
      />

      {/* The final step to record doc in the verification record */}
      <button
        onClick={handleUploadDoc}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save to Verification
      </button>
    </div>
  );
}

/******************************************************************************
 * Tab #3: All Verifications
 ******************************************************************************/
interface TabAllProps {
  verifications: TenantVerification[];
  handlePerformCheck: (verifId: string) => void;
  handleFinalize: (verifId: string, status: 'VERIFIED' | 'REJECTED') => void;
}
function TabAllVerifications({
  verifications,
  handlePerformCheck,
  handleFinalize,
 
}: TabAllProps) {
    console.log('verifications:', verifications);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2 text-gray-800">All Verifications</h2>
      {verifications.length === 0 ? (
        <p className="text-gray-500">No verification records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Tenant</th>
                <th className="px-4 py-2 border text-left">Status</th>
                <th className="px-4 py-2 border text-left">Docs</th>
                <th className="px-4 py-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((v) => (
                <tr key={v._id}>
                  <td className="border px-4 py-2">{v._id}</td>
                  <td className="border px-4 py-2">{String(v.tenant)}</td>
                  <td className="border px-4 py-2">{v.status}</td>
                  <td className="border px-4 py-2">
                    {v.documents.map((doc, idx) => (
                      <div key={idx} className="mb-2">
                        <p>Type: {doc.docType}</p>
                        <p>Country: {doc.country}</p>
                        {/* Display the new fields if they exist */}
                        {doc.docNumber && <p>Doc # : {doc.docNumber}</p>}
                        {doc.expirationDate && (
                          <p>
                            Expires:{' '}
                            {new Date(doc.expirationDate).toLocaleDateString()}
                          </p>
                        )}
                        <hr className="my-1" />
                      </div>
                    ))}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    {v.status === 'IN_REVIEW' && (
                      <button
                        onClick={() => handlePerformCheck(v._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Check
                      </button>
                    )}
                    {v.status === 'IN_REVIEW' && (
                      <>
                        <button
                          onClick={() => handleFinalize(v._id, 'VERIFIED')}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleFinalize(v._id, 'REJECTED')}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {v.status === 'PENDING' && (
                      <span className="text-gray-500">Upload docs to proceed</span>
                    )}
                    {v.status === 'VERIFIED' && (
                      <span className="text-green-600">Verified</span>
                    )}
                    {v.status === 'REJECTED' && (
                      <span className="text-red-600">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
