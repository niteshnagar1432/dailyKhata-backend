const mongoose = require('mongoose');

let appupdateSchema = mongoose.Schema({
    appVersion:String,
    title:string,
    description:String,
    options:{
        type:Array,
        default:[]
    },
    appInstalled:[{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('appupdate',appupdateSchema);