"use client";
import { handlePayment } from "@/utils/checkout";
import Razorpay from "razorpay";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
const Page = () => {
  const product = {
    id: 1,
    name: "Product 1",
    price: 42,
    description: "This is a product",
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchPaymentData = async () => {
    const res = await fetch("/api/payment?payment_id=pay_P44j82po3tPN2k");
    const data = await res.json();
    console.log("Payment Data : ", data);
  };

  useEffect(() => {
    loadRazorpayScript();
  }, []);
  return (
    <div className="p-4 min-h-screen flex items-center justify-center">
      <Toaster />
      <div className="mt-4 flex items-center justify-center flex-col gap-2">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>{product.price}</p>
        <button
          onClick={() => handlePayment({ amount: product.price })}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add to cart
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={fetchPaymentData}
        >
          Fetch Payment Data
        </button>
      </div>
    </div>
  );
};

export default Page;
