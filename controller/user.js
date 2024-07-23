const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res, next) => {
    try{
        const {
            name,
            email,
            password,
            mobile
        } = req.body;
        const formattedEmail = email.toLowerCase();
        if(!name || !email || !password || !mobile){
            return res.status(400).json({
                message: "Please enter all fields",
            });
        }
        const isExistingUser = await User.findOne({ email: formattedEmail });
        if(isExistingUser){
            return res.status(409).json({
                message: 'User already exists'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = new User({
            name,
            email: formattedEmail,
            password:  hashedPassword,
            mobile
        });
        await userData.save();
        res.json({ message: 'User created successfully'});
    } catch (err) {
        next(err);
    }
};

const loginUser = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({
                errorMessage: 'Please fill all the fields'
            });
        }

        const userDetails = await User.findOne({ email: email.toLowerCase() });
        if(!userDetails){
            return res.status(409).json({
                message: 'User not found'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userDetails.password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { userId: userDetails._id },
            process.env.SECRET_KEY,
            { expiresIn: '60h' }
        );
        res.json({
            message: 'Logged in successfully',
            token: token,
            userId: userDetails._id,
            name: userDetails.name,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    registerUser,
    loginUser
};