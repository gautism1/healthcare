import { supabase } from "../../lib/supabaseClient";
import { NextResponse } from "next/server";
import { validateCaregiver } from "./middleware";

// Create patient route
export async function POST(req) {
  await validateCaregiver(req);
  const { name, caregiver_id } = await req.json(); // Extract details from request body

  const { data, error: createError } = await supabase
    .from("patients")
    .insert([{ name, caregiver_id }])
    .select();

  if (createError) {
    if (error) return new NextResponse("Error adding patient", { status: 400 });
  }

  return new NextResponse("Patient added or updated", { status: 200 });
}

// Delete patient route
export async function DELETE(req) {
  await validateCaregiver(req); // Ensure caregiver is calling

  const { id } = await req.json(); // Extract ID from request body

  const { data, error } = await supabase.from("patients").delete().eq("id", id);

  if (error) return new NextResponse("Error deleting patient", { status: 400 });

  return new NextResponse("Patient deleted", { status: 200 });
}

// app/api/caregivers/route.js (or route.ts if using TypeScript)

export async function GET(req) {
  try {
    // Extract caregiver_id from query parameters
    const url = new URL(req.url);
    const caregiver_id = url.searchParams.get("caregiver_id");

    // Ensure caregiver_id is provided
    if (!caregiver_id) {
      return new NextResponse("caregiver_id is required", { status: 400 });
    }

    // Validate caregiver permissions (you can add more checks here)
    await validateCaregiver(req); // Ensure the user is allowed to query this info

    // Fetch patients associated with the caregiver_id
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("caregiver_id", caregiver_id);

    if (error) {
      return new NextResponse("Error fetching patients", { status: 400 });
    }

    // Return patients data
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching caregivers or patients:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
