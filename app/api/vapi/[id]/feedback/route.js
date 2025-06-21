import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Call ID is required' }, { status: 400 });
    }
    const feedback = await request.json();
    if (!feedback || typeof feedback !== 'object') {
      return NextResponse.json({ error: 'Feedback data is required' }, { status: 400 });
    }
    // Store feedback under calls/{id}/feedback
    await setDoc(doc(collection(db, `calls/${id}/feedback`)), {
      ...feedback,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
} 