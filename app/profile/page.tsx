"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const profile = JSON.parse(
      localStorage.getItem("customerProfile") || "{}"
    );

    setName(profile.name || "");
    setPhone(profile.phone || "");
    setAddress(profile.address || "");
  }, []);

  function saveProfile() {
    localStorage.setItem(
      "customerProfile",
      JSON.stringify({
        name,
        phone,
        address,
      })
    );
    router.push("/");
    alert("Profile Saved Successfully ✅");
  }

  return (
    <main
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 20,
        paddingBottom: 100,
      }}
    >
      <h1>👤 My Profile</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        style={inputStyle}
      />

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone Number"
        style={inputStyle}
      />

      <textarea
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Delivery Address"
        style={{
          ...inputStyle,
          height: 120,
          resize: "none",
        }}
      />

      <button
        onClick={saveProfile}
        style={{
          width: "100%",
          padding: 16,
          background: "#c40000",
          color: "white",
          border: "none",
          borderRadius: 10,
          fontSize: 18,
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Save Profile
      </button>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: 14,
  marginBottom: 18,
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 16,
  boxSizing: "border-box" as const,
};