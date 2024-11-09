// app/api/auth/login/route.js
import { comparePassword } from "../../../lib/auth"; // Import the bcrypt-based comparison
import { supabase } from "../../../lib/supabaseClient";
import { sign } from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();

  // Retrieve the user data from Supabase
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, password, role")
    .eq("email", email)
    .single();

  if (error) {
    return new Response(JSON.stringify({ message: "User not found", error }), {
      status: 404,
    });
  }

  // Verify password with bcrypt
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return new Response(JSON.stringify({ message: "Invalid password" }), {
      status: 401,
    });
  }

  // Create JWT token
  const token = sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return new Response(
    JSON.stringify({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    }),
    { status: 200 }
  );
}
