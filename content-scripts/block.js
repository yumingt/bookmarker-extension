let showBlocks = true;

// Create a block container div and append it to the document
const blockContainer = document.createElement("div");
blockContainer.classList.add("blockContainer");
document.body.appendChild(blockContainer);

function addBlock() {
  // Create a div for the block
  const block = document.createElement("div");
  block.classList.add("blocker-block");

  // Create color picker
  const colorPicker = document.createElement("INPUT");
  colorPicker.setAttribute("type", "color");

  // Create change color button
  const colorButton = document.createElement("button");
  console.log(colorButton);
  colorButton.innerText = "change color";
  colorButton.id = "btn";
  //document.getElementById("btn").onclick=function(){changeColor(block, colorPicker);};
  colorButton.addEventListener("click", function(){changeColor(block, colorPicker)});
  //colorButton.addEventListener("click", changeColor(block, colorPicker));

  // Create the drag handle
  const dragButton = document.createElement("button");
  dragButton.innerText = "drag";
  makeDraggable(dragButton);

  // Create the delete button
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "remove";
  deleteButton.addEventListener("click", deleteParent);

  // Add the delete button, drag handle, and color picker to the block
  block.appendChild(colorPicker);
  block.appendChild(colorButton);
  block.appendChild(deleteButton);
  block.appendChild(dragButton);

  // Add the block to the block container
  blockContainer.appendChild(block);
}

/*
function changeColor(e, block, colorPicker) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // This is the whole message object that was sent from the popup
    console.log(message);

    // Pull out the color key so we can use it later
    const newColor = message.color;

    // Get the current color of the background to send it back to the popup
    const oldColor = getComputedStyle(block).backgroundColor;

    // Set the background color to the new color
    block.style.backgroundColor = newColor;

    // Use the sendResponse function passed in by chrome to send a response
    sendResponse(`the color has been changed from ${oldColor} to ${newColor}!`);
  });
}
*/

function changeColor(block, colorPicker) {
  // Get the current color of the background to send it back to the popup
  //const oldColor = getComputedStyle(block).backgroundColor;

  // Set the background color to the new color
  block.style.backgroundColor = colorPicker.value;
  //colorButton.addEventListener(colorButton, "click", changeColor(block, colorPicker.value));
  console.log(colorPicker.value);
}

function deleteParent(e) {
  e.target.parentNode.remove();
}

function makeDraggable(el) {
  el.addEventListener("mousedown", function (e) {
    const parentBlock = el.parentNode;
    var offsetX =
      e.clientX - parseInt(window.getComputedStyle(parentBlock).left);
    var offsetY =
      e.clientY - parseInt(window.getComputedStyle(parentBlock).top);

    function mouseMoveHandler(e) {
      parentBlock.style.top = e.clientY - offsetY + "px";
      parentBlock.style.left = e.clientX - offsetX + "px";
    }

    function reset() {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", reset);
    }

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", reset);
  });
}

function renderBlocks() {
  if (showBlocks) {
    blockContainer.classList.remove("invisible");
  } else {
    blockContainer.classList.add("invisible");
  }
}

// Add a message listener that sets the value of "replace"
chrome.runtime.onMessage.addListener((request) => {
  showBlocks = request["enable"];
  if (request["addBlock"]) addBlock();
  renderBlocks();
});