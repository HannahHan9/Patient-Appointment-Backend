const seed = require("./seed");
const db = require("../connection");
const patientsDevData = require("../data/development-data/patients.json");
const appointmentsDevData = require("../data/development-data/appointments.json");

const runSeed = () => {
    return seed(patientsDevData, appointmentsDevData).then(() => db.end());
};

runSeed();
