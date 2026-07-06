"use client";
import { getMenuItems } from "@/src/lib/firestore";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

import DashboardCards from "../components/DashboardCards";
import OrderCard from "../components/OrderCard";

type CartItem = {
  name: string;
  quantity: number;
  price: number;
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

type MenuItem = {
  firestoreId: string;
  name: string;
  price: number;
  image: string;
  category: string;
};
export default function AdminPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  useEffect(() => {
  async function loadMenu() {
    const items = await getMenuItems();

    setMenu(items as MenuItem[]);
  }

  loadMenu();
}, []);
  const router = useRouter();
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedStatus, setSelectedStatus] =
  useState("Pending");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingOrders = orders.filter(
  (order) => order.status === "Pending"
);
const acceptedOrders = orders.filter(
  (order) => order.status === "Accepted"
);

const preparedOrders = orders.filter(
  (order) => order.status === "Prepared"
);

const deliveredOrders = orders.filter(
  (order) => order.status === "Delivered"
);

const totalRevenue = deliveredOrders.reduce(
  (sum, order) => sum + order.total,
  0
);
const displayedOrders =
  selectedStatus === "Pending"
    ? pendingOrders
    : selectedStatus === "Accepted"
    ? acceptedOrders
    : selectedStatus === "Prepared"
    ? preparedOrders
    : selectedStatus === "Delivered"
    ? deliveredOrders
    : orders;
useEffect(() => {
  const loggedIn =
    localStorage.getItem("adminLoggedIn");

  if (loggedIn !== "true") {
    router.replace("/admin-login");
    return;
  }

  setCheckingLogin(false);
}, [router]);

useEffect(() => {

  const q = query(collection(db, "orders"));

  const unsubscribe = onSnapshot(q, (snapshot) => {

    const firebaseOrders = snapshot.docs.map((doc) => ({
      firestoreId: doc.id,
      ...doc.data(),
    })) as unknown as Order[];


    firebaseOrders.sort(
      (a, b) => Number(b.id) - Number(a.id)
    );

    setOrders(firebaseOrders);
  });

  return () => unsubscribe();
}, []);

useEffect(() => {
  if (!audioRef.current) return;

  if (pendingOrders.length > 0) {
    audioRef.current.loop = true;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  } else {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
}, [pendingOrders.length]);
async function updateStatus(
  firestoreId: string,
  status: string
) {
  const order = orders.find(
  (o) => o.firestoreId === firestoreId
);

if (!order) return;

  const updates: Record<string, unknown> = {
    status,
  };

  if (status === "Delivered") {
    updates.deliveredTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Update Firestore
  await updateDoc(
    doc(db, "orders", order.firestoreId),
    updates
  );

  // Immediately update local state
  setOrders((prev) =>
  prev.map((o) =>
    o.firestoreId === firestoreId
        ? {
            ...o,
            status,
            ...(status === "Delivered"
              ? { deliveredTime: updates.deliveredTime as string }
              : {}),
          }
        : o
    )
  );
  setSuccessMessage(`✅ Order marked as ${status}`);

setTimeout(() => {
  setSuccessMessage("");
}, 2000);
}

if (checkingLogin) {
  return null;
}
  function statusColor(status: string) {
    if (status === "Accepted")
      return "#16a34a";

    if (status === "Prepared")
      return "#f59e0b";

    if (status === "Delivered")
      return "#2563eb";

    return "#ef4444";
  }
  return (
    <div
  style={{
    background: "#ece6db",
    minHeight: "100vh",
    padding: "clamp(12px, 3vw, 30px)",
  }}
>
    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
    flexWrap: "wrap",
    marginBottom: 30,
  }}
>
  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  }}
>
   <Image
  src="/images/logo.png"
  alt="New Maruthi Tiffins"
  width={55}
  height={55}
      style={{
        borderRadius: 12,
      }}
    />

    <div>
      <h1
        style={{
          margin: 0,
          color: "#b91c1c",
          fontSize: "clamp(20px,5vw,32px)",
        }}
      >
        New Maruthi Tiffins
      </h1>

      <p
  style={{
    margin: 0,
    color: "#555",
    fontSize: "clamp(13px,3vw,16px)",
  }}
>
        Admin Dashboard
      </p>
    </div>
  </div>

  <div
    style={{
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
    }}
  >

    <button
      onClick={() => {
  const ok = window.confirm("Are you sure you want to logout?");

  if (!ok) return;

  localStorage.removeItem("adminLoggedIn");
  router.push("/admin-login");
}}
     style={{
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "10px 18px",
width: "100%",
maxWidth: 120,
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 15,
  minWidth: 100,
}}
    >
      Logout
    </button>
  </div>
</div>
{pendingOrders.length > 0 && (
  <div
    style={{
      background: "#dc2626",
      color: "white",
      padding: "16px",
      borderRadius: 16,
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "clamp(18px, 4vw, 22px)",
      marginBottom: 25,
      boxShadow: "0 8px 20px rgba(220,38,38,.35)",
    }}
  >
    🔔 NEW ORDER RECEIVED!
    <br />
    <span style={{ fontSize: 16 }}>
      Waiting for acceptance...
    </span>
  </div>
)}

{successMessage && (
  <div
    style={{
      background: "#16a34a",
      color: "white",
      padding: "14px",
      borderRadius: 14,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 20,
      boxShadow: "0 6px 16px rgba(22,163,74,.3)",
    }}
  >
    {successMessage}
  </div>
)}

       <div
  style={{
    marginBottom: 25,
  }}
>
  <DashboardCards
  pending={pendingOrders.length}
  accepted={acceptedOrders.length}
  preparing={preparedOrders.length}
  delivered={deliveredOrders.length}
  revenue={totalRevenue}
  selectedStatus={selectedStatus}
  setSelectedStatus={setSelectedStatus}
/>
</div>
<div
  style={{
    marginTop: 30,
    marginBottom: 30,
  }}
>
</div>

<div
  style={{
    display: "flex",
    justifyContent: "center",
    margin: "20px 0 30px",
  }}
>
  <button
    onClick={() => router.push("/admin/menu")}
    style={{
      background: "#b91c1c",
      color: "white",
      border: "none",
      padding: "14px 24px",
      borderRadius: 12,
      cursor: "pointer",
      fontSize: 16,
      fontWeight: "bold",
      boxShadow: "0 4px 10px rgba(0,0,0,.15)",
    }}
  >
    🍽 Manage Menu
  </button>
</div>

    <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 20,
  }}
>
     {displayedOrders.map((order, index) => (
  <OrderCard
    key={order.firestoreId}
    order={order}
    index={index}
    updateStatus={updateStatus}
    statusColor={statusColor}
  />
))}
</div>
    <audio
  ref={audioRef}
  src="/sounds/notification.mp3"
  loop
/>
    </div>
  );
}