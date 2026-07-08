"use client";
import { db} from "@/src/lib/firebase";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { auth } from "@/src/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const [confirmation, setConfirmation] =
    useState<ConfirmationResult | null>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  async function sendOTP() {
  try {
    if (!verifierRef.current) {
      verifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
        }
      );
    }

    const fullPhone = "+91" + phone;

    const result = await signInWithPhoneNumber(
      auth,
      fullPhone,
      verifierRef.current
    );

    setConfirmation(result);

    alert("OTP Sent ✅");
  } catch (err: any) {
  console.error(err);

  alert(`${err.code}\n${err.message}`);
}
}
async function verifyOTP() {
  try {
    if (!confirmation) return;

    await confirmation.confirm(otp);
    const fullPhone = "+91" + phone;

const customerRef = doc(db, "customers", fullPhone);

const customerSnap = await getDoc(customerRef);

if (!customerSnap.exists()) {
  await setDoc(customerRef, {
    phone: fullPhone,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    name: "",
    address: "",
  });
} else {
  await setDoc(
    customerRef,
    {
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );
}
router.push("/");
    
  } 
  catch (err) {
  console.error(err);

  if (err instanceof Error) {
    alert(err.message);
  } else {
    alert("Verification failed.");
  }
}
}

  return (
    <main
      style={{
        maxWidth: 450,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h1>Login</h1>

      <input
        placeholder="Enter Mobile Number"
        value={phone}
        onChange={(e) =>
  setPhone(
    e.target.value.replace(/\D/g, "").slice(0, 10)
  )
}
      />

      <br />
      <br />

      <button onClick={sendOTP}>
        Send OTP
      </button>

      <br />
      <br />

      <input
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <br />
      <br />

      <button onClick={verifyOTP}>
        Verify OTP
      </button>

      <div id="recaptcha-container"></div>
    </main>
  );
}