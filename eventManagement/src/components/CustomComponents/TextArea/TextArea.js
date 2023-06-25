import { Editor } from 'primereact/editor';

import React, { Component } from 'react';

class TextArea extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Editor
          {...this.props}
          style={{ height: '350px' }}
          value={this.props.value}
          readOnly={this.props.readOnly}
          onTextChange={this.props.onTextChange}
        />
      </React.Fragment>
    );
  }
}

export default TextArea;
