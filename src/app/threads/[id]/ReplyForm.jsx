"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../../Forum.module.css";

export default function ReplyForm({ threadId }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);

    const res = await fetch(`/api/threads/${threadId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: data.content }),
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(payload.message || "No se pudo publicar la respuesta");
      return;
    }

    reset();
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className={styles.formWrap}>
      {error && <p className={styles.error}>{error}</p>}

      <label htmlFor="content" className={styles.label}>
        Tu respuesta
      </label>
      <textarea
        id="content"
        className={styles.textarea}
        placeholder="Escribe una respuesta..."
        {...register("content", {
          required: "La respuesta es obligatoria",
        })}
      />
      {errors.content && (
        <span className={styles.error}>{errors.content.message}</span>
      )}

      <button className={styles.button} disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Responder"}
      </button>
    </form>
  );
}
