import React from 'react';
import {Helmet} from "react-helmet";

// import Webcam from "react-webcam";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.imageRecognizer = `https://a6e365b1.eu.ngrok.io`
    // this.subsequent_url = 'http://www.google.ch';
    this.state = {
      screenshot: null,
      sending: 0,
      tab: 0
    };
  }

  handleClick = () => {
    const screenshot = this.webcam.getScreenshot();
    this.setState({ screenshot });
    this.setState({ sending: 1 });

    fetch(this.imageRecognizer, {
      method: 'POST',
      body: screenshot
    }).then(
      this.setState({ sending: 2 })
    ).catch(
      error => {
        console.log("ERROR: " + error)
        this.setState({ sending: 2 })
      }
    )
  }

  render() {
    return (
      <div>
        <h1>Capture Receipt</h1>

        <div style={{ width: 700}}>
          <div className='screenshots'>
            <div className='controls'>
              <form action="https://a6e365b1.eu.ngrok.io" method="post" encType="multipart/form-data" id="take-picture-form">
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
                  <button className="btn waves-effect waves-light" type="submit" name="action">
                    Submit
                    <i className="material-icons right">cloud</i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Helmet>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-rc.2/css/materialize.min.css" />
        </Helmet>
      </div>
    )
  }
}
