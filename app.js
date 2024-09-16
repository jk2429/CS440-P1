//Import libraries
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//App setup
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connect to database
//mongoose.connect("mongodb://127.0.0.1:27017/DATABASENAME");

//Schema for questions/answers
const quizAnswersSchema = new mongoose.Schema({
	Answer: String,
	Correct: bool
});

const quizAnswers = mongoose.model("quizAnswers", quizAnswersSchema);

const quizQuestionsSchema = new mongoose.Schema({
	Question: String,
	QuestionAnswers: [quizAnswers]
});

const quizQuestions = mongoose.model("quizQuestions", quizQuestionsSchema);

//Default page
app.get("/", async function(req, res) {
	
});

app.post("/", async function(req, res) {
	
});

