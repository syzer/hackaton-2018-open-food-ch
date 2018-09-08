const lunr = require('lunr')
const { log } = console
const { replacr } = require('./replacr.js')

const recipies = require('../data/rezepte.json')
const id = ({ id }) => id

const db = recipies.map(id).map(id => ({
  id,
  recipe: require(`../data/rezepte/${id}.json`),
}))

const ingredientsDB = db
  .map(rec =>
    rec.recipe.ingredientsArr.map(({ id, name }) => ({
      recId: rec.id,
      id,
      name,
      label: replacr(name),
    }))
  )
  .reduce((arr, cur) => [...arr, ...cur], [])

const getIngredientById = id =>
  ingredientsDB.filter(ing => ing.id === parseInt(id, 10))

const idx = lunr(function() {
  ;['name', 'label', 'id', 'recId'].map(f => this.field(f))
  ingredientsDB.map(payload => this.add(payload))
})

const fuzzyness = length => (length < 10 ? Math.ceil(length / 5) : 3)

const filterOutNumbers = str => str.replace(/[0-9]/g, '')
const splitTerms = str => {
  const s = filterOutNumbers(str).trim()
  return s.split(' ').filter(s => s.length > 2)
}

const search = input => {
  const terms = splitTerms(input)
  const matches = terms
    .map(input => {
      const searchTerm = `${input}~${fuzzyness(input.length)}`
      console.log('searching for: ', searchTerm)
      return idx.search(searchTerm)
    })
    .filter(matches => matches.length > 0)
    .reduce((acc, cur) => [...acc, ...cur], [])

  const matchedRecipes = matches.map(({ ref, ...rest }) => {
    const matches = getIngredientById(ref).map(({ name, recId }) => {
      return {
        name,
        recId, // maybe we can reuse this later to lookup the recipe
      }
    })
    return matches.reduce((acc, cur, i, arr) => ({
      recipes: [...acc.recipes, cur.recId],
      name: arr[0].name,
      ref: parseInt(ref, 10),
    }), { recipes: [], name: [], ref })
  })

  // console.log(matchedRecipes)
  // const firstMatchId = parseInt(match.ref, 10)
  // ingredientsDB.filter(({id}) => firstMatchId === id).map(log)
  return matchedRecipes
}

const lookupRecipeFromIngredient = id => {
  return id
}

module.exports = {
  searchIngredient,
  getIngredientById,
  lookupRecipeFromIngredient,
}
