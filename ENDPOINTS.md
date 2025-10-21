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
- 