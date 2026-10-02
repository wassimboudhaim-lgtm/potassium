import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Conversation, Message } from './types';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore with specific database ID if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Error handling types as mandated by the Firebase skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot as mandated by the Firebase skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, check connection.');
    }
  }
}

// Initialize boot test non-blockingly
testConnection();

// Auth Helpers
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

export async function registerWithEmail(
  email: string,
  pass: string,
  displayName: string
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }

  // Create initial user document
  try {
    const userRef = doc(db, 'users', cred.user.uid);
    await setDoc(userRef, {
      id: cred.user.uid,
      email: cred.user.email,
      displayName: displayName || cred.user.email?.split('@')[0] || 'User',
      photoURL: cred.user.photoURL || '',
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to create user profile in Firestore:', err);
  }

  return cred.user;
}

export async function loginWithGoogle(): Promise<User> {
  const cred = await signInWithPopup(auth, googleProvider);

  // Sync profile document
  try {
    const userRef = doc(db, 'users', cred.user.uid);
    await setDoc(
      userRef,
      {
        id: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || cred.user.email?.split('@')[0] || 'User',
        photoURL: cred.user.photoURL || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Failed to sync Google user profile:', err);
  }

  return cred.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Subscribe to active auth state
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Firestore Conversation Operations
export function subscribeToUserConversations(
  userId: string,
  onData: (conversations: Conversation[]) => void,
  onError?: (err: any) => void
) {
  const path = `users/${userId}/conversations`;
  const convCol = collection(db, 'users', userId, 'conversations');
  const q = query(convCol, orderBy('updatedAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const convs: Conversation[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        convs.push({
          id: d.id,
          title: data.title || 'Untitled Chat',
          createdAt: data.createdAt || Date.now(),
          updatedAt: data.updatedAt || Date.now(),
          pinned: !!data.pinned,
          archived: !!data.archived,
          messages: data.messages || [],
        });
      });
      onData(convs);
    },
    (err) => {
      console.error('Error fetching user conversations:', err);
      onError?.(err);
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveUserConversation(
  userId: string,
  conv: Conversation
): Promise<void> {
  const path = `users/${userId}/conversations/${conv.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'conversations', conv.id);
    await setDoc(
      docRef,
      {
        id: conv.id,
        userId,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: Date.now(),
        pinned: !!conv.pinned,
        archived: !!conv.archived,
        messages: conv.messages,
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteUserConversation(
  userId: string,
  conversationId: string
): Promise<void> {
  const path = `users/${userId}/conversations/${conversationId}`;
  try {
    const docRef = doc(db, 'users', userId, 'conversations', conversationId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
