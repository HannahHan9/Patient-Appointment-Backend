const db = require("./db/connection");
const fs = require("fs/promises");
const {
    validateNhsNumber,
    validateDateOfBirth,
    validatePostcode,
} = require("./db/utils");

exports.fetchPatient = (nhs_number) => {
    if (!validateNhsNumber(nhs_number)) {
        return Promise.reject({ status: 400, msg: "Invalid NHS Number" });
    }
    return db
        .query(`SELECT * FROM patients WHERE nhs_number = $1;`, [nhs_number])
        .then(({ rows }) => {
            if (!rows[0]) {
                return Promise.reject({
                    status: 404,
                    msg: "NHS Number Not Found",
                });
            } else {
                return rows[0];
            }
        });
};

exports.insertPatient = ({ nhs_number, name, date_of_birth, postcode }) => {
    if (!validateNhsNumber(nhs_number)) {
        return Promise.reject({
            status: 400,
            msg: "Invalid NHS Number",
        });
    }
    if (!validateDateOfBirth(date_of_birth)) {
        return Promise.reject({
            status: 400,
            msg: "Invalid Date of Birth",
        });
    }
    if (!validatePostcode(postcode)) {
        return Promise.reject({
            status: 400,
            msg: "Invalid Postcode",
        });
    }
    return db
        .query(
            `INSERT INTO patients (nhs_number, name, date_of_birth, postcode) VALUES ($1, $2, $3, $4) RETURNING *;`,
            [nhs_number, name, date_of_birth, postcode]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.updatePatient = (nhs_number, body) => {
    const { name, postcode } = body;
    return db.query(`UPDATE patients SET name = $1, postcode = $2 WHERE nhs_number = $3;`, [
        name, postcode,
        nhs_number,
    ]);
};

exports.fetchAppointment = (appointment) => {
    if (!validateNhsNumber(nhs_number)) {
        return Promise.reject({ status: 400, msg: "Invalid NHS Number" });
    }
    return db
        .query(`SELECT * FROM appointments WHERE nhs_number = $1;`, [
            nhs_number,
        ])
        .then(({ rows }) => {
            if (!rows[0]) {
                return Promise.reject({
                    status: 404,
                    msg: "NHS Number Not Found",
                });
            } else {
                return rows[0];
            }
        });
};
