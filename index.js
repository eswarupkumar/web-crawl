const cheerio = require("cheerio");
const axios = require("axios");
// const fs = require("fs");

var page_count = 1;
function url() {
  return `https://stackoverflow.com/questions?tab=newest&page=${page_count}`;
}

async function main() {
  await api_hit();
  await api_hit();
}

async function api_hit() {
  await axios(url())
    .then((result) => {
      console.log("Page: ", page_count);
      let $ = cheerio.load(result.data);
      $("div#questions>div.question-summary").each(function () {
        const title = $(this).find("div.summary>h3").text();
        const link = $(this).find("div.summary>h3>a").attr("href");
        const votes = $(this)
          .find(
            "div.statscontainer>div.stats>div.vote>div.votes>span.vote-count-post"
          )
          .text();
        const answers = $(this)
          .find("div.statscontainer>div.stats>div.unanswered>strong")
          .text();
        console.log(title);
        console.log(link);
        console.log(votes);
        console.log(answers);
      });
      page_count = page_count + 1;
      // console.log(url());
    })
    .catch((err) => {
      console.log(err);
    });
}

main();
