import { supabase } from "../../lib/supabaseClient";

// Import your Supabase client
import { NextResponse } from "next/server";
import { validateAdmin } from "./middleware";

// Create caregiver route
export async function POST(req) {
  await validateAdmin(req); // Ensure admin is calling

  const { email } = await req.json(); // Extract details from request body

  // Check if the user exists
  let { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code === "PGRST116") {
    // User does not exist
    // Create a new user and assign 'caregiver' role
    const { data, error: createError } = await supabase
      .from("users")
      .insert([{ email, role: "caregiver" }])
      .select();

    if (createError)
      return new NextResponse("Error creating user", {
        status: 400,
        error: createError,
      });

    user = data[0]; // Assign newly created user
  } else {
    // Update the existing user to have a caregiver role
    const { data, error: updateError } = await supabase
      .from("users")
      .update({ role: "caregiver" })
      .eq("email", email)
      .select();

    if (updateError)
      return new NextResponse("Error updating user", { status: 400 });

    user = data[0]; // Updated user
  }

  // Send email (this could be a third-party service or an internal API)
  // You can use something like NodeMailer or a service like SendGrid

  return new NextResponse("Caregiver added or updated", { status: 200 });
}

// Delete caregiver route
export async function DELETE(req) {
  await validateAdmin(req); // Ensure admin is calling

  const { id } = await req.json(); // Extract email from request body

  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", id)
    .select();

  console.log(">>>", error);

  if (error && error.code === "23503") {
    return new NextResponse(
      "Cannot delete caregiver as it has patients added",
      {
        status: 400,
      }
    );
  }
  if (error)
    return new NextResponse("Error deleting caregiver", { status: 400 });

  return new NextResponse("Caregiver deleted", { status: 200 });
}

// Fetch all caregivers route
export async function GET(req) {
  await validateAdmin(req); // Ensure admin is calling

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "caregiver");

  if (error)
    return new NextResponse("Error fetching caregivers", { status: 400 });

  return new NextResponse(JSON.stringify(data), { status: 200 });
}
