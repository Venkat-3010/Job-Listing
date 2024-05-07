const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try{
        const token = req.headers.authorization;

        if(!token){
            return res.status(401).json({ message: 'Unauthorized access' }); 
        }

    const decode = json.verify(token, process.env.SECRET_KEY);
    req.currentUser = decode.userId;
    next();
    }catch(err){
        return res.status(401).json({ message: 'Unauthorized access' , isTokenInvalid: True});
    }
};

module.exports = verifyToken;