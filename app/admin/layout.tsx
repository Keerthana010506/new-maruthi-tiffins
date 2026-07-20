import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Maruthi Admin",
  description: "Admin Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}