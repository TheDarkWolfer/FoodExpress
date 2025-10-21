const sinon = require('sinon');
const { expect } = require('chai');
const assert = require("assert").strict
const supertest = require("supertest")
const jwt = require("jsonwebtoken");

const app = require("../app.js")

describe("MENU router",() => {
  let userToken
  let adminToken
  it("GET /users",async () => {
    await supertest(app)
    .get("/users")
    .expect(300)
    .then((response)=>{
      assert.equal(typeof(response.body),'object')
    })
  })
  it("POST /users -> création d'un utilisateur lambda",async () => {
    const userBody = await supertest(app)
    .post("/users")
    .send({
      email:"lambda@xyz.org",
      username:"lambda",
      password:"test1234",
      role:"user"
    }).expect(201).expect("Content-type",/json/)
  })
  it("POST /users -> création d'utilisateur admin",async () => {
    const userAdmin = await supertest(app)
    .post("/users")
    .send({
      email:"maestro@xyz.org",
      username:"maestro",
      password:"test1234",
      role:"admin"
    }).expect(201).expect("Content-type",/json/) // Utilisation d'un regex pour la validation du type de réponse
  })

  /*--------------------------------------------+
  | POST - Login en tant qu'administrateur.ice |
  +--------------------------------------------*/

  it("POST /users/login -> JWT login en tant qu'utilisateur.ice",async () => {
    const res = await supertest(app)
    .post("/users/login")
    .send({
      username:"lambda",
      password:"test1234"
    }).expect(202)

    const { token } = res.body;
    expect(token).to.be.a('string');

    /*-----------------------+
    | Vérification du token |
    +-----------------------*/
    const decoded = jwt.decode(token, { complete: true });
    expect(decoded).to.be.an('object');
    expect(decoded).to.have.property('header');
    expect(decoded.header).to.include({ alg: 'HS256', typ: 'JWT' }); // adapt if RS256
    expect(decoded.payload).to.include.keys(['sub', 'iat', 'exp', 'role']); // adapt to your claims


  // Et vérification de la signature du token
  const verified = jwt.verify(token, process.env.SECRET, {
    algorithms: ['HS256']
  });

  expect(verified.sub).to.be.a('string');
  expect(verified.role).to.equal('user');
  expect(verified.exp * 1000).to.be.greaterThan(Date.now()); // On s'assure que le token est toujours valide

  userToken = verified // Stockage du token utilisateur.ice pour plus tard
  })

  /*--------------------+
  | POST - login admin |
  +--------------------*/

  it("POST /users/login -> JWT login en tant qu'administrateur.ice",async () => {
    const res = await supertest(app)
    .post("/users/login")
    .send({
      username:"maestro",
      password:"test1234"
    }).expect(202)

    const { token } = res.body;
    expect(token).to.be.a('string');

    /*-----------------------+
    | Vérification du token |
    +-----------------------*/
    const decoded = jwt.decode(token, { complete: true });
    expect(decoded).to.be.an('object');
    expect(decoded).to.have.property('header');
    expect(decoded.header).to.include({ alg: 'HS256', typ: 'JWT' }); // adapt if RS256
    expect(decoded.payload).to.include.keys(['sub', 'iat', 'exp', 'role']); // adapt to your claims


  // Et vérification de la signature du token
  const verified = jwt.verify(token, process.env.SECRET, {
    algorithms: ['HS256']
  });

  expect(verified.sub).to.be.a('string');
  expect(verified.role).to.equal('admin');
  expect(verified.exp * 1000).to.be.greaterThan(Date.now()); // On s'assure que le token est toujours valide

  adminToken = verified // Stockage du token administrateur.ice pour plus tard
  })

  /*-----------------------------------+
  | PATCH - Modification user -> user |
  +-----------------------------------*/

  it("PATCH /users/login/<userID> -> Lambda peut y accéder, Maestro aussi",async () => {
    const userID = userToken.sub
    const res = await supertest(app)
    .patch(`/users/${userID}`)
    .send('')
  })
  
})