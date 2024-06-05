import styles from './styles.module.css';
import { useRef, useState, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addDoc as sendMessage,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../../main";
import { databaseApp } from "../../services/firebaseConfig";
import { getOrderedFiles } from '../../services/firebaseConfig'; 
import { Message } from "../Message";
import { TextBox } from '../TextBox';

export const ChatRoom = () => {
  const chatBottomRef = useRef();
  const [message, setMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);

  const messagesRef = collection(databaseApp, 'messages');
  const rawQuery = query(messagesRef, orderBy('createdAt'));
  const [messages] = useCollectionData(rawQuery, { idField: 'id' });

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await getOrderedFiles();
        setMediaFiles(files);
      } catch (error) {
        console.error("Error fetching media files:", error);
      }
    };
    fetchFiles();
  }, []);

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
    chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className={styles.message_list}>
        {messages && messages.map((message, index) => (
          <Message key={index} payload={message} />
        ))}
        {mediaFiles && mediaFiles.map((file, index) => (
          <div key={index}>
            {file.contentType.startsWith('image/') && <img src={file.downloadURL} alt="Image" />}
            {file.contentType.startsWith('video/') && (
              <video controls>
                <source src={file.downloadURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {file.contentType.startsWith('audio/') && (
              <audio controls>
                <source src={file.downloadURL} />
                Your browser does not support the audio tag.
              </audio>
            )}
          </div>
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
