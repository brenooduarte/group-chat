import { UploadImage } from '../UploadImage';
import styles from './styles.module.css'
import { RiSendPlaneFill } from "react-icons/ri";

export const TextBox = ({ onSubmit, onChange, value }) => {
  const isDisabled = !value || value.trim().length === 0;

  return (
    <form className={styles.textbox}>
      <input
        type='text'
        value={value}
        onChange={onChange}
      />
      <UploadImage />
      <button onClick={onSubmit} disabled={isDisabled} className='input-button'>
        <RiSendPlaneFill />
      </button>
    </form>
  );
};