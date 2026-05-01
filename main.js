import express from "express";
import ShowcasesRoutesApi from "./api/routes/showcases.routes.js"
import ShowcasesRoutesWeb from "./routes/showcases.routes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api", ShowcasesRoutesApi);
app.use("/", ShowcasesRoutesWeb);

app.listen(3333, () => {
    console.log("Servidor funcionando en http://localhost:3333")
})
