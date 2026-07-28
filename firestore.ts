import { db } from './firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, serverTimestamp, query, where, orderBy, limit } from 'firebase/firestore';
import type { AITool } from './aiToolsData';

export interface UserRecord {
  uid: string;
  email: string;
  displayName?: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: any;
  role?: 'admin' | 'user';
}

export interface SubscriptionRecord {
  uid: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'canceled';
  billingCycle: 'monthly' | 'annual';
  amount: number;
  updatedAt: any;
}

export interface CategoryRecord {
  id: string;
  label: string;
  desc: string;
  color: string;
  toolCount: number;
  updatedAt: any;
}

export interface AnalyticsRecord {
  date: string;
  activeUsers: number;
  tasksProcessed: number;
  totalRevenue: number;
  avgLatencyMs: number;
}

export const usersCollection = () => collection(db, 'users');
export const subscriptionsCollection = () => collection(db, 'subscriptions');
export const categoriesCollection = () => collection(db, 'categories');
export const analyticsCollection = () => collection(db, 'analytics');
export const toolsCollection = () => collection(db, 'aiTools');

// Real Firestore read operations
export async function getAllUsers() {
  const snap = await getDocs(query(usersCollection(), orderBy('createdAt', 'desc'), limit(50)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as (UserRecord & { id: string })[];
}

export async function getUserByUid(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as UserRecord & { id: string };
}

export async function saveUser(uid: string, data: Partial<UserRecord>) {
  await setDoc(doc(db, 'users', uid), { ...data, uid, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getAllSubscriptions() {
  const snap = await getDocs(query(subscriptionsCollection(), orderBy('updatedAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as (SubscriptionRecord & { id: string })[];
}

export async function saveSubscription(uid: string, data: Partial<SubscriptionRecord>) {
  await setDoc(doc(db, 'subscriptions', uid), { ...data, uid, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getAllCategories() {
  const snap = await getDocs(query(categoriesCollection(), orderBy('updatedAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as (CategoryRecord & { id: string })[];
}

export async function saveCategory(id: string, data: Partial<CategoryRecord>) {
  await setDoc(doc(db, 'categories', id), { ...data, id, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, 'categories', id));
}

export async function getAllTools() {
  const snap = await getDocs(query(toolsCollection(), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as (AITool & { id: string; firestoreId?: string })[];
}

export async function saveTool(id: string, data: Partial<AITool>) {
  await setDoc(doc(db, 'aiTools', id), { ...data, id, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteTool(id: string) {
  await deleteDoc(doc(db, 'aiTools', id));
}

export async function getAnalytics(dateRange?: string) {
  const snap = await getDocs(query(analyticsCollection(), orderBy('date', 'desc'), limit(30)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as (AnalyticsRecord & { id: string })[];
}

export async function saveAnalytics(data: Partial<AnalyticsRecord>) {
  await addDoc(analyticsCollection(), { ...data, createdAt: serverTimestamp() });
}
