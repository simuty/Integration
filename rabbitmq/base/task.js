var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'task_queue';
    var msg = process.argv.slice(2).join(' ') || "Hello World!";

    channel.assertQueue(queue, {
      durable: true
    });

    var i =0;
    while(i<100){
        channel.sendToQueue(queue, Buffer.from(String(i)), {
            persistent: true
          });
        console.log(` [${i}] Sent ${msg}`);
        i++;
    }
  });
  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});