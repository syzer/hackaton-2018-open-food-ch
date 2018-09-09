import React from 'react';
// import Webcam from "react-webcam";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.backend_url = `https://f91e195e.eu.ngrok.io/`
    this.recommender = `https://355c84da.eu.ngrok.io/`
    this.state = {
      response: '',
      sending: 0,
      tab: 0,
      recepiesIds: [],
      cards: [],
    }
  }

  fetchProducts(products) {
    return fetch(this.recommender + 'ingredients/' + products.join(','))
      .then(resp => resp.json())
      .catch(console.error)
  }

  fetchRecepies(products) {
    return fetch(this.recommender + 'recepies/' + products.join(','))
      .then(resp => resp.json())
      .catch(console.error)
  }

  fetchPicture = (recepieId) =>
    fetch(this.recommender + 'rezepte/' + recepieId + '.json')
      .then(resp => resp.json())

  handleClick = (e) => {
    e.preventDefault()
    return fetch(this.backend_url, {
      method: 'POST',
      body: new FormData(document.querySelector('#take-picture-form'))
    })
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          response: JSON.stringify(resp[0])
        })
        return resp[0]
      })
      .then(products => {
        return this.fetchRecepies(products)
          .then(recepiesIds => {
            this.setState({
              recepiesIds: JSON.stringify(recepiesIds)
            })
            console.warn('recepiesIds', recepiesIds)
            return recepiesIds
          })
          .then(recepiesIds => {
            return Promise.all(
              recepiesIds
                .map(id => this.fetchPicture(id)))
          })
          .then(allJSONS => {
            let cards = allJSONS
              .map((({ groupsArr }) => groupsArr))
              .map(e => e[0])

            console.warn('here', cards)
            this.setState({
              cards,
            })
          })

        // this.fetchProducts(products)
        //   .then(console.warn)
      })
      .catch(error => {
        console.log("ERROR: " + error)
        this.setState({ sending: 2 })
      })
  }

  makeCard = ({ imgUrl, title }, key) =>
    <div className="row" key={key}>
      <div className="col s12 m7">
        <div className="card">
          <div className="card-image">
            <img src={imgUrl}/>
            <span className="card-title">{title}</span>
          </div>
          <div className="card-content">
            {/*<p>{ingredientsArr}</p>*/}
          </div>
          <div className="card-action">
            <a href={imgUrl}>{title}</a>
          </div>
        </div>
      </div>
    </div>

  render() {
    return (
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
                    onClick={this.handleClick}>
                    Submit
                    <i className="material-icons right">cloud</i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <pre>{this.state.response}</pre>
        <div>
          {this.state.cards.map(this.makeCard)}
        </div>
      </div>
    )
  }
}
