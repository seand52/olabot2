import { Configuration, OpenAIApi } from 'openai';
import TelegramBot, { Message } from 'node-telegram-bot-api';

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

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const intro = `Te voy a enviar una serie de mensajes en este formato
Nombre: mensaje

Quiero que me hagas un resumen de todos los mensajes que he enviado. El resumen tiene que tener un maximo de 500 palabras. Gracias. Gracias.
`
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
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${intro}\n${prompt}`,
      max_tokens: 1000
    })
    console.log({ completion: completion.data.choices[0].text })
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
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${intro}\n${prompt}`,
        max_tokens: 1000
      })
      console.log({ completion: completion.data.choices[0].text })
    } catch (e) {
      console.log(e)
    }
    clearFile()
  });
}

export default routes;
