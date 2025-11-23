#!/bin/bash

# HerCycle - Connection Test Script
# Tests all connections between frontend, backend, and external services

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🔍 HerCycle Connection Test Script 🔍   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

TESTS_PASSED=0
TESTS_FAILED=0

# Function to check HTTP endpoint
check_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $name... "
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $status_code)"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $status_code, expected $expected_status)"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to check JSON response
check_json_response() {
    local name=$1
    local url=$2
    local expected_field=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s "$url" 2>/dev/null || echo "{}")
    
    if echo "$response" | grep -q "$expected_field"; then
        echo -e "${GREEN}✓ PASS${NC} (Found '$expected_field')"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected field not found)"
        echo -e "${YELLOW}   Response: $response${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo -e "${BLUE}[1] Backend Health Checks${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_endpoint "Backend root" "http://localhost:8000/"
check_json_response "Backend health endpoint" "http://localhost:8000/health" "status"
check_endpoint "Backend API docs" "http://localhost:8000/docs"

echo ""
echo -e "${BLUE}[2] Frontend Health Checks${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_endpoint "Frontend root" "http://localhost:8080/"

echo ""
echo -e "${BLUE}[3] API Endpoints${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test profile endpoint
echo -n "Testing profile GET... "
response=$(curl -s http://localhost:8000/profile/ 2>/dev/null || echo "{}")
if echo "$response" | grep -q "profile"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

# Test profile POST
echo -n "Testing profile POST... "
response=$(curl -s -X POST http://localhost:8000/profile/ \
    -H "Content-Type: application/json" \
    -d '{"age": 25, "diet_type": "vegetarian"}' 2>/dev/null || echo "{}")
if echo "$response" | grep -q "message"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

# Test cycles history
echo -n "Testing cycles history... "
response=$(curl -s http://localhost:8000/cycles/history 2>/dev/null || echo "{}")
if echo "$response" | grep -q "cycles"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

# Test check-in history
echo -n "Testing check-in history... "
response=$(curl -s "http://localhost:8000/checkin/history?days=7" 2>/dev/null || echo "{}")
if echo "$response" | grep -q "checkins"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

# Test resources
echo -n "Testing support resources... "
response=$(curl -s http://localhost:8000/support/resources 2>/dev/null || echo "{}")
if echo "$response" | grep -q "resources"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}[4] Environment Configuration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check .env file
echo -n "Checking .env file... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ EXISTS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ MISSING${NC}"
    ((TESTS_FAILED++))
fi

# Check API keys in health response
echo -n "Checking Gemini API configuration... "
response=$(curl -s http://localhost:8000/health 2>/dev/null || echo "{}")
if echo "$response" | grep -q '"gemini_api":"configured"'; then
    echo -e "${GREEN}✓ CONFIGURED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ NOT CONFIGURED${NC}"
    ((TESTS_FAILED++))
fi

echo -n "Checking Places API configuration... "
if echo "$response" | grep -q '"places_api":"configured"'; then
    echo -e "${GREEN}✓ CONFIGURED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ NOT CONFIGURED${NC} (Optional)"
    ((TESTS_PASSED++))  # Don't count as failure
fi

echo ""
echo -e "${BLUE}[5] File System Checks${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check data directory
echo -n "Checking data directory... "
if [ -d "data" ]; then
    echo -e "${GREEN}✓ EXISTS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ MISSING${NC}"
    mkdir -p data
    echo -e "${YELLOW}   Created data directory${NC}"
    ((TESTS_PASSED++))
fi

# Check vector store
echo -n "Checking vector store... "
if [ -d "data/vector_store" ]; then
    echo -e "${GREEN}✓ EXISTS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ NOT INITIALIZED${NC} (Will be created on first run)"
    ((TESTS_PASSED++))
fi

# Check knowledge base
echo -n "Checking knowledge base... "
if [ -d "app/knowledge" ]; then
    echo -e "${GREEN}✓ EXISTS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ MISSING${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}[6] Frontend-Backend Integration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check CORS
echo -n "Testing CORS (OPTIONS request)... "
cors_response=$(curl -s -X OPTIONS http://localhost:8000/profile/ \
    -H "Origin: http://localhost:8080" \
    -H "Access-Control-Request-Method: POST" \
    -o /dev/null -w "%{http_code}" 2>/dev/null || echo "000")

if [ "$cors_response" -eq "200" ] || [ "$cors_response" -eq "204" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ Check CORS settings${NC}"
    ((TESTS_PASSED++))  # Don't fail on this
fi

# Check API base URL in frontend
echo -n "Checking frontend API configuration... "
if [ -f "frontend/src/lib/api.ts" ]; then
    if grep -q "localhost:8000" frontend/src/lib/api.ts; then
        echo -e "${GREEN}✓ CORRECT${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ INCORRECT${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${RED}✗ FILE MISSING${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo -e "${BLUE}[7] Python Dependencies${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Check key packages
for package in "fastapi" "langchain" "chromadb" "google-generativeai"; do
    echo -n "Checking $package... "
    if python -c "import $package" 2>/dev/null; then
        echo -e "${GREEN}✓ INSTALLED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ MISSING${NC}"
        ((TESTS_FAILED++))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}                 TEST SUMMARY                  ${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "Tests Passed:  ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed:  ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✓ ALL TESTS PASSED - READY TO GO! 🚀    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Your application is ready!${NC}"
    echo -e "Frontend: ${GREEN}http://localhost:8080${NC}"
    echo -e "Backend:  ${GREEN}http://localhost:8000${NC}"
    echo -e "API Docs: ${GREEN}http://localhost:8000/docs${NC}"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║   ✗ SOME TESTS FAILED - NEEDS ATTENTION   ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Please fix the failed tests before proceeding.${NC}"
    echo -e "${YELLOW}Refer to QUICK_START.md for troubleshooting.${NC}"
    exit 1
fi
