const express = require("express");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

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
  
  const result =await db.get(query);
  if(result.password === password){
    response.send("loged in !");
  }else{
    console.log(password,result.password);
    response.send('nooo');
  }
})

module.exports = app;
