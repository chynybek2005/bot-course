const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6525683936:AAEogiQo6fZCvLe-zMf3UCTRi9NV6vAFdf0'

const bot = new TelegramApi(token, {polling: true})


const chats = {}


const startGame = async(chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю число от 0 до 9, а ты должен ее угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}


const start = () => {
    
bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Игра угадай цифру'},
])

bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    console.log(msg)

    if(text === '/start') {
       await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp')
       return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот, автор Chika')
    }

    if(text === '/info') {
       return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}, username: ${msg.from.username}`)
    }

    if(text === '/game') {
        return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуйте еще раз!')
})

bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if(data === '/again') {
        return startGame(chatId)
    }

    if(data === chats[chatId]) {
        return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
    } else {
        return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
    }
})
}

start()