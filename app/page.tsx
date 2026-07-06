"use client";

import { useEffect, useState, useRef } from "react";
import { createOrder } from "@/src/lib/firestore";
import { getDeviceToken } from "@/src/lib/device";
import Image from "next/image";
import BottomNav from "./components/BottomNav";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";
type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

export default function Home() {
  console.log("HOME PAGE VERSION 123456");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryZone, setDeliveryZone] = useState("0-3");
  const [orderStatus, setOrderStatus] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [menu, setMenu] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
  function loadProfile() {
    const profile = JSON.parse(
      localStorage.getItem("customerProfile") || "{}"
    );

    setCustomerName(profile.name || "");
    setPhone(profile.phone || "");
    setAddress(profile.address || "");
  }

  loadProfile();

  window.addEventListener("focus", loadProfile);

  return () => {
    window.removeEventListener("focus", loadProfile);
  };
}, []);

useEffect(() => {
  alert("NEW VERSION LOADED");
  async function loadMenu() {
    alert("LOAD MENU CALLED");
    try {
     alert("About to fetch Firestore");

const snapshot = await getDocs(collection(db, "menu"));

alert("Firestore returned " + snapshot.size + " docs");

      console.log("Docs:", snapshot.size);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(data);

      setMenu(data);
    } catch (e) {
      console.error(e);
      alert(String(e));
    }
  }

  loadMenu();
}, []);

  function addToCart(name: string, price: number) {
    const exists = cart.find((i) => i.name === name);

    if (exists) {
      setCart(
        cart.map((i) =>
          i.name === name
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          name,
          price,
          quantity: 1,
        },
      ]);
    }
  }

  function increase(name: string) {
    setCart(
      cart.map((i) =>
        i.name === name
          ? {
              ...i,
              quantity: i.quantity + 1,
            }
          : i
      )
    );
  }

  function decrease(name: string) {
    setCart(
      cart
        .map((i) =>
          i.name === name
            ? {
                ...i,
                quantity: i.quantity - 1,
              }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  const subtotal = cart.reduce(
    (a, b) => a + b.price * b.quantity,
    0
  );

  const deliveryFee =
  subtotal === 0
    ? 0
    : subtotal >= 300
    ? 0
    : deliveryZone === "0-3"
    ? 30
    : deliveryZone === "3-6"
    ? 40
    : 60;

  const total = subtotal + deliveryFee;
  
  async function placeOrder() {
    
    if (
      !customerName ||
      !phone ||
      !address ||
      cart.length === 0
    ) {
      alert("Fill all details");
      return;
    }

    const order = {
  id: Date.now(),
  deviceToken: getDeviceToken(),
  customerName,
  phone,
  address,
  customerId: phone,
  cart,
  subtotal,
  deliveryFee,
  deliveryZone,
  total,

  status: "Pending",

  orderTime: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),

  orderDate: new Date().toLocaleDateString(),
};
console.log("ORDER OBJECT:", order);
console.count("createOrder called");
const firestoreId = await createOrder(order);

console.log("Returned Firestore ID:", firestoreId);
localStorage.setItem("customerPhone", phone);
    setShowSuccess(true);

audioRef.current?.play().catch(() => {});

setTimeout(() => {
  setShowSuccess(false);
}, 3000);

    setCart([]);
    setCustomerName("");
    setPhone("");
    setAddress("");
  }

  function statusColor() {
    if (orderStatus === "Accepted")
      return "#16a34a";

    if (orderStatus === "Preparing")
      return "#f59e0b";

    if (orderStatus === "Delivered")
      return "#2563eb";

    return "#ef4444";
  }

  return (
    <main
  style={{
    background: "#ece6dc",
    minHeight: "100vh",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px",
    paddingBottom: "90px",
    boxSizing: "border-box",
    color: "#111",
  }}
>
      <div
  style={{
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: 18,
  marginBottom: 25,
  textAlign: "center",
}}
>
  <Image
  src="/images/logo.png"
  alt="New Maruthi Tiffins"
  width={75}
  height={75}
/>

  <div>
    <h1
      style={{
        margin: 0,
        color: "#b91c1c",
        fontSize: "clamp(28px,6vw,40px)",
      }}
    >
      New Maruthi Tiffins
    </h1>

    <p
      style={{
        margin: 0,
        color: "#555",
        fontSize: "clamp(14px,3vw,18px)",
      }}
    >
      Fresh • Affordable • Same Day Delivery
    </p>
  </div>
</div>
{showSuccess && (
  <div
    style={{
      background: "#16a34a",
      color: "white",
      padding: 20,
      borderRadius: 18,
      marginBottom: 25,
      textAlign: "center",
      boxShadow: "0 8px 24px rgba(22,163,74,.35)",
    }}
  >
    <div
      style={{
        fontSize: "clamp(36px, 8vw, 46px)",
      }}
    >
      ✅
    </div>

    <h2
      style={{
        fontSize: "clamp(22px,5vw,30px)",
        margin: "10px 0",
      }}
    >
      Order Placed Successfully!
    </h2>

    <p>Thank you for choosing New Maruthi Tiffins.</p>
  </div>
)}
      {orderStatus && (
        <div
          style={{
            background: "white",
            padding: 25,
            borderRadius: 18,
            marginBottom: 25,
            boxShadow:
              "0 4px 14px rgba(0,0,0,.08)",
          }}
        >
          <h2>📦 Order Status</h2>

          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: statusColor(),
            }}
          >
            {orderStatus}
          </div>
        </div>
      )}
        <div
  style={{
    background: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    boxShadow:
      "0 4px 14px rgba(0,0,0,.08)",
  }}
>
  <h2
    style={{
      fontSize: "clamp(22px,5vw,28px)",
      color: "#c40000",
      marginBottom: 15,
    }}
  >
    🚚 Delivery Information
  </h2>

  <p
    style={{
      color: "#333",
      marginBottom: 8,
    }}
  >
    🕕 Morning: 6:00 AM – 2:00 PM
  </p>

 <p
style={{
color:"#333",
marginBottom:8,
}}
>
📍 Delivery available within 8 km
</p>

<p
style={{
color:"#333",
marginBottom:8,
}}
>
🚚 0–3 km → ₹30
</p>

<p
style={{
color:"#333",
marginBottom:8,
}}
>
🚚 3–6 km → ₹40
</p>

<p
style={{
color:"#333",
marginBottom:8,
}}
>
🚚 6–8 km → ₹60
</p>

<p
style={{
color:"#16a34a",
fontWeight:"bold",
marginBottom:8,
}}
>
🎉 Orders above ₹300 → FREE Delivery
</p>

<p
style={{
color:"#666",
}}
>
Delivery fee calculated after address confirmation.
</p>
</div>
      <h2
        style={{
          marginBottom: 20,
          color: "#222",
          fontSize: "clamp(24px,5vw,32px)",
        }}
      >
        {"Today's Menu"}
      </h2>

      <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
    alignItems: "stretch",
  }}
>
  <p style={{color:"red",fontSize:24}}>
Menu length: {menu.length}
</p>
<pre
  style={{
    color: "blue",
    whiteSpace: "pre-wrap",
    fontSize: 12,
  }}
>
{JSON.stringify(menu, null, 2)}
</pre>
        {menu.map((item) => (
         <div
  key={item.name}
  style={{
    background: "white",
    padding: "clamp(12px,3vw,24px)",
    display:"flex",
    flexDirection:"column",
    justifyContent:"space-between",
    borderRadius: 18,
    boxShadow: "0 4px 12px rgba(0,0,0,.08)",
  }}
>
  <div style={{color:"red"}}>
{item.name}
</div>
  <Image
  src={item.image}
  alt={item.name}
  width={300}
  height={220}
  style={{
  width: "100%",
  height: 190,
  objectFit: "cover",
  borderRadius: 14,
  display: "block",
  marginBottom: 14,
}}
/>

  <h3
  style={{
    margin: "8px 0",
    fontSize: "clamp(18px,4vw,22px)",
    color: "#222",
    minHeight: 54,
  }}
>
  {item.name}
</h3>

  <p
  style={{
    fontSize: 22,
    fontWeight: "bold",
    color: "#c40000",
    margin: "8px 0 16px",
  }}
>
  ₹{item.price}
</p>

 {(() => {
  const cartItem = cart.find(
    (c) => c.name === item.name
  );

  if (!cartItem) {
    return (
      <button
        onClick={() =>
          addToCart(item.name, item.price)
        }
       style={{
  width: "100%",
  padding: "14px",
  fontSize: 16,
  background: "#c40000",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.2s",
}}
      >
        + Add
      </button>
    );
  }

  return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
      marginTop: 12,
      background: "#f8fafc",
      padding: "10px",
      borderRadius: 14,
    }}
  >
    <button
      onClick={() => decrease(item.name)}
      style={{
        width: 46,
        height: 46,
        fontWeight: "bold",
        borderRadius: 12,
        border: "none",
        background: "#c40000",
        color: "white",
        fontSize: 22,
        cursor: "pointer",
      }}
    >
      −
    </button>

    <span
      style={{
        fontWeight: "bold",
        fontSize: 22,
        minWidth: 40,
        textAlign: "center",
        color: "#222",
      }}
    >
      {cartItem.quantity}
    </span>

    <button
      onClick={() =>
        addToCart(item.name, item.price)
      }
      style={{
        width: 46,
        height: 46,
        fontWeight: "bold",
        borderRadius: 12,
        border: "none",
        background: "#16a34a",
        color: "white",
        fontSize: 22,
        cursor: "pointer",
      }}
    >
      +
    </button>
  </div>
);
})()}
</div>
        ))}
        <pre
  style={{
    color: "blue",
    fontSize: 10,
    whiteSpace: "pre-wrap",
  }}
>
{JSON.stringify(menu.slice(0,2), null, 2)}
</pre>
      </div>

      <div
        style={{
          background: "white",
          marginTop: 40,
          padding: 20,
          boxShadow:"0 8px 20px rgba(0,0,0,.08)",
          border: "1px solid #f1f5f9",
          borderRadius: 20,
        }}
      >
        <h2
  style={{
    fontSize: "clamp(24px,5vw,32px)",
    color: "#222",
    marginTop: 40,
    marginBottom: 20,
  }}
>
  🛒 Your Cart
</h2>

       {cart.map((item) => (
  <div
    key={item.name}
    style={{
      background: "#f8f8f8",
      borderRadius: 14,
      padding: 16,
      marginBottom: 14,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12,
    }}
  >
    <div>
      <h3
        style={{
          margin: 0,
          color: "#222",
        }}
      >
        {item.name}
      </h3>

      <p
        style={{
          margin: "6px 0 0",
          color: "#666",
          fontWeight: "bold",
        }}
      >
        ₹{item.price} × {item.quantity} = ₹
        {item.price * item.quantity}
      </p>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <button
        onClick={() => decrease(item.name)}
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          border: "none",
          background: "#c40000",
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        −
      </button>

      <span
        style={{
          minWidth: 24,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {item.quantity}
      </span>

      <button
        onClick={() => increase(item.name)}
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          border: "none",
          background: "#16a34a",
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        +
      </button>
    </div>
  </div>
))}
        <h3
  style={{
    marginTop: 25,
    color: "#c40000",
  }}
>
  🚚 Select Delivery Distance
</h3>

<label style={{ display: "block", marginBottom: 10 }}>
  <input
    type="radio"
    value="0-3"
    checked={deliveryZone === "0-3"}
    onChange={(e) =>
      setDeliveryZone(e.target.value)
    }
  />
  {" "}0–3 km (₹30)
</label>

<label style={{ display: "block", marginBottom: 10 }}>
  <input
    type="radio"
    value="3-6"
    checked={deliveryZone === "3-6"}
    onChange={(e) =>
      setDeliveryZone(e.target.value)
    }
  />
  {" "}3–6 km (₹40)
</label>

<label style={{ display: "block", marginBottom: 20 }}>
  <input
    type="radio"
    value="6-8"
    checked={deliveryZone === "6-8"}
    onChange={(e) =>
      setDeliveryZone(e.target.value)
    }
  />
  {" "}6–8 km (₹60)
</label>
        <input
        style={{
  width: "100%",
  padding: "14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 16,
  marginBottom: 14,
  boxSizing: "border-box",
}}
          value={customerName}
          onChange={(e) =>
            setCustomerName(
              e.target.value
            )
          }
          placeholder="Your Name"
        />
        <input
        style={{
  width: "100%",
  padding: "14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 16,
  marginBottom: 14,
  boxSizing: "border-box",
}}
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
          placeholder="Phone"
        />
        <textarea
        style={{
  width: "100%",
  padding: "14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 16,
  marginBottom: 14,
  boxSizing: "border-box",
}}
          value={address}
          onChange={(e) =>
            setAddress(
              e.target.value
            )
          }
          placeholder="Address"
        />

        <h3>Subtotal: ₹{subtotal}</h3>

        <h3>
          Delivery: ₹
          {deliveryFee}
        </h3>

        <h2
          style={{
            color: "#c40000",
          }}
        >
          Total: ₹{total}
        </h2>

        <button
          onClick={placeOrder}
          style={{
            background: "#c40000",
            color: "white",
            width:"100%",
padding:"16px",
fontSize:18,
fontWeight:"bold",
cursor:"pointer",
            border: 0,
            borderRadius: 10,
          }}
        >
          Place Order
        </button>
      </div>
      <BottomNav />
      <audio
  ref={audioRef}
  src="/sounds/success.mp3"
/>

    </main>
  );
}