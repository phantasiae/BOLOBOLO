function communication(request, sender, sendResponse) {
  try {
    if (request.type === 'souki') {
      return sendResponse(new BlackList().instance().save(request.upRushi));
    } else if (request.type === 'soshou') {
      new BlackList().instance().list(sendResponse);
      return true;
    } else {
      console.log('--- communication err:---\nNo Such Message!');
      return sendResponse({ error: "!" });
    }
  } catch (err) {
    console.log('--- communication * err:---\n', err);
  }
}


class BlackList {
  constructor() {
    this.dbname = "bilibili_black_list";
    this.objectName = "black_list";
    this.version = 1;
  }

  instance() {
    if (!this.request) {
      this.request = window.indexedDB.open(this.dbname, this.version);
      this.request.onerror = this.onerror;
      this.request.onupgradeneeded = this.onupgradeneeded;
    }

    return this;
  }

  onerror = (event) => {
    console.log('--- Open IndexedDB error ---', event);
  }

  onupgradeneeded = (event) => {
    try {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(this.objectName)) {
        let objStore = db.createObjectStore(this.objectName, { autoIncrement: true });

        // TODO: +?
        objStore.createIndex("up_rushi", "up_rushi", { unique: true });
      }

    } catch (err) { // TODO: ?
      console.log('--- err * ---', err);
    }
  }

  successHandler(func) {
    this.request.onsuccess = (event) => {
      const db = event.target.result;
      db.onerror = this.onerror;

      const objectStore = db.transaction(this.objectName, "readwrite")
			    .objectStore(this.objectName);

      func(objectStore)
      return;
    }    
  }

  save(upRushi) {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("beasts-48.png"),
      "title": "将以下up主加入黑名单!",
      "message": upRushi,
    });

    this.successHandler((objectStore) => objectStore.add({ name: upRushi, enable: true }));
  }

  delete() {
  }

  tag() {
  }

  list(sendResponse) {
    this.successHandler((objectStore) => {
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
      
      objectStore.openCursor().onerror = this.onerror;
    });
  }
}

class BlackListHelper {
}


browser.runtime.onMessage.addListener(communication);
