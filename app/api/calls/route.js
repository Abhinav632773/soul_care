import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

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

// GET - Get call status or active calls
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
    const callId = searchParams.get('callId');
    const userId = searchParams.get('userId');

    if (callId) {
      // Get specific call
      const callDoc = await getDoc(doc(db, 'calls', callId));
      
      if (!callDoc.exists()) {
        return NextResponse.json(
          { error: 'Call not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        call: {
          id: callDoc.id,
          ...callDoc.data()
        }
      });
    } else if (userId) {
      // Get user's active calls
      const callsQuery = query(
        collection(db, 'calls'),
        where('participants', 'array-contains', userId),
        where('status', 'in', ['active', 'waiting'])
      );

      const querySnapshot = await getDocs(callsQuery);
      const calls = [];

      querySnapshot.forEach((doc) => {
        calls.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return NextResponse.json({
        success: true,
        calls: calls
      });
    } else {
      return NextResponse.json(
        { error: 'Call ID or user ID is required' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Get calls error:', error);
    return NextResponse.json(
      { error: 'Failed to get calls' },
      { status: 500 }
    );
  }
}

// POST - Start a new call
export async function POST(request) {
  try {
    const token = verifyAuth(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { userId, username, callType = 'support' } = await request.json();

    if (!userId || !username) {
      return NextResponse.json(
        { error: 'User ID and username are required' },
        { status: 400 }
      );
    }

    // Check if user already has an active call
    const activeCallsQuery = query(
      collection(db, 'calls'),
      where('participants', 'array-contains', userId),
      where('status', 'in', ['active', 'waiting'])
    );

    const activeCalls = await getDocs(activeCallsQuery);
    if (!activeCalls.empty) {
      return NextResponse.json(
        { error: 'You already have an active call' },
        { status: 409 }
      );
    }

    // Create new call
    const callData = {
      participants: [userId],
      usernames: [username],
      status: 'waiting', // waiting, active, ended
      callType: callType,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      createdBy: userId,
      notes: '',
      rating: null
    };

    const docRef = await addDoc(collection(db, 'calls'), callData);

    return NextResponse.json({
      success: true,
      call: {
        id: docRef.id,
        ...callData
      }
    });

  } catch (error) {
    console.error('Start call error:', error);
    return NextResponse.json(
      { error: 'Failed to start call' },
      { status: 500 }
    );
  }
}

// PUT - Update call status
export async function PUT(request) {
  try {
    const token = verifyAuth(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { callId, action, userId, data } = await request.json();

    if (!callId || !action) {
      return NextResponse.json(
        { error: 'Call ID and action are required' },
        { status: 400 }
      );
    }

    const callRef = doc(db, 'calls', callId);
    const callDoc = await getDoc(callRef);

    if (!callDoc.exists()) {
      return NextResponse.json(
        { error: 'Call not found' },
        { status: 404 }
      );
    }

    const callData = callDoc.data();
    let updates = {};

    switch (action) {
      case 'join':
        if (!callData.participants.includes(userId)) {
          updates = {
            participants: [...callData.participants, userId],
            usernames: [...callData.usernames, data.username],
            status: 'active'
          };
        }
        break;

      case 'end':
        const endTime = new Date();
        const startTime = new Date(callData.startTime);
        const duration = Math.floor((endTime - startTime) / 1000); // Duration in seconds

        updates = {
          status: 'ended',
          endTime: endTime.toISOString(),
          duration: duration
        };
        break;

      case 'update_notes':
        updates = {
          notes: data.notes || ''
        };
        break;

      case 'rate':
        updates = {
          rating: data.rating
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await updateDoc(callRef, updates);

    return NextResponse.json({
      success: true,
      message: 'Call updated successfully'
    });

  } catch (error) {
    console.error('Update call error:', error);
    return NextResponse.json(
      { error: 'Failed to update call' },
      { status: 500 }
    );
  }
} 