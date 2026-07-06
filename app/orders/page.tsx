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
  const q = query(
  collection(db, "orders"),
  where(
    "deviceToken",
    "==",
    getDeviceToken()
  )
);
  const phone = localStorage.getItem("customerPhone");
  const unsubscribe = onSnapshot(q, (snapshot) => {
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
          marginBottom: 25,
        }}
      >
        📦 My Orders
      </h1>

      {orders.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: 30,
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          No previous orders.
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
            <h3>Order #{order.id}</h3>

            <p>📅 {order.orderDate}</p>

            <p>🕒 {order.orderTime}</p>

            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color: statusColor(order.status),
                  fontWeight: "bold",
                }}
              >
                {order.status}
              </span>
            </p>

            <hr />

            {order.cart.map((item, index) => (
              <div key={index}>
                {item.name} × {item.quantity}
              </div>
            ))}

            <hr />

            <h3>Total ₹{order.total}</h3>
          </div>
        ))
      )}
    </main>
  );
}