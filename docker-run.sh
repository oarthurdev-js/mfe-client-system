#!/bin/bash

# Script para executar o projeto em containers Docker

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir ajuda
show_help() {
    echo "🐳 Script de Docker para Sistema MFE Client"
    echo ""
    echo "Uso: $0 [COMANDO] [OPÇÕES]"
    echo ""
    echo "Comandos:"
    echo "  dev         Inicia ambiente de desenvolvimento"
    echo "  prod        Inicia ambiente de produção"
    echo "  test        Executa testes em container"
    echo "  build       Builda todas as imagens"
    echo "  stop        Para todos os containers"
    echo "  clean       Remove containers e imagens"
    echo "  logs        Mostra logs dos containers"
    echo "  health      Verifica saúde dos containers"
    echo ""
    echo "Opções:"
    echo "  -h, --help  Mostra esta ajuda"
    echo "  --rebuild   Força rebuild das imagens"
    echo ""
    echo "Exemplos:"
    echo "  $0 dev              # Inicia desenvolvimento"
    echo "  $0 prod --rebuild   # Inicia produção com rebuild"
    echo "  $0 test             # Executa testes"
}

# Função para verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker não está instalado!${NC}"
        echo "Por favor instale o Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose não está instalado!${NC}"
        echo "Por favor instale o Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
}

# Função para verificar se os containers estão rodando
check_containers() {
    echo -e "${BLUE}🔍 Verificando containers...${NC}"
    docker-compose ps
}

# Função para mostrar logs
show_logs() {
    echo -e "${BLUE}📋 Mostrando logs...${NC}"
    if [ -z "$2" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$2"
    fi
}

# Função para verificar saúde dos containers
health_check() {
    echo -e "${BLUE}🏥 Verificando saúde dos containers...${NC}"
    
    services=("shell" "auth-mfe" "clients-mfe" "design-system")
    
    for service in "${services[@]}"; do
        if docker-compose ps "$service" | grep -q "Up"; then
            echo -e "${GREEN}✅ $service: Rodando${NC}"
        else
            echo -e "${RED}❌ $service: Parado${NC}"
        fi
    done
}

# Função para iniciar desenvolvimento
start_dev() {
    echo -e "${BLUE}🚀 Iniciando ambiente de desenvolvimento...${NC}"
    
    if [ "$REBUILD" = true ]; then
        echo -e "${YELLOW}🔨 Rebuilding imagens...${NC}"
        docker-compose -f docker-compose.dev.yml up --build -d
    else
        docker-compose -f docker-compose.dev.yml up -d
    fi
    
    echo -e "${GREEN}✅ Ambiente de desenvolvimento iniciado!${NC}"
    echo ""
    echo "📱 URLs disponíveis:"
    echo "  Shell (Principal):     http://localhost:5173"
    echo "  Auth MFE:             http://localhost:5174"
    echo "  Clients MFE:          http://localhost:5175"
    echo "  Design System:        http://localhost:5176"
    echo ""
    echo "Para ver logs: $0 logs"
}

# Função para iniciar produção
start_prod() {
    echo -e "${BLUE}🚀 Iniciando ambiente de produção...${NC}"
    
    if [ "$REBUILD" = true ]; then
        echo -e "${YELLOW}🔨 Rebuilding imagens...${NC}"
        docker-compose up --build -d shell auth-mfe clients-mfe design-system
    else
        docker-compose up -d shell auth-mfe clients-mfe design-system
    fi
    
    echo -e "${GREEN}✅ Ambiente de produção iniciado!${NC}"
    echo ""
    echo "📱 URLs disponíveis:"
    echo "  Shell (Principal):     http://localhost:80"
    echo "  Auth MFE:             http://localhost:8174"
    echo "  Clients MFE:          http://localhost:8175"
    echo "  Design System:        http://localhost:8176"
    echo ""
    echo "Para ver logs: $0 logs"
}

# Função para executar testes
run_tests() {
    echo -e "${BLUE}🧪 Executando testes...${NC}"
    
    # Inicia serviços necessários para testes
    docker-compose up -d shell auth-mfe clients-mfe design-system
    
    # Aguarda serviços ficarem prontos
    echo -e "${YELLOW}⏳ Aguardando serviços ficarem prontos...${NC}"
    sleep 10
    
    # Executa testes
    docker-compose --profile test run --rm e2e-tests
    
    echo -e "${GREEN}✅ Testes concluídos!${NC}"
}

# Função para buildar imagens
build_images() {
    echo -e "${BLUE}🔨 Buildando todas as imagens...${NC}"
    docker-compose build
    echo -e "${GREEN}✅ Build concluído!${NC}"
}

# Função para parar containers
stop_containers() {
    echo -e "${BLUE}🛑 Parando containers...${NC}"
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo -e "${GREEN}✅ Containers parados!${NC}"
}

# Função para limpeza completa
clean_all() {
    echo -e "${YELLOW}🧹 Limpando containers e imagens...${NC}"
    
    read -p "Tem certeza que deseja remover todos os containers e imagens? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down --rmi all --volumes --remove-orphans
        docker-compose -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
        
        # Remove imagens órfãs
        docker image prune -f
        
        echo -e "${GREEN}✅ Limpeza concluída!${NC}"
    else
        echo -e "${BLUE}ℹ️  Operação cancelada${NC}"
    fi
}

# Processar argumentos
REBUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        --rebuild)
            REBUILD=true
            shift
            ;;
        dev)
            COMMAND="dev"
            shift
            ;;
        prod)
            COMMAND="prod"
            shift
            ;;
        test)
            COMMAND="test"
            shift
            ;;
        build)
            COMMAND="build"
            shift
            ;;
        stop)
            COMMAND="stop"
            shift
            ;;
        clean)
            COMMAND="clean"
            shift
            ;;
        logs)
            COMMAND="logs"
            SERVICE="$2"
            shift 2
            ;;
        health)
            COMMAND="health"
            shift
            ;;
        *)
            echo -e "${RED}❌ Comando desconhecido: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Verificar Docker
check_docker

# Executar comando
case $COMMAND in
    dev)
        start_dev
        ;;
    prod)
        start_prod
        ;;
    test)
        run_tests
        ;;
    build)
        build_images
        ;;
    stop)
        stop_containers
        ;;
    clean)
        clean_all
        ;;
    logs)
        show_logs "$COMMAND" "$SERVICE"
        ;;
    health)
        health_check
        ;;
    *)
        echo -e "${YELLOW}⚠️  Nenhum comando especificado${NC}"
        show_help
        exit 1
        ;;
esac