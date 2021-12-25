const cheerio = require("cheerio");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

//Question Model import
const Question = require("./model.js");

//Database Connection
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.eruka.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("Database connected !");
});

var page_count = 1; //Globally declared page_count starts from 1
function url() {
  return `https://stackoverflow.com/questions?tab=newest&page=${page_count}`;
}

async function main() {
  while (true) {
    await api_hit();
    await api_hit();
    await api_hit();
    await api_hit();
    await api_hit();
  }
}

async function api_hit() {
  await axios(url())
    .then((result) => {
      console.log("Page: ", page_count);
      const arr = [];
      let $ = cheerio.load(result.data);
      $("div#questions>div.question-summary").each(function () {
        const link = $(this).find("div.summary>h3>a").attr("href");
        const votes = $(this)
          .find(
            "div.statscontainer>div.stats>div.vote>div.votes>span.vote-count-post"
          )
          .text();
        const answers = $(this)
          .find("div.statscontainer>div.stats>div.unanswered>strong")
          .text();
        arr.push({
          url: `https://stackoverflow.com${link}`,
          upvoteCount: votes,
          answerCount: answers,
        });
        // console.log(link);
        // console.log(votes);
        // console.log(answers);
      });
      //Adding data to DB
      await Question.insertMany(arr)
        .then((result) => {
          console.log("Successfull");
        })
        .catch((err) => {
          console.log(err);
        });
      page_count = page_count + 1;
      // console.log(url());
    })
    .catch((err) => {
      console.log(err);
    });
}

main();
