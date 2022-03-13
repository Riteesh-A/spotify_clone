const express = require('express')
const cors = require("cors")
const bodyParser = require('body-parser')
const spotifyWebApi = require('spotify-web-api-node')

const app = express()
app.use(cors(
    {
        origin: '*',
        credentials: true
    }

))
app.use(bodyParser.json())

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000/',
        clientId: 'f347f1ba550d4950b864655d55d5db81',
        clientSecret: '77b6958a90ca45a99e7fec0c67187423',
        refreshToken,
})

spotifyApi.refreshAccessToken().then( data => {
    res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
    })
        console.log(data.body)
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(400)
    })
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000/',
        clientId: 'f347f1ba550d4950b864655d55d5db81',
        clientSecret: '77b6958a90ca45a99e7fec0c67187423'
    })

    spotifyApi.authorizationCodeGrant(code).then(data =>{
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch( err =>{
        console.log(err)
        res.sendStatus(400)
    })
})

app.listen(3001)

