const { fetchPatient, insertPatient, updatePatient } = require("./models");
const { validateNhsNumber } = require("./db/utils");

exports.getPatientByNhsNumber = (req, res, next) => {
    const { nhs_number } = req.params;
    fetchPatient(nhs_number)
        .then((patient) => {
            res.status(200).send({ patient });
        })
        .catch(next);
};

exports.postPatients = (req, res, next) => {
    const newPatient = req.body;
    insertPatient(newPatient)
        .then((patient) => {
            res.status(201).send({ patient });
        })
        .catch(next);
};

exports.patchPatientsByNhsNumber = (req, res, next) => {
    const { nhs_number } = req.params;
    const body = req.body;
    updatePatient(nhs_number, body)
        .then((updatedPatient) => {
            console.log(updatedPatient);
            res.status(200).send({ updatedPatient });
        })
        .catch(next);
};

exports.deletePatientByNhsNumber = (req, res, next) => {
    const { nhs_number } = req.body;
    const promises = [
        removePatient(nhs_number),
        validateNhsNumber("patients", "nhs_number", nhs_number),
    ];
    Promise.all(promises)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
};

exports.getAppointmentsByPatient = (req, res, next) => {
    const { patient } = req.params;
    fetchAppointment(patient)
        .then((appointment) => {
            res.status(200).send({ appointment });
        })
        .catch(next);
};

exports.postAppointmentByPatient = (req, res, next) => {
    const newAppointment = req.body;
    insertAppointment(newAppointment)
        .then((appointment) => {
            res.status(201).send({ appointment });
        })
        .catch(next);
};

exports.patchAppointmentByPatient = (req, res, next) => {
    const { patient } = req.params;
    const body = req.body;
    const promises = [
        updateAppointment(patient, body),
        validateNhsNumber("appointments", "nhs_number", nhs_number),
    ];
    Promise.all(promises)
        .then((resolvedPromises) => {
            const appointment = resolvedPromises[0];
            res.status(200).send({ appointment });
        })
        .catch(next);
};
