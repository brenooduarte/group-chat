import React, { useState } from 'react';
import { FiPaperclip, FiCamera, FiVideo, FiMic, FiSend, FiCrosshair, FiX } from 'react-icons/fi';
import { storage } from "../../services/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./styles.css";

export const UploadOptions = ({ setImgURL, setVideoURL, setAudioURL }) => {
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

  const handleFileUpload = (e) => {
    e.preventDefault() 
    if (!selectedFile) return;

    const storageRef = ref(storage, `${fileType}/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    
    try {
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
      
    } catch (error) {
      console.log(error)  
    }
    finally {
      setSelectedFile(null);
      setFileType('');
      setShowOptions(false);
    }
  };

  return (
    <>
      <FiPaperclip onClick={() => setShowOptions(!showOptions)} className='file-input'/>
      {showOptions && (
        <div className='modal'>
             <div className='modal-body'>
          <div className='modal-content'>
            <span type='button' onClick={() => document.getElementById('image-input').click()}>
              <FiCamera />
              <input id="image-input" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'images')} style={{ display: 'none' }} />
            </span>
            <span type='button' onClick={() => document.getElementById('video-input').click()}>
              <FiVideo />
              <input id="video-input" type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'videos')} style={{ display: 'none' }} />
            </span>
            <span type='button' onClick={() => document.getElementById('audio-input').click()}>
              <FiMic />
              <input id="audio-input" type="file" accept="audio/*" onChange={(e) => handleFileChange(e, 'audio')} style={{ display: 'none' }} />
            </span>
            <FiX  onClick={() => setShowOptions(false)} className='modal-close'/>
          </div>
          {selectedFile && (
            <>
            <span>{selectedFile.name}</span>
            <button onClick={handleFileUpload}>
              <FiSend />
            </button>
            </>
          )}
          </div>
        </div>
      )}
    
    </>
  );
};
