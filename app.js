const express = require("express");
const {
    getPatientByNhsNumber,
    postPatients,
    patchPatientsByNhsNumber,
    deletePatientByNhsNumber,
    // getAppointmentByPatient,
} = require("./controllers");
const {
    handlePsqlErrors,
    handleCustomErrors,
    handleServerErrors,
} = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/patients/:nhs_number", getPatientByNhsNumber);

app.post("/api/patients", postPatients);

app.patch("/api/patients/:nhs_number", patchPatientsByNhsNumber);

app.delete("/api/patients/:nhs_number", deletePatientByNhsNumber);

app.get("/api/appointments/:patient", getAppointmentByPatient);

app.post("/api/appointments/:patient", postAppointmentsByPatient);

app.patch("/api/appointments/:patient", patchAppointmentsByPatient);

app.all("*", (_, res) => {
    res.status(404).send({ status: 404, msg: "Route Not Found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
