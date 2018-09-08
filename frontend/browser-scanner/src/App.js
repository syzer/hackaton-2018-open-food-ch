import React from 'react';
import Webcam from "react-webcam";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.backend_url = 'http://localhost';
    this.subsequent_url = 'http://www.google.ch';
    this.state = {
      screenshot: null,
      sending: 0,
      tab: 0
    };
  }

  handleClick = () => {
    const screenshot = this.webcam.getScreenshot();
    this.setState({ screenshot });
    this.setState({ sending: 1});

    fetch(this.backend_url,   {
      method: 'POST',
      body: screenshot
    }).then(
      this.setState({sending: 2})
    ).catch(
      error => { 
        console.log("ERROR: " + error) 
        this.setState({ sending: 2 })
      }
    );
  }

  render() {
    return (
      <div>
        <h1>Capture Receipt</h1>
        <Webcam audio={false} ref={node => this.webcam = node} />
        <div>
          <div className='screenshots'>
            <div className='controls'>
              <button onClick={this.handleClick}>capture</button>
            </div>
          </div>
        </div>
        <h2>Receipt</h2>
        {this.state.screenshot ? <img src={this.state.screenshot} style={{width:200, height:160}} alt="screenshot" /> : <span></span>}
          <br />
          { this.state.sending ? <span>Sending</span> : <span>Idle</span> }
          { (this.state.sending == 2)? window.location.href = this.subsequent_url : null }
      </div>
    );
  }
}
