import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Shared public web configuration so every teammate uses the same Firebase project.
const firebaseConfig = {
  apiKey: 'AIzaSyCAaWYeGv1B9PqbdxYlXawwL2pjO1RPMVs',
  authDomain: 'notmarketplace.firebaseapp.com',
  projectId: 'notmarketplace',
  appId: '1:258687618136:web:3b3bb88914264b519f4e2d',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
