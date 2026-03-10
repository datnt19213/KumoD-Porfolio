/**
 * Template Syntax
 * 
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
 */

const BASE_PATH = "/KumoD-Porfolio/"

// templates
const TEMPLATE_URL = BASE_PATH + "list.template.html"
const DETAIL_TEMPLATE_URL = BASE_PATH + "detail.template.html"
const NOTFOUND_URL = BASE_PATH + "notfound.html"

// data
const DATA_URL =
    "https://gist.githubusercontent.com/datnt19213/17726f1fb5188f180f20b3f5e862bb98/raw/f8b913f48ce86abd4cadf0f89302c06e2cb5a50d/portfolio-mydev.json"



async function fetchText(url) {
    const res = await fetch(url)
    return await res.text()
}

async function fetchJSON(url) {
    const res = await fetch(url)
    return await res.json()
}



// query param
function getQueryParam(name) {

    const params = new URLSearchParams(location.search)

    return params.get(name)

}



// slug from path
function getSlugFromPath() {

    const path = location.pathname

    const match = path.match(/project\/([^\/]+)/)

    return match ? match[1] : null

}



// find project
function findProjectBySlug(data, slug) {

    if (!data.projects) return null

    return data.projects.find(p => p.slug === slug)

}



// render array
function renderArrays(template, item) {

    return template.replace(
        /{{#array (.*?)}}([\s\S]*?){{\/array}}/g,
        (_, key, content) => {

            const arr = item[key.trim()]

            if (!Array.isArray(arr)) return ""

            return arr.map(v => content.replace(/{{value}}/g, v)).join("")

        })

}



// render if
function renderIf(template, item) {

    return template.replace(
        /{{#if (.*?)}}([\s\S]*?){{\/if}}/g,
        (_, key, content) => {

            const value = item[key.trim()]

            return value ? content : ""

        })

}



// render variables
function renderVariables(template, item) {

    return template.replace(
        /{{(.*?)}}/g,
        (_, key) => {

            key = key.trim()

            if (key.startsWith("#") || key.startsWith("/")) return ""

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



// render
function render(template, data) {

    template = renderEach(template, data)

    template = renderArrays(template, data)

    template = renderIf(template, data)

    template = renderVariables(template, data)

    return template

}



// init
async function init() {

    const app = document.getElementById("app")

    const data = await fetchJSON(DATA_URL)

    let slug = getSlugFromPath()

    if (!slug) slug = getQueryParam("slug")



    if (slug) {

        const project = findProjectBySlug(data, slug)

        if (!project) {

            const html = await fetchText(NOTFOUND_URL)

            app.innerHTML = html

            return
        }

        const template = await fetchText(DETAIL_TEMPLATE_URL)

        app.innerHTML = render(template, project)

        return

    }



    // list page
    const template = await fetchText(TEMPLATE_URL)

    app.innerHTML = render(template, data)

}



init()