import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getStorage,
  ref,
  listAll,
  getMetadata,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const databaseApp = getFirestore(app);
export const storage = getStorage(app);

const listFilesWithMetadata = async (folder) => {
  const storage = getStorage();
  const folderRef = ref(storage, folder);
  const result = await listAll(folderRef);

  const filesMetadata = await Promise.all(
    result.items.map(async (itemRef) => {
      const metadata = await getMetadata(itemRef);
      const downloadURL = await getDownloadURL(itemRef);
      return {
        ...metadata,
        downloadURL,
      };
    })
  );

  return filesMetadata;
};

const getAllFiles = async () => {
  const images = await listFilesWithMetadata("images");
  const videos = await listFilesWithMetadata("videos");
  const audios = await listFilesWithMetadata("audio");

  return [...images, ...videos, ...audios];
};

export const getOrderedFiles = async () => {
  const allFiles = await getAllFiles();
  const orderedFiles = allFiles.sort(
    (a, b) => new Date(a.timeCreated) - new Date(b.timeCreated)
  );
  return orderedFiles;
};
