const express = require('express');
const passport = require('passport');
// habit model
const habitModel = require('../models/habitSchema');



// to show the user habits
module.exports.habits = async (req, res) => {
  try {
    // get the userid
    const userId = req.params.userId;

    // check user is authenticated or not
    if (req.isAuthenticated() && req.user.id === userId) {

      // habits of the user
      const habits = await habitModel.find({ user: userId });

      // today's date
      const date = new Date();

      // weekday
      let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      // change days according to the current date
      days = days.slice(date.getDay() + 1).concat(days.slice(0, date.getDay() + 1));

      const month = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
      // render the dashboard page
      return res.render('dashboard-page', {
        date: ` ${date.getDate()} ${month[date.getMonth()]}  ${date.getFullYear()}`,
        days: days,
        habits: habits.reverse(),
      });
      
    }

    return res.redirect(`/HabitTracker/habits/${req.user.id}`);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch habits.' });
  }
}

// Route to add a new habit
module.exports.add_habit = async (req, res) => {
  try {
    // get form data
    let  { name } = req.body;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    // userId
    const userId = req.params.userId;
    
    // Today's date
    const today = new Date();
    // check habit existence
    const existingHabit = await habitModel.findOne({ user: userId, habit_name: name });

    if (existingHabit) {
      return res.redirect("back");
    }


    // create a new habit
    const habit = await habitModel.create({ user: userId, habit_name: name });
   
    if (habit) {
      // push the 6days status none
      for (let i = 0; i < 7; i++) {
        const s_date = new Date();
        s_date.setDate(today.getDate() - i);
        // dailyStatus.push(startdate.toISOString().slice(0, 10));
        habit.days.push({ id: habit.id + `_${i}`, date: s_date, status: "none" });

      }
    }

    // save the new habit to the database
    await habit.save();

    // send response to ajax request
    return res.status(200).json({
      habit: habit
    });

  } catch (error) {
    // show the error message
    res.status(500).json({ error: 'Failed to add habit.' });
  }
};

// Route to mark a habit status for today
module.exports.today_update = async (req, res) => {
  try {
    // all required variables
    const { status } = req.body;
    const habitId = req.params.habitId;

    // retrieve data from database
    const habit_status = await habitModel.findOne({ _id: habitId });
    if (!habit_status) {
      return res.status(404).json({ error: 'Habit not found.' });
    }

    // today's date
    const today = new Date();

    // get the days field from database
    const update = habit_status.days.find(update => update)

    // update the status by id
    if (update.id == habitId + "_0") {
      update.date = today;
      update.status = status;
    }

    // to save the status
    await habit_status.save();
    // show the habit with the status
    res.json(habit_status);

  } catch (error) {
    // show the error message
    res.status(500).json({ error: 'Failed to update habit status.' });
  }
};

module.exports.status_update = async (req, res) => {
  try {

    // required data
    const status  = req.query.status;
    const habitId = req.params.habitId;
    const itemId = req.query.itemId;

    // today's date
    const today = new Date();

    // to find the habit by its id
    const habit_status = await habitModel.findOne({ _id: habitId });
    

    // calculate the date to update status
    const day_to_update = today.setDate(today.getDate() - itemId);
    // collection of Ids
    const existingId = [];

    habit_status.days.forEach(element => {
      existingId.push(element.id);
    });

    // update the status by date(within 6days)
    if (existingId.includes(`${habitId}_${itemId}`)) {
    
      // index of the item
      const index = existingId.indexOf(`${habitId}_${itemId}`);

      habit_status.days[index].status = status;
      habit_status.days[index].date = day_to_update;

    }
    else {
      // updated(this line is not necessary)
      habit_status.days.push({ id: `${habitId}_${itemId}`, date: day_to_update, status: status });
    }

    // save the status to the database
    await habit_status.save();

    res.json(habit_status);

  } catch (error) {
    return res.status(404).json({ error: error });
  }
};