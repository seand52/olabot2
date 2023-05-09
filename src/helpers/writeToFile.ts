import { Message } from "node-telegram-bot-api"
import fs from 'fs'

const asyncFs  = fs.promises


export const writeTextToFile = async(msg: Message) => {
    const firstName = msg.from?.first_name
    const text = msg.text
    const entry = `${firstName}: ${text}\n`
    try {
      await asyncFs.appendFile('convo.txt', entry)
    } catch(_) {
      throw new Error('error appending entry to file')
    }
  
  }