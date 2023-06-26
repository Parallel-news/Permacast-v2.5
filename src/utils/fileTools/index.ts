import axios from "axios";
import Resizer from "react-image-file-resizer";

import { PODCAST_MINIFIED_COVER_MAX_SIZE } from "@/constants/index";

import { rssEpisode, rssEpisodeRetry, RssEpisodeContentLengthAPI, RSSEpisodeEstimate } from "@/interfaces/rss";

export const fetchEpisodeSizes = async (rssEpisodes: rssEpisode[]) => {
  let orderedEpisodes = rssEpisodes.map((rssEpisode: rssEpisode, index: number) => ({...rssEpisode, order: index}));
  const fetchedEpisodes: rssEpisode[] = (
    await axios.post('/api/rss/get-headers', { rssEpisodes: orderedEpisodes })
  ).data.episodes;

  const orderEpisodes = (a: rssEpisode, b: rssEpisode) => a.order - b.order;

  const knownEpisodeSizes = fetchedEpisodes
    .filter((rssEpisode: rssEpisode) => (Number(rssEpisode?.length || 0) > 0))
    .sort(orderEpisodes);

  const unknownEpisodeSizes = fetchedEpisodes
    .filter((rssEpisode: rssEpisode) => (!rssEpisode?.length))
    .sort(orderEpisodes);

  return { knownEpisodeSizes, unknownEpisodeSizes };
};

export const estimateUploadCost = async (episodes: rssEpisodeRetry[]): Promise<RSSEpisodeEstimate[]> => {
  const fileLinks = episodes.map(episode => episode.link);
  const sizes = (await axios.post('/api/rss/estimate-size', { fileLinks })).data;
  return sizes;
};


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

export const resizeBlob = (file, quality=100, width=200, height=200) => {
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

export async function resizeFile(blob: Blob, quality: number): Promise<Blob> {
    const image = await fetchImage(blob);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    canvas.width = image.width;
    canvas.height = image.height;
    ctx?.drawImage(image, 0, 0, image.width, image.height);
  
    const resizedBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Error resizing image'));
        }
      }, 'image/jpeg', quality / 100);
    });
  
    return resizedBlob;
  }
  
export async function fetchImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const blobUrl = URL.createObjectURL(blob);
      img.src = blobUrl;
      img.onload = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        reject(new Error('Error loading image'));
      };
    });
  }
  

export async function minifyPodcastCover(podcastCover_: string): Promise<Blob> {
    const initialCoverBlob = await (await fetch(podcastCover_)).blob();
    let minifiedCover = initialCoverBlob;
    let quality = 100;
    minifiedCover = await resizeFile(initialCoverBlob, 99);
  
    while (minifiedCover.size > PODCAST_MINIFIED_COVER_MAX_SIZE && quality > 0) {
      minifiedCover = await resizeFile(initialCoverBlob, quality);
      quality -= 10;
    }
  
    return minifiedCover;
  }


export function createFileFromBlob(blob: Blob, filename: string): File {
    const file = new File([blob], filename, { type: blob.type, lastModified: Date.now() });
    return file;
}

export async function getImageSizeInBytes(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Error fetching the image');
      }
  
      const imageBlob = await response.blob();
      return imageBlob.size;
    } catch (error) {
      console.error('Error:', error);
      return -1;
    }
  }

  // Ex. Extract mpeg from audio/mpeg
export function getTypeFromMime(mimeType) {
  return mimeType.split('/')[1];
}