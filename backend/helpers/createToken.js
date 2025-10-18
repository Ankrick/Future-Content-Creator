const jwt = require('jsonwebtoken');
maxAge = 3*24*3600

module.exports =  function createToken(_id) {
    return jwt.sign({_id}, process.env.JWT_SECRET , { expiresIn :  maxAge});
}