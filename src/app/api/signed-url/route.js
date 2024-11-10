import { supabase } from "../../lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  const bucketName = "myfiles"; // Ensure this bucket exists

  try {
    // Generate a unique filename using Date.now() (ensure this file will be uploaded)
    const uniqueFileName = `${Date.now()}.webm`; // Use timestamp and append .webm extension

    // Generate a signed URL for uploading to the storage bucket
    const { signedUrl, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(uniqueFileName, 3600); // 1 hour expiry for upload

    if (error) {
      throw error;
    }

    // Return the signed URL for uploading the file
    return NextResponse.json({
      signedUrl: signedUrl, // Signed URL to upload the file
      fileName: uniqueFileName, // Filename to reference during upload
      message: "Signed URL generated successfully",
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
