const mongoose = require('mongoose');

let paymentSchema = mongoose.Schema({
    toUser:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    fromUser:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    ammount:String,
    description:String,
    status:{
        type:String,
        enum:['pending','accepted','paid'],
        default:'pending'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('payments',paymentSchema);