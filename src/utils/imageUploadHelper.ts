/**
 * Helper utility to process and compress user-uploaded image files 
 * into compact, high-quality Base64 Data URLs suitable for persistent 
 * client-side storage without quota overflow.
 */
export const compressImageFile = (
  file: File, 
  maxWidth = 1200, 
  maxHeight = 1200, 
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // SVG files should be stored directly as SVG data URL to preserve vector crispness
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale proportionally if image exceeds max bounds
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Preserve transparent PNGs if small, or convert to high-efficiency JPEG
        const outputMime = file.type === 'image/png' && file.size < 500 * 1024 
          ? 'image/png' 
          : 'image/jpeg';

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(outputMime, quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        // Fallback to raw data URL if image decoding fails
        resolve(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
