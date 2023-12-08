const mongoose = require('mongoose');

let connectionSchema = mongoose.Schema({
    user_1:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    user_2:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    chats:[{
        type:mongoose.Schema.ObjectId,
        ref:'chats'
    }],
    payment:[{
        type:mongoose.Schema.ObjectId,
        ref:'payments'
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('connections',connectionSchema);