# Ride Sharing Application

A full-stack ride-sharing platform built with Django REST Framework backend and React Native frontend.

## 📋 Tech Stack

### Backend
- **Framework**: Django 3.2+
- **API**: Django REST Framework
- **Database**: SQLite (development)
- **Authentication**: JWT (Token-based)

### Frontend
- **Framework**: React Native (Expo)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: React Native built-in components

## 📁 Project Structure

```
ride_Sharing_project/
├── ride_sharing_backend/          # Django backend
│   ├── core/                      # Main app
│   │   ├── models.py             # User, Token models
│   │   ├── views.py              # API endpoints
│   │   ├── serializers.py        # DRF serializers
│   │   ├── urls.py               # API routes
│   │   └── migrations/           # Database migrations
│   ├── ride_share_backend/       # Project settings
│   ├── manage.py
│   ├── db.sqlite3
│   └── requirements.txt
│
└── RideShareApp/                  # React Native frontend
    ├── src/
    │   ├── components/           # Reusable components (Input, Button, Card, etc.)
    │   ├── screens/              # App screens (LoginScreen, HomeScreen, etc.)
    │   ├── services/             # API service (axios setup)
    │   ├── context/              # AuthContext for state management
    │   ├── constants/            # Config, colors, typography, spacing
    │   └── navigation/           # Navigation setup
    ├── App.js
    ├── package.json
    └── requirements.txt
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn
- Android Emulator or iOS Simulator (or physical device)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd ride_sharing_backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start development server:**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd RideShareApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API URL in config** (if needed):
   Edit `src/constants/config.js`:
   - For **emulator**: Set `PHYSICAL_DEVICE_HOST = null`
   - For **physical device**: Set `PHYSICAL_DEVICE_HOST = '<your-computer-ip>'`

4. **Start development server:**
   ```bash
   npm start
   ```

5. **Run on device/emulator:**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app for physical device

## 📱 Features

### User Management
- ✅ User Registration & Login
- ✅ JWT Token-based Authentication
- ✅ Profile Management (name, email, phone, address, bio)
- ✅ NID Card Upload
- ✅ Profile Picture Upload

### Ride Token System
- ✅ Generate ride tokens with details
- ✅ View available tokens
- ✅ Edit token information
- ✅ Token countdown timer
- ✅ Nearby tokens discovery

### Ride Requests
- ✅ Send ride requests
- ✅ View pending requests
- ✅ Accept/Reject requests
- ✅ Connection management

## 🔌 API Endpoints

### Authentication
- `POST /api/register/` - Register new user
- `POST /api/login/` - Login user
- `POST /api/token/refresh/` - Refresh access token

### User
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update profile
- `POST /api/profile/nid/` - Upload NID
- `POST /api/profile/picture/` - Upload profile picture

### Ride Token
- `POST /api/token/` - Create new token
- `GET /api/token/` - Get user's token
- `PUT /api/token/` - Update token
- `DELETE /api/token/` - Delete token
- `GET /api/tokens/nearby/` - Get nearby tokens

### Requests
- `POST /api/request/` - Create ride request
- `GET /api/requests/` - Get user's requests
- `PUT /api/request/<id>/` - Update request status
- `GET /api/received-requests/` - Get incoming requests

## 🐛 Troubleshooting

### Network Error
**Problem**: App can't connect to backend
**Solution**:
1. Ensure backend is running: `python manage.py runserver 0.0.0.0:8000`
2. Check firewall allows port 8000
3. Verify device is on same network
4. Update `PHYSICAL_DEVICE_HOST` in `src/constants/config.js` with your computer's IP

### Multiline Input Issue
**Problem**: "property multiline does not exist"
**Solution**: This has been fixed in the latest Input.js component

### 401 Unauthorized
**Problem**: Token expired
**Solution**: App automatically refreshes tokens. Clear app data if issue persists:
```bash
npm start -- --clear
```

## 📦 Dependencies

### Backend
See `ride_sharing_backend/requirements.txt`

### Frontend
See `RideShareApp/package.json`

## 🔐 Security Notes
- Tokens are stored in AsyncStorage (consider upgrading to secure storage)
- API uses HTTPS in production (update config.js)
- CSRF protection enabled on backend
- Password hashing with Django's default hasher

## 📝 Development Notes
- API base URL configured in `src/constants/config.js`
- Styling constants in `src/constants/` (colors, spacing, typography)
- All API calls go through `src/services/api.js` with token injection
- Context API for auth state in `src/context/AuthContext.js`

## 🤝 Contributing
1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open Pull Request

## 📄 License
This project is licensed under the MIT License

## 📧 Contact
For questions or issues, please create an issue in the repository.
