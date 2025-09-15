// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAw7EjoH642vZPvtkJpJrjAWUJvsA6onnI",
  authDomain: "ai-globeloom.firebaseapp.com",
  projectId: "ai-globeloom",
  storageBucket: "ai-globeloom.firebasestorage.app",
  messagingSenderId: "964753611785",
  appId: "1:964753611785:web:8cc9086fdeddbc21696cd8",
  measurementId: "G-Q10EQCSERB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Analytics is available but not exported for now
// const analytics = getAnalytics(app);

export { app };
