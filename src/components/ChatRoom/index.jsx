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
import { getAvatarColors } from '../../utils/styles';

export const ChatRoom = () => {
  const startOfChatRef = useRef()
  const [message, setMessage] = useState('');

  const messagesRef = collection(databaseApp, 'messages');
  const rawQuery = query(messagesRef, orderBy('createdAt'));
  const [messages] = useCollectionData(rawQuery, { idField: 'id' });

  const handleMessageSending = async (e) => {
    e.preventDefault();

    const {
      photoURL,
      uid,
      displayName,
      avatarBackgroundColor,
      avatarTextColor,
    } = auth.currentUser;

    const messagePayload = {
      text: message,
      authorName: displayName,
      authorId: uid,
      photoURL,
      createdAt: serverTimestamp(),
    };

    if (!avatarBackgroundColor && !avatarTextColor) {
      const avatar = getAvatarColors();

      messagePayload['avatarBackgroundColor'] = avatar.backgroundColor;
      messagePayload['avatarTextColor'] = avatar.textColor;
    }

    await sendMessage(messagesRef, messagePayload);
  
    setMessage('');
    startOfChatRef.current.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <>
      <div ref={startOfChatRef} className={styles.message_list}>
        {messages && messages.map((message, index) => (
          <Message key={index} payload={message} />
        ))}
      </div>
      <TextBox
        onSubmit={handleMessageSending}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
    </>
  );
};