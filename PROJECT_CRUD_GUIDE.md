# Project CRUD Operations - Implementation Guide

## Overview
This document outlines the complete CRUD (Create, Read, Update, Delete) operations for the Project feature, with full integration between the Angular frontend and Spring Boot backend.

---

## Backend Implementation (Spring Boot)

### 1. Project Entity
**File:** `/Applications/TaskManager/src/main/java/com/pack/capstone/Entity/Projects.java`

```java
@Entity
@Table(name = "projects")
public class Projects {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "project_name", nullable = false)
    private String projectname;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "progress")
    private Integer progress;
    
    @Column(name = "team_lead")
    private String teamlead;
}
```

**Fields:**
- `id`: Unique identifier (auto-generated)
- `projectname`: Name of the project (required)
- `status`: Current status (Not Started, In Progress, On Hold, Completed)
- `progress`: Progress percentage (0-100)
- `teamlead`: Name of the team lead

### 2. Project Repository
**File:** `/Applications/TaskManager/src/main/java/com/pack/capstone/repository/ProjectRepo.java`

Extends `JpaRepository` for basic CRUD operations:
- `save()` - Create/Update
- `findAll()` - Read all
- `findById()` - Read single
- `deleteById()` - Delete

### 3. Project Controller
**File:** `/Applications/TaskManager/src/main/java/com/pack/capstone/Controller/ProjectController.java`

#### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create a new project |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/{id}` | Get a project by ID |
| PUT | `/api/projects/{id}` | Update a project |
| DELETE | `/api/projects/{id}` | Delete a project |

#### Features:
- CORS enabled for `http://localhost:4200`
- Proper HTTP status codes (201 for creation, 204 for deletion)
- Null-safe field updates
- Error handling with 404 responses

---

## Frontend Implementation (Angular)

### 1. Project Model
**File:** `/Users/d.soumyasri/TaskManager/src/app/project.Model.ts`

```typescript
export class Project {
    id?: number;
    projectname?: string;
    status?: string;
    progress?: number;
    teamlead?: string;
}
```

### 2. Project Service
**File:** `/Users/d.soumyasri/TaskManager/src/app/project.service.ts`

Provides methods for all CRUD operations:

```typescript
// CREATE
createProject(project: Project): Observable<Project>

// READ
getAllProjects(): Observable<Project[]>
getProjectById(id: number): Observable<Project>

// UPDATE
updateProject(id: number, project: Project): Observable<Project>

// DELETE
deleteProject(id: number): Observable<void>
```

**Key Features:**
- Uses `HttpClient` for HTTP requests
- Configuration service for backend URL
- Base URL: `http://localhost:8080/api/projects`
- Returns Observables for async operations

### 3. Configuration Service
**File:** `/Users/d.soumyasri/TaskManager/src/app/configuration.service.ts`

```typescript
getApiUrl(): string // Returns: http://localhost:3000
getBackendUrl(): string // Returns: http://localhost:8080
```

### 4. Projects Component
**File:** `/Users/d.soumyasri/TaskManager/src/app/projects/projects.component.ts`

**Component Properties:**
- `projects`: Array of Project objects
- `newProject`: Current project being created/edited
- `selectedProject`: Currently selected project
- `showForm`: Toggle form visibility
- `isEditMode`: Toggle between create and edit modes
- `errorMessage`: Display error messages
- `successMessage`: Display success messages

**Component Methods:**

```typescript
// Load projects from backend
loadProjects(): void

// Form management
openCreateForm(): void
openEditForm(project: Project): void
cancelForm(): void
submitForm(): void

// CRUD operations
createProject(): void
updateProject(): void
deleteProject(id: number): void
```

### 5. Projects Component Template
**File:** `/Users/d.soumyasri/TaskManager/src/app/projects/projects.component.html`

**Features:**
- Responsive design (Table on desktop, Cards on mobile)
- Create/Edit form with validation
- Dynamic status badges with color coding
- Progress bars
- Success/Error message alerts
- Empty state when no projects exist
- Edit and Delete buttons with confirmation

---

## Setup Instructions

### Backend Setup

1. **Database Configuration**
   - File: `/Applications/TaskManager/src/main/resources/application.properties`
   - MySQL Database: `TaskManager`
   - Username: `root`
   - Password: `root2537`
   - Port: `3306`

2. **Start Spring Boot Server**
   ```bash
   cd /Applications/TaskManager
   mvn spring-boot:run
   ```
   - Server runs on: `http://localhost:8080`

3. **Database Table**
   - Table: `projects`
   - Auto-created by Hibernate (ddl-auto=update)

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd /Users/d.soumyasri/TaskManager
   npm install
   ```

2. **Start Angular Dev Server**
   ```bash
   ng serve
   ```
   - Angular runs on: `http://localhost:4200`

3. **Verify Connection**
   - Navigate to: `http://localhost:4200/projects`
   - Try creating a new project
   - Check that data persists in MySQL database

---

## API Response Examples

### Create Project (POST /api/projects)
**Request:**
```json
{
    "projectname": "Mobile App Development",
    "status": "In Progress",
    "progress": 45,
    "teamlead": "Jane Smith"
}
```

**Response (201 Created):**
```json
{
    "id": 1,
    "projectname": "Mobile App Development",
    "status": "In Progress",
    "progress": 45,
    "teamlead": "Jane Smith"
}
```

### Get All Projects (GET /api/projects)
**Response (200 OK):**
```json
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

### Update Project (PUT /api/projects/1)
**Request:**
```json
{
    "projectname": "Website Redesign",
    "status": "Completed",
    "progress": 100,
    "teamlead": "John Doe"
}
```

**Response (200 OK):** (Returns updated project object)

### Delete Project (DELETE /api/projects/1)
**Response (204 No Content)**

---

## Status Options
- **Not Started**: Project has not begun
- **In Progress**: Project is currently active
- **On Hold**: Project is paused temporarily
- **Completed**: Project is finished

---

## Error Handling

### Frontend
- Displays error messages in alerts
- Shows validation messages
- Confirms before deleting projects
- Auto-clears messages after 3 seconds

### Backend
- Returns 404 for non-existent projects
- Returns 201 for successful creation
- Returns 200 for successful read/update
- Returns 204 for successful deletion
- Validates required fields

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:4200` (Angular dev server)

To add more origins, modify the `@CrossOrigin` annotation in `ProjectController.java`:
```java
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
```

---

## Testing the CRUD Operations

### 1. Create a Project
1. Navigate to Projects page
2. Click "New Project" button
3. Fill in the form fields
4. Click "Create Project"
5. Verify in MySQL: `SELECT * FROM projects;`

### 2. Read Projects
1. Projects automatically load on component init
2. Check browser console for any errors
3. Verify data displays in table/cards

### 3. Update a Project
1. Click "Edit" on any project
2. Modify the fields
3. Click "Update Project"
4. Verify changes in MySQL

### 4. Delete a Project
1. Click "Delete" on any project
2. Confirm deletion in browser dialog
3. Verify removal from table and MySQL

---

## Troubleshooting

### Connection Issues
- **Error:** `ERR_CONNECTION_REFUSED on localhost:8080`
  - Solution: Ensure Spring Boot server is running
  - Run: `mvn spring-boot:run` in `/Applications/TaskManager`

- **Error:** `Connection refused` to MySQL
  - Solution: Ensure MySQL is running
  - Check credentials in `application.properties`

### CORS Errors
- **Error:** `Access to XMLHttpRequest blocked by CORS policy`
  - Solution: Check that backend URL matches CORS origins
  - Verify `ConfigurationService.getBackendUrl()` returns correct URL

### No Data Displaying
- **Issue:** Projects page shows "No projects found"
  - Check browser DevTools Network tab
  - Verify HTTP request returns data
  - Check MySQL database has data: `SELECT * FROM projects;`

---

## Future Enhancements

1. Add search/filter functionality
2. Add pagination for large project lists
3. Add project categories/tags
4. Add project deadline tracking
5. Add team member assignment
6. Add project attachments
7. Add activity/audit logging
8. Add project templates
9. Add advanced filtering options
10. Add export to PDF/CSV functionality

---

## Files Modified/Created

### Created Files:
- `/Users/d.soumyasri/TaskManager/src/app/project.Model.ts`
- `/Applications/TaskManager/src/main/java/com/pack/capstone/Controller/ProjectController.java`

### Modified Files:
- `/Users/d.soumyasri/TaskManager/src/app/project.service.ts`
- `/Users/d.soumyasri/TaskManager/src/app/configuration.service.ts`
- `/Users/d.soumyasri/TaskManager/src/app/projects/projects.component.ts`
- `/Users/d.soumyasri/TaskManager/src/app/projects/projects.component.html`

---

## Contact & Support

For issues or questions regarding this implementation, please refer to:
- Angular Documentation: https://angular.io/
- Spring Boot Documentation: https://spring.io/projects/spring-boot
- JPA Documentation: https://spring.io/projects/spring-data-jpa
