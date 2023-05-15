# Let's explore mongoose ODM.

- route -> controller -> service -> model -> schema

### This way we can write api doc so that any developer can understand the api's responsibility

- example for getting all products route
  /\*

- @api {get} /api/v1/products -> get all products
- @apiDescription get all products
- @apiPermission every user
-
- @apiHeader {String} Authorization nothing needed so far cause authentication is not implemented yet

- @apiSuccess [{}] -> an array of products
-
- @apiError (Unauthorized 401) Unauthorized everyone can access the data
- @apiError (Forbidden 403) Forbidden everyone can access the data
  \*/

- kivabe signup/password reset egula khetre mail send korte hoy, ta implement kora hoy nai. future project e dorkar hole 10.7 / 10.8 theke dekhe niye mailgun ba google ba onno kono package diye mail sending ta kore fela jabe in sha allah.
