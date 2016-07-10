'use strict';

var express = require("express")
var router = express.Router()
var Question = require("./models").Question;

// Express trigger
router.param("qID", function(req, res, next, id){
  Question.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc) {
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.question = doc;
    return next();
  });
});

// As the app handles the request to the router it strips away what is already matched
// GET /questions
// Route for questions collection
router.get("/", function(req, res, next){
  // mongoose query builder
  Question.find({})
          .sort({createdAt: -1})
          .exec(function(err, questions){
                  if(err) return next(err);
                  res.json(questions);
  });
  res.json({response: "You sent me a GET request"});
});

// POST /questions
// Route for creating questions
router.post("/", function(req, res, next){
  var question = new Question(req.body);
  question.save(function(err, question){
    if(err) return next(err);
    res.status(201);
    res.json(question);
  });
  res.json({
    response: "You sent me a POST request",
    // body: req.body
  });
});

// GET /questions/:id
// Route for specific questions
router.get("/:qID", function(req, res, next){
  res.json(req.question);
  res.json({response: "You sent me a GET request for ID " + req.params.qID});
});

// POST /questions/:id/answers
// Route for creating an answer
router.post("/:qID/answers", function(req, res){
  res.json({
    response: "You sent me a POST request to /answers",
    questionId: req.params.qID,
    body: req.body
  });
});

// PUT /questions/:qID/answers/:aID
// Edit a specific answer
router.put("/:qID/answers/:aID", function(req, res){
  res.json({
    response: "You sent me a PUT request to /answers",
    questionId: req.params.qID,
    answerID: req.params.aID,
    body: req.body
  });
});

// DELETE /questions/:qID/answers/:aID
// Delete a specific answer
router.delete("/:qID/answers/:aID", function(req, res){
  res.json({
    response: "You sent me a DELETE request to /answers",
    questionId: req.params.qID,
    answerID: req.params.aID
  });
});

// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/vote-down
// Vote on a specific answer
// Note ":dir" is a variable name for direction. i.e up or down
router.post("/:qID/answers/:aID/vote-:dir", function(req, res, next){
  if(req.params.dir.search(/^(up|down)$/) === -1){
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  } else {
      next();
  }
}, function(req, res){
  res.json({
    response: "You sent me a POST request to /vote-" + req.params.dir,
    questionId: req.params.qID,
    answerID: req.params.aID,
    vote: req.params.dir
  });
});



module.exports = router;
