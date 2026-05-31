# PDS Platform

PDS Platform is a React-based transparency prototype for the Public Distribution System. It helps citizens check monthly ration entitlements, verify digital receipts, find ration shops, and raise complaints when distribution issues occur. The project also includes dealer and district-admin views to demonstrate how ration delivery, complaints, and shop performance can be monitored from different roles.

This is a prototype built for demonstration and academic/project evaluation. It uses realistic mock data and frontend services to show the complete user flow.

## Key Features

- Citizen login using ration card number, registered phone number, and OTP verification
- Monthly ration allocation view based on card category and family size
- Digital receipt and QR verification flow
- Ration diary for locally tracking household ration usage
- Shop finder with pincode-based search and map links
- Complaint submission and tracking for issues such as overcharging, denial of service, and stock diversion
- Dealer dashboard for distribution and beneficiary management
- District admin dashboard for shop performance, complaints, and audit visibility
- Public data source and transparency pages

## User Roles

### Citizen

Citizens can verify their identity, view allocation details, check receipts, track complaints, and maintain a personal ration diary.

### Dealer

Dealers can view assigned beneficiaries, distribution status, and ration delivery activity for their shop.

### Admin

Admins can monitor district-level shop performance, complaint trends, and audit records.

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React icons
- Recharts
- ESLint

## Project Structure

```text
src/
  components/
    common/          Shared UI components
    dealer/          Dealer-specific components
  config/            Platform configuration
  constants/         Demo data, roles, statuses, and entitlement rules
  context/           Authentication context and verification state
  pages/
    admin/           Admin dashboards
    citizen/         Citizen dashboard, allocation, receipts, diary
    dealer/          Dealer dashboard
    public/          Public pages such as shop finder and complaints
  routes/            Application routes
  services/          OTP, shop, complaint, receipt, and data-source services
```

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### Installation

```powershell
cd C:\Users\lenovo\Desktop\PDS\pds-platform
npm.cmd install
```

### Run Development Server

```powershell
npm.cmd run dev
```

Open the local URL shown in the terminal. Vite usually runs at:

```text
http://localhost:5173/
```

### Build Project

```powershell
npm.cmd run build
```

### Run Lint

```powershell
npm.cmd run lint
```

## Demo Login Details

### Citizen Login

Use one of the registered demo ration card records:

```text
Ration Card: MH-2024-00123
Phone: 9876543210
```

The OTP is shown in the interface for demo purposes.

### Dealer Login

```text
Username: configured in VITE_DEALER_USERNAME
Password: configured in VITE_DEALER_PASSWORD
```

### Admin Login

```text
Username: configured in VITE_ADMIN_USERNAME
Password: configured in VITE_ADMIN_PASSWORD
```

Create a local environment file from `.env.example` and set demo staff credentials before using dealer or admin login.

## Important Demo Notes

- The project currently uses mock data stored in the frontend.
- Staff credentials are read from environment variables for demonstration.
- OTP verification is simulated and should be replaced with a secure backend service in production.
- Shop search can use external map/search providers when API keys are configured.
- The ration diary stores entries in browser local storage.
- This project is not affiliated with any government agency.

## Core Workflows

### Citizen Workflow

1. Citizen enters ration card number and registered phone number.
2. The app validates the record against the demo beneficiary registry.
3. OTP verification confirms the citizen identity.
4. Citizen can view dashboard, allocation, receipts, complaints, and diary.

### Complaint Workflow

1. Citizen submits a complaint with category and details.
2. Complaint is assigned a tracking number.
3. Status changes can be viewed through the complaint tracker.
4. Admin dashboard shows complaint trends and shop-level risk indicators.

### Shop Finder Workflow

1. User enters a valid pincode.
2. The system searches available shop data.
3. Shops are shown with status, distance, timings, and map links.

## Current Status

The application currently passes linting and production build checks:

```powershell
npm.cmd run lint
npm.cmd run build
```

## Future Improvements

- Add a real backend with database persistence
- Replace mock OTP with SMS gateway integration
- Move dealer and admin authentication to secure backend APIs
- Add role-based API authorization
- Add multilingual support for Hindi and regional languages
- Add offline complaint drafts and sync support
- Improve accessibility testing for keyboard and screen-reader users
- Add automated unit and integration tests

## License

This project is intended for educational and demonstration use.
