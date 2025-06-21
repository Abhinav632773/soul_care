import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
//so here basically in sign-in it checks when user enter email and password and then it checks if the email and password are correct and then it updates the last seen timestamp
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last seen timestamp
    await updateDoc(doc(db, 'users', user.uid), {
      lastSeen: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    
    let errorMessage = 'Failed to sign in';
    let statusCode = 500;

    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        statusCode = 404;
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        statusCode = 401;
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        statusCode = 400;
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        statusCode = 429;
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        statusCode = 403;
        break;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 