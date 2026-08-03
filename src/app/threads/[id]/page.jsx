import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthUser } from "@/libs/auth";
import { getThreadById } from "@/libs/forum";
import styles from "../../Forum.module.css";
import ReplyForm from "./ReplyForm";

function formatDate(date) {
  return new Date(date).toLocaleString();
}

export default async function ThreadPage({ params }) {
  const { id } = await params;
  const threadId = Number(id);

  if (!Number.isInteger(threadId) || threadId < 1) {
    notFound();
  }

  const user = await getAuthUser();
  const thread = await getThreadById(threadId);

  if (!thread) {
    notFound();
  }

  return (
    <section className={styles.forum}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{thread.title}</h1>
          <p className={styles.subtitle}>
            por {thread.author?.username || "anon"} · {formatDate(thread.createdAt)}
          </p>
        </div>
        <Link href="/" className={styles.buttonSecondary}>
          Volver al foro
        </Link>
      </header>

      {!user && (
        <p className={styles.guestBanner}>
          Modo invitado: puedes leer.{" "}
          <Link href="/auth/login">Inicia sesión</Link> para responder.
        </p>
      )}

      <article className={styles.threadBody}>
        <div className={styles.meta}>
          <span>{thread.author?.username || "anon"}</span>
          <span>{formatDate(thread.createdAt)}</span>
        </div>
        <p className={styles.content}>{thread.content}</p>
      </article>

      <h2 className={styles.sectionTitle}>
        Respuestas ({thread.replies.length})
      </h2>

      <div className={styles.replies}>
        {thread.replies.length === 0 ? (
          <p className={styles.empty}>Todavía no hay respuestas.</p>
        ) : (
          thread.replies.map((reply) => (
            <article key={reply.id} className={styles.reply}>
              <div className={styles.replyMeta}>
                {reply.author?.username || "anon"} · {formatDate(reply.createdAt)}
              </div>
              <p className={styles.content}>{reply.content}</p>
            </article>
          ))
        )}
      </div>

      {user ? (
        <ReplyForm threadId={thread.id} />
      ) : (
        <p className={styles.loginHint}>
          <Link href="/auth/login">Inicia sesión</Link> o{" "}
          <Link href="/auth/register">regístrate</Link> para responder. Como
          invitado solo puedes leer.
        </p>
      )}
    </section>
  );
}
