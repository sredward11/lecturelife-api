const Tarefa = require("./modelo");


async function adicionarTarefa(nome) {
const tarefa = new Tarefa(nome);
await tarefa.init();
await tarefa.inserir();
console.log('Tarefa adicionada com sucesso!');
}
  
 
async function buscarTarefa(nome) {
const tarefa = new Tarefa(nome);
await tarefa.init();
await tarefa.buscar(); 
    
return tarefa;
}
  
async function atualizarTarefa(nome, concluida) {
const tarefa = new Tarefa(nome);
await tarefa.init();
await tarefa.buscar();
    
    
if (tarefa._id) { 
    tarefa.concluida = (concluida.toLowerCase() === 'sim'); 
    await tarefa.alterar();
      console.log(`Tarefa "${nome}" atualizada com sucesso!`);
    } else {
      console.log(`Tarefa "${nome}" não encontrada.`);
    }
}
  
async function removerTarefa(nome) {
const tarefa = new Tarefa(nome);
await tarefa.init();
await tarefa.buscar();
    
if (tarefa._id) {
    await tarefa.deletar();
      console.log(`Tarefa "${nome}" removida com sucesso!`);
    } else {
      console.log(`Tarefa "${nome}" não encontrada.`);
    }
}
  
  
module.exports = {
adicionarTarefa,
buscarTarefa,
atualizarTarefa,
removerTarefa,
};

