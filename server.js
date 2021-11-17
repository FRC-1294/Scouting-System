const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')




//Svelte and express stuff (NO TOUCHY)
app.use(express.static('public'))
app.get('*', (req, res) => {
   res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})
app.listen(port, () => {
   console.log(`Server is up at port ${port}`)
})