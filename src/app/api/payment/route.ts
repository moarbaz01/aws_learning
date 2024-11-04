import { NextResponse } from "next/server";
import razorpayInstance from "@/lib/razorpay";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const payment_id = searchParams.get("payment_id");
    if (!payment_id) throw new Error("Payment ID is required");

    // Razorpay instance
    const payment = await razorpayInstance.payments.fetch(payment_id);
    return NextResponse.json({
      payment,
      message: "Payment details fetched",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 400 }
    );
  }
}
