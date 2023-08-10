const router = require("express").Router();

router.use("/user_info", require("./user_info"));
router.use("/login", require("./login"));

router.use((req,res,next) => {
    const error = new Error("404 Not Found");
    error.status = 404;
    next(error);

});

module.exports = router;