interface CloudinaryUploadOptions {
    /**
     * (Optional) Folder to place the image in. E.g. "my-app-uploads"
     */
    folder?: string;
  
    /**
     * (Optional) Comma-separated list of tags or array of tags to add.
     * E.g., "user-avatars,profile" or ['user-avatars','profile']
     */
    tags?: string | string[];
  }
  
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables are not set');
  }
  
  /**
   * Upload a single image to Cloudinary (unsigned)
   * @param {File} file - The image file to upload
   * @param {CloudinaryUploadOptions} [options] - Additional upload options
   * @returns {Promise<string>} - The secure URL of the uploaded image
   */
  export const uploadImage = async (
    file: File,
    options?: CloudinaryUploadOptions
  ): Promise<string> => {
    const { folder, tags } = options || {};
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
  
    // Append optional folder
    if (folder) {
      formData.append('folder', folder);
    }
  
    // Append optional tags (Cloudinary expects comma-separated strings)
    if (tags) {
      const tagsValue = Array.isArray(tags) ? tags.join(',') : tags;
      formData.append('tags', tagsValue);
    }
  
    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload image');
    }
  
    return data.secure_url;
  };
  
  /**
   * Upload multiple images to Cloudinary
   * @param {File[]} files - An array of image files
   * @param {CloudinaryUploadOptions} [options] - Additional upload options
   * @returns {Promise<string[]>} - An array of secure URLs
   */
  export const uploadMultipleImages = async (
    files: File[],
    options?: CloudinaryUploadOptions
  ): Promise<string[]> => {
    try {
      // Reuse the single-file function for each file
      const uploadPromises = files.map((file) => uploadImage(file, options));
      // Wait for all uploads to complete
      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls;
    } catch (error) {
      throw new Error(`Failed to upload multiple images: ${(error as Error).message}`);
    }
  };
  