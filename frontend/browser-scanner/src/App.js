import React from 'react';
// import Webcam from "react-webcam";

const upperFirst = e => e[0].toLocaleUpperCase() + e.substr(1)

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.imageRecognizer = `https://fbcf405e.eu.ngrok.io/`
    this.recommender = `https://341f086c.eu.ngrok.io/`
    this.state = {
      cards: [],
      ingredients: [],
      recepiesIds: [],
      refrigerators: [],
      sending: false,
      tab: 0,
    }
  }

  fetchBillRecognition = () =>
    fetch(this.imageRecognizer, {
      method: 'POST',
      body: new FormData(document.querySelector('#take-picture-form'))
    })
      .then(resp => resp.json())
      .catch(console.error)

  fetchMyRefrigerator = () =>
    fetch(this.recommender + 'my-refrigerators')
      .then(resp => resp.json())
      .catch(console.error)

  fetchRecepies = (products) =>
    fetch(this.recommender + 'recepies/' + products.join(','))
      .then(resp => resp.json())
      .catch(console.error)

  fetchPicture = (recepieId) =>
    fetch(this.recommender + 'rezepte/' + recepieId + '.json')
      .then(resp => resp.json())

  handleClick = (e) => {
    e.preventDefault()
    this.setState({ sending: true })

    return Promise.all([
      this.fetchBillRecognition(),
      this.fetchMyRefrigerator(),
    ])
      .then(e => {
        console.warn(e)
        return e
      })
      .then(([ingredientsOnBill, ingrediendsInMyRegrigirator]) => {
        this.setState({ sending: false })
        this.setState({
          ingredients: ingredientsOnBill[0], // bit weird.. but what you gonna do.. :)
          refrigerators: ingrediendsInMyRegrigirator
        })
        return ingredientsOnBill[0]
      })
      .then(products =>
        this.fetchRecepies(products)
          .then(recepiesIds => {
            this.setState({
              recepiesIds: JSON.stringify(recepiesIds)
            })
            console.log('recepiesIds', recepiesIds)
            return recepiesIds
          })
          .then(recepiesIds => Promise.all(
              recepiesIds
                .map(id => this.fetchPicture(id))))
          .then(recommendedRecepies => {
            let cards = recommendedRecepies
              .map((({ ingredientsArr, groupsArr }) => ({
                ...groupsArr[0],
                ingredients: ingredientsArr
                  .map(e => e.name)
                  .map(upperFirst)
              })))
            // .map(e => e[0])

            console.warn('here', cards)
            this.setState({
              cards,
            })
          }))
      .catch(error => {
        console.log("ERROR: " + error)
        this.setState({ sending: false })
      })
  }

  makeCard = ({ imgUrl, title, ingredients }, key) =>
    <div className="row" key={key}>
      <div className="col s12 m7">
        <div className="card">
          <div className="card-image">
            <img src={imgUrl} alt={title}/>
            <span className="card-title">{title}</span>
          </div>
          <div className="card-content">
            {ingredients.map((e, i) =>
              <p key={i}>
                <i className="fas fa-play"> {e} </i>
              </p>
            )}
          </div>
          <div className="card-action">
            <a href={imgUrl}>{title}</a>
          </div>
        </div>
      </div>
    </div>

  showRefrigerators = (ingredients) =>
    <div>
      <h3>This you have on your kitchen that expires soon:</h3>
      <ul className="collection">
        {ingredients.map(({ name }, i) =>
          <li className="collection-item" /*avatar*/ key={i}>
            {/*<img src="images/yuna.jpg" alt="" className="circle"/>*/}
            <span className="title">{upperFirst(name)}</span>
            {/*{e}*/}
            <a href="#!" className="secondary-content">
              <i className="material-icons">grade</i>
            </a>
          </li>
        )}
      </ul>
    </div>

  makeBillItemsList = (ingredients) =>
    <div>
      <h3>This you have on your bill that expired</h3>
      <ul className="collection">
        {ingredients.map((e, i) =>
          <li className="collection-item" /*avatar*/ key={i}>
            {/*<img src="images/yuna.jpg" alt="" className="circle"/>*/}
            <span className="title">{e}</span>
            {/*{e}*/}
            <a href="#!" className="secondary-content">
              <i className="material-icons">grade</i>
            </a>
          </li>
        )}
      </ul>
    </div>

  render = () =>
    <div>
      <h1>Capture Receipt to see recommender recepies</h1>
      <div>
        <div className='screenshots'>
          <div className='controls'>
            <form
              action="https://f91e195e.eu.ngrok.io/"
              method="post"
              encType="multipart/form-data"
              id="take-picture-form">
              <div className="file-field input-field">
                <div className="btn">
                  <span><i className="material-icons right">add</i> Take a picture </span>
                  <input type="file" name="file" multiple accept="image/*"/>
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
                </div>
              </div>
              <br/>
              <div className="input-field">
                <button
                  className="btn waves-effect waves-light"
                  type="submit"
                  name="action"
                  disabled={this.state.sending}
                  onClick={this.handleClick}>
                  Submit
                  <i className="material-icons right">cloud</i>
                </button>
              </div>
            </form>
            {this.state.sending ? <i className="large material-icons">access_time</i> : null}
          </div>
        </div>
      </div>
      <div>
        {this.state.cards.map(this.makeCard)}
      </div>
      {this.state.ingredients.length
        ? this.makeBillItemsList(this.state.ingredients)
        : null}

      {this.state.refrigerators.length
        ? this.showRefrigerators(this.state.refrigerators)
        : null}
    </div>
}
