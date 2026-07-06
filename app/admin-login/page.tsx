"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    if (
      username === "admin" &&
      password === "maruthi123"
    ) {
      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      router.push("/admin");
    } else {
      alert("Invalid Username or Password");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#ece6db",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 35,
          borderRadius: 20,
          width: 350,
          boxShadow:
            "0 8px 20px rgba(0,0,0,.12)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#b91c1c",
          }}
        >
          Admin Login
        </h1>

        <br />

        <input
  placeholder="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",
    color: "#111111",
    fontSize: 16,
    outline: "none",
  }}
/>

        <input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",
    color: "#111111",
    fontSize: 16,
    outline: "none",
  }}
/>

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: 14,
            border: "none",
            borderRadius: 12,
            background: "#b91c1c",
            color: "white",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </main>
  );
}