const express = require('express');
const path = require('path');
const port = process.env.PORT || 8000;
const app = express();

// static file-serving middleware
app.use(express.static(path.join(__dirname, './path/to/static/assets')));

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Mixing it up on port ${port}`);
});
