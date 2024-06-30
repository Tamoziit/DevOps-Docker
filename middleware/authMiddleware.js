const protect = (req, res, next) => {
    const {user} = req.session;

    if(!user) {
        return res.status(401).json({
            status: "fail",
            message: "Unauthorized"
        })
    }

    req.user = user; //attaching user object to request

    next(); //redirecting control to next middleware
}

module.exports = protect;