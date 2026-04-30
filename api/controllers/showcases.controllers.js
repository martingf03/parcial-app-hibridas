import * as service from "../../services/showcases.services.js";

export function findAllShowcases(req, res) {
    const filter = req.query;

    return service.getAllShowcases(filter)
        .then(showcases => res.status(200).json(showcases))
        .catch(err => res.status(500).json({ message: "No se pudo obtener los casos" }))
}

export function findShowcaseById(req, res) {
    const id = req.params.id
    return service.getShowcaseById(id)
        .then(showcase => {
            if (!showcase) {
                return res.status(404).json({ message: "No se encontro showcase" })
            }
            return res.status(200).json(showcase)
        })
        .catch(err => res.status(500).json({ message: "No se pudo obtener el caso" }))
}

export function addShowcase(req, res) {
    const { title, summary, category, stack, demoUrl, imageUrl, clientId } = req.body;

    if (!title || !summary || !category || !stack || !demoUrl || !imageUrl) {
        return res.status(400).json({
            message: "Faltan campos obligatorios"
        });
    }

    if (!Array.isArray(stack)) {
        return res.status(400).json({
            message: "El campo stack debe ser un array"
        })
    }

    const newShowcaseData = {
        title,
        summary,
        category,
        stack,
        demoUrl,
        imageUrl,
        clientId: clientId ?? null,
    };

    return service.createShowcase(newShowcaseData)
        .then(newShowcaseData => res.status(201).json(newShowcaseData))
        .catch(err => res.status(500).json({ message: "No se pudo crear el caso" }))
}

export function removeShowcase(req, res) {
    const id = req.params.id;

    return service.deleteShowcase(id)
        .then(showcase => {
            if (!showcase) {
                return res.status(404).json({
                    message: "No se encontro el showcase"
                });
            }
            return res.status(202).json(showcase);
        })
        .catch(error => res.status(500).json({
            message: "No se pudo borrar el showcase"
        }));
}

// PUT
export function replaceShowcase(req, res) {
    const id = req.params.id;

    const { title, summary, category, stack, demoUrl, imageUrl, clientId } = req.body;

    if (!title || !summary || !category || !stack || !demoUrl || !imageUrl) {
        return res.status(400).json({
            message: "Faltan campos obligatorios"
        });
    }

    if (!Array.isArray(stack)) {
        return res.status(400).json({
            message: "El campo stack debe ser un array"
        });
    }

    const showcase = {
        _id: id,
        title,
        summary,
        category,
        stack,
        demoUrl,
        imageUrl,
        clientId: clientId ?? null
    };

    return service.editShowcaseById(showcase)
        .then(showcaseEditado => {
            if (!showcaseEditado) {
                return res.status(404).json({
                    message: "No se encontro el showcase"
                });
            }

            return res.status(202).json(showcaseEditado);
        })
        .catch(err => res.status(500).json({
            message: "No se pudo reemplazar el showcase"
        }));
}

// PATCH
export async function updateShowcase(req, res) {
    const id = req.params.id;

    const oldShowcase = await service.getShowcaseById(id);

    if (!oldShowcase) {
        return res.status(404).json({
            message: "No se encontro el showcase"
        });
    }

    const showcase = {
        _id: id,
        title: req.body?.title ? req.body.title : oldShowcase.title,
        summary: req.body?.summary ? req.body.summary : oldShowcase.summary,
        category: req.body?.category ? req.body.category : oldShowcase.category,
        stack: req.body?.stack ? req.body.stack : oldShowcase.stack,
        demoUrl: req.body?.demoUrl ? req.body.demoUrl : oldShowcase.demoUrl,
        imageUrl: req.body?.imageUrl ? req.body.imageUrl : oldShowcase.imageUrl,
        clientId: req.body?.clientId !== undefined ? req.body.clientId : oldShowcase.clientId
    };

    if (!Array.isArray(showcase.stack)) {
        return res.status(400).json({
            message: "El campo stack debe ser un array"
        });
    }

    return service.editShowcaseById(showcase)
        .then(showcaseEditado => res.status(202).json(showcaseEditado))
        .catch(err => res.status(500).json({
            message: "No se pudo actualizar el showcase"
        }));
}
