'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var sortAnswers = function(a, b){
  // return - if a appears before b
  // return 0 if no change
  // return + if a after b
    if(a.votes === b.votes){
      // you can subtract date objects in JavaScript--the difference will be in milliseconds
      return b.updatedAt - a.updatedAt;
    }
  return b.votes - a.votes;
};

var AnswerSchema = new Schema({
  text: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  votes: {type: Number, default: 0}
});

// updated answers
AnswerSchema.method("update",  function(updates, callback){
  // merge the updates into the answer document
  Object.assign(this, updates, {updatedAt: new Date()});
  this.parent().save(callback);
});

// voting on answers
AnswerSchema.method("vote", function(vote, callback){
  if(vote === "up"){
    this.votes += 1;
  } else {
    this.votes -= 1;
  }
  this.parent().save(callback);
});

var QuestionSchema = new Schema({
  text: String,
  createdAt: {type: Date, default: Date.now},
  answers: [AnswerSchema]
});

//pre-save callback
QuestionSchema.pre("save", function(next){
  this.answers.sort(sortAnswers);
  next();
});



// create model
var Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;
