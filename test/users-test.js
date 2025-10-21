const sinon = require('sinon');
const { expect } = require('chai');
const assert = require("assert").strict
const supertest = require("supertest")
const jwt = require("jsonwebtoken");

const app = require("../app.js")

// On gardera une liste des utilisateur.ices créé.es pour faciliter le nettoyage après les tests (vaut mieux éviter de chambouler la base de données entre chaque tests ;)
let usersIDs = []

describe("USER router",() => {
  let userToken
  let adminToken
  let rawAdminToken
  let rawUserToken
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
    usersIDs.push(userBody.id)
  })
  it("POST /users -> création d'un.e utilisateur.ice déjà présent.e dans la base de données",async()=>{
    const duplicateBody = await supertest(app)
    .post("/users")
    .send({
      email:"lambda@xyz.org",
      username:"lambda",
      password:"qwerty",
      role:"user"
    }).expect(409)
    usersIDs.push(duplicateBody.id)
  })
  it("POST /users -> création d'utilisateur admin",async () => {
    const userAdmin = await supertest(app)
    .post("/users")
    .send({
      email:"maestro@xyz.org",
      username:"maestro",
      password:"test1234",
      role:"admin"
    }).expect(201).expect("Content-type",/json/) // Utilisation d'un (tout petit) regex pour la validation du type de réponse
    usersIDs.push(userAdmin.id)
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
    }).expect(200)

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
  rawUserToken = token
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
    }).expect(200)

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
  rawAdminToken = token
  })

  /*-----------------------------------+
  | PATCH - Modification user -> user |
  +-----------------------------------*/

  it("PATCH /users/login/<userID> -> Lambda peut y accéder, Maestro aussi",async () => {
    const userID = userToken.sub
    const res = await supertest(app)
    .patch(`/users/${userID}`)
    .set("Authorization",`Bearer ${rawUserToken}`)
    .send({
      username:"omicron",
      password:"azerty"
    }).expect(200)
  })

  /*------------------------------------+
  | PATCH - Modification admin -> user |
  +------------------------------------*/
  
  it("PATCH /users/login/<adminID> -> Maestro peut y accéder, Lambda/Omicron ne peut pas",async () => {
    const userID = userToken.sub
    const res = await supertest(app)
    .patch(`/users/${userID}`)
    .set("Authorization",`Bearer ${rawAdminToken}`)
    .send({
      username:"lambda",
      email:"some.email@xyz.gay"
    }).expect(200)
  })

  /*-----------------------------------------+
  | PATCH - Modification user -> autre user |
  +-----------------------------------------*/

  it("PATCH /users/login/<adminID> -> Maestro pourrait y accéder, Lambda ne peut pas et prend une erreur",async () => {
    const userID = userToken.sub
  
    // Création et login d'un utilisateur juste pour ce test
    await supertest(app)
    .post("/users/")
    .send({
      email:"gamma@xyz.org",
      username:"gamma",
      password:"test1234",
      role:"user"
    }).expect(201).expect("Content-type",/json/)

    const _res = await supertest(app)
    .post("/users/login")
    .send({
      username:"gamma",
      password:"test1234"
    }).expect(200)

    const { token } = _res.body;

    const res = await supertest(app)
    .patch(`/users/${userID}`)
    .set("Authorization",`Bearer ${token}`)
    .send({
      email:"evil.email@mean.corp",
      username:"pwnd",
      password:"evil-password",
      role:"evil-admin"
    }).expect(401).expect("Content-type",/json/)
    expect(res.body).to.have.property('error')
  })
})

/*------------------------------------+
 | Suppression des utilisateur.ices   |
 | temporaires créé.es lors des tests |
 +------------------------------------*/
for (let i = 0; i < usersIDs.length; i++) {
  const gettingDeleted = usersIDs[i];
  supertest(app).delete(`/users/${gettingDeleted}`)
  console.log(`User with ID <${gettingDeleted}> got deleted !`)
}