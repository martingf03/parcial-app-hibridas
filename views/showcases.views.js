function formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

function renderLayout({ title, heroTitle, heroText, categories = [], content }) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
        <header class="hero">
            <div class="hero-inner">
                <h1>${heroTitle}</h1>
                ${heroText ? `<p class="hero-text">${heroText}</p>` : ""}
                <nav class="menu" aria-label="Secciones del portfolio">
                    <a class="menu-link" href="/">Todos</a>
                    ${categories.map(category => `
                        <a class="menu-link" href="/section/${category}">${formatCategory(category)}</a>
                        `).join("")}
                    <a class="menu-link menu-link-deleted" href="/deleted">Proyectos borrados</a>
                </nav>
            </div>
        </header>
        <main class="page">
            ${content}
        </main>
    </body>
    </html>
    `;
}

function renderShowcaseCards(showcases) {
    return `
    <section class="grid">
        ${showcases.map(showcase => `
            <article class="card">
                <img class="card-image" src="${showcase.imageUrl}" alt="Preview de ${showcase.title}">
                <div class="card-body">
                    <p class="card-category">${formatCategory(showcase.category)}</p>
                    <h2>${showcase.title}</h2>
                    <p class="card-summary">${showcase.summary}</p>
                    <p><strong>Tecnologías:</strong> ${showcase.stack.join(", ")}</p>
                    <p><strong>Cliente:</strong> ${showcase.clientId ?? "Proyecto personal"}</p>
                    <p><strong>URL:</strong> ${showcase.demoUrl}</p>
                    <a class="card-link" href="/showcases/${showcase._id}/url">Link al proyecto</a>
                </div>
            </article>
        `).join("")}
    </section>
    `;
}

export function renderHomePage({ categories, showcases }) {
    const content = `
    <section class="intro">
        <div class="stats">
            <div class="stat">
                <strong>${showcases.length}</strong>
                <span>proyectos activos</span>
            </div>
            <div class="stat">
                <strong>${categories.length}</strong>
                <span>categorías disponibles</span>
            </div>
        </div>
    </section>
    ${renderShowcaseCards(showcases)}
    `;

    return renderLayout({
        title: "Mis proyectos",
        heroTitle: "Mis proyectos",
        heroText: "Filtrar por categorías",
        categories,
        content
    });
}

export function renderCategoryPage({ category, categories, showcases }) {
    const content = `
    <section class="intro">
        <div>
            <h2>${formatCategory(category)}</h2>
        </div>
        <div class="stats">
            <div class="stat">
                <strong>${showcases.length}</strong>
                <span>resultados encontrados</span>
            </div>
        </div>
    </section>
    ${renderShowcaseCards(showcases)}
    `;

    return renderLayout({
        title: `Sección ${formatCategory(category)}`,
        heroTitle: formatCategory(category),
        heroText: "Filtrar por categorías",
        categories,
        content
    });
}

export function renderDeletedPage({ categories, showcases }) {
    const content = `
    <section class="intro">
        <div>
            <h2>Borrados</h2>
        </div>
        <div class="stats">
            <div class="stat">
                <strong>${showcases.length}</strong>
                <span>proyectos borrados</span>
            </div>
        </div>
    </section>
    ${renderShowcaseCards(showcases)}
    `;

    return renderLayout({
        title: "Borrados",
        heroTitle: "Borrados",
        heroText: "",
        categories,
        content
    });
}

export function renderDeletedEmptyPage({ categories }) {
    const content = `
    <section class="fallback-box">
        <h2>Nada por aquí</h2>
        <p>No hay showcases borrados.</p>
        <a class="card-link" href="/">Volver al inicio</a>
    </section>
    `;

    return renderLayout({
        title: "Borrados",
        heroTitle: "Borrados",
        heroText: "",
        categories,
        content
    });
}

export function renderErrorPage(message, categories = []) {
    const content = `
    <section class="intro">
        <div>
            <h2>Ups</h2>
            <p>${message}</p>
            <a class="card-link" href="/">Volver al inicio</a>
        </div>
    </section>
    `;

    return renderLayout({
        title: "Error",
        heroTitle: "Oops",
        heroText: "",
        categories,
        content
    });
}

export function renderProjectFallbackPage({ title, text, categories = [] }) {
    const content = `
    <section class="fallback-box">
        <p class="eyebrow">Oops</p>
        <h2>${title}</h2>
        <p>${text}</p>
        <a class="card-link" href="/">Volver al inicio</a>
    </section>
    `;

    return renderLayout({
        title,
        heroTitle: "Oops",
        heroText: "",
        categories,
        content
    });
}
