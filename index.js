const PORT = 3000

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'vg',
        address: 'https://www.vg.no/nyheter',
        base:'https://vg.no'
    },

    {
        name: 'dagbladet',
        address: 'https://www.dagbladet.no',
        base:'https://dagbladet.no'
    },

    {
        name: 'nettavisen',
        address: 'https://www.nettavisen.no/nyheter',
        base:'https://nettavisen.no'
    },

    {
        name: 'Tv2',
        address: 'https://www.tv2.no/nyheter',
        base:'https://tv2.no'
    },

    {
        name: 'nrk',
        address: 'https://www.nrk.no/',
        base: ''
    }
]


const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then((response) => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("strøm")', html).each(function(){
           const title= $(this).text()
           const url = $(this).attr('href')
           let Trimmed = title.replace("\\n", "")
           Trimmed = Trimmed.trim();
           

           articles.push({
               
               title: Trimmed,
               url: newspaper.base + url,
               source : newspaper.name
           })
        })
    })
})



app.get('/', (req, res) => {
    res.json('Velkommen til nyhetsside API')
})

app.get ('/nyheter', (req, res) => {
    res.json(articles)  
})

app.get ('/nyheter:id', (req, res)  => {
    console.log(req.params.id)
    const id = req.params.id

    const newspaperAdress =  newspapers.filter(newspaper => newspaper.name == id)[0].address
    newspaperBase = newspapers.filter(newspaper => newspaper.name == id)[0].base
    console.log(newspaperAdress)
    axios.get(newspaperAdress)
    .then (response => {
        const html = response.data
        const $ =   cheerio.load (html)
        const specificarticles = []
        $('a:contains("strøm")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            specificarticles.push({
                title,
                url: newspaperBase + url,
                source: id
            })
        })
        res.json(specificarticles)
    }).catch (err => console.log(err))
})

app.listen(PORT,() => console.log('Server running on port' +PORT))
