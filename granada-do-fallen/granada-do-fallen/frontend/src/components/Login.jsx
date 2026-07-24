import React, { useState } from "react";
import { api } from "../api";

export default function Login({ onLoggedIn }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await api.register(form);
      }
      await api.login(form.username, form.password);
      onLoggedIn();
    } catch (err) {
      setError(err?.message || "Erro inesperado ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel" style={{ marginTop: 60 }}>
      <h2>{mode === "login" ? "Entrar" : "Criar conta"}</h2>
      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field full">
          <label>Usuário</label>
          <input value={form.username} onChange={(e) => update("username", e.target.value)} />
        </div>

        {mode === "register" && (
          <div className="field full">
            <label>E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
        )}

        <div className="field full">
          <label>Senha</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: "0.85rem", color: "var(--text-muted)" }}>
        {mode === "login" ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
        <button
          type="button"
          className="btn btn-ghost"
          style={{ padding: "4px 8px" }}
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Cadastre-se" : "Fazer login"}
        </button>
      </p>
    </div>
  );
}
