# FoodExpress API
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
