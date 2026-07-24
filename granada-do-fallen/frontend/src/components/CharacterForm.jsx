import React, { useState } from "react";

const ATTRS = [
  ["strength", "Força"],
  ["dexterity", "Destreza"],
  ["constitution", "Constituição"],
  ["intelligence", "Inteligência"],
  ["wisdom", "Sabedoria"],
  ["charisma", "Carisma"],
];

const BLANK = {
  name: "",
  character_class: "Guerreiro",
  race: "Humano",
  level: 1,
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
  hp: 10,
  max_hp: 10,
  backstory: "",
  avatar_url: "",
};

export default function CharacterForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || BLANK);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("O personagem precisa de um nome.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>{initial ? "Editar personagem" : "Criar novo personagem"}</h2>
      {error && <div className="error-banner">{error}</div>}

      <div className="field full">
        <label>Nome do personagem</label>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Ex: Kael, o Renegado"
          autoFocus
        />
      </div>

      <div className="form-grid">
        <div className="field">
          <label>Raça</label>
          <input value={form.race} onChange={(e) => update("race", e.target.value)} />
        </div>
        <div className="field">
          <label>Classe</label>
          <input
            value={form.character_class}
            onChange={(e) => update("character_class", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Nível</label>
          <input
            type="number"
            min={1}
            value={form.level}
            onChange={(e) => update("level", Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>HP máximo</label>
          <input
            type="number"
            min={1}
            value={form.max_hp}
            onChange={(e) => update("max_hp", Number(e.target.value))}
          />
        </div>

        {ATTRS.map(([key, label]) => (
          <div className="field" key={key}>
            <label>{label}</label>
            <input
              type="number"
              min={1}
              max={30}
              value={form[key]}
              onChange={(e) => update(key, Number(e.target.value))}
            />
          </div>
        ))}

        <div className="field full">
          <label>URL do avatar (opcional)</label>
          <input
            value={form.avatar_url}
            onChange={(e) => update("avatar_url", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="field full">
          <label>História / observações</label>
          <textarea
            rows={4}
            value={form.backstory}
            onChange={(e) => update("backstory", e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Salvando..." : "Salvar personagem"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
