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
	- [x] id=>Numerical ID, 
	- [x] email=string+regex , 
	- [x] username=string+regex , 
	- [x] password=>sha256sum ,
	- [x] role=>"user" or "admin"
- [ ] }
- [ ] Users can only create/modify/delete their own account
- [ ] Admins can create/modify/delete any account
- [ ] Compartmentalization between user's PII
- [ ] *J*avascript*W*eb*T*okens -> **[jwt](jwt.io)** ***W.I.P.*** <-Camille (attribution OK)
	- [ ] Read on restaurants and menus => No auth
	- [ ] Stateless auth for write actions
#### /restaurant
- [ ] *CRUD* operations
- [ ] **DATA**{
	- [ ] id=>Numerical ID,
	- [ ] name=>string+regex,
	- [ ] address=>string+regex,(potential map validation too),
	- [ ] phone=>integers+regex,(potential more precise regex match),
	- [ ] opening hours=>json,
- [ ] }[[3API - DB]]
- [ ] Admin-only creation, update and deletion
- [ ] Public read access with optional sorting by name/address
- [ ] Adjustable pagination limit (default 10, adjusted through query parameters)
#### /menus <- Seda
- [ ] *CRUD* operations
- [ ] **DATA**{
	- [ ] id=>Numerical ID,
	- [ ] restaurant_id=>Numerical ID+validation,
	- [ ] name=>string+regex,
	- [ ] description=>string+max size,
	- [ ] price=>float,
	- [ ] category=>string+regex,
- [ ] }
- [ ] Admin-only creation, update and deletion
- [ ] Public read access with optional sorting by price/category
- [ ] Adjustable pagination limit (default 10, adjusted through query parameters)

### Other :
- [ ] Documentation using swagger/openapi
- [ ] Testing with mocha
- [ ] Powerpoint