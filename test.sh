#!/bin/bash

# Test runner script for MFE Client System
# This script provides an easy way to run different types of tests

set -e

echo "🧪 MFE Client System Test Runner"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if dependencies are installed
check_dependencies() {
    print_step "Checking dependencies..."
    
    if [ ! -d "node_modules" ]; then
        print_warning "Dependencies not found. Installing..."
        npm install
    fi
    
    if [ ! -d "node_modules/@playwright" ]; then
        print_warning "Playwright not found. Installing browsers..."
        npm run test:install
    fi
    
    print_success "Dependencies checked"
}

# Function to run unit tests
run_unit_tests() {
    print_step "Running unit tests..."
    
    echo "Running clients-mfe tests..."
    npm run test --workspace=packages/clients-mfe --silent || true
    
    echo "Running auth-mfe tests..."
    npm run test --workspace=packages/auth-mfe --silent || true
    
    echo "Running design-system tests..."
    npm run test --workspace=packages/design-system --silent || true
    
    print_success "Unit tests completed"
}

# Function to run e2e tests
run_e2e_tests() {
    print_step "Running E2E tests..."
    
    # Check if services are running
    if ! curl -s http://localhost:5173 > /dev/null; then
        print_warning "Services not running. Starting development servers..."
        npm run dev > /dev/null 2>&1 &
        DEV_PID=$!
        
        # Wait for services to start
        echo "Waiting for services to start..."
        sleep 10
        
        # Run E2E tests
        npm run test:e2e
        
        # Stop development servers
        kill $DEV_PID 2>/dev/null || true
        npm run stop:all
    else
        # Services are already running
        npm run test:e2e
    fi
    
    print_success "E2E tests completed"
}

# Function to run all tests
run_all_tests() {
    print_step "Running all tests..."
    run_unit_tests
    run_e2e_tests
    print_success "All tests completed"
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  unit     Run only unit tests"
    echo "  e2e      Run only E2E tests"
    echo "  all      Run all tests (default)"
    echo "  install  Install test dependencies"
    echo "  help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Run all tests"
    echo "  $0 unit         # Run only unit tests"
    echo "  $0 e2e          # Run only E2E tests"
    echo "  $0 install      # Install test dependencies"
}

# Main execution
case "${1:-all}" in
    "unit")
        check_dependencies
        run_unit_tests
        ;;
    "e2e")
        check_dependencies
        run_e2e_tests
        ;;
    "all")
        check_dependencies
        run_all_tests
        ;;
    "install")
        npm install
        npm run test:install
        print_success "Test dependencies installed"
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac

echo ""
print_success "Test execution completed!"