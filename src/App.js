import './App.css';
import {Component} from 'react'
import { HashRouter as Router,Route,Switch ,Redirect} from 'react-router-dom';
import Login from './components/login/login';
import NotFound from './components/notFound/notFound';

class App extends Component{
    render(){
        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path='/' component={Login}/>
                        <Route path="/not-found" component={NotFound} />
                        <Redirect to="not-found" />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default App;
