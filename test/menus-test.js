const sinon = require("sinon");
const { expect } = require("chai");
const assert = require("assert").strict;
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const app = require("../app.js");

dotenv.config()


// Pareil que dans les autres tests ; on garde une liste, histoire de bien nettoyer
let menusIDs = []

if (!/test/i.test(process.env.DB_NAME) && !(process.env.TEST_ON_PROD?.toLowerCase()==="true")) {
  throw new Error("NOT RUNNING TESTS ON DATABASE, ABORTING ! ! !")
}

describe("MENU router",() => {
  // Les deux tokens dont on aura besoins
  const userToken = jwt.sign(
    {sub:"FAKE_USER_ID",role:"user"},
    process.env.SECRET,
    {expiresIn:process.env.JWT_EXPIRES || "1h" } // Une heure de durée de vie de token devrait être suffisante pour les tests
  )
  const adminToken = jwt.sign(
    {sub:"FAKE_ADMIN_ID",role:"admin"},
    process.env.SECRET,
    {expiresIn:process.env.JWT_EXPIRES || "1h" } // Même durée de vie
  )

  let ID4l8r

  // "Faux" menu qu'on crée pour les tests ; on le supprimera plus tard.
  before(async()=>{
    const _res = await supertest(app)
    .post("/menu")
    .set("Authorization",`Bearer ${adminToken}`)
    .send({
      name:"Fillet o' Jetfish",
      description:"A cooked filet of jetfish, straight from Shoreline !",
      price:13.99,
      category:"seafood"
    })
    .expect(201) // Devrait pas poser problème, mais on sais jamais
    ID4l8r = _res.body._id // on prépare une variable pour stocker l'ID qu'on va secouer un peu pour les tests
    menusIDs.push(ID4l8r) // On prévois de nettoyer après les tests, quand même
  })

  // Test de lecture des menus
  it("GET /menu -> 200 avec les données en JSON",async () => {
    const gettingAllMenus = await supertest(app)
    .get("/menu")
    .expect(200)
    .expect("Content-Type",/json/) // On vérifie qu'on a bien un objet JSON
  })

  // Test de lecture avec opérateur de recherche
  it("GET /menu avec query -> 200 avec des données JSON filtrées",async () => {
    const gettingMenus = await supertest(app)
    .get("/menu")
    .query({search:"Bat"})
    .expect(200)
    .expect("Content-Type",/json/)

    assert.ok(Array.isArray(gettingMenus.body),"Response should be an array. (if it's not, send help)")
    // 'Dé-commenter' la ligne qui suit pour checker le nombre d'objets rendus par le filtre. Désactivé par défaut car 
    // vérifier la longueur de la réponse dépend du filtre utilisé dans les tests, du contenu de la base de données, et 
    // probablement de la phase de la lune à ce point...
    //assert.equal(gettingMenus.body.length,10,"Should display 10 items. If not, bring some help please.")
  })

  // Création d'un menu, sans token valide
  it("POST /menu sans token -> 401 Unauthorized",async () => {
    const unauthorizedAttempt = await supertest(app)
    .post("/menu")
    .send({
      name:"Unfortunate Development",
      description:"The results of poor planning",
      price:99.99,
      category:"mistakes"
    })
    .expect(401)
  })

  // Création d'un menu avec token utilisateur.ice
  it("POST /menu avec token utilisateur.ice -> 403 Forbidden",async () => {
    const forbiddenAttempt = await supertest(app)
    .post("/menu")
    .set("Authorization",`Bearer ${userToken}`)
    .send({
      name:"Coalescepide Curry",
      description:"A bunch of coalescepides fried in a nice curry",
      price:12.34,
      category:"spicy"
    })
    .expect(403)
  })

  // Création d'un menu avec un token administrateur.ice
  it("POST /menu avec token administrateur.ice -> 201 Created",async () => {
    const newMenuCreation = await supertest(app)
    .post("/menu")
    .set("Authorization",`Bearer ${adminToken}`)
    .send({
      name:"Neuron Fly",
      description:"A singular neuron fly ; may cause glowing upon consumption",
      price:101.99,
      category:"enlightened"
    })
    .expect(201)
    .expect("Content-Type",/json/)

    // On vérifie le contenu de la réponse à laquelle nous avons droit
    expect(newMenuCreation.body).to.be.an("object");
    expect(newMenuCreation.body.name).to.equal("Neuron Fly");
    expect(newMenuCreation.body).to.have.property("_id");
    menusIDs.push(newMenuCreation.body._id);
  })

  // PATCH non-authentifié
  it("PATCH /menu/<ID> sans token -> 401 Unauthorized",async () => {
    const unauthenticatedPatch = await supertest(app)
    .patch(`/menu/${ID4l8r}`)
    .send({
      name:"Red Spider Roast",
      description:"Just mind the toxins..."
    })
    .expect(401)
  })

  // Patch avec un token utilisateur.ice 
  it("PATCH /menu/<ID> avec un token utilisateur.ice -> 403 Forbidden",async () => {
    const forbiddenPatch = await supertest(app)
    .patch(`/menu/${ID4l8r}`)
    .set("Authorization",`Bearer ${userToken}`)
    .send({
      name:"Chilly Popcorn plant",
      description:"Popcorn plant bred in the harsh winters of the Silent Construct, a tasty dessert"
    })
    .expect(403)
  })

  // Patch avec un token administrateur.ice
  it("PATCH /menu/<ID> avec un token administrateur.ice -> 200",async () => {
    const successfulPatch = await supertest(app)
    .patch(`/menu/${ID4l8r}`)
    .set("Authorization",`Bearer ${adminToken}`)
    .send({
      name:"[REDACTED]",
      description:"Recipe to engineer one's cells to allow for self-annihilation. Unavailable under the self-annihilation edict"
    })
    .expect(200)
    
    expect(successfulPatch.body).to.be.an("object");
    expect(successfulPatch.body.name).to.equal("[REDACTED]");
  })
  
  // DELETE sans token
  it("DELETE /menu/<ID> -> 401",async () => {
    const unauthorizedDelete = await supertest(app)
    .delete(`/menu/${ID4l8r}`)
    .expect(401)
  })

  // DELETE avec token utilisateur.ice
  it("DELETE /menu/<ID> avec token utilisateur.ice -> 403",async () => {
    const forbiddenDelete = await supertest(app)
    .delete(`/menu/${ID4l8r}`)
    .set("Authorization",`Bearer ${userToken}`)
    .expect(403)
  })

  it("DELETE /menu/<ID> avec token administrateur.ice -> 200",async () => {
    const successfulDelete = await supertest(app)
    .delete(`/menu/${ID4l8r}`)
    .set("Authorization",`Bearer ${adminToken}`)
    .expect(200)
    menusIDs = menusIDs.filter(id => id !== ID4l8r)
  })

  after(async () => {
    for (let i = 0; i < menusIDs.length; i++) {
    const gettingDeleted = menusIDs[i];
    await supertest(app).delete(`/menu/${gettingDeleted}`).set("Authorization",`Bearer ${adminToken}`)
    console.log(`Menu with ID <${gettingDeleted}> got deleted !`)
    }
  })
})