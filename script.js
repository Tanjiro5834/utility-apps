// State
let tardyRecords = JSON.parse(localStorage.getItem("tardyRecords")) || [];
let gatePassRecords = JSON.parse(localStorage.getItem("gatePassRecords")) || [];
let deleteCallback = null;

// Initialize Tab Indicator Position
function updateTabIndicator(btn) {
  const indicator = document.getElementById("tab-indicator");
  indicator.style.left = btn.offsetLeft + "px";
  indicator.style.width = btn.offsetWidth + "px";
}

// Tabs
function switchTab(tabName, btnElement) {
  // If btnElement is not provided (called from code), find it
  if (!btnElement) {
    btnElement = document.getElementById(`tab-${tabName}-btn`);
  }

  // UI Styling
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.add("hidden"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));

  document.getElementById(`section-${tabName}`).classList.remove("hidden");
  btnElement.classList.add("active");

  updateTabIndicator(btnElement);

  if (tabName === "records") renderRecords();
}

// Tardy Operations
document.getElementById("tardyForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const editId = document.getElementById("editTardyId").value;

  const recordData = {
    id: editId ? parseInt(editId) : Date.now(),
    student: document.getElementById("tardyStudent").value,
    dateTime: document.getElementById("tardyDateTime").value,
    classTime: document.getElementById("classTime").value,
    grade: document.getElementById("tardyGrade").value,
    section: document.getElementById("tardySection").value,
    reason: document.getElementById("tardyReason").value,
  };

  if (editId) {
    const idx = tardyRecords.findIndex((r) => r.id === parseInt(editId));
    tardyRecords[idx] = recordData;
    showMessage("UPDATED", "Record modified in registry", "✏️");
  } else {
    tardyRecords.push(recordData);
    const count = tardyRecords.filter(
      (r) => r.student.toLowerCase() === recordData.student.toLowerCase(),
    ).length;
    let msg = `Tardy slip generated for ${recordData.student}.`;
    if (count % 3 === 0) msg += ` \n\n⚠️ 3RD OCCURRENCE! 1 Absence triggered.`;
    showMessage("SUCCESS", msg, "📌");
  }

  localStorage.setItem("tardyRecords", JSON.stringify(tardyRecords));
  resetTardyForm();
});

function editTardy(id) {
  const record = tardyRecords.find((r) => r.id === id);
  if (!record) return;

  document.getElementById("editTardyId").value = record.id;
  document.getElementById("tardyStudent").value = record.student;
  document.getElementById("tardyDateTime").value = record.dateTime;
  document.getElementById("classTime").value = record.classTime;
  document.getElementById("tardyGrade").value = record.grade;
  document.getElementById("tardySection").value = record.section;
  document.getElementById("tardyReason").value = record.reason;

  document.getElementById("tardyFormTitle").innerText = "Edit Tardy Slip";
  document.getElementById("tardySubmitBtn").innerText = "Update Slip";
  document.getElementById("cancelTardyEdit").classList.remove("hidden");
  switchTab("tardy");
}

function resetTardyForm() {
  document.getElementById("tardyForm").reset();
  document.getElementById("editTardyId").value = "";
  document.getElementById("tardyFormTitle").innerText = "Issue Tardy Slip";
  document.getElementById("tardySubmitBtn").innerText = "Generate Slip";
  document.getElementById("cancelTardyEdit").classList.add("hidden");
  setDefaultDates();
}

function deleteTardy(id) {
  showConfirm("Confirm permanent deletion of this record?", () => {
    tardyRecords = tardyRecords.filter((r) => r.id !== id);
    localStorage.setItem("tardyRecords", JSON.stringify(tardyRecords));
    renderRecords();
    closeConfirm();
  });
}

// Gate Pass Operations
document.getElementById("gatePassForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const editId = document.getElementById("editGpId").value;

  const gpData = {
    id: editId ? parseInt(editId) : Date.now(),
    student: document.getElementById("gpStudent").value,
    date: document.getElementById("gpDate").value,
    gradeSection: document.getElementById("gpGradeSection").value,
    timeExit: document.getElementById("gpTimeExit").value,
    reason: document.getElementById("gpReason").value,
    picker: document.getElementById("gpPicker").value,
    relationship: document.getElementById("gpRelationship").value,
    contact: document.getElementById("gpContact").value,
  };

  if (editId) {
    const idx = gatePassRecords.findIndex((r) => r.id === parseInt(editId));
    gatePassRecords[idx] = gpData;
    showMessage("UPDATED", "Gate Pass details modified", "✏️");
  } else {
    gatePassRecords.push(gpData);
    showMessage("ISSUED", "Early Dismissal Authorized", "🚗");
  }

  localStorage.setItem("gatePassRecords", JSON.stringify(gatePassRecords));
  resetGpForm();
});

function editGp(id) {
  const record = gatePassRecords.find((r) => r.id === id);
  if (!record) return;

  document.getElementById("editGpId").value = record.id;
  document.getElementById("gpStudent").value = record.student;
  document.getElementById("gpDate").value = record.date;
  document.getElementById("gpGradeSection").value = record.gradeSection;
  document.getElementById("gpTimeExit").value = record.timeExit;
  document.getElementById("gpPicker").value = record.picker;
  document.getElementById("gpRelationship").value = record.relationship;
  document.getElementById("gpContact").value = record.contact;
  document.getElementById("gpReason").value = record.reason;

  document.getElementById("gpFormTitle").innerText = "Edit Gate Pass";
  document.getElementById("gpSubmitBtn").innerText = "Update Gate Pass";
  document.getElementById("cancelGpEdit").classList.remove("hidden");
  switchTab("gatepass");
}

function resetGpForm() {
  document.getElementById("gatePassForm").reset();
  document.getElementById("editGpId").value = "";
  document.getElementById("gpFormTitle").innerText =
    "Early Dismissal Gate Pass";
  document.getElementById("gpSubmitBtn").innerText = "Issue Pass";
  document.getElementById("cancelGpEdit").classList.add("hidden");
  setDefaultDates();
}

function deleteGp(id) {
  showConfirm("Discard this Gate Pass record?", () => {
    gatePassRecords = gatePassRecords.filter((r) => r.id !== id);
    localStorage.setItem("gatePassRecords", JSON.stringify(gatePassRecords));
    renderRecords();
    closeConfirm();
  });
}

// UI Rendering
function renderRecords() {
  const tBody = document.getElementById("tardyTableBody");
  tBody.innerHTML = "";
  const counts = {};
  tardyRecords.forEach(
    (r) =>
      (counts[r.student.toLowerCase()] =
        (counts[r.student.toLowerCase()] || 0) + 1),
  );

  tardyRecords
    .slice()
    .reverse()
    .forEach((r) => {
      const lateCount = counts[r.student.toLowerCase()];
      const isAbsence =
        lateCount >= 3
          ? `<span class="badge-red">Absence (${Math.floor(lateCount / 3)})</span>`
          : '<span class="text-gray-400 font-bold">NORMAL</span>';

      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-100 hover:bg-slate-50";
      tr.innerHTML = `
                    <td class="p-4 font-bold text-gray-800">${r.student}</td>
                    <td class="p-4 text-gray-600">${new Date(r.dateTime).toLocaleString()}</td>
                    <td class="p-4 text-gray-600 font-mono text-xs">${r.classTime}</td>
                    <td class="p-4 text-gray-600">G${r.grade} - ${r.section}</td>
                    <td class="p-4">${isAbsence}</td>
                    <td class="p-4 text-center whitespace-nowrap">
                        <button onclick="editTardy(${r.id})" class="btn-edit mr-2">EDIT</button>
                        <button onclick="deleteTardy(${r.id})" class="btn-delete">DEL</button>
                    </td>
                `;
      tBody.appendChild(tr);
    });

  const gpBody = document.getElementById("gpTableBody");
  gpBody.innerHTML = "";
  gatePassRecords
    .slice()
    .reverse()
    .forEach((r) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-100 hover:bg-slate-50";
      tr.innerHTML = `
                    <td class="p-4">
                        <div class="font-bold text-gray-800">${r.student}</div>
                        <div class="text-xs font-bold text-gray-400 uppercase">${r.gradeSection}</div>
                    </td>
                    <td class="p-4 text-gray-600">${r.date} @ ${r.timeExit}</td>
                    <td class="p-4 text-xs font-bold uppercase">
                        ${r.picker} <br><span class="text-blue-500">${r.relationship}</span>
                    </td>
                    <td class="p-4 text-gray-600 italic text-xs">${r.reason}</td>
                    <td class="p-4 text-center whitespace-nowrap">
                        <button onclick="editGp(${r.id})" class="btn-edit mr-2">EDIT</button>
                        <button onclick="deleteGp(${r.id})" class="btn-delete">DEL</button>
                    </td>
                `;
      gpBody.appendChild(tr);
    });
}

// Modals
function showConfirm(text, callback) {
  document.getElementById("confirmText").innerText = text;
  document.getElementById("confirmBox").classList.remove("hidden");
  deleteCallback = callback;
  document.getElementById("confirmBtn").onclick = deleteCallback;
}

function closeConfirm() {
  document.getElementById("confirmBox").classList.add("hidden");
}

function showMessage(title, text, icon) {
  document.getElementById("messageTitle").innerText = title;
  document.getElementById("messageText").innerText = text;
  document.getElementById("messageIcon").innerText = icon;
  document.getElementById("messageBox").classList.remove("hidden");
}

function closeMessage() {
  document.getElementById("messageBox").classList.add("hidden");
}

function setDefaultDates() {
  const now = new Date();
  const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  if (document.getElementById("tardyDateTime"))
    document.getElementById("tardyDateTime").value = localIso;
  if (document.getElementById("gpDate"))
    document.getElementById("gpDate").value = localDate;
}

window.onload = () => {
  setDefaultDates();
  updateTabIndicator(document.getElementById("tab-tardy-btn"));
};

// Resize observer for tab indicator responsiveness
window.addEventListener("resize", () => {
  const activeTab = document.querySelector(".tab-btn.active");
  if (activeTab) updateTabIndicator(activeTab);
});
