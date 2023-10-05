const request = require("supertest");
const app = require("../app");
const patientsTestData = require("../db/data/test-data/test_patients.json");
const appointmentsTestData = require("../db/data/test-data/test_appointments.json");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => seed(patientsTestData, appointmentsTestData));
afterAll(() => db.end());

describe("GET /api/patients/:nhs_number", () => {
    test("200:should respond with an individual patient", () => {
        return request(app)
            .get("/api/patients/1111111111")
            .expect(200)
            .then(({ body }) => {
                expect(body.patient).toHaveProperty("nhs_number", "1111111111");
                expect(body.patient).toHaveProperty("name", expect.any(String));
                expect(body.patient).toHaveProperty(
                    "date_of_birth",
                    expect.any(String)
                );
                expect(body.patient).toHaveProperty(
                    "postcode",
                    expect.any(String)
                );
            });
    });
    test("400:should respond with Invalid input for an invalid nhs number", () => {
        return request(app)
            .get("/api/patients/Banana123")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid NHS Number");
            });
    });
    test("404:should respond with valid NHS Number when passed a number that does not exist", () => {
        return request(app)
            .get("/api/patients/4401654447")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("NHS Number Not Found");
            });
    });
});

describe("POST /api/patients", () => {
    test("201:should add a new patient to the database and respond with newly added patient's details", () => {
        const testPatient = {
            nhs_number: "0617238324",
            name: "Jane Doe",
            date_of_birth: "1987-10-02",
            postcode: "M19 2CD",
        };
        return request(app)
            .post("/api/patients")
            .send(testPatient)
            .expect(201)
            .then(({ body }) => {
                const { patient } = body;
                expect(patient).toHaveProperty("nhs_number", "0617238324");
                expect(patient).toHaveProperty("name", "Jane Doe");
                expect(patient).toHaveProperty("date_of_birth", "1987-10-02");
                expect(patient).toHaveProperty("postcode", "M19 2CD");
            });
    });
    test("400:should respond with Invalid NHS Number", () => {
        const testPatient = {
            nhs_number: "9999",
            name: "Jane Doe",
            date_of_birth: "1987-10-02",
            postcode: "M19 2CD",
        };
        return request(app)
            .post("/api/patients")
            .expect(400)
            .send(testPatient)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid NHS Number");
            });
    });
    test("400:should respond with Invalid Date of Birth", () => {
        const testPatient = {
            nhs_number: "0617238324",
            name: "Jane Doe",
            date_of_birth: "23105-10-02",
            postcode: "M19 2CD",
        };
        return request(app)
            .post("/api/patients")
            .send(testPatient)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Date of Birth");
            });
    });
    test("400:should respond with Invalid name", () => {
        const testPatient = {
            nhs_number: "0617238324",
            name: (notName) => {
                return notName;
            },
            date_of_birth: "2310-10-02",
            postcode: "M19 2CD",
        };
        return request(app)
            .post("/api/patients")
            .expect(400)
            .send(testPatient)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Name");
            });
    });
    test("400:should respond with Invalid postcode", () => {
        const testPatient = {
            nhs_number: "0617238324",
            name: "Jane Doe",
            date_of_birth: "2315-10-02",
            postcode: "M19 2CDDD",
        };
        return request(app)
            .post("/api/patients")
            .expect(400)
            .send(testPatient)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Postcode");
            });
    });
});

describe("PATCH /api/patients/:nhs_number", () => {
    test("200: should update patient's name", () => {
        const testBody = { name: "Alice Smith" };
        return request(app)
            .patch("/api/patients/1111111111")
            .send(testBody)
            .expect(200)
            .then(({ body }) => {
                const { updatedPatient } = body;
                expect(updatedPatient).toHaveProperty(
                    "nhs_number",
                    "1111111111"
                );
                expect(updatedPatient).toHaveProperty("name", "Alice Smith");
            });
    });
    test("200: should update patient's postcode", () => {
        const testBody = { postcode: "M19 2DB" };
        return request(app)
            .patch("/api/patients/1111111111")
            .send(testBody)
            .expect(200)
            .then(({ body }) => {
                const { updatedPatient } = body;
                expect(updatedPatient).toHaveProperty(
                    "nhs_number",
                    "1111111111"
                );
                expect(updatedPatient).toMatchObject({
                    nhs_number: "1111111111",
                    name: "Alice Johnson",
                    date_of_birth: "1990-05-15",
                    postcode: "M19 2DB",
                });
            });
    });
    test("400:should respond with Invalid NHS Number", () => {
        const testBody = { name: "Alice Smith" };
        return request(app)
            .patch("/api/patients/Banana123")
            .send(testBody)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid NHS Number");
            });
    });
    test("404:should respond with NHS Number Not Found for a valid nhs number that does not exist", () => {
        const testBody = { name: "Alice Smith" };
        return request(app)
            .patch("/api/patients/4401654447")
            .send(testBody)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("NHS Number Not Found");
            });
    });
    test("400:should respond with Invalid Postcode when passed incorrect format of postcode", () => {
        const testBody = { postcode: "12D DFJK" };
        return request(app)
            .patch("/api/patients/1609079019")
            .send(testBody)
            .expect(400)
            .send(testBody)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Postcode");
            });
    });
});

describe("DELETE /api/patients/:nhs_number", () => {
    test("204: should delete the patient with the provided nhs number from the database and respond with a 204 No Content status", () => {
        return request(app).delete("/api/patients/1111111111").expect(204);
    });
    test("400:should respond with Invalid NHS Number", () => {
        return request(app)
            .delete("/api/patients/Banana123")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid NHS Number");
            });
    });
    test("404:should respond with Not Found when passed a NHS Number that does not exist", () => {
        return request(app)
            .delete("/api/patients/4401654447")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("NHS Number Not Found");
            });
    });
});

describe("GET /api/appointments/:patient", () => {
    test("200:should respond with an appointment or appointments by patient", () => {
        return request(app)
            .get("/api/appointments/1111111138")
            .expect(200)
            .then(({ body }) => {
                expect(body.appointment).toHaveProperty(
                    "id",
                    "6f7d8e9f-aabb-4342-8910-123456789abc"
                );
                expect(body.appointment).toHaveProperty(
                    "patient",
                    "1111111138"
                );
                expect(body.appointment).toHaveProperty("status", "attended");
                expect(body.appointment).toHaveProperty(
                    "time",
                    expect.any(String)
                );
                expect(body.appointment).toHaveProperty(
                    "duration",
                    expect.any(String)
                );
                expect(body.appointment).toHaveProperty(
                    "clinician",
                    expect.any(String)
                );
                expect(body.appointment).toHaveProperty(
                    "department",
                    expect.any(String)
                );
                expect(body.appointment).toHaveProperty(
                    "postcode",
                    expect.any(String)
                );
            });
    });
    test("400:should respond with Invalid input for an invalid patient number", () => {
        return request(app)
            .get("/api/appointments/Banana123")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid NHS Number");
            });
    });
    test("404:should respond with valid NHS Number when passed a number that does not exist", () => {
        return request(app)
            .get("/api/appointments/4401654447")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("NHS Number Not Found");
            });
    });
});

describe("POST /api/appointments", () => {
    test("201:should add a new appointment to the database and respond with newly added appointment's details", () => {
        const testAppointment = {
            id: "434d31d4-5993-47ef-a468-7884a467ae80",
            patient: "1111111367",
            status: "active",
            time: "2025-06-04T16:30:00+01:00",
            duration: "1h",
            clinician: "Jason Holloway",
            department: "oncology",
            postcode: "M19 2CD",
        };
        return request(app)
            .post("/api/appointments")
            .send(testAppointment)
            .expect(201)
            .then(({ body }) => {
                const { appointment } = body;
                expect(appointment).toHaveProperty(
                    "id",
                    "434d31d4-5993-47ef-a468-7884a467ae80"
                );
                expect(appointment).toHaveProperty("patient", "1111111367");
                expect(appointment).toHaveProperty("status", "active");
                expect(appointment).toHaveProperty(
                    "time",
                    "2025-06-04T16:30:00+01:00"
                );
                expect(appointment).toHaveProperty("duration", "1h");
                expect(appointment).toHaveProperty(
                    "clinician",
                    "Jason Holloway"
                );
                expect(appointment).toHaveProperty("department", "oncology");
                expect(appointment).toHaveProperty("postcode", "M19 2CD");
            });
    });
    test("400:should respond with Invalid Patient Number", () => {
        const testAppointment = {
            id: "434d31d4-5993-47ef-a468-7884a467ae80",
            patient: "Banana123",
            status: "active",
            time: "2025-06-04T16:30:00+01:00",
            duration: "1h",
            clinician: "Jason Holloway",
            department: "oncology",
            postcode: "M19 2CD",
        };
        return request(app)
            .post("/api/appointments")
            .expect(400)
            .send(testAppointment)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid NHS Number");
            });
    });
    test("400:should respond with Invalid Status", () => {
        const testAppointment = {
            id: "434d31d4-5993-47ef-a468-7884a467ae80",
            patient: "1111111367",
            status: "late",
            time: "2025-06-04T16:30:00+01:00",
            duration: "1h",
            clinician: "Jason Holloway",
            department: "oncology",
            postcode: "M19 2CD",
        };
        return request(app)
            .post("/api/appointments")
            .send(testAppointment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Status");
            });
    });
    test("400:should respond with Invalid clinician", () => {
        const testAppointment = {
            id: "434d31d4-5993-47ef-a468-7884a467ae80",
            patient: "1111111367",
            status: "late",
            time: "2025-06-04T16:30:00+01:00",
            duration: "1h",
            clinician: (notName) => {
                return notName;
            },
            department: "oncology",
            postcode: "M19 2CD",
        };
        return request(app)
            .post("/api/appointments")
            .expect(400)
            .send(testAppointment)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Clinician");
            });
    });
    test("400:should respond with Invalid postcode", () => {
        const testAppointment = {
            id: "434d31d4-5993-47ef-a468-7884a467ae80",
            patient: "1111111367",
            status: "active",
            time: "2025-06-04T16:30:00+01:00",
            duration: "1h",
            clinician: "Jason Holloway",
            department: "oncology",
            postcode: "M19 2CDLk",
        };
        return request(app)
            .post("/api/appointments")
            .expect(400)
            .send(testAppointment)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid Postcode");
            });
    });
});
