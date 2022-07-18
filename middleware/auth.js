const jwt = require('jsonwebtoken')
const User = require("../objects/user")
const StatusCodes = require('http-status-codes').StatusCodes;
const auth = async (req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, User.TOKEN_LOCK)
        if (!User.verify_token(decoded,token)) {
            throw new Error()
        }
        req.token = token
        req.userID = decoded
        user=User.get_user_by_ID(decoded);
        if(user.status!="active")
        {
            User.logout(decoded);
            res.status(StatusCodes.FORBIDDEN);
            res.send("User status is "+user.status+", please contact support")
        }
        else
        {
            next()
        }
        
    } catch (e) {
        res.status(StatusCodes.UNAUTHORIZED).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth