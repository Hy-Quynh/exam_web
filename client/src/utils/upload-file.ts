import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import storage from "../firebase";

export const customUpload = async (file: any) => {
  const imageName = "file-exam-web-" + new Date().getTime();
  const storageRef = ref(storage, imageName);

  const updateImageRes = await uploadBytes(storageRef, file);
  if (updateImageRes) {
    const pathReference = ref(storage, imageName);
    const url = await getDownloadURL(pathReference);
    return url
  } 

  return false
};

export const validateFn = (file: any) => {
  // let fileSizeError = "File tải lên không thể hơn 500 kb";
  const maxFileSize = 500000; //500 kb
  if (file.size > maxFileSize) {
    return false;
  }
  return true;
};