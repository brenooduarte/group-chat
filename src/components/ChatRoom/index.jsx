import styles from './styles.module.css';
import { useRef, useState, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addDoc as sendMessage,
  collection,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../../main";
import { databaseApp } from "../../services/firebaseConfig";
import { getOrderedFiles } from '../../services/firebaseConfig'; 
import { Message } from "../Message";
import { TextBox } from '../TextBox';

import FileDisplay from '../FileDisplay/FileDisplay';

export const ChatRoom = () => {
  const chatBottomRef = useRef();
  const [message, setMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [viewFile, setViewFile] = useState(false); 
  const [fileDisplayUrl, setFileDisplayUrl] = useState(''); 

  const messagesRef = collection(databaseApp, 'messages');
  const rawQuery = query(messagesRef);
  const [messages] = useCollectionData(rawQuery, { idField: 'id' });

  const [mergedMessages, setMergedMessages] = useState([]);

  const displayFile = (url) => {
    setFileDisplayUrl(url);
    setViewFile(true);
    console.log(url);
    console.log(viewFile)
  };

  const closeFileDisplay = () => {
    setViewFile(false);
    setFileDisplayUrl('');
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await getOrderedFiles();
        const filesWithTimeStamp = files.map((file) => ({
          ...file,
          createdAt: new Date(file.timeCreated).getTime(), // Convert to milliseconds
        }));
        setMediaFiles(filesWithTimeStamp);
      } catch (error) {
        console.error("Error fetching media files:", error);
      }
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    if (messages && mediaFiles.length) {
      const combinedMessages = [...messages, ...mediaFiles].map(item => ({
        ...item,
        createdAt: item.createdAt && item.createdAt.toMillis ? item.createdAt.toMillis() : item.createdAt,
      }));
      const sortedMessages = combinedMessages.sort((a, b) => a.createdAt - b.createdAt);
       setMergedMessages(()=>[...sortedMessages]);
    }
  }, [messages, mediaFiles]);

  const handleMessageSending = async (e) => {
    e.preventDefault();

    const {
      photoURL,
      uid: authorId,
      displayName: authorName,
    } = auth.currentUser;

    await sendMessage(messagesRef, {
      text: message,
      createdAt: serverTimestamp(),
      authorName,
      authorId,
      photoURL,
    });
  
    setMessage('');
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {viewFile && (
        <>
        <span>OMG</span>
        <FileDisplay fileUrl={fileDisplayUrl} onClose={closeFileDisplay} />
        </>
      )}
      <div className={styles.message_list}>
        {mergedMessages && mergedMessages.map((message, index) => (
          message && message.contentType ? (
            <div key={index} onClick={() => displayFile(message.downloadURL)}>
              {message.contentType.startsWith('image/') && 
                <img src={message.downloadURL} alt="Image" className={styles.image_message} />}
              {message.contentType.startsWith('video/') && (
                <video className={styles.video_message} controls>
                  <source src={message.downloadURL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {message.contentType.startsWith('audio/') && (
                <audio controls>
                  <source src={message.downloadURL} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              )}
            </div>
          ) : (
            <Message key={index} payload={message} />
          )
        ))}
        <div ref={chatBottomRef}></div>
      </div>
      <TextBox
        onSubmit={handleMessageSending}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      /> 
    </>
  );
};
