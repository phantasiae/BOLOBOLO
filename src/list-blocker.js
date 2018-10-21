
"use strict";

function block(item) {
  try {
    let newItem = document.createElement("div");

    // TODO: new UI
    let newContent = document.createTextNode("该用户已被屏蔽!");

    item.style.display = "none";

    newItem.className = item.className;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.be-blocked-item { color: #F00; }';
    document.getElementsByTagName('head')[0].appendChild(style);
    newItem.classList.add('be-blocked-item');

    newItem.appendChild(newContent);

    item.parentElement.insertBefore(newItem, item);
  } catch (err) {
    console.log('--- block ---', err);
  }
}

function markVideos(message) {
  const elements = document.getElementsByClassName("l-item");
  const upRushiList = message.upRushiList;

  console.log('--- message ---', message);


  for (let i = 0; i < elements.length; i++) {
    const upAuthorText = elements[i].childNodes.item(1).childNodes.item(3).innerText;
    console.log('--- upAuthorText ---', upAuthorText);
    console.log('i:', i, );
    console.log('l:', elements.length);

    for (let blackItem of upRushiList) {

      console.log('--- blackItem ---', blackItem);
      if (upAuthorText === blackItem.name) {
        console.log('--- item ---', i, elements[i], upAuthorText === blackItem);
        block(elements[i]);
        i++;
        break;
      }
    }
  }
}

function tryMarkVideos() {
  browser.runtime.sendMessage({ type: "soshou" })
	 .then(
	   markVideos,
	   (err) => {
             console.log('--- GET upRushiList err ---', err);
	   });
}

const interval = setInterval(() => {
  const elements = document.getElementsByClassName("l-item");
  if (elements.length !== 0) {
    tryMarkVideos(elements);
    clearInterval(interval);
  }
}, 200);

