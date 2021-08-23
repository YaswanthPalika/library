import './App.css';
import {Component} from 'react'
import { HashRouter as Router,Route,Switch ,Redirect} from 'react-router-dom';
import Login from './components/login/login';
import NotFound from './components/notFound/notFound';
import Books  from './components/books';
import Signup from './components/signup';
import Bookdetails from './components/bookdetails'
let misNumber =null

class App extends Component{
    state = {
        mis:null
    }

    hanldeMis(misNo) {
        misNumber = misNo;
    }

    render(){
        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path='/' render={(props) => (
                                <Login {...props} onAddMis={this.hanldeMis} />
                            )}/>
                        <Route path="/not-found" component={NotFound}  />
                        <Route exact path='/Books' render={(props) => (
                                <Books {...props} mis={misNumber} />
                            )}/>
                        <Route exact path='/book/:id' render={(props) => (
                                <Bookdetails {...props} mis={misNumber} />
                            )}/>
                        <Route path='/sign-up' component={Signup}/>
                        <Redirect to="not-found" />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default App;
/*
*/
