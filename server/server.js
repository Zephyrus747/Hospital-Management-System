const path = require("path");
const jsonServer = require("json-server");

function createApp(dbFile = path.join(__dirname, "db.json")) {
  const server = jsonServer.create();
  const router = jsonServer.router(dbFile);
  const middlewares = jsonServer.defaults({ logger: false });

  server.use(middlewares);
  server.use(jsonServer.bodyParser);

  const db = router.db; // lowdb instance - source of truth for our custom routes

  const notFound = (res, entity) =>
    res.status(404).json({
      timeStamp: new Date().toISOString(),
      message: `${entity} not found`,
    });

  const badRequest = (res, message = "Validation failed") =>
    res.status(400).json({ timeStamp: new Date().toISOString(), message });

  // 1. Adds a new Physician
  // POST /api/physician/post

  server.post("/api/physician/post", (req, res) => {
    const { EmployeeID, Name, Position, SSN } = req.body || {};
    if (!EmployeeID || !Name || !Position || !SSN) {
      return badRequest(res, "EmployeeID, Name, Position and SSN are required");
    }
    if (db.get("physicians").find({ EmployeeID }).value()) {
      return badRequest(res, "Physician with this EmployeeID already exists");
    }
    db.get("physicians").push({ EmployeeID, Name, Position, SSN }).write();
    return res.status(201).json({ message: "Record Created Successfully" });
  });

  // ---------------------------------------------------------------------
  // 8. Search Physician By EmpId
  // GET /api/physician/empid/:empid
  // ---------------------------------------------------------------------
  server.get("/api/physician/empid/:empid", (req, res) => {
    const physician = db
      .get("physicians")
      .find({ EmployeeID: Number(req.params.empid) })
      .value();
    if (!physician) return notFound(res, "Physician");
    return res.status(200).json(physician);
  });

  // ---------------------------------------------------------------------
  // 3. Update Position Of Physician
  // PUT /update/position/:position/:employeeId
  // ---------------------------------------------------------------------
  server.put("/update/position/:position/:employeeId", (req, res) => {
    const employeeId = Number(req.params.employeeId);
    const { position } = req.params;
    if (!position || position.trim() === "") return badRequest(res);
    const physician = db.get("physicians").find({ EmployeeID: employeeId });
    if (!physician.value()) return notFound(res, "Physician");
    physician.assign({ Position: position }).write();
    return res.status(200).json(physician.value());
  });

  // ---------------------------------------------------------------------
  // 9. Update Name of Physician
  // PUT /api/physician/update/name/:empid
  // ---------------------------------------------------------------------
  server.put("/api/physician/update/name/:empid", (req, res) => {
    const empid = Number(req.params.empid);
    const { Name } = req.body || {};
    if (!Name || Name.trim() === "") return badRequest(res, "Name is required");
    const physician = db.get("physicians").find({ EmployeeID: empid });
    if (!physician.value()) return notFound(res, "Physician");
    physician.assign({ Name }).write();
    return res.status(200).json(physician.value());
  });

  // ---------------------------------------------------------------------
  // 10. Add new Department
  // POST /api/department
  // ---------------------------------------------------------------------
  server.post("/api/department", (req, res) => {
    const { DepartmentID, Name, Head } = req.body || {};
    if (!DepartmentID || !Name || !Head)
      return badRequest(res, "DepartmentID, Name and Head are required");
    if (!db.get("physicians").find({ EmployeeID: Head }).value()) {
      return badRequest(res, "Head must reference an existing Physician");
    }
    if (db.get("departments").find({ DepartmentID }).value()) {
      return badRequest(
        res,
        "Department with this DepartmentID already exists",
      );
    }
    db.get("departments").push({ DepartmentID, Name, Head }).write();
    return res.status(201).json({ message: "Record Created Successfully" });
  });

  // ---------------------------------------------------------------------
  // 2. Get the list of department
  // GET /api/department/
  // ---------------------------------------------------------------------
  server.get("/api/department/", (req, res) => {
    return res.status(200).json(db.get("departments").value());
  });

  // ---------------------------------------------------------------------
  // 11. Search the department detail by dept Id
  // GET /api/department/:deptid
  // ---------------------------------------------------------------------
  server.get("/api/department/:deptid", (req, res) => {
    const department = db
      .get("departments")
      .find({ DepartmentID: Number(req.params.deptid) })
      .value();
    if (!department) return notFound(res, "Department");
    return res.status(200).json(department);
  });

  // ---------------------------------------------------------------------
  // 4. Add a patient report to the DB
  // POST /api/patient
  // ---------------------------------------------------------------------
  server.post("/api/patient", (req, res) => {
    const { SSN, Name, Address, Phone, InsuranceID, PCP } = req.body || {};
    if (!SSN || !Name || !Address || !Phone || !InsuranceID || !PCP) {
      return badRequest(
        res,
        "SSN, Name, Address, Phone, InsuranceID and PCP are required",
      );
    }
    if (!db.get("physicians").find({ EmployeeID: PCP }).value()) {
      return badRequest(res, "PCP must reference an existing Physician");
    }
    if (db.get("patients").find({ SSN }).value()) {
      return badRequest(res, "Patient with this SSN already exists");
    }
    db.get("patients")
      .push({ SSN, Name, Address, Phone, InsuranceID, PCP })
      .write();
    return res.status(201).json({ message: "Record Created Successfully" });
  });

  // ---------------------------------------------------------------------
  // 5. Get a list of Patient
  // GET /api/patient/
  // ---------------------------------------------------------------------
  server.get("/api/patient/", (req, res) => {
    return res.status(200).json(db.get("patients").value());
  });

  // ---------------------------------------------------------------------
  // 6. Add a nurse detail to DB
  // POST /api/nurse
  // ---------------------------------------------------------------------
  server.post("/api/nurse", (req, res) => {
    const { EmployeeID, Name, Position, Registered, SSN } = req.body || {};
    if (!EmployeeID || !Name || !Position || Registered === undefined || !SSN) {
      return badRequest(
        res,
        "EmployeeID, Name, Position, Registered and SSN are required",
      );
    }
    if (db.get("nurses").find({ EmployeeID }).value()) {
      return badRequest(res, "Nurse with this EmployeeID already exists");
    }
    db.get("nurses")
      .push({ EmployeeID, Name, Position, Registered, SSN })
      .write();
    return res.status(201).json({ message: "Record Created Successfully" });
  });

  // ---------------------------------------------------------------------
  // 7. Get a list of nurse
  // GET /api/nurse/
  // ---------------------------------------------------------------------
  server.get("/api/nurse/", (req, res) => {
    return res.status(200).json(db.get("nurses").value());
  });

  // ---------------------------------------------------------------------
  // 16. Get a detail of nurse by employeeid
  // GET /api/nurse/empid/:empid
  // ---------------------------------------------------------------------
  server.get("/api/nurse/empid/:empid", (req, res) => {
    const nurse = db
      .get("nurses")
      .find({ EmployeeID: Number(req.params.empid) })
      .value();
    if (!nurse) return notFound(res, "Nurse");
    return res.status(200).json(nurse);
  });

  // ---------------------------------------------------------------------
  // 12. Add an appointment detail to DB
  // POST /api/appointment/
  // ---------------------------------------------------------------------
  server.post("/api/appointment/", (req, res) => {
    const { AppointmentID, Patient, Physician, Starto, Endo, ExaminationRoom, VisitType } =
      req.body || {};
    let PrepNurse =
      req.body && Object.prototype.hasOwnProperty.call(req.body, "PrepNurse")
        ? req.body.PrepNurse
        : null;
    if (
      !AppointmentID ||
      !Patient ||
      !Physician ||
      !Starto ||
      !Endo ||
      !ExaminationRoom
    ) {
      return badRequest(
        res,
        "AppointmentID, Patient, Physician, Starto, Endo and ExaminationRoom are required",
      );
    }
    if (!db.get("patients").find({ SSN: Patient }).value()) {
      return badRequest(res, "Patient must reference an existing Patient SSN");
    }
    if (!db.get("physicians").find({ EmployeeID: Physician }).value()) {
      return badRequest(res, "Physician must reference an existing Physician");
    }
    if (db.get("appointments").find({ AppointmentID }).value()) {
      return badRequest(
        res,
        "Appointment with this AppointmentID already exists",
      );
    }
    // Auto-assign a prep nurse at random from the nurses currently in the DB
    // whenever the caller doesn't explicitly supply one. Reading straight from
    // db.json means a nurse added moments ago is immediately eligible.
    if (PrepNurse === null || PrepNurse === undefined) {
      const nurses = db.get("nurses").value();
      if (nurses && nurses.length) {
        PrepNurse =
          nurses[Math.floor(Math.random() * nurses.length)].EmployeeID;
      }
    }
    db.get("appointments")
      .push({
        AppointmentID,
        Patient,
        PrepNurse,
        Physician,
        Starto,
        Endo,
        ExaminationRoom,
        VisitType: VisitType || "OPD",
      })
      .write();
    return res.status(201).json({ message: "Record Created Successfully" });
  });

  // ---------------------------------------------------------------------
  // 13. Get a list of appointment
  // GET /api/appointment
  // ---------------------------------------------------------------------
  server.get("/api/appointment", (req, res) => {
    return res.status(200).json(db.get("appointments").value());
  });

  // ---------------------------------------------------------------------
  // 14. Add a new treatment (procedure) to DB
  // POST /api/procedure
  // ---------------------------------------------------------------------
  server.post("/api/procedure", (req, res) => {
    const { Code, Name, Cost } = req.body || {};
    if (!Code || !Name || Cost === undefined)
      return badRequest(res, "Code, Name and Cost are required");
    if (db.get("procedures").find({ Code }).value()) {
      return badRequest(res, "Procedure with this Code already exists");
    }
    db.get("procedures").push({ Code, Name, Cost }).write();
    return res.status(201).json({ message: "Record Created Successfully" });
  });

  // ---------------------------------------------------------------------
  // 15. Get a list of available Treatment
  // GET /api/procedure/
  // ---------------------------------------------------------------------
  server.get("/api/procedure/", (req, res) => {
    return res.status(200).json(db.get("procedures").value());
  });

  // ---------------------------------------------------------------------
  // AUTH — mock login (plaintext demo credentials, not production auth)
  // POST /api/auth/login { username, password }
  // ---------------------------------------------------------------------
  server.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password)
      return badRequest(res, "username and password are required");
    const user = db.get("users").find({ username, password }).value();
    if (!user)
      return res.status(401).json({
        timeStamp: new Date().toISOString(),
        message: "Invalid credentials",
      });
    const { password: _pw, ...safeUser } = user;
    return res.status(200).json({ user: safeUser });
  });

  // ADMIN — generic master edit across core resources
  // PUT /api/admin/:resource/:id   (resource = physicians|nurses|patients|departments|procedures|appointments)

  const ADMIN_RESOURCES = {
    physicians: "EmployeeID",
    nurses: "EmployeeID",
    patients: "SSN",
    departments: "DepartmentID",
    procedures: "Code",
    appointments: "AppointmentID",
    rooms: "RoomNumber",
  };

  server.put("/api/admin/:resource/:id", (req, res) => {
    const { resource, id } = req.params;
    const keyField = ADMIN_RESOURCES[resource];
    if (!keyField)
      return badRequest(res, `Unknown or non-editable resource: ${resource}`);
    const numericId = Number(id);
    const record = db.get(resource).find({ [keyField]: numericId });
    if (!record.value()) return notFound(res, resource);
    record.assign(req.body || {}).write();
    return res.status(200).json(record.value());
  });

  server.delete("/api/admin/:resource/:id", (req, res) => {
    const { resource, id } = req.params;
    const keyField = ADMIN_RESOURCES[resource];
    if (!keyField)
      return badRequest(res, `Unknown or non-editable resource: ${resource}`);
    const numericId = Number(id);
    const existed = db
      .get(resource)
      .find({ [keyField]: numericId })
      .value();
    if (!existed) return notFound(res, resource);
    db.get(resource)
      .remove({ [keyField]: numericId })
      .write();
    return res.status(200).json({ message: "Deleted successfully" });
  });

  server.get("/api/admin/:resource/:id", (req, res) => {
    const { resource, id } = req.params;
    const keyField = ADMIN_RESOURCES[resource];
    if (!keyField)
      return badRequest(res, `Unknown or non-editable resource: ${resource}`);
    const numericId = Number(id);
    const record = db
      .get(resource)
      .find({ [keyField]: numericId })
      .value();
    if (!record) return notFound(res, resource);
    return res.status(200).json(record);
  });

  // ---------------------------------------------------------------------
  // PATIENT — choose / edit own appointment
  // PUT /api/patient/appointment/:appointmentId
  // ---------------------------------------------------------------------
  server.put("/api/patient/appointment/:appointmentId", (req, res) => {
    const appt = db
      .get("appointments")
      .find({ AppointmentID: Number(req.params.appointmentId) });
    if (!appt.value()) return notFound(res, "Appointment");
    const { Physician, Starto, Endo, ExaminationRoom, VisitType } =
      req.body || {};
    const patch = {};
    if (Physician !== undefined) patch.Physician = Physician;
    if (Starto !== undefined) patch.Starto = Starto;
    if (Endo !== undefined) patch.Endo = Endo;
    if (ExaminationRoom !== undefined) patch.ExaminationRoom = ExaminationRoom;
    if (VisitType !== undefined) patch.VisitType = VisitType;
    appt.assign(patch).write();
    return res.status(200).json(appt.value());
  });

  // ---------------------------------------------------------------------
  // PATIENT — full dashboard: profile, appointments, billing
  // GET /api/patient/:ssn/dashboard
  // ---------------------------------------------------------------------
  server.get("/api/patient/:ssn/dashboard", (req, res) => {
    const ssn = Number(req.params.ssn);
    const profile = db.get("patients").find({ SSN: ssn }).value();
    if (!profile) return notFound(res, "Patient");

    const appointments = db
      .get("appointments")
      .filter({ Patient: ssn })
      .value();
    const stays = db.get("stays").filter({ Patient: ssn }).value();
    const bills = db.get("billing").filter({ patient: ssn }).value();
    const prescriptions = db.get("prescribes").filter({ Patient: ssn }).value();
    const pcp = db.get("physicians").find({ EmployeeID: profile.PCP }).value();

    return res.status(200).json({
      profile,
      primaryCarePhysician: pcp,
      appointments,
      stays,
      billing: bills,
      prescriptions,
    });
  });

  // ---------------------------------------------------------------------
  // DOCTOR — full dashboard: profile, duty shifts, patients, salary/commission, ops vs checkups
  // GET /api/doctor/:empid/dashboard
  // ---------------------------------------------------------------------
  server.get("/api/doctor/:empid/dashboard", (req, res) => {
    const empId = Number(req.params.empid);
    const profile = db.get("physicians").find({ EmployeeID: empId }).value();
    if (!profile) return notFound(res, "Physician");

    const appointments = db
      .get("appointments")
      .filter({ Physician: empId })
      .value();
    const operations = db.get("undergoes").filter({ Physician: empId }).value();
    const dutyShifts = db
      .get("duty_shifts")
      .filter({ personType: "physician", personId: empId })
      .value();
    const salaryRecord = db.get("salaries").find({ physician: empId }).value();

    const procedures = db.get("procedures").value();
    const operationsWithCost = operations.map((op) => {
      const proc = procedures.find((p) => p.Code === op.Procedures);
      return { ...op, procedureName: proc?.Name, cost: proc?.Cost || 0 };
    });
    const totalProcedureRevenue = operationsWithCost.reduce(
      (sum, op) => sum + op.cost,
      0,
    );
    const commissionEarned = salaryRecord
      ? +(totalProcedureRevenue * salaryRecord.commissionRate).toFixed(2)
      : 0;

    const patientIds = [...new Set(appointments.map((a) => a.Patient))];
    const patients = db
      .get("patients")
      .filter((p) => patientIds.includes(p.SSN))
      .value();

    return res.status(200).json({
      profile,
      patients,
      appointments,
      operations: operationsWithCost,
      generalCheckups: appointments.filter((a) => a.VisitType !== "Admission")
        .length,
      dutyShifts,
      salary: salaryRecord
        ? {
            ...salaryRecord,
            commissionEarned,
            totalCompensation: salaryRecord.baseSalary + commissionEarned,
          }
        : null,
    });
  });

  // ---------------------------------------------------------------------
  // NURSE — full dashboard: assigned patients, supervising doctors, rooms, duty shifts
  // GET /api/nurse/:empid/dashboard
  // ---------------------------------------------------------------------
  server.get("/api/nurse/:empid/dashboard", (req, res) => {
    const empId = Number(req.params.empid);
    const profile = db.get("nurses").find({ EmployeeID: empId }).value();
    if (!profile) return notFound(res, "Nurse");

    const prepAppointments = db
      .get("appointments")
      .filter({ PrepNurse: empId })
      .value();
    const assisting = db
      .get("undergoes")
      .filter({ AssistingNurse: empId })
      .value();
    const onCall = db.get("on_call").filter({ Nurse: empId }).value();
    const dutyShifts = db
      .get("duty_shifts")
      .filter({ personType: "nurse", personId: empId })
      .value();

    const physicians = db.get("physicians").value();
    const patients = db.get("patients").value();
    const rooms = db.get("rooms").value();
    const stays = db.get("stays").value();

    const assignments = prepAppointments.map((a) => ({
      type: "Appointment",
      patient: patients.find((p) => p.SSN === a.Patient),
      supervisingDoctor: physicians.find((p) => p.EmployeeID === a.Physician),
      room: a.ExaminationRoom,
      when: `${a.Starto} → ${a.Endo}`,
    }));

    const assistingAssignments = assisting.map((u) => {
      const stay = stays.find((s) => s.StayID === u.Stay);
      const room = stay ? rooms.find((r) => r.RoomNumber === stay.Room) : null;
      return {
        type: "Operation assist",
        patient: patients.find((p) => p.SSN === u.Patient),
        supervisingDoctor: physicians.find((p) => p.EmployeeID === u.Physician),
        room: room
          ? `${room.RoomNumber} (Floor ${room.BlockFloor}, Block ${room.BlockCode})`
          : "Unassigned",
        when: u.DateUndergoes,
      };
    });

    return res.status(200).json({
      profile,
      assignments: [...assignments, ...assistingAssignments],
      onCall,
      dutyShifts,
    });
  });

  // =======================================================================
  // PHYSICIAN — additional search / update endpoints
  // =======================================================================

  // GET /api/physician/name/:name — Search Physician detail by Name
  server.get("/api/physician/name/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    const physician = db
      .get("physicians")
      .find((p) => p.Name.toLowerCase() === name)
      .value();
    if (!physician) return notFound(res, "Physician");
    return res.status(200).json(physician);
  });

  // GET /api/physician/position/:pos — Search Physicians by Position
  server.get("/api/physician/position/:pos", (req, res) => {
    const pos = req.params.pos.toLowerCase();
    const physicians = db
      .get("physicians")
      .filter((p) => p.Position.toLowerCase() === pos)
      .value();
    return res.status(200).json(physicians);
  });

  // PUT /api/physician/update/ssn/:empid — Update SSN of a Physician
  server.put("/api/physician/update/ssn/:empid", (req, res) => {
    const { SSN } = req.body || {};
    if (!SSN) return badRequest(res, "SSN is required");
    const physician = db
      .get("physicians")
      .find({ EmployeeID: Number(req.params.empid) });
    if (!physician.value()) return notFound(res, "Physician");
    physician.assign({ SSN }).write();
    return res.status(200).json(physician.value());
  });

  // =======================================================================
  // DEPARTMENT — head lookups / updates
  // =======================================================================

  // GET /api/department/head/:deptid — Search the head of department details
  server.get("/api/department/head/:deptid", (req, res) => {
    const department = db
      .get("departments")
      .find({ DepartmentID: Number(req.params.deptid) })
      .value();
    if (!department) return notFound(res, "Department");
    const head = db
      .get("physicians")
      .find({ EmployeeID: department.Head })
      .value();
    if (!head) return notFound(res, "Physician");
    return res.status(200).json(head);
  });

  // GET /api/department/check/:physicianid — Search whether a physician is head of any department
  server.get("/api/department/check/:physicianid", (req, res) => {
    const isHead = !!db
      .get("departments")
      .find({ Head: Number(req.params.physicianid) })
      .value();
    return res.status(200).json(isHead);
  });

  // PUT /api/department/update/headid/:deptid — Update the department head id
  server.put("/api/department/update/headid/:deptid", (req, res) => {
    const { Head } = req.body || {};
    if (!Head) return badRequest(res, "Head is required");
    if (!db.get("physicians").find({ EmployeeID: Head }).value()) {
      return badRequest(res, "Head must reference an existing Physician");
    }
    const department = db
      .get("departments")
      .find({ DepartmentID: Number(req.params.deptid) });
    if (!department.value()) return notFound(res, "Department");
    department.assign({ Head }).write();
    return res.status(200).json(department.value());
  });

  // =======================================================================
  // AFFILIATED_WITH — physician ↔ department affiliations
  // =======================================================================

  // POST /api/affiliated_with/post — Add an existing physician to affiliated_with table
  server.post("/api/affiliated_with/post", (req, res) => {
    const { Physician, Department, PrimaryAffiliation } = req.body || {};
    if (!Physician || !Department)
      return badRequest(res, "Physician and Department are required");
    if (!db.get("physicians").find({ EmployeeID: Physician }).value()) {
      return badRequest(res, "Physician must reference an existing Physician");
    }
    if (!db.get("departments").find({ DepartmentID: Department }).value()) {
      return badRequest(
        res,
        "Department must reference an existing Department",
      );
    }
    const id = `${Physician}-${Department}`;
    if (db.get("affiliated_with").find({ id }).value()) {
      return badRequest(
        res,
        "This physician is already affiliated with this department",
      );
    }
    db.get("affiliated_with")
      .push({
        id,
        Physician,
        Department,
        PrimaryAffiliation: PrimaryAffiliation ? 1 : 0,
      })
      .write();
    return res.status(201).json({ message: "Record Created Successfully" });
  });

  // GET /api/affiliated_with/physicians/:deptid — Physicians affiliated with a particular department
  server.get("/api/affiliated_with/physicians/:deptid", (req, res) => {
    const deptId = Number(req.params.deptid);
    const links = db
      .get("affiliated_with")
      .filter({ Department: deptId })
      .value();
    const ids = links.map((l) => l.Physician);
    const physicians = db
      .get("physicians")
      .filter((p) => ids.includes(p.EmployeeID))
      .value();
    return res.status(200).json(physicians);
  });

  // GET /api/affiliated_with/department/:physicianid — Departments a physician is affiliated with
  server.get("/api/affiliated_with/department/:physicianid", (req, res) => {
    const physicianId = Number(req.params.physicianid);
    const links = db
      .get("affiliated_with")
      .filter({ Physician: physicianId })
      .value();
    const ids = links.map((l) => l.Department);
    const departments = db
      .get("departments")
      .filter((d) => ids.includes(d.DepartmentID))
      .value();
    return res.status(200).json(departments);
  });

  // GET /api/affiliated_with/primary/:physicianid — Search the primary affiliation of a physician
  server.get("/api/affiliated_with/primary/:physicianid", (req, res) => {
    const physicianId = Number(req.params.physicianid);
    const primary = db
      .get("affiliated_with")
      .find({ Physician: physicianId, PrimaryAffiliation: 1 })
      .value();
    if (!primary) return notFound(res, "Primary affiliation");
    const department = db
      .get("departments")
      .find({ DepartmentID: primary.Department })
      .value();
    return res.status(200).json(department);
  });

  // =======================================================================
  // PROCEDURE — cost / name lookups & updates
  // =======================================================================

  // GET /api/procedure/cost/:id — Get the cost of a procedure by id
  server.get("/api/procedure/cost/:id", (req, res) => {
    const procedure = db
      .get("procedures")
      .find({ Code: Number(req.params.id) })
      .value();
    if (!procedure) return notFound(res, "Procedure");
    return res.status(200).json({ Code: procedure.Code, Cost: procedure.Cost });
  });

  // PUT /api/procedure/cost/:id — Update the cost of a procedure
  server.put("/api/procedure/cost/:id", (req, res) => {
    const { Cost } = req.body || {};
    if (Cost === undefined) return badRequest(res, "Cost is required");
    const procedure = db
      .get("procedures")
      .find({ Code: Number(req.params.id) });
    if (!procedure.value()) return notFound(res, "Procedure");
    procedure.assign({ Cost }).write();
    return res.status(200).json(procedure.value());
  });

  // PUT /api/procedure/name/:id — Update the name of a procedure
  server.put("/api/procedure/name/:id", (req, res) => {
    const { Name } = req.body || {};
    if (!Name || Name.trim() === "") return badRequest(res, "Name is required");
    const procedure = db
      .get("procedures")
      .find({ Code: Number(req.params.id) });
    if (!procedure.value()) return notFound(res, "Procedure");
    procedure.assign({ Name }).write();
    return res.status(200).json(procedure.value());
  });

  // GET /api/procedure/search/:name — Search procedures by (partial) name
  server.get("/api/procedure/search/:name", (req, res) => {
    const q = req.params.name.toLowerCase();
    const matches = db
      .get("procedures")
      .filter((p) => p.Name.toLowerCase().includes(q))
      .value();
    return res.status(200).json(matches);
  });

  // =======================================================================
  // TRAINED_IN — physician certifications for procedures
  // =======================================================================

  // POST /api/trained_in — Add a certification to the DB
  server.post("/api/trained_in", (req, res) => {
    const { Physician, Treatment, CertificationDate, CertificationExpires } =
      req.body || {};
    if (
      !Physician ||
      !Treatment ||
      !CertificationDate ||
      !CertificationExpires
    ) {
      return badRequest(
        res,
        "Physician, Treatment, CertificationDate and CertificationExpires are required",
      );
    }
    if (!db.get("physicians").find({ EmployeeID: Physician }).value()) {
      return badRequest(res, "Physician must reference an existing Physician");
    }
    if (!db.get("procedures").find({ Code: Treatment }).value()) {
      return badRequest(res, "Treatment must reference an existing Procedure");
    }
    const id = `${Physician}-${Treatment}`;
    if (db.get("trained_in").find({ id }).value()) {
      return badRequest(
        res,
        "This physician is already certified for this treatment",
      );
    }
    db.get("trained_in")
      .push({
        id,
        Physician,
        Treatment,
        CertificationDate,
        CertificationExpires,
      })
      .write();
    return res.status(201).json({ message: "Record Created Successfully" });
  });

  // GET /api/trained_in/ — Get a list of procedures available with certification
  server.get("/api/trained_in/", (req, res) => {
    return res.status(200).json(db.get("trained_in").value());
  });

  // GET /api/trained_in/treatment/:physicianid — Treatments a particular physician can perform
  server.get("/api/trained_in/treatment/:physicianid", (req, res) => {
    const physicianId = Number(req.params.physicianid);
    const certs = db
      .get("trained_in")
      .filter({ Physician: physicianId })
      .value();
    const procedures = db.get("procedures").value();
    const treatments = certs.map((c) => ({
      ...c,
      procedure: procedures.find((p) => p.Code === c.Treatment),
    }));
    return res.status(200).json(treatments);
  });

  // GET /api/trained_in/physicians/:procedureid — Physicians certified for a particular procedure
  server.get("/api/trained_in/physicians/:procedureid", (req, res) => {
    const procedureId = Number(req.params.procedureid);
    const certs = db
      .get("trained_in")
      .filter({ Treatment: procedureId })
      .value();
    const ids = certs.map((c) => c.Physician);
    const physicians = db
      .get("physicians")
      .filter((p) => ids.includes(p.EmployeeID))
      .value();
    return res.status(200).json(physicians);
  });

  // =======================================================================
  // PATIENT — lookups by physician / insurance / contact updates
  // =======================================================================

  // GET /api/patient/physician/:physicianid — Patients checked by a particular physician
  server.get("/api/patient/physician/:physicianid", (req, res) => {
    const physicianId = Number(req.params.physicianid);
    const appts = db
      .get("appointments")
      .filter({ Physician: physicianId })
      .value();
    const ids = [...new Set(appts.map((a) => a.Patient))];
    const patients = db
      .get("patients")
      .filter((p) => ids.includes(p.SSN))
      .value();
    return res.status(200).json(patients);
  });

  // GET /api/patient/physician/:physicianid/:patientid — Detail of a patient checked by a particular physician
  server.get("/api/patient/physician/:physicianid/:patientid", (req, res) => {
    const physicianId = Number(req.params.physicianid);
    const patientId = Number(req.params.patientid);
    const hasAppt = db
      .get("appointments")
      .find({ Physician: physicianId, Patient: patientId })
      .value();
    if (!hasAppt) return notFound(res, "Patient");
    const patient = db.get("patients").find({ SSN: patientId }).value();
    if (!patient) return notFound(res, "Patient");
    return res.status(200).json(patient);
  });

  // GET /api/patient/insurance/:patientid — Get the insurance id of a patient
  server.get("/api/patient/insurance/:patientid", (req, res) => {
    const patient = db
      .get("patients")
      .find({ SSN: Number(req.params.patientid) })
      .value();
    if (!patient) return notFound(res, "Patient");
    return res.status(200).json({ InsuranceID: patient.InsuranceID });
  });

  // PUT /api/patient/address/:ssn — Update the address of a patient by SSN
  server.put("/api/patient/address/:ssn", (req, res) => {
    const { Address } = req.body || {};
    if (!Address || Address.trim() === "")
      return badRequest(res, "Address is required");
    const patient = db.get("patients").find({ SSN: Number(req.params.ssn) });
    if (!patient.value()) return notFound(res, "Patient");
    patient.assign({ Address }).write();
    return res.status(200).json(patient.value());
  });

  // PUT /api/patient/phone/:ssn — Update the phone of a patient by SSN
  server.put("/api/patient/phone/:ssn", (req, res) => {
    const { Phone } = req.body || {};
    if (!Phone || Phone.trim() === "")
      return badRequest(res, "Phone is required");
    const patient = db.get("patients").find({ SSN: Number(req.params.ssn) });
    if (!patient.value()) return notFound(res, "Patient");
    patient.assign({ Phone }).write();
    return res.status(200).json(patient.value());
  });

  // =======================================================================
  // NURSE — position / registration / SSN lookups & updates
  // =======================================================================

  // GET /api/nurse/position/:empid — Get position of a nurse by employeeid
  server.get("/api/nurse/position/:empid", (req, res) => {
    const nurse = db
      .get("nurses")
      .find({ EmployeeID: Number(req.params.empid) })
      .value();
    if (!nurse) return notFound(res, "Nurse");
    return res.status(200).json({ Position: nurse.Position });
  });

  // GET /api/nurse/registered/:empid — Get whether a nurse is registered or not
  server.get("/api/nurse/registered/:empid", (req, res) => {
    const nurse = db
      .get("nurses")
      .find({ EmployeeID: Number(req.params.empid) })
      .value();
    if (!nurse) return notFound(res, "Nurse");
    return res.status(200).json({ Registered: !!nurse.Registered });
  });

  // PUT /api/nurse/registered/:empid — Update the value of registered by employeeid
  server.put("/api/nurse/registered/:empid", (req, res) => {
    const { Registered } = req.body || {};
    if (Registered === undefined)
      return badRequest(res, "Registered is required");
    const nurse = db
      .get("nurses")
      .find({ EmployeeID: Number(req.params.empid) });
    if (!nurse.value()) return notFound(res, "Nurse");
    nurse.assign({ Registered }).write();
    return res.status(200).json(nurse.value());
  });

  // PUT /api/nurse/ssn/:empid — Update the value of SSN by employeeid
  server.put("/api/nurse/ssn/:empid", (req, res) => {
    const { SSN } = req.body || {};
    if (!SSN) return badRequest(res, "SSN is required");
    const nurse = db
      .get("nurses")
      .find({ EmployeeID: Number(req.params.empid) });
    if (!nurse.value()) return notFound(res, "Nurse");
    nurse.assign({ SSN }).write();
    return res.status(200).json(nurse.value());
  });

  // Fallback to default json-server REST routes (e.g. /physicians, /departments, ...)
  server.use(router);

  return server;
}

module.exports = createApp;

if (require.main === module) {
  const app = createApp();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(
      `Hospital Management System mock API running at http://localhost:${PORT}`,
    );
  });
}