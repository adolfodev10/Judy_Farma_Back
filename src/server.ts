import { fastify } from "./lib/fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import { RootRoute } from './routes/root-route';
import { DeleteClient } from './routes/Client/delete';
import { CreateClient } from './routes/Client/create';
import { UpdateClient } from './routes/Client/update';
import { GetClient } from "./routes/Client/get";
import { CreateUser } from "./routes/User/create";
import { GetUser } from "./routes/User/get";
import { CreateFuncao } from "./routes/Funcao/create";
import { GetAllFuncao } from "./routes/Funcao/get";
// import multipart from "@fastify/multipart";

const app = fastify;

const port = Number(process.env.PORT) || 3300;

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
    origin: "*",
    credentials:true,
});

// app.register(multipart, {
//     limits: {
//       fieldNameSize: 100,
//       fieldSize: 1024 * 1024 * 5,
//       fields: 1000,
//       fileSize: 1024 * 1024 * 50,
//       files: 100,
//       headerPairs: 2000,
//       parts: 1000,
//     },
//     attachFieldsToBody: true,
//   });

//Root Route
app.register(RootRoute);


//Funcao
app.register(CreateFuncao);
app.register(GetAllFuncao);


//User
app.register(CreateUser);
app.register(GetUser);

//Client
app.register(CreateClient);
app.register(DeleteClient);
app.register(UpdateClient);
app.register(GetClient);



app.listen({ port, host: "0.0.0.0" }).then(() => console.log(`Servidor rodando na porta : ${port}`))