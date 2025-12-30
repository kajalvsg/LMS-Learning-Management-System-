# How to Run the LMS Application

## PowerShell Commands (Windows)

### Step 1: Install All Dependencies

```powershell
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Set Up Environment Variables

**Create `server/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lms
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=lms_analytics
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

**Create `client/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Run the Application

**Option A: Run both server and client together (recommended)**
```powershell
npm run dev
```

**Option B: Run separately in different terminals**

Terminal 1 (Backend):
```powershell
cd server
npm run dev
```

Terminal 2 (Frontend):
```powershell
cd client
npm start
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Troubleshooting

If you see TypeScript errors in your IDE:
1. Restart TypeScript Server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
2. Make sure all dependencies are installed
3. Check that MongoDB and PostgreSQL are running

