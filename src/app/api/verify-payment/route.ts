import { NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      await req.json();

    const shasum = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = shasum.digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Invalid Signature" },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Payment verified", success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
