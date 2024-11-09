import bcrypt from "bcrypt";

// Hash the password with bcrypt
export async function hashPassword(password) {
  const saltRounds = 10; // Adjust salt rounds as needed
  return await bcrypt.hash(password, saltRounds);
}

// Compare the password with the stored hash
export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
