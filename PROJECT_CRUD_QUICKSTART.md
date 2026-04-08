# Project CRUD - Quick Start Guide

## What Was Created

✅ **Complete CRUD Operations** for Projects with full Backend-Frontend integration

### Files Created:
1. `src/app/project.Model.ts` - TypeScript interface for Project
2. `Controller/ProjectController.java` - Spring Boot REST API endpoints

### Files Modified:
1. `src/app/project.service.ts` - CRUD service methods
2. `src/app/configuration.service.ts` - Added backend URL
3. `src/app/projects/projects.component.ts` - Component logic
4. `src/app/projects/projects.component.html` - Interactive UI

---

## Quick Start

### Step 1: Start Backend Server
```bash
cd /Applications/TaskManager
mvn spring-boot:run
```
✓ Server will run on: `http://localhost:8080`

### Step 2: Start Frontend Server
```bash
cd /Users/d.soumyasri/TaskManager
ng serve
```
✓ Frontend will run on: `http://localhost:4200`

### Step 3: Open Projects Page
Navigate to: `http://localhost:4200/projects`

---

## API Endpoints

| Operation | Method | Endpoint | Returns |
|-----------|--------|----------|---------|
| Create | POST | `/api/projects` | Project (201) |
| Read All | GET | `/api/projects` | Project[] (200) |
| Read One | GET | `/api/projects/{id}` | Project (200) |
| Update | PUT | `/api/projects/{id}` | Project (200) |
| Delete | DELETE | `/api/projects/{id}` | (204) |

**Base URL:** `http://localhost:8080`

---

## Database

**Database:** MySQL  
**Name:** TaskManager  
**Table:** projects  
**Username:** root  
**Password:** root2537  
**Port:** 3306

### Create Projects Manually (Optional)
```sql
INSERT INTO projects (project_name, status, progress, team_lead) 
VALUES ('Sample Project', 'In Progress', 50, 'John Doe');
```

---

## Component Features

### UI Elements:
- ✅ Create Project Form
- ✅ Edit Project Inline
- ✅ Delete with Confirmation
- ✅ Success/Error Messages
- ✅ Responsive (Desktop & Mobile)
- ✅ Progress Bars
- ✅ Status Badges
- ✅ Empty State Message

### Status Options:
- Not Started
- In Progress
- On Hold
- Completed

---

## Service Methods

```typescript
// Get all projects
projectService.getAllProjects().subscribe(...)

// Get single project
projectService.getProjectById(1).subscribe(...)

// Create new project
projectService.createProject(projectObj).subscribe(...)

// Update project
projectService.updateProject(1, projectObj).subscribe(...)

// Delete project
projectService.deleteProject(1).subscribe(...)
```

---

## Troubleshooting

### Issue: "No projects showing"
- ✓ Check backend server is running
- ✓ Check MySQL is running
- ✓ Open DevTools → Network tab
- ✓ Look for GET `/api/projects` request

### Issue: "Cannot POST to backend"
- ✓ Verify backend URL in `ConfigurationService`
- ✓ Should be: `http://localhost:8080`
- ✓ Check CORS settings in `ProjectController`

### Issue: "Database connection error"
- ✓ Verify MySQL credentials in `application.properties`
- ✓ Create database: `CREATE DATABASE TaskManager;`
- ✓ Check MySQL is running on port 3306

---

## Testing

### Create a Project:
1. Click "New Project" button
2. Fill form: Name, Team Lead, Status, Progress
3. Click "Create Project"
4. Should see success message
5. Project appears in table

### Edit a Project:
1. Click "Edit" button on any row
2. Form pre-fills with project data
3. Change any field
4. Click "Update Project"
5. Changes save to database

### Delete a Project:
1. Click "Delete" button
2. Confirm in browser dialog
3. Project removed from list
4. Removed from database

---

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Read, Update |
| 201 | Created | Create |
| 204 | No Content | Delete |
| 400 | Bad Request | Invalid data |
| 404 | Not Found | Project doesn't exist |
| 500 | Server Error | Database issue |

---

## Environment Configuration

### Angular (`ConfigurationService`)
- **Frontend URL:** `http://localhost:3000` (for JSON server)
- **Backend URL:** `http://localhost:8080` (for Spring Boot)

### Spring Boot (`application.properties`)
- **DB URL:** `jdbc:mysql://localhost:3306/TaskManager`
- **DB User:** `root`
- **DB Pass:** `root2537`
- **Hibernate:** `update` (auto-creates tables)

---

## Key Implementation Details

### Architecture:
```
Angular Component (UI)
         ↓
  ProjectService (API calls)
         ↓
  HttpClient (HTTP requests)
         ↓
Spring Boot Controller
         ↓
 ProjectRepository
         ↓
   MySQL Database
```

### Data Flow (Create):
1. User fills form in UI
2. Component calls `projectService.createProject()`
3. Service makes POST to `/api/projects`
4. Backend validates and saves to DB
5. Returns created project with ID
6. Component updates local array
7. UI refreshes with new project

---

## Next Steps (Optional)

1. Add search/filter functionality
2. Add pagination
3. Add project categories
4. Add team member assignment
5. Add deadline tracking
6. Add file attachments
7. Add project templates
8. Export to PDF/Excel

---

## Complete File Paths

**Frontend:**
- Service: `/Users/d.soumyasri/TaskManager/src/app/project.service.ts`
- Model: `/Users/d.soumyasri/TaskManager/src/app/project.Model.ts`
- Component: `/Users/d.soumyasri/TaskManager/src/app/projects/projects.component.ts`
- Template: `/Users/d.soumyasri/TaskManager/src/app/projects/projects.component.html`
- Config: `/Users/d.soumyasri/TaskManager/src/app/configuration.service.ts`

**Backend:**
- Controller: `/Applications/TaskManager/src/main/java/com/pack/capstone/Controller/ProjectController.java`
- Entity: `/Applications/TaskManager/src/main/java/com/pack/capstone/Entity/Projects.java`
- Repository: `/Applications/TaskManager/src/main/java/com/pack/capstone/repository/ProjectRepo.java`
- Config: `/Applications/TaskManager/src/main/resources/application.properties`

---

**Ready to use! Follow the Quick Start section to begin.** 🚀
