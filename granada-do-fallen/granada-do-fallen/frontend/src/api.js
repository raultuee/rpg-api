/**
 * Cliente simples da API — usado por toda a aplicação para conversar
 * com o backend (Pessoa 1). Centralizar aqui evita repetir fetch()
 * espalhado pelos componentes.
 */
const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

function getToken() {
  return localStorage.getItem("granada_token");
}

function normalizeError(err) {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message || "Erro na requisição";
  if (err?.detail) {
    if (typeof err.detail === "string") return err.detail;
    if (typeof err.detail === "object") {
      if (typeof err.detail.message === "string") return err.detail.message;
      if (typeof err.detail.msg === "string") return err.detail.msg;
      if (typeof err.detail.error === "string") return err.detail.error;
    }
  }
  if (err?.message && typeof err.message === "string") return err.message;
  return "Erro na requisição";
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(normalizeError(err));
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  register: (data) => request("/auth/register", { method: "POST", body: data, auth: false }),

  login: async (username, password) => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(normalizeError(err) || "Usuário ou senha incorretos");
    }

    const data = await res.json();
    localStorage.setItem("granada_token", data.access_token);
    return data;
  },

  logout: () => localStorage.removeItem("granada_token"),
  isLoggedIn: () => !!getToken(),

  listCharacters: () => request("/characters"),
  getCharacter: (id) => request(`/characters/${id}`),
  createCharacter: (data) => request("/characters", { method: "POST", body: data }),
  updateCharacter: (id, data) => request(`/characters/${id}`, { method: "PATCH", body: data }),
  deleteCharacter: (id) => request(`/characters/${id}`, { method: "DELETE" }),
};
