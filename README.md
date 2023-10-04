# Patient Appointment Network Data Application

This is an MVP tool called the Patient Appointment Network Data Application (PANDA). The PANDA tracks patient demographic data and associated appointments for each patient.

## Getting Started

### Dependencies

In order to run the project you will need:

-   Node.js v16 or later
-   PostgreSQL 14 or later

### Installation

1. Clone the repository.
    ```bash
    git clone https://github.com/HannahHan9/Patient-Appointment-Backend.git
    ```
2. `cd` into the cloned repository directory.

3. Install NPM packages.
    ```bash
    npm install
    ```
4. Run the script to set up the test and development databases.
    ```bash
    npm run setup-dbs
    ```
5. Create two `.env` files in the root of the project.
   In `.env.development` add PGDATABASE=patient_appointments and in `.env.test` add PGDATABASE=patient_appointments_test.
6. Seed the development database.
    ```bash
    npm run seed
    ```

### Tests

Run all tests for the project.

```bash
npm test
```

# How to get the API running

-   please run npm start

# How to interact with the API

-
