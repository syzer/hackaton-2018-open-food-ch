const polka = require('polka')
const { searchIngredient, getIngredientById } = require('./search.js')
const fs = require('fs')
const { concat, countBy, map, prop, pipe, flatten, toPairs, sortBy, last, reverse, take, head } = require('ramda')

const _ = pipe
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)

const db = []

const mockupsRecepies = readFileAsync(__dirname + '/../data/mock_inventory.csv', 'utf-8')
  .then(e => e.split('\n').slice(1).map(e => e.split(',').shift()).map(Number))
  .then(mockupIds => mockupIds.map(getIngredientById).map(e => e.map(({recId}) => recId)))

function two(req, res, next) {
  req.db = db
  next()
}


// ['carrots', 'potatos'] => recepies
mockupsRecepies
  .then(mockupsRecepies => {
    polka()
      .use(one, two)
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

        db[0] = bestMatches

        res.end(JSON.stringify(bestMatches))
      })
      .get('/', (req, res) => {
        res.end(JSON.stringify('pong'))
      })
      .get('/recommendations', (req, res) => {
        res.end(JSON.stringify((db[0])))
      })
      .listen(2001).then(_ => {
      console.log(`> Running on localhost:2001`)
    })

  })
