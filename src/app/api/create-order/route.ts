import razorpayInstance from "@/lib/razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount }: { amount: number } = await req.json();

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await razorpayInstance.orders.create(options);
    console.log("order : ",order)
    return NextResponse.json(order);
  } catch (error) {
    console.log("Create Order error  : ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
