const express = require("express");
const cors = require("cors");

const arbolRouter = require("./nuevo_arbol/arbol");   // Ruta del árbol

const app = express();
app.use(cors());

app.use("/api", arbolRouter);   

app.listen(5000, () => {
    console.log("Servidor corriendo en http://localhost:5000");
});