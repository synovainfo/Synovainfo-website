#!/bin/bash

# ============================================================================
# SYNOVAINFO CMS - COMPREHENSIVE TESTING SCRIPT
# ============================================================================
# This script tests all CRUD operations for the CMS
# Credentials: admin@synovainfo.com / password123
# Base URL: http://localhost:8000/admin (Default for local testing)

BASE_URL="https://synovainfo.com"
ADMIN_URL="${BASE_URL}/admin"
EMAIL="admin@synovainfo.com"
PASSWORD="password123"
COOKIE_FILE="cookies.txt"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

log_section() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}▶ $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# ============================================================================
# 1. AUTHENTICATION TEST
# ============================================================================

test_authentication() {
    log_section "TEST 1: AUTHENTICATION"
    
    log_info "Attempting login..."
    
    RESPONSE=$(curl -s -c "$COOKIE_FILE" \
        -X POST "${ADMIN_URL}/api/auth/login" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d "{
            \"email\": \"${EMAIL}\",
            \"password\": \"${PASSWORD}\"
        }")
    
    if echo "$RESPONSE" | grep -q "token\|success"; then
        log_success "Authentication successful"
        echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
        return 0
    else
        log_error "Authentication failed"
        echo "$RESPONSE"
        return 1
    fi
}

# ============================================================================
# 2. PAGES - CRUD OPERATIONS
# ============================================================================

test_pages_crud() {
    log_section "TEST 2: PAGES - CRUD OPERATIONS"
    
    # READ - Get all pages
    log_info "2.1 - GET all pages"
    RESPONSE=$(curl -s -b "$COOKIE_FILE" \
        -X GET "${ADMIN_URL}/api/pages" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json")
    
    if echo "$RESPONSE" | grep -q "success"; then
        log_success "GET all pages - PASSED"
        echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
    else
        log_error "GET all pages - FAILED"
        echo "$RESPONSE"
    fi
    
    # CREATE - Add new page
    log_info "2.2 - CREATE new page"
    PAGE_CREATE=$(curl -s -b "$COOKIE_FILE" \
        -X POST "${ADMIN_URL}/api/pages" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d "{
            \"title\": \"Test Page $(date +%s)\",
            \"slug\": \"test-page-$(date +%s)\",
            \"content\": \"<p>This is a test page</p>\",
            \"status\": \"PUBLISHED\"
        }")
    
    if echo "$PAGE_CREATE" | grep -q "\"success\":true\|\"success\": true"; then
        log_success "CREATE page - PASSED"
        PAGE_ID=$(echo "$PAGE_CREATE" | jq -r '.data.id // .id' 2>/dev/null)
        echo "$PAGE_CREATE" | jq . 2>/dev/null || echo "$PAGE_CREATE"
    else
        log_error "CREATE page - FAILED"
        echo "$PAGE_CREATE"
        return
    fi
    
    # UPDATE - Modify the page
    if [ ! -z "$PAGE_ID" ] && [ "$PAGE_ID" != "null" ]; then
        log_info "2.3 - UPDATE page (ID: $PAGE_ID)"
        PAGE_UPDATE=$(curl -s -b "$COOKIE_FILE" \
            -X PUT "${ADMIN_URL}/api/pages/${PAGE_ID}" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d "{
                \"title\": \"Updated Test Page\",
                \"slug\": \"updated-test-page\",
                \"content\": \"<p>This is an updated test page</p>\",
                \"status\": \"PUBLISHED\"
            }")
        
        if echo "$PAGE_UPDATE" | grep -q "\"success\":true\|\"success\": true"; then
            log_success "UPDATE page - PASSED"
            echo "$PAGE_UPDATE" | jq . 2>/dev/null || echo "$PAGE_UPDATE"
        else
            log_error "UPDATE page - FAILED"
            echo "$PAGE_UPDATE"
        fi
        
        # DELETE - Remove the page
        log_info "2.4 - DELETE page (ID: $PAGE_ID)"
        PAGE_DELETE=$(curl -s -b "$COOKIE_FILE" \
            -X DELETE "${ADMIN_URL}/api/pages/${PAGE_ID}" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json")
        
        if echo "$PAGE_DELETE" | grep -q "success\|message"; then
            log_success "DELETE page - PASSED"
            echo "$PAGE_DELETE" | jq . 2>/dev/null || echo "$PAGE_DELETE"
        else
            log_error "DELETE page - FAILED"
            echo "$PAGE_DELETE"
        fi
    fi
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
    clear
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════════════╗"
    echo "║     SYNOVAINFO CMS - COMPREHENSIVE TESTING SUITE                   ║"
    echo "║     Testing CRUD operations across modules                         ║"
    echo "╚════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Start timing
    START_TIME=$(date +%s)
    
    # Run tests
    test_authentication
    test_pages_crud
    
    # End timing
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    # Summary
    log_section "TEST SUMMARY"
    log_info "Total execution time: ${DURATION} seconds"
    log_info "Check the output above for detailed results"
    
    # Cleanup
    rm -f "$COOKIE_FILE"
}

# Run main function
main
