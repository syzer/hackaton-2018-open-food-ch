const log = m => console.log(m);

// https://food.schoolofdata.ch/food-allergens/
const allergenes = require("./allergene.json");
// https://open-api.digimeals.com/recipes/?language=de_CH
const rezepte = require("./rezepte.json");

const Untergruppe = ({ Untergruppe }) => Untergruppe;
const id = ({ id }) => id;
const name = ({ name }) => name;
const includesAllergene = name => allergene.includes(name); // could be fuzzy matching...
const hasMatches = arr => arr.isAllergen.length > 0;

const allergene = allergenes.map(Untergruppe); //.map(log);

const ids = rezepte
  .map(id)
  .map(id => {
    const r = require(`./rezepte/${id}.json`);
    const isAllergen = r.ingredientsArr.map(name).filter(includesAllergene);
    return { id, isAllergen };
  })
  .filter(hasMatches);

console.log(ids);
