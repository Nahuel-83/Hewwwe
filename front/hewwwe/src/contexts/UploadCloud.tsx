/**
 * Cloudinary Image Upload Service
 * 
 * Provides functionality to upload images to Cloudinary cloud storage service.
 * Used throughout the application for product images, user avatars, and other image uploads.
 * 
 * This service handles:
 * - Secure image uploads to Cloudinary
 * - Proper configuration of upload parameters
 * - Error handling and logging
 * - Returning secure URLs for uploaded images
 * 
 * The implementation uses the Cloudinary Upload API with unsigned uploads
 * through a predefined upload preset for security and simplicity.
 */

/** Cloudinary upload preset name - must be configured in Cloudinary dashboard */
const uploadPreset = 'hewwwe';
/** Cloudinary cloud name - your account's cloud name */
const cloudName = 'dhzmaksfd';
/** Full Cloudinary upload API URL */
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

/**
 * Uploads an image file to Cloudinary and returns the secure URL
 * 
 * @param file - The image file to upload
 * @returns Promise resolving to the secure URL of the uploaded image
 * @throws Error if the upload fails
 */
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    try {
        console.log('Uploading to Cloudinary:', uploadUrl);
        console.log('Upload preset:', uploadPreset);
        
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Cloudinary error details:', errorData);
            throw new Error(`Cloudinary error: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        console.log('Upload successful, response:', data);
        return data.secure_url || data.url;
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        throw error;
    }
};