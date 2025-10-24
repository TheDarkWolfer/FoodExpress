# Documentation de l'API et de ses endpoints
## Tech stack
- **Database**
  - MongoDB 
    - API : Mongoose
    - Validation avec JOI
- **Auth**
  - JWT
  - Clef définie dans le .env
  - Structure :
    - sub   : ID d'utilisateur.ice.
    - role  : rôle attribué à l'utilisateur.ice ('admin' ou 'user').
    - iat   : date d'attribution (secondes UNIX depuis l'epoch du 1^er janvier 1970 à minuit UTC).
    - exp   : date d'expiration (également en secondes UNIX).
  - Stateless (le serveur agit uniquement sur la vérification et l'attribution des jetons au cas-par-cas).
## Config
- **Scripts NPM**
  - `test` -> Tests des endpoints avec Mocha (optionellement Mochawesome pour générer un document HTML).
  - `dev` -> Lance le projet en mode développement ; permet d'avoir un endpoint /users GET qui affiche tous.tes les utilisateur.ices et leurs informations.
  - `start` -> Lance le projet en mode production, sans l'endpoint /users GET mentionné ci-dessus.
  - `w-dev` -> Lance le projet en mode développement dans un environnement Windows (similaire au script `dev`, de par la différence dans l'établissement des variables d'environnement sous Windows).
  - `w-start` -> Lance le projet en mode production dans un environnement Windows.
- **.env**
  - SECRET : Phrase secrète utilisée pour la création et la vérification des JWTs.
    - Je conseille les commandes `cat /dev/urandom | head -n 1 | base64 | head -n 1` pour la générer de manière sécurisée.
  - SECRET_EXPIRATION : Durée de vie d'un JWT, part sur 2h par défaut dans le code.
  - MONGODB_URI : URI d'accès à la base de données MongoDB. 
  - DB_NAME : Base de données à utiliser, "FoodExpress" par défaut.
  - TEST_ON_PROD : Si oui ou non il faut lancer les tests sur la base de données de production. Pour des raisons évidentes, ***À éviter***.

## Documentation et tests :
### Tests :
- Utilisation de Mocha pour les tests,
  - Mochawesome permet d'avoir un compte-rendu plus visuel
  - Suite de modules de tests :
    - *mocha* : structure de base des tests
    - *chai* : similaire à *mocha* : structure de base des tests
    - *sinon* : Mocks, Stubs et similaires, bien que pas encore utilisés
    - *supertest* : simulation de l'API
    - *assert* : vérification de données
    - *cors* : autorisation des requêtes navigateur<->API
### Documentation :
- Utilisation de *Swagger* avec le standard *OpenAPI*
  - Accessible à [localhost:3000/api-docs](http://localhost:3000/api-docs) (uniquement en environnement de développement)
  - Couvre les opérations sur les endpoints `user`, `restaurants` et `menu`