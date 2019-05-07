var express = require('express');
var ChunkedUpload = require('cs-file-transfer-upload-backend/chunkedUpload.js');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({maxFieldsSize: 15 * 1024 *1024});
var app = express();

var storage = '/home/user/Desktop/test_backend/storage';
var temporary = '/home/user/Desktop/test_backend/temporary';
var chunkedUpload = new ChunkedUpload(storage, temporary);

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

app.listen(3000, function () {
  console.log('Express server listening on port', 3000);
});
