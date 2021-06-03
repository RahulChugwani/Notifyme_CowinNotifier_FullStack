const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    email: {type: String, required: true},
    age: {type: Number, required: true},
    pincode: { type: Number, required: true},
},
{
    timsetamps: true,
})

const User = mongoose.model('user', userSchema);
module.exports = User;