import {React, ReactDOM} from 'react'

export default class Header extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

