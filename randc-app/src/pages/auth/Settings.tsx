import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useEnableMFAMutation,
  useVerifyMFASetupMutation,
} from '../../features/auth/authApi';

import { useGetTenantByIdQuery, useUpdateTenantMutation } from '../../features/tenant/tenantApi';
import { useListPlansQuery } from '../../features/subscriptionPlan/subscriptionPlanApi';

import WorkingHoursSection from '../settings/WorkingHoursSection';
import BreaksSection from '../settings/BreaksSection';
import TenantBookingSettings from '../settings/TenantBookingSettings';
import AmenitiesAndSafetySection from '../settings/AmenitiesAndSafetySection';
import PromoManager from '../promo/PromoManager';

import {
  FaSync,
  FaSave,
  FaUserShield,
  FaUser,
  FaLock,
  FaBuilding,
  FaShoppingCart,
  FaShieldAlt,
  FaChevronRight,
  FaImage,
  FaPhone,
  FaInfoCircle,
  FaGlobe,
  FaCog,
  FaClock,
  FaCoffee,
} from 'react-icons/fa';

type SettingsTab =
  | 'PROFILE'
  | 'PASSWORD'
  | 'TENANT'
  | 'SUBSCRIPTION'
  | 'SECURITY'
  | 'WORKING_HOURS'
  | 'BREAKS'
  | 'BOOKING_SETTINGS'
  | 'AMENITIES_AND_SAFETY'
  | 'PROMO';

interface ProfileFormData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface TenantFormData {
  name?: string;
  domain?: string;
  aboutUs?: string;
}

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');

  // Current user from Redux
  const user = useAppSelector((state) => state.auth.user);
  const userRoles: string[] = user?.roles ?? [];

  // Fetch user profile
  const {
    data: profileData,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  // Update profile
  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();

  // Change password
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

  // Tenant data
  const tenantId = user?.tenant;
  const {
    data: tenantData,
    isLoading: tenantLoading,
    refetch: refetchTenant,
  } = useGetTenantByIdQuery(tenantId, { skip: !tenantId });
  const [updateTenant, { isLoading: updatingTenant }] = useUpdateTenantMutation();

  // Subscription plans
  const { data: subscriptionPlans, isLoading: subsLoading } = useListPlansQuery(undefined, {});

  // MFA
  const [enableMFA, { isLoading: enablingMFA }] = useEnableMFAMutation();
  const [verifyMFASetup, { isLoading: verifyingMFA }] = useVerifyMFASetupMutation();

  // Local form states
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    profileImage: user?.profileImage || '',
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [tenantForm, setTenantForm] = useState<TenantFormData>({
    name: '',
    domain: '',
    aboutUs: '',
  });

  // MFA local states
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState<string | null>(null);
  const [mfaToken, setMfaToken] = useState<string>('');

  // Pre-fill forms
  useEffect(() => {
    if (profileData?.user) {
      setProfileForm({
        firstName: profileData.user.firstName || '',
        lastName: profileData.user.lastName || '',
        phoneNumber: profileData.user.phoneNumber || '',
        profileImage: profileData.user.profileImage || '',
      });
    }
  }, [profileData]);

  useEffect(() => {
    if (tenantData) {
      setTenantForm({
        name: tenantData.name || '',
        domain: tenantData.domain || '',
        aboutUs: tenantData.aboutUs || '',
      });
    }
  }, [tenantData]);

  // Handlers
  const handleProfileSave = async () => {
    try {
      await updateProfile(profileForm).unwrap();
      refetchProfile();
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to update profile.');
    }
  };

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      alert('Password changed successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to change password.');
    }
  };

  const handleTenantSave = async () => {
    if (!tenantId) return;
    try {
      await updateTenant({ tenantId, data: tenantForm }).unwrap();
      refetchTenant();
      alert('Tenant updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to update tenant.');
    }
  };

  // MFA
  const handleEnableMFA = async () => {
    try {
      const response = await enableMFA().unwrap();
      // The server returns { qrDataUrl, base32 }
      setQrDataUrl(response.qrDataUrl);
      setManualCode(response.base32);
    } catch (error: any) {
      console.error(error);
      alert(error?.data?.message || 'Failed to enable MFA.');
    }
  };

  const handleVerifyMFA = async () => {
    if (!mfaToken) {
      alert('Please enter the 6-digit token from your Authenticator app.');
      return;
    }
    try {
      await verifyMFASetup({ token: mfaToken }).unwrap();
      alert('MFA enabled successfully!');
      refetchProfile();
      setQrDataUrl(null);
      setManualCode(null);
      setMfaToken('');
    } catch (error: any) {
      console.error(error);
      alert(error?.data?.message || 'Invalid MFA code.');
    }
  };

  // Tabs
  const renderTabButtons = () => {
    const tabs: {
      key: SettingsTab;
      label: string;
      icon: JSX.Element;
      condition?: boolean;
    }[] = [
      { key: 'PROFILE', label: 'Profile', icon: <FaUser /> },
      { key: 'PASSWORD', label: 'Password', icon: <FaLock /> },
      {
        key: 'TENANT',
        label: 'Tenant',
        icon: <FaBuilding />,
        condition: (userRoles.includes('ADMIN') || userRoles.includes('CLEANER')) && tenantId,
      },
      {
        key: 'SUBSCRIPTION',
        label: 'Subscription',
        icon: <FaShoppingCart />,
        condition: userRoles.includes('ADMIN'),
      },
      { key: 'SECURITY', label: 'Security', icon: <FaShieldAlt /> },
      {
        key: 'WORKING_HOURS',
        label: 'Work Hours',
        icon: <FaClock />,
        condition: userRoles.includes('CLEANER') && tenantId,
      },
      {
        key: 'BREAKS',
        label: 'Breaks',
        icon: <FaCoffee />,
        condition: userRoles.includes('CLEANER') && tenantId,
      },
      {
        key: 'BOOKING_SETTINGS',
        label: 'Booking',
        icon: <FaCog />,
        condition: userRoles.includes('CLEANER') && tenantId,
      },
      {
        key: 'AMENITIES_AND_SAFETY',
        label: 'Amenities&Safety',
        icon: <FaShieldAlt />,
        condition: userRoles.includes('CLEANER') && tenantId,
      },
      {
        key: 'PROMO',
        label: 'Promo',
        icon: <FaShieldAlt />,
        condition: userRoles.includes('CLEANER') && tenantId,
      },
    ];

    return (
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map((tab) => {
          if (tab.condition === false) return null;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center px-4 py-2 rounded-t transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // Section renders
  const renderProfileSection = () => (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FaUser className="mr-2" />
        Profile Information
      </h2>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="First Name"
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={profileForm.firstName || ''}
              onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
            />
          </div>
          {/* Last Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Last Name"
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={profileForm.lastName || ''}
              onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="relative mt-6">
          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Phone Number"
            className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={profileForm.phoneNumber || ''}
            onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
          />
        </div>

        {/* Profile Image URL */}
        <div className="relative mt-6">
          <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Profile Image URL"
            className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={profileForm.profileImage || ''}
            onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.value })}
          />
        </div>

        <div className="text-right mt-8">
          <button
            type="button"
            onClick={handleProfileSave}
            disabled={updatingProfile}
            className="flex items-center bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
          >
            {updatingProfile && <FaSync className="animate-spin mr-2" />}
            <FaSave className="mr-2" />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );

  const renderPasswordSection = () => (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FaLock className="mr-2" />
        Change Password
      </h2>
      <form>
        {/* Current Password */}
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="Current Password"
            className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          />
        </div>

        {/* New Password */}
        <div className="relative mt-6">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="New Password"
            className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />
        </div>

        {/* Confirm New Password */}
        <div className="relative mt-6">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={passwordForm.confirmNewPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })
            }
          />
        </div>

        <div className="text-right mt-8">
          <button
            type="button"
            onClick={handlePasswordSave}
            disabled={changingPassword}
            className="flex items-center bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            {changingPassword && <FaSync className="animate-spin mr-2" />}
            <FaUserShield className="mr-2" />
            Update Password
          </button>
        </div>
      </form>
    </div>
  );

  const renderTenantSection = () => (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FaBuilding className="mr-2" />
        Tenant Settings
      </h2>
      {tenantLoading ? (
        <p className="text-gray-500">Loading tenant...</p>
      ) : (
        <form>
          {/* Tenant Name */}
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tenant Name"
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tenantForm.name || ''}
              onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
            />
          </div>

          {/* Domain */}
          <div className="relative mt-6">
            <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Domain"
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tenantForm.domain || ''}
              onChange={(e) => setTenantForm({ ...tenantForm, domain: e.target.value })}
            />
          </div>

          {/* About Us */}
          <div className="relative mt-6">
            <FaInfoCircle className="absolute left-3 top-3 text-gray-400" />
            <textarea
              placeholder="About Us"
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tenantForm.aboutUs || ''}
              onChange={(e) => setTenantForm({ ...tenantForm, aboutUs: e.target.value })}
              rows={4}
            />
          </div>

          <div className="text-right mt-8">
            <button
              type="button"
              onClick={handleTenantSave}
              disabled={updatingTenant}
              className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              {updatingTenant && <FaSync className="animate-spin mr-2" />}
              <FaSave className="mr-2" />
              Save Tenant
            </button>
          </div>
        </form>
      )}
    </div>
  );

  const renderSubscriptionSection = () => (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FaShoppingCart className="mr-2" />
        Subscription Management
      </h2>
      {subsLoading ? (
        <p className="text-gray-500">Loading subscription plans...</p>
      ) : (
        <div>
          <p className="mb-6 text-gray-600">
            Here you can view or upgrade your subscription plan.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptionPlans?.map((plan: any) => (
              <div
                key={plan._id}
                className="border border-gray-300 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <p className="text-indigo-600 font-semibold">Price: ${plan.price}</p>
                <button
                  className="mt-4 flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  // onClick={() => handlePlanUpgrade(plan._id)}
                >
                  Upgrade <FaChevronRight className="ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSecuritySection = () => {
    const mfaEnabled = profileData?.user?.mfaEnabled ?? false;
    return (
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FaShieldAlt className="mr-2" />
          Security / MFA
        </h2>

        {mfaEnabled ? (
          <div className="p-4 bg-green-100 border border-green-400 rounded-md">
            <p className="text-green-700">
              MFA is currently <strong>enabled</strong> on your account.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600">
              You do not currently have MFA enabled. For additional security, you can enable
              TOTP-based MFA:
            </p>

            {/* Button to generate secret + QR */}
            {!qrDataUrl && (
              <button
                onClick={handleEnableMFA}
                disabled={enablingMFA}
                className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {enablingMFA && <FaSync className="animate-spin mr-2" />}
                Enable MFA
              </button>
            )}

            {/* Show QR + manual code if available */}
            {qrDataUrl && (
              <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
                <p className="mb-4 text-gray-700">
                  Scan this QR code with Google Authenticator or a similar app:
                </p>
                <div className="flex justify-center mb-4">
                  <img src={qrDataUrl} alt="MFA QR code" className="w-40 h-40" />
                </div>

                {manualCode && (
                  <p className="mb-4 text-sm text-gray-700">
                    Or manually enter this secret: <strong>{manualCode}</strong>
                  </p>
                )}

                <p className="mb-2 text-gray-700">
                  After scanning, please enter the 6-digit code from your Authenticator:
                </p>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. 123456"
                    value={mfaToken}
                    onChange={(e) => setMfaToken(e.target.value)}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleVerifyMFA}
                    disabled={verifyingMFA}
                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 ml-4 disabled:opacity-50"
                  >
                    {verifyingMFA && <FaSync className="animate-spin mr-2" />}
                    Verify
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Additional sections
  const renderWorkingHoursSection = () => <WorkingHoursSection />;
  const renderBreaksSection = () => <BreaksSection />;
  const renderBookingSettingsSection = () => <TenantBookingSettings />;
  const renderAmenitiesAndSafetySection = () => <AmenitiesAndSafetySection />;
  const renderPromoSection = () => <PromoManager />;

  // Main return with wave/gradient + sticky banner
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* ─────────────────────────────────────────────────────
          Vital Message Banner (Sticky)
         ───────────────────────────────────────────────────── */}
         <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
        <strong>Vital Message:</strong> Manage Profile Efficiently!
      </div>
      
      {/* ─────────────────────────────────────────────────────
          Top Wave (Rotated)
         ───────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112
              C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320
              L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320
              C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320
              L0,320Z"
          />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────
          Background Gradient
         ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

      {/* ─────────────────────────────────────────────────────
          MAIN CONTENT (above the waves/gradient)
         ───────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <FaCog className="mr-2" />
          Settings
        </h1>

        {/* Render tab buttons */}
        {renderTabButtons()}

        {/* Tab content */}
        <div className="mt-4">
          {activeTab === 'PROFILE' && renderProfileSection()}
          {activeTab === 'PASSWORD' && renderPasswordSection()}
          {activeTab === 'TENANT' &&
            (userRoles.includes('ADMIN') || userRoles.includes('CLEANER')) &&
            renderTenantSection()}
          {activeTab === 'SUBSCRIPTION' &&
            userRoles.includes('ADMIN') &&
            renderSubscriptionSection()}
          {activeTab === 'SECURITY' && renderSecuritySection()}
          {activeTab === 'WORKING_HOURS' &&
            userRoles.includes('CLEANER') &&
            renderWorkingHoursSection()}
          {activeTab === 'BREAKS' && userRoles.includes('CLEANER') && renderBreaksSection()}
          {activeTab === 'BOOKING_SETTINGS' &&
            (userRoles.includes('ADMIN') || userRoles.includes('CLEANER')) &&
            renderBookingSettingsSection()}
          {activeTab === 'AMENITIES_AND_SAFETY' &&
            (userRoles.includes('ADMIN') || userRoles.includes('CLEANER')) &&
            renderAmenitiesAndSafetySection()}
          {activeTab === 'PROMO' && userRoles.includes('CLEANER') && renderPromoSection()}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────
          Bottom Wave
         ───────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224
              C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7
              C1248,203,1344,213,1392,218.7L1440,224L1440,0
              L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0
              C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default Settings;
