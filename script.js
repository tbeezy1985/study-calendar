// Create grid slots
const grid = document.getElementById("grid");

for (let hour = 1; hour <= 8; hour++) {
  for (let day = 0; day <= 5; day++) {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.dataset.hour = hour;
    slot.dataset.day = day;
    slot.addEventListener("dragover", (e) => e.preventDefault());
    slot.addEventListener("drop", (e) => {
      const blockId = e.dataTransfer.getData("text");
      const newBlock = document.getElementById(blockId).cloneNode(true);
      newBlock.id = "";
      newBlock.setAttribute("draggable", "false");
      e.target.innerHTML = "";
      e.target.appendChild(newBlock);
    });

    if (day === 0) {
      slot.innerText = `Period ${hour}`;
    }

    grid.appendChild(slot);
  }
}

// Make blocks draggable
document.querySelectorAll(".block").forEach((block, i) => {
  block.id = `block-${i}`;
  block.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text", e.target.id);
  });
});
