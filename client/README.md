# Meridian HMS — React Frontend

A React (Vite) admin console for the Hospital Management System mock API (`hms-api`,
the json-server backend from earlier). Dark clinical theme with a warm coral accent and
a heartbeat/vitals-line motif used as a recurring signature element.

## Folder structure
```
hospital-management-system/
├── public/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── PhysicianCard.jsx
│   │   ├── PatientCard.jsx
│   │   ├── AppointmentCard.jsx
│   │   └── Loader.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Physicians.jsx
│   │   ├── AddPhysician.jsx
│   │   ├── Patients.jsx
│   │   ├── AddPatient.jsx
│   │   ├── Appointments.jsx
│   │   ├── AddAppointment.jsx
│   │   ├── Departments.jsx
│   │   ├── Nurses.jsx
│   │   └── Procedures.jsx
│   ├── services/
│   │   ├── axiosInstance.js
│   │   ├── physicianService.js
│   │   ├── patientService.js
│   │   ├── appointmentService.js
│   │   ├── departmentService.js
│   │   ├── nurseService.js
│   │   └── procedureService.js
│   ├── hooks/
│   │   ├── usePhysicians.js
│   │   ├── usePatients.js
│   │   └── useAppointments.js
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── db.json          # reference copy of the backend seed data
├── package.json
└── README.md
```

## Run it

Backend first (separate terminal, from the `hms-api` project shared earlier):
```bash
cd hms-api
npm install
npm start            # http://localhost:3000
```

Then the frontend:
```bash
cd hospital-management-system
npm install
npm run dev           # http://localhost:5173
```

The API base URL is read from `.env` (`VITE_API_BASE_URL`), defaulting to `http://localhost:3000`.

## Pages and what they hit

| Page | Route | Backend calls |
|---|---|---|
| Dashboard | `/` | All six `getAll()` services in parallel for the stat tiles + recent appointments |
| Physicians | `/physicians` | `GET /physicians` (json-server default resource route) |
| Add physician | `/physicians/add` | `POST /api/physician/post` |
| Patients | `/patients` | `GET /api/patient/` |
| Add patient | `/patients/add` | `POST /api/patient` |
| Appointments | `/appointments` | `GET /api/appointment` |
| Add appointment | `/appointments/add` | `POST /api/appointment/` |
| Departments | `/departments` | `GET /api/department/`, `POST /api/department` (inline form) |
| Nurses | `/nurses` | `GET /api/nurse/`, `POST /api/nurse` (inline form) |
| Procedures | `/procedures` | `GET /api/procedure/`, `POST /api/procedure` (inline form) |

`physicianService` and `nurseService` also expose `getByEmpId`, and `physicianService` exposes
`updatePosition` / `updateName` against the matching backend routes, ready to wire into detail/edit
views later even though no dedicated page calls them yet.

## Design notes
- Palette: deep navy/charcoal surfaces (`#0e1620` / `#131d29`) with a warm coral accent
  (`#ff6a39`), echoing the dark/orange theme already used in other portfolio work.
- Type: Space Grotesk for headings/display, Inter for body copy, JetBrains Mono for IDs,
  timestamps and the status line.
- Signature element: a thin heartbeat/vitals line (`<svg class="vitals-rule">`) above the
  footer, and the same pulse stroke reused in the loading spinner — a quiet nod to clinical
  monitoring equipment without leaning on literal medical iconography everywhere.
- All list pages handle loading, error, and empty states explicitly rather than just
  rendering blank.

## Known limitations
- Edit/update flows for position and name exist in `physicianService` but aren't yet
  exposed in the UI (no edit page was in the original spec) — happy to add an EditPhysician
  page if you want it wired up.
- Departments/Nurses/Procedures use simple inline list + add forms on one page rather than
  separate Add* pages, since only Physicians/Patients/Appointments had dedicated Add pages
  in the requested structure.
