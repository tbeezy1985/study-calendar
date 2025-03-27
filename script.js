window.addEventListener("DOMContentLoaded", () => {
  const planner = document.getElementById("planner");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday"];
  const timeBlocks = [
    "4:00 PM - 4:20 PM", "4:20 PM - 4:40 PM", "4:40 PM - 5:00 PM",
    "5:00 PM - 5:20 PM", "5:20 PM - 5:40 PM", "5:40 PM - 6:00 PM",
    "6:00 PM - 6:20 PM", "6:20 PM - 6:40 PM", "6:40 PM - 7:00 PM",
    "7:00 PM - 7:20 PM", "7:20 PM - 7:40 PM", "7:40 PM - 8:00 PM",
    "8:00 PM - 8:20 PM", "8:20 PM - 8:40 PM", "8:40 PM - 9:00 PM",
    "9:00 PM - 9:20 PM", "9:20 PM - 9:40 PM", "9:40 PM - 10:00 PM"
  ];

  const blockColor = {
    "Athletics": "#fdd835",
    "Mess": "#ff7043",
    "Study Hall": "#aed581"
  };

  days.forEach((day) => {
    const container = document.createElement("div");
    container.classList.add("day-container");

    const table = document.createElement("table");
    table.classList.add("grid");
    table.setAttribute("data-day", day);

    const header = document.createElement("tr");
    header.innerHTML = `<th class="label">${day} Time</th><th class="label">${day}</th>`;
    table.appendChild(header);

    timeBlocks.forEach((block, index) => {
      const row = document.createElement("tr");
      const timeCell = document.createElement("td");
      timeCell.className = "slot";
      timeCell.textContent = block;

      const eventCell = document.createElement("td");
      eventCell.className = "slot";

      if (index <= 5) {
        eventCell.style.backgroundColor = blockColor["Athletics"];
        if (index === 0) eventCell.textContent = "Athletics";
      } else if (index >= 6 && index <= 8) {
        eventCell.style.backgroundColor = blockColor["Mess"];
        if (index === 6) eventCell.textContent = "Mess";
      } else if (index >= 9 && index <= 12) {
        eventCell.style.backgroundColor = blockColor["Study Hall"];
        if (index === 9) eventCell.textContent = "Study Hall";
        else {
          eventCell.addEventListener("dragover", (e) => e.preventDefault());
          eventCell.addEventListener("drop", (e) => {
            const id = e.dataTransfer.getData("text");
            const dragged = document.getElementById(id).cloneNode(true);
            dragged.id = "";
            dragged.setAttribute("draggable", false);
            eventCell.innerHTML = "";
            eventCell.appendChild(dragged);
          });
        }
      }

      row.appendChild(timeCell);
      row.appendChild(eventCell);
      table.appendChild(row);
    });

    container.appendChild(table);
    planner.appendChild(container);
  });

  document.querySelectorAll(".block").forEach((el, i) => {
    el.id = `block-${i}`;
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id);
    });
  });

  window.addCustomBlock = function () {
    const input = document.getElementById("customTaskInput");
    const text = input.value.trim();
    if (text === "") return;

    const block = document.createElement("div");
    block.className = "block";
    block.textContent = text;
    block.setAttribute("draggable", true);

    const id = `block-${document.querySelectorAll(".block").length}`;
    block.id = id;

    block.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", block.id);
    });

    document.querySelector(".blocks").appendChild(block);
    input.value = "";
  };

  window.saveSchedule = function () {
    const saved = {};
    document.querySelectorAll("table.grid").forEach((table) => {
      const day = table.getAttribute("data-day");
      saved[day] = [];
      const rows = table.querySelectorAll("tr");
      rows.forEach((row, i) => {
        if (i === 0) return; // skip header
        const cell = row.children[1];
        saved[day].push(cell.innerHTML);
      });
    });
    localStorage.setItem("studySchedule", JSON.stringify(saved));
    alert("Schedule saved!");
  };

  window.clearSchedule = function () {
    if (confirm("Clear all study blocks?")) {
      localStorage.removeItem("studySchedule");
      location.reload();
    }
  };

  // Restore saved schedule
  const saved = JSON.parse(localStorage.getItem("studySchedule"));
  if (saved) {
    document.querySelectorAll("table.grid").forEach((table) => {
      const day = table.getAttribute("data-day");
      const rows = table.querySelectorAll("tr");
      if (saved[day]) {
        saved[day].forEach((html, i) => {
          const cell = rows[i + 1]?.children[1];
          if (cell && html && html.includes("block")) {
            cell.innerHTML = html;
          }
        });
      }
    });
  }
});
