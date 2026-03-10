# PMSE: Portfolio Minimal Static Engine

**PMSE** is a high-performance, serverless portfolio engine designed to live "forever" on the edge. It uses 100% static files (Vanilla HTML, CSS, JS) and leverages GitHub Gists as a dynamic database, eliminating the need for paid hosting, databases, or complex backends.

---

## 🚀 Key Philosophy

Standard portfolios often rot because of hosting costs, database migrations, or deprecated backend frameworks. PMSE solves this by:

1. **Zero Cost**: Hostable on GitHub Pages, Vercel, or Netlify for free.
2. **Persistence**: Your data lives in a GitHub Gist—platform independent and easy to backup.
3. **Speed**: No server-side processing. Content is fetched directly from GitHub's CDN.
4. **Security**: Admin access is protected by **FanHash**, a private hashing algorithm that secures your GitHub Token.

---

## 🛠 Technical Architecture

### 1. Data Layer (The "Database")

Your portfolio data is stored as a JSON file in a **GitHub Gist**.

- **Fetch**: The frontend uses `fetch()` with a cache-buster (`?t=timestamp`) to retrieve the latest version of `data.json`.
- **Update**: The Admin panel uses the GitHub REST API to `PATCH` the Gist with updated project data.

### 2. The Engine

- **Template System**: A lightweight regex-based engine handles rendering. It supports `{{variable}}`, `{{#each}}` for arrays, and `{{#if}}` for conditional logic.
- **Routing**: Client-side routing via URL parameters (`?page=admin` or `?slug=project-name`) allows for clean navigation without a server.

### 3. Security (FanHash Engine)

To manage your Gist, the engine needs a GitHub Personal Access Token (PAT). Instead of storing this token in plain text:

- The token is encrypted using a **Password** via the **FanHash symmetric cipher**.
- Only the **Hashed Token** and **Password** (optionally) are stored in `localStorage`.
- The raw token never leaves your browser except when talking to `api.github.com`.

---

## 📖 Setup Guide

### Phase 1: GitHub Setup

1. **Create a Gist**: Go to [gist.github.com](https://gist.github.com/) and create a file named `portfolio.json`.
   - Use the structure provided in your current `data.json`.
2. **Generate a Token**: Go to GitHub Settings > Developer Settings > **Personal Access Tokens (classic)**.
   - Select the `gist` scope.
   - **Copy the token immediately.**

### Phase 2: Configuration

1. Open `index.js`.
2. Update the `DATA_URL` constant with your Gist's "Raw" URL (remove the commit hash from the URL to ensure it always points to the latest version).
   ```javascript
   const DATA_URL =
     "https://gist.githubusercontent.com/username/gist_id/raw/portfolio.json";
   ```

### Phase 3: Deployment

1. Upload these files to any static host (e.g., GitHub Pages).
2. Navigate to your site URL.

---

## 🎮 How to Manage Projects

1. Go to your portfolio URL + `?page=admin`.
2. Enter your **GitHub Token** and a secret **Password**. (At first login, it will be signup and login automatically) (Your encrypt script will run automatically)
3. PMSE will encrypt your token and store the hash locally.
4. **Add/Edit/Delete**: Use the card-based UI to manage your projects.
5. **Save**: Click "Save Project" to push changes directly to your Gist.

---

## 🛡 Security Tool: `encrypt_token.js`

For maximum security, you can use the included `encrypt_token.js` tool to generate your hashed token offline:

```bash
node encrypt_token.js
# Follow the prompts to encode/decode your token manually
```

---

## ✨ Developed by Nguyễn Thành Đạt

Designed for developers who want a beautiful, permanent portfolio with zero maintenance overhead.
