"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

/* import {saveCollectedBlobs} from './utils/image-store'; */

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blockeds: [],
    };

  }

  renderAllBeBlocked() {
    return this.state.blockeds.map(item => {
      return (
	<div>
	  { item }
	</div>
      );
    });
  }

  render() {
    return (
      <div>
	{ this.renderAllBeBlocked() }
      </div>
    );
  }
}


const popup = ReactDOM.render(<Popup/>, document.getElementById('app'));

async function popupHandler(message) {
  let blockeds = popup.state.blockeds || [];

  message.upRushiList.map(async item => {
    blockeds.push(item.name);
    popup.setState({ blockeds });
  });
}
  
      

browser.runtime.sendMessage({ type: "soshou" })
       .then(
	 popupHandler,
	 (err) => {
           console.log('--- GET upRushiList err ---', err);
	 });
