import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function POST(req) {
  const bucketName = process.env.AWS_BUCKET_NAME; // Ensure this bucket exists
  const region = "ap-south-1"; // Set your S3 region

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS,
    },
  });

  try {
    // Generate a unique filename using Date.now()
    const uniqueFileName = `${Date.now()}-file.webm`; // Use timestamp for uniqueness

    // Create a command for the PUT operation
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      ContentType: "video/webm", // Set the correct content type
    });

    // Generate the signed URL for uploading the file
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL will expire in 1 hour
    });

    // Return the signed URL for uploading the file
    return NextResponse.json({
      signedUrl,
      fileName: uniqueFileName,
      message: "Signed URL generated successfully",
      status: 200,
    });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
