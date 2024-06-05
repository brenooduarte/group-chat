import React, { useState } from 'react';
import { FiPaperclip, FiCamera, FiVideo, FiMic, FiSend } from 'react-icons/fi';
import { storage } from "../../services/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./styles.css";

export const UploadImage = ({ setImgURL, setVideoURL, setAudioURL }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('');

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileType(type);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;

    const storageRef = ref(storage, `${fileType}/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress handling logic (optional)
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (fileType === 'images') {
            setImgURL(downloadURL);
          } else if (fileType === 'videos') {
            setVideoURL(downloadURL);
          } else if (fileType === 'audio') {
            setAudioURL(downloadURL);
          }
          setSelectedFile(null);
          setFileType('');
          setShowOptions(false);
        });
      }
    );
  };

  return (
    <div >
      <FiPaperclip  onClick={() => setShowOptions(!showOptions)} />
      {showOptions && (
        <div >
          <label >
            <FiCamera />
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'images')} style={{ display: 'none' }} />
          </label>
          <label >
            <FiVideo />
            <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'videos')} style={{ display: 'none' }} />
          </label>
          <label >
            <FiMic />
            <input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, 'audio')} style={{ display: 'none' }} />
          </label>
          {selectedFile && (
            <button onClick={handleFileUpload}>
              <FiSend />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
