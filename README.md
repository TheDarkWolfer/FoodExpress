# FoodExpress API
## Sommaire
- [FoodExpress API](#foodexpress-api)
- [Sommaire](#sommaire)
- [Structure](#structure)
- [Installation](#installation)
- [Nota Bene :](#nota-bene-)

[Contributing on the project](CONTRIBUTING.md)
## Structure
- `/users`
  - Comptes utilisateurs, accès réservé aux utilisateur.ices sur leurs données, et aux admins sur toutes les données
  - PII séparées d'un.e utilisateur.ice à l'autre
  - Authentification stateless avec JWT
- `/restaurant`
  - Création, Mise-à-Jour et Suppression limitées aux administrateur.ices
  - Lecture publique avec pagination et option de recherche
- `/menus`
  - Création, Mise-à-Jour et Suppression limitées aux administrateur.ices
  - Lecture publique avec pagination et option de recherche

## Installation
> Le guide d'installation part du principe que vous avez déjà [NodeJS](https://nodejs.org/) >= 22.21.0 et [npm](https://www.npmjs.com/) >= 11.6.2
Les fichiers importants du projet sont tous présents sur ce dépôt. Vous pouvez donc le récupérer comme suit, et en installer les dépendances:
```shell
git clone https://github.com/TheDarkWolfer/FoodExpress
cd FoodExpress
npm install
```
Suite à cela, vous avez plusieurs options qui s'offrent à vous. Le projet a deux modes de fonctionnement : `development` et `production`. 
En mode `development`, deux endpoints supplémentaires sont disponibles : /api-docs et /users (GET).
- **/api-docs** :
  - Accès à la documentation Swagger/OpenAPI
- **/users (GET)** : 
  - Accès aux informations utilisateur.ices (mot de passe omis par sécurité)
Le reste de la configuration, tel que le choix de la base de données, se fait à travers le .env comme décrit dans [ENDPOINTS.md](ENDPOINTS.md#env)
### Windows :
Lancement en mode `development` :
```shell
npm run w-dev
```
Lancement en mode `production` :
```shell
npm run w-start
```
### Unix : 
Lancement en mode `development` :
```shell
npm run dev
```
Lancement en mode `production` :
```shell
npm run start
```
> La différenciation entre l'environnement de production et celui de développement se fait grâce à la valeur de la variable d'environnement `NODE_ENV`, omise dans le .env pour permettre une utilisation plus libre de cette fonctionnalité. 

Vous pouvez ensuite intéragir avec l'API avec cUrl, par exemple, comme suit (l'outil [`jq`](https://jqlang.org/) est fortement recommandé pour manipuler le json renvoyé) :
```shell
#Login en tant qu'Alan Turing
curl -X POST http://localhost:3000/users/login \
-H "Content-Type:application/json" \
-d '{"username":"alanturing","password":"iconic"}'

# Accessoirement, login et sauvegarde du token pour faciliter les tests, mon petit tour préféré ^.^ :
curl -s -X POST http://localhost:3000/users/login \
-H "Content-Type:application/json" \
-d '{"username":"alanturing","password":"iconic"}' | jq -r ".token" > TOKEN

#Création d'utilisateur.ice
curl -X POST http://localhost:3000/users/login \
-H "Content-Type:application/json" \
-d '{"username":"socrates","email":"socrates@athens.mail","password":"glory2greece","role":"user"}'

#Lecture des menus ayant "Fried" dans le nom
curl -G http://localhost:3000/menus --data-urlencode="search=Fried"

#Modification d'un restaurant
curl -X DELETE http://localhost:3000/restaurants/68fa1b0cc0abbb59ab8a9b9e \
-H "Authorization: Bearer <ISwearThisIsARealToken>"
-H "Content-Type:application/json"
-d '{"name":"Chez Fred","address":"260 Rue Saint-Martin, 26740 Montboucher-sur-Jabron, France"}'
```
---
# Nota Bene :
Due to how our workflow is set up, I often review changes made by Seda and commit them. While we've been trying to avoid this, it still happens from time to time ; to see who did what, refer to CONTRIBUTING.md instead of actual commit authors.
De par notre répartition du travail, je vérifie souvent des changements fait par Seda et les inclus dans mes commits. Nous essayons d'éviter de faire ça, mais ça arrive quand même de temps en temps ; pour voir qui a fait quoi, référez-vous au CONTRIBUTING.md au lieu des autrices de chaque commit.
