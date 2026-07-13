import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
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
)
 {
  await updateDoc(
    doc(db, "menu", firestoreId),
    {
      available,
    }
  );


}
// Restaurant Status

export async function getRestaurantStatus() {
  const docRef = doc(db, "settings", "restaurant");

  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    await setDoc(docRef, {
      isOpen: true,
    });

    return true;
  }

  return snapshot.data().isOpen;
}

export async function updateRestaurantStatus(
  isOpen: boolean
) {
  const docRef = doc(db, "settings", "restaurant");

  await setDoc(
    docRef,
    {
      isOpen,
    },
    { merge: true }
  );
}
export function subscribeRestaurantStatus(
  callback: (isOpen: boolean) => void
) {
  const docRef = doc(db, "settings", "restaurant");

  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data().isOpen);
    }
  });
}