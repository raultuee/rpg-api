# 🪖 Granada do Fallen

Sistema de fichas de RPG com página web de personagens em formato de
"placa de identificação": passe o mouse sobre o cartão e ele vira,
revelando os atributos de combate. Permite criar personagens com
nome, classe, raça e atributos personalizados.

Compatível com **Python 3.14** (backend) e **React 18** (frontend).

---

## 📁 Estrutura do projeto

```
granada-do-fallen/
├── backend/          # API (FastAPI + SQLAlchemy + JWT) — Pessoa 1
│   ├── app/
│   │   ├── main.py        # rotas da API
│   │   ├── models.py      # tabelas do banco
│   │   ├── schemas.py     # validação (Pydantic)
│   │   ├── auth.py        # login/JWT
│   │   ├── crud.py        # funções de banco
│   │   └── database.py    # conexão SQLite
│   └── requirements.txt
└── frontend/          # Interface (React + Vite) — Pessoa 2
    ├── src/
    │   ├── App.jsx
    │   ├── api.js          # conexão com a API
    │   └── components/
    │       ├── Login.jsx
    │       ├── CharacterCard.jsx   # o cartão com hover
    │       └── CharacterForm.jsx
    └── package.json
```

---

## 🚀 Como rodar

### Backend (Python 3.14)

```bash
cd backend
python3.14 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

- API: http://localhost:8000
- Documentação Swagger automática: **http://localhost:8000/docs**

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

- Interface: http://localhost:5173

> O frontend já está configurado para chamar a API em
> `http://localhost:8000` (arquivo `src/api.js`). Se o backend rodar
> em outro endereço, é só ajustar a constante `API_URL` lá.

---

## ✅ O que já está pronto (ponto de partida para o grupo)

- Cadastro/login de usuário com senha criptografada (bcrypt) e JWT
- CRUD completo de personagens (criar, listar, editar, excluir)
- CRUD de campanhas (para agrupar personagens depois)
- Documentação automática da API (Swagger em `/docs`)
- Tela de login/cadastro
- Dashboard com os cartões de personagem (hover revela a ficha)
- Formulário de criação/edição com nome customizado e atributos

## 🔜 O que falta (dividido entre o time)

### 👤 Pessoa 1 — Backend e Banco de Dados
- Revisar/ajustar as regras de negócio (ex: limites de atributos por nível)
- Trocar SQLite por Postgres se o projeto crescer
- Testes de integração dos endpoints

### 👤 Pessoa 2 — Frontend (React)
- Página de lista/gerenciamento de campanhas (o backend já expõe os endpoints)
- Ajustes de responsividade em telas menores
- Estados de loading/erro mais refinados

### 👤 Pessoa 3 — Funcionalidades avançadas e integração
- Sistema de rolagem de dados (ex: endpoint `/roll?dice=1d20+5`)
- Exportação de fichas em PDF
- Upload real de avatar (hoje é só uma URL)
- Histórico de alterações do personagem
- Testes automatizados (pytest no backend, Vitest no frontend)
- Deploy (Docker, Render, Railway ou VPS)

---

## 🗄️ Modelo de dados (resumo)

- **User**: username, email, senha (hash)
- **Campaign**: nome, descrição, dono (mestre)
- **Character**: nome, raça, classe, nível, HP, atributos (FOR/DES/CON/INT/SAB/CAR),
  história, avatar, dono, campanha (opcional)

## 🔐 Autenticação

1. `POST /auth/register` — cria usuário
2. `POST /auth/login` — retorna um token JWT
3. Toda rota protegida espera o header:
   `Authorization: Bearer <token>`

O token já é salvo e enviado automaticamente pelo frontend
(`localStorage`, em `src/api.js`).
