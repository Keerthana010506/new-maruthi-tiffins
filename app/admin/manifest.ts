import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "New Maruthi Tiffins Admin",
    short_name: "Admin",
    description: "Admin Panel for New Maruthi Tiffins",
    start_url: "/admin",
    display: "standalone",
    background_color: "#f5efe4",
    theme_color: "#c62828",
 icons: [
  {
    src: "/icons/admin/icon-192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "/icons/admin/icon-512.png",
    sizes: "512x512",
    type: "image/png",
  },
  {
    src: "/icons/admin/apple-touch-icon.png",
    sizes: "180x180",
    type: "image/png",
  },
],
  };
}