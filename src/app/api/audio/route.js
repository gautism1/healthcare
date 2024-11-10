import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";

export async function POST(req) {
  if (!patient_id) {
    return NextResponse.json(
      { error: " patient ID is missing" },
      { status: 400 }
    );
  }

  const { patient_id, audio_link } = await req.json();

  // Insert metadata into audio_files table
  const { data: uploadedData, error: uploadedError } = await supabase
    .from("audio_files")
    .insert([
      {
        patient_id,
        audio_link,
      },
    ])
    .select();

  if (uploadedError) {
    return NextResponse.json({ error: uploadedError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Audio file uploaded successfully 🔊",
    status: 200,
  });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const patient_id = searchParams.get("patient_id");

  if (!patient_id) {
    return NextResponse.json(
      { error: "Patient ID is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("audio_files")
    .select("*")
    .eq("patient_id", patient_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recordings: data, status: 200 });
}
