const express = require("express");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require('bcrypt');
const { response, request } = require("express");
const { json } = require("body-parser");

const databasePath = path.join(__dirname, "library.db");


let db = null;
const app = express();
app.use(express.json());
app.use(cors());

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertStateDbObjectToResponseObject = (dbObject) => {
  return {
    mis: dbObject.mis,
    password: dbObject.password,
    email: dbObject.email,
  };
};

function authenticateToken(request, response, next) {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        next();
      }
    });
  }
}

app.get("/",async (request,response) => {
  const getStatesQuery = `
    SELECT
      *
    FROM
      users;`;
  const statesArray = await db.all(getStatesQuery);
  response.send(
    statesArray.map((eachState) =>
      convertStateDbObjectToResponseObject(eachState)
    )
  );
});

app.post('/',async (request,response)=>{
  const {mis,password} = request.body;
  console.log(request.body)
  const query = `select * from users where mis = ${mis} ;`;
  console.log(query)
  
  const dbUser =await db.get(query);
  if(dbUser === undefined){
    response.status(400)
    response.send(JSON.parse(false))
  }else{
    const isPasswordMatched = await bcrypt.compare(password,dbUser.password);
    if(isPasswordMatched){
      console.log("success");
      response.status(200);
      response.send(JSON.parse(true));    
    }else{
      response.status(400)
      response.send(JSON.parse(false));
    }
  }
})

//for new user
app.post('/sign-up/',async (request,response)=>{
  const {mis,password,email} = request.body;
  //console.log(request.body);
  const hashedPassword =await bcrypt.hash(password,10);
  const checkQuery = `select * from users where mis = ${mis} ;`;
  //console.log(checkQuery);
  const dbUser = await db.get(checkQuery);
  console.log(dbUser)
  if(dbUser === undefined){
    const createUserQuery = `INSERT INTO users(mis,password,email) values(${mis},'${hashedPassword}','${email}');`;
    //console.log(createUserQuery);
    await db.run(createUserQuery);
    const infoQuery = `insert into info values(${mis},0,null,null,null);`
    await db.run(infoQuery)
    response.status(200);
    response.send(JSON.parse(true));
  }else{
    response.status(400);
    response.send(JSON.parse(false))
  }
});

app.post("/books/",async (request,response)=>{
  const {searchInput} = request.body;
  let query;
  if(searchInput === "" || searchInput === undefined){
    query = 'select * from books;';
  }else{
    query = `select * from books where name like '%${searchInput}%' or author like '%${searchInput}%';`
  }
  //console.log(query);
  const results = await db.all(query);
  response.send(results);

})

app.get('/book/:id/',async (request,response) =>{
  const {id} = request.params;
  const query = `select * from books where id = ${id};`;
  const result =await db.get(query);
  response.send(result)

})


app.get('/:mis/',async (request,response)=>{
  const {mis} = request.params;
  const query = `select * from info where mis = ${mis};`
  const  result = await db.get(query);
  response.send(result);
} )

app.post('/:mis',async (request,response)=>{
  const {mis} = request.params
  const {id} = request.body
  console.log(id)
  const query = `select * from info where mis = ${mis}`
  const result1 = await db.get(query)
  //console.log(result1.id1,result1.id2,result1.id3)
  const {count,id1,id2,id3} =result1
  
          if(id1 === null){
            //console.log(id1)
            const updateQuery = `update info set id1 = ${id} , count = ${count + 1} where mis = ${mis};`
            await db.run(updateQuery);
          }else if(id2 === null){
            //console.log(id2)
            const updateQuery = `update info set id2 = ${id} , count = ${count + 1} where mis = ${mis};`
            await db.run(updateQuery);
          }else if(id3 === null){
            //console.log(id3)
            const updateQuery = `update info set id3 = ${id} , count = ${count + 1} where mis = ${mis};`
            await db.run(updateQuery);
          }
})

app.post('/:mis/:id',async (request,response)=>{
  const {mis,id} = request.params
  console.log(id)
  const query = `select * from info where mis = ${mis}`
  const result1 = await db.get(query)
  
  const {count,id1,id2,id3} =result1
  let bookId = parseInt(id)
  console.log(id1,id2,id3,bookId,mis)
  if(id1 === bookId){
         console.log("logged id1")
         const updateQuery = `update info set id1 = null , count = ${count - 1} where mis = ${mis};`
         await db.run(updateQuery);
        }else  if(id2 === bookId){
        console.log("logged id2")
         const updateQuery = `update info set id2 = null , count = ${count - 1} where mis = ${mis};`
         await db.run(updateQuery);
        }else  if(id3 === bookId){
         console.log("logged id3")
         const updateQuery = `update info set id3 = null , count = ${count - 1} where mis = ${mis};`
         await db.run(updateQuery);
        }

        response.send(JSON.parse(true))
  }
)

module.exports = app;
