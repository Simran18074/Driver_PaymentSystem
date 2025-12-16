# Driver Payment System

A comprehensive web application for managing driver payments, tracking trips, and handling settlements (Batta & Salary).

## 🚀 Features

-   **Dashboard**: Real-time overview of total drivers, trips, pending payments, and recent activity.
-   **Driver Management**: Register and manage drivers with vehicle details and payment preferences (Batta/Salary/Both).
-   **Trip Logging**: Log trips with pickup/drop locations and calculate payments automatically based on driver preferences.
-   **Settlements**:
    -   **Weekly (Batta)**: Track and settle daily allowances.
    -   **Monthly (Salary)**: Manage monthly salary payments.
-   **Payment History**: View a complete history of all settled payments with filtering capabilities.
-   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Lucide React (Icons), React Hot Toast (Notifications).
-   **Backend**: Node.js, Express.js.
-   **Database**: Supabase (PostgreSQL).

## 📂 Project Structure

```
driver-payment-system/
├── backend/                 # Node.js/Express Backend
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # API Controllers
│   │   ├── routes/          # API Routes
│   │   └── services/        # Business Logic & Data Access
│   ├── server.js            # Entry point
│   └── .env                 # Backend Environment Variables
│
└── frontend/                # React Frontend
    ├── src/
    │   ├── api/             # API Client (Axios)
    │   ├── components/      # Reusable Components (Sidebar, etc.)
    │   ├── pages/           # Application Pages
    │   └── App.jsx          # Main App Component
    └── .env                 # Frontend Environment Variables
```

## ⚙️ Setup Instructions

### Prerequisites
-   Node.js installed.
-   Supabase account and project set up.

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with your Supabase credentials:
    ```env
    SUPABASE_URL=your_supabase_project_url
    SUPABASE_KEY=your_supabase_anon_key
    PORT=3000
    ```
4.  Start the server:
    ```bash
    npm start
    # or for development
    npm run dev
    ```

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and visit `http://localhost:5173`.

## 📱 Usage

1.  **Add Drivers**: Go to the "Drivers" page and register new drivers.
2.  **Log Trips**: Use the "Trips" page to record daily trips. The system will automatically calculate amounts based on the driver's payment preference.
3.  **Settle Payments**: Go to "Settlements" to view pending amounts. Click "Settle" to mark them as paid.
4.  **View History**: Check the "History" page for a log of all past payments.

## 📄 License

This project is open-source and available under the MIT License.
