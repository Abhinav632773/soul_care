import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

function getTimeOfDay(date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, mood_rating, mood_reason, emotion_keywords, energy_level, sleep_quality, stress_level, stress_reason, motivation_level, social_interaction, activity_interest, clarity_of_thought } = data;
    if (!userId || typeof mood_rating !== 'number') {
      return NextResponse.json({ error: 'userId and mood_rating are required' }, { status: 400 });
    }
    const now = new Date();
    const time_of_day = getTimeOfDay(now);
    const docData = {
      userId,
      mood_rating,
      mood_reason: mood_reason || '',
      emotion_keywords: emotion_keywords || [],
      energy_level: energy_level || '',
      sleep_quality: sleep_quality || '',
      stress_level: stress_level || '',
      stress_reason: stress_reason || '',
      motivation_level: motivation_level || '',
      social_interaction: social_interaction || '',
      activity_interest: activity_interest || '',
      clarity_of_thought: clarity_of_thought || '',
      timestamp: serverTimestamp(),
      time_of_day,
      date: now.toISOString().slice(0, 10), // YYYY-MM-DD
    };
    await addDoc(collection(db, 'mood_checkins'), docData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mood check-in error:', error);
    return NextResponse.json({ error: 'Failed to submit mood check-in' }, { status: 500 });
  }
} 