import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("AH20232CP1");
const showcasesCollection = db.collection("showcases");

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

        return showcasesCollection.find(filterMongo).toArray();
    } catch (error) {
        console.error(`${error}: No se encontro ningun caso`);
        return []
    }
}

export async function getShowcaseById(id) {
    try {
        await client.connect();
        return showcasesCollection.findOne({
            _id: new ObjectId(id),
            deleted: { $ne: true }
        });
    } catch (error) {
        console.error(`${error}: No se encontro ningun caso`);
        return null;
    }
}

export async function createShowcase(showcase) {
    try {
        await client.connect();

        const newShowcase = {
            title: showcase.title,
            summary: showcase.summary,
            category: showcase.category,
            stack: showcase.stack,
            demoUrl: showcase.demoUrl,
            imageUrl: showcase.imageUrl,
            clientId: showcase.clientId ?? null,
            deleted: false
        };
        
        const result = await showcasesCollection.insertOne(newShowcase);

        return {
            _id: result.insertedId,
            ...newShowcase
        };
    } catch (error) {
        console.error(`${error}: No se pudo crear el showcase`);
        throw error;
    }
}

export async function deleteShowcase(id) {
    try {
        await client.connect();

        const showcaseFound = await getShowcaseById(id);

        if(!showcaseFound) {
            return null;
        }

        await showcasesCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { deleted: true }
            }
        );

        return {
            ...showcaseFound, 
            deleted: true
        };
    } catch (error) {
        console.error(`${error}: No se pudo borrar el showcase`);
        throw error
    }
}

export async function editShowcaseById(showcase) {
    try {
        await client.connect();

        const { _id, ...showcaseSinId } = showcase;

        const showcaseFound = await getShowcaseById(_id);

        if (!showcaseFound) {
            return null;
        }

        await showcasesCollection.updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: showcaseSinId
            }
        );

        return {
            _id,
            ...showcaseSinId,
            deleted: showcaseFound.deleted
        };
    } catch (error) {
        console.error(`${error}: No se pudo editar el showcase`);
        throw error;
    }
}
