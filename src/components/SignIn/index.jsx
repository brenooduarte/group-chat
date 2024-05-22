import styles from './styles.module.css';

import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../main";
import { FcGoogle } from "react-icons/fc";

export const SignIn = () => {
  const [ signInWithGoogle ] = useSignInWithGoogle(auth);

  return (
    <button className={styles.signin} onClick={() => signInWithGoogle()}>
      <span>Login with Google</span>
      <FcGoogle size={24} />
    </button>
  );
};