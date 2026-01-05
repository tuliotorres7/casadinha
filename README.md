🐯 Casadinha - Site de Apostas Amigável

Bem-vindo ao **Casadinha**! Um site divertido de apostas que não valem dinheiro real, perfeito para se divertir com amigos sem riscos.

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js robusto
- **Sequelize** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **Passport & JWT** - Autenticação com Google OAuth 2.0

### Frontend
- **Angular 17** - Framework moderno para SPAs
- **TypeScript** - Tipagem estática
- **CSS3** - Estilização responsiva

### Infraestrutura
- **Docker & Docker Compose** - Containerização do PostgreSQL
- **pgAdmin** - Interface para gerenciar o banco de dados

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`

## 🔧 Configuração do Projeto

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd casadinha
```

### 2. Configurar Google OAuth

Para usar o login com Google, você precisa criar credenciais OAuth 2.0:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+ 
4. Vá em **Credenciais** > **Criar Credenciais** > **ID do cliente OAuth**
5. Configure a tela de consentimento OAuth
6. Adicione as URIs de redirecionamento:
   - `http://localhost:3000/auth/google/callback`
7. Copie o **Client ID** e **Client Secret**

### 3. Configurar Variáveis de Ambiente

#### Backend

Edite o arquivo `backend/.env`:

```bash
cd backend
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

**Importante**: Substitua os valores no arquivo `.env`:
- `GOOGLE_CLIENT_ID`: Seu Google Client ID
- `GOOGLE_CLIENT_SECRET`: Seu Google Client Secret
- `JWT_SECRET`: Uma string secreta forte (use um gerador de senhas)

### 4. Iniciar o Banco de Dados

```bash
# Na raiz do projeto
docker-compose up -d
```

Isso iniciará:
- PostgreSQL na porta `5432`
- pgAdmin na porta `5050` (acesse http://localhost:5050)
  - Email: `admin@casadinha.com`
  - Senha: `admin123`

### 5. Instalar Dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 6. Iniciar os Servidores

#### Backend (Terminal 1)
```bash
cd backend
npm run start:dev
```
O backend estará disponível em http://localhost:3000

#### Frontend (Terminal 2)
```bash
cd frontend
npm start
```
O frontend estará disponível em http://localhost:4200

## 🎮 Como Usar

1. Acesse http://localhost:4200
2. Clique em "Entrar com Google"
3. Faça login com sua conta Google
4. Aproveite suas moedas virtuais iniciais (1000 moedas) 🪙
5. Divirta-se! (recursos de apostas em desenvolvimento)

## 📁 Estrutura do Projeto

```
casadinha/
├── backend/                 # Backend NestJS
│   ├── src/
│   │   ├── auth/           # Módulo de autenticação
│   │   ├── users/          # Módulo de usuários
│   │   ├── config/         # Configurações
│   │   ├── app.module.ts   # Módulo principal
│   │   └── main.ts         # Entry point
│   ├── .env                # Variáveis de ambiente
│   └── package.json
│
├── frontend/               # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Componentes da UI
│   │   │   ├── services/   # Serviços (auth, etc)
│   │   │   ├── guards/     # Guards de rota
│   │   │   └── app.module.ts
│   │   ├── environments/   # Configurações de ambiente
│   │   └── styles.css      # Estilos globais
│   └── package.json
│
├── docker-compose.yml      # Configuração do Docker
└── README.md              # Este arquivo
```

## 🔐 Segurança

- **Nunca** commite o arquivo `.env` com credenciais reais
- Em produção, use variáveis de ambiente do servidor
- O JWT_SECRET deve ser alterado e mantido em segredo
- As senhas são hasheadas com bcrypt
- CORS configurado para aceitar apenas o frontend

## 🐳 Comandos Docker Úteis

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar banco de dados
docker-compose restart postgres

# Remover volumes (cuidado: apaga os dados)
docker-compose down -v
```

## 📊 Acessar pgAdmin

1. Acesse http://localhost:5050
2. Login:
   - Email: `admin@casadinha.com`
   - Senha: `admin123`
3. Adicionar servidor:
   - Host: `postgres` (nome do container)
   - Port: `5432`
   - Database: `casadinha_db`
   - Username: `casadinha`
   - Password: `casadinha123`

## 🛠️ Scripts Disponíveis

### Backend
```bash
npm run start:dev    # Desenvolvimento com hot-reload
npm run build        # Build de produção
npm run start:prod   # Iniciar em produção
npm run test         # Executar testes
```

### Frontend
```bash
npm start            # Desenvolvimento (ng serve)
npm run build        # Build de produção
npm test             # Executar testes
```

## 🚧 Próximas Funcionalidades

- [ ] Sistema de apostas em eventos
- [ ] Ranking de usuários
- [ ] Chat entre jogadores
- [ ] Notificações em tempo real
- [ ] Histórico de apostas
- [ ] Sistema de conquistas

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

Desenvolvido com ❤️ para diversão sem riscos!

## 📞 Suporte

Se encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências foram instaladas
2. Confirme que o Docker está rodando
3. Verifique se as portas 3000, 4200, 5432 e 5050 estão disponíveis
4. Certifique-se de que as credenciais do Google OAuth estão corretas

---

**Divirta-se apostando sem preocupações! 🎲🎉**
# casadinha
