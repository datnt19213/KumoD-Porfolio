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

const IS_LOCAL = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const BASE_PATH = IS_LOCAL ? "./" : "/KumoD-Porfolio/"

// templates
const TEMPLATE_URL = BASE_PATH + "list.template.html"
const DETAIL_TEMPLATE_URL = BASE_PATH + "detail.template.html"
const ADMIN_TEMPLATE_URL = BASE_PATH + "admin.template.html"
const NOTFOUND_URL = BASE_PATH + "notfound.html"

// data
const DATA_URL =
    "https://gist.githubusercontent.com/datnt19213/17726f1fb5188f180f20b3f5e862bb98/raw/portfolio-mydev.json"



/* =========================
   FETCH
========================= */

async function fetchText(url) {

    try {

        const res = await fetch(url)

        if (!res.ok) {

            console.error("HTTP error! status: " + res.status + " for " + url)

            throw new Error("Fetch failed: " + url)

        }


        const text = await res.text()

        if (!text) console.warn("Fetch returned empty text for " + url)

        return text

    } catch (err) {

        console.error(err)

        return ""

    }

}



async function fetchJSON(url) {

    try {

        const res = await fetch(url)

        if (!res.ok) {

            console.error("HTTP error! status: " + res.status + " for " + url)

            throw new Error("Fetch failed: " + url)

        }


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

            key = key.trim()

            const isNot = key.startsWith("!")

            const actualKey = isNot ? key.slice(1).trim() : key

            const value = item[actualKey]


            const result = isNot ? !value : !!value


            return result ? content : ""

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
   CRYPTO
========================= */

/**
 * INTERNAL PURE SHA-256 HELPER
 */
function _sha256Internal(ascii) {
    const rightRotate = (v, a) => (v >>> a) | (v << (32 - a));
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let i, j, result = '';
    const words = [];
    const asciiBitLength = ascii.length * 8;
    let hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc600bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    let str = ascii + '\x80';
    while (str.length % 64 - 56) str += '\x00';
    for (i = 0; i < str.length; i++) words[i >> 2] |= str.charCodeAt(i) << ((3 - i) % 4) * 8;
    words[words.length] = ((asciiBitLength / maxWord) | 0);
    words[words.length] = (asciiBitLength | 0);
    for (j = 0; j < words.length;) {
        const w = words.slice(j, j += 16);
        const oldHash = [...hash];
        for (i = 0; i < 64; i++) {
            if (i >= 16) {
                const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
                const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
                w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
            }
            const t1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ((hash[4] & hash[5]) ^ (~hash[4] & hash[6])) + k[i] + (w[i] | 0)) | 0;
            const t2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + ((hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]))) | 0;
            hash = [(t1 + t2) | 0, ...hash.slice(0, 7)];
            hash[4] = (hash[4] + t1) | 0;
        }
        for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            const b = (hash[i] >> (j * 8)) & 255;
            result += (b < 16 ? '0' : '') + b.toString(16);
        }
    }
    return result;
}



class FanHashEngine {
    static encode(text, password) {
        const data = new TextEncoder().encode(text);
        const passHash = _sha256Internal(password);
        const passBytes = new Uint8Array(passHash.match(/.{1,2}/g).map(b => parseInt(b, 16)));
        const n = 61 + (password.length % 11);
        for (let k = 0; k < n; k++) {
            const offset = k % data.length;
            for (let i = offset; i < data.length - 1; i += 2) {
                [data[i], data[i + 1]] = [data[i + 1], data[i]];
                data[i] ^= (passBytes[i % passBytes.length] + k) % 256;
            }
        }
        return Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static decode(hex, password) {
        try {
            const data = new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
            const passHash = _sha256Internal(password);
            const passBytes = new Uint8Array(passHash.match(/.{1,2}/g).map(b => parseInt(b, 16)));
            const n = 61 + (password.length % 11);
            for (let k = n - 1; k >= 0; k--) {
                const offset = k % data.length;
                for (let i = offset; i < data.length - 1; i += 2) {
                    data[i] ^= (passBytes[i % passBytes.length] + k) % 256;
                    [data[i], data[i + 1]] = [data[i + 1], data[i]];
                }
            }
            return new TextDecoder().decode(data);
        } catch (e) {
            return null;
        }
    }
}



/* =========================
   GIST API
========================= */

async function updateGist(token, content) {

    try {

        // 1. Get Gist to find the filename
        const gistIdMatch = DATA_URL.match(/\/([a-f0-9]+)\/raw\//)

        if (!gistIdMatch) throw new Error("Could not extract Gist ID from URL")

        const gistId = gistIdMatch[1]


        const getRes = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: { 'Authorization': `token ${token}` }
        })

        if (!getRes.ok) throw new Error("Failed to fetch Gist info")

        const gistData = await getRes.json()

        const filename = Object.keys(gistData.files)[0]


        // 2. Update Gist
        const updateRes = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    [filename]: { content }
                }
            })
        })


        if (!updateRes.ok) throw new Error("Update failed: " + updateRes.statusText)

        return true

    } catch (err) {

        console.error(err)

        throw err

    }

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

    const data = await fetchJSON(DATA_URL + "?t=" + Date.now())

    let projects = []

    if (Array.isArray(data)) {

        projects = data

    } else if (data && data.projects) {

        projects = data.projects

    }


    if (!projects || projects.length === 0) {

        app.innerHTML = "<h2 style='width: 100%; text-align: center;'>No project data</h2>"

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


    const page = getQueryParam("page")

    console.log("PMSE: Route detected:", page || "home")


    /* =========================
       ADMIN PAGE
    ========================= */

    if (page === "admin") {

        await initAdmin(projects)

        return

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



async function initAdmin(projects) {

    const app = document.getElementById("app")

    const template = await fetchText(ADMIN_TEMPLATE_URL)


    const session = {
        isLoggedIn: false,
        token: "",
        password: localStorage.getItem("admin_pass") || "",
        hashedToken: localStorage.getItem("admin_token") || ""
    }


    // Auto-login
    if (session.password && session.hashedToken) {

        const token = FanHashEngine.decode(session.hashedToken, session.password)

        if (token && token.startsWith("ghp_")) {

            session.isLoggedIn = true

            session.token = token

        }

    }


    function showStatus(msg, isError = false) {

        const el = document.getElementById("statusMessage")

        if (!el) return

        el.innerText = msg

        el.className = "status-message " + (isError ? "error" : "success")

        el.style.display = "block"

        setTimeout(() => el.style.display = "none", 5000)

    }


    function renderList() {

        const listEl = document.getElementById("projectAdminList")

        if (!listEl) return


        listEl.innerHTML = projects.map((p, idx) => `
            <div class="admin-list-item">
                <div class="item-info">
                    <div class="item-title" title="${p.title}">${p.title}</div>
                    <div class="item-slug" title="${p.slug}">${p.slug}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon edit" data-idx="${idx}">✎</button>
                    <button class="btn-icon delete" data-idx="${idx}">🗑</button>
                </div>
            </div>
        `).join("")


        listEl.querySelectorAll(".edit").forEach(btn => {

            btn.onclick = () => openEditor(btn.dataset.idx)

        })


        listEl.querySelectorAll(".delete").forEach(btn => {

            btn.onclick = () => {

                if (confirm("Delete this project?")) {

                    projects.splice(btn.dataset.idx, 1)

                    saveAndRefresh()

                }

            }

        })

    }


    function openEditor(idx = null) {

        const editor = document.getElementById("editorCard")

        const form = document.getElementById("projectForm")

        const title = document.getElementById("editorTitle")

        editor.style.display = "block"


        if (idx !== null) {

            const p = projects[idx]

            title.innerText = "Edit Project"

            document.getElementById("editId").value = idx

            document.getElementById("pTitle").value = p.title || ""

            document.getElementById("pSlug").value = p.slug || ""

            document.getElementById("pThumbnail").value = p.thumbnail || ""

            document.getElementById("pCategory").value = p.category || ""

            document.getElementById("pStatus").value = p.status || "completed"

            document.getElementById("pFeatured").checked = !!p.featured


            document.getElementById("pStartDate").value = p.startDate || ""

            document.getElementById("pEndDate").value = p.endDate || ""

            document.getElementById("pLiveUrl").value = p.liveUrl || ""

            document.getElementById("pRepoUrl").value = p.repoUrl || ""


            document.getElementById("pShortDesc").value = p.shortDescription || ""

            document.getElementById("pDesc").value = p.description || ""


            document.getElementById("pImages").value = (p.images || []).join("\n")

            document.getElementById("pVideo").value = p.video || ""


            document.getElementById("pTechnologies").value = (p.technologies || []).join(", ")

            document.getElementById("pFrameworks").value = (p.frameworks || []).join(", ")

            document.getElementById("pTools").value = (p.tools || []).join(", ")

            document.getElementById("pTags").value = (p.tags || []).join(", ")


            document.getElementById("pMetaTitle").value = p.metaTitle || ""

            document.getElementById("pMetaDescription").value = p.metaDescription || ""

            document.getElementById("pOgImage").value = p.ogImage || ""


        } else {

            title.innerText = "Add New Project"

            form.reset()

            document.getElementById("editId").value = ""


            // Set some defaults
            document.getElementById("pStatus").value = "completed"

        }

    }


    async function saveAndRefresh() {

        try {

            await updateGist(session.token, JSON.stringify(projects, null, 2))

            showStatus("Changes saved to Gist!")

            renderList()

        } catch (err) {

            showStatus("Failed to save: " + err.message, true)

        }

    }


    async function renderAdmin() {

        app.innerHTML = render(template, session)


        if (!session.isLoggedIn) {

            const form = document.getElementById("loginForm")

            const clearBtn = document.getElementById("clearSessionBtn")


            if (clearBtn) {

                clearBtn.onclick = () => {

                    localStorage.removeItem("admin_pass")

                    localStorage.removeItem("admin_token")

                    location.reload()

                }

            }


            form.onsubmit = async (e) => {

                e.preventDefault()

                const tokenInput = form.githubToken.value

                const passInput = form.password.value


                if (tokenInput.startsWith("ghp_")) {

                    const hashed = FanHashEngine.encode(tokenInput, passInput)

                    session.isLoggedIn = true

                    session.token = tokenInput

                    localStorage.setItem("admin_pass", passInput)

                    localStorage.setItem("admin_token", hashed)

                    renderAdmin()

                } else {

                    alert("Invalid GitHub Token (must start with ghp_)")

                }

            }

        } else {

            renderList()


            document.getElementById("addNewBtn").onclick = () => openEditor()

            document.getElementById("closeEditorBtn").onclick = () => {

                document.getElementById("editorCard").style.display = "none"

            }


            document.getElementById("logoutBtn").onclick = () => {

                session.isLoggedIn = false

                session.token = ""

                renderAdmin()

            }


            document.getElementById("projectForm").onsubmit = (e) => {

                e.preventDefault()

                const idx = document.getElementById("editId").value

                const splitByComma = (str) => str.split(",").map(s => s.trim()).filter(Boolean)

                const splitByNewline = (str) => str.split("\n").map(s => s.trim()).filter(Boolean)


                const p = {
                    title: document.getElementById("pTitle").value,
                    slug: document.getElementById("pSlug").value,
                    thumbnail: document.getElementById("pThumbnail").value,
                    category: document.getElementById("pCategory").value,
                    status: document.getElementById("pStatus").value,
                    featured: document.getElementById("pFeatured").checked,

                    startDate: document.getElementById("pStartDate").value,
                    endDate: document.getElementById("pEndDate").value,
                    liveUrl: document.getElementById("pLiveUrl").value,
                    repoUrl: document.getElementById("pRepoUrl").value,

                    shortDescription: document.getElementById("pShortDesc").value,
                    description: document.getElementById("pDesc").value,

                    images: splitByNewline(document.getElementById("pImages").value),
                    video: document.getElementById("pVideo").value,

                    technologies: splitByComma(document.getElementById("pTechnologies").value),
                    frameworks: splitByComma(document.getElementById("pFrameworks").value),
                    tools: splitByComma(document.getElementById("pTools").value),
                    tags: splitByComma(document.getElementById("pTags").value),

                    metaTitle: document.getElementById("pMetaTitle").value,
                    metaDescription: document.getElementById("pMetaDescription").value,
                    ogImage: document.getElementById("pOgImage").value,

                    updatedAt: new Date().toISOString().split("T")[0]
                }


                if (idx !== "") {

                    projects[idx] = { ...projects[idx], ...p }

                } else {

                    p.id = Date.now().toString()

                    p.createdAt = p.updatedAt

                    projects.unshift(p)

                }


                document.getElementById("editorCard").style.display = "none"

                saveAndRefresh()

            }

        }

    }


    renderAdmin()

}



init()