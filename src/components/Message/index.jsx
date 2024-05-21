import styles from './styles.module.css';

import { auth } from '../../main';
import { formatDatetime } from '../../utils/date';
import classNames from 'classnames';
import { Avatar } from '../Avatar';


export const Message = ({ payload }) => {
  const {
    authorId,
    authorName,
    text,
    photoURL,
    createdAt,
    avatarBackgroundColor,
    avatarTextColor,
  } = payload;

  const isMessageSent = authorId === auth.currentUser.uid;
  const classes = classNames(styles.container, isMessageSent && styles.sent);
  const username = isMessageSent ? 'You' : authorName;

  const { hours, minutes } = formatDatetime(createdAt);

  return (
    <div className={classes}>
      <Avatar
        photoURL={photoURL}
        displayName={authorName}
        backgroundColor={avatarBackgroundColor}
        textColor={avatarTextColor}
        isMessageSent={isMessageSent}
      />
      <div className={styles.content}>
        <span>{username}</span>
        <p>{text}</p>
        {hours && minutes && (
          <small>{`${hours}:${minutes}`}</small>
        )}
      </div>
    </div>
  );
};