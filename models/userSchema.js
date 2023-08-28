const mongoose = require('mongoose');
// userSchema
const userSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: true
    },
    email:{
        type: 'string',
        required: true,
        unique: true
    },
    password:{
        type: 'string',
        required: true
    }
},{timestamps: true});

//create model instance
userModel = new mongoose.model("User",userSchema);
//export model
module.exports = userModel;

