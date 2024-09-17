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
mongoose.connect("mongodb://127.0.0.1:27017/QuizDB");

//Schema for questions/answers
const quizAnswersSchema = new mongoose.Schema({
	Answer: String,
	Correct: Boolean
});

const quizAnswers = mongoose.model("quizAnswers", quizAnswersSchema);

const quizQuestionsSchema = new mongoose.Schema({
	Question: String,
	QuestionAnswers: [quizAnswersSchema]
});

const quizQuestions = mongoose.model("quizQuestions", quizQuestionsSchema);

//Default page
app.get("/", async function(req, res) {
	const allQuestions = await quizQuestions.find();
	const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
	const selectedQuestions = shuffledQuestions.slice(0,3);
	
	res.render("index", {questions: selectedQuestions, Score: null, feedBack: null});
});

app.post("/", async function(req, res) {
	const userAnswers = req.body;
	let score = 0;
	
	const questions = await quizQuestions.find().populate('QuestionAnswers');
	
	const feedback = questions.map(questions => {
		const correctAnswer = question.QuestionAnswers.find(answer => answer.Correct);
		const userAnswerId = userAnswers[question.id];
		const isCorrect = correctAnswer && corectAnswer._id.toString() === userAnswerId;
		
		if (isCorrect) {
			score++;
		}
		
		return {
			question: question.Question,
			userAnswerId,
			correctAnswer: correctAnswer ? corectAnswer.Answer : null,
			userAnswer: question.QuestionAnswers.find(answer => answer._id.toString() === userAnswerId)?.Answer || "Not Answered",
			isCorrect
		};
	});
	
	res.render("index", {Questions: questions, Score: score, Feedback: feedback});
});

app.listen(3000, function() {
	console.log("Server Started on port 3000");
});

