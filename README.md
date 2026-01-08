# Contact Manager

A modern contact management application with authentication, built with React and Express.

## Features

- ✅ **Authentication System** - JWT-based login/register
- ✅ **Role-Based Access Control** - Admin and Viewer roles
- ✅ **Contact Management** - Full CRUD operations
- ✅ **Bulk Actions** - Select multiple contacts, delete, or export to CSV
- ✅ **Real-time Notifications** - Toast notifications and notification center
- ✅ **Search & Filter** - Find contacts quickly
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Premium UI** - Modern, clean interface with Tailwind CSS

## Tech Stack

### Frontend

- React 18
- React Router v6
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React Icons

### Backend

- Node.js + Express
- SQLite3
- JWT (jsonwebtoken)
- bcryptjs
- CORS

## Project Structure

```
stitch_import_contacts_modal/
├── backend/                 # Express API server
│   ├── middleware/         # Auth & role check middleware
│   ├── server.js          # Main server file
│   ├── .env.example       # Environment variables template
│   └── package.json
│
└── contact-manager/        # React frontend
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── context/       # React Context (Auth, Notifications)
    │   ├── pages/         # Page components
    │   ├── services/      # API service
    │   └── App.js
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd stitch_import_contacts_modal
   ```

2. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Setup Backend Environment**

   ```bash
   cp .env.example .env
   # Edit .env and change JWT_SECRET to a secure random string
   ```

4. **Install Frontend Dependencies**

   ```bash
   cd ../contact-manager
   npm install
   ```

5. **Setup Frontend Environment** (Optional)

   ```bash
   cp .env.example .env
   # Default API URL is http://localhost:5000/api
   ```

### Running Locally

You need **2 terminal windows**:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd contact-manager
npm start
```

Frontend will open on `http://localhost:3000`

### Default Admin Account

```
Email: admin@example.com
Password: admin123
```

## API Endpoints

### Authentication

```
POST   /api/auth/register  - Register new user
POST   /api/auth/login     - Login
GET    /api/auth/me        - Get current user (protected)
```

### Contacts

```
GET    /api/contacts       - Get all contacts
GET    /api/contacts/:id   - Get single contact
POST   /api/contacts       - Create contact (Admin only)
PUT    /api/contacts/:id   - Update contact (Admin only)
DELETE /api/contacts/:id   - Delete contact (Admin only)
```

## Deployment

### Option 1: Separate Deployment (Recommended)

**Backend → Railway/Render:**

1. Push code to GitHub
2. Connect Railway/Render to your repo
3. Set environment variables (JWT_SECRET, etc.)
4. Deploy

**Frontend → Vercel:**

1. Update `REACT_APP_API_URL` in `.env` to your backend URL
2. Deploy to Vercel
3. Done!

### Option 2: Change Database

Replace SQLite with PostgreSQL/MySQL for production:

- Update `server.js` to use `pg` or `mysql2`
- Update connection string
- Deploy both to Vercel

## Environment Variables

### Backend (.env)

```env
PORT=5000
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## User Roles

- **Admin** - Full CRUD access to contacts
- **Viewer** - Read-only access

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Role-based access control
- ✅ SQL injection prevention (parameterized queries)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using React and Express**
