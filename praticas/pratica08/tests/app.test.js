const supertest = require("supertest");

const app = require("../app"); 
const request = supertest(app);

describe("Fluxo de autenticação e rotas protegidas", () => {
  const urlProdutos = "/produtos";
  const urlLogin = "/usuarios/login";
  const urlRenovar = "/usuarios/renovar";

  let token;
  let novoToken;

  test("GET /produtos sem header deve retornar 401 e msg 'Não autorizado'", async () => {
    const res = await request.get(urlProdutos);
    expect(res.status).toBe(401);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.msg).toBe("Não autorizado");
  });

  test('GET /produtos com header "authorization" = "123456789" retorna 401 e msg "Token inválido"', async () => {
    const res = await request.get(urlProdutos).set("authorization", "123456789");
    expect(res.status).toBe(401);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.msg).toBe("Token inválido");
  });

  test('POST /usuarios/login com { "usuario": "email@exemplo.com", "senha": "abcd1234" } retorna 200 e JSON contendo "token"', async () => {
    const body = { usuario: "email@exemplo.com", senha: "abcd1234" };
    const res = await request.post(urlLogin).send(body);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test("GET /produtos com token salvo retorna 200 e JSON", async () => {
    const res = await request.get(urlProdutos).set("authorization", token);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    // corpo é um array (conforme rota definida)
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /usuarios/renovar com token salvo retorna 200 e novo token", async () => {
    const res = await request.post(urlRenovar).set("authorization", token);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.token).toBeDefined();
    novoToken = res.body.token;
  });

  test("GET /produtos com novo token retorna 200 e JSON", async () => {
    const res = await request.get(urlProdutos).set("authorization", novoToken);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
  });
});