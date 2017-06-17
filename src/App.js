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
    this.t = ReactDOM.findDOMNode(this.refs.t)
    let keydownValue = Rx.Observable.fromEvent(this.t,'keydown').map(e => e.key.toUpperCase())
    this.sa = keydownValue.filter(value => value.length === 1 && value.match(/[0-9A-F]/)).subscribe(value => this.insertValue(value))
    this.sb = keydownValue.filter(value => value === 'BACKSPACE').subscribe(() => this.deleteValue())
    this.sc = keydownValue.subscribe(() => {this.setColon();this.setDomValue()})
  }
  componentWillUnmount() {
    this.sa.dispose()
    this.sb.dispose()
    this.sc.dispose()
  }
  insertValue = value => this.state.value.length !== 17 && this.setState({value: this.state.value + value})
  deleteValue = () => this.setState({value: this.state.value.slice(0, this.isLastColon() ? -2 : -1)})
  setDomValue = () => this.t.value = this.state.value
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
