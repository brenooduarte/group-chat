import styles from './styles.module.css';

import { auth } from '../../main';
import { TbLogout } from 'react-icons/tb';

export const SignOut = () => {
  return auth.currentUser && (
    <button
      className={styles.signout}
      onClick={() => auth.signOut()}
    >
      <TbLogout size={24} />
    </button>
  );
};