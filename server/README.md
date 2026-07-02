# Hospital Management System — Mock REST API (json-server)

A lightweight mock backend built on **json-server** + **Express**, covering 16 of the endpoints
from the Hospital Management System spec, with a Jest + Supertest unit test suite.

## Stack
- `json-server` — file-backed mock database (`db.json`, seeded from `insert_data.sql`)
- `express` (via json-server) — custom routes layered on top to match the exact spec paths/methods
- `jest` + `supertest` — unit tests (29 tests, isolated per-test DB copy so nothing mutates `db.json`)

## Setup
```bash
npm install
npm start          # runs on http://localhost:3000
npm test           # runs the Jest/Supertest suite
```

## Endpoints covered (16)

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | POST | `/api/physician/post` | Add a new Physician |
| 2 | GET | `/api/department/` | List all Departments |
| 3 | PUT | `/update/position/:position/:employeeId` | Update a Physician's Position |
| 4 | POST | `/api/patient` | Add a Patient report |
| 5 | GET | `/api/patient/` | List all Patients |
| 6 | POST | `/api/nurse` | Add a Nurse |
| 7 | GET | `/api/nurse/` | List all Nurses |
| 8 | GET | `/api/physician/empid/:empid` | Get Physician by EmployeeID |
| 9 | PUT | `/api/physician/update/name/:empid` | Update a Physician's Name |
| 10 | POST | `/api/department` | Add a new Department |
| 11 | GET | `/api/department/:deptid` | Get Department by DepartmentID |
| 12 | POST | `/api/appointment/` | Add an Appointment |
| 13 | GET | `/api/appointment` | List all Appointments |
| 14 | POST | `/api/procedure` | Add a Procedure (treatment) |
| 15 | GET | `/api/procedure/` | List all Procedures |
| 16 | GET | `/api/nurse/empid/:empid` | Get Nurse by EmployeeID |

All other resources (medications, affiliated_with, trained_in) are still reachable via json-server's
default REST routes (e.g. `GET /medications`) since the full `db.json` is mounted as a fallback router.

Validation errors return **400** with `{ timeStamp, message }`. Missing records return **404** with
the same shape, matching the format shown in the spec doc (e.g. the `"Validation failed"` example).

## Project structure
```
hms-api/
├── db.json              # seed data (converted from insert_data.sql)
├── server.js             # createApp() factory + custom routes + json-server fallback
├── package.json
└── tests/
    ├── api.test.js        # 29 Jest/Supertest tests across all 16 endpoints
    └── setupTestDb.js     # copies db.json -> db.test.json per test run, cleans up after
```

## Notes for your Sprint planning
- This mock layer lets the frontend/Postman work start immediately without waiting on the real
  Spring Boot/DB build — same JSON shapes as `Physician`, `Department`, `Patient`, `Nurse`,
  `Appointment`, `Procedure` from the ER diagram.
- Once the real backend is ready, swapping the base URL is the only change needed since paths match
  the spec doc's endpoint table.
- Easy to extend: pick more rows from the endpoint table and add a `server.METHOD(...)` block the
  same way as the 16 above, each with its own test block.
