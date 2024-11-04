import toast from "react-hot-toast";

// Verify Payment
export const verifyPayment = async ({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
}: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) => {
  const response = await fetch("/api/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    }),
  }).then((res) => res.json());

  return response;
};

// Handle Payment
export const handlePayment = async ({ amount }: { amount: number }) => {
  // Create an order on the server
  const orderData = await fetch("/api/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  }).then((res) => res.json());

  // Initialize Razorpay payment
  const options = {
    key: process.env.RAZORPAY_KEY_ID, // Client-side Razorpay key
    amount: orderData.amount,
    currency: orderData.currency,
    name: "Dangue",
    description: "Bapu Bha",
    order_id: orderData.id, // Razorpay order ID
    image:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    handler: async function (response: any) {
      // Handle successful payment
      const result = await verifyPayment({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });
      if (result.success) {
        toast.success("Payment successful");
      } else {
        toast.error("Payment failed");
      }
    },
    model: {
      ondismiss: function () {
        console.log("Payment cancelled");
      },
    },
    prefill: {
      name: "John Doe",
      email: "john.doe@example.com",
      contact: "9999999999",
    },
    method: {
      netbanking: false,
      card: false,
      upi: true,
      wallet: false,
      paylater: false,
    },
    theme: {
      color: "black",
    },
    notes : {
      address : "Razorpay Corporate Office"
    },
    redirect: {
      success: "http://localhost:3000/",
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
