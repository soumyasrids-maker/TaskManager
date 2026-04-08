#!/bin/bash
# Project CRUD API Testing Commands
# Test these endpoints using curl in the terminal

# Base URL
BASE_URL="http://localhost:8080/api/projects"

# =============================================================================
# CREATE - POST /api/projects
# =============================================================================
echo "Creating a new project..."
curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "projectname": "Website Redesign",
    "status": "In Progress",
    "progress": 65,
    "teamlead": "John Doe"
  }'

# Alternative with jq (prettier output)
# curl -X POST "$BASE_URL" \
#   -H "Content-Type: application/json" \
#   -d '{"projectname": "Website Redesign", "status": "In Progress", "progress": 65, "teamlead": "John Doe"}' | jq

# =============================================================================
# READ ALL - GET /api/projects
# =============================================================================
echo ""
echo "Getting all projects..."
curl -X GET "$BASE_URL"

# With jq (prettier)
# curl -X GET "$BASE_URL" | jq

# =============================================================================
# READ ONE - GET /api/projects/{id}
# =============================================================================
echo ""
echo "Getting a specific project (ID: 1)..."
curl -X GET "$BASE_URL/1"

# =============================================================================
# UPDATE - PUT /api/projects/{id}
# =============================================================================
echo ""
echo "Updating project (ID: 1)..."
curl -X PUT "$BASE_URL/1" \
  -H "Content-Type: application/json" \
  -d '{
    "projectname": "Website Redesign - Updated",
    "status": "Completed",
    "progress": 100,
    "teamlead": "Jane Smith"
  }'

# =============================================================================
# DELETE - DELETE /api/projects/{id}
# =============================================================================
echo ""
echo "Deleting project (ID: 1)..."
curl -X DELETE "$BASE_URL/1"

# =============================================================================
# CREATE MULTIPLE TEST PROJECTS
# =============================================================================
echo ""
echo "Creating multiple test projects..."

# Project 1
curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "projectname": "Mobile App Development",
    "status": "In Progress",
    "progress": 45,
    "teamlead": "Jane Smith"
  }'

sleep 1

# Project 2
curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "projectname": "Cloud Migration",
    "status": "Not Started",
    "progress": 0,
    "teamlead": "Mike Johnson"
  }'

sleep 1

# Project 3
curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "projectname": "Data Analytics Platform",
    "status": "On Hold",
    "progress": 30,
    "teamlead": "Sarah Williams"
  }'

# =============================================================================
# BATCH OPERATIONS - TESTING SCRIPT
# =============================================================================

# Create a file named `test_crud.sh` and make it executable:
# chmod +x test_crud.sh
# ./test_crud.sh

# Example combined test script:
#
# #!/bin/bash
# BASE_URL="http://localhost:8080/api/projects"
# 
# echo "1. Creating project..."
# PROJECT=$(curl -s -X POST "$BASE_URL" \
#   -H "Content-Type: application/json" \
#   -d '{"projectname":"Test Project","status":"In Progress","progress":50,"teamlead":"Test Lead"}')
# 
# PROJECT_ID=$(echo $PROJECT | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
# 
# echo "Created project with ID: $PROJECT_ID"
# 
# echo "2. Reading all projects..."
# curl -s -X GET "$BASE_URL" | jq .
# 
# echo "3. Reading specific project..."
# curl -s -X GET "$BASE_URL/$PROJECT_ID" | jq .
# 
# echo "4. Updating project..."
# curl -s -X PUT "$BASE_URL/$PROJECT_ID" \
#   -H "Content-Type: application/json" \
#   -d '{"projectname":"Updated Project","status":"Completed","progress":100,"teamlead":"Updated Lead"}' | jq .
# 
# echo "5. Deleting project..."
# curl -s -X DELETE "$BASE_URL/$PROJECT_ID"
# 
# echo "6. Verifying deletion..."
# curl -s -X GET "$BASE_URL" | jq .
