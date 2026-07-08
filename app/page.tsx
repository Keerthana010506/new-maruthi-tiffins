"use client";

import { useEffect, useState, useRef } from "react";
import { createOrder } from "@/src/lib/firestore";
import { getDeviceToken } from "@/src/lib/device";
import Image from "next/image";
import BottomNav from "./components/BottomNav";
import {
  collection,
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
 
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryZone, setDeliveryZone] = useState("0-3");
  const [orderStatus, setOrderStatus] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [menu, setMenu] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cartSectionRef = useRef<HTMLDivElement | null>(null);
  const [showFloatingCart, setShowFloatingCart] = useState(true);

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
  const q = query(collection(db, "menu"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      firestoreId: doc.id,
      ...doc.data(),
    }));

    setMenu(data);
  });

  return () => unsubscribe();
}, []);

useEffect(() => {
  function handleScroll() {
    if (!cartSectionRef.current) return;

    const rect = cartSectionRef.current.getBoundingClientRect();

    // Hide cart when checkout section comes into view
    setShowFloatingCart(rect.top > window.innerHeight - 200);
  }

  window.addEventListener("scroll", handleScroll);

  handleScroll();

  return () => window.removeEventListener("scroll", handleScroll);
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
  createdAt: Date.now(),
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
await createOrder(order);


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
    padding: "10px",
    paddingBottom: "120px",
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
  gap: 10,
  marginBottom: 25,
  textAlign: "center",
}}
>

  <Image
  src="/images/logo.png"
  alt="New Maruthi Tiffins"
  width={45}
  height={45}
  style={{
    width: "45px",
    height: "45px",
  }}
/>

  <div>
    <h1
      style={{
        margin: 0,
        color: "#b91c1c",
        fontSize: 28,
      }}
    >
      New Maruthi Tiffins
    </h1>

    <p
      style={{
        margin: 0,
        color: "#555",
        fontSize: 12,
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
    gridTemplateColumns: "repeat(2, minmax(0,1fr))",
    gap: 12,
    width: "100%",
  }}
>

        {menu
  .filter((item) => item.inStock && item.available)
  .map((item) => (
         <div
  key={item.name}
  style={{
  background: "white",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
  display: "flex",
  flexDirection: "column",
  width: "100%",
}}
>

  <Image
  src={item.image}
  alt={item.name}
  width={300}
  height={220}
  style={{
  width: "100%",
  height: 105,
  objectFit: "cover",
  borderRadius: 0,
  display: "block",
  marginBottom: 8,
}}
/>

  <h3
  style={{
    margin: "4px 0",
    fontSize: 15,
    fontWeight:600,
    color: "#222",
  }}
>
  {item.name}
</h3>

  <p
  style={{
    fontSize: 17,
    fontWeight: "bold",
    color: "#c40000",
    margin: "2px 0 10px",
  }}
>
  ₹{item.price}
</p>

 {(() => {
  const cartItem = cart.find(
    (c) => c.name === item.name
  );

  // Item unavailable
  if (!item.available) {
    return (
      <button
        disabled
        style={{
          width: "100%",
          padding: 10,
          background: "#999",
          color: "white",
          border: "none",
          borderRadius: 12,
        }}
      >
        Out of Stock
      </button>
    );
  }

  // Item available but NOT in cart
  if (!cartItem) {
    return (
      <button
        onClick={() => addToCart(item.name, item.price)}
        style={{
          width: "100%",
          padding: "8px",
          fontSize: 14,
          background: "#c40000",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        + Add
      </button>
    );
  }

  // Item available AND already in cart
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
          width: 38,
          height: 38,
          fontWeight: "bold",
          borderRadius: 12,
          border: "none",
          background: "#c40000",
          color: "white",
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        −
      </button>

      <span
        style={{
          fontWeight: "bold",
          fontSize: 18,
          minWidth: 40,
          textAlign: "center",
          color: "#222",
        }}
      >
        {cartItem.quantity}
      </span>

      <button
        onClick={() => addToCart(item.name, item.price)}
        style={{
          width: 38,
          height: 38,
          fontWeight: "bold",
          borderRadius: 12,
          border: "none",
          background: "#16a34a",
          color: "white",
          fontSize: 18,
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
        
      </div>

     <div
    ref={cartSectionRef}
  style={{
    background: "#fff",
    marginTop: 32,
    padding: 18,
    boxShadow: "0 6px 16px rgba(0,0,0,.06)",
    borderRadius: 18,
    border: "1px solid #ececec",
  }}
>
       <h2
  style={{
    fontSize: "clamp(22px,5vw,28px)",
    fontWeight: 700,
    color: "#b91c1c",
    marginTop: 20,
    marginBottom: 24,
    textAlign: "center",
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
      justifyContent: "flex-start",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
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
    marginTop: 20,
    color: "#c40000",
  }}
>
  🚚 Select Delivery Distance
</h3>

<label
  style={{
    display: "block",
    marginBottom: 8,
    fontSize: 16,
  }}
>

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


<label
  style={{
    display: "block",
    marginBottom: 8,
    fontSize: 16,
    color: "#333",
  }}
>

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

<label
  style={{
    display: "block",
    marginBottom: 8,
    fontSize: 16,
    color: "#333",
  }}
>
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
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 15,
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
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 15,
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
  padding: "12px",
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

      <div
  style={{
    marginTop: 20,
    marginBottom: 20,
    background: "#fafafa",
    borderRadius: 14,
    padding: 18,
    border: "1px solid #e5e5e5",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 12,
      fontSize: 16,
      color: "#444",
    }}
  >
    <span>Subtotal</span>
    <strong>₹{subtotal}</strong>
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 12,
      fontSize: 16,
      color: "#444",
    }}
  >
    <span>Delivery</span>
    <strong>₹{deliveryFee}</strong>
  </div>

  <hr
    style={{
      border: "none",
      borderTop: "1px dashed #ddd",
      margin: "14px 0",
    }}
  />

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 20,
      fontWeight: "bold",
      color: "#c40000",
    }}
  >
    <span>Total</span>
    <span>₹{total}</span>
  </div>
</div>

        <button
          onClick={placeOrder}
          style={{
  background: "#c40000",
  color: "white",
  width: "100%",
  padding: "14px",
  marginTop: 18,
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
  border: "none",
  borderRadius: 14,
  boxShadow: "0 6px 15px rgba(196,0,0,.25)",
  transition: "0.2s",
}}
        >
          Place Order
        </button>
      </div>
      {cart.length > 0 && showFloatingCart && (
  <div
    onClick={() =>
      cartSectionRef.current?.scrollIntoView({
        behavior: "smooth",
      })
    }
    style={{
      position: "fixed",

      left: 16,
      right: 16,

      bottom: 100,

      background: "#c40000",

      color: "#fff",

      borderRadius: 999,

      padding: "14px 18px",

      display: "flex",

      justifyContent: "space-between",

      alignItems: "center",

      boxShadow: "0 10px 30px rgba(196,0,0,.35)",

      cursor: "pointer",

      zIndex: 999,
    }}
  >
    <div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        🛒 {cart.reduce((a, b) => a + b.quantity, 0)} Items
      </div>

      <div
        style={{
          fontSize: 13,
          opacity: 0.9,
        }}
      >
        Tap to view cart
      </div>
    </div>

    <div
      style={{
        fontSize: 22,
        fontWeight: "bold",
      }}
    >
      ₹{total} →
    </div>
  </div>
)}
      <BottomNav />
      
      <audio
  ref={audioRef}
  src="/sounds/success.mp3"
/>

    </main>
  );
}