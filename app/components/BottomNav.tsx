"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Home",
      icon: "🏠",
      href: "/",
    },
    {
      name: "Orders",
      icon: "📦",
      href: "/orders",
    },
    {
      name: "Profile",
      icon: "👤",
      href: "/profile",
    },
  ];

  return (
    <div
      style={{
  position: "fixed",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  maxWidth: "1200px",
  background: "#fff",
  borderTop: "1px solid #ddd",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "10px 0",
  zIndex: 1000,
  boxShadow: "0 -8px 24px rgba(0,0,0,.15)",
  borderTopLeftRadius: 18,
borderTopRightRadius: 18,
}}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          style={{
            textDecoration: "none",
            color:
              pathname === tab.href
                ? "#c40000"
                : "#666",
            textAlign: "center",
            fontWeight:
              pathname === tab.href
                ? "bold"
                : "normal",
            fontSize: 14,
          }}
        >
          <div
            style={{
              fontSize: 24,
            }}
          >
            {tab.icon}
          </div>

          {tab.name}
        </Link>
      ))}
    </div>
  );
}