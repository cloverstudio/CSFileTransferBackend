var express = require('express');
var config = require('./init.js');
var ChunkedUpload = require('./chunkedUpload.js');
var chunkedUpload = new ChunkedUpload('storage');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({maxFieldsSize: 15 * 1024 *1024});
var app = express();


app.use(express.static(__dirname + './public'));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE');
    return res.status(200).json({});
  }
  next();
});

app.post('/upload', multipartyMiddleware, async function (req, res) {
  chunkedUpload.post(req, async function (status) {
    if (status === 'done') {
      await chunkedUpload.merge(req.body.fileName, req.body.numberOfChunks, req.body.size);
      await chunkedUpload.clean(req.body.fileName, req.body.numberOfChunks, req.body.size);
    }
  });
  res.send();
});

app.get('/upload', function(req, res) {
  chunkedUpload.get(req, function(chunks) {
    res.send(chunks);
  });
});

app.listen(config.port, function () {
  console.log('Express server listening on port', 3000);
});
