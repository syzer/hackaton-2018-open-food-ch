const search = require('./search.js')

const testcases = [
  'Tomaten piriert',
  'Agnesi Spaghetti N. 03 os',
  'Zwiebeln g ED 0%',
  'Le Gruyére 120g n',
  'Knoblauch a 70 1',
  'Rindshackf leisch 6 1',
]

const lookupIngredient = input => {
  const result = search.searchIngredient(input)

  console.log(`${input} :`, result)
}

testcases.map(lookupIngredient)
// lookupIngredient(testcases[5])
// lookupIngredient('käsescheibe')
// lookupIngredient('Rindshackfleisch')
