const express = require('express');
const jsonParser = require('body-parser').json();
const uuid = require('uuid-v4');
const path = require('path');

const MAX = 1000; // set maximum number of files in memory
const TIMEOUT = 70000; // delete file after so many ms
let files = [];

const app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3001;
var publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));
app.use(jsonParser);

app.post('/download', (req, res) => {
  const _id = add(req.body);
  res.status(201);
  res.set('Access-Control-Allow-Origin', '*');
  res.send(JSON.stringify({ _id, timer: TIMEOUT }));
  setTimeout(remove, TIMEOUT, _id);
});

app.get('/download/:_id', (req, res) => {
  const { _id } = req.params;
  const { name, content } = files.find(file => file._id === _id);
  res.set({
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Disposition': `attachment; filename=\"${name}.html\"`
  });
  res.send(content);
});

app.listen(port, () => console.log('Listening on port ', + port));

const add = ({ name, content }) => {
  const _id = uuid();
  files.push({ _id, name, content });
  cap(MAX);
  console.log("Added temp file: ", _id);
  return _id;
}

const remove = _id => {
  const index = files.findIndex(file => file._id === _id);
  files.splice(index, 1);
  console.log("Deleted temp file: ", _id);
}

const cap = size => {
  if (files.length > size) {
    console.log("Max files met, deleting temp file: ", files[0]._id);
    files.splice(0, 1);
  }
}
