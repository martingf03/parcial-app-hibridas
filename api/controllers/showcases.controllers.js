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