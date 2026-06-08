# PDS Platform

PDS Platform is a React-based transparency prototype for the Public Distribution System. It helps citizens check monthly ration entitlements, verify digital receipts, find ration shops, and raise complaints when distribution issues occur. The project also includes dealer and district-admin views to demonstrate how ration delivery, complaints, and shop performance can be monitored from different roles.

This is a prototype built for demonstration and academic/project evaluation. It uses realistic mock data and frontend services to show the complete user flow.

## Live Demo

- View the deployed application at: https://pds-platform.vercel.app/

## Judge Evaluation Guide

This project should be evaluated as a working prototype with a production-ready direction, not as a live government-integrated system. The current demo shows how the product will work once connected to official beneficiary records, authorized FPS shop datasets, SMS OTP services, and a backend database.

For quick judging, use **Login as Guest** on the Citizen login screen. Guest mode opens the citizen dashboard with a sample profile so the full user experience can be reviewed without needing a real ration card number during the demo.

Important distinction:

- **Guest Mode:** Uses a sample citizen profile only to demonstrate the user journey.
- **Real Citizen Mode:** A real user would enter ration card number and registered mobile number. The backend would verify both against the official beneficiary registry, send OTP to the registered mobile number, and then show only that citizen's allocation, receipts, complaints, diary, and assigned shop.
- **Real Shop Mode:** Shops would appear only after they are loaded from an authorized FPS dataset or approved through a verified shop registration workflow.

As the platform circulates across India and more districts, citizens, and shops join, the app becomes stronger because more verified records enter the system. More approved shops improve shop discovery, more verified citizens improve complaint accuracy, and more receipt confirmations improve transparency in ration distribution.

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

### Guest Demo Login

Use this when you do not have a ration card number during judging or presentation.

```text
Open Login page
Select Citizen
Click Login as Guest
```

Guest mode uses a sample citizen profile and is only meant to show the dashboard, allocation, receipts, complaints, and diary experience.

### Citizen Login

Use one of the registered demo ration card records:

```text
Ration Card: <your-demo-ration-card>
Phone: <your-registered-phone>
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
- Guest login is only for presentation and does not represent real identity verification.
- Staff credentials are read from environment variables for demonstration.
- OTP verification is simulated and should be replaced with a secure backend service in production.
- Shop search can use external map/search providers when API keys are configured.
- Official shop records can be loaded from `VITE_FPS_DATASET_URL` when an authorized FPS JSON dataset is available.
- The ration diary stores entries in browser local storage.
- This project is not affiliated with any government agency.

## Real Shop Data

The app must not invent ration shops. For real shop details, configure an authorized FPS dataset or a map provider.

In the final platform, a shop should become visible only after one of these conditions is met:

1. The shop exists in an authorized Food and Civil Supplies FPS dataset.
2. The shop registers on the platform using its FPS ID/license details.
3. District/admin verification confirms the shop identity, pincode, address, and operating location.
4. The shop status is marked as approved.

Recommended approval rule:

```text
Show shop publicly only when:
FPS ID is valid
Address and pincode are verified
Coordinates or map link are available
Admin approval is complete
Status is approved
```

This prevents fake shops from appearing in the public directory.

Recommended dataset format:

```json
[
  {
    "id": "fps-001",
    "fpsId": "FPS-MH-000001",
    "name": "Registered FPS Name",
    "address": "Full registered shop address",
    "pincode": "411011",
    "latitude": 18.5204,
    "longitude": 73.8567,
    "phone": "Not available",
    "mapsLink": "https://maps.google.com/..."
  }
]
```

Set the dataset URL in a local environment file:

```text
VITE_FPS_DATASET_URL=https://example.com/authorized-fps-shops.json
```

Google Places and OpenStreetMap can help discover public place records, but official PDS/FPS validation should come from an authorized Food and Civil Supplies dataset.

## Real Shop Registration Model

When a shop owner or dealer wants to use the platform, the production workflow should be:

1. Dealer submits FPS ID, license number, shop name, address, pincode, contact number, and map location.
2. Backend checks whether FPS ID/license exists in the official FPS registry or uploaded authorized dataset.
3. Admin verifies the submitted details and approves or rejects the registration.
4. Approved shops appear in Shop Finder for matching pincode searches.
5. Dealer can then update distribution activity, stock status, and beneficiary service logs through the dealer dashboard.

Until this backend approval workflow exists, the frontend should only show shops from configured real-data sources.

## OTP and Identity Verification

The frontend cannot send real OTP messages by itself. A production system needs a backend that:

1. Accepts the ration card number and mobile number.
2. Checks them against the official beneficiary registry.
3. Sends OTP using an SMS provider such as MSG91, Twilio Verify, Firebase Phone Auth, or a government SMS gateway.
4. Verifies the OTP on the backend before creating a session.

Email identity is not used in the current citizen flow. The intended identity proof is ration card plus registered mobile number, and production should optionally add Aadhaar/eKYC or official RCMS verification where legally permitted.

## How Real User Data Would Be Presented

For a real citizen, the app should never show random or shared data. After successful identity verification, the dashboard should display only records linked to that verified ration card:

- Citizen name and masked identifiers
- Ration card category such as PHH, AAY, or NPHH
- Family size and monthly entitlement
- Assigned FPS shop
- Monthly allocation status
- Digital receipts generated after distribution
- Complaints submitted by that citizen
- Complaint status and resolution timeline
- Locally stored ration diary entries

Public pages should never expose private citizen data. Public views should use masked names, FPS-level statistics, shop-level complaint counts, and aggregated transparency indicators.

## India-Wide Scaling Vision

The product is designed so it can start with one city or district and expand across India as more official data sources are connected.

Suggested rollout:

1. Start with one district using sample or authorized FPS data.
2. Add verified shop registration and district-admin approval.
3. Connect beneficiary registry and SMS OTP service for real citizen login.
4. Add state-wise FPS datasets and pincode-level shop discovery.
5. Add multilingual support for Hindi and regional languages.
6. Add complaint escalation workflows for district officers.
7. Add analytics for stock shortages, repeated complaints, and receipt mismatches.

The more verified shops and users join, the more useful the transparency layer becomes. Citizens get accurate shop and entitlement information, dealers get a structured distribution interface, and administrators get better visibility into weak points in the ration delivery chain.

## Core Workflows

### Citizen Workflow

1. Citizen enters ration card number and registered phone number.
2. The app validates the record against the demo beneficiary registry.
3. OTP verification confirms the citizen identity.
4. Citizen can view dashboard, allocation, receipts, complaints, and diary.

### Real Citizen Workflow

1. Citizen enters ration card number and registered mobile number.
2. Backend verifies the details against the official beneficiary registry.
3. OTP is sent to the registered mobile number through an SMS provider.
4. Backend verifies the OTP and creates a secure session.
5. Citizen sees only their own allocation, receipts, assigned shop, complaints, and diary.

### Complaint Workflow

1. Citizen submits a complaint with category and details.
2. Complaint is assigned a tracking number.
3. Status changes can be viewed through the complaint tracker.
4. Admin dashboard shows complaint trends and shop-level risk indicators.

### Shop Finder Workflow

1. User enters a valid pincode.
2. The system searches available shop data.
3. Shops are shown with status, distance, timings, and map links.

### Shop Approval Workflow

1. Dealer submits FPS registration details.
2. Admin verifies the FPS ID/license and shop address.
3. Approved shop is added to the searchable FPS directory.
4. Shop can update distribution activity and service information.
5. Citizens can find the shop and report issues if service quality is poor.

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
