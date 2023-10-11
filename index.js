require("dotenv").config();
const Telegram = require("node-telegram-bot-api");
const commands = require("./data");
const token = process.env.token;

export TELEGRAM_API_TOKEN=... # YOUR TELEGRAM API TOKEN
export TELEGRAM_WEBHOOK_URL=... # YOUR CYCLIC DEPLOYMENT URL

curl "https://api.telegram.org/bot$TELEGRAM_API_TOKEN/setWebhook?url=$TELEGRAM_WEBHOOK_URL"

const bot = new Telegram(token, { polling: true });
bot.setMyCommands(commands);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    return bot.sendMessage(
      chatId,
      `Здраствуйте ${msg.from.first_name} 🫡, это Бот с календарем игр Ювентуса на сезон 2022/2023
      \nHello ${msg.from.first_name} 🫡, this is a Bot with the Juventus games calendar for the 2022/2023 season`
    );
  }

  if (text === "/previousgame") {
    try {
      let game;
      const today = new Date().toISOString().split("T")[0];
      const options = {
        method: "GET",
        headers: { "X-Auth-Token": "1bb65d5d077f4ccba1280a3735cb9242" },
      };

      await fetch(
        `https://api.football-data.org/v4/teams/109/matches?dateFrom=2023-08-29&?${today}&dateTo=${today}&?limit=1`,
        options
      )
        .then((response) => response.json())
        .then(
          (response) => (game = response.matches[response.matches.length - 1])
        )
        .catch((err) => console.error(err));

      const message = `${game.competition.name} - ${game.matchday} тур\n${
        game.utcDate.toString().split("T")[0]
      }\n${game.homeTeam.name} ${game.score.fullTime.home} - ${
        game.score.fullTime.away
      } ${game.awayTeam.name}`;

      return bot.sendMessage(chatId, message);
    } catch (error) {
      bot.sendMessage(chatId, `Что то пошло не так, повторите попытку позже`);
    }
  }

  if (text === "/nextgame") {
    try {
      let game;
      const today = new Date().toISOString().split("T")[0];
      const options = {
        method: "GET",
        headers: { "X-Auth-Token": "1bb65d5d077f4ccba1280a3735cb9242" },
      };

      await fetch(
        `https://api.football-data.org/v4/teams/109/matches?dateFrom=${today}&dateTo=2024-09-29&?limit=1`,
        options
      )
        .then((response) => response.json())
        .then((response) => (game = response.matches[0]))
        .catch((err) => console.error(err));

      const message = `${game?.competition.name} - ${
        game.season.currentMatchday
      } тур\n${game.utcDate.toString().split("T")[0]} --- ${
        game.utcDate.toString().split("T")[1]
      }\n${game.homeTeam.name} - ${game.awayTeam.name}`;

      return bot.sendMessage(chatId, message);
    } catch (error) {
      bot.sendMessage(chatId, `Что то пошло не так, повторите попытку позже`);
    }
  }

  if (text === "/scorers") {
    try {
      let game;
      let message = "";
      const options = {
        method: "GET",
        headers: { "X-Auth-Token": "1bb65d5d077f4ccba1280a3735cb9242" },
      };

      await fetch(
        `https://api.football-data.org/v4/competitions/SA/scorers?limit=5`,
        options
      )
        .then((response) => response.json())
        .then((response) => (game = response))
        .catch((err) => console.error(err));

      game.scorers.map(
        (scorer) =>
          (message += `${scorer.player.name} ${scorer.goals} - ${
            scorer.assists || 0
          }\n`)
      );
      return bot.sendMessage(chatId, message);
    } catch (error) {
      bot.sendMessage(chatId, `Что то пошло не так, повторите попытку позже`);
    }
  } else if (text) {
    bot.sendMessage(chatId, `Очень интересно... 🤔, ничего не понял `);
    return bot.sendSticker(
      chatId,
      "https://media.tenor.com/sDq4bdoa6IwAAAAd/allegri-no.gif"
    );
  }
});
