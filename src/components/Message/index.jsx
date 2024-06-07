import React from 'react';
import styles from './styles.module.css';
import { auth } from '../../main';
import classNames from 'classnames';

const formatDatetime = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date);
    return { hours: undefined, minutes: undefined };
  }

  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  return { hours, minutes };
};

export const Message = ({ payload }) => {
  const {
    authorId,
    authorName,
    text,
    photoURL,
    videoURL,
    audioURL,
    createdAt,
  } = payload;

  const isMessageSent = authorId === auth.currentUser.uid;
  const classes = classNames(styles.container, isMessageSent && styles.sent);
  const username = isMessageSent ? 'You' : authorName;

  const { hours, minutes } = formatDatetime(createdAt);

  return (
    <div className={classes}>
      {photoURL && <img src={photoURL} alt="Photo" />} 

      {videoURL && (
        <video controls>
          <source src={videoURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )} 

      {audioURL && (
        <audio controls>
          <source src={audioURL} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      )} 
      
      <div className={styles.content}>
        <span>{username}</span>
        <p>{text}</p>
        {hours !== undefined && minutes !== undefined && (
          <small>{`${hours}:${minutes}`}</small>
        )}
      </div>
    </div>
  );
};
