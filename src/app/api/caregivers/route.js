// app/api/caregivers/route.js
import { getSession } from "next-auth/react";
import { supabase } from "../../../lib/supabaseClient";

export async function GET(req) {
  const session = await getSession({ req });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Not authorized" }), {
      status: 403,
    });
  }

  const { data, error } = await supabase.from("caregivers").select("*");

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

// app/api/caregivers/route.js (POST method for adding caregivers)
export async function POST(req) {
  const session = await getSession({ req });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Not authorized" }), {
      status: 403,
    });
  }

  const { name, email } = await req.json();

  const { data, error } = await supabase
    .from("caregivers")
    .insert([{ name, email }]);

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Caregiver added successfully!" }),
    { status: 200 }
  );
}

// app/api/caregivers/route.js (DELETE method for deleting caregivers)
export async function DELETE(req) {
  const session = await getSession({ req });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Not authorized" }), {
      status: 403,
    });
  }

  const { id } = await req.json();

  const { data, error } = await supabase
    .from("caregivers")
    .delete()
    .eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Caregiver deleted successfully!" }),
    { status: 200 }
  );
}
