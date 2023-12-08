const twilio = require('twilio');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');
const activityModel = require('../models/activityModel');
const profileModel = require('../models/profileModel');

exports.index = (req,res)=>{
    res.json({msg:'ok'});
}

exports.mobVerify = (req,res)=>{
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    client.messages
        .create({
            body: `You'r Account Verification Code is ${4321} from DailyKhata team.`,
            from: '+12164467281',
            to: '+917693953346'
        })
        .then(message => {
            console.log(message.sid); // Log the message SID for confirmation
            res.status(200).send({data:message,msg:'Message sent successfully!'});
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Failed to send message');
        });
}

exports.SignIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: false, message: 'Invalid username or password...! ' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({ userId: user._id }, process.env.SERCRET_KEY, { expiresIn: '1h' });

            res.json({
                status: true,
                statusCode: 200,
                message: 'Login successful',
                token
            });
        } else {
            res.status(401).json({ status: false, message: 'Incorrect password' });
        }
    } catch (error) {
        res.status(500).json({ status: false, statusCode: 500, message: 'Error during login', error: error.message });
    }
};


exports.SignUp = async (req, res) => {
    const { name, email, password, c_password } = req.body;

    if (password !== c_password || !name || !email || !password) {
        return res.status(400).json({ status: false, message: 'Required parameters are missing or passwords do not match' });
    }

    try {
        const itsUser = await userModel.findOne({ email });

        if (itsUser) {
            return res.status(409).json({ status: false, message: 'User already exists. Please log in.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword 
        });

        const activity = await activityModel.create({
            account: newUser._id,
            message: 'account created'
        });

        newUser.activity.push(activity._id);
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.SERCRET_KEY, { expiresIn: '1h' });

        res.status(201).json({
            status: true,
            message: 'User created successfully',
            token
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error creating user', error: error.message });
    }
};


exports.EditProfile = async (req,res)=>{
    let {name,email,phone} = req.body;
    if(name || email || phone){
        
    }
}

exports.UploadProfile = async (req, res) => {
    let { userId } = req.user;
    if (userId) {
        try {
            let profile = await profileModel.create({
                account: userId,
                url: req.file.filename
            });

            let user = await userModel.findOneAndUpdate(
                { _id: userId },
                { $push: { profile: profile._id } },
                { new: true }
            );

            res.status(200).json({ success: true, message: "Profile uploaded successfully", user });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to upload profile", error });
        }
    } else {
        res.status(400).json({ success: false, message: "User ID not provided" });
    }
};


exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization || req.headers.Authorization;

    if (typeof token !== 'undefined') {
        const tokenString = token.split(' ')[1];

        jwt.verify(tokenString, process.env.SERCRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ status: false, message: 'Token is not valid' });
            }

            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ status: false, message: 'Unauthorized' });
    }
};

exports.Home = async (req,res)=>{
    let user = await userModel.findOne({_id:req.user.userId}).populate('activity'); 
    res.json({user})
}
