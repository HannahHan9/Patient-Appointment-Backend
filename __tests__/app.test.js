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
            .get("/api/patients/1609079019")
            .expect(200)
            .then(({ body }) => {
                expect(body.patient).toHaveProperty("nhs_number", "1609079019");
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
    test.only("200: should update patient's name", () => {
        const testBody = { name: "Alice Smith" };
        return request(app)
            .patch("/api/patients/1609079019")
            .send(testBody)
            .expect(200)
            .then(({ body }) => {
                const { patient } = body;
                expect(patient).toHaveProperty("nhs_number", "1609079019");
                expect(patient).toHaveProperty("name", "Alice Smith");
            });
    });
    test("200: should update patient's postcode", () => {
        const testBody = { postcode: "M19 2DB" };
        return request(app)
            .patch("/api/patients/1609079019")
            .send(testBody)
            .expect(200)
            .then(({ body }) => {
                const { patient } = body;
                expect(patient).toHaveProperty("nhs_number", "1609079019");
                expect(patient).toMatchObject({nhs_number: "1609079019", name: "Alice Smith", date_of_birth: "1990-05-15", postcode: "M19 2DB"});
            });
    });
    test("200: should ignore other properties passed in the request body", () => {
        const testBody = { nhs_number: "1609079019", name: "Alice Smith" };
        return request(app)
            .patch("/api/patients/1609079019")
            .send(testBody)
            .expect(200)
            .then(({ body }) => {
                const { patient } = body;
                expect(patient).toHaveProperty("nhs_number", "1609079019");
                expect(patient).toHaveProperty("name", "Jane Doe");
            });
    });
    // is this test necessary
    test("400:should respond with Invalid NHS Number", () => {
        const testBody = { name: "Alice Smith" };
        return request(app)
            .patch("/api/patients/Banana123")
            .send(testBody)
            .expect(400)
            .send(testBody)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid NHS Number");
            });
    });
    test("404:should respond with NHS Number Not Found for a valid nhs number that does not exist", () => {
        const testBody = { name: "Alice Smith" };
        return request(app)
            .patch("/api/patient/4401654447")
            .send(testBody)
            .expect(404)
            .send(testBody)
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
          return request(app).delete("/api/patients/1609079019").expect(204);
        });
        test("400:should respond with Invalid NHS Number", () => {
          return request(app)
            .delete("/api/patients/Banana123")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid NHS Number");
            });
        });
        test("404:should respond with Not Found when passed an id that does not exist", () => {
          return request(app)
            .delete("/api/patients/4401654447")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("NHS Number Not Found");
            });
        });
      });

    xdescribe("GET /api/appointments/:patient", () => {
        test("200:should respond with an appointment or appointments by patient", () => {
            return request(app)
                .get("/api/appointments/1609079019")
                .expect(200)
                .then(({ body }) => {
                    expect(body.appointment).toHaveProperty(
                        "id",
                        "5d5c84b6-9e88-4164-b7ec-5b1d11ca49a2"
                    );
                    expect(body.appointment).toHaveProperty(
                        "patient",
                        "1431315257"
                    );
                    expect(body.appointment).toHaveProperty(
                        "status",
                        expect.any(String)
                    );
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
    });
});
