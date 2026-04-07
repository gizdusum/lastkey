const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const STORE_PATH = path.join(DATA_DIR, "activity-state.json");

function ensureStoreFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ owners: {} }, null, 2));
  }
}

function loadActivityStore() {
  ensureStoreFile();

  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : { owners: {} };
  } catch {
    return { owners: {} };
  }
}

function saveActivityStore(store) {
  ensureStoreFile();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function getOwnerState(store, owner) {
  const key = owner.toLowerCase();
  if (!store.owners[key]) {
    store.owners[key] = {
      lastKnownNonce: null,
      lastCheckedBlock: null,
      lastDetectedActivityTimestamp: null,
      lastQualifiedActivityTimestamp: null,
      welcomeEmailSent: false,
    };
  }

  return store.owners[key];
}

module.exports = {
  loadActivityStore,
  saveActivityStore,
  getOwnerState,
};
