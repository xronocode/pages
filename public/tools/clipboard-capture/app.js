// FILE: tools/clipboard-capture/app.js
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Drive the standalone clipboard fixture capture UI so users on any desktop browser can paste rendered content and export deterministic JSON fixtures.
//   SCOPE: DOM event handling, capture history persistence, JSON export, GitHub issue handoff, and read-only rendering of clipboard payload previews.
//   DEPENDS: tools/clipboard-capture/capture-core.browser.js, browser DOM APIs, optional localStorage.
//   LINKS: M-044, V-M-044
//   ROLE: SCRIPT
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   initApp - Wires the DOM and bootstraps persisted history.
//   handlePasteCapture - Converts one paste event into a stored capture record.
//   render - Renders toolbar state, history list, and selected capture details.
// END_MODULE_MAP

const STORAGE_KEY = 'mark.clipboard.fixture.capture.history.v1'
const REPO_STORAGE_KEY = 'mark.clipboard.fixture.capture.github-repo.v1'
const MAX_HISTORY = 20

const state = {
  captures: [],
  selectedId: null
}

// START_CONTRACT: initApp
//   PURPOSE: Initialize DOM references, wire event handlers, and render persisted history.
//   INPUTS: none
//   OUTPUTS: { void }
//   SIDE_EFFECTS: Attaches DOM listeners and may read localStorage.
//   LINKS: M-044, V-M-044
// END_CONTRACT: initApp
function initApp() {
  const dom = getDom()
  const core = getCoreApi()

  if (!core) {
    renderStatus(
      dom.status,
      'Clipboard core did not load. Re-open the page from disk or use Chrome/Edge.'
    )
    syncToolbar(dom)
    return
  }

  state.captures = loadHistory()
  state.selectedId = state.captures[0]?.captureId || null
  dom.githubRepo.value = loadRepoSlug()

  dom.pasteZone.addEventListener('paste', (event) => handlePasteCapture(event, dom))
  dom.exportLatest.addEventListener('click', () => exportLatestCapture())
  dom.exportHistory.addEventListener('click', () => exportHistory())
  dom.copyIssuePacket.addEventListener('click', () => copyIssuePacket(dom))
  dom.createIssue.addEventListener('click', () => createGitHubIssue(dom))
  dom.clearHistory.addEventListener('click', () => clearHistory())
  dom.githubRepo.addEventListener('change', () => persistRepoSlug(dom.githubRepo.value))
  dom.githubRepo.addEventListener('blur', () => persistRepoSlug(dom.githubRepo.value))

  render(dom, 'Ready. Focus the capture zone and paste.')
}

function getDom() {
  return {
    sourceLabel: document.querySelector('#sourceLabel'),
    note: document.querySelector('#note'),
    githubRepo: document.querySelector('#githubRepo'),
    pasteZone: document.querySelector('#pasteZone'),
    exportLatest: document.querySelector('#exportLatest'),
    exportHistory: document.querySelector('#exportHistory'),
    copyIssuePacket: document.querySelector('#copyIssuePacket'),
    createIssue: document.querySelector('#createIssue'),
    clearHistory: document.querySelector('#clearHistory'),
    status: document.querySelector('#status'),
    summary: document.querySelector('#summary'),
    historyList: document.querySelector('#historyList'),
    details: document.querySelector('#details')
  }
}

// START_CONTRACT: handlePasteCapture
//   PURPOSE: Build and persist one capture record from a browser paste event, then re-render the UI.
//   INPUTS: { event: ClipboardEvent - Browser paste event, dom: object - Cached DOM references }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: Prevents default paste rendering, writes localStorage, updates DOM.
//   LINKS: M-044, V-M-044
// END_CONTRACT: handlePasteCapture
function handlePasteCapture(event, dom) {
  event.preventDefault()
  const core = getCoreApi()

  if (!event.clipboardData || !core) {
    render(dom, 'Paste event had no clipboardData. Try Chrome or Edge.')
    return
  }

  const record = core.buildCaptureRecord({
    dataTransfer: event.clipboardData,
    sourceLabel: dom.sourceLabel.value,
    note: dom.note.value
  })

  state.captures = [record, ...state.captures].slice(0, MAX_HISTORY)
  state.selectedId = record.captureId
  persistHistory()

  const types = record.clipboard.advertisedTypes.join(', ') || 'no advertised types'
  render(dom, `Captured ${record.captureId} with ${types}.`)
}

function render(dom, statusMessage) {
  renderStatus(dom.status, statusMessage)
  renderSummary(dom.summary)
  renderHistory(dom.historyList, dom)
  renderDetails(dom.details)
  syncToolbar(dom)
}

function renderStatus(container, message) {
  container.textContent = message
}

function renderSummary(container) {
  const latest = state.captures[0]
  const totalCaptures = state.captures.length

  if (!latest) {
    container.textContent =
      'No captures yet. Paste a rendered answer, README section, or docs fragment to create the first fixture.'
    return
  }

  const types = latest.clipboard.advertisedTypes.join(', ') || 'none'
  container.textContent =
    `Captures: ${totalCaptures}. Latest source: ${latest.sourceLabel || 'unlabeled'}; ` +
    `types: ${types}; files: ${latest.clipboard.fileCount}.`
}

function renderHistory(container, dom) {
  container.replaceChildren()

  if (state.captures.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'empty-block'
    empty.textContent = 'History is empty.'
    container.append(empty)
    return
  }

  for (const capture of state.captures) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = capture.captureId === state.selectedId ? 'history-item active' : 'history-item'
    button.addEventListener('click', () => {
      state.selectedId = capture.captureId
      render(dom, `Selected ${capture.captureId}.`)
    })

    const title = document.createElement('strong')
    title.textContent = capture.sourceLabel || 'unlabeled capture'

    const meta = document.createElement('span')
    meta.className = 'history-meta'
    meta.textContent =
      `${formatCapturedAt(capture.capturedAt)} | ${capture.clipboard.advertisedTypes.join(', ') || 'no types'}`

    button.append(title, meta)
    container.append(button)
  }
}

function renderDetails(container) {
  container.replaceChildren()

  const selected = state.captures.find((capture) => capture.captureId === state.selectedId) || state.captures[0]

  if (!selected) {
    const empty = document.createElement('p')
    empty.className = 'empty-block'
    empty.textContent = 'Select a capture to inspect its payloads.'
    container.append(empty)
    return
  }

  container.append(createMetaCard(selected))
  container.append(createFamiliesCard(selected))

  const textEntries = Object.entries(selected.payloads.text)
  if (textEntries.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'empty-block'
    empty.textContent = 'No text payloads were exposed by this browser.'
    container.append(empty)
  } else {
    for (const [type, payload] of textEntries) {
      container.append(createTextPayloadCard(type, payload))
    }
  }

  if (selected.payloads.files.length > 0) {
    container.append(createFilesCard(selected.payloads.files))
  }

  if (selected.payloads.items.length > 0) {
    container.append(createItemsCard(selected.payloads.items))
  }
}

function createMetaCard(capture) {
  const card = createCard('Capture metadata')
  const list = document.createElement('dl')
  list.className = 'meta-grid'

  appendMetaPair(list, 'Capture ID', capture.captureId)
  appendMetaPair(list, 'Captured at', capture.capturedAt)
  appendMetaPair(list, 'Source label', capture.sourceLabel || 'unlabeled')
  appendMetaPair(list, 'Note', capture.note || 'none')
  appendMetaPair(list, 'Platform', capture.platform.platform || 'unknown')
  appendMetaPair(list, 'Time zone', capture.platform.timeZone || 'unknown')
  appendMetaPair(list, 'Advertised types', capture.clipboard.advertisedTypes.join(', ') || 'none')

  card.append(list)
  return card
}

function createFamiliesCard(capture) {
  const card = createCard('Presence flags')
  const list = document.createElement('ul')
  list.className = 'flag-list'
  const families = capture.clipboard.families
  const entries = [
    ['hasMarkdown', families.hasMarkdown],
    ['hasHtml', families.hasHtml],
    ['hasPlain', families.hasPlain],
    ['hasRtf', families.hasRtf],
    ['hasFiles', families.hasFiles],
    ['hasImageFiles', families.hasImageFiles],
    ['customTextTypes', families.customTextTypes.join(', ') || 'none']
  ]

  for (const [label, value] of entries) {
    const item = document.createElement('li')
    item.textContent = `${label}: ${String(value)}`
    list.append(item)
  }

  card.append(list)
  return card
}

function createTextPayloadCard(type, payload) {
  const card = createCard(type)
  const stats = document.createElement('p')
  stats.className = 'payload-meta'
  stats.textContent = `length=${payload.length}, lines=${payload.lineCount}`

  const area = document.createElement('textarea')
  area.className = 'payload-area'
  area.readOnly = true
  area.spellcheck = false
  area.value = payload.value

  card.append(stats, area)
  return card
}

function createFilesCard(files) {
  const card = createCard('Files')
  const list = document.createElement('ul')
  list.className = 'flag-list'

  for (const file of files) {
    const item = document.createElement('li')
    item.textContent = `${file.name || '(unnamed)'} | ${file.type || 'unknown'} | ${formatBytes(file.size)}`
    list.append(item)
  }

  card.append(list)
  return card
}

function createItemsCard(items) {
  const card = createCard('Clipboard items')
  const list = document.createElement('ul')
  list.className = 'flag-list'

  for (const item of items) {
    const line = document.createElement('li')
    line.textContent =
      `#${item.index} | kind=${item.kind} | type=${item.type || '(empty)'} | ` +
      `file=${item.fileName || 'none'}`
    list.append(line)
  }

  card.append(list)
  return card
}

function createCard(title) {
  const section = document.createElement('section')
  section.className = 'card'

  const heading = document.createElement('h3')
  heading.textContent = title

  section.append(heading)
  return section
}

function appendMetaPair(container, label, value) {
  const term = document.createElement('dt')
  term.textContent = label
  const desc = document.createElement('dd')
  desc.textContent = value
  container.append(term, desc)
}

function syncToolbar(dom) {
  const hasCaptures = state.captures.length > 0
  dom.exportLatest.disabled = !hasCaptures
  dom.exportHistory.disabled = !hasCaptures
  dom.copyIssuePacket.disabled = !hasCaptures
  dom.createIssue.disabled = !hasCaptures
  dom.clearHistory.disabled = !hasCaptures
}

function exportLatestCapture() {
  const latest = state.captures[0]
  if (!latest) return
  downloadJson(getCoreApi().createExportFilename(latest, 'single'), latest)
}

function exportHistory() {
  if (state.captures.length === 0) return

  const record = state.captures[0]
  downloadJson(
    getCoreApi().createExportFilename(record, 'history'),
    getCoreApi().buildHistoryEnvelope(state.captures)
  )
}

function clearHistory() {
  state.captures = []
  state.selectedId = null
  persistHistory()
  render(getDom(), 'History cleared.')
}

async function copyIssuePacket(dom) {
  const record = getSelectedCapture()
  if (!record) return

  const packet = getCoreApi().buildIssuePacket(record)
  const copied = await copyText(packet)
  render(dom, copied ? 'Full issue packet copied to clipboard.' : 'Could not copy issue packet automatically.')
}

async function createGitHubIssue(dom) {
  const record = getSelectedCapture()
  if (!record) return

  const repo = String(dom.githubRepo.value || '').trim()
  if (!isValidRepoSlug(repo)) {
    render(dom, 'GitHub repo must look like owner/repo.')
    dom.githubRepo.focus()
    return
  }

  persistRepoSlug(repo)

  const packet = getCoreApi().buildIssuePacket(record)
  const copied = await copyText(packet)
  const issueUrl = getCoreApi().buildIssueUrl({
    repo,
    record,
    copiedFullPacket: copied
  })

  window.open(issueUrl, '_blank', 'noopener')
  render(
    dom,
    copied
      ? `Opened GitHub issue for ${repo}; full packet copied to clipboard.`
      : `Opened GitHub issue for ${repo}; if needed, download JSON and attach it manually.`
  )
}

function downloadJson(fileName, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.style.display = 'none'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadRepoSlug() {
  try {
    return localStorage.getItem(REPO_STORAGE_KEY) || 'xronocode/mark'
  } catch {
    return 'xronocode/mark'
  }
}

function persistRepoSlug(value) {
  try {
    localStorage.setItem(REPO_STORAGE_KEY, String(value || '').trim() || 'xronocode/mark')
  } catch {
    // Optional only.
  }
}

function getCoreApi() {
  return globalThis.ClipboardCaptureCore || null
}

function getSelectedCapture() {
  return state.captures.find((capture) => capture.captureId === state.selectedId) || state.captures[0] || null
}

function isValidRepoSlug(value) {
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(String(value || '').trim())
}

async function copyText(value) {
  const text = String(value || '')

  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to legacy copy path.
  }

  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', 'readonly')
  area.style.position = 'fixed'
  area.style.top = '-9999px'
  area.style.opacity = '0'
  document.body.append(area)
  area.select()
  area.setSelectionRange(0, area.value.length)

  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    area.remove()
  }
}

function persistHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.captures))
  } catch {
    // localStorage is optional; export still works without it.
  }
}

function formatCapturedAt(value) {
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

function formatBytes(size) {
  if (!Number.isFinite(size) || size < 1024) {
    return `${size || 0} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

initApp()
