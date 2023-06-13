import axios from "axios";
import Resizer from "react-image-file-resizer";

import { PODCAST_MINIFIED_COVER_MAX_SIZE } from "@/constants/index";

import { rssEpisode, rssEpisodeRetry, RssEpisodeContentLength, RSSEpisodeEstimate } from "@/interfaces/rss";


// check if all episodes have length
// if not all episodes have length, fetch sizes
// if no sizes, attempt size fetch via headers
// if still no sizes, add to custom download list

export const fetchEpisodeSizes = async (rssEpisodes: rssEpisode[]) => {
  const retryEpisodeDownloadList: rssEpisodeRetry[] = [];
  // attempt to fetch sizes via known property length
  const episodesWithoutLength = rssEpisodes.filter((rssEpisode: rssEpisode) => (
    !rssEpisode?.['length'] || Number(rssEpisode?.['length']) === 0)
  );
  console.log('episodes without length', episodesWithoutLength);
  // if all episodes have length, return
  if (!episodesWithoutLength.length) return { knownEpisodeSizes: rssEpisodes, unkwownEpisodeSizes: [] };

  const episodesWithLength = rssEpisodes.filter((rssEpisode: rssEpisode) => (
    rssEpisode?.['length'] && Number(rssEpisode?.['length']) > 0)
  );

  // else, simplify list to links, and fetch sizes via header request
  const rssLinks = episodesWithoutLength.map((rssEpisode: rssEpisode) => rssEpisode.link);
  const sizes = (await axios.post('/api/rss/get-headers', { rssLinks })).data.links;

  // if no sizes, add to custom download list
  // splice rss episodes with length property
  const rssEpisodesFinal = episodesWithoutLength.map((rssEpisode: rssEpisode) => {
    console.log(sizes)
    const attemptedLink = sizes.find((ep: RssEpisodeContentLength) => ep.link === rssEpisode.link);
    if (!attemptedLink?.['length']) {
      retryEpisodeDownloadList.push(rssEpisode);
      return null;
    };
    return {
      ...rssEpisode,
      length: attemptedLink?.['length'] || '0'
    };
  }).filter((item: rssEpisode) => item !== null);
  const sortedEpisodes = [...episodesWithLength, ...rssEpisodesFinal].sort((a: rssEpisode, b: rssEpisode) => a.order - b.order);
  return { knownEpisodeSizes: sortedEpisodes, unknownEpisodeSizes: retryEpisodeDownloadList };
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