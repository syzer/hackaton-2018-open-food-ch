const polka = require('polka');
const search = require('./search.js')

function one(req, res, next) {
  req.hello = 'world';
  next();
}

function two(req, res, next) {
  req.foo = '...needs better demo 😔';
  next();
}

polka()
  .use(one, two)
  .get('/ingredient/:searchterm', (req, res) => {
    const { searchterm } = req.params
    const decodedTerm = decodeURI(searchterm)
    const matches = search.search(decodedTerm)
    console.log(matches)
    res.end(JSON.stringify(matches));
  })
  .get('/ping', (req, res) => {
    res.end(JSON.stringify('pong'))
  })
  .listen(2001).then(_ => {
    console.log(`> Running on localhost:2001`);
  });
