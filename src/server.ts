const app = require('./app')
const port = 2297

app.listen(port, () => {
    console.log(`O servidor está online na porta ${port}`)
})