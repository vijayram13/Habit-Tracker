const mongoose = require('mongoose');

// habitSchema
const habitSchema = new mongoose.Schema({
  habit_name: { type: String, required: true },
  days: [
    {
      id: { type: String, required: true, unique: true },
      date: { type: Date, required: true },
      status: { type: String, enum: ['done', 'not done', 'none'], default: 'none' },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
});


// habit Model
const habitModel = mongoose.model('Habit', habitSchema);

// export model
module.exports = habitModel;

