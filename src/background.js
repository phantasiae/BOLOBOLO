function BlackListOperator(func) {
  const dbname = "bilibili_black_list";
  const objectName = "black_list";
  const version = 2;

  const request = window.indexedDB.open(dbname, version);

  request.onerror = (event) => {
    console.log('--- Open IndexedDB error ---', event);
  }

  request.onupgradeneeded = (event) => {
    try {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(objectName)) {
        objStore = db.createObjectStore(objectName, { autoIncrement: true });

        // TODO: +?
        objStore.createIndex("up_rushi", "up_rushi", { unique: true });
      }

    } catch (err) { // TODO: ?
      console.log('--- err * ---', err);
    }
  }

  request.onsuccess = (event) => {
    const db = event.target.result;
    const objectStore = db.transaction(objectName, "readwrite")
    .objectStore(objectName);

    const request = func(objectStore);

    return;
  }
}

function insertBlackList(upRushi) {
  BlackListOperator((objectStore) => {
    return objectStore.add(upRushi);
  });
}

function listBlackList(sendResponse) {
  try {
    const result = BlackListOperator((objectStore) => {
      let res = [];

      objectStore.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;

        if (cursor) {
          res.push(cursor.value);
          cursor.continue();
        } else {
          sendResponse({ "upRushiList": res });
        }
      }

      objectStore.openCursor().onerror = (event) => {
        console.log('--- openCursor err ---', event);
      }
    });

    return result;
  } catch (err) {
    console.log('--- err ---', err);
  }
}


function saveBlackList(message) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("beasts-48.png"),
    "title": "将以下up主加入黑名单!",
    "message": message.upRushi,
  });

  console.log('--- save * ---');
  insertBlackList(message.upRushi);
  return "?";
}

function communication(request, sender, sendResponse) {
  try {
    if (request.upRushi) {
      return sendResponse(saveBlackList(request));
    } else if (request.upRushiList) {
      listBlackList(sendResponse);
      return true;
    } else {
      console.log('--- communication err:---\nNo Such Message!');
      return sendResponse({ error: "!" });
    }
  } catch (err) {
    console.log('--- communication * err:---\n', err);
  }
}

browser.runtime.onMessage.addListener(communication);
