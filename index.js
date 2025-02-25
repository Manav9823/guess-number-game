const readline = require('readline')
const fs = require('fs')
const path = require('path')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const difficulties = {
    easy: 10,
    medium: 7,
    hard: 5
}

let highScores = {}
const SCORE_FILE = path.join(__dirname, 'scores.json')

if(!fs.existsSync(SCORE_FILE)){
    fs.writeFileSync(SCORE_FILE, JSON.stringify({}))
}

highScores = JSON.parse(fs.readFileSync(SCORE_FILE, 'utf-8'))

const getRandomNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
}

function startGame() {
    console.log("Welcome to the Number Guessing Game!");
    console.log("Rules: Try to guess the number between 1 and 100. You have limited attempts based on the difficulty level.");

    rl.question(`Choose a difficulty level: 1.Easy 2.Medium 3.Hard : `, (difficulty) => {
        console.log('difficulty level choosen', difficulty)
        difficulty = difficulty.toLowerCase()

        if (!difficulties[difficulty]) {
            console.log("Invalid difficulty level. Defaulting to medium.");
            difficulty = 'medium';
        }
        const maxAttempts = difficulties[difficulty]
        let numberToGuess = getRandomNumber()
        let attempts = 0
        const startTime = Date.now()

        console.log(`You have ${maxAttempts} attempts to guess the number.`);

        function askGuess() {
            if (attempts >= maxAttempts) {
                console.log(`You've run out of attempts! The correct number was ${numberToGuess}.`);
                playAgain();
                return;
            }

            rl.question('Guess your number: ', (guess) => {
                let number = parseInt(guess)
                attempts++; 
                if(isNaN(number) || number <  0 || number > 100) {
                    console.log('Enter a valid number. You have loosed a attempt')
                    askGuess()
                    return;
                }

                if(number === numberToGuess) {
                    let timeTaken  = ((Date.now() - startTime) / 1000).toFixed(2);
                    console.log(`Congratulations you have guessed the correct number in the attempts ${attempts} and time taken to guess the number is ${timeTaken}`)
                    if(!highScores[difficulty] || attempts < highScores[difficulty]){
                        highScores[difficulty] = attempts
                        fs.writeFileSync(SCORE_FILE, JSON.stringify(highScores))
                        console.log(`New high score for ${difficulty} difficulty!`);
                    }
                    playAgain()
                } else {
                    console.log(`Incorrect! The number is ${number < numberToGuess ? 'greater' : 'less'} than your guess.`);
                    if(attempts === Math.floor(maxAttempts/2)) {
                        console.log(`Hint: The number is ${numberToGuess % 2 === 0 ? 'even' : 'odd'}.`);
                    }
                    askGuess()
                }
            })
        }
        askGuess()
    })
    
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


startGame()