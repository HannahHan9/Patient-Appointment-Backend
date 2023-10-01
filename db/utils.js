const formatPatients = (patientsData) => {
    return patientsData.map(({ nhs_number, name, date_of_birth, postcode }) => {
        return [nhs_number, name, date_of_birth, postcode];
    });
};

const formatAppointments = (appointmentsData) => {
    return appointmentsData.map(
        ({
            id,
            patient,
            status,
            time,
            duration,
            clinician,
            department,
            postcode,
        }) => {
            return [
                id,
                patient,
                status,
                time,
                duration,
                clinician,
                department,
                postcode,
            ];
        }
    );
};

module.exports = { formatPatients, formatAppointments };
