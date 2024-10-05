// bot.js
const TelegramBot = require('node-telegram-bot-api');
const TicTacToe = require('./game');

const token = ''; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });

let game = new TicTacToe();

// Start the bot
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to Tic Tac Toe! Type /play to start a new game.");
});

bot.onText(/\/play/, (msg) => {
    game = new TicTacToe(); // Reset game
    bot.sendMessage(msg.chat.id, `New game started!\n${game.getBoard()}`);
});

bot.onText(/\/move (\d)/, (msg, match) => {
    const position = parseInt(match[1]) - 1;
    const response = game.makeMove(position);
    bot.sendMessage(msg.chat.id, response);
});

bot.onText(/\/reset/, (msg) => {
    game.reset();
    bot.sendMessage(msg.chat.id, "Game reset!\n" + game.getBoard());
});

// Fallback for unknown commands
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text.startsWith('/')) {
        bot.sendMessage(chatId, "Unknown command! Use /play to start or /move <position> to make a move.");
    }
});
