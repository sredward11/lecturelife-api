require('dotenv').config();
const { MongoClient } = require("mongodb");

const url =`mongodb+srv://TaliaArantes:A12345@cluster0.kmzkzd1.mongodb.net/`

let db = null;

const client = new MongoClient(url);

async function conectar() {
    try {
    if (db == null) {
        await client.connect();
        db = client.db("agenda");
    }
    console.log("Conectado ao MongoDB");
    return db;
  } catch (e) {
        console.log("Erro ao conectar no MongoDB", e.message);
    }
}

module.exports = conectar;


