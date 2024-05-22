import styles from "./styles.module.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { ChatRoom } from "./components/ChatRoom";
import { auth } from "./main";
import { SignIn } from "./components/SignIn";
import { SignOut } from "./components/SignOut";
import classNames from "classnames";

export const App = () => {
  const [user] = useAuthState(auth);

  const classes = classNames(styles.chat, !user && styles['not_authenticated']);

  return (
    <div className={classes}>
      <header>
        <h2>SM Chat Group</h2>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
};