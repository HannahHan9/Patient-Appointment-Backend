const db = require("./db/connection");
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
    if (!validateNhsNumber(nhs_number)) {
        return Promise.reject({
            status: 400,
            msg: "Invalid NHS Number",
        });
    }
    const { name, postcode } = body;
    const valueToUpdate = name || postcode;
    let fieldToUpdate = "name";
    if (postcode) {
        fieldToUpdate = "postcode";
    } else if (!name && !postcode) {
        return Promise.reject({
            status: 400,
            msg: "Cannot update invalid fields",
        });
    }
    if (valueToUpdate === postcode && !validatePostcode(valueToUpdate)) {
        return Promise.reject({
            status: 400,
            msg: "Invalid Postcode",
        });
    }
    return db
        .query(
            `UPDATE patients SET ${fieldToUpdate} = $1 WHERE nhs_number = $2 RETURNING *;`,
            [valueToUpdate, nhs_number]
        )
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

exports.removePatient = (nhs_number) => {
    if (!validateNhsNumber(nhs_number)) {
        return Promise.reject({
            status: 400,
            msg: "Invalid NHS Number",
        });
    }
    return db
        .query(`DELETE FROM appointments WHERE patient = $1;`, [nhs_number])
        .then(() => {
            return db.query(
                `DELETE FROM patients WHERE nhs_number = $1 RETURNING *;`,
                [nhs_number]
            );
        })
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

exports.fetchAppointment = (patient) => {
    if (!validateNhsNumber(patient)) {
        return Promise.reject({ status: 400, msg: "Invalid NHS Number" });
    }
    return db
        .query(`SELECT * FROM appointments WHERE patient = $1;`, [patient])
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

exports.insertAppointment = ({
    id,
    patient,
    status,
    time,
    duration,
    clinician,
    department,
    postcode,
}) => {
    if (!validateNhsNumber(patient)) {
        return Promise.reject({
            status: 400,
            msg: "Invalid NHS Number",
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
            `INSERT INTO appointments (id, patient, status, time, duration, clinician, department, postcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
            [
                id,
                patient,
                status,
                time,
                duration,
                clinician,
                department,
                postcode,
            ]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.updateMissedAppointments = () => {
    console.log("updating missed appointments...");
    return db
        .query(
            `UPDATE appointments
    SET status = $1 WHERE time + $2 < CURRENT_DATE AND status = $3 RETURNING *;`,
            ["missed", "00:15:00", "active"]
        )
        .then(({ rows }) => {
            return db.query(`SELECT * FROM appointments;`);
        })
        .then(({ rows }) => {});
};

//exports.updateAppointment =() => {}
