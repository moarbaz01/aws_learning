import { deleteFile, getFile, getSignedUrlFile, uploadFile } from "@/lib/aws";
import { NextResponse } from "next/server";

// Handle POST (File Upload)
export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Image is not found" },
        { status: 400 }
      );
    }

    const { result, error } = await uploadFile(file);
    if (error) {
      return NextResponse.json(
        { message: "Error uploading file", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "File uploaded successfully", result },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Handle DELETE (File Deletion)
export async function DELETE(req: Request) {
  try {
    const { key }: { key: string } = await req.json();
    console.log("hello");

    if (!key) {
      return NextResponse.json(
        { message: "File key is required for deletion" },
        { status: 400 }
      );
    }

    const { result, error } = await deleteFile(key);
    if (error) {
      return NextResponse.json(
        { message: "Error deleting file", error },
        { status: 500 }
      );
    }

    console.log("Result : ", result);
    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Handle GET (Retrieve File)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { message: "File key is required" },
        { status: 400 }
      );
    }

    const { result, error } = await getSignedUrlFile(key);
    if (error) {
      return NextResponse.json(
        { message: "Error retrieving file", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "File retrieved successfully", result },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
