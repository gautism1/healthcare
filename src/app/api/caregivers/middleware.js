import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function validateAdmin(req) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1]; // Extract JWT token from the Authorization header

    if (!token) {
      return new NextResponse("No token provided", { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the role in the token is 'admin'
    if (decoded.role !== "admin") {
      return new NextResponse("Access denied: Admins only", { status: 403 });
    }

    req.user = decoded; // Attach the decoded user data to the request object
    return NextResponse.next();
  } catch (err) {
    return new NextResponse("Invalid token or expired", { status: 401 });
  }
}
