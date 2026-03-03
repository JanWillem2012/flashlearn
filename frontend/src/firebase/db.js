import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

export const getLists = async (uid) => {
  const q = query(collection(db, "lists"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const createList = async (uid, name, langFrom, langTo) => {
  return addDoc(collection(db, "lists"), { uid, name, langFrom, langTo, createdAt: serverTimestamp(), wordCount: 0 });
};
export const deleteList = async (listId) => {
  const words = await getWords(listId);
  await Promise.all(words.map(w => deleteDoc(doc(db, "words", w.id))));
  await deleteDoc(doc(db, "lists", listId));
};
export const getWords = async (listId) => {
  const q = query(collection(db, "words"), where("listId", "==", listId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const addWord = async (listId, uid, term, definition) => {
  const ref = await addDoc(collection(db, "words"), {
    listId, uid, term, definition,
    interval: 1, repetitions: 0, easeFactor: 2.5,
    nextReview: new Date().toISOString(), lastReview: null,
    createdAt: serverTimestamp()
  });
  const listRef = doc(db, "lists", listId);
  const listSnap = await getDoc(listRef);
  await updateDoc(listRef, { wordCount: (listSnap.data().wordCount || 0) + 1 });
  return ref;
};
export const updateWord = async (wordId, term, definition) => {
  await updateDoc(doc(db, "words", wordId), { term, definition });
};
export const deleteWord = async (wordId, listId) => {
  await deleteDoc(doc(db, "words", wordId));
  const listRef = doc(db, "lists", listId);
  const listSnap = await getDoc(listRef);
  await updateDoc(listRef, { wordCount: Math.max(0, (listSnap.data().wordCount || 1) - 1) });
};
export const updateWordSRS = async (wordId, srsData) => {
  await updateDoc(doc(db, "words", wordId), srsData);
};
export const logSession = async (uid, listId, mode, correct, total) => {
  return addDoc(collection(db, "sessions"), {
    uid, listId, mode, correct, total,
    score: Math.round((correct / total) * 100),
    date: serverTimestamp()
  });
};
export const getStats = async (uid) => {
  const q = query(collection(db, "sessions"), where("uid", "==", uid), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const getDueWords = async (uid) => {
  const now = new Date().toISOString();
  const q = query(collection(db, "words"), where("uid", "==", uid), where("nextReview", "<=", now));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};