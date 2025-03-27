const schedule = document.getElementById('schedule');

const timeBlocks = [
  "4:00 PM - 4:20 PM",
  "4:20 PM - 4:40 PM",
  "4:40 PM - 5:00 PM",
  "5:00 PM - 5:20 PM",
  "5:20 PM - 5:40 PM",
  "5:40 PM - 6:00 PM",
  "6:00 PM - 6:20 PM",
  "6:20 PM - 6:40 PM",
  "6:40 PM - 7:00 PM",
  "7:00 PM - 7:20 PM",
  "7:20 PM - 7:40 PM",
  "7:40 PM - 8:00 PM",
  "8:00 PM - 8:20 PM",
  "8:20 PM - 8:40 PM",
  "8:40 PM - 9:00 PM",
  "9:00 PM - 9:20 PM",
  "9:20 PM - 9:40 PM",
  "9:40 PM - 10:00 PM"
];

const colorMap = {
  "Athletics": "#fdd835",
  "Mess": "#ff7043",
  "Study Hall": "#aed581"
};

const blockAssignments = [
  { range: [0, 5], label: "Athletics" },
  { range: [6, 8], label: "Mess" },
  { range: [9, 12], label: "Study Hall" }
];

timeBlocks.forEach((block, index) => {
  const timeLabel = document.createElement('div');
  timeLabel.className = 'slot';
  timeLabel.textContent = block;

  const timeSlot = document.createElement('div');
  timeSlot.className = 'slot';

  let assigned = false;
  blockAssignments.forEach(({ range, label }) => {
    if (index >= range[0] && index <= range[1]) {
      timeSlot.style.backgroundColor = colorMap[label];
      timeSlot.textContent = label;
      if (label === "Study Hall") {
        timeSlot.addEventListener("dragover", (e) => e.preventDefault());
        timeSlot.addEventListener("drop", (e) => {
          const id = e.dataTransfer.getData("text");
          const dragged = document.getElementById(id).cloneNode(true);
          dragged.id = "";
          dragged.setAttribute("draggable", false);
          timeSlot.innerHTML = "";
          timeSlot.appendChild(dragged);
        });
      }
      assigned = true;
    }
  });

  schedule.appendChild(timeLabel);
  schedule.appendChild(timeSlot);
});

document.querySelectorAll('.block').forEach((el, i) => {
  el.id = `block-${i}`;
  el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', e.target.id);
  });
});
