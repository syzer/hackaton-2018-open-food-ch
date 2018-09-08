import React from 'react';
// import Webcam from "react-webcam";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.backend_url = `https://a6e365b1.eu.ngrok.io`
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

    fetch(this.backend_url, {
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

        <div>
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
      </div>
    )
  }
}
