// app/api/users/[email]/route.js
import { supabase } from "../../../lib/supabaseClient";

export async function GET({ params }) {
  const { email } = params;

  // Fetch user from Supabase
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
  });
}
