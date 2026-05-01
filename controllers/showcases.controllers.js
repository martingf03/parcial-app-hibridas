import * as service from "../services/showcases.services.js";
import * as view from "../views/showcases.views.js";

function getCategories(showcases) {
    return [...new Set(showcases.map(showcase => showcase.category))].sort();
}

export async function showHomepage(req, res) {
    try {
        const showcases = await service.getAllShowcases();
        const categories = getCategories(showcases);

        return res.status(200).send(
            view.renderHomePage({
                categories,
                showcases
            })
        );
    } catch (error) {
        return res.status(500).send(view.renderErrorPage("No se pudo cargar la pagina principal"));
    }
}

export async function showCategoryPage(req, res) {
    try {
        const category = req.params.category;
        const allShowcases = await service.getAllShowcases();
        const categories = getCategories(allShowcases);
        const showcases = await service.getAllShowcases({ category });

        if (showcases.length === 0) {
            return res.status(404).send(
                view.renderErrorPage("No se encontraron showcases para esta seccion", categories)
            );
        }

        return res.status(200).send(
            view.renderCategoryPage({
                category,
                categories,
                showcases
            })
        );
    } catch (error) {
        return res.status(500).send(view.renderErrorPage("No se pudo cargar la seccion"));
    }
}

export async function showDeletedPage(req, res) {
    try {
        const activeShowcases = await service.getAllShowcases();
        const categories = getCategories(activeShowcases);
        const deletedShowcases = await service.getAllShowcases({ deleted: "true" });

        if (deletedShowcases.length === 0) {
            return res.status(200).send(
                view.renderDeletedEmptyPage({ categories })
            );
        }

        return res.status(200).send(
            view.renderDeletedPage({
                categories,
                showcases: deletedShowcases
            })
        );
    } catch (error) {
        return res.status(500).send(view.renderErrorPage("No se pudo cargar la vista de borrados"));
    }
}

export async function openShowcaseUrlPage(req, res) {
    try {
        const id = req.params.id;
        const allShowcases = await service.getAllShowcases();
        const categories = getCategories(allShowcases);
        const showcase = await service.getShowcaseById(id);

        if (!showcase) {
            return res.status(404).send(
                view.renderProjectFallbackPage({
                    categories,
                    title: "Oops, este showcase no existe",
                    text: "La pagina que intentaste abrir no esta disponible o todavia esta en construccion."
                })
            );
        }

        const isPlaceholderProject = showcase.demoUrl.includes("example.com");

        if (isPlaceholderProject) {
            return res.status(200).send(
                view.renderProjectFallbackPage({
                    categories,
                    title: showcase.title,
                    text: "Este proyecto todavia no tiene una pagina publica. Podes volver al inicio y seguir navegando."
                })
            );
        }

        return res.redirect(showcase.demoUrl);
    } catch (error) {
        return res.status(500).send(
            view.renderProjectFallbackPage({
                title: "Oops",
                text: "No se pudo abrir el proyecto."
            })
        );
    }
}

export async function showNotFoundPage(req, res) {
    try {
        const allShowcases = await service.getAllShowcases();
        const categories = getCategories(allShowcases);

        return res.status(404).send(
            view.renderProjectFallbackPage({
                categories,
                title: "Oops, pagina no encontrada",
                text: "La ruta que buscaste no existe o todavia no fue armada."
            })
        );
    } catch (error) {
        return res.status(404).send(
            view.renderProjectFallbackPage({
                title: "Oops, pagina no encontrada",
                text: "La ruta que buscaste no existe o todavia no fue armada."
            })
        );
    }
}
