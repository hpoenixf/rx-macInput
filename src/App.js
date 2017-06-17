import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './App.css';
import Rx from 'rx'
class App extends Component {
  constructor () {
    super()
    this.state = {
      value: '',
    }
  }
  componentDidMount () {
    let keydownValue = Rx.Observable.fromEvent(ReactDOM.findDOMNode(this.refs.t),'keydown').map(e => e.key.toUpperCase())
    keydownValue.filter(value => value.length === 1 && value.match(/[0-9A-F]/)).subscribe(value => this.insertValue(value))
    keydownValue.filter(value => value === 'BACKSPACE').subscribe(() => this.deleteValue())
    keydownValue.subscribe(value => this.setDomValue())
    keydownValue.subscribe(value => this.setColon())
  }

  insertValue = value => this.state.value.length !== 17 && this.setState({value: this.state.value + value})
  deleteValue = value => this.isLastColon() ? this.setState({value: this.state.value.slice(0, -2)}) : this.setState({value: this.state.value.slice(0, -1)})
  setDomValue = () => ReactDOM.findDOMNode(this.refs.t).value = this.state.value
  setColon = () => this.state.value.length && !this.isLastColon() && !(this.state.value.replace(/:/g, '').length%2) && this.insertValue(':')
  isLastColon = () => this.state.value.charAt(this.state.value.length - 1) === ':'

  render() {
    return (
      <div className="App">
        <input type="text"  onKeyDown={e => e.preventDefault()} ref="t"/>
      </div>
    );
  }
}

export default App;