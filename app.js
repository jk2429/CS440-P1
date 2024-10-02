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

// Function to fill in the database with sample data if it's empty
const fillDatabase = async () => {
  const count = await quizQuestions.countDocuments();
  if (count === 0) {
    const sampleData = [
      {
        Question: "What is the capital of France?",
        QuestionAnswers: [
          { Answer: "Paris", Correct: true },
          { Answer: "London", Correct: false },
          { Answer: "Rome", Correct: false }
        ]
      },
      {
        Question: "What is the largest planet in the solar system?",
        QuestionAnswers: [
          { Answer: "Earth", Correct: false },
          { Answer: "Jupiter", Correct: true },
          { Answer: "Mars", Correct: false }
        ]
      },
      {
        Question: "What is the chemical symbol for water?",
        QuestionAnswers: [
          { Answer: "H2O", Correct: true },
          { Answer: "O2", Correct: false },
          { Answer: "CO2", Correct: false }
        ]
      }
    ];

    // Insert sample data into the database
    await quizQuestions.insertMany(sampleData);
    console.log("Sample data inserted into the database.");
  } else {
    console.log("Database already contains data.");
  }
};

// Call the function to fill the database
fillDatabase().catch(err => console.log(err));

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
		const correctAnswer = questions.QuestionAnswers.find(answer => answer.Correct);
		const userAnswerId = userAnswers[questions.id];
		const isCorrect = correctAnswer && correctAnswer._id.toString() === userAnswerId;
		
		if (isCorrect) {
			score++;
		}
		
		return {
			questions: questions.Question,
			userAnswerId,
			correctAnswer: correctAnswer ? correctAnswer.Answer : null,
			userAnswer: questions.QuestionAnswers.find(answer => answer._id.toString() === userAnswerId)?.Answer || "Not Answered",
			isCorrect
		};
	});
	
	res.render("index", {questions: questions, score: score, feedback: feedback});
});

app.listen(3000, function() {
	console.log("Server Started on port 3000");
});

