const polka = require('polka')
const { searchIngredient, getIngredientById } = require('./search.js')
const fs = require('fs')
const { concat, countBy, map, prop, pipe, flatten, toPairs, sortBy, last, reverse, take, head } = require('ramda')
// const { json } = require('body-parser');
const cors = require('cors')({ origin: true })
const serve = require('serve-static')('../data')

const _ = pipe
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)

const db = []

const mockupsRecepies = readFileAsync(__dirname + '/../data/mock_inventory.csv', 'utf-8')
  .then(e => e.split('\n').slice(1).map(e => e.split(',').shift()).map(Number))
  .then(mockupIds => mockupIds.map(getIngredientById).map(e => e.map(({ recId }) => recId)))

// TODO: remove `:` from search because it throws exception
// searching for:  JST-NUMMER:~3
//
// ../hackaton-2018-open-food-ch/backend/node_modules/lunr/lunr.js:3310
// throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
// ^
// Error

// ['carrots', 'potatos'] => recepies
mockupsRecepies
  .then(mockupsRecepies => {
    polka()
      .use(cors, serve) // serve our recepies with pictures
      .get('/expired-items', (req, res) =>
        // All stuff you have that is about to expire
        res.end(JSON.stringify((db[0])))
      )
      .get('/ingredients/:searchterm', (req, res) => {
        const { searchterm } = req.params
        const decodedTerm = decodeURI(searchterm)

        const searchTerms = decodedTerm.replace(/"/g, '').split(',')

        const ingredientFound = searchTerms
          .map(searchIngredient)

        const matches = ingredientFound
        console.log(matches)
        res.end(JSON.stringify(matches))
      })
      // this gives us recommendations
      .get('/recepies/:searchterm', (req, res) => {
        const { searchterm } = req.params
        const decodedTerm = decodeURIComponent(searchterm)

        // TODO amounts and names and prices
        const searchTerms = decodedTerm.replace(/"/g, '').split(',')

        const ingredientFound = searchTerms
          .map(searchIngredient)

        const recipesMatches = _(
          flatten,
          map(prop('recipes')),
          flatten,
        )(ingredientFound)

        const bestMatches = _(
          concat(flatten(mockupsRecepies)),
          countBy(Math.floor),
          toPairs,
          sortBy(last),
          reverse,
          take(5),
          map(_(head, Number)),
        )(recipesMatches)

        db[0] = bestMatches // warning: safe for only one user

        res.end(JSON.stringify(bestMatches))
      })
      .get('/', (req, res) => {
        res.end(JSON.stringify('pong'))
      })
      .get('/recommendations', (req, res) => {
        res.end(JSON.stringify((db[0])))
      }) // TODO not sure if we need that
      .listen(2001).then(_ => {
      console.log(`> Running on localhost:2001`)
    })

  })
