"use client";

import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import styles from "./Login.module.css";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const next = searchParams.get("next") || "/";
    router.push(next);
    router.refresh();
  });

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        {error && <p className={styles.errorBox}>{error}</p>}

        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Accede para publicar y responder</p>

        <label htmlFor="email" className={styles.label}>
          Email:
        </label>
        <input
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "Email is required",
            },
          })}
          className={styles.input}
          placeholder="user@email.com"
        />
        {errors.email && (
          <span className={styles.errorText}>{errors.email.message}</span>
        )}

        <label htmlFor="password" className={styles.label}>
          Password:
        </label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
          })}
          className={styles.input}
          placeholder="******"
        />
        {errors.password && (
          <span className={styles.errorText}>{errors.password.message}</span>
        )}

        <button className={styles.button} disabled={loading}>
          {loading ? "Entrando..." : "Login"}
        </button>

        <Link href="/" className={styles.formLink}>
          Continuar como invitado (solo lectura)
        </Link>
        <Link href="/auth/register" className={styles.formLink}>
          ¿No tienes cuenta? Regístrate
        </Link>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <p className={styles.subtitle}>Cargando...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
