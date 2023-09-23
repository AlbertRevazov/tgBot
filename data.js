const commands = [
  {
    command: "/nextgame",
    description: "скажет с кем следующая игра",
  },
  {
    command: "/previousgame",
    description: "скажет как закончилась предыдущая",
  },
];

const games = [{}];
// const response = await fetch(`${apiUrl}/proxy/calendar/${payload}`);
module.exports = commands;
