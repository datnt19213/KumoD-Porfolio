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


// your template html file
const TEMPLATE_URL = "./template.html"

// your detail template html file
const DETAIL_TEMPLATE_URL = "./detail.template.html"

// your not found html file
const NOTFOUND_URL = "./notfound.html"

// data json
const DATA_URL =
    "https://gist.githubusercontent.com/datnt19213/17726f1fb5188f180f20b3f5e862bb98/raw/f8b913f48ce86abd4cadf0f89302c06e2cb5a50d/portfolio-mydev.json"



// load template
async function loadTemplate() {
    const res = await fetch(TEMPLATE_URL)
    return await res.text()
}


// load detail template
async function loadDetailTemplate() {
    const res = await fetch(DETAIL_TEMPLATE_URL)
    return await res.text()
}


// load not found page
async function loadNotFound() {
    const res = await fetch(NOTFOUND_URL)
    return await res.text()
}


// load data
async function loadData() {
    const res = await fetch(DATA_URL)
    return await res.json()
}


// get query param
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search)
    return params.get(name)
}


// extract slug from url
function getSlugFromPath() {

    const path = window.location.pathname

    const match = path.match(/^\/project\/([^\/]+)$/)

    if (match) return match[1]

    return null
}


// find project
function findProjectBySlug(data, slug) {

    if (!data.projects) return null

    return data.projects.find(p => p.slug === slug)
}


// render arrays
function renderArrays(template, item) {

    return template.replace(
        /{{#array (.*?)}}([\s\S]*?){{\/array}}/g,
        (_, key, content) => {

            const arr = item[key.trim()]

            if (!Array.isArray(arr)) return ""

            return arr.map(v => {

                return content.replace(/{{value}}/g, v)

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


// render all
function render(template, data) {

    template = renderEach(template, data)

    template = renderArrays(template, data)

    template = renderIf(template, data)

    template = renderVariables(template, data)

    return template
}



// init
async function init() {

    const data = await loadData()

    // get slug from url
    let slug = getSlugFromPath()

    // fallback to ?slug=
    if (!slug) slug = getQueryParam("slug")


    // DETAIL PAGE
    if (slug) {

        const project = findProjectBySlug(data, slug)

        if (!project) {

            const notfound = await loadNotFound()

            document.getElementById("app").innerHTML = notfound

            return
        }

        const template = await loadDetailTemplate()

        const html = render(template, project)

        document.getElementById("app").innerHTML = html

        return
    }


    // LIST PAGE
    const template = await loadTemplate()

    const html = render(template, data)

    document.getElementById("app").innerHTML = html

}


// run
init()