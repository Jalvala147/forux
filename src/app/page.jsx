import Link from "next/link";
import { getAuthUser } from "@/libs/auth";
import { listThreads } from "@/libs/forum";
import styles from "./Forum.module.css";

function formatDate(date) {
  return new Date(date).toLocaleString();
}

export default async function HomePage() {
  const user = await getAuthUser();
  let threads = [];
  let loadError = null;

  try {
    threads = await listThreads();
  } catch (error) {
    loadError = error.message;
  }

  return (
    <section className={styles.forum}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Forux</h1>
          <p className={styles.subtitle}>
            {user ? "Hilos abiertos" : "Modo invitado — solo lectura"}
          </p>
        </div>
        {user ? (
          <Link href="/threads/new" className={styles.button}>
            Nuevo hilo
          </Link>
        ) : (
          <div className={styles.headerActions}>
            <Link href="/auth/login" className={styles.button}>
              Login
            </Link>
            <Link href="/auth/register" className={styles.buttonSecondary}>
              Register
            </Link>
          </div>
        )}
      </header>

      {!user && (
        <p className={styles.guestBanner}>
          Estás como invitado: puedes leer hilos y respuestas. Para publicar,
          inicia sesión o regístrate.
        </p>
      )}

      {loadError ? (
        <p className={styles.empty}>
          No se pudo cargar el foro. ¿Ejecutaste supabase/schema.sql? ({loadError})
        </p>
      ) : threads.length === 0 ? (
        <p className={styles.empty}>
          Aún no hay hilos.
          {user ? " Sé el primero en abrir uno." : ""}
        </p>
      ) : (
        <div className={styles.list}>
          {threads.map((thread) => (
            <Link
              key={thread.id}
              href={`/threads/${thread.id}`}
              className={styles.threadLink}
            >
              <h2 className={styles.threadTitle}>{thread.title}</h2>
              <div className={styles.meta}>
                <span>por {thread.author?.username || "anon"}</span>
                <span>{formatDate(thread.createdAt)}</span>
                <span>{thread._count.replies} respuestas</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
