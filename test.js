const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const difficulties = {
  easy: 10,
  medium: 7,
  hard: 5
};

let highScores = {};
const highScoreFile = 'highscores.json';

if (fs.existsSync(highScoreFile)) {
  highScores = JSON.parse(fs.readFileSync(highScoreFile, 'utf8'));
}

function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function startGame() {
  console.log("Welcome to the Number Guessing Game!");
  console.log("Rules: Try to guess the number between 1 and 100. You have limited attempts based on the difficulty level.");

  rl.question("Choose difficulty (easy, medium, hard): ", (difficulty) => {
    difficulty = difficulty.toLowerCase();
    if (!difficulties[difficulty]) {
      console.log("Invalid difficulty level. Defaulting to medium.");
      difficulty = 'medium';
    }

    let maxAttempts = difficulties[difficulty];
    let numberToGuess = getRandomNumber();
    let attempts = 0;
    let startTime = Date.now();

    console.log(`You have ${maxAttempts} attempts to guess the number.`);
    
    function askGuess() {
      if (attempts >= maxAttempts) {
        console.log(`You've run out of attempts! The correct number was ${numberToGuess}.`);
        playAgain();
        return;
      }

      rl.question("Enter your guess: ", (guess) => {
        let userGuess = parseInt(guess);
        attempts++;

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
          console.log("Please enter a valid number between 1 and 100.");
          askGuess();
          return;
        }

        if (userGuess === numberToGuess) {
          let timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`Congratulations! You guessed the number in ${attempts} attempts and took ${timeTaken} seconds.`);

          if (!highScores[difficulty] || attempts < highScores[difficulty]) {
            highScores[difficulty] = attempts;
            fs.writeFileSync(highScoreFile, JSON.stringify(highScores));
            console.log(`New high score for ${difficulty} difficulty!`);
          }

          playAgain();
        } else {
          console.log(`Incorrect! The number is ${userGuess < numberToGuess ? 'greater' : 'less'} than your guess.`);
          
          if (attempts === Math.floor(maxAttempts / 2)) {
            console.log(`Hint: The number is ${numberToGuess % 2 === 0 ? 'even' : 'odd'}.`);
          }
          askGuess();
        }
      });
    }
    
    askGuess();
  });
}

function playAgain() {
  rl.question("Do you want to play again? (yes/no): ", (answer) => {
    if (answer.toLowerCase() === 'yes') {
      startGame();
    } else {
      console.log("Thanks for playing! See you next time.");
      rl.close();
    }
  });
}

startGame();
