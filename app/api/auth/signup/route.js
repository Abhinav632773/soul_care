import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export async function POST(request) {
  try {
    const { email, password, username } = await request.json();

    // Validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with username
    await updateProfile(user, {
      displayName: username
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      username: username,
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      profile: {
        bio: '',
        avatar: '',
        preferences: {
          notifications: true,
          privacy: 'public'
        }
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        username: username
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    let errorMessage = 'Failed to create account';
    let statusCode = 500;

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists';
        statusCode = 409;
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        statusCode = 400;
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak';
        statusCode = 400;
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled';
        statusCode = 500;
        break;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 