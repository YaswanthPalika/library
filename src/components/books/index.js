import { Component } from "react";
import './index.css'
import {FiLogOut, FiSearch} from "react-icons/fi"
import Book from "../book";
import Loader from  'react-loader-spinner';



class Books extends Component{

    state = {
        searchInput : '',
        booklist:[],
        loader:false
    }
    
    componentDidMount(){
        this.searcTheInput()
    }

    logout = () => {
        const {history} = this.props
        history.replace('/')
    }

    searcTheInput =async () => {
        this.setState({loader:true})
        //console.log("entered")
        const {searchInput} =this.state
        //console.log(searchInput)
        let details = {searchInput}
        details = JSON.stringify(details);
        //console.log(details,searchInput)
        const url = "http://localhost:9000/books"
        const options = {
            method : 'POST',
            body : details,
            headers: {
                "Content-Type": "application/json",
            }
        }
       // console.log(url,options);
        await fetch(url,options)
            .then(response => {
                return response.json();
            })
            .then(jsonData => {
                const list = jsonData;
                this.setState({loader:false})
                this.setState({booklist:list})
               // console.log(this.state.booklist)
            })
    }


    renderLoader = () => {
        return (
            <div className="loader">
                  <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
                </div>
        )
    }

    onChangeSearch =async event => {
        this.setState({searchInput : event.target.value})
        //console.log(this.state.searchInput)
        this.searcTheInput();
    }
    
    header = () => {
        const {mis} = this.props
        return (
            <div className="navbar">
                <div className="library-logo">
                    <img className="logo" src="https://res.cloudinary.com/doaejwdmk/image/upload/v1629298604/iiit_pune_logo_mivtao.png" alt="iiitp logo"/>
                    <h1>Library</h1>
                </div>
                <div className="nav-search">
                    <p>search your book!</p>
                    <div className="search-input-box">
                        <FiSearch />
                        <input type="text" className="search-input" onChange={this.onChangeSearch}/>
                    </div>
                    
                </div>
                <div className="log-out">
                    <p className="mis">{mis}</p>
                    <div className="loglogo">
                        <FiLogOut onClick={this.logout} />
                    </div>
                </div>
            </div>
        )
    }

    render(){

        const {booklist,loader} = this.state

        return (
            <div>
                {this.header()}
                <hr/>
                {loader ? this.renderLoader() : null}
                <ul>
                    {booklist.map(each => (
                        <Book data={each} key={each.id}/>
                    ))}
                </ul>
            </div>
        )
    }
}

export default Books