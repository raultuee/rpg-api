import React, { useEffect, useState } from "react";
import { api } from "./api";
import Login from "./components/Login";
import CharacterCard from "./components/CharacterCard";
import CharacterForm from "./components/CharacterForm";
import "./styles.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(api.isLoggedIn());
  const [characters, setCharacters] = useState([]);
  const [view, setView] = useState("list"); // "list" | "create" | "edit"
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedIn) loadCharacters();
  }, [loggedIn]);

  async function loadCharacters() {
    setLoading(true);
    try {
      const data = await api.listCharacters();
      setCharacters(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data) {
    await api.createCharacter(data);
    await loadCharacters();
    setView("list");
  }

  async function handleUpdate(data) {
    await api.updateCharacter(editing.id, data);
    setEditing(null);
    await loadCharacters();
    setView("list");
  }

  async function handleDelete(character) {
    if (!confirm(`Excluir "${character.name}"? Essa ação não pode ser desfeita.`)) return;
    await api.deleteCharacter(character.id);
    await loadCharacters();
  }

  function handleLogout() {
    api.logout();
    setLoggedIn(false);
    setCharacters([]);
  }

  if (!loggedIn) {
    return (
      <div className="app-shell">
        <div className="header">
          <div>
            <h1>Granada do Fallen</h1>
            <div className="subtitle">Sistema de fichas de RPG</div>
          </div>
        </div>
        <Login onLoggedIn={() => setLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="header">
        <div>
          <h1>Granada do Fallen</h1>
          <div className="subtitle">Seus personagens em campo</div>
        </div>
        <div className="header-actions">
          {view === "list" && (
            <button className="btn btn-primary" onClick={() => setView("create")}>
              + Novo personagem
            </button>
          )}
          <button className="btn btn-ghost" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>

      {view === "create" && (
        <CharacterForm onSubmit={handleCreate} onCancel={() => setView("list")} />
      )}

      {view === "edit" && editing && (
        <CharacterForm
          initial={editing}
          onSubmit={handleUpdate}
          onCancel={() => {
            setEditing(null);
            setView("list");
          }}
        />
      )}

      {view === "list" && (
        <>
          {loading && <p style={{ color: "var(--text-muted)" }}>Carregando fichas...</p>}

          {!loading && characters.length === 0 && (
            <div className="empty-state">
              Nenhum personagem cadastrado ainda.
              <br />
              Crie o primeiro combatente da sua campanha.
            </div>
          )}

          <div className="character-grid">
            {characters.map((c) => (
              <CharacterCard
                key={c.id}
                character={c}
                onEdit={(char) => {
                  setEditing(char);
                  setView("edit");
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
