/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://antrikshrawat2:<Antriksh@Rawat31>@ar-cluster.eio7o.mongodb.net/?retryWrites=true&w=majority&appName=AR-CLUSTER";

const connetToMongo = async ()=>{
          try{
await mongoose.connect(mongoURI);
console.log("connected successfully!");
          }catch(error) {
                    console.log(error);
          }
}

module.exports = connetToMongo;