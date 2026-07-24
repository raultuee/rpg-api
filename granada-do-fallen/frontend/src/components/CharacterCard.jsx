import React from "react";

/**
 * Cartão de personagem no estilo "placa de identificação".
 * Passar o mouse por cima gira o cartão e revela os atributos —
 * é o comportamento pedido pelo grupo: "passar o mouse e ver as especificações".
 */
export default function CharacterCard({ character, onEdit, onDelete }) {
  const initial = character.name?.charAt(0)?.toUpperCase() || "?";
  const hpPercent = Math.max(
    0,
    Math.min(100, (character.hp / (character.max_hp || 1)) * 100)
  );

  return (
    <div className="dogtag">
      <div className="dogtag-inner">
        {/* Frente: identificação básica */}
        <div className="dogtag-face dogtag-front">
          <div className="dogtag-avatar">
            {character.avatar_url ? (
              <img
                src={character.avatar_url}
                alt={character.name}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              initial
            )}
          </div>
          <p className="dogtag-name">{character.name}</p>
          <p className="dogtag-class">
            {character.race} · {character.character_class} · Nv. {character.level}
          </p>
          <span className="dogtag-hint">passe o mouse para ver a ficha</span>
        </div>

        {/* Verso: atributos e ações */}
        <div className="dogtag-face dogtag-back">
          <h4>Ficha de Combate</h4>

          <div className="stat-row">
            <span>HP</span>
            <span>
              {character.hp}/{character.max_hp}
            </span>
          </div>
          <div className="hp-bar">
            <div className="hp-bar-fill" style={{ width: `${hpPercent}%` }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", marginTop: 8 }}>
            <div className="stat-row"><span>FOR</span><span>{character.strength}</span></div>
            <div className="stat-row"><span>DES</span><span>{character.dexterity}</span></div>
            <div className="stat-row"><span>CON</span><span>{character.constitution}</span></div>
            <div className="stat-row"><span>INT</span><span>{character.intelligence}</span></div>
            <div className="stat-row"><span>SAB</span><span>{character.wisdom}</span></div>
            <div className="stat-row"><span>CAR</span><span>{character.charisma}</span></div>
          </div>

          <div className="dogtag-actions">
            <button className="btn" onClick={() => onEdit(character)}>Editar</button>
            <button className="btn" onClick={() => onDelete(character)}>Excluir</button>
          </div>
        </div>
      </div>
    </div>
  );
}
