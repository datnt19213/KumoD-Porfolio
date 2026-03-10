/**
 * Template Syntax
 * {{#each arrayName}}
 * {{/each}}
 *
 * {{#if variable}}
 * {{/if}}
 *
 * {{variable}}
 *
 * {{#array arrayName}}
 * {{value}}
 * {{/array}}
 * 
 */

const BASE_PATH = "/KumoD-Porfolio/"

// templates
const TEMPLATE_URL = BASE_PATH + "list.template.html"
const DETAIL_TEMPLATE_URL = BASE_PATH + "detail.template.html"
const NOTFOUND_URL = BASE_PATH + "notfound.html"

// data
const DATA_URL =
    "https://gist.githubusercontent.com/datnt19213/17726f1fb5188f180f20b3f5e862bb98/raw/f8b913f48ce86abd4cadf0f89302c06e2cb5a50d/portfolio-mydev.json"



/* =========================
   FETCH
========================= */

async function fetchText(url) {

    try {

        const res = await fetch(url)

        if (!res.ok) throw new Error("Fetch failed: " + url)

        return await res.text()

    } catch (err) {

        console.error(err)

        return ""

    }

}



async function fetchJSON(url) {

    try {

        const res = await fetch(url)

        if (!res.ok) throw new Error("Fetch failed: " + url)

        return await res.json()

    } catch (err) {

        console.error(err)

        return {}

    }

}



/* =========================
   URL
========================= */

function getQueryParam(name) {

    const params = new URLSearchParams(location.search)

    return params.get(name)

}



function getSlugFromPath() {

    const path = location.pathname

    const match = path.match(/project\/([^\/]+)/)

    return match ? match[1] : null

}



/* =========================
   DATA
========================= */

function findProjectBySlug(data, slug) {

    const projects = Array.isArray(data) ? data : data.projects

    if (!projects) return null

    return projects.find(p => p.slug === slug)

}



/* =========================
   TEMPLATE ENGINE
========================= */


// render array block
function renderArrays(template, item) {

    return template.replace(
        /{{#array (.*?)}}([\s\S]*?){{\/array}}/g,
        (_, key, content) => {

            const arr = item[key.trim()]

            if (!Array.isArray(arr)) return ""

            return arr.map(v => {

                let block = content

                block = block.replace(/{{value}}/g, v)

                return block

            }).join("")

        })
}



// render if
function renderIf(template, item) {

    return template.replace(
        /{{#if (.*?)}}([\s\S]*?){{\/if}}/g,
        (_, key, content) => {

            const value = item[key.trim()]

            if (value) return content

            return ""

        })
}



// render variable
function renderVariables(template, item) {

    return template.replace(
        /{{(.*?)}}/g,
        (_, key) => {

            key = key.trim()

            if (key.startsWith("#")) return ""

            if (key.startsWith("/")) return ""

            return item[key] ?? ""

        })
}



// render each
function renderEach(template, data) {

    return template.replace(
        /{{#each (.*?)}}([\s\S]*?){{\/each}}/g,
        (_, arrayName, content) => {

            const arr = data[arrayName.trim()]

            if (!Array.isArray(arr)) return ""

            return arr.map(item => {

                let block = content

                block = renderArrays(block, item)

                block = renderIf(block, item)

                block = renderVariables(block, item)

                return block

            }).join("")

        })
}



// main render
function render(template, data) {

    template = renderEach(template, data)

    template = renderArrays(template, data)

    template = renderIf(template, data)

    template = renderVariables(template, data)

    return template

}



/* =========================
   INIT
========================= */

async function init() {

    const app = document.getElementById("app")

    if (!app) {

        console.error("Missing #app element")

        return

    }

    const data = await fetchJSON(DATA_URL)

    let projects = []

    if (Array.isArray(data)) {

        projects = data

    } else if (data && data.projects) {

        projects = data.projects

    }


    if (!projects || projects.length === 0) {

        app.innerHTML = "<h2>No project data</h2>"

        return

    }


    // sort newest first
    projects.sort((a, b) => {

        const aDate = new Date(a.createdAt || 0)

        const bDate = new Date(b.createdAt || 0)

        return bDate - aDate

    })


    // Prepare data for template
    const renderData = {

        projects: projects,

        featuredProjects: projects.filter(p => p.featured)

    }


    let slug = getSlugFromPath()

    if (!slug) {

        slug = getQueryParam("slug")

    }



    /* =========================
       DETAIL PAGE
    ========================= */

    if (slug) {

        const project = findProjectBySlug(projects, slug)

        if (!project) {

            const html = await fetchText(NOTFOUND_URL)

            app.innerHTML = html || "<h2>Project not found</h2>"

            return

        }

        const template = await fetchText(DETAIL_TEMPLATE_URL)

        app.innerHTML = render(template, project)

        return

    }



    /* =========================
       LIST PAGE
    ========================= */

    const template = await fetchText(TEMPLATE_URL)

    app.innerHTML = render(template, renderData)

}



init()