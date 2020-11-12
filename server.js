var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var Message = mongoose.model("Message", {
  name: String,
  message: String,
});

// var messages = [
//     {name: 'Oni', message: 'Hi'},
//     {name: 'Oye', message: 'Hello'}
// ]

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.Promise = Promise;

var dburl =
  "mongodb+srv://user:tQLVD3ziqYJGCdB@cluster0.upvla.mongodb.net/chatApp";

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.get("/messages/:user", (req, res) => {
    var user = req.params.user
    Message.find({name: user}, (err, messages) => {
      res.send(messages);
    });
  });

app.post("/messages", async (req, res) => {
  try {
    console.log(req.body);
    var message = new Message(req.body);

    var savedMessage = await message.save();
    console.log("saved");

    var censored = await Message.findOne({ message: "badword" });

    if (censored) await Message.remove({ _id: censored.id });
    else io.emit("message", req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);  
  } finally{
      console.log('message post called')
  }

  // .catch((err) => {
  //     res.sendStatus(500);
  //     console.error(err);
  // });
  // messages.push(req.body);
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

mongoose.connect(
  dburl,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    console.log("mongo db connection", err);
  }
);
var server = http.listen(3000, () => {
  console.log("server is listening on port", server.address().port);
});
