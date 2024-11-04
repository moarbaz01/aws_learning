import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: file.name,
    Body: buffer,
    ContentType: file.type,
    Metadata: {
      size: file.size.toString(),
      name: file.name,
    },
  };

  try {
    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);
    console.log("File uploaded successfully");
    return { result };
  } catch (error) {
    console.error("Upload error:", error);
    return { error };
  }
};

// Check Existence
export const checkExistence = async (key: string) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };
    const command = new HeadObjectCommand(params);
    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
};

// DELETE FILE
export const deleteFile = async (key: string) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    const result = await s3Client.send(command);
    console.log("File deleted successfully");
    return { result };
  } catch (error) {
    console.error("Delete error:", error);
    return { error };
  }
};

// Get File
export const getFile = async (key: string) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    const result = await s3Client.send(command);
    console.log("File get successfully");
    return { result };
  } catch (error) {
    console.error("Get error:", error);
    return { error };
  }
};

// Generate pre-sign url for temporarily upload
export const getSignedUrlUpload = async (key: string) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };
    const command = new PutObjectCommand(params);
    const result = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    console.log("url get successfully");
    return { result };
  } catch (error) {
    console.error("Get error:", error);
    return { error };
  }
};

// Get signed url
export const getSignedUrlFile = async (key: string) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ResponseContentDisposition: `attachment; filename=${key}`,
    };
    const command = new GetObjectCommand(params);
    const result = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    console.log("url get successfully");
    return { result };
  } catch (error) {
    console.error("Get error:", error);
    return { error };
  }
};

// Downloadable url
export const getDownloadableUrl = (key: string) => {
  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  return url;
};
