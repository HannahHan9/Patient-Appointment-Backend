const {
    fetchPatient,
    insertPatient,
    updatePatient,
    removePatient,
    fetchAppointment,
    insertAppointment,
    updateMissedAppointments,
} = require("./models");

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
            res.status(200).send({ updatedPatient });
        })
        .catch(next);
};

exports.deletePatientByNhsNumber = (req, res, next) => {
    const { nhs_number } = req.params;
    removePatient(nhs_number)
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
    const { patient } = req.params;
    const newAppointment = req.body;
    insertAppointment({...newAppointment, patient})
        .then((appointment) => {
            res.status(201).send({ appointment });
        })
        .catch(next);
};

exports.checkMissedAppointments = (req, res, next) => {
    updateMissedAppointments()
        .then(() => {})
        .catch(next);
};

// exports.patchAppointmentByPatient = (req, res, next) => {
//     const { patient } = req.params;
//     const body = req.body;
//         updateAppointment(patient, body)
//         .then((appointment) => {
//             res.status(200).send({ appointment });
//         })
//         .catch(next);
// };
