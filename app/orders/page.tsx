"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { getDeviceToken } from "@/src/lib/device";
type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  firestoreId: string;
  customerName: string;
  phone: string;
  address: string;
  cart: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  orderDate?: string;
  orderTime?: string;
  deliveredTime?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

useEffect(() => {
  console.log(
  "Current Device Token:",
  getDeviceToken()
);

console.log(
  "Stored Phone:",
  localStorage.getItem("customerPhone")
);
  const q = query(
  collection(db, "orders"),
  where(
    "customerId",
    "==",
    localStorage.getItem("customerPhone")
)
);
  const phone = localStorage.getItem("customerPhone");
  const unsubscribe = onSnapshot(q, (snapshot) => {

  console.log("Snapshot size:", snapshot.size);

  snapshot.forEach((doc) => {
    console.log("Document ID:", doc.id);
    console.log("Document Data:", doc.data());
  });

  const firebaseOrders = snapshot.docs.map((doc) => ({
    firestoreId: doc.id,
    ...doc.data(),
  })) as unknown as Order[];

    firebaseOrders.sort(
      (a, b) => Number(b.id) - Number(a.id)
    );

    setOrders(firebaseOrders);
    console.log("Number of orders:", firebaseOrders.length);
    console.table(
  firebaseOrders.map((o) => ({
    firestoreId: o.firestoreId,
    id: o.id,
    status: o.status,
  }))
);
  });

  return () => unsubscribe();
}, []);
  
  function statusColor(status: string) {
    if (status === "Accepted") return "#16a34a";
    if (status === "Preparing") return "#f59e0b";
    if (status === "Delivered") return "#2563eb";
    return "#ef4444";
  }

  return (
    <main
  style={{
    maxWidth: 900,
    margin: "0 auto",
    padding: 20,
    backgroundColor: "#ece6dc",
    minHeight: "100vh",
    opacity: 1,
  }}
>
     <h1
  style={{
    color: "#b91c1c",
    marginBottom: 28,
    fontSize: "clamp(28px,6vw,36px)",
    fontWeight: "bold",
    textAlign: "center",
  }}
>
  📦 My Orders
</h1>
        {orders.length === 0 ? (
  <div
    style={{
      background: "white",
      padding: 40,
      borderRadius: 18,
      textAlign: "center",
      boxShadow: "0 8px 18px rgba(0,0,0,.08)",
    }}
  >
    <div
      style={{
        fontSize: 55,
        marginBottom: 12,
      }}
    >
      📦
    </div>

    <h2
      style={{
        margin: 0,
        color: "#222",
      }}
    >
      No Orders Yet
    </h2>

    <p
      style={{
        color: "#666",
        marginTop: 10,
        fontSize: 16,
      }}
    >
      Your placed orders will appear here.
    </p>
  </div>
) : (

        orders.map((order) => (
          <div
            key={order.firestoreId}
            style={{
  backgroundColor: "#ffffff",
  opacity: 1,
  borderRadius: 18,
  padding: 20,
  marginBottom: 20,
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  color: "#111",
}}
          >
            <h2
  style={{
    margin: 0,
    color: "#b91c1c",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
  }}
>
  Order #{order.id}
</h2>

<div
  style={{
    color: "#444",
    lineHeight: 1.8,
    fontSize: 16,
  }}
>
  <div>📅 <strong>{order.orderDate}</strong></div>
  <div>🕒 <strong>{order.orderTime}</strong></div>

  <div style={{ marginTop: 6 }}>
    📦 Status:
    <span
      style={{
        color: statusColor(order.status),
        fontWeight: "bold",
        marginLeft: 8,
      }}
    >
      {order.status}
    </span>
  </div>
</div>

<hr
  style={{
    margin: "18px 0",
    border: "none",
    borderTop: "1px solid #eee",
  }}
/>

<h3
  style={{
    marginBottom: 12,
    color: "#333",
    fontSize: 20,
  }}
>
  🍽 Ordered Items
</h3>

{order.cart.map((item, index) => (
  <div
    key={index}
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 10,
      fontSize: 17,
    }}
  >
    <span>
      {item.name} × {item.quantity}
    </span>

    <strong>
      ₹{item.price * item.quantity}
    </strong>
  </div>
))}

<hr
  style={{
    margin: "18px 0",
    border: "none",
    borderTop: "1px solid #eee",
  }}
/>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <span
    style={{
      fontSize: 22,
      fontWeight: "bold",
    }}
  >
    Total
  </span>

  <span
    style={{
      fontSize: 28,
      color: "#b91c1c",
      fontWeight: "bold",
    }}
  >
    ₹{order.total}
  </span>
</div>

          </div>
        ))
      )}
    </main>
  );
}