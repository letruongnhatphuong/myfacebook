// Largest file a user can pick before it is resized (5 MB).
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;

// Shrinks a picked image and returns it as a JPEG data URL.
// Keeping pictures small lets them be stored directly in the product
// document (Firestore documents are limited to 1 MB).
export function resizeImage(file, maxSize = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);

      const context = canvas.getContext('2d');
      // White background so transparent PNGs don't turn black as JPEGs.
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('This file could not be read as an image.'));
    };

    image.src = objectUrl;
  });
}
