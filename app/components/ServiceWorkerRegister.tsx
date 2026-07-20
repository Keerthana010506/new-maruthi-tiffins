"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/src/lib/register-sw";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}