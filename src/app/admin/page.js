// app/admin/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome, Admin!</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context, authOptions);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/auth/login", // Redirect to sign-in page
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
