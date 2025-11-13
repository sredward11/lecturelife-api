const request = require('supertest');
const request = require('supertest');
const app = require('../app'); // c) Importa a instância da aplicação Express

// d) Cria uma instância de requisição
const agent = request(app);

describe('API de Tarefas', () => {
    let tarefaId; // Variável para armazenar o ID da tarefa criada

    // e) Teste para GET /tarefas (listar todas)
    test('GET /tarefas deve retornar status 200 e ser um JSON', async () => {
        const response = await agent.get('/tarefas');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
    });

    // f) Teste para POST /tarefas (criar tarefa)
    test('POST /tarefas deve retornar status 201 e um JSON com o id', async () => {
        const novaTarefa = { nome: "Estudar Node", concluida: false };
        const response = await agent.post('/tarefas').send(novaTarefa);
        
        expect(response.status).toBe(201);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body.id).toBeDefined();
        
        // Salva o ID para os próximos testes
        tarefaId = response.body.id;
    });

    // g) Teste para GET /tarefas/:id (buscar tarefa específica)
    test('GET /tarefas/:id deve retornar status 200 e um JSON', async () => {
        const response = await agent.get(`/tarefas/${tarefaId}`);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
    });

    // h) Teste para GET /tarefas/:id (tarefa não encontrada)
    test('GET /tarefas/1 deve retornar status 404 para um id inválido', async () => {
        const response = await agent.get('/tarefas/1');
        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch(/json/);
    });

    // i) Teste para PUT /tarefas/:id (atualizar tarefa)
    test('PUT /tarefas/:id deve retornar status 200 e um JSON', async () => {
        const tarefaAtualizada = { nome: "Estudar Node e Express", concluida: true };
        const response = await agent.put(`/tarefas/${tarefaId}`).send(tarefaAtualizada);
        
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
    });

    // j) Teste para PUT /tarefas/:id (tarefa não encontrada)
    test('PUT /tarefas/1 deve retornar status 404 para um id inválido', async () => {
        const response = await agent.put('/tarefas/1').send({});
        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch(/json/);
    });

    // k) Teste para DELETE /tarefas/:id (remover tarefa)
    test('DELETE /tarefas/:id deve retornar status 204 e sem conteúdo', async () => {
        const response = await agent.delete(`/tarefas/${tarefaId}`);
        expect(response.status).toBe(204);
        expect(response.body).toEqual({}); // Corpo vazio
    });

    // l) Teste para DELETE /tarefas/:id (tarefa não encontrada)
    test('DELETE /tarefas/1 deve retornar status 404 para um id inválido', async () => {
        const response = await agent.delete('/tarefas/1');
        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch(/json/);
    });
});