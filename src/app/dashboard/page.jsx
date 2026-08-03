import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUser, ensureProfile } from "@/libs/auth";
import styles from "../Forum.module.css";

export default async function DashboardPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard");
  }

  const profile = await ensureProfile(user);

  return (
    <section className={styles.forum}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Conectado como {profile?.username || user.email}
          </p>
        </div>
        <Link href="/" className={styles.button}>
          Ir al foro
        </Link>
      </header>

      <div className={styles.formWrap}>
        <p className={styles.meta}>Email: {user.email}</p>
        <p className={styles.meta} style={{ marginTop: "0.75rem" }}>
          Username: {profile?.username}
        </p>
        <Link
          href="/auth/logout"
          className={styles.button}
          style={{ marginTop: "1.5rem", display: "inline-block" }}
        >
          Logout
        </Link>
      </div>
    </section>
  );
}
