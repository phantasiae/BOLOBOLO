function addButton2BlackList(beDropDownList) {
  try {
    // TODO: first?
    const menuToAddBlack = beDropDownList.item(0);

    const buttonTemplate = menuToAddBlack.firstElementChild;

    const blockButton = document.createElement("li");
    blockButton.classList = buttonTemplate.classList;
    blockButton.textContent = "悄悄屏蔽";

    blockButton.onclick = blockButtonClick;

    menuToAddBlack.appendChild(blockButton);
    return 1;
  } catch (err) {
    console.log('--- add block button err ---', err);
  }
}

function blockButtonClick() {
  const upRushi = document.getElementById("h-name").textContent;
  console.log('--- b ---', upRushi);
  browser.runtime.sendMessage({ upRushi: upRushi, type: "souki" });
}

const interval = setInterval(() => {
  const beDropDownList = document.querySelectorAll(".be-dropdown-menu");
  console.log('--- * 1 ---');
  if (beDropDownList.length !== 0) {
    addButton2BlackList(beDropDownList);
    clearInterval(interval);
  }
}, 100);
