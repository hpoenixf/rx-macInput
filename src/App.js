import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './App.css';
import Rx from 'rx'
class App extends Component {
  constructor () {
    super()
    this.state = {
      value: '',
      pos: 0
    }
  }
  componentDidMount () {
    this.keydownValue = new Rx.Subject()
    let multicasted = this.keydownValue.map(e => e.key.toUpperCase()).share()
    this.sa = multicasted.filter(value => value.length === 1 && value.match(/[0-9A-F]/)).subscribe(async value => {
      await this.setColon('before')
      await this.insertValue(value)
      await this.setColon()
      this.goPos()
    })
    this.sb = multicasted.filter(value => value === 'BACKSPACE').subscribe(async () => {await this.deleteValue();this.goPos()})
    this.sc = multicasted.filter(value => value === 'ARROWLEFT').subscribe(() => this.moveLeft())
    this.sd = multicasted.filter(value => value === 'ARROWRIGHT').subscribe(() => this.moveRight())
    this.se = multicasted.subscribe(() => setTimeout(this.goPos, 0))
    // this.sf = multicasted.subscribe(value => {
    //   console.log(value)
    // })
  }
  componentWillUnmount() {
    this.sa.unsubscribe()
    this.sb.unsubscribe()
    this.sc.unsubscribe()
    this.sd.unsubscribe()
    this.se.unsubscribe()
  }
  async insertValue (value) {
    if (this.state.value.length !== 17) {
      await this.setStateAsync({...this.state,value: this.state.value.slice(0, this.state.pos) + value + this.state.value.slice(this.state.pos, this.state.value.length)})
      if (this.state.value.split(':').length === 7) {
        await this.setState({...this.state, value: this.state.value.slice(0, this.state.value.lastIndexOf(':'))})
      }
      await this.setPos(this.state.pos + 1)
    }
  }
  async deleteValue () {
    if (this.state.value.length && this.state.pos) {
      await this.setStateAsync({...this.state, value: this.state.value.slice(0, this.state.pos - 1) + this.state.value.slice(this.state.pos, this.state.value.length)})
      await this.setPos(this.state.pos - 1)
      if (this.isLastColon()) {
        await this.deleteValue()
      }
    }
  }
  async setColon (type) {
    if (this.state.value.length &&  !(this.state.value.slice(0, this.state.pos).replace(/:/g, '').length%2) && (type === 'before' ?  !this.isLastColon() : !this.isNearColon())) {
      await this.insertValue(':')
    }
  }
  async setPos (pos = this.state.value.length) { await this.setStateAsync({...this.state, pos})}
  moveLeft = () => this.state.pos > 0 && this.setState({...this.state, pos: this.state.pos - 1})
  moveRight = () => this.state.pos !== this.state.value.length && this.setState({...this.state, pos: this.state.pos + 1})
  goPos = () => ReactDOM.findDOMNode(this.refs.t).setSelectionRange(this.state.pos, this.state.pos)
  isNearColon = () => this.isLastColon() || this.state.value.charAt(this.state.pos ) === ':'
  isLastColon = () => this.state.value.charAt(this.state.pos - 1) === ':'
  setStateAsync = state => new Promise(resolve => this.setState(state,resolve))

  render() {
    return (
      <div className="App">
        <input type="text"
           onKeyDown={e => {e.preventDefault();this.keydownValue.onNext(e)}}
           onClick={e => this.setState({...this.state, pos: this.refs.t.selectionStart})}
           value={this.state.value}
           ref="t"/>
      </div>
    );
  }
}

export default App;
