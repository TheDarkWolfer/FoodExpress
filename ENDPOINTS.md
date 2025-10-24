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
    - sub   : ID d'utilisateur.ice
    - role  : rôle attribué à l'utilisateur.ice ('admin' ou 'user')
    - iat   : date d'attribution (secondes UNIX depuis l'epoch du 1^er janvier 1970 à minuit UTC)
    - exp   : date d'expiration (également en secondes UNIX)
  - Stateless (le serveur agit uniquement sur la vérification et l'attribution des jetons au cas-par-cas)
## Config
- **Scripts NPM**
  - `test` -> Tests des endpoints avec Mocha (optionellement Mochawesome pour générer un document HTML)
  - `dev` -> Lance le projet en mode développement ; permet d'avoir un endpoint /users GET qui affiche tous.tes les utilisateur.ices et leurs informations 
  - `start` -> Lance le projet en mode production, sans l'endpoint /users GET mentionné ci-dessus
  - `w-dev` -> Lance le projet en mode développement dans un environnement Windows (similaire au script `dev`, de par la différence dans l'établissement des variables d'environnement sous Windows)
  - `w-start` -> Lance le projet en mode production dans un environnement Windows