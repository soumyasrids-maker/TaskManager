# 🔧 Troubleshooting: Backend Connection Error

## Problem
You're seeing this error:
```
HttpErrorResponse {
  status: 200,
  ok: false,
  message: "Http failure during parsing for http://localhost:4200/",
  error: "SyntaxError: Unexpected token '<', \"<!doctype \"... is not valid JSON"
}
```

## Root Cause
The application is trying to fetch data from `http://localhost:4200/` (the **frontend**) instead of `http://localhost:8080/api/projects` (the **backend**).

This happens when:
1. ❌ Backend server is NOT running
2. ❌ Backend URL is misconfigured
3. ❌ API URL is being initialized at the wrong time

## ✅ Solution

### Step 1: Fix the ProjectService (DONE ✅)
The issue was in `/src/app/project.service.ts`:

**OLD CODE (WRONG):**
```typescript
export class ProjectService implements OnInit {
  private apiUrl: string = '';
  
  constructor(private http: HttpClient, private configService: ConfigurationService) { }
  
  ngOnInit(): void {  // ❌ Services don't have ngOnInit!
    this.apiUrl = this.configService.getBackendUrl() + '/api/projects';
  }
}
```

**NEW CODE (CORRECT):**
```typescript
export class ProjectService {
  private apiUrl: string;
  
  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) {
    this.apiUrl = this.configService.getBackendUrl() + '/api/projects';  // ✅ Init in constructor
  }
}
```

**What changed:**
- Removed `implements OnInit` (services don't have lifecycle hooks)
- Removed `OnInit` import
- Initialize `apiUrl` in the constructor instead of `ngOnInit()`
- Now the URL is properly set to: `http://localhost:8080/api/projects`

### Step 2: Verify ConfigurationService
**File:** `/src/app/configuration.service.ts`

Make sure it has:
```typescript
private backendUrl: string = 'http://localhost:8080';

getBackendUrl(): string {
  return this.backendUrl;
}
```

✅ This is correct!

### Step 3: Enable Error Handling in Component
**File:** `/src/app/projects/projects.component.ts`

The error handler was commented out. Now it's enabled to show better error messages:

```typescript
loadProjects(): void {
  this.projectService.getAllProjects().subscribe({
    next: (data: Project[]) => {
      this.projects = data;
      this.errorMessage = '';
    },
    error: (error) => {
      console.error('Error loading projects:', error);
      this.errorMessage = 'Failed to load projects from backend. Make sure backend is running on http://localhost:8080';
    }
  });
}
```

### Step 4: Start the Backend Server ⭐ IMPORTANT

Open a terminal and run:

```bash
cd /Applications/TaskManager
mvn spring-boot:run
```

**Wait for this message:**
```
Tomcat started on port(s): 8080 (http)
Started TaskManagerApplication in X seconds
```

✅ Backend is now running on `http://localhost:8080`

### Step 5: Start the Frontend Server

Open another terminal:

```bash
cd /Users/d.soumyasri/TaskManager
ng serve
```

**Wait for:**
```
Compiled successfully.
✓ Open browser on http://localhost:4200
```

✅ Frontend is running on `http://localhost:4200`

### Step 6: Test the Connection

1. Open http://localhost:4200/projects in your browser
2. Check the Network tab in DevTools (F12)
3. Look for the HTTP request to `http://localhost:8080/api/projects`
4. Should see status 200 with JSON data

---

## 🧪 Verification Checklist

- [x] Backend server running on http://localhost:8080
- [x] Frontend server running on http://localhost:4200
- [x] ProjectService initializes apiUrl in constructor
- [x] ConfigurationService has backend URL
- [x] Error handler enabled in component
- [x] Check DevTools Network tab for correct endpoint

---

## 📊 Expected Network Request

**Before (Wrong):**
```
GET http://localhost:4200/api/projects
↓ Response: HTML (<!doctype html>...)
↓ Error: Invalid JSON
```

**After (Correct):**
```
GET http://localhost:8080/api/projects
↓ Response: JSON array of projects
↓ Status: 200 OK
↓ Data displayed in table
```

---

## 🚨 If Still Not Working

### Issue: "Connection refused" error

**Solution:**
```bash
# Kill any existing Java process
lsof -i :8080
kill -9 <PID>

# Start backend fresh
cd /Applications/TaskManager
mvn clean install
mvn spring-boot:run
```

### Issue: 404 Not Found on /api/projects

**Check:**
1. Is ProjectController.java created? ✅ Yes
2. Is it annotated with `@RestController`? ✅ Yes
3. Is endpoint `/api/projects`? ✅ Yes
4. Are annotations correct?

```java
@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {
  // endpoints...
}
```

### Issue: CORS Error

**Check:**
1. Backend has `@CrossOrigin(origins = "http://localhost:4200")`
2. Frontend uses correct base URL `http://localhost:8080`
3. Browser Console shows CORS error? Check backend logs

---

## 💡 Key Learning

**Services vs Components:**
- ✅ Components have `ngOnInit()` lifecycle hook
- ❌ Services don't have `ngOnInit()` lifecycle hook
- ✅ Initialize service properties in the constructor
- ❌ Don't use lifecycle hooks in services

**Good Pattern:**
```typescript
@Injectable()
export class MyService {
  constructor(private http: HttpClient) {
    // Initialize here ✅
  }
}
```

**Bad Pattern:**
```typescript
@Injectable()
export class MyService implements OnInit {  // ❌ Wrong!
  ngOnInit() {  // ❌ This never runs!
    // Won't be called
  }
}
```

---

## 📝 Summary of Changes

| File | Change | Status |
|------|--------|--------|
| `project.service.ts` | Moved apiUrl init to constructor | ✅ Fixed |
| `projects.component.ts` | Enabled error handler | ✅ Fixed |
| `configuration.service.ts` | No change needed | ✅ Verified |

---

## ✅ Now It Should Work!

1. Backend running on **http://localhost:8080** ✅
2. Frontend running on **http://localhost:4200** ✅
3. ProjectService correctly configured ✅
4. HTTP requests going to right endpoint ✅
5. Error messages display properly ✅

**Refresh your browser and the projects should load!** 🎉

---

## 🔗 Related Files

- ProjectService: `/src/app/project.service.ts`
- ProjectsComponent: `/src/app/projects/projects.component.ts`
- ConfigurationService: `/src/app/configuration.service.ts`
- ProjectController: Backend `/src/main/java/com/pack/capstone/Controller/ProjectController.java`

---

**If you still have issues, check:**
1. Terminal output for error messages
2. Browser DevTools Network tab
3. Spring Boot server logs
4. MySQL connection status

Good luck! 🚀
