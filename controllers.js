const { fetchPatient, insertPatient, updatePatient } = require("./models");
const { validateNhsNumber } = require("./db/utils");
const fs = require("fs/promises");

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
    const promises = [
        updatePatient(nhs_number, body),
        validateNhsNumber("patients", "nhs_number", nhs_number),
    ];
    Promise.all(promises)
        .then((resolvedPromises) => {
            console.log("reached here");
            const patient = resolvedPromises[0];
            res.status(200).send({ patient });
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

// exports.getAppointmentByPatient = (req, res, next) => {
//     const { nhs_number } = req.params;
//     fetchAppointment(nhs_number)
//         .then((appointment) => {
//             res.status(200).send({ appointment });
//         })
//         .catch(next);
// };
