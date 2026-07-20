import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "New Maruthi Tiffins",
    short_name: "Maruthi",
    description:
      "Fresh South Indian Tiffins delivered to your doorstep.",

    start_url: "/",

    display: "standalone",

    background_color: "#ece6dc",

    theme_color: "#b91c1c",

    orientation: "portrait",

    scope: "/",

    lang: "en",
icons: [
  {
    src: "/icons/customer/icon-192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "/icons/customer/icon-512.png",
    sizes: "512x512",
    type: "image/png",
  },
  {
    src: "/icons/customer/apple-touch-icon.png",
    sizes: "180x180",
    type: "image/png",
  },
],
  };
}