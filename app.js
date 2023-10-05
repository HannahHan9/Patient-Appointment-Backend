const express = require("express");
const {
    getPatientByNhsNumber,
    postPatients,
    patchPatientsByNhsNumber,
    deletePatientByNhsNumber,
    getAppointmentsByPatient,
    postAppointmentByPatient,
    checkMissedAppointments,
    // patchAppointmentByPatient,
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

app.get("/api/appointments/:patient", getAppointmentsByPatient);

app.post("/api/appointments/:patient", postAppointmentByPatient);

// checkMissedAppointments() - how do I stop this interfering with the tests?

const fifteenMinutes = 15 * 60 * 1000;
// setInterval(checkMissedAppointments, fifteenMinutes);
// how would you test this function?

// app.patch("/api/appointments/:patient", patchAppointmentByPatient);

app.all("*", (_, res) => {
    res.status(404).send({ status: 404, msg: "Route Not Found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
