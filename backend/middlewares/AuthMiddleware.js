const jwt = require('jsonwebtoken');
const Users = require('../models/Users')

const AuthMiddleware = (req, res, next) => {
    let token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodeValue) => {
            if(err){
                return res.status(401).json({message : 'Unauthenticated'});
            }else{
                Users.findById(decodeValue._id).then(user => {
                    req.user = user;
                    next()
                })
            }
        })
    }else {
        return res.status(400).json({message : 'token need to provide'});
    }


}

module.exports = AuthMiddleware