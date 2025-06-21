import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, query, orderBy, limit, increment, arrayUnion, arrayRemove } from 'firebase/firestore';

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
const db = getFirestore(app);

// Helper function to verify authentication
const verifyAuth = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split('Bearer ')[1];
  // In a real app, you'd verify the Firebase token here
  return token;
};

// GET - Get chat messages
export async function GET(request) {
  try {
    const token = verifyAuth(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get('limit')) || 50;

    // Get messages ordered by timestamp
    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(messagesQuery);
    const messages = [];

    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Reverse to get chronological order
    messages.reverse();

    return NextResponse.json({
      success: true,
      messages: messages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}

// POST - Create new message
export async function POST(request) {
  try {
    const token = verifyAuth(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { text, sender, replyTo } = await request.json();

    // Validation
    if (!text || !sender) {
      return NextResponse.json(
        { error: 'Text and sender are required' },
        { status: 400 }
      );
    }

    if (text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Create message document
    const messageData = {
      text: text.trim(),
      sender: sender,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: [],
      replyTo: replyTo || null
    };

    const docRef = await addDoc(collection(db, 'messages'), messageData);

    return NextResponse.json({
      success: true,
      message: {
        id: docRef.id,
        ...messageData
      }
    });

  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

// PUT - Update message (like/unlike)
export async function PUT(request) {
  try {
    const token = verifyAuth(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { messageId, action, userId } = await request.json();

    if (!messageId || !action || !userId) {
      return NextResponse.json(
        { error: 'Message ID, action, and user ID are required' },
        { status: 400 }
      );
    }

    const messageRef = doc(db, 'messages', messageId);

    if (action === 'like') {
      // Add like
      await updateDoc(messageRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId)
      });
    } else if (action === 'unlike') {
      // Remove like
      await updateDoc(messageRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId)
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message updated successfully'
    });

  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
} 