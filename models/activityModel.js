const mongoose = require('mongoose');

let activitySchema = mongoose.Schema({
    account:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    activityType:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    message:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('activitys',activitySchema);