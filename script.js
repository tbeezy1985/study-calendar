window.addEventListener("DOMContentLoaded", () => {
  const schedule = document.getElementById("schedule");

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

  timeBlocks.forEach((time, rowIndex) => {
    const row = document.createElement("tr");

    // Create time label
    const timeCell = document.createElement("td");
    timeCell.className = "slot";
    timeCell.textContent = time;

    // Set background color and section labels
    if (rowIndex <= 5) {
      timeCell.style.backgroundColor = blockColor["Athletics"];
      if (rowIndex === 0) timeCell.textContent += " (Athletics)";
    } else if (rowIndex <= 8) {
      timeCell.style.backgroundColor = blockColor["Mess"];
      if (rowIndex === 6) timeCell.textContent += " (Mess)";
    } else if (rowIndex <= 12) {
      timeCell.style.backgroundColor = blockColor["Study Hall"];
      if (rowIndex === 9) timeCell.textContent += " (Study Hall)";
    }

    row.appendChild(timeCell);

    // Create drop zones for each day
    days.forEach((day) => {
      const cell = document.createElement("td");
      cell.className = "slot";

      if (rowIndex >= 9 && rowIndex <= 12) {
        // Enable drop only during Study Hall blocks
        cell.addEventListener("dragover", (e) => e.preventDefault());
        cell.addEventListener("drop", (e) => {
          const id = e.dataTransfer.getData("text");
          const dragged = document.getElementById(id).cloneNode(true);
          dragged.id = "";
          dragged.setAttribute("draggable", false);
          cell.innerHTML = "";
          cell.appendChild(dragged);
        });
      }

      row.appendChild(cell);
    });

    schedule.appendChild(row);
  });

  // Make initial blocks draggable
  document.querySelectorAll(".block").forEach((el, i) => {
    el.id = `block-${i}`;
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id);
    });
  });

  // Custom block creation
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

  // Save to localStorage
  window.saveSchedule = function () {
    const saved = [];
    document.querySelectorAll("#schedule tr").forEach((row, rowIndex) => {
      if (rowIndex === 0) return; // skip header
      const cells = Array.from(row.querySelectorAll("td")).slice(1); // skip time cell
      saved[rowIndex - 1] = cells.map(cell => cell.innerHTML);
    });
    localStorage.setItem("studySchedule", JSON.stringify(saved));
    alert("Schedule saved!");
  };

  // Load from localStorage
  const saved = JSON.parse(localStorage.getItem("studySchedule"));
  if (saved) {
    document.querySelectorAll("#schedule tr").forEach((row, rowIndex) => {
      if (rowIndex === 0) return;
      const cells = Array.from(row.querySelectorAll("td")).slice(1);
      cells.forEach((cell, i) => {
        const html = saved[rowIndex - 1]?.[i];
        if (html && html.includes("block")) {
          cell.innerHTML = html;
        }
      });
    });
  }

  // Clear
  window.clearSchedule = function () {
    if (confirm("Clear all study blocks?")) {
      localStorage.removeItem("studySchedule");
      location.reload();
    }
  };
});
