// importar o cliente do mongodb
const { MongoClient } = require('mongodb');

//string de conexao
const url = "";

const client = new MongoClient(url);

async function conectar() {
    try {
        await client.connect();
        console.log("Conectado");
        return client.db("agenda");
    }catch(e) {
        console.log("Erro ao conectar no MongoDB", e.message);
    }
}

module.exports = conectar;