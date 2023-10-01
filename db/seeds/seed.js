const format = require("pg-format");
const db = require("../connection");
const { formatPatients, formatAppointments } = require("../utils");

const seed = (patientsData, appointmentsData) => {
    return db
        .query(`DROP TABLE IF EXISTS appointments;`)
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS patients;`);
        })
        .then(() => {
            return db.query(
                `CREATE TABLE patients (nhs_number VARCHAR(10) PRIMARY KEY, name VARCHAR(40) NOT NULL, date_of_birth DATE NOT NULL, postcode VARCHAR(8) NOT NULL);`
            );
        })
        .then(() => {
            return db.query(
                `CREATE TABLE appointments (id VARCHAR(36) PRIMARY KEY, patient VARCHAR(10) NOT NULL REFERENCES patients(nhs_number), status text CHECK (status IN ('active', 'attended', 'missed', 'cancelled')), time TIMESTAMP WITH TIME ZONE, duration VARCHAR(6) NOT NULL, clinician VARCHAR(40) NOT NULL, department VARCHAR(20) NOT NULL, postcode VARCHAR(8) NOT NULL);`
            );
        })
        .then(() => {
            const formattedPatients = formatPatients(patientsData);
            const insertPatientsStr = format(
                "INSERT INTO patients (nhs_number, name, date_of_birth, postcode) VALUES %L;",
                formattedPatients
            );
            return db.query(insertPatientsStr);
        })
        .then(() => {
            console.log(appointmentsData)
            const formattedAppointments = formatAppointments(appointmentsData);
            const insertAppointmentsStr = format(
                "INSERT INTO appointments (id, patient, status, time, duration, clinician, department, postcode) VALUES %L;",
                formattedAppointments
            );
            return db.query(insertAppointmentsStr);
        });
};

module.exports = seed;
