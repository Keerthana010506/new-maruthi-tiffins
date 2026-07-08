
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "./firebase";
export async function createOrder(order: Record<string, unknown>) {

  const docRef = await addDoc(
    collection(db, "orders"),
    {
      ...order,
      status: "Pending",
      createdAt: serverTimestamp(),
    }
  );

  console.log("Firestore document ID:", docRef.id);

  return docRef.id;
}

export async function createMenuItem(
  item: Record<string, unknown>
) {
  await addDoc(
    collection(db, "menu"),
    {
      ...item,
       available: true,
      inStock: true,
      createdAt: serverTimestamp(),
    }
  );
}

export async function getMenuItems() {
  const snapshot = await getDocs(
    collection(db, "menu")
  );

  return snapshot.docs.map((doc) => ({
    firestoreId: doc.id,
    ...doc.data(),
  }));
}

export async function updateMenuItem(
  firestoreId: string,
  item: Record<string, unknown>
) {
  await updateDoc(
    doc(db, "menu", firestoreId),
    item
  );
}

export async function deleteMenuItem(
  firestoreId: string
  ) {
  await deleteDoc(
    doc(db, "menu", firestoreId)
  );
}
export async function toggleAvailability(
  firestoreId: string,
  available: boolean
) {
  await updateDoc(
    doc(db, "menu", firestoreId),
    {
      available,
    }
  );


}
