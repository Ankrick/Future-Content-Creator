const Users = require("../models/Users");
const createToken = require('../helpers/createToken')

const UserController = {
    me : async(req, res) => {
        return res.json(req.user);
    },
    login : async (req, res) => {
        try{
            let {email, password} = req.body;
            let user = await Users.login(email, password)
            let token = createToken(user._id);
                // Cookie options: in production (deployed) we need secure and sameSite='none'
                const cookieOptions = {
                    httpOnly: true,
                    maxAge: 3 * 24 * 60 * 60 * 1000,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
                };
                res.cookie('jwt', token, cookieOptions);
            return res.json({user,token})

        }catch(e){
            return res.status(400).json({msg : e.message})
        }
    },
    logout : async (req, res) => {
        try{
            res.cookie('jwt', '', { maxAge : 1});
                const cookieOptions = {
                    httpOnly: true,
                    maxAge: 1,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
                };
                res.cookie('jwt', '', cookieOptions);
                return res.json({message : 'user logged out'})
        }catch(e){
            return res.status(400).json({msg : e.message})
        }
    },
    register : async (req, res) =>  {
        try {
            let {name, username, email, password} = req.body;
            let user = await Users.register(name, username, email, password)
            //create token
            let token = createToken(user._id);
            res.cookie('jwt', token, {httpOnly : true, maxAge : 3*24*60*60*1000});
            return res.json({user,token})
        }
        catch(e){
            return res.status(400).json({msg : e.message})
        }
    }
}



module.exports = UserController;