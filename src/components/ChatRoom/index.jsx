import styles from './styles.module.css'
import { useRef, useState } from "react";
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
import { Message } from "../Message";
import { TextBox } from '../TextBox';

export const ChatRoom = () => {
  const chatBottomRef = useRef()
  const [message, setMessage] = useState('');

  const messagesRef = collection(databaseApp, 'messages');
  const rawQuery = query(messagesRef, orderBy('createdAt'));
  const [messages] = useCollectionData(rawQuery, { idField: 'id' });

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

  console.log(messages);

  return (
    <>
      <div className={styles.message_list}>
        {messages && messages.map((message, index) => (
          <Message key={index} payload={message} />
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