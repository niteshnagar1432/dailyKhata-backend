const connectionModel = require("../models/connectionModel");
const userModel = require("../models/userModel");

exports.createConnection = async (req, res) => {
    let { fromUser } = req.body;
    if (fromUser) {
        let userId = req.user.userId;
        
        // Check if a connection already exists
        let existingConnection = await connectionModel.findOne({
            $or: [
                { user_1: userId, user_2: fromUser },
                { user_1: fromUser, user_2: userId }
            ]
        });

        if (existingConnection) {
            // Connection already exists
            res.status(200).json({ status: true, message: 'Connection already established', connection: existingConnection });
        } else {
            // Create a new connection
            let connection = await connectionModel.create({
                user_1: userId,
                user_2: fromUser
            });
            
            let user_1 = await userModel.findOneAndUpdate(
                { _id: userId },
                { $push: { connections: connection._id } },
                { new: true }
            );

            let user_2 = await userModel.findOneAndUpdate(
                { _id: fromUser },
                { $push: { connections: connection._id } },
                { new: true }
            );

            res.status(201).json({ status: true, message: 'New connection created', connection: connection });
        }
    } else {
        res.status(404).json({ status: false, message: 'Required parameters are missing' });
    }
};
