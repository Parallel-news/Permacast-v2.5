import Resizer from "react-image-file-resizer";

export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsArrayBuffer(file);
    });
};

export const checkContentTypeFromUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const ct = response.headers.get('content-type');
      return ct
    } catch (error) {
      console.error('Error fetching content type:', error);
    }
};

export const inspectEventContentType = (event: React.ChangeEvent<HTMLInputElement>) => event.target.files[0].type;

export const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e: ", event.target)
    return event.target.files ? event.target.files[0] : null;
};

export async function getMimeTypeFromBlobUrl(blobUrl) {
  try {
    const response = await fetch(blobUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch the Blob');
    }

    const blob = await response.blob();
    const mimeType = blob.type;
    return mimeType

  } catch (error) {
    console.error('Error:', error);
  }
}

export async function createFileFromBlobUrl(blobUrl, fileName) {
  try {
    // Fetch the Blob from the URL
    const response = await fetch(blobUrl);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error('Failed to fetch the Blob');
    }

    // Get the Blob from the response
    const blob = await response.blob();

    // Get the MIME type from the Blob
    const mimeType = blob.type;

    // Create a File instance from the Blob
    const file = new File([blob], fileName, { type: mimeType });

    return file;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export const resizeFile = (file, quality=100, width=200, height=200) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      width, // width
      height, // height
      "WEBP", // JPEG PNG OR WEBP
      quality, // quality
      0, // rotation
      (uri) => {
        resolve(uri);
      },
      "file" // blob file or base64 output
    );
  });
};