# Etapa 1: Construção
FROM node:20-alpine AS build

WORKDIR /app

# Copiar os ficheiros necessários
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto do código
COPY . .

# Gerar o cliente Prisma (necessário)
RUN npx prisma generate

# Etapa 2: Execução
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app ./

# Definir a porta (Koyeb usa variável de ambiente PORT)
ENV PORT=8080

EXPOSE 8080

# Comando para iniciar o app
CMD ["npm", "run", "start"]
