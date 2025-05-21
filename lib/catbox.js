const fileType = require('file-type');
const FormData = require('form-data');
const fetch = require('node-fetch');
const MAX_FILE_SIZE_MB = 200; // Maximum file size

async function uploadMedia(buffer) {
}

async function handleMediaUpload(quoted, chrisspark, mime) {
  // Ensure quoted message exists and is valid
  if (!quoted || !mime) {
    throw new Error('No valid media to upload!');
  }

  try {
    // Download the media using the library's download method
    const media = await chrisspark.downloadAndSaveMediaMessage(quoted);

    // Read the media file into a buffer
    const fs = require('fs');
    const buffer = fs.readFileSync(media);

    // Check the file size
    const fileSizeMB = buffer.length / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      fs.unlinkSync(media); // Clean up the temp file
      return `File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`;
    }

    // Upload the media
    const mediaUrl = await uploadMedia(buffer);

    // Clean up the temp file
    fs.unlinkSync(media);

    return mediaUrl;
  } catch (error) {
    console.error('Error handling media upload:', error);
    throw new Error('Failed to handle media upload');
  }
}

module.exports = {
  uploadMedia,
  handleMediaUpload,
};
