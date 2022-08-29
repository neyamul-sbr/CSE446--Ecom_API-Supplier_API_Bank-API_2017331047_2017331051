module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.send({message: "Not Logged In. Log in First"});
    }
    next();
}