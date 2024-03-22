const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function processInput(userTopic, numberIdeas) {
  console.log(`Your topic is: ${userTopic}`);
  console.log(`Number of ideas to be generated is: ${numberIdeas}`);
  const videoIdea = `Generate ${numberIdeas} ideas for a 1 minute youtube short for the topic ${userTopic}`;
  const videoIdeaResult = await model.generateContent(videoIdea);
  const videoIdeaResponse = await videoIdeaResult.response;
  const VideoIdeaText = videoIdeaResponse.text();
  console.log(VideoIdeaText);
  const generatedScripts =`Generate a voice over script in a paragraph format  for a 1 minute youtube short for all the generated video ideas \n here are the video ideas you generated\n ${VideoIdeaText}`;
  const generatedScriptsResult = await model.generateContent(generatedScripts);
  const generatedScriptsResponse = await generatedScriptsResult.response;
  const generatedScriptsText = generatedScriptsResponse.text();
  console.log(generatedScriptsText);

}

readline.question("Enter a topic: ", (userTopic) => {
  readline.question(
    "Enter the number of video ideas you want to generatte about your topic (MAX 20): ",
    (numberIdeas) => {
      const numIdeas = parseInt(numberIdeas);

      if (isNaN(numIdeas) || numIdeas > 20) {
        console.log("Please enter a valid number less than or equal to 20");

        readline.question(
          "Enter the number of video ideas you want to generatte about your topic (MAX 20): ",
          (numberIdeas) => {}
        );
      } else {
        processInput(userTopic, numIdeas);
        readline.close();
      }
    }
  );
});
