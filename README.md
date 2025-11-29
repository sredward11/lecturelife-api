# LectureLife API 📚

API RESTful robusta para gerenciamento de biblioteca pessoal e rastreamento de leituras, desenvolvida com Node.js, Express e MongoDB.

## 🚀 Tecnologias Utilizadas

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (via Mongoose)
*   **Autenticação**: JWT (JSON Web Tokens) e bcryptjs
*   **Testes**: Jest e Supertest
*   **Documentação**: Swagger (OpenAPI 3.0)
*   **Logs**: Morgan

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
*   Registro de novos usuários com validação de email único.
*   Login seguro com hash de senha (`bcryptjs`).
*   Autenticação via Token JWT (Bearer) para rotas protegidas.

### 📚 Gestão de Livros
*   CRUD completo (Criar, Listar, Detalhar, Atualizar, Remover).
*   Filtros de busca por `título` e `categoria`.
*   Validações de integridade (ano de publicação, número de páginas).

### 📖 Gestão de Leituras
*   Vínculo entre Usuário e Livro.
*   Controle de status: `planejando`, `lendo`, `concluido`, `abandonado`.
*   **Regras de Negócio**:
    *   Impede duplicidade de leituras ativas para o mesmo livro.
    *   Valida coerência de datas (início vs fim).
    *   Valida progresso de páginas (não pode exceder total do livro).
    *   Notas permitidas apenas para leituras concluídas.
*   **Estatísticas**: Endpoint `/readings/stats` com resumo de desempenho do leitor.

## 🛠️ Instalação e Configuração

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/lecturelife-api.git
   cd lecturelife-api
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
   ```env
   PORT=3000
   JWT_USERNAME=
   JWT_PASSWORD=
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.5jpdpjr.mongodb.net/lecturelife?appName=Cluster0


## ▶️ Como Executar

### Modo de Desenvolvimento (com Nodemon)
```bash
npm run dev
```

### Modo de Produção
```bash
npm start
```

A API estará disponível em `http://localhost:3000`.

## 🧪 Testes Automatizados

O projeto conta com uma suíte de testes unitários e de integração cobrindo 100% das funcionalidades críticas.

```bash
npm test
```

## 📖 Documentação da API

A documentação interativa (Swagger UI) está disponível em:

👉 **http://localhost:3000/api-docs**

Lá você pode explorar todos os endpoints, ver exemplos de requisição/resposta e testar a API diretamente pelo navegador.

---
**LectureLife** - *Sua vida, suas leituras.*
