# Liberty

E-commerce platform with admin panel and customer frontend.

## Project Structure

- `backend/` - FastAPI backend server
- `zara/` - Customer-facing React frontend
- `admin/` - Admin panel React frontend

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend (Zara)
```bash
cd zara
npm install
npm start
```

### Admin Panel
```bash
cd admin
npm install
npm start
```

## Features

- User authentication
- Product management
- Order management
- Favorites system
- Admin dashboard
- Responsive design
