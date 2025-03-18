import { fastify } from "./lib/fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import { RootRoute } from './routes/root-route';
import { DeleteClient } from './routes/Client/delete';
import { CreateClient } from './routes/Client/create';
import { UpdateClient } from './routes/Client/update';
import { GetClient } from "./routes/Client/get";

const app = fastify;

const port = Number(process.env.PORT) || 3300;

app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
    origin: "*",
});

app.register(RootRoute);

//Client
app.register(CreateClient);
app.register(DeleteClient);
app.register(UpdateClient);
app.register(GetClient);



app.listen({ port, host: "0.0.0.0" }).then(() => console.log(`Servidor rodando na porta : ${port}`))