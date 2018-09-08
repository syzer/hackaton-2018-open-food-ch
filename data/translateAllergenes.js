const allergenes = require('./allergene')

allergenes
  .map(({Untergruppe}) => Untergruppe)
  .map(console.log)
