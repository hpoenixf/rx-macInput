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
    let keydownValue = this.keydownValue.map(e => e.key.toUpperCase())
    this.sa = keydownValue.filter(value => value.length === 1 && value.match(/[0-9A-F]/)).subscribe(value => {
      this.setColon('before', () => {
        this.insertValue(value, () => {
          this.setColon()
        })
      });
    })
    this.sb = keydownValue.filter(value => value === 'BACKSPACE').subscribe(() => {this.deleteValue()})
    this.sc = keydownValue.filter(value => value === 'ARROWLEFT').subscribe(() => this.moveLeft())
    this.sd = keydownValue.filter(value => value === 'ARROWRIGHT').subscribe(() => this.moveRight())
    this.se = keydownValue.subscribe(() => setTimeout(this.goPos, 0))
    // this.sf = keydownValue.subscribe(value => {
    //   console.log(value)
    // })
  }
  componentWillUnmount() {
    this.sa.dispose()
    this.sb.dispose()
    this.sc.dispose()
    this.sd.dispose()
    this.se.dispose()
  }
  handleE = e => {
    e.preventDefault()
    this.keydownValue.onNext(e)
  }
  insertValue = (value,cb) => {
    if (this.state.value.length !== 17) {
      this.setState({...this.state,value: this.state.value.slice(0, this.state.pos) + value + this.state.value.slice(this.state.pos, this.state.value.length)}, () => {
        if (this.state.value.split(':').length === 7) {
          this.setState({...this.state, value: this.state.value.slice(0, this.state.value.lastIndexOf(':'))}, () => this.setPos(this.state.pos + 1,cb))
        } else {
          this.setPos(this.state.pos + 1,cb)
        }
      })
  }}
  deleteValue = () => {
    if (this.state.value.length && this.state.pos) {
      this.setState({...this.state, value: this.state.value.slice(0, this.state.pos - 1) + this.state.value.slice(this.state.pos, this.state.value.length)}, () =>{
        this.setPos(this.state.pos - 1, () => {
          if (this.isLastColon()) {
            this.deleteValue()
          }
        })
      })
    }
  }
  setColon = (type, cb) => {
    if (this.state.value.length &&  !(this.state.value.slice(0, this.state.pos).replace(/:/g, '').length%2) && (type === 'before' ?  !this.isLastColon() : !this.isNearColon())) {
      this.insertValue(':', cb)
    } else {
      cb && cb()
    }
  }
  setPos = (pos = this.state.value.length, cb) => this.setState({...this.state, pos},() => cb && cb())
  moveLeft = () => this.state.pos > 0 && this.setState({...this.state, pos: this.state.pos - 1})
  moveRight = () => this.state.pos !== this.state.value.length && this.setState({...this.state, pos: this.state.pos + 1})
  goPos = () => ReactDOM.findDOMNode(this.refs.t).setSelectionRange(this.state.pos, this.state.pos)
  isNearColon = () => this.isLastColon() || this.state.value.charAt(this.state.pos ) === ':'
  isLastColon = () => this.state.value.charAt(this.state.pos - 1) === ':'

  render() {
    return (
      <div className="App">
        <input type="text" onKeyDown={this.handleE} value={this.state.value}  ref="t"/>
      </div>
    );
  }
}

export default App;
