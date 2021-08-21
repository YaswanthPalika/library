import { Component } from "react";
import Loader from  'react-loader-spinner';

import './index.css'

class Login extends Component{

    state = {
        mis:'',
        password:'',
        loader:false,
        p:'',
    }

    changeMis = event => {
        this.setState({mis:event.target.value})
    }

    changePassword = event => {
        this.setState({password:event.target.value})
    }

    renderMis = () => {
        const {mis} = this.state
        return (
            <div>
                <label htmlFor="mis">enter MIS no</label><br/>
                <input type="text" id="mis" value={mis} onChange={this.changeMis}/>
            </div>
        )
    }

    renderPassword = () => {
        const {password} = this.state
        return (
            <div>
                <label htmlFor="password">enter password</label><br/>
                <input type="password" id="password" value={password} onChange={this.changePassword}/>
            </div>
        )
    }

    renderErr = () => {
        const {p} = this.state
        return (<p className="errmsg">{p}</p>)
    }


    showErr = () => {
        console.log('yhrfxsng')
        this.setState({p:'wrong mis or password*'})
    }

    submitForm = async event => {
        event.preventDefault()
        this.setState({loader:true})
        const {mis, password} = this.state
        let userDetails = {mis, password}
        userDetails = JSON.stringify(userDetails)
        const url = 'http://localhost:9000/'
        const options = {
          method: 'POST',
          body: userDetails,
          headers: {
            "Content-Type": "application/json",
        }
        }
        await fetch(url, options)
            .then(response => {
                return response.json()
            })
            .then(jsonData => {
                const details= JSON.stringify(jsonData)
                if(details === "true"){
                    this.setState({loader:false})
                    console.log("logged in")
                    const {history} = this.props
                    this.props.onAddMis(mis)
                    history.replace('/books')
                }else{
                    this.setState({loader:false})
                    console.log("wrong mis or password")
                    this.showErr();
                }
            })
      }

    onSignUp = () => {
        console.log('sign up button clicked')
        const {history} = this.props
        history.push('/sign-up')
    }

    renderLoader = () => {
        return (
            <div className="products-loader-container">
                  <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
                </div>
        )
    }

    
    render(){
        const {loader} = this.state
        return (
            <div className="login">
                <img src="https://res.cloudinary.com/doaejwdmk/image/upload/v1629298604/iiit_pune_logo_mivtao.png" alt="iiit pune logo"/>
                <form id="login-form" onSubmit={this.submitForm.bind(this)}>
                    <div className='input-container'>
                        {this.renderMis()}
                    </div>
                    <div className='input-container'>
                        {this.renderPassword()}
                    </div>
                    <div className="buttons">
                        <button type="submit">login</button>
                        <button type="button" onClick={this.onSignUp.bind(this)}>Sign Up</button>
                    </div>
                </form>
                {this.renderErr()}
                {loader ? this.renderLoader() : null}
            </div>
        )
    }
}

export default Login