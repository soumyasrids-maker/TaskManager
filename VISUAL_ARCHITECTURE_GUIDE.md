# 🎨 Project CRUD - Visual & Architecture Guide

## 🏗️ System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                               │
│                   (http://localhost:4200)                         │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               │ HTTP Requests/Responses
                               │
┌──────────────────────────────┴───────────────────────────────────┐
│                     ANGULAR FRONTEND                              │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            Projects Component (UI Layer)                    │ │
│  │  - projects.component.ts (Logic)                            │ │
│  │  - projects.component.html (Template)                       │ │
│  │  - projects.component.css (Styles)                          │ │
│  │                                                             │ │
│  │  Properties:                                                │ │
│  │  ├─ projects: Project[]                                    │ │
│  │  ├─ newProject: Project                                    │ │
│  │  ├─ showForm: boolean                                      │ │
│  │  ├─ isEditMode: boolean                                    │ │
│  │  └─ messages: string                                       │ │
│  │                                                             │ │
│  │  Methods:                                                  │ │
│  │  ├─ loadProjects()                                         │ │
│  │  ├─ openCreateForm() / openEditForm()                      │ │
│  │  ├─ createProject() / updateProject() / deleteProject()   │ │
│  │  └─ submitForm() / cancelForm()                            │ │
│  └──────────────────────┬──────────────────────────────────────┘ │
│                         │                                         │
│                         │ Calls methods                           │
│                         ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          Project Service (Business Logic Layer)             │ │
│  │                                                             │ │
│  │  Methods:                                                  │ │
│  │  ├─ createProject(project): Observable<Project>           │ │
│  │  ├─ getAllProjects(): Observable<Project[]>               │ │
│  │  ├─ getProjectById(id): Observable<Project>               │ │
│  │  ├─ updateProject(id, project): Observable<Project>       │ │
│  │  └─ deleteProject(id): Observable<void>                   │ │
│  │                                                             │ │
│  │  Uses:                                                     │ │
│  │  ├─ HttpClient                                             │ │
│  │  └─ ConfigurationService (for base URL)                   │ │
│  └──────────────────────┬──────────────────────────────────────┘ │
│                         │                                         │
│                         │ HTTP Calls                              │
│                         │ POST, GET, PUT, DELETE                  │
│                         ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │        HttpClient (HTTP Layer)                              │ │
│  │  Base URL: http://localhost:8080/api/projects              │ │
│  └──────────────────────┬──────────────────────────────────────┘ │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           │ HTTP Request
                           │
┌──────────────────────────┴───────────────────────────────────────┐
│                    SPRING BOOT BACKEND                            │
│               (http://localhost:8080)                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │   ProjectController (REST API Layer)                        │ │
│  │   @RestController @RequestMapping("/api/projects")          │ │
│  │   @CrossOrigin(origins = "http://localhost:4200")           │ │
│  │                                                             │ │
│  │   Endpoints:                                                │ │
│  │   ├─ POST /api/projects                                    │ │
│  │   ├─ GET /api/projects                                     │ │
│  │   ├─ GET /api/projects/{id}                                │ │
│  │   ├─ PUT /api/projects/{id}                                │ │
│  │   └─ DELETE /api/projects/{id}                             │ │
│  └──────────────────────┬──────────────────────────────────────┘ │
│                         │                                         │
│                         │ Calls repository                        │
│                         ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  ProjectRepository (Data Access Layer)                      │ │
│  │  extends JpaRepository<Projects, Long>                      │ │
│  │                                                             │ │
│  │  Methods:                                                  │ │
│  │  ├─ save(Projects): Projects                               │ │
│  │  ├─ findAll(): List<Projects>                              │ │
│  │  ├─ findById(Long): Optional<Projects>                     │ │
│  │  ├─ delete(Projects): void                                 │ │
│  │  └─ deleteById(Long): void                                 │ │
│  └──────────────────────┬──────────────────────────────────────┘ │
│                         │                                         │
│                         │ Executes SQL                            │
│                         ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │     Projects Entity (Domain/Model Layer)                    │ │
│  │  @Entity @Table(name = "projects")                          │ │
│  │                                                             │ │
│  │  Attributes:                                                │ │
│  │  ├─ id: Long (PK, AI)                                      │ │
│  │  ├─ projectname: String                                    │ │
│  │  ├─ status: String                                         │ │
│  │  ├─ progress: Integer                                      │ │
│  │  └─ teamlead: String                                       │ │
│  └──────────────────────┬──────────────────────────────────────┘ │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           │ JDBC/SQL
                           │
┌──────────────────────────┴───────────────────────────────────────┐
│                      MYSQL DATABASE                               │
│               (localhost:3306/TaskManager)                        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Table: projects                                             │ │
│  │                                                             │ │
│  │ ┌──────────┬──────────────────┬──────────┬──────────┬────┐ │ │
│  │ │ id       │ project_name     │ status   │ progress │... │ │ │
│  │ ├──────────┼──────────────────┼──────────┼──────────┼────┤ │ │
│  │ │ 1        │ Website Redesign │ In Prog. │ 65       │... │ │ │
│  │ │ 2        │ Mobile App       │ Not Str. │ 0        │... │ │ │
│  │ │ 3        │ Cloud Migration  │ On Hold  │ 30       │... │ │ │
│  │ └──────────┴──────────────────┴──────────┴──────────┴────┘ │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 📲 Component Data Flow Diagram

```
User Interface (HTML)
        │
        ▼
Form Input / Button Click
        │
        ▼
Component Method Called
├─ openCreateForm()
├─ openEditForm()
├─ submitForm()
├─ deleteProject()
└─ cancelForm()
        │
        ▼
Validate Data
├─ Check required fields
├─ Check format
└─ Handle errors
        │
        ▼
Call Service Method
├─ projectService.createProject(project)
├─ projectService.updateProject(id, project)
├─ projectService.deleteProject(id)
└─ projectService.getAllProjects()
        │
        ▼
Service Makes HTTP Request
├─ POST /api/projects
├─ PUT /api/projects/{id}
├─ DELETE /api/projects/{id}
└─ GET /api/projects
        │
        ▼
Backend Receives Request
        │
        ▼
Controller Processes Request
        │
        ▼
Repository Executes
        │
        ▼
Database Operation
        │
        ▼
Return Response to Frontend
        │
        ▼
Subscribe to Observable
        │
        ▼
Handle Response
├─ Success: Update UI + message
└─ Error: Show error message
        │
        ▼
Update Component Properties
├─ projects[] array
├─ Form visibility
├─ Messages
        │
        ▼
Template Re-renders
        │
        ▼
User Sees Changes
```

---

## 🔄 CRUD Operations Flow

### CREATE Flow
```
User clicks "New Project"
    ↓
Form opens (showForm = true)
    ↓
User fills form fields
    ↓
User clicks "Create Project"
    ↓
Component validates
    ↓
Service.createProject(newProject)
    ↓
POST /api/projects with JSON
    ↓
Backend saves to database
    ↓
Returns created project with ID
    ↓
Component.projects.push(newProject)
    ↓
Form closes (showForm = false)
    ↓
Success message displays
    ↓
Table updates with new project
```

### READ Flow
```
Component loads (ngOnInit)
    ↓
Component.loadProjects()
    ↓
Service.getAllProjects()
    ↓
GET /api/projects
    ↓
Backend queries database
    ↓
Returns Project[] as JSON
    ↓
Component.projects = data
    ↓
Template renders *ngFor
    ↓
Table/Cards display projects
```

### UPDATE Flow
```
User clicks "Edit" button
    ↓
Component.openEditForm(project)
    ↓
newProject = {...project} (copy)
    ↓
isEditMode = true
    ↓
Form opens with pre-filled data
    ↓
User modifies fields
    ↓
User clicks "Update Project"
    ↓
Component validates
    ↓
Service.updateProject(id, newProject)
    ↓
PUT /api/projects/{id} with JSON
    ↓
Backend updates database
    ↓
Returns updated project
    ↓
Component finds and updates in array
    ↓
Form closes
    ↓
Success message displays
    ↓
Table updates
```

### DELETE Flow
```
User clicks "Delete" button
    ↓
Browser confirmation dialog
    ↓
User confirms
    ↓
Service.deleteProject(id)
    ↓
DELETE /api/projects/{id}
    ↓
Backend deletes from database
    ↓
Returns 204 No Content
    ↓
Component filters array
    ↓
Component.projects = projects.filter(p => p.id !== id)
    ↓
Success message displays
    ↓
Project removed from table
```

---

## 🎯 Component State Diagram

```
INITIAL STATE
├─ projects: []
├─ showForm: false
├─ isEditMode: false
└─ messages: ''

LOADING STATE
├─ [HTTP Request Pending]
├─ Button disabled
└─ Loading spinner (optional)

CREATE FORM OPEN
├─ showForm: true
├─ isEditMode: false
├─ newProject: {}
└─ Form visible

EDIT FORM OPEN
├─ showForm: true
├─ isEditMode: true
├─ newProject: {id, projectname, ...}
└─ Form pre-filled

FORM SUBMITTED
├─ Validation check
├─ API call in progress
├─ Loading state
└─ Await response

SUCCESS STATE
├─ projects: [updated array]
├─ showForm: false
├─ successMessage: 'Success!'
└─ Auto-dismiss after 3s

ERROR STATE
├─ projects: [unchanged]
├─ errorMessage: 'Error details'
├─ Form stays open (CREATE/EDIT)
└─ User can retry or cancel

CANCEL/RESET
├─ projects: [loaded from DB]
├─ showForm: false
├─ isEditMode: false
├─ newProject: {}
├─ selectedProject: {}
├─ messages: ''
└─ Return to view mode
```

---

## 📊 Database Relationship Diagram

```
┌─────────────────────────────────────┐
│         projects Table              │
├─────────────────────────────────────┤
│                                     │
│ PK  id (BIGINT)                     │
│     - Auto Increment                │
│     - Primary Key                   │
│                                     │
│ NN  project_name (VARCHAR(255))     │
│     - Not Null                      │
│     - Project title                 │
│                                     │
│ DF  status (VARCHAR(50))            │
│     - Nullable                      │
│     - Values: Not Started,          │
│       In Progress, On Hold,         │
│       Completed                     │
│                                     │
│ DF  progress (INT)                  │
│     - Nullable                      │
│     - Range: 0-100                  │
│                                     │
│ DF  team_lead (VARCHAR(255))        │
│     - Nullable                      │
│     - Team lead name                │
│                                     │
└─────────────────────────────────────┘

Legend:
PK = Primary Key
NN = Not Null
DF = Default/Nullable
```

---

## 🎨 UI Layout Structure

### Desktop View (Table)
```
┌─────────────────────────────────────────────────────────────┐
│  Projects                                                   │
│  Manage and track all your projects...                      │
├─────────────────────────────────────────────────────────────┤
│ [➕ New Project] [Messages/Alerts]                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Create/Edit Form] (when open)                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ All Projects (5)                                            │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Project Name │ Status │ Progress │ Team Lead │Action│   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ Website      │ 🔵     │ ▓▓▓▓░░░░ │ John      │Edit  │   │
│ │ Redesign     │In Prog │ 65%      │ Doe       │Del   │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ Mobile App   │ ⚫     │ ░░░░░░░░ │ Jane      │Edit  │   │
│ │              │Not Str│ 0%       │ Smith     │Del   │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │ ...                                                  │   │
│ └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Color Legend:
🟢 = Completed (green)
🔵 = In Progress (blue)
🟡 = On Hold (yellow)
⚫ = Not Started (gray)
```

### Mobile View (Cards)
```
┌─────────────────────────────────────┐
│  Projects                           │
│  Manage and track...                │
├─────────────────────────────────────┤
│ [➕ New Project]                     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Website Redesign                │ │
│ │ 🔵 In Progress                  │ │
│ │ Team Lead: John Doe             │ │
│ │ ▓▓▓▓░░░░ 65%                    │ │
│ │ [Edit] [Delete]                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Mobile App                      │ │
│ │ ⚫ Not Started                   │ │
│ │ Team Lead: Jane Smith           │ │
│ │ ░░░░░░░░ 0%                     │ │
│ │ [Edit] [Delete]                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ...                                 │
└─────────────────────────────────────┘
```

---

## 📋 Form Layout

```
┌────────────────────────────────────────────────┐
│ Create New Project / Edit Project              │
├────────────────────────────────────────────────┤
│                                                │
│ Project Name *         │ Team Lead *           │
│ ┌────────────────────┐ │ ┌────────────────────┐
│ │ Enter project name │ │ │ Enter team lead    │
│ └────────────────────┘ │ └────────────────────┘
│                                                │
│ Status *               │ Progress (%)          │
│ ┌────────────────────┐ │ ┌────────────────────┐
│ │ Select Status ▼    │ │ │ 0-100              │
│ │ - Not Started      │ │ │ (optional)         │
│ │ - In Progress      │ │ └────────────────────┘
│ │ - On Hold          │ │
│ │ - Completed        │ │
│ └────────────────────┘ │
│                                                │
│ [Create Project] [Update Project] [Cancel]    │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 🔀 API Request/Response Examples

### Create Project
```
REQUEST:
POST /api/projects
Content-Type: application/json
{
  "projectname": "Website Redesign",
  "status": "In Progress",
  "progress": 65,
  "teamlead": "John Doe"
}

RESPONSE: 201 Created
{
  "id": 1,
  "projectname": "Website Redesign",
  "status": "In Progress",
  "progress": 65,
  "teamlead": "John Doe"
}
```

### Get All Projects
```
REQUEST:
GET /api/projects

RESPONSE: 200 OK
[
  {
    "id": 1,
    "projectname": "Website Redesign",
    "status": "In Progress",
    "progress": 65,
    "teamlead": "John Doe"
  },
  {
    "id": 2,
    "projectname": "Mobile App",
    "status": "Not Started",
    "progress": 0,
    "teamlead": "Jane Smith"
  }
]
```

### Update Project
```
REQUEST:
PUT /api/projects/1
Content-Type: application/json
{
  "projectname": "Website Redesign",
  "status": "Completed",
  "progress": 100,
  "teamlead": "John Doe"
}

RESPONSE: 200 OK
{
  "id": 1,
  "projectname": "Website Redesign",
  "status": "Completed",
  "progress": 100,
  "teamlead": "John Doe"
}
```

### Delete Project
```
REQUEST:
DELETE /api/projects/1

RESPONSE: 204 No Content
(Empty body)
```

---

## 📈 Data Processing Pipeline

```
User Input
    │
    ├─ Form Validation
    │   ├─ Required fields?
    │   ├─ Correct format?
    │   └─ Length checks?
    │
    ▼
Model Object (Project)
    │
    ├─ Convert to JSON
    │
    ▼
HTTP Request
    │
    ├─ Add headers
    ├─ Add authentication (future)
    │
    ▼
Network Transmission
    │
    ├─ Server receives
    ├─ Parse JSON
    │
    ▼
Business Logic
    │
    ├─ Validate on server
    ├─ Check permissions (future)
    │
    ▼
Database Operation
    │
    ├─ Execute query
    ├─ Commit transaction
    │
    ▼
Return Response
    │
    ├─ JSON conversion
    ├─ Status code
    │
    ▼
Network Transmission
    │
    ├─ Client receives
    ├─ Parse response
    │
    ▼
Update Component State
    │
    ├─ Update properties
    ├─ Trigger change detection
    │
    ▼
Re-render Template
    │
    ├─ DOM updates
    ├─ CSS applied
    │
    ▼
Display to User
```

---

## 🔐 Error Handling Flow

```
Operation Initiated
    │
    ├─ Frontend Validation
    │   └─ If failed → Show error, Stop
    │
    ├─ HTTP Request Sent
    │   │
    │   ├─ Network Error
    │   │   └─ Show "Connection failed"
    │   │
    │   ├─ 4xx Error (Bad Request, Not Found)
    │   │   ├─ 400 → Show validation error
    │   │   ├─ 404 → Show "Not found"
    │   │   └─ 409 → Show "Conflict"
    │   │
    │   ├─ 5xx Error (Server Error)
    │   │   └─ Show "Server error, try again"
    │   │
    │   └─ 2xx Success
    │       ├─ Update component
    │       ├─ Refresh UI
    │       └─ Show success message
```

---

**This visual guide helps understand the complete architecture and flow of the Project CRUD system!** 🎨
