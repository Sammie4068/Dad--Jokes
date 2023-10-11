const axios = require("axios");
const fs = require("fs");
const prompt = require("prompt");

// MAKING API REQUEST
const dadJokes = async (searchedTerm) => {
  try {
    const apiResponse = await axios.get(
      `https://icanhazdadjoke.com/search?term=${searchedTerm}`,
      {
        headers: { Accept: "application/json" },
      }
    );
    // console.log(apiResponse);

    const jokes = apiResponse.data.results; //console.log(jokes);
    if (jokes.length === 0)
      console.log(`No jokes found for ${searchedTerm}`);

    const dadJoke = jokes[Math.floor(Math.random() * jokes.length)].joke;
    console.log(`Joke: ${dadJoke}🤣🤣🤣`);

    // SAVING JOKES TO JOKES.TXT
    fs.appendFile("jokes.txt", `${dadJoke}\n`, (err) => {
      if (err) console.log(`Error saving joke to file: ${err}`);
      // console.log(`Joke saved to jokes.txt`);
    });
  } catch (error) {
    console.error(`An error occuried: ${error.message}`);
  }
};

// GETTING THE MOST POPULAR JOKE
const mostPopularJoke = () => {
  fs.readFile("jokes.txt", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const jokes = data.trim().split("\n").filter(Boolean);
      // console.log(jokes);
      const jokeCountObj = {};
      jokes.forEach((joke) => {
        jokeCountObj[joke] = (jokeCountObj[joke] || 0) + 1;
      });
  
      const sortedJokes = Object.entries(jokeCountObj).sort(
        (a, b) => b[1] - a[1]
      );
      if (sortedJokes.length === 0) {
        console.log("No jokes in jokes.txt");
      } else {
        const highestCount = sortedJokes[0][1];
        const highestCountJokes = sortedJokes.filter(
          (a) => a[1] === highestCount
        );
        const any = Math.floor(Math.random() * highestCountJokes.length);
        console.log(`Most Popular Joke: ${highestCountJokes[any][0]}🤣🤣🤣`);
      }
    }
  });
};

// GET INPUT FROM USER
const promptJoke = () => {
  prompt.start();
  prompt.get(["JokeTerm"], (err, result) => {
    if (err) console.log(`Error: ${err}`);

    const joketerm = result.JokeTerm.trim();

    if (joketerm === "leaderboard") {
      mostPopularJoke();
    } else {
      dadJokes(joketerm);
    }
  });
};

// START THE PROGRAM
promptJoke();
