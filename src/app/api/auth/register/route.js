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

  // Insert the new user into Supabase
  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword, role }]);

  console.log();
  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "User created successfully" }),
    {
      status: 201,
    }
  );
}
