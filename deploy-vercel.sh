#!/bin/bash

# Script para deploy do Sistema MFE Client na Vercel

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir ajuda
show_help() {
    echo "🚀 Script de Deploy para Vercel - Sistema MFE Client"
    echo ""
    echo "Uso: $0 [COMANDO] [OPÇÕES]"
    echo ""
    echo "Comandos:"
    echo "  setup       Configura projetos na Vercel (primeira vez)"
    echo "  deploy      Deploy todos os MFEs"
    echo "  deploy-dev  Deploy em ambiente de desenvolvimento"
    echo "  deploy-prod Deploy em ambiente de produção"
    echo "  status      Verifica status dos deployments"
    echo "  domains     Lista domínios configurados"
    echo ""
    echo "Opções:"
    echo "  -h, --help  Mostra esta ajuda"
    echo "  --force     Força redeploy mesmo sem mudanças"
    echo ""
    echo "Exemplos:"
    echo "  $0 setup             # Configuração inicial"
    echo "  $0 deploy           # Deploy todos os MFEs"
    echo "  $0 deploy-prod      # Deploy produção"
}

# Função para verificar se Vercel CLI está instalado
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        echo -e "${RED}❌ Vercel CLI não está instalado!${NC}"
        echo "Para instalar: npm install -g vercel"
        echo "Ou usando yarn: yarn global add vercel"
        exit 1
    fi
}

# Função para fazer login na Vercel
vercel_login() {
    echo -e "${BLUE}🔑 Verificando autenticação na Vercel...${NC}"
    if ! vercel whoami > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Fazendo login na Vercel...${NC}"
        vercel login
    else
        echo -e "${GREEN}✅ Já autenticado na Vercel!${NC}"
    fi
}

# Função para configurar projetos na Vercel (primeira vez)
setup_vercel_projects() {
    echo -e "${BLUE}🛠️  Configurando projetos na Vercel...${NC}"
    
    # Array de projetos
    projects=(
        "shell:vercel.json:mfe-client-system-shell"
        "auth-mfe:vercel-auth.json:mfe-auth"
        "clients-mfe:vercel-clients.json:mfe-clients"
        "design-system:vercel-design-system.json:mfe-design-system"
    )
    
    for project in "${projects[@]}"; do
        IFS=':' read -r folder config_file project_name <<< "$project"
        
        echo -e "${YELLOW}📦 Configurando $project_name...${NC}"
        
        # Criar projeto na Vercel usando configuração específica
        cd "$(dirname "$0")"
        
        if [ "$folder" = "shell" ]; then
            # Para o shell, usar a raiz do projeto
            vercel --name "$project_name" --config "$config_file" --yes || true
        else
            # Para outros MFEs, usar configuração específica
            vercel --name "$project_name" --config "$config_file" --yes || true
        fi
        
        echo -e "${GREEN}✅ $project_name configurado!${NC}"
    done
    
    echo -e "${GREEN}🎉 Todos os projetos configurados na Vercel!${NC}"
    echo ""
    echo "📝 Próximos passos:"
    echo "1. Atualize as URLs de produção no vite.config.ts do shell"
    echo "2. Execute: $0 deploy-prod"
}

# Função para fazer deploy de desenvolvimento
deploy_dev() {
    echo -e "${BLUE}🚀 Fazendo deploy de desenvolvimento...${NC}"
    
    projects=(
        "shell:vercel.json:mfe-client-system-shell"
        "auth-mfe:vercel-auth.json:mfe-auth"
        "clients-mfe:vercel-clients.json:mfe-clients"
        "design-system:vercel-design-system.json:mfe-design-system"
    )
    
    for project in "${projects[@]}"; do
        IFS=':' read -r folder config_file project_name <<< "$project"
        
        echo -e "${YELLOW}📦 Deploy $project_name (dev)...${NC}"
        vercel --name "$project_name" --config "$config_file" || true
    done
    
    echo -e "${GREEN}✅ Deploy de desenvolvimento concluído!${NC}"
}

# Função para fazer deploy de produção
deploy_prod() {
    echo -e "${BLUE}🚀 Fazendo deploy de produção...${NC}"
    
    # Build todos os pacotes primeiro
    echo -e "${YELLOW}🔨 Buildando todos os pacotes...${NC}"
    npm run build || {
        echo -e "${RED}❌ Erro no build!${NC}"
        exit 1
    }
    
    projects=(
        "design-system:vercel-design-system.json:mfe-design-system"
        "auth-mfe:vercel-auth.json:mfe-auth"
        "clients-mfe:vercel-clients.json:mfe-clients"
        "shell:vercel.json:mfe-client-system-shell"
    )
    
    for project in "${projects[@]}"; do
        IFS=':' read -r folder config_file project_name <<< "$project"
        
        echo -e "${YELLOW}📦 Deploy $project_name (produção)...${NC}"
        cd "$(dirname "$0")"
        vercel --name "$project_name" --prod || true
        cd - > /dev/null
    done
    
    echo -e "${GREEN}🎉 Deploy de produção concluído!${NC}"
    echo ""
    echo "🌐 URLs de produção:"
    echo "  Shell (Principal):  https://mfe-client-system-shell.vercel.app"
    echo "  Auth MFE:          https://mfe-auth.vercel.app"
    echo "  Clients MFE:       https://mfe-clients.vercel.app"
    echo "  Design System:     https://mfe-design-system.vercel.app"
}

# Função para verificar status dos deployments
check_status() {
    echo -e "${BLUE}📊 Verificando status dos deployments...${NC}"
    
    projects=("mfe-client-system-shell" "mfe-auth" "mfe-clients" "mfe-design-system")
    
    for project in "${projects[@]}"; do
        echo -e "${YELLOW}📦 Status $project:${NC}"
        vercel ls "$project" --scope="$(vercel whoami 2>/dev/null)" 2>/dev/null | head -5 || true
        echo ""
    done
}

# Função para listar domínios
list_domains() {
    echo -e "${BLUE}🌐 Domínios configurados:${NC}"
    
    projects=("mfe-client-system-shell" "mfe-auth" "mfe-clients" "mfe-design-system")
    
    for project in "${projects[@]}"; do
        echo -e "${YELLOW}📦 $project:${NC}"
        vercel domains ls --scope="$(vercel whoami 2>/dev/null)" 2>/dev/null | grep "$project" || echo "  Nenhum domínio personalizado"
        echo ""
    done
}

# Função para fazer deploy de todos os MFEs
deploy_all() {
    echo -e "${BLUE}🚀 Fazendo deploy de todos os MFEs...${NC}"
    
    # Perguntar sobre ambiente
    read -p "Deploy para qual ambiente? (dev/prod): " -n 4 -r
    echo
    
    if [[ $REPLY =~ ^[Pp][Rr][Oo][Dd]$ ]]; then
        deploy_prod
    else
        deploy_dev
    fi
}

# Processar argumentos
FORCE_DEPLOY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        --force)
            FORCE_DEPLOY=true
            shift
            ;;
        setup)
            COMMAND="setup"
            shift
            ;;
        deploy)
            COMMAND="deploy"
            shift
            ;;
        deploy-dev)
            COMMAND="deploy-dev"
            shift
            ;;
        deploy-prod)
            COMMAND="deploy-prod"
            shift
            ;;
        status)
            COMMAND="status"
            shift
            ;;
        domains)
            COMMAND="domains"
            shift
            ;;
        *)
            echo -e "${RED}❌ Comando desconhecido: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Verificar Vercel CLI
check_vercel_cli

# Fazer login na Vercel
vercel_login

# Executar comando
case $COMMAND in
    setup)
        setup_vercel_projects
        ;;
    deploy)
        deploy_all
        ;;
    deploy-dev)
        deploy_dev
        ;;
    deploy-prod)
        deploy_prod
        ;;
    status)
        check_status
        ;;
    domains)
        list_domains
        ;;
    *)
        echo -e "${YELLOW}⚠️  Nenhum comando especificado${NC}"
        show_help
        exit 1
        ;;
esac