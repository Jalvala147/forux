import Link from "next/link";
import { getAuthUser, ensureProfile } from "@/libs/auth";
import "./Navbar.css";

async function Navbar() {
  const user = await getAuthUser();
  let profile = null;

  if (user) {
    try {
      profile = await ensureProfile(user);
    } catch {
      profile = null;
    }
  }

  return (
    <nav className="deepweb-navbar">
      <div className="navbar-logo">
        <Link href="/">
          <img src="/invicon.png" alt="Forux logo" width={100} />
        </Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link href="/">Foro</Link>
        </li>
        {!user ? (
          <>
            <li>
              <Link href="/">Invitado</Link>
            </li>
            <li>
              <Link href="/auth/login">Login</Link>
            </li>
            <li>
              <Link href="/auth/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/threads/new">Nuevo hilo</Link>
            </li>
            <li>
              <Link href="/dashboard">{profile?.username || "Dashboard"}</Link>
            </li>
            <li>
              <Link href="/auth/logout">Logout</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
