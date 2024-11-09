// app/api/auth/signup/route.js
import { hashPassword } from "../../../lib/auth";
import { supabase } from "../../../lib/supabaseClient";

export async function POST(req) {
  const { email, password, role } = await req.json();

  // Validate input
  if (!email || !password) {
    return new Response(JSON.stringify({ message: "Missing fields" }), {
      status: 400,
    });
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  try {
    // Check if the user already exists
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("id, password")
      .eq("email", email)
      .single();

    if (findError && findError.code !== "PGRST116") {
      // Handle any unexpected errors
      throw new Error(findError.message);
    }

    if (existingUser) {
      // User exists; check if the password is null
      if (!existingUser.password) {
        // Update password if it's null
        const { error: updateError } = await supabase
          .from("users")
          .update({ password: hashedPassword })
          .eq("id", existingUser.id);

        if (updateError) throw new Error(updateError.message);

        return new Response(
          JSON.stringify({ message: "Password updated successfully" }),
          { status: 200 }
        );
      } else {
        return new Response(
          JSON.stringify({ message: "User already registered" }),
          { status: 409 }
        );
      }
    } else {
      // Insert a new user
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ email, password: hashedPassword, role }]);

      if (insertError) throw new Error(insertError.message);

      return new Response(
        JSON.stringify({ message: "User created successfully" }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error handling signup:", error.message);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
