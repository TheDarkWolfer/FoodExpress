# Contributing
## Testing
Testing suite used is `mocha`, alongside `chai` and `supertest` (optional browser GUI through `mochawesome`)
Unit testing can be ran through the command `npm test`

## To-Do list : 
---
### This looks hard, but is 100% doable
---
### Main endpoints : 
#### /users <-Camille
- [x] *CRUD* operations
- [x] **DATA**{
	- [x] email=string, 
	- [x] username=string, 
	- [x] password=>sha256sum ,
	- [x] role=>"user" or "admin"
- [x] }
- [x] Users can only create/modify/delete their own account <-Camille
- [x] Admins can create/modify/delete any account <-Camille
- [x] Compartmentalization between user's PII <-Camille
- [x] *J*avascript*W*eb*T*okens -> **[jwt](jwt.io)** <-Camille
	- [x] Read on restaurants and menus => No auth ***W.I.P.*** <-Camille
	- [x] Stateless auth for write actions ***W.I.P.*** <-Camille
#### /restaurant
- [x] *CRUD* operations
- [x] **DATA**{
	- [x] name=>string,
	- [x] address=>string
	- [x] phone=>integers
	- [x] opening hours=>json,
- [x] }[[3API - DB]]
- [x] Admin-only creation, update and deletion ***W.I.P.*** <-Camille
- [x] Public read access with optional sorting by name/address
- [x] Adjustable pagination limit (default 10, adjusted through query parameters)
#### /menus <- Seda
- [x] *CRUD* operations
- [x] **DATA**{
	- [x] name=>string
	- [x] description=>string,
	- [x] price=>float,
	- [x] category=>string,
- [x] }
- [x] Admin-only creation, update and deletion
- [x] Public read access with optional sorting by price/category
- [x] Adjustable pagination limit (default 10, adjusted through query parameters)

### Other :
- [ ] Documentation using swagger/openapi
  - [ ] Doc pour /users
  - [ ] Doc pour /restaurants
  - [ ] Doc pour /menus
- [ ] Testing with mocha
  - [x] Tests pour /users <-Camille
  - [x] Tests pour /restaurants <-Camille
  - [ ] Tests pour /menus **WIP** <-Camille
- [ ] Powerpoint **WIP** <-Seda

---
# Nota Bene :
Due to how our workflow is set up, I often review changes made by Seda and commit them. While we've been trying to avoid this, it still happens from time to time ; to see who did what, refer to CONTRIBUTING.md instead of actual commit authors.
De par notre répartition du travail, je vérifie souvent des changements fait par Seda et les inclus dans mes commits. Nous essayons d'éviter de faire ça, mais ça arrive quand même de temps en temps ; pour voir qui a fait quoi, référez-vous au CONTRIBUTING.md au lieu des autrices de chaque commit.
