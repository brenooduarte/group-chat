import styles from './styles.module.css'
import { RiSendPlaneFill } from "react-icons/ri";

export const TextBox = ({ onSubmit, onChange, value }) => {
  const isDisabled = !value || value.trim().length === 0;

  return (
    <form onSubmit={onSubmit} className={styles.textbox}>
      <input
        type='text'
        value={value}
        onChange={onChange}
      />
      <button type='submit' disabled={isDisabled}>
        <RiSendPlaneFill />
      </button>
    </form>
  );
};