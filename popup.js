// Import chrome variable
const chrome = window.chrome

const URL_KEY = "api_url"
const ROLES_KEY = "roles"
let selectedRole = null
let lastAccessToken = null

// Storage helpers
const getStorage = (key) => new Promise((resolve) => chrome.storage.local.get([key], (res) => resolve(res[key])))
const setStorage = (key, value) => new Promise((resolve) => chrome.storage.local.set({ [key]: value }, resolve))
const credsKey = (role) => "creds_" + role

// Load URL and roles on startup
window.addEventListener("DOMContentLoaded", async () => {
  const url = await getStorage(URL_KEY)
  if (url) {
    document.getElementById("currentUrl").textContent = url
    document.getElementById("apiUrlInput").value = url
  }

  let roles = await getStorage(ROLES_KEY)
  if (!roles || roles.length === 0) roles = ["admin"]
  await setStorage(ROLES_KEY, roles)
  renderRoles(roles)
})

// Render roles
async function renderRoles(roles) {
  const container = document.getElementById("rolesContainer")
  container.innerHTML = ""

  roles.forEach((role) => {
    const btn = document.createElement("button")
    btn.textContent = role
    btn.dataset.role = role
    btn.addEventListener("click", async () => selectRole(role, btn))
    container.appendChild(btn)
  })

  // Add "+" button next to roles
  const addBtn = document.createElement("button")
  addBtn.textContent = "+ Add Role"
  addBtn.addEventListener("click", async () => {
    const roleName = prompt("Enter new role name:")?.trim()
    if (!roleName) return
    if (roles.includes(roleName)) return
    roles.push(roleName)
    await setStorage(ROLES_KEY, roles)
    renderRoles(roles)
  })
  container.appendChild(addBtn)
}

// Select role
async function selectRole(role, btnElement) {
  selectedRole = role
  lastAccessToken = null
  document.getElementById("output").textContent = ""
  document.getElementById("copyBtn").style.display = "none"

  // mark selected
  document.querySelectorAll("#rolesContainer button").forEach((b) => b.classList.remove("selected"))
  btnElement.classList.add("selected")

  // Show edit credentials button
  document.getElementById("editCredBtn").style.display = "block"

  // Show delete button next to "+" only for selected
  const deleteBtn = document.getElementById("deleteRoleBtn")
  if (deleteBtn) deleteBtn.remove()

  const btn = document.createElement("button")
  btn.id = "deleteRoleBtn"
  btn.textContent = "✖ Delete"
  btn.addEventListener("click", async () => {
    if (!confirm(`Delete role "${selectedRole}"?`)) return
    let currentRoles = await getStorage(ROLES_KEY)
    currentRoles = currentRoles.filter((r) => r !== selectedRole)
    await setStorage(ROLES_KEY, currentRoles)
    selectedRole = null
    renderRoles(currentRoles)
    document.getElementById("credentialsDiv").style.display = "none"
    document.getElementById("editCredBtn").style.display = "none"
    document.getElementById("output").textContent = ""
    document.getElementById("copyBtn").style.display = "none"
  })
  document.getElementById("rolesContainer").appendChild(btn)

  const creds = await loadCredentials(role)
  if (!creds.username || !creds.password) document.getElementById("credentialsDiv").style.display = "block"
}

// Edit Credentials
document.getElementById("editCredBtn").addEventListener("click", async () => {
  if (!selectedRole) return
  const creds = await loadCredentials(selectedRole)
  document.getElementById("username").value = creds.username || ""
  document.getElementById("password").value = creds.password || ""
  document.getElementById("credentialsDiv").style.display = "block"
})

// Save credentials
document.getElementById("saveCredBtn").addEventListener("click", async () => {
  const u = document.getElementById("username").value.trim()
  const p = document.getElementById("password").value.trim()
  if (!u || !p) return
  await saveCredentials(selectedRole, u, p)
  document.getElementById("credentialsDiv").style.display = "none"
  const output = document.getElementById("output")
  output.textContent = `✓ Credentials saved for ${selectedRole}`
  output.style.color = "#28a745"
})

// Save/load credentials
async function saveCredentials(role, username, password) {
  await setStorage(credsKey(role), { username, password, lastToken: null })
}
async function loadCredentials(role) {
  return (await getStorage(credsKey(role))) || {}
}

// URL save/change
document.getElementById("saveUrlBtn").addEventListener("click", async () => {
  const urlInput = document.getElementById("apiUrlInput")
  const url = urlInput.value.trim()
  const output = document.getElementById("output")
  if (!url) {
    output.textContent = "⚠ URL cannot be empty"
    output.style.color = "#dc3545"
    return
  }
  await setStorage(URL_KEY, url)
  document.getElementById("urlSection").style.display = "none"
  document.getElementById("changeUrlBtn").style.display = "inline-block"
  document.getElementById("currentUrl").textContent = url
  output.textContent = "✓ URL saved!"
  output.style.color = "#28a745"
})

document.getElementById("changeUrlBtn").addEventListener("click", () => {
  const urlSection = document.getElementById("urlSection")
  const urlInput = document.getElementById("apiUrlInput")
  urlSection.style.display = "block"
  urlInput.value = document.getElementById("currentUrl").textContent
  document.getElementById("changeUrlBtn").style.display = "none"
})

// Receive token
document.getElementById("tokenBtn").addEventListener("click", async () => {
  const output = document.getElementById("output")
  output.style.color = "#495057"

  const url = document.getElementById("apiUrlInput").value.trim()
  if (!url) {
    output.textContent = "⚠ API URL empty"
    output.style.color = "#dc3545"
    return
  }
  if (!selectedRole) {
    output.textContent = "⚠ Select role first"
    output.style.color = "#dc3545"
    return
  }

  let creds = await loadCredentials(selectedRole)
  if (!creds.username || !creds.password) {
    const u = document.getElementById("username").value.trim()
    const p = document.getElementById("password").value.trim()
    if (!u || !p) {
      output.textContent = "⚠ Enter username/password"
      output.style.color = "#dc3545"
      return
    }
    creds = { username: u, password: p, fcmToken: null }
  }

  try {
    const payload = { username: creds.username, password: creds.password, fcmToken: null }
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    lastAccessToken = data.accessToken
    document.getElementById("output").textContent = JSON.stringify(data, null, 2)

    await saveCredentials(selectedRole, creds.username, creds.password)

    document.getElementById("copyBtn").style.display = "inline-block"
    output.style.color = "#28a745"
  } catch (err) {
    document.getElementById("output").textContent = "❌ Error: " + err
    lastAccessToken = null
    document.getElementById("copyBtn").style.display = "none"
    output.style.color = "#dc3545"
  }
})

// Copy token
document.getElementById("copyBtn").addEventListener("click", () => {
  if (!lastAccessToken) return
  navigator.clipboard.writeText(lastAccessToken).then(() => {
    const output = document.getElementById("output")
    output.textContent = "✓ Access token copied!"
    output.style.color = "#28a745"
    setTimeout(() => (output.textContent = ""), 2000)
  })
})
