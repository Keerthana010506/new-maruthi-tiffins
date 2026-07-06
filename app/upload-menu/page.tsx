"use client";

import { menu } from "../data/menu";
import { createMenuItem } from "@/src/lib/firestore";

export default function UploadMenuPage() {
  async function uploadMenu() {
    for (const item of menu) {
      await createMenuItem(item);
    }

    alert("Menu Uploaded Successfully!");
  }

  return (
    <main
      style={{
        padding: 40,
        textAlign: "center",
      }}
    >
      <h1>Upload Menu to Firestore</h1>

      <button
        onClick={uploadMenu}
        style={{
          padding: 16,
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        Upload Menu
      </button>
    </main>
  );
}