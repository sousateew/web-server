const fs = require("fs")
const express = require("express")
const { WebSocketServer } = require("ws")
const socketServer = new WebSocketServer({ port: 443 })

const app = express()
const port = 80

var wsConnection;

console.clear()

app.use(express.static("public"))

fs.watch("public/", 
    function(event, fileName){
        if (event == "change"){
            console.log(`Arquivo ${fileName} alterado, recarregando página.`)

            setTimeout(console.clear, 1000)
            setTimeout(console.log, `Servidor rodando na porta ${port}`)

            if (wsConnection){
                wsConnection.send("reload")
            } else {
                console.log("wsConnection not exists")
            }
        }
    }
)

socketServer.on("connection", ws => {
    wsConnection = ws

    ws.on("message", data => {
        socketServer.clients.forEach(client => {
            console.log(`distributing message: ${data}`)
            client.send(`${data}`)
        })
    })

    ws.onerror = function () {
        console.log("WebSocket error")
    }
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})