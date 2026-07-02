const request = require('supertest');
const createApp = require('../server');
const { resetTestDb, cleanupTestDb } = require('./setupTestDb');

let app;

beforeEach(() => {
  const dbFile = resetTestDb();
  app = createApp(dbFile);
});

afterAll(() => {
  cleanupTestDb();
});

describe('Physician endpoints', () => {
  test('POST /api/physician/post - adds a new physician (201)', async () => {
    const res = await request(app)
      .post('/api/physician/post')
      .send({ EmployeeID: 50, Name: 'Test Physician', Position: 'Resident', SSN: 123123123 });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Record Created Successfully');
  });

  test('POST /api/physician/post - rejects missing fields (400)', async () => {
    const res = await request(app).post('/api/physician/post').send({ Name: 'No Id' });
    expect(res.status).toBe(400);
  });

  test('POST /api/physician/post - rejects duplicate EmployeeID (400)', async () => {
    const res = await request(app)
      .post('/api/physician/post')
      .send({ EmployeeID: 1, Name: 'Dup', Position: 'X', SSN: 1 });
    expect(res.status).toBe(400);
  });

  test('GET /api/physician/empid/:empid - returns a physician', async () => {
    const res = await request(app).get('/api/physician/empid/1');
    expect(res.status).toBe(200);
    expect(res.body.Name).toBe('John Dorian');
  });

  test('GET /api/physician/empid/:empid - 404 when not found', async () => {
    const res = await request(app).get('/api/physician/empid/9999');
    expect(res.status).toBe(404);
  });

  test('PUT /update/position/:position/:employeeId - updates position', async () => {
    const res = await request(app).put('/update/position/Chief Resident/1').send({});
    expect(res.status).toBe(200);
    expect(res.body.Position).toBe('Chief Resident');

    const check = await request(app).get('/api/physician/empid/1');
    expect(check.body.Position).toBe('Chief Resident');
  });

  test('PUT /update/position/:position/:employeeId - 404 for unknown physician', async () => {
    const res = await request(app).put('/update/position/Chief/9999').send({});
    expect(res.status).toBe(404);
  });

  test('PUT /api/physician/update/name/:empid - updates name', async () => {
    const res = await request(app)
      .put('/api/physician/update/name/2')
      .send({ Name: 'Elliot Reid-Dorian' });
    expect(res.status).toBe(200);
    expect(res.body.Name).toBe('Elliot Reid-Dorian');
  });

  test('PUT /api/physician/update/name/:empid - 400 when Name missing', async () => {
    const res = await request(app).put('/api/physician/update/name/2').send({});
    expect(res.status).toBe(400);
  });
});

describe('Department endpoints', () => {
  test('POST /api/department - adds a department (201)', async () => {
    const res = await request(app)
      .post('/api/department')
      .send({ DepartmentID: 4, Name: 'Radiology', Head: 4 });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Record Created Successfully');
  });

  test('POST /api/department - rejects Head not referencing a physician', async () => {
    const res = await request(app)
      .post('/api/department')
      .send({ DepartmentID: 5, Name: 'Bad', Head: 9999 });
    expect(res.status).toBe(400);
  });

  test('GET /api/department/ - returns list of departments', async () => {
    const res = await request(app).get('/api/department/');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);
  });

  test('GET /api/department/:deptid - returns a department', async () => {
    const res = await request(app).get('/api/department/2');
    expect(res.status).toBe(200);
    expect(res.body.Name).toBe('Surgery');
  });

  test('GET /api/department/:deptid - 404 when not found', async () => {
    const res = await request(app).get('/api/department/999');
    expect(res.status).toBe(404);
  });
});

describe('Patient endpoints', () => {
  test('POST /api/patient - adds a patient (201)', async () => {
    const res = await request(app).post('/api/patient').send({
      SSN: 100000099,
      Name: 'New Patient',
      Address: '1 Test St',
      Phone: '555-0000',
      InsuranceID: 11111111,
      PCP: 1,
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Record Created Successfully');
  });

  test('POST /api/patient - rejects unknown PCP physician', async () => {
    const res = await request(app).post('/api/patient').send({
      SSN: 100000098,
      Name: 'Bad PCP',
      Address: '1 Test St',
      Phone: '555-0000',
      InsuranceID: 11111111,
      PCP: 9999,
    });
    expect(res.status).toBe(400);
  });

  test('POST /api/patient - rejects duplicate SSN', async () => {
    const res = await request(app).post('/api/patient').send({
      SSN: 100000001,
      Name: 'Dup',
      Address: '1 Test St',
      Phone: '555-0000',
      InsuranceID: 1,
      PCP: 1,
    });
    expect(res.status).toBe(400);
  });

  test('GET /api/patient/ - returns list of patients', async () => {
    const res = await request(app).get('/api/patient/');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  });
});

describe('Nurse endpoints', () => {
  test('POST /api/nurse - adds a nurse (201)', async () => {
    const res = await request(app)
      .post('/api/nurse')
      .send({ EmployeeID: 200, Name: 'New Nurse', Position: 'Nurse', Registered: 1, SSN: 444444440 });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Record Created Successfully');
  });

  test('POST /api/nurse - rejects missing fields', async () => {
    const res = await request(app).post('/api/nurse').send({ Name: 'No Id' });
    expect(res.status).toBe(400);
  });

  test('GET /api/nurse/ - returns list of nurses', async () => {
    const res = await request(app).get('/api/nurse/');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });

  test('GET /api/nurse/empid/:empid - returns a nurse', async () => {
    const res = await request(app).get('/api/nurse/empid/101');
    expect(res.status).toBe(200);
    expect(res.body.Name).toBe('Carla Espinosa');
  });

  test('GET /api/nurse/empid/:empid - 404 when not found', async () => {
    const res = await request(app).get('/api/nurse/empid/9999');
    expect(res.status).toBe(404);
  });
});

describe('Appointment endpoints', () => {
  test('POST /api/appointment/ - adds an appointment (201)', async () => {
    const res = await request(app).post('/api/appointment/').send({
      AppointmentID: 99999999,
      Patient: 100000001,
      PrepNurse: 101,
      Physician: 1,
      Starto: '2026-07-01 10:00',
      Endo: '2026-07-01 11:00',
      ExaminationRoom: 'D',
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Record Created Successfully');
  });

  test('POST /api/appointment/ - rejects unknown patient', async () => {
    const res = await request(app).post('/api/appointment/').send({
      AppointmentID: 99999998,
      Patient: 9999,
      Physician: 1,
      Starto: '2026-07-01 10:00',
      Endo: '2026-07-01 11:00',
      ExaminationRoom: 'D',
    });
    expect(res.status).toBe(400);
  });

  test('GET /api/appointment - returns list of appointments', async () => {
    const res = await request(app).get('/api/appointment');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(9);
  });
});

describe('Procedure endpoints', () => {
  test('POST /api/procedure - adds a procedure (201)', async () => {
    const res = await request(app)
      .post('/api/procedure')
      .send({ Code: 8, Name: 'Test Procedure', Cost: 100.5 });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Record Created Successfully');
  });

  test('POST /api/procedure - rejects duplicate Code', async () => {
    const res = await request(app)
      .post('/api/procedure')
      .send({ Code: 1, Name: 'Dup', Cost: 1 });
    expect(res.status).toBe(400);
  });

  test('GET /api/procedure/ - returns list of procedures', async () => {
    const res = await request(app).get('/api/procedure/');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(7);
  });
});
