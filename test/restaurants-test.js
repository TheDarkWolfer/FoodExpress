const sinon = require('sinon');
const { expect } = require('chai');
const assert = require("assert").strict
const supertest = require("supertest")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const app = require("../app.js")
dotenv.config()

// Comme pour les tests sur /users, on garde une liste des 'faux' restaurants créés, afin de les supprimer plus tard si et quand besoin est
let restaurantsIDs = []

if (!/test/i.test(process.env.DB_NAME) && !(process.env.TEST_ON_PROD?.toLowerCase()==="true")) {
  // Si les tests sont lancés sur une DB qui n'a pas une variation de "test" dans le
  // nom, on part du principe que c'est la DB de production. Mesure de sécurité, mais
  // qui peut être outrepassée grâce au fichier .env, même si c'est déconseillé.
  throw new Error("NOT RUNNING ON TEST DATABASE, ABORTING ! ! !")
}

describe("RESTAURANT router",() => {
  // On stockera deux tokens ; un token user normal, et un token admin.
  // Ça permettra de faire toutes les manipulations plus facilement
  // On crée des tokens admin et user grâce aux fonctions de l'utilisaire.
  // On ne va pas faire de login complet ici, les utilisateur.ices n'étant pas 
  // le focus de ce test
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

  // "Faux" restaurant qu'on crée pour les tests ; on le supprimera plus tard.
  before(async()=>{
    const _res = await supertest(app)
    .post("/restaurants")
    .set("Authorization",`Bearer ${adminToken}`)
    .send({
      name:"Outer Expanse",
      address:"Past the Farm Arrays",
      phone:"77777777",
      opening_hours:"Every Cycle"
    })
    .expect(201) // Devrait pas poser problème, mais on sais jamais
    let ID4l8r = _res.body._id // on prépare une variable pour stocker l'ID qu'on va secouer un peu pour les tests
    restaurantsIDs.push(ID4l8r) // On prévois de nettoyer après les tests, quand même
  })


  // Début des tests pour de vrai !

  it("GET /restaurants sans token -> Réussite et affichage des restaurants",async () => {
    const simpleGET = await supertest(app)
    .get("/restaurants")
    .expect(200)
    .then((res) => {
      // On stocke l'ID du premier restaurant qu'on attrape 
      // pour le manipuler plus tard pour les tests
      ID4l8r = res.body[0]._id
    })
  })

  it("POST /restaurants sans token -> Erreur 401",async () => {
    const designedToFail = await supertest(app)
    .post("/restaurants")
    .send({
      name:"The Restaurant of Failure",
      address:"401 Error Avenue, FailCity",
      phone:"401000000",
      opening_hours:"From 4:01am to 4:01pm"
    })
    .expect(401)
    .then((res)=> {expect(res.body).to.have.property('error') // On s'assure d'avoir un message en plus du code d'erreur
    })
  })

  it("POST /restaurants avec token utilisateur -> Erreur 403, mais cette fois c'est un problème de rôle",async () => {
    const designedToFailButDifferently = await supertest(app) 
    .post("/restaurants")
    .set("Authorization",`Bearer ${userToken}`)
    .send({
      name:"The Restaurant of Failure 2 Electric boogaloo",
      address:"403 Error Avenue, FailCity",
      phone:"403000000",
      opening_hours:"From 4:03am to 4:03pm"
    })
    .expect(403)
  })

  it("POST /restaurants avec token admin -> Création d'un nouveau restaurant",async () => {
    const designedToSucceed = await supertest(app)
    .post("/restaurants")
    .set("Authorization",`Bearer ${adminToken}`)
    .send({
      name:"The Restaurant of Success",
      address:"200 Success Street, GoodCity",
      phone:"200200200",
      opening_hours:"From 2:00am to 2:00am"
    })
    .expect(201)
  })

  it("POST /restaurants avec un token valide mais des données invalides -> Erreur 400", async () => {
    const willFailAgain = await supertest(app)
    .post("/restaurants")
    .set("Authorization",`Bearer ${adminToken}`)
    .send({
      name:new Set(),
      address:NaN,
      phone:undefined
      // Pas d'horaires, histoire de vraiment tout faire comme il faut pas :p
    })
    .expect(400)
    .then((res) => {
      // On s'assure de bien avoir une erreur de validation
      expect(res.body).to.have.property('message').that.equals("Validation error")
    })
  })

  // Maintenant qu'on a bien vérifié la création de restaurants, on passe à la suite

  it("PATCH /restaurants sans token valide -> Erreur 401",async () => {
    const patch2Fail = await supertest(app)
    .patch(`/restaurants/${ID4l8r}`)
    .send({
      name:"Subterranean"
    })
    .expect(401)
    .then((res)=>{
      expect(res.body).to.have.property('error').that.equals('Missing or invalid Authorization header')
    })
  })

  it("PATCH /restaurants avec un token utilisateur.ice -> Erreur 403",async() => {
    const otherPatch2Fail = await supertest(app)
    .patch(`/restaurants/${ID4l8r}`)
    .set("Authorization",`Bearer ${userToken}`)
    .send({
      name:"Metropolis"
    })
    .expect(403)
    .then((res) => {
      expect(res.body).to.have.property('error').that.equals("Access forbidden to this ID, sorry")
    })
  })

  it("PATCH /restaurants avec des données invalides",async () => {
    const patchWithBadData = await supertest(app)
    .patch(`/restaurants/${ID4l8r}`)
    .set("Authorization",`Bearer ${adminToken}`)
    .send({
      name:"Metropolis",
      owner:"Five Pebbles"
    })
    .expect(400)
  })

  // On garde les DELETE pour la fin
  it("DELETE /restaurants sans token valide -> Erreur 401",async ()=> {
    const deleteThatWillFail = await supertest(app)
    .delete(`/restaurants/${ID4l8r}`)
    .expect(401)
    .then((res)=>{
      // On vérifie qu'on a la bonne erreur
      expect(res.body).to.have.property('error')
    })
  })

  it("DELETE /restaurants avec token utilisateur.ice -> Erreur 401",async () => {
    const anotherDeleteThatWillFail = await supertest(app)
    .delete(`/restaurants/${ID4l8r}`)
    .expect(401)
    .then((res) => {
      // Encore une fois, on checke que c'est la bonne erreur
      expect(res.body).to.have.property('error')
    })
  })

})