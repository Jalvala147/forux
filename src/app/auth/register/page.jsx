"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import styles from "./Register.module.css";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    setInfo(null);

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (data.username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username.trim(),
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (signUpData.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setInfo(
      "Cuenta creada. Si la confirmación por email está activa, revisa tu correo y luego inicia sesión."
    );
  });

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        {error && <p className={styles.errorBox}>{error}</p>}
        {info && <p className={styles.errorBox}>{info}</p>}

        <h1 className={styles.title}>Register</h1>

        <label htmlFor="username" className={styles.label}>
          Username:
        </label>
        <input
          type="text"
          {...register("username", {
            required: {
              value: true,
              message: "Username is required",
            },
            minLength: {
              value: 3,
              message: "Minimum 3 characters",
            },
          })}
          className={styles.input}
          placeholder="yourUser123"
        />
        {errors.username && (
          <span className={styles.errorText}>{errors.username.message}</span>
        )}

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
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          })}
          className={styles.input}
          placeholder="********"
        />
        {errors.password && (
          <span className={styles.errorText}>{errors.password.message}</span>
        )}

        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password:
        </label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: {
              value: true,
              message: "Confirm Password is required",
            },
          })}
          className={styles.input}
          placeholder="********"
        />
        {errors.confirmPassword && (
          <span className={styles.errorText}>
            {errors.confirmPassword.message}
          </span>
        )}

        <button className={styles.button} disabled={loading}>
          {loading ? "Creando..." : "Register"}
        </button>

        <Link href="/" className={styles.formLink}>
          Continuar como invitado (solo lectura)
        </Link>
        <Link href="/auth/login" className={styles.formLink}>
          ¿Ya tienes cuenta? Login
        </Link>
      </form>
    </div>
  );
}

export default RegisterPage;
