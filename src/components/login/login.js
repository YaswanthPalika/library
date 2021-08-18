import { Component } from "react";
import './index.css'

class Login extends Component{

    state = {
        mis:'',
        password:''
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

    submitForm = async event => {
        event.preventDefault()
        const {mis, password} = this.state
        const userDetails = {mis, password}
        const url = 'http://localhost:9000/'
        const options = {
          method: 'POST',
          body: JSON.stringify(userDetails),
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if (response.ok === true) {
          this.onSubmitSuccess(data.jwt_token)
        } else {
          this.onSubmitFailure(data.error_msg)
        }
      }

    onSignUp = () => {
        console.log('sign up button clicked')
    }

    render(){
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
            </div>
        )
    }
}

export default Login