import { writeFile, readFile } from "fs/promises"

const archivo = "./data/showcases.json"

export async function getAllShowcases(filter = {}) {
    try {
        const rawShowcases = await readFile(archivo, "utf-8");
        let showcases = JSON.parse(rawShowcases);

        if(filter?.deleted === "true") {
            showcases = showcases.filter(showcase => showcase.deleted === true);
        } else {
            showcases = showcases.filter(showcase => showcase.deleted !== true);
        }

        if(filter?.category) {
            showcases = showcases.filter(showcase => showcase.category === filter.category)
        }

        return showcases;
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