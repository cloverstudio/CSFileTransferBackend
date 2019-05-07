# CSFileTransferBackend

## Description:
Backend implementation for https://www.npmjs.com/package/cs-file-transfer-upload. 

##  How to use:

### Install: 
`npm i cs-file-transfer-upload-backend`

### Import to your module:
`var ChunkedUpload = require('cs-file-transfer-upload-backend/chunkedUpload.js');`

### Create new instance:
```Javascript
var storage = '/home/user/Desktop/test_backend/storage'; // folder for uploaded files
var chunks = '/home/user/Desktop/test_backend/chunks'; // folder to place chunks of files
var chunkedUpload = new ChunkedUpload(storage, chunks);
```
### Post function:
```Javascript
chunkedUpload.post(req, async function (status) {
    if (status === 'done') {
      await chunkedUpload.merge(req.body.fileName, req.body.numberOfChunks, req.body.size);
      await chunkedUpload.clean(req.body.fileName, req.body.numberOfChunks, req.body.size);
    } else if (status === 'partially_done'){
      // do something
    }
});
  // When the last chunk is uploaded it will trigger callback with 
  // status done, use merge function to merge all chunks into one file,
  // and use clean function to delete chunks from chunks folder. 
```
### Get function:
```Javascript
chunkedUpload.get(req, function(chunks) {
    res.send(chunks);
});

// Returns chunk object that looks like this:
{
  chunks: (10) [true, true, false, false, false, false, false, false, false, false],
  length: 2
}
// It shows which chunks have been uploaded and how many.

```

### See example:
See example here: https://github.com/cloverstudio/CSFileTransferBackend
