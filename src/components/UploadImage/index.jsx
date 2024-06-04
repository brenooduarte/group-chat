import "./styles.css";
import { useState } from "react";
import { storage } from "../../services/firebaseConfig"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FiPaperclip } from "react-icons/fi";

export const UploadImage = () => {
  const [imgURL, setImgURL] = useState("");
  const [progressPorcent, setPorgessPorcent] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const file = event.target[0]?.files[0];
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPorgessPorcent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgURL(downloadURL);
        });
      }
    );
  };
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <input type="file" />
          <button type="submit"><FiPaperclip /></button>
        </form>

          <input type="file" />
          <button className="button-clip" type="submit"><FiPaperclip /></button>
        {!imgURL && <p>{progressPorcent}%</p>}
        {imgURL && <img src={imgURL} alt="Imagem" height={200} />}
      </header>
    </div>
  );
}