import './App.css';
import {Component} from 'react'

class App extends Component{
    state = {msg:""}

    APIcall = () => {
        fetch("http://localhost:9000/")
            .then(res => res.text())
            .then(res => this.setState({msg: res}))
    }

    render(){
        const {msg} = this.state
        return (
            <div>
                <h1>hello world {msg}</h1>
                <button onClick = {this.APIcall}>click</button>
            </div>
        )
    }
}

export default App;
