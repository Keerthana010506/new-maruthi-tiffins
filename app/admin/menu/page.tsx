"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Firestore from "@/src/lib/firestore";
type MenuItem = {
  firestoreId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
};
export default function AdminMenuPage() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
  async function loadMenu() {
    const items = await Firestore.getMenuItems()
    setMenu(items as MenuItem[]);
    console.table(items);
  }

  loadMenu();
}, []);

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 25,
        minHeight: "100vh",
        background: "#ece6db",
      }}
    >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  }}
>
  <h1
    style={{
      color: "#b91c1c",
      margin: 0,
    }}
  >
    🍽 Menu Management
  </h1>

  <button
    onClick={() => router.push("/admin")}
    style={{
      background: "#374151",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    ← Dashboard
  </button>
</div>
      <div
        style={{
          background: "#ffffff",
          color: "#111111",
          padding: 25,
          borderRadius: 18,
          boxShadow: "0 6px 18px rgba(0,0,0,.08)",
        }}
      >
        {menu.map((item) => (
          <div
            key={item.firestoreId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <strong>{item.name}</strong>
              <br />
              ₹{item.price}
            </div>

           <button
  onClick={async () => {
    console.log(
  item.name,
  "old:",
  item.available,
  "new:",
  !item.available
);
    await Firestore.toggleAvailability(
      item.firestoreId,
      !item.available
    );

    await Firestore.toggleAvailability(
  item.firestoreId,
  !item.available
);

// Reload menu from Firestore
const items = await Firestore.getMenuItems();
setMenu(items as MenuItem[]);
  }}
  style={{
   background: item.available
  ? "#16a34a"
  : "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  {item.available
  ? "Mark Out of Stock"
  : "Mark Available"}
</button>
          </div>
        ))}
      </div>
    </main>
  );
}