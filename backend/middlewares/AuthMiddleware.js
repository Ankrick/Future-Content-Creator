const jwt = require('jsonwebtoken');
const Users = require('../models/Users')

const AuthMiddleware = (req, res, next) => {
    // First try cookie (used by browser with credentials)
    let token = req.cookies?.jwt;
    const verifyAndAttach = (tokenToVerify) => {
        jwt.verify(tokenToVerify, process.env.JWT_SECRET, (err, decodeValue) => {
            if(err){
                return res.status(401).json({message : 'Unauthenticated'});
            }else{
                Users.findById(decodeValue._id).then(user => {
                    req.user = user;
                    next()
                }).catch(() => {
                    return res.status(401).json({message: 'Unauthenticated'});
                })
            }
        })
    }

    if(token) {
        return verifyAndAttach(token);
    }

    // Fallback: check Authorization header (Bearer token) for API clients
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if(authHeader && authHeader.startsWith('Bearer ')){
        const bearerToken = authHeader.split(' ')[1];
        return verifyAndAttach(bearerToken);
    }

    return res.status(400).json({message : 'token need to provide'});


}

module.exports = AuthMiddleware