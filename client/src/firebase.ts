import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA1VOQqdu2l4iIDnjiMYU4eCpxbvrGXIE8",
  authDomain: "mybooking-338017.firebaseapp.com",
  projectId: "mybooking-338017",
  storageBucket: "mybooking-338017.appspot.com",
  messagingSenderId: "271092301519",
  appId: "1:271092301519:web:cfd3e675fa30f2d5bb01ba",
  measurementId: "G-JPGDLEMHX4"
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
export default storage;