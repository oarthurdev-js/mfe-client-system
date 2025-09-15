# Multi-stage Dockerfile para o Sistema MFE Client
FROM node:18-alpine as base

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração de dependências
COPY package*.json ./
COPY yarn.lock ./

# Copiar package.json de todos os workspaces
COPY packages/shell/package.json ./packages/shell/
COPY packages/auth-mfe/package.json ./packages/auth-mfe/
COPY packages/clients-mfe/package.json ./packages/clients-mfe/
COPY packages/design-system/package.json ./packages/design-system/
COPY packages/shared/package.json ./packages/shared/ 2>/dev/null || true

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# ========================
# Stage de Build
# ========================
FROM base as builder

# Build todos os packages
RUN npm run build

# ========================
# Stage de Produção - Shell
# ========================
FROM nginx:alpine as shell-prod

# Copiar configuração do nginx
COPY docker/nginx/shell.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados do shell
COPY --from=builder /app/packages/shell/dist /usr/share/nginx/html

EXPOSE 5173

# ========================
# Stage de Produção - Auth MFE
# ========================
FROM nginx:alpine as auth-mfe-prod

# Copiar configuração do nginx
COPY docker/nginx/auth-mfe.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados do auth-mfe
COPY --from=builder /app/packages/auth-mfe/dist /usr/share/nginx/html

EXPOSE 5174

# ========================
# Stage de Produção - Clients MFE
# ========================
FROM nginx:alpine as clients-mfe-prod

# Copiar configuração do nginx
COPY docker/nginx/clients-mfe.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados do clients-mfe
COPY --from=builder /app/packages/clients-mfe/dist /usr/share/nginx/html

EXPOSE 5175

# ========================
# Stage de Produção - Design System
# ========================
FROM nginx:alpine as design-system-prod

# Copiar configuração do nginx
COPY docker/nginx/design-system.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados do design-system
COPY --from=builder /app/packages/design-system/dist /usr/share/nginx/html

EXPOSE 5176

# ========================
# Stage de Desenvolvimento
# ========================
FROM base as development

# Instalar dependências globais para desenvolvimento
RUN npm install -g concurrently

# Expor portas para todos os microfrontends
EXPOSE 5173 5174 5175 5176

# Comando padrão para desenvolvimento
CMD ["npm", "run", "dev"]