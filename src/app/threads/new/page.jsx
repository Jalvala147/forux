"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import styles from "../../Forum.module.css";

export default function NewThreadPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);

    const res = await fetch("/api/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
      }),
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(payload.message || "No se pudo crear el hilo");
      return;
    }

    router.push(`/threads/${payload.id}`);
    router.refresh();
  });

  return (
    <section className={styles.forum}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Nuevo hilo</h1>
          <p className={styles.subtitle}>Abre una discusión</p>
        </div>
        <Link href="/" className={styles.buttonSecondary}>
          Volver
        </Link>
      </header>

      <form onSubmit={onSubmit} className={styles.formWrap}>
        {error && <p className={styles.error}>{error}</p>}

        <label htmlFor="title" className={styles.label}>
          Título
        </label>
        <input
          id="title"
          className={styles.input}
          placeholder="Asunto del hilo"
          {...register("title", {
            required: "El título es obligatorio",
            maxLength: {
              value: 200,
              message: "Máximo 200 caracteres",
            },
          })}
        />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}

        <label htmlFor="content" className={styles.label}>
          Contenido
        </label>
        <textarea
          id="content"
          className={styles.textarea}
          placeholder="Escribe tu mensaje..."
          {...register("content", {
            required: "El contenido es obligatorio",
          })}
        />
        {errors.content && (
          <span className={styles.error}>{errors.content.message}</span>
        )}

        <button className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Publicando..." : "Publicar hilo"}
        </button>
      </form>
    </section>
  );
}
