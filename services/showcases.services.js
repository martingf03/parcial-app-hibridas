import { MongoClient, ObjectId } from "mongodb"
const client = new MongoClient("mongodb+srv://admin:admin@cluster0.i5t8aly.mongodb.net/");
const db = client.db("AH20232CP1");
const showcasesColl = db.collection("showcases");

export async function getAllShowcases(filter = {}) {
    try {
        await client.connect();
        const filterMongo = { deleted: { $ne: true } } 

        if (filter?.deleted === "true") {
            filterMongo.deleted = true;
        }

        if (filter?.category) {
            filterMongo.category = filter.category;
        }

        return showcasesColl.find(filterMongo).toArray();
    } catch (error) {
        console.error(`${error}: No se encontro ningun caso`);
        return []
    }
}

export async function getShowcaseById(id) {
    try {
        const showcases = await getAllShowcases();
        return showcases.find(showcase => showcase.id == id);
    } catch (error) {
        console.error(`${error}: No se encontro ningun caso`);
    }
}

export async function createShowcase(showcase) {
    try {
        const showcases = await getAllShowcases();
        const ids = showcases.map(item => item.id);
        const maxId = Math.max(...ids);
        const newId = maxId + 1;
        const newShowcase = {
            id: newId,
            title: showcase.title,
            summary: showcase.summary,
            category: showcase.category,
            stack: showcase.stack,
            demoUrl: showcase.demoUrl,
            imageUrl: showcase.imageUrl,
            clientId: showcase.clientId ?? null,
            deleted: false
        };
        showcases.push(newShowcase);

        await writeFile(archivo, JSON.stringify(showcases));
        return newShowcase;

    } catch (error) {
        console.error(`${error}: No se pudo crear el showcase`);
    }
}

export async function deleteShowcase(id) {
    try {
        const showcases = await getAllShowcases();
        const showcaseFound = showcases.find(showcase => showcase.id == id);

        if(!showcaseFound) {
            return null;
        }

        showcaseFound.deleted = true;

        await writeFile(archivo, JSON.stringify(showcases, null, 2));

        return showcaseFound;
    } catch (error) {
        console.error(`${error}: No se pudo borrar el showcase`);
        throw error
    }
}

export async function editShowcaseById(showcase) {
    try {
        const showcases = await getAllShowcases({ deleted: "all" });

        const index = showcases.findIndex(item => item.id == showcase.id)

        if(index === -1) {
            return null;
        }

        const showcaseOriginal = showcases[index];

        const showcaseEditado = {
            id: showcaseOriginal.id,
            title: showcase.title,
            summary: showcase.summary,
            category: showcase.category,
            stack: showcase.stack,
            demoUrl: showcase.demoUrl,
            imageUrl: showcase.imageUrl,
            clientId: showcase.clientId ?? null,
            deleted: showcaseOriginal.deleted
        };

        showcases[index] = showcaseEditado;

        await writeFile(archivo, JSON.stringify(showcases, null, 2));

        return showcaseEditado;


    } catch (error) {
        console.error(`${error}: No se pudo editar el showcase`);
        throw error;
    }
}