const mongoose = require('mongoose');

let chatSchema = mongoose.Schema({
    toUser:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    fromUser:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    msgType:{
        type:String,
        enum:['text','document','image'],
        default:'text'
    },
    message:String,
    url:String,
    seen:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('chats',chatSchema);