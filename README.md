# MFE Client System

Sistema de clientes baseado em arquitetura de microfrontends usando React, TypeScript e Vite com Module Federation.

## 📋 Visão Geral

Este projeto implementa um sistema de gerenciamento de clientes usando a arquitetura de microfrontends, onde cada funcionalidade é desenvolvida como um módulo independente que pode ser executado de forma isolada ou integrada.

### Arquitetura

O sistema é composto por 4 microfrontends principais:

- **🏠 Shell** (Port 5173) - Aplicação host que orquestra todos os microfrontends
- **🔐 Auth MFE** (Port 5174) - Sistema de autenticação
- **👥 Clients MFE** (Port 5175) - Gerenciamento de clientes
- **🎨 Design System** (Port 5176) - Biblioteca de componentes compartilhados

## 🚀 Pré-requisitos

- **Node.js** >= 16.x
- **npm** >= 8.x

Verifique suas versões:

```bash
node --version
npm --version
```

## 🧪 Testes

Este projeto inclui uma suíte completa de testes end-to-end e unitários.

### Executar Todos os Testes

```bash
npm test
```

### Testes End-to-End (E2E)

```bash
npm run test:e2e           # Modo headless
npm run test:e2e:headed    # Com interface do browser
npm run test:e2e:ui        # Com interface do Playwright
```

### Testes Unitários

```bash
npm run test:unit          # Todos os testes unitários
npm run test --workspace=packages/clients-mfe    # Testes específicos do clients-mfe
npm run test:ui --workspace=packages/clients-mfe # Com interface do Vitest
```

### Instalar Dependências de Teste

```bash
npm run test:install       # Instala browsers do Playwright
```

### Stack de Testes

- **E2E**: Playwright para testes de fluxo completo
- **Unit**: Vitest + React Testing Library
- **Coverage**: Relatórios de cobertura integrados

Para mais detalhes, consulte [TESTING.md](./TESTING.md).

## 📦 Instalação

1. **Clone o repositório:**

```bash
git clone <repository-url>
cd mfe-client-system
```

2. **Instale as dependências:**

```bash
npm install
```

Isso instalará todas as dependências do workspace e de todos os microfrontends.

## 🚀 Deploy na Vercel

### Deploy Rápido

```bash
# Configuração inicial (primeira vez)
./deploy-vercel.sh setup

# Deploy de produção
./deploy-vercel.sh deploy-prod

# Deploy de desenvolvimento
./deploy-vercel.sh deploy-dev
```

**URLs de produção:**

- Shell (Principal): https://mfe-client-system-shell.vercel.app
- Auth MFE: https://mfe-auth.vercel.app
- Clients MFE: https://mfe-clients.vercel.app
- Design System: https://mfe-design-system.vercel.app

Para instruções completas de deploy, consulte [VERCEL.md](./VERCEL.md).

---

## 🐳 Execução com Docker

### Início Rápido com Docker

```bash
# Desenvolvimento
./docker-run.sh dev

# Produção
./docker-run.sh prod

# Testes
./docker-run.sh test
```

**URLs disponíveis (desenvolvimento):**

- Shell: http://localhost:5173
- Auth MFE: http://localhost:5174
- Clients MFE: http://localhost:5175
- Design System: http://localhost:5176

Para instruções completas do Docker, consulte [DOCKER.md](./DOCKER.md).

---

## 🏃‍♂️ Como Executar (Desenvolvimento Local)

### Desenvolvimento Completo (Recomendado)

Para iniciar toda a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

Este comando irá:

- Iniciar o Design System na porta 5176
- Iniciar o Auth MFE na porta 5174
- Iniciar o Clients MFE na porta 5175
- Iniciar o Shell na porta 5173

**Acesse a aplicação em:** http://localhost:5173

### Executando Microfrontends Individualmente

Você também pode executar cada microfrontend separadamente:

#### Shell (Aplicação Principal)

```bash
npm run dev:shell
```

Porta: http://localhost:5173

#### Auth MFE (Autenticação)

```bash
npm run dev:auth
```

Porta: http://localhost:5174

#### Clients MFE (Clientes)

```bash
npm run dev:clients
```

Porta: http://localhost:5175

#### Design System (Componentes)

```bash
npm run dev:design
```

Porta: http://localhost:5176

### Executando em Modo de Produção

Para executar a aplicação em modo de produção:

```bash
npm run start:mfe
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento

- `npm run dev` - Inicia todos os microfrontends
- `npm run dev:mfe` - Inicia apenas os MFEs (sem design system)
- `npm run dev:fed` - Inicia com delay no shell para garantir que os MFEs carreguem primeiro

### Build

- `npm run build` - Builda todos os workspaces
- `npm run preview:auth` - Build e preview do Auth MFE
- `npm run preview:clients` - Build e preview do Clients MFE
- `npm run preview:design` - Build e preview do Design System

### Utilitários

- `npm run stop:all` - Para todos os serviços nas portas 5173-5176
- `npm run lint` - Executa linting em todos os workspaces
- `npm run lint:fix` - Corrige problemas de linting automaticamente

### Vercel (Deploy)

- `./deploy-vercel.sh setup` - Configuração inicial dos projetos na Vercel
- `./deploy-vercel.sh deploy-prod` - Deploy de produção de todos os MFEs
- `./deploy-vercel.sh deploy-dev` - Deploy de desenvolvimento
- `./deploy-vercel.sh status` - Verificar status dos deployments
- `./deploy-vercel.sh domains` - Listar domínios configurados

### Docker

- `./docker-run.sh dev` - Inicia todos os MFEs em containers (desenvolvimento)
- `./docker-run.sh prod` - Inicia todos os MFEs em containers (produção)
- `./docker-run.sh test` - Executa testes em containers
- `./docker-run.sh build` - Builda todas as imagens Docker
- `./docker-run.sh stop` - Para todos os containers
- `./docker-run.sh clean` - Limpeza completa de containers e imagens
- `./docker-run.sh logs` - Mostra logs dos containers
- `./docker-run.sh health` - Verifica saúde dos containers

### Testes

- `npm test` - Executa todos os testes (unit + E2E)

- `npm run test:unit` - Apenas testes unitários
- `npm run test:e2e` - Apenas testes E2E
- `npm run test:e2e:ui` - Interface do Playwright
- `npm run test:install` - Instala browsers do Playwright

## 🔧 Estrutura do Projeto

```
mfe-client-system/
├── packages/
│   ├── shell/                 # Aplicação host (Port 5173)
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── auth-mfe/             # Microfrontend de autenticação (Port 5174)
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── clients-mfe/          # Microfrontend de clientes (Port 5175)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── design-system/        # Sistema de design (Port 5176)
│   │   ├── src/
│   │   │   └── components/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── shared/               # Recursos compartilhados
│       ├── services/
│       └── src/types/
├── package.json              # Workspace principal
└── README.md
```

## 🌐 Portas e URLs

| Microfrontend | Porta | URL                   |
| ------------- | ----- | --------------------- |
| Shell (Host)  | 5173  | http://localhost:5173 |
| Auth MFE      | 5174  | http://localhost:5174 |
| Clients MFE   | 5175  | http://localhost:5175 |
| Design System | 5176  | http://localhost:5176 |

## 🔍 Funcionalidades

### Clients MFE

- ✅ Listagem de clientes
- ✅ Cadastro de novos clientes
- ✅ Edição de clientes existentes
- ✅ Exclusão de clientes
- ✅ Visualização de detalhes
- ✅ Interface responsiva com Material-UI

### Design System

- ✅ Componentes reutilizáveis (Button, Input, Card, Layout)
- ✅ Sistema de temas consistente
- ✅ Compartilhamento entre microfrontends

### Auth MFE

- ✅ Sistema de autenticação
- ✅ Integração com shell principal

## 🚨 Troubleshooting

### Erro de CORS

Se encontrar erros de CORS, certifique-se de que todos os microfrontends estão rodando nas portas corretas.

### Portas em uso

Se alguma porta estiver ocupada, você pode:

1. Parar os processos: `npm run stop:all`
2. Ou modificar as portas nos arquivos `vite.config.ts` de cada microfrontend

### Problemas de dependências

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules
rm -rf packages/*/node_modules
npm install
```

### Hot Reload não funciona

Certifique-se de que todos os microfrontends estão rodando simultaneamente para que o Module Federation funcione corretamente.

## 📝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Suporte

Se encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências estão instaladas
2. Confirme se todas as portas necessárias estão disponíveis
3. Execute `npm run stop:all` e tente novamente
4. Abra uma issue no repositório

---

**Desenvolvido por:** Arthur Marques de Lima
