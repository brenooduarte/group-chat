import styles from './styles.module.css';

export const Avatar = ({
  photoURL,
  displayName,
  textColor,
  backgroundColor,
  isMessageSent,
}) => {
  if (photoURL) {
    return <img src={photoURL} />;
  }

  const authorNameFirstLetter = displayName.charAt(0).toUpperCase();
  const avatarStyles = isMessageSent ? {} : { backgroundColor, color: textColor };

  return (
    <span
      className={styles.avatar}
      style={avatarStyles}
    >
      {authorNameFirstLetter}
    </span>
  )
}