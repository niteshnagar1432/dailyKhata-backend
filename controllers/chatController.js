const chatsModel = require("../models/chatsModel");
const connectionModel = require('../models/connectionModel');

exports.createChat = async (req, res) => {
    let { toUser, connectionId, msgType, message } = req.body;
    let fromUser = req.user.userId;

    if (toUser) {
        let newChat;
        if (msgType === 'text') {
            newChat = await chatsModel.create({
                toUser,
                fromUser,
                msgType,
                message
            });
            await connectionModel.findOneAndUpdate(
                { _id: connectionId },
                { $push: { chats: newChat._id } },
                { new: true }
            );
        } else if (msgType === 'document' || msgType === 'image') {
            const fileUrl = req.file.filename; // Access the filename without the folder structure

            newChat = await chatsModel.create({
                toUser,
                fromUser,
                msgType,
                message,
                url: fileUrl
            });

            await connectionModel.findOneAndUpdate(
                { _id: connectionId },
                { $push: { chats: newChat._id } },
                { new: true }
            );
        }

        res.status(201).json({ status: true, message: 'Chat created', chat: newChat });
    } else {
        res.status(400).json({ status: false, message: 'Missing "toUser" parameter' });
    }
};

exports.deleteChat = async (req, res) => {
    const { chatId } = req.params;
    if (chatId) {
        try {
            let chat = await chatsModel.findOneAndDelete({ _id: chatId });
            if (chat) {
                res.json({ message: 'Chat deleted successfully', deletedChat: chat });
            } else {
                res.status(404).json({ error: 'Chat not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(400).json({ error: 'Missing chatId parameter' });
    }
};

exports.viewChat = async (req, res) => {
    const { chatId } = req.params;
    if (chatId) {
        try {
            let chat = await chatsModel.findOne({ _id: chatId });
            if (chat) {
                res.json({ status: true, message: 'Chat found', chat });
            } else {
                res.status(404).json({status: false, error: 'Chat not found' });
            }
        } catch (error) {
            res.status(500).json({status: false, error: 'Internal server error' });
        }
    } else {
        res.status(400).json({status: false, error: 'Missing chatId parameter' });
    }
};

