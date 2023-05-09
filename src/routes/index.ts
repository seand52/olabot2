import { Configuration, OpenAIApi } from 'openai';

import ChatBot from 'helpers/chatBot';
import { FastifyPluginAsync } from 'fastify';
import fs from 'fs';
import schedule from 'node-schedule'
import { writeTextToFile } from 'helpers/writeToFile';

const token = process.env.TELEGRAM_API_KEY || ''
const bot = new ChatBot(token, { polling: false })
bot.setWebhook('https://0e0d-139-47-41-5.eu.ngrok.io/webhook')


const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const intro = `Te voy a enviar una serie de mensajes en este formato
Nombre: mensaje

Quiero que me hagas un resumen de todos los mensajes que he enviado. El resumen tiene que tener un maximo de 500 palabras. Gracias. Gracias.
`

schedule.scheduleJob('0 22 * * *', async function() {
  console.log('olalaaaaaaaaaaaaaaaaaaaa')
  // const prompt = fs.readFileSync('convo.txt', 'utf-8')
  // try {
  //   const completion = await openai.createCompletion({
  //     model: 'text-davinci-003',
  //     prompt: `${intro}\n${prompt}`,
  //     max_tokens: 1000
  //   })
  //   console.log({completion: completion.data.choices[0].text})
  // } catch (e) {
  //   console.log(e)
  // }
  // clearFile()
})
const clearFile  = () => {
  fs.writeFile('convo.txt', '', (err) => {
    if (err) throw err;
    console.log('File cleared!');
  })
}
const routes: FastifyPluginAsync = async (server) => {
  server.get('/', async function (_, res) {
    // const prompt = fs.readFileSync('convo.txt', 'utf-8')
    // try {
    //   const completion = await openai.createCompletion({
    //     model: 'text-davinci-003',
    //     prompt: `${intro}\n${prompt}`,
    //     max_tokens: 1000
    //   })
    //   console.log({completion: completion.data.choices[0].text})
    // } catch (e) {
    //   console.log(e)
    // }
    // clearFile()
  });

  server.post('/webhook', async (req, res) => {
    const { message } = req.body as any
    console.log({ message })
    if (!message.text) {
      return
    }
    await writeTextToFile(message)
  })
}

export default routes;
