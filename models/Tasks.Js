const mongoose = require("mongoose");
const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);

const taskSchema = new mongoose.Schema({
  createdAt: {
    required: true,
    default: Date.now(),
    type: Date,
  },
  endDate: {
    required: true,
    type: Date,
  },
  createrUser: {
    user_id: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  usersTasked: [
    {
      user_id: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Tasks = mongoose.Schema("Tasks", taskSchema);

function validateTasks(tasks) {
  const schema = joi.object({
    createdAt: joi.date(),
    endDate: joi.date().required(),
    createrUser: joi.object({
      user_id: joi.required().objectId(),
    }),
    usersTasked: joi.array().items(
      joi.object({
        user_id: joi.required().objectId(),
      })
    ),
  });
  return schema.validate(tasks);
}

module.exports = Tasks;
module.exports = validateTasks;
