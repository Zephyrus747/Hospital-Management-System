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
server.get("/api/physician/empid/:empid", (req, res) => {
  const physician = db
    .get("physicians")
    .find({ EmployeeID: Number(req.params.empid) })
    .value();
  if (!physician) return notFound(res, "Physician");
  return res.status(200).json(physician);
});
server.put("/update/position/:position/:employeeId", (req, res) => {
  const employeeId = Number(req.params.employeeId);
  const { position } = req.params;
  if (!position || position.trim() === "") return badRequest(res);
  const physician = db.get("physicians").find({ EmployeeID: employeeId });
  if (!physician.value()) return notFound(res, "Physician");
  physician.assign({ Position: position }).write();
  return res.status(200).json(physician.value());
});
server.put("/api/physician/update/name/:empid", (req, res) => {
  const empid = Number(req.params.empid);
  const { Name } = req.body || {};
  if (!Name || Name.trim() === "") return badRequest(res, "Name is required");
  const physician = db.get("physicians").find({ EmployeeID: empid });
  if (!physician.value()) return notFound(res, "Physician");
  physician.assign({ Name }).write();
  return res.status(200).json(physician.value());
});
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
server.get("/api/physician/name/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const physician = db
    .get("physicians")
    .find((p) => p.Name.toLowerCase() === name)
    .value();
  if (!physician) return notFound(res, "Physician");
  return res.status(200).json(physician);
});
server.get("/api/physician/position/:pos", (req, res) => {
  const pos = req.params.pos.toLowerCase();
  const physicians = db
    .get("physicians")
    .filter((p) => p.Position.toLowerCase() === pos)
    .value();
  return res.status(200).json(physicians);
});
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
server.post("/api/affiliated_with/post", (req, res) => {
  const { Physician, Department, PrimaryAffiliation } = req.body || {};
  if (!Physician || !Department)
    return badRequest(res, "Physician and Department are required");
  if (!db.get("physicians").find({ EmployeeID: Physician }).value()) {
    return badRequest(res, "Physician must reference an existing Physician");
  }
  if (!db.get("departments").find({ DepartmentID: Department }).value()) {
    return badRequest(res, "Department must reference an existing Department");
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
server.post("/api/trained_in", (req, res) => {
  const { Physician, Treatment, CertificationDate, CertificationExpires } =
    req.body || {};
  if (!Physician || !Treatment || !CertificationDate || !CertificationExpires) {
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
    .push({ id, Physician, Treatment, CertificationDate, CertificationExpires })
    .write();
  return res.status(201).json({ message: "Record Created Successfully" });
});
server.get("/api/trained_in/", (req, res) => {
  return res.status(200).json(db.get("trained_in").value());
});
server.get("/api/trained_in/treatment/:physicianid", (req, res) => {
  const physicianId = Number(req.params.physicianid);
  const certs = db.get("trained_in").filter({ Physician: physicianId }).value();
  const procedures = db.get("procedures").value();
  const treatments = certs.map((c) => ({
    ...c,
    procedure: procedures.find((p) => p.Code === c.Treatment),
  }));
  return res.status(200).json(treatments);
});
server.get("/api/trained_in/physicians/:procedureid", (req, res) => {
  const procedureId = Number(req.params.procedureid);
  const certs = db.get("trained_in").filter({ Treatment: procedureId }).value();
  const ids = certs.map((c) => c.Physician);
  const physicians = db
    .get("physicians")
    .filter((p) => ids.includes(p.EmployeeID))
    .value();
  return res.status(200).json(physicians);
});

const ADMIN_RESOURCES = {
  physicians: "EmployeeID",
  nurses: "EmployeeID",
  patients: "SSN",
  departments: "DepartmentID",
  procedures: "Code",
  appointments: "AppointmentID",
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
