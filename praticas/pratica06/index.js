const readline = require('readline-sync');
const controlador = require('./controlador.js');

function menu() {
  console.log("\n--- MENU DE TAREFAS ---");
  console.log("1. Adicionar Tarefa");
  console.log("2. Buscar Tarefa");
  console.log("3. Atualizar Tarefa");
  console.log("4. Remover Tarefa");
  console.log("5. Sair");
}

async function escolherOpcao(opcao) {
  switch (opcao) {
    case '1': {
      const nome = readline.question("Digite o nome da tarefa: ");
      await controlador.adicionarTarefa(nome);
      break;
    }
    case '2': {
      const nome = readline.question("Digite o nome da tarefa a buscar: ");
      const tarefaEncontrada = await controlador.buscarTarefa(nome);
      
      if (tarefaEncontrada.id) {
        console.log("--- Tarefa Encontrada ---");
        console.log(`ID: ${tarefaEncontrada.id}`);
        console.log(`Nome: ${tarefaEncontrada.nome}`);
        console.log(`Concluída: ${tarefaEncontrada.concluida}`);
      } else {
        console.log("Tarefa não encontrada.");
      }
      break;
    }
    case '3': {
      const nome = readline.question("Digite o nome da tarefa a atualizar: ");
      const concluida = readline.question("A tarefa foi concluida? (sim/nao): ");
      await controlador.atualizarTarefa(nome, concluida);
      break;
    }
    case '4': {
      const nome = readline.question("Digite o nome da tarefa a remover: ");
      await controlador.removerTarefa(nome);
      break;
    }
    case '5': {
      console.log("Saindo do programa...");
      process.exit(0);
    }
    default:
      console.log("Opcao invalida. Tente novamente.");
  }
  readline.question("Pressione ENTER para continuar...");
}


async function main() {
  while (true) {
    menu();
    const opcao = readline.question("Escolha uma opcao: ");
    await escolherOpcao(opcao);
  }
}

main();