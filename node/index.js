const WebSocket = require('ws')
const wss = new WebSocket.Server({port:8085})

// 存储所有连接的客户端
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('WebSocket连接已建立');
  ws.readyState === WebSocket.OPEN && clients.add(ws)
  ws.on('message', (message) => {
    // 处理接收到的消息
    const chessMessage = JSON.parse(message.toString())
    console.log(clients.size);
    if(chessMessage.sign === 'start' && clients.size > 1){
      chessMessage.seacherPeople = false
    }else if(chessMessage.sign === 'move'){
      
    }
    const webmessage = Buffer.from(JSON.stringify(chessMessage))
    // 发送消息给客户端
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(webmessage);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket连接已关闭');
    clients.delete(ws);
  });
});