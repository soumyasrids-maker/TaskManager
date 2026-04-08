# Teams Frontend - Quick Reference

## 📁 Files Created/Modified

### New Files
```
src/app/
├── teams.model.ts              (NEW - 20 lines)
└── teams.service.ts            (NEW - 100 lines)
```

### Modified Files
```
src/app/teams/
├── teams.component.ts          (UPDATED - 330 lines)
└── teams.component.html        (UPDATED - 240 lines)
```

---

## 🎯 Teams Model

```typescript
class Teams {
  id?: number;
  teamName: string;              // Required
  teamLead: string;              // Required
  teamMembers: string[];         // Array of names
  description?: string;
  status?: string;               // Active/Inactive/On Hold
}
```

---

## 🔧 Teams Service Methods

```typescript
// Create
createTeam(team: Teams): Observable<Teams>

// Read
getAllTeams(): Observable<Teams[]>
getTeamById(id: number): Observable<Teams>
getTeamByName(teamName: string): Observable<Teams>
getTeamByLead(teamLead: string): Observable<Teams>

// Update
updateTeam(id: number, team: Teams): Observable<Teams>

// Delete
deleteTeam(id: number): Observable<void>

// Members
addMemberToTeam(id: number, memberName: string): Observable<Teams>
removeMemberFromTeam(id: number, memberName: string): Observable<Teams>
```

---

## 💻 Component Methods

### Data Loading
```typescript
loadAllTeams(): void          // Fetch all teams from backend
```

### CRUD Operations
```typescript
createTeam(): void            // Create new team
updateTeam(): void            // Update existing team
deleteTeam(id, name): void    // Delete team
editTeam(id): void            // Populate form for editing
```

### Member Management
```typescript
addMemberToTeam(name): void       // Add to form array
removeMemberFromTeam(index): void // Remove from form array
```

### Search & Filter
```typescript
searchTeams(): void           // Filter teams locally
```

### Form Management
```typescript
toggleAddForm(): void         // Show/hide add form
toggleEditForm(): void        // Show/hide edit form
cancelForm(): void            // Reset and close form
resetForm(): void             // Clear form data
validateTeamForm(): boolean   // Check required fields
```

### Pagination
```typescript
getPaginatedTeams(): Teams[]  // Get current page teams
getTotalPages(): number       // Calculate total pages
nextPage(): void              // Go to next page
previousPage(): void          // Go to previous page
```

---

## 🎨 Template Features

### Form Sections
- Team Name (required)
- Team Lead (required)
- Description (textarea)
- Status (dropdown)
- Team Members (add/remove)

### Data Display
- Team cards in grid layout
- Member count and list
- Status badge
- Edit/Delete buttons

### User Feedback
- Success message alert
- Error message alert
- Loading spinner
- Form validation errors
- Empty state message

### Interactions
- Create new team button
- Edit button on each card
- Delete button with confirmation
- Search/filter input
- Pagination controls

---

## 🔌 Dependency Injection

```typescript
constructor(private teamsService: TeamsService) { }
```

The `TeamsService` is injected and provides:
- HttpClient for REST calls
- ConfigurationService for backend URL
- All 9 service methods

---

## 🌐 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/teams | Create |
| GET | /api/teams | Get all |
| GET | /api/teams/{id} | Get by ID |
| GET | /api/teams/search/name/{name} | Search by name |
| GET | /api/teams/search/lead/{lead} | Search by lead |
| PUT | /api/teams/{id} | Update |
| DELETE | /api/teams/{id} | Delete |
| POST | /api/teams/{id}/members | Add member |
| DELETE | /api/teams/{id}/members/{name} | Remove member |

---

## 📊 Component Properties

```typescript
teams: Teams[]                  // All teams
filteredTeams: Teams[]         // Filtered teams
newTeam: Teams                 // Form data
editingTeamId: number | null   // Edit ID
isEditMode: boolean            // Edit flag
showAddForm: boolean           // Add form visible
showEditForm: boolean          // Edit form visible
searchQuery: string            // Search text
successMessage: string         // Success alert
errorMessage: string           // Error alert
isLoading: boolean             // Loading state
pageSize: number               // 6 per page
currentPage: number            // Current page
```

---

## ✨ Key Features

✅ Full CRUD operations  
✅ Team member management  
✅ Real-time search filtering  
✅ Form validation  
✅ Success/error notifications  
✅ Loading indicators  
✅ Pagination (6 per page)  
✅ Responsive grid layout  
✅ Edit form population  
✅ Delete confirmation  
✅ Form reset on cancel  
✅ HttpClient integration  
✅ Service injection  
✅ Observable streams  
✅ Error status code handling  

---

## 🧪 Testing Checklist

- [ ] Load all teams on page init
- [ ] Create team with all fields
- [ ] Create team with duplicate name (409 error)
- [ ] Show validation errors
- [ ] Get teams paginated (6 per page)
- [ ] Search teams by name
- [ ] Search teams by lead
- [ ] Search teams by member
- [ ] Edit team details
- [ ] Update team and refresh display
- [ ] Add member to form
- [ ] Remove member from form
- [ ] Delete team with confirmation
- [ ] Cancel delete operation
- [ ] Cancel add/edit form
- [ ] Reset form on submit
- [ ] Show success message
- [ ] Show error message
- [ ] Navigate pages
- [ ] Pagination disabled at boundaries

---

## 📝 Example Usage

### Get All Teams
```typescript
this.teamsService.getAllTeams().subscribe(
  (teams: Teams[]) => {
    this.teams = teams;
    this.filteredTeams = teams;
  },
  (error) => {
    this.errorMessage = 'Failed to load teams';
  }
);
```

### Create Team
```typescript
const newTeam = new Teams('Backend', 'John', ['Alice', 'Bob']);
this.teamsService.createTeam(newTeam).subscribe(
  (response: Teams) => {
    this.teams.push(response);
    this.successMessage = 'Team created!';
  },
  (error) => {
    if (error.status === 409) {
      this.errorMessage = 'Team already exists';
    }
  }
);
```

### Update Team
```typescript
this.teamsService.updateTeam(1, updatedTeam).subscribe(
  (response: Teams) => {
    const index = this.teams.findIndex(t => t.id === 1);
    this.teams[index] = response;
    this.successMessage = 'Team updated!';
  }
);
```

### Delete Team
```typescript
this.teamsService.deleteTeam(1).subscribe(
  () => {
    this.teams = this.teams.filter(t => t.id !== 1);
    this.successMessage = 'Team deleted!';
  }
);
```

---

## 🔄 Service vs Component

### Service Responsibilities
- HTTP calls to backend
- Observable streams
- URL construction
- Error handling at HTTP level

### Component Responsibilities
- Load data on init
- Display data in template
- Handle user interactions
- Form validation
- Local data filtering
- User feedback (success/error messages)
- State management

---

## 📊 Data Flow

```
User Action
    ↓
Component Method
    ↓
Service Method
    ↓
HTTP Request
    ↓
Backend API
    ↓
Observable Response
    ↓
Component Subscribe
    ↓
Update Local Data
    ↓
Template Update
    ↓
User Sees Change
```

---

## ✅ Implementation Status

- [x] Teams model created
- [x] Teams service created
- [x] Service injected in component
- [x] All 9 service methods available
- [x] Component loads teams on init
- [x] Create operation with validation
- [x] Read operations with pagination
- [x] Update operation with edit form
- [x] Delete operation with confirmation
- [x] Search/filter functionality
- [x] Member management
- [x] Error handling
- [x] Success messages
- [x] Loading indicators
- [x] Responsive template
- [x] Form state management

**Status**: ✅ COMPLETE and READY FOR TESTING

---

## 📞 Quick Support

**Component not loading data?**
→ Check `ngOnInit()` calls `loadAllTeams()`

**Service not found?**
→ Ensure both `teams.service.ts` and `teams.model.ts` are in `/src/app/`

**API not responding?**
→ Verify backend is running on correct port
→ Check `ConfigurationService.getBackendUrl()`
→ Check CORS configuration allows `http://localhost:4200`

**Validation not showing?**
→ Set `showValidationErrors = true` when form submitted
→ Check template has `[class.is-invalid]` binding

**Pagination not working?**
→ Verify `pageSize = 6` and `currentPage = 1`
→ Check `getPaginatedTeams()` is called in *ngFor
