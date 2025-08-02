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
import { GetAllFuncao, GetAllFuncaoNotAdmin } from "./routes/Funcao/get";
import { Login } from "./routes/Auth/login";
import { ValidationToken } from "./routes/Auth/validation";
import { GetFuncaoById } from "./routes/Funcao/getFuncaoById";
import { GetFuncaoByName } from "./routes/Funcao/getFuncaoByName";
import { GetAllProduct, GetAllProductTheVenda, GetProfitByMonth } from "./routes/Product/get";
import multipart from "@fastify/multipart";
import { GetUserById } from "./routes/User/getUserById";
import { GetAllVenda } from "./routes/Venda/get";
import { CreateProduct } from "./routes/Product/create";
import { CreateVenda } from "./routes/Venda/create";
import { deleteProduct } from "./routes/Stock/delete";
import { CreateStockProduct } from "./routes/Stock/create";
import { DeleteProduct } from "./routes/Product/delete";
import { EditProduct } from "./routes/Product/update";
import { EditStock } from "./routes/Stock/update";
import { UpdateUser } from "./routes/User/update";
import { GetAllProductStock } from "./routes/Stock/get";
import { DeleteUser } from "./routes/User/delete";
import { CreateInvoice } from "./routes/Invoices/create";
import { GetAllInvoice } from "./routes/Invoices/get";
import { AddProductInStock } from "./routes/Product/add";
import socketPlugin from "./plugins/socket";
// import { startExpirationJob } from "./jobs/expired-products";

const app = fastify;
const port = Number(process.env.PORT) || 3300;
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://judyfarma.vercel.app',
    'https://judyfarma-support.vercel.app',
  ],
  credentials: true,
  methods: [
    "POST",
    "DELETE",
    "PUT",
    "PATCH",
    "OPTION"
  ]
});

app.register(multipart, {
  limits: {
    fieldNameSize: 100,
    fieldSize: 1024 * 1024 * 5,
    fields: 1000,
    fileSize: 1024 * 1024 * 50,
    files: 100,
    headerPairs: 2000,
    parts: 1000,
  },
  attachFieldsToBody: true,
});

// app.ready().then(()=> {
//   startExpirationJob(app);
// })

app.register(socketPlugin);

//Root Route

app.register(RootRoute);


//Funcao
app.register(CreateFuncao);
app.register(GetAllFuncao);
app.register(GetFuncaoById);
app.register(GetFuncaoByName);
app.register(GetAllFuncaoNotAdmin);

//User
app.register(CreateUser);
app.register(GetUser);
app.register(GetUserById);
app.register(UpdateUser);
app.register(DeleteUser);

//Auth
app.register(Login);
app.register(ValidationToken);

//Product
app.register(AddProductInStock);
app.register(GetAllProduct);
app.register(GetAllProductTheVenda);
app.register(CreateProduct)
app.register(DeleteProduct);
app.register(EditProduct);
app.register(GetProfitByMonth)

//Stock
app.register(deleteProduct);
app.register(CreateStockProduct);
app.register(EditStock);
app.register(GetAllProductStock);

//Venda
app.register(GetAllVenda);
app.register(CreateVenda)

//Client
app.register(CreateClient);
app.register(DeleteClient);
app.register(UpdateClient);
app.register(GetClient);

//Invoice
app.register(CreateInvoice);
app.register(GetAllInvoice);



app.listen({ port, host: "0.0.0.0" }).then(() => console.log(`Servidor rodando na porta : ${port}`))