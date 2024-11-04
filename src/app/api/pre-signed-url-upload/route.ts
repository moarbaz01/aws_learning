import { getSignedUrlUpload } from "@/lib/aws";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key) {
      return NextResponse.json({ message: "Missing key" }, { status: 500 });
    }
    const { result, error } = await getSignedUrlUpload(key);
    if (error) {
      return NextResponse.json(
        { message: "Error retrieving signed url" },
        { status: 500 }
      );
    }
    return NextResponse.json({ result }, { status: 200 });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
