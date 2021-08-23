import { Component } from "react";
import './index.css'

class Bookdetails extends Component{

    state = {
        bid:null,
        bname:'',
        bimage:'',
        bauthor:'',
        returnBook:false,
        limit:null,
        b1:null,
        b2:null,
        b3:null,
    }

    getBookButton =async () => {
        const {limit} = this.state
        if(limit>2){
            alert('limit exceeds ! return old books to get this')
        }else{
            this.setState({returnBook:true})
            const {match,mis} = this.props
            const {params} =match
            const {id} = params
            let idDetails = {"id":id}
            idDetails = JSON.stringify(idDetails);
            const url = `http://localhost:9000/${mis}`
            const options = {
                method :'POST',
                body : idDetails,
                headers : {
                    "Content-Type" : "Application/json",
                },
            }
            await fetch(url,options)
            
        }
    }

    returnBookButton =async () => {
            this.setState({returnBook:false})
            const {match,mis} = this.props
            const {params} =match
            const {id} = params
            let idDetails = {"id":id}
            idDetails = JSON.stringify(idDetails);
            const url = `http://localhost:9000/${mis}/${id}`
            const options = {
                method :'POST',
                body : idDetails,
                headers : {
                    "Content-Type" : "Application/json",
                },
            }
            await fetch(url,options)
           
        
    }




    misDetials = async () => {
        const  {mis} = this.props
        const url = `http://localhost:9000/${mis}`
        const options = {method : 'GET'}
        await fetch(url,options)
        .then(response => {
            return response.json();
        })
        .then(jsonData => {
            const list = jsonData;
            const {id1,id2,id3,count} = list
            this.setState({b1:id1,b2:id2,b3:id3,limit:count})
        })  
    }

    checkBook = () => {
        const {b1,b2,b3} = this.state
        const {match} =this.props
        const {params} = match
        let {id} = params
        id = parseInt(id)
        //console.log(id,bookId,typeof(bookId),typeof(b1))
        if(b1 === id || b2 === id || b3 === id){
            console.log("book exists");
            this.setState({returnBook:true})
        }
    }

    componentDidMount(){
        setTimeout(()=>{
                this.checkBook()
        },1000)
    }


    bookDetails =async () => {
        const {match} =this.props
        const {params} = match
        const {id} = params
        const url =`http://localhost:9000/book/${id}`
        const options = {
            method : 'GET',
        }
        await fetch(url,options)
        .then(response => {
            return response.json();
        })
        .then(jsonData => {
            const list = jsonData;
            const {id,name,image,author} =list
            this.setState({ bid:id,
                bname:name,
                bimage:image,
                bauthor:author})
        })   
    }

    renderBookDetails = () => {
        this.misDetials()
        this.bookDetails()
        //this.checkBook()
          const {bimage,bname,bauthor}  = this.state    
        
        return (
            <div className="bbox">
                <img src={bimage} alt="book"/>
                <div className="bdetails">
                    <h1>{bname}</h1>
                    <p>{bauthor}</p>
                </div>
            </div>
        )
    }

    buttons = () => {
        const {returnBook} = this.state
        let returnBookClass,getBookClass
        if(returnBook){
            getBookClass = "get-book-false"
            returnBookClass = "return-book-true"
        }else{
            getBookClass = "get-book-true"
            returnBookClass = "return-book-false"
        }
        return (
            <div>
            <button className={getBookClass} onClick={this.getBookButton.bind(this)} >get book</button>
            <button className={returnBookClass} onClick={this.returnBookButton.bind(this)}>return book</button>
            </div>
        )
    }

    
    render(){
        return (
            <div className="bookDetailsBox">
                {this.renderBookDetails()}
                {this.buttons()}
            </div>
        )
    }
}

export default Bookdetails