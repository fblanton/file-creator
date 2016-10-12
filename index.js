const express = require('express');
const jsonParser = require('body-parser').json();
const uuid = require('uuid-v4');

const MAX = 2; // set maximum number of files in memory
const TIMEOUT = 70000; // delete file after so many ms
let files = [];

const app = express();

app.use(express.static('./public'));
app.use(jsonParser);

app.post('/download', (req, res) => {
  const _id = add(req.body);
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

app.listen(3001);

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
