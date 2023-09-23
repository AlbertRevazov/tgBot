const Telegram = require("node-telegram-bot-api");
const commands = require("./data");
const token = "6571457592:AAEpE7ntHJAmhYTnbctUw9N2pxMtxCl995g";

const bot = new Telegram(token, { polling: true });

bot.setMyCommands(commands);
const games = {};

const getCalendar = async () => {
  const today = new Date().toISOString().split("T")[0];

  const options = {
    method: "GET",
    headers: { "X-Auth-Token": "1bb65d5d077f4ccba1280a3735cb9242" },
  };

  const data = await fetch(
    `https://api.football-data.org/v4/teams/109/matches?dateFrom=${today}&dateTo=2023-09-29&?limit=5`,
    options
    
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return data.matches;
};

// getCalendar();
// console.log(games, ";;;");
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    const games = getCalendar();
    return bot.sendMessage(
      chatId,
      `Здраствуйте ${msg.from.first_name} 🫡, это Бот с календарем игр Ювентуса на сезон 2022/2023`
    );
  }

  if (text === "/info") {
    return bot.sendMessage(
      chatId,
      `/nextgame с кем следующая игра? \n/previousgame как закончилась предыдущая?
    `
    );
  }

  if (text === "/nextgame") {
    bot.sendMessage(
      chatId,
      `/nextgame с кем следующая игра? \n/previousgame как закончилась предыдущая?
    `
    );
  }

  if (text === "/info") {
    return bot.sendMessage(
      chatId,
      `/nextgame с кем следующая игра? \n/previousgame как закончилась предыдущая?
        `
    );
  }

  bot.sendMessage(chatId, `Очень интересно, ничего не понял`);
  return bot.sendSticker(
    chatId,
    "https://media.tenor.com/eFEjJdTkVaMAAAAC/allegri-juventus.gif"
  );
});
