const express = require("express");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require('bcrypt');

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
  console.log(query);
  const results = await db.all(query);
  response.send(results);

})



module.exports = app;
