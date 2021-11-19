//Boilerplate (NO TOUCHY)
const svelteApp = require("./public/build/App.js");
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

//Database configs

//Routes for database

//Svelte and express stuff (NO TOUCHY)
app.use(express.static('public'))
app.get('*', (req, res) => {
  const { html } = svelteApp.render({ url: req.url })

  res.write(`${html}`)

  res.end()
})
app.listen(port, () => {
	console.log(`Server is up at port ${port}`)
})

/*
// server.js
const { createServer } = require("http");


createServer((req, res) => {
  const { html } = app.render({ url: req.url });

  res.write(`
    <!DOCTYPE html>
    <div id="app">${html}</div>
    <script src="/dist/bundle.js"></script>
  `);

  res.end();
}).listen(3000);
*/