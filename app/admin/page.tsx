"use client";
import {
  getMenuItems,
  getRestaurantStatus,
  updateRestaurantStatus,
} from "@/src/lib/firestore";
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
  available: boolean;
};
export default function AdminPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [restaurantOpen, setRestaurantOpen] = useState(true);

  useEffect(() => {
  async function loadData() {
    const items = await getMenuItems();
    setMenu(items as MenuItem[]);

    const status = await getRestaurantStatus();
    setRestaurantOpen(status);
  }

  loadData();
}, []);
  const router = useRouter();
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedStatus, setSelectedStatus] =
  useState("Pending");
  const [searchText, setSearchText] = useState("");
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
const today = new Date();

const todayString = today.toLocaleDateString("en-GB");

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const yesterdayString = yesterday.toLocaleDateString("en-GB");

const todayRevenue = deliveredOrders
  .filter((order) => order.orderDate === todayString)
  .reduce((sum, order) => sum + order.total, 0);

const yesterdayRevenue = deliveredOrders
  .filter((order) => order.orderDate === yesterdayString)
  .reduce((sum, order) => sum + order.total, 0);

const weekStart = new Date();
weekStart.setDate(today.getDate() - today.getDay());

const weekRevenue = deliveredOrders
  .filter((order) => {
    if (!order.orderDate) return false;

    const [day, month, year] = order.orderDate.split("/");

    const orderDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return orderDate >= weekStart;
  })
  .reduce((sum, order) => sum + order.total, 0);

const monthRevenue = deliveredOrders
  .filter((order) => {
    if (!order.orderDate) return false;

    const [day, month, year] = order.orderDate.split("/");

    return (
      Number(month) === today.getMonth() + 1 &&
      Number(year) === today.getFullYear()
    );
  })
  .reduce((sum, order) => sum + order.total, 0);
  
const displayedOrders =
  selectedStatus === "Pending"
    ? pendingOrders
    : selectedStatus === "Accepted"
    ? acceptedOrders
    : selectedStatus === "Prepared"
    ? preparedOrders
    : selectedStatus === "Delivered"
    ? deliveredOrders
    : selectedStatus === "Revenue"
    ? []
    : orders;

  const filteredOrders = displayedOrders.filter((order) => {
  const search = searchText.toLowerCase().trim();

  return (
    order.customerName.toLowerCase().includes(search) ||
    order.phone.includes(search) ||
    String(order.id).includes(search)
  );
});

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
    onClick={() => setSelectedStatus("Pending")}
    style={{
      background: "#dc2626",
      color: "white",
      padding: "16px",
      cursor: "pointer",
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
   <span
  style={{
    fontSize: 16,
    display: "block",
    marginTop: 6,
  }}
>
  Waiting for acceptance...
</span>

<span
  style={{
    fontSize: 13,
    opacity: 0.9,
  }}
>
  Tap here to view pending orders
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
    {/* ===== Top Controls ===== */}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  }}
>
  {/* Restaurant Status */}

  <button
    onClick={async () => {
      const newStatus = !restaurantOpen;

      await updateRestaurantStatus(newStatus);

      setRestaurantOpen(newStatus);
    }}
    style={{
      background: restaurantOpen ? "#16a34a" : "#dc2626",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: 12,
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: 15,
    }}
  >
    {restaurantOpen
      ? "🟢 Restaurant Open"
      : "🔴 Restaurant Closed"}
  </button>

  {/* Manage Menu */}

  <button
    onClick={() => router.push("/admin/menu")}
    style={{
      background: "#b91c1c",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: 12,
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: 15,
    }}
  >
    🍽 Manage Menu
  </button>

  {/* Revenue */}

  <div
  onClick={() => setSelectedStatus("Revenue")}
  style={{
    background: "#fff",
    padding: "10px 18px",
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 3px 10px rgba(0,0,0,.08)",
    textAlign: "center",
    minWidth: 90,
  }}
>
  <div
    style={{
      fontSize: 12,
      color: "#666",
      fontWeight: 600,
    }}
  >
    💰 Today
  </div>

  <div
    style={{
      fontSize: 20,
      fontWeight: "bold",
      color: "#111",
    }}
  >
    ₹{todayRevenue}
  </div>
</div>

</div>

{/* ===== Order Tabs ===== */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
    marginBottom: 20,
  }}
>
</div>

  {[
    {
      label: "Accepted",
      value: "Accepted",
    },
    {
      label: "Ready",
      value: "Prepared",
    },
    {
      label: "Delivered",
      value: "Delivered",
    },

    

  ].map((tab) => (
    <button
      key={tab.value}
      onClick={() => setSelectedStatus(tab.value)}
      style={{
        flex: 1,
        minWidth: 0,
        padding: "10px 6px",
        fontSize: 13,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        background:
          selectedStatus === tab.value
            ? "#b91c1c"
            : "#ffffff",
        color:
          selectedStatus === tab.value
            ? "white"
            : "#333",
        boxShadow: "0 3px 10px rgba(0,0,0,.08)",
      }}
    >
      {tab.label}
    </button>
  ))}
</div>

{/* ===== Pending Orders ===== */}

{selectedStatus === "Pending" && (
  <h2
    style={{
      marginBottom: 18,
      color: "#dc2626",
      fontSize: 24,
    }}
  >
    🔔 Pending Orders
  </h2>
)}

    {selectedStatus === "Revenue" ? (

<div
  style={{
    background: "#FFF8E7",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
    marginTop: 20,
  }}
>

  <h2
    style={{
      color: "#2d2d2d",
      marginTop: 0,
      marginBottom: 24,
    }}
  >
    💰 Revenue Summary
  </h2>

  <div
  style={{
    fontSize: 18,
    lineHeight: 2,
    color: "#2d2d2d",
  }}
>

    <div>
      Today's Revenue
      <strong
  style={{
    float: "right",
    color: "#111",
    fontWeight: 700,
  }}
>
        ₹{todayRevenue}
      </strong>
    </div>

    <div>
      Yesterday
      <strong
  style={{
    float: "right",
    color: "#111",
    fontWeight: 700,
  }}
>
        ₹{yesterdayRevenue}
      </strong>
    </div>

    <div>
      This Week
      <strong
  style={{
    float: "right",
    color: "#111",
    fontWeight: 700,
  }}
>
        ₹{weekRevenue}
      </strong>
    </div>

    <div>
      This Month
      <strong
  style={{
    float: "right",
    color: "#111",
    fontWeight: 700,
  }}
>
        ₹{monthRevenue}
      </strong>
    </div>

    <hr
  style={{
    margin: "22px 0",
    border: "none",
    borderTop: "1px solid #ddd",
  }}
/>

    <div
      style={{
        fontSize:24,
        fontWeight:"bold",
        color: "#2d2d2d",
      }}
    >
      Total Revenue
      <span style={{float:"right"}}>
        ₹{totalRevenue}
      </span>
    </div>

  </div>

</div>

) : (

<>
  {selectedStatus === "Delivered" && (
    <div
  style={{
    marginBottom: 24,
    background: "#ece6db",
    padding: "8px 0",
  }}
>
      <input
        type="text"
        placeholder="🔍 Search by Order ID, Customer or Phone"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid #ddd",
          fontSize: 16,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  )}

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 20,
    }}
  >
    {filteredOrders.length === 0 ? (
  <div
    style={{
  width: "100%",
  padding: "16px 18px",
  borderRadius: 16,
  border: "2px solid #d6d3d1",
  background: "#ffffff",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
}}
  >
    No orders found.
  </div>
) : (
  filteredOrders.map((order, index) => (
    <OrderCard
      key={order.firestoreId}
      order={order}
      index={index}
      updateStatus={updateStatus}
      statusColor={statusColor}
    />
  ))
)}
  </div>
</>

)}

<audio
  ref={audioRef}
  src="/sounds/notification.mp3"
  loop
/>
    </div>
  );
}