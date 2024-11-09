export function decodeJWT(token) {
  const parts = token.split("."); // JWT has 3 parts separated by '.'

  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  // Decode the Payload (the second part of the token)
  const payload = parts[1];

  // Decode the base64 URL-encoded string and parse the payload
  const decodedPayload = JSON.parse(
    atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
  );

  return decodedPayload;
}

export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null; // Invalid token
  }
};

export const isAdmin = (token) => {
  const decoded = verifyJWT(token);
  return decoded?.role === "admin"; // Check if the decoded JWT has admin role
};
