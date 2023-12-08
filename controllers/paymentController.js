const connectionModel = require("../models/connectionModel");
const paymentModel = require("../models/paymentModel");
const userModel = require("../models/userModel");

exports.createPayment = async (req, res) => {
    try {
        const { toUser, connectionId, ammount, description } = req.body;
        if (toUser && ammount) {
            const fromUser = req.user.userId;
            const payment = await paymentModel.create({
                toUser,
                fromUser,
                ammount,
                description
            });
            const connection = await connectionModel.findOneAndUpdate(
                { _id: connectionId },
                { $push: { payment: payment._id } },
                { new: true }
            );
            res.json({ status: true, payment});
        } else {
            res.status(400).json({ status: false, error: 'Missing required fields (toUser or ammount)' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};

exports.viewPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        if (paymentId) {
            const payment = await paymentModel.findOne({ _id: paymentId });
            if (payment) {
                res.json({ status: true, payment });
            } else {
                res.status(404).json({ status: false, error: 'Payment not found' });
            }
        } else {
            res.status(400).json({ status: false, error: 'Missing paymentId parameter' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};

exports.acceptPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        if (paymentId) {
            const payment = await paymentModel.findOne({ _id: paymentId });
            if (payment && payment.status === 'pending') {
                const toUser = await userModel.findOne({ _id: payment.toUser });
                const fromUser = await userModel.findOne({ _id: payment.fromUser });

                if (toUser && fromUser) {
                    toUser.sentAmmount = parseInt(toUser.sentAmmount) + parseInt(payment.ammount);
                    fromUser.reciveAmmount = parseInt(fromUser.reciveAmmount) + parseInt(payment.ammount);

                    await toUser.save();
                    await fromUser.save();

                    payment.status = 'accepted';
                    await payment.save();

                    res.json({ status: true, message: 'Payment accepted and user amounts updated' });
                } else {
                    res.status(404).json({ status: false, error: 'User not found' });
                }
            } else {
                res.status(404).json({ status: false, error: 'Payment not found or already accepted' });
            }
        } else {
            res.status(400).json({ status: false, error: 'Missing paymentId parameter' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};

exports.paidPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        if (paymentId) {
            const payment = await paymentModel.findOne({ _id: paymentId });
            if (payment && payment.status === 'accepted') {
                const toUser = await userModel.findOne({ _id: payment.toUser });
                const fromUser = await userModel.findOne({ _id: payment.fromUser });

                if (toUser && fromUser) {
                    toUser.sentAmmount = parseInt(toUser.sentAmmount) - parseInt(payment.ammount);
                    fromUser.reciveAmmount = parseInt(fromUser.reciveAmmount) - parseInt(payment.ammount);

                    await toUser.save();
                    await fromUser.save();

                    payment.status = 'paid';
                    await payment.save();

                    res.json({ status: true, message: 'Payment marked as paid and user amounts updated' });
                } else {
                    res.status(404).json({ status: false, error: 'User not found' });
                }
            } else {
                res.status(404).json({ status: false, error: 'Payment not found or not in accepted status' });
            }
        } else {
            res.status(400).json({ status: false, error: 'Missing paymentId parameter' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};

exports.deletePayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        if (paymentId) {
            const payment = await paymentModel.findOneAndDelete({ _id: paymentId });
            if (payment) {
                res.json({ status: true, payment, message: 'Payment deleted successfully' });
            } else {
                res.status(404).json({ status: false, error: 'Payment not found' });
            }
        } else {
            res.status(400).json({ status: false, error: 'Missing paymentId parameter' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};


exports.allPaid = async (req, res) => {
    try {
        const { connectionId } = req.params;
        if (connectionId) {
            const connection = await connectionModel.findOne({ _id: connectionId }).populate('payment');

            if (connection) {
                const payments = connection.payment;
                for (const payment of payments) {
                    if (payment.status === 'accepted') {
                        const toUser = await userModel.findOne({ _id: payment.toUser });
                        const fromUser = await userModel.findOne({ _id: payment.fromUser });

                        if (toUser && fromUser) {
                            toUser.sentAmmount = parseInt(toUser.sentAmmount) - parseInt(payment.ammount);
                            fromUser.reciveAmmount = parseInt(fromUser.reciveAmmount) - parseInt(payment.ammount);

                            await toUser.save();
                            await fromUser.save();

                            payment.status = 'paid';
                            await payment.save();
                        }
                    }
                }

                res.json({ status: true, message: 'All payments within the connection marked as paid' });
            } else {
                res.status(404).json({ status: false, error: 'Connection not found' });
            }
        } else {
            res.status(400).json({ status: false, error: 'Missing connectionId parameter' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Internal server error' });
    }
};