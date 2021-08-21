import {Component} from 'react'
import './index.css'
import Loader from  'react-loader-spinner';

class Signup extends Component{

    state = {
        mis:null,
        name:'',
        email:'',
        password:'',
        confirmPassword:'',
        msg : '',
        errmsg:'',
        loader:false,
    }

    submitForm =async event => {
        event.preventDefault();
        this.setState({loader:true})
        const {mis,email,password,confirmPassword} = this.state
        let userDetails = {mis,email,password,confirmPassword}
        userDetails = JSON.stringify(userDetails)
        if(password === confirmPassword){
            const url = "http://localhost:9000/sign-up"
            const options = {
                method: 'POST',
                body : userDetails,
                headers : {
                    "Content-Type": "application/json",
                },
            }
            await fetch(url, options)
            .then(response => {
                return response.json()
            })
            .then(jsonData => {
                const details= JSON.stringify(jsonData)
                if(details === "true"){
                    this.setState({loader:false})
                    console.log("sign up successfull")
                    this.setState({errmsg:''})
                    this.setState({msg:"successfully created a new user, please wait as we redirect to login!"})
                    setTimeout(()=>{
                        const {history} = this.props
                        history.replace('/')},5000)
                    
                    
                }else{
                    this.setState({loader:false})
                    this.setState({errmsg:"account allredy exits with this mis!"})
                }
            })
        }else{
            this.setState({loader:false})
            this.setState({errmsg:'both passwords did not match!'})
        }
    }

    changeMis = event =>{
        this.setState({mis:event.target.value})
    }

    changeEmail = event =>{
        this.setState({email:event.target.value})
    }

    changePassword = event =>{
        this.setState({password:event.target.value})
    }

    changeConfirmPassword = event =>{
        this.setState({confirmPassword:event.target.value})
    }

    renderLoader = () => {
        return (
            <div className="products-loader-container">
                  <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
                </div>
        )
    }

    renderMis = () => {
        const {mis} = this.state
        return (
            <div className="input-component">
                <label htmlFor="mis">enter MIS no</label>
                <input type="text" id="mis" value={mis} onChange={this.changeMis}/>
            </div>
        )
    }


    renderEmail = () => {
        const {email} = this.state
        return (
            <div className="input-component">
                <label htmlFor="email">enter Email id</label>
                <input type="text" id="email" value={email} onChange={this.changeEmail}/>
            </div>
        )
    }

    renderPassword = () => {
        const {password} = this.state
        return (
            <div className="input-component">
                <label htmlFor="password">enter password</label>
                <input type="password" id="password" value={password} onChange={this.changePassword}/>
            </div>
        )
    }

    renderConfirmPassword = () => {
        const {confirmPassword} = this.state
        return (
            <div className="input-component">
                <label htmlFor="password">confirm password</label>
                <input type="password" id="password" value={confirmPassword} onChange={this.changeConfirmPassword}/>
            </div>
        )
    }

    render(){
        const {msg,loader,errmsg} = this.state
        return (
            <div className="sign-up-form">
                <h1>Welcome to IIIT Pune Library</h1>
                <p>please fill the details</p>
                <form id="sign-up-form" onSubmit={this.submitForm.bind(this)}>
                    {this.renderMis()}
                    {this.renderEmail()}
                    {this.renderPassword()}
                    {this.renderConfirmPassword()}
                    <div  className="submit-button">
                        <button type="submit">sign in</button>
                    </div>
                </form>
                {loader ? this.renderLoader() : null}
                <p className="msg">{msg}</p>
                <p className="err">{errmsg}</p>
            </div>
        )
    }
}

export default Signup