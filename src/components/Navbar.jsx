// (Opcional) Importa el archivo CSS aquí si usas CSS Modules o quieres importarlo directamente
// import './Navbar.css'; // o './Navbar.module.css' si usas CSS Modules

import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import './Navbar.css';

import Image from "next/image";

async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="deepweb-navbar">
      <div className="navbar-logo">
        <Link href="/">
          <img src="/invicon.png" alt="Forux logo" width={100} />
        </Link>
      </div>

      <ul className="nav-links">
        {!session?.user ? (
          <>
            <li>
              <Link href="/">Home</Link>
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
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/api/auth/signout">Logout</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;