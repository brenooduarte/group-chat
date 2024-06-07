import React from "react";
import styles from "./styles.module.css";
import { FiX } from "react-icons/fi";

interface FileDisplayProps {
  fileUrl: string;
  onClose: () => void;
}

const FileDisplay = ({ fileUrl, onClose }: FileDisplayProps) => {
  return (
    <div className={styles.file_display_modal} onClick={onClose}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close_button} onClick={onClose}>
          <FiX />
        </button>
        <div className={styles.file_preview}>
          <img src={fileUrl} alt="File Preview" className={styles.file_image} />
        </div>
      </div>
    </div>
  );
};

export default FileDisplay;
