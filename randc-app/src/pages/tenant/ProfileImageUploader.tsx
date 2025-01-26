import React, { useState } from 'react';
import { FaSync } from 'react-icons/fa';
import { uploadImage } from '../../util/cloudinary';  // your function from above
import { useUpdateProfileMutation } from '../../features/auth/authApi'; // or wherever you have it

const ProfileImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Hook for updating the user's profile
  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();

  // 1) Pick file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 2) Upload to Cloudinary, then save to user profile
  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);

      // Step A: Upload image to Cloudinary
      const imageUrl = await uploadImage(selectedFile, {
        folder: 'my-app-avatars', // optional
        tags: ['profile'],
      });

      // Step B: Call your profile update endpoint with the returned URL
      await updateProfile({ profileImage: imageUrl }).unwrap();

      alert('Profile image updated successfully!');
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      alert('Failed to upload profile image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Upload Profile Image</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading || updatingProfile}
        className="mt-3 flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {(uploading || updatingProfile) && <FaSync className="animate-spin mr-2" />}
        Save to Profile
      </button>
    </div>
  );
};

export default ProfileImageUploader;
