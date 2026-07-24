/**
 * Cliente simples da API — usado por toda a aplicação para conversar
 * com o backend (Pessoa 1). Centralizar aqui evita repetir fetch()
 * espalhado pelos componentes.
 */
const API_URL = "http://localhost:8000";

function getToken() {
  return localStorage.getItem("granada_token");
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
    throw new Error(err.detail || "Erro na requisição");
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  register: (data) => request("/auth/register", { method: "POST", body: data, auth: false }),

  login: async (username, password) => {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    const res = await fetch(`${API_URL}/auth/login`, { method: "POST", body: form });
    if (!res.ok) throw new Error("Usuário ou senha incorretos");
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
