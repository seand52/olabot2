import TelegramBot from "node-telegram-bot-api";

type BotOptions = {
    polling: boolean;
}
class ChatBot {
    private bot: TelegramBot
    constructor(token: string, options: BotOptions) {
        this.bot = new TelegramBot(token, options)
    }

    setWebhook(url: string) {
        this.bot.setWebHook(url)
    }

    send(chatId: string,message: string)  {
        this.bot.sendMessage(chatId, message)
    }
}

export default ChatBot;