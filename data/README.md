# Recipes

## Get all recipes (in german)
`curl https://open-api.digimeals.com/recipes/?language=de_CH > rezepte.json`

## Get each recipe
`mkdir rezepte`
`jq '.[].id' rezepte.json  | while read id; do curl https://open-api.digimeals.com/recipes/${id}?language=de_CH > rezepte/${id}.json; done`

Now you have all files of recipes in folder `rezepte/`, e.g. `rezepte/30.json`

## Cross-check allergenes
Run `node main.js`

