import express from "express";
import ShowcasesRoutesApi from "./api/routes/showcases.routes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", ShowcasesRoutesApi);

app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente")
})

app.listen(3333, () => {
    console.log("Servidor funcionando en http://localhost:3333")
})