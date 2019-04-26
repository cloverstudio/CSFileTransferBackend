var fs = require('fs');
var path = require('path');

class ChunkedUpload {
	constructor(tempFolderPath) {
		this.tempFolder = tempFolderPath;
		if (!fs.existsSync(path.join(__dirname, `../temporary`))) {
			fs.mkdirSync('temporary');
		}
		if (!fs.existsSync(path.join(__dirname, `../${tempFolderPath}`))) {
			fs.mkdirSync(tempFolderPath);
		}
	}

	post(req, callback) {
		let { slice, fileName, chunkNumber, numberOfChunks, size } = req.body;
		console.log(fileName, chunkNumber, numberOfChunks, slice.length, size);

		let filePath = `./temporary/${size}${fileName}${chunkNumber}`;
		fs.writeFileSync(filePath, Buffer.from(slice, 'base64'));
		console.log(Buffer.from(slice, 'base64').length)
		for (let i = 1; i <= numberOfChunks; i++) {
			if (!fs.existsSync(path.join(__dirname, `../temporary/${size}${fileName}${i}`))) {
				return callback('partially_done');
			} 
		}
		return callback('done');
	}

	merge(fileName, numberOfChunks, size) {
		var mergedFile = fs.createWriteStream(`./storage/${fileName}`);

		for (let i = 1; i <= numberOfChunks; i++) {
			if (fs.existsSync(path.join(__dirname, `../temporary/${size}${fileName}${i}`))) {
				let current = fs.readFileSync(`./temporary/${size}${fileName}${i}`);
				mergedFile.write(current);
			} else {
				console.log('Cant find', i);
			}
		}
	}

	get(req, callback) {
		let fileName = req.query.fileName;
		let numberOfChunks = req.query.numberOfChunks;
		let size = req.query.size;
		let chunks = [];
		let length = 0;
		for (let i = 1; i <= numberOfChunks; i++) {
			if (fs.existsSync(path.join(__dirname, `../temporary/${size}${fileName}${i}`))) {
				chunks.push(true);
				length++;
			} else {
				chunks.push(false);
			}
		}
		return callback({length,chunks})
	}

	clean(fileName, numberOfChunks, size) {
		for (let i = 1; i <= numberOfChunks; i++) {
			if (fs.existsSync(path.join(__dirname, `../temporary/${size}${fileName}${i}`))) {
				fs.unlink(`./temporary/${size}${fileName}${i}`, (error) => {
					if (error){
						console.log('Deleting Error:', `../temporary/${size}${fileName}${i}`, error);
					}
				});
			}
		}
	}
}

module.exports = ChunkedUpload;
