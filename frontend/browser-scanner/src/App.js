import React from 'react';
// import Webcam from "react-webcam";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.backend_url = `https://f91e195e.eu.ngrok.io/`
    this.recommender = `https://355c84da.eu.ngrok.io/`
    this.recepies = `https://355c84da.eu.ngrok.io/`
    this.state = {
      response: '',
      sending: 0,
      tab: 0,
      recepiesIds: []
    }
  }

  fetchProducts (products) {
    return fetch(this.recommender + 'ingredients/' + products.join(','))
      .then(resp => resp.json())
      .catch(console.error)
  }

  fetchRecepies (products) {
    return fetch(this.recommender + 'recepies/' + products.join(','))
      .then(resp => resp.json())
      .catch(console.error)
  }

  fetchPictures (productsIds) {
    fetch(this.recommender + 'rezepte/' + productsIds.join(','))
      .then(resp => resp.json())
      .then(e => {
        console.warn(e)
        return e
      })
      .catch(console.error)
  }

  handleClick = (e) => {
    e.preventDefault()
    return fetch(this.backend_url, {
      method: 'POST',
      body: new FormData(document.querySelector('#take-picture-form'))
      // body: new FormData(window.$('#take-picture-form')[0])
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
          })

        // this.fetchProducts(products)
        //   .then(console.warn)
      })
      .catch(error => {
        console.log("ERROR: " + error)
        this.setState({ sending: 2 })
      })
  }

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
        <div>
          <pre>
            {this.state.response}
          </pre>
        </div>
        <div>
          <pre>
            {this.state.recepiesIds}
          </pre>
        </div>
      </div>
    )
  }
}
