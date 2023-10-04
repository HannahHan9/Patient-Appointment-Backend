exports.handlePsqlErrors = (err, req, res, next) => {
    console.log(err);
    // if (err.code === "22001") {
    //     res.status(400).send({ msg: "Invalid Name" });
    // } else
    if (err.code === "23502") {
        res.status(400).send({ msg: "Invalid Name" });
    } else {
        next(err);
    }
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
};
