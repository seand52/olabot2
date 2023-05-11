import TelegramBot, { Message } from 'node-telegram-bot-api';

import { ChatGPTAPI } from 'chatgpt'
import { FastifyPluginAsync } from 'fastify';
import fs from 'fs';
import schedule from 'node-schedule'

const asyncFs = fs.promises
const token = process.env.TELEGRAM_API_KEY || ''
const bot = new TelegramBot(token, { polling: true })


const writeTextToFile = async (msg: Message) => {
  const firstName = msg.from?.first_name
  const text = msg.text
  const entry = `${firstName}: ${text}\n`
  try {
    await asyncFs.appendFile('convo.txt', entry)
  } catch (_) {
    throw new Error('error appending entry to file')
  }

}


const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_KEY || '',
})


const intro = `Te voy a enviar una serie de mensajes en el siguiente formato:
Nombre: mensaje
Nombre: mensaje
Nombre: mensaje
Quiero que me hagas un resumen de todos los mensajes que he enviado con un tono gracioso. El resumen tiene que tener un maximo de 500 palabras. Quiero que vayas directo al resumen. Gracias`
bot.on('message', async (msg, match) => {
  console.log({ msg, match })
  if (match.type !== 'text') {
    return
  }
  await writeTextToFile(msg)
});

schedule.scheduleJob('0 19 * * *', async function () {
  const prompt = fs.readFileSync('convo.txt', 'utf-8')
    try {
      const result = await api.sendMessage(`${intro}\n${prompt}`)
      console.log(result)
      await bot.sendMessage(-1001987388711, `ola! aqui dejo el resumen de las mierdas que habeis dicho hoy, ${process.env.SECRET_TEXT}`)
      await bot.sendMessage(-1001987388711, result.text || '')
    } catch (e) {
      console.log(e)
    }
    clearFile()
})
const clearFile = () => {
  fs.writeFile('convo.txt', '', (err) => {
    if (err) throw err;
    console.log('File cleared!');
  })
}


const routes: FastifyPluginAsync = async (server) => {
  server.get('/', async function (_, res) {
    const prompt = fs.readFileSync('convo.txt', 'utf-8')
    try {
      const result = await api.sendMessage(`${intro}\n${prompt}`)
      console.log(result)
      await bot.sendMessage(-1001987388711, `ola! aqui dejo el resumen de las mierdas que habeis dicho hoy, ${process.env.SECRET_TEXT}`)
      await bot.sendMessage(-1001987388711, result.text || '')
    } catch (e) {
      console.log(e)
    }
    clearFile()
  });
}

export default routes;
