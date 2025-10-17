# FoodExpress API
[Contributing on the project](CONTRIBUTING.md)
## Structure
- `/users`
  - User accounts, admins have access.
  - PII is separate from user to user
  - JWT-based auth
- `/restaurant`
  - Admin-only creation, update and deletion
  - Public read access
- `/menus`
  - Admin-only creation, update and deletion
  - Public read access


---
# Nota Bene :
Due to how our workflow is set up, I often review changes made by Seda and commit them. While we've been trying to avoid this, it still happens from time to time ; to see who did what, refer to CONTRIBUTING.md instead of actual commit authors.
De par notre répartition du travail, je vérifie souvent des changements fait par Seda et les inclus dans mes commits. Nous essayons d'éviter de faire ça, mais ça arrive quand même de temps en temps ; pour voir qui a fait quoi, référez-vous au CONTRIBUTING.md au lieu des autrices de chaque commit.
