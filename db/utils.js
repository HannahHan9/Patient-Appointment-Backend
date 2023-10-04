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


const validateNhsNumber = (nhs_number) => {
    const lastDigit = parseInt(nhs_number[9]);
    const firstNineDigits = nhs_number.split("").slice(0, -1);
    let sumOfMultiplication = 0;
    let factor = 10;
    firstNineDigits.forEach((digit) => {
        sumOfMultiplication += parseInt(digit) * factor;
        factor--;
    });
    const dividedByEleven = sumOfMultiplication % 11;
    const checkDigit = 11 - dividedByEleven;
    return lastDigit === checkDigit;
};

// const generateNhsNumbers = () => {
//     validNumbers = [];
//     for (let i = 1111111111; i < 1111122222; i++) {
//         if (validateNhsNumber(i.toString())) {
//             validNumbers.push(i.toString());
//         }
//     }
//     return validNumbers;
// };

const validateDateOfBirth = (date_of_birth) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date_of_birth);
};

const validatePostcode = (postcode) => {
    const regex = /^[A-Za-z]{1,2}\d{1,2}\s*\d[A-Za-z]{2}$/;
    return regex.test(postcode);
};
// console.log(validateDateOfBirth("19972-04-05"));
console.log(validateNhsNumber("1111111146"))
module.exports = {
    formatPatients,
    formatAppointments,
    validateNhsNumber,
    validateDateOfBirth,
    validatePostcode,
};
