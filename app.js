const express = require("express");
const path = require("path");
const connectDB = require("./db");

const app = express();


// On crée et expose la documentation Swagger uniquement
// si nous sommes dans un environnement de développement,
// pour des raisons de sécurité
if (process.env.NODE_ENV === "development") {
  const swaggerJSDoc = require("swagger-jsdoc");
  const swaggerUi = require("swagger-ui-express");
  const cors = require("cors");

  const options = {
    definition:{
      openapi:'3.0.0',
      info:{
        title:"FoodExpress - API backend",
        version:"0.1.0"
      },
      servers:[
        {
          url:'http://localhost:3000/'
        }
      ],
      components:{
        securitySchemes:{
          bearerAuth:{type:'http',scheme:'bearer',bearerFormat:'JWT'},
        },
        responses:{
          UnauthorizedError:{
            description: 'Accès non authentifié - token JWT manquant, invalide ou expiré',
            content:{
              'application/json': {
                schema:{$ref: '#/components/schemas/Error'}
              }
            }
          },
          ForbiddenError:{
            description: 'Accès interdit - token JWT présent mais invalide (ID non-admin ou manquant de droits)',
            content:{
              'application/json':{
                schema:{$ref: '#/components/schemas/Error'}
              }
            }
          }
        },
        schemas:{
          User:{
            type:'object',
            properties:{
              _id:{type:'string'},
              email:{type:'string'},
              username:{type:'string'},
              role:{type:'string',enum:['user','admin']},
            }
          },
          UserLogin:{
            type:'object',
            properties:{
              username:{
                type:'string',
                description:'Nom d\'utilisateur.ice',
                example:'lambda',
                required:true,
              },
              password:{
                type:'string',
                format:'password',
                description:'Mot de passe en clair, vérifié par hashage',
                writeOnly:true,
                example:'test1234',
                required:true,
              }
            }
          },
          UserCreate:{
            type:'object',
            properties:{
              username:{type:'string'},
              email:{type:'string'},
              password:{type:'string',format:'password',description:"Mot de passe en clair - hashé avant stockage et omis dans les réponses",writeOnly:true},
              role:{type:'string',enum:['user','admin']}
            }
          },
          Menu:{
            type:'object',
            properties:{
              _id:{type:'string'},
              name:{type:'string'},
              description:{type:'string'},
              price:{type:'number',format:'float'},
              category:{type:'string'},
            },
          },
          Restaurant:{
            type:'object',
            properties:{
              _id:{type:'string'},
              name:{type:'string'},
              address:{type:'string'},
              phone:{type:'integer'},
              opening_hours:{type:'string'},
            }
          },
          Error:{
            type:'object',
            properties:{
              error:{type:'string'}
            }
          }
        }
      }
    },
    apis:["./routes/menusRoutes.js","./routes/restaurantRoutes.js","./routes/usersRoutes.js","./app.js"]
  }

  const swaggerSpec = swaggerJSDoc(options)
  app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))

  app.use(cors({origin:"http://localhost:3000"}))
}

/*-------------+
 | Middlewares |
 +-------------*/
app.use(express.json());

/*----------+
 | Routeurs |
 +----------*/

try {
  const userRouter = require("./routes/usersRoutes.js");
  app.use("/users",userRouter);
  console.log(`User router loaded successfully !`)
} catch(error) {
  console.error(`Error when loading user router !\n-------\n${error}`)
}

try {
  const restaurantRouter = require("./routes/restaurantRoutes.js");
  app.use("/restaurants",restaurantRouter);
  console.log(`Restaurant router loaded successfully !`)
} catch(error) {
  console.error(`Error when loading restaurant router !\n-------\n${error}`)
}

try {
  const menuRouter = require("./routes/menusRoutes.js");
  app.use("/menus",menuRouter);
  console.log(`Menu router loaded successfully !`)
} catch(error) {
  console.error(`Error when loading menu router !\n-------\n${error}`)
}

// Ajouter la connection à la DB plus tard
try {
  connectDB();
} catch(error) {
  console.error(`/!\\ `)
}

//app.use("./middleware/auth.js");

if (process.env.NODE_ENV === "development") {
  console.log("╭─────────────────╮\n│ DEV ENVIRONMENT │\n╰─────────────────╯")
} else {
  console.log("╭──────────────────╮\n│ PROD ENVIRONMENT │\n╰──────────────────╯")
}

app.get("/",(req,res) => {
  return res.status(200).json({message:"It's running :D"});
});

module.exports = app;