// State
let tardyRecords = JSON.parse(localStorage.getItem("tardyRecords")) || [];
let gatePassRecords = JSON.parse(localStorage.getItem("gatePassRecords")) || [];
let lostFoundRecords = JSON.parse(localStorage.getItem("lostFoundRecords")) || [];
//let deleteCallback = null;

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
const tardyForm = document.getElementById("tardyForm");
if(tardyForm){
    tardyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const editId = document.getElementById("editTardyId").value;

        const recordData = {
            id: editId ? parseInt(editId) : Date.now(),
            student: document.getElementById("tardyStudent").value,
            dateTime: document.getElementById("tardyDateTime").value,
            classTime: document.getElementById("classTime").value,
            arrivalTime: document.getElementById("arrivalTime").value,
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
        saveToDisk();
        resetTardyForm();
    });
}

function editTardy(id) {
  const record = tardyRecords.find((r) => r.id === id);
  if (!record) return;

  document.getElementById("editTardyId").value = record.id;
  document.getElementById("tardyStudent").value = record.student;   
  document.getElementById("tardyDateTime").value = record.dateTime;
  document.getElementById("classTime").value = record.classTime;
  document.getElementById("arrivalTime").value = record.arrivalTime || "";
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

// Gate Pass Operations
const gatePassForm = document.getElementById("gatePassForm");
if(gatePassForm){
    gatePassForm.addEventListener("submit", (e) => {
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
        saveToDisk();
        resetGpForm();
    });
}


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

function editLostFound(id) {
    const r = lostFoundRecords.find(x => x.id === id);
    if (!r) return;

    // 1. Switch to the tab first so the fields exist in the DOM
    switchTab('lostfound', document.getElementById('tab-lostfound-btn'));

    // 2. Fill the hidden ID field
    document.getElementById("editLfId").value = r.id;
    
    // 3. Fill text inputs
    document.getElementById("lfReporter").value = r.reporter || "";
    document.getElementById("lfGradeSection").value = r.gradeSection || "";
    document.getElementById("lfDateReported").value = r.dateReported || "";
    document.getElementById("lfItemName").value = r.item || "";
    document.getElementById("lfLocation").value = r.location || "";
    document.getElementById("lfMarks").value = r.marks || "";
    document.getElementById("lfDateTime").value = r.dateTime || "";
    document.getElementById("lfReceivedBy").value = r.receivedBy || "";
    document.getElementById("lfDateReceived").value = r.dateReceived || "";
    document.getElementById("lfClaimant").value = r.claimant || "";
    document.getElementById("lfRelationship").value = r.relationship || "";
    document.getElementById("lfDateClaimed").value = r.dateClaimed || "";

    // 4. Handle Radio Buttons
    if (r.status) {
        const radio = document.querySelector(`input[name="lfType"][value="${r.status.toLowerCase()}"]`);
        if (radio) radio.checked = true;
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const lostFoundForm = document.getElementById("lostFoundForm");

if (lostFoundForm) {
    lostFoundForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const editId = document.getElementById("editLfId").value;

        const type = document.querySelector('input[name="lfType"]:checked');
        const status = type ? type.value.toUpperCase() : "";

        const recordData = {
    id: editId ? parseInt(editId) : Date.now(),
    reporter: document.getElementById("lfReporter").value,
    gradeSection: document.getElementById("lfGradeSection").value,
    dateReported: document.getElementById("lfDateReported").value,
    status,
    item: document.getElementById("lfItemName").value, // Matches 'item' in your table
    location: document.getElementById("lfLocation").value,
    marks: document.getElementById("lfMarks").value,
    dateTime: document.getElementById("lfDateTime").value,
    receivedBy: document.getElementById("lfReceivedBy").value,
    dateReceived: document.getElementById("lfDateReceived").value,
    claimant: document.getElementById("lfClaimant").value, // Matches 'claimant' in your table
    relationship: document.getElementById("lfRelationship").value,
    dateClaimed: document.getElementById("lfDateClaimed").value
};

        if (!recordData.reporter || !recordData.gradeSection || !recordData.item || !status) {
            showMessage("MISSING INFO", "Please complete required fields", "⚠️");
            return;
        }

        if (editId) {
            const idx = lostFoundRecords.findIndex(r => r.id === parseInt(editId));
            lostFoundRecords[idx] = recordData;
            showMessage("UPDATED", "Lost & Found record updated", "✏️");
        } else {
            lostFoundRecords.push(recordData);
            showMessage("RECORDED", "Item logged successfully", "📦");
        }

        localStorage.setItem("lostFoundRecords", JSON.stringify(lostFoundRecords));
        saveToDisk();
        resetLostFoundForm();
    });
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

function resetLostFoundForm() {
    document.getElementById("lostFoundForm").reset();
    document.getElementById("editLfId").value = "";
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
    <td class="p-4 text-gray-600 font-mono text-xs">${r.arrivalTime || '—'}</td>
    <td class="p-4 text-gray-600">G${r.grade} - ${r.section}</td>
    <td class="p-4 text-gray-500 italic text-xs max-w-xs truncate">${r.reason}</td> <td class="p-4">${isAbsence}</td>
    <td class="p-4 text-center whitespace-nowrap">
        <button onclick="window.location.href='index.html?editTardy=${r.id}'" class="btn-edit mr-2">EDIT</button>
        <button onclick="deleteRecord('tardy', ${r.id})" class="btn-delete">DEL</button>
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
                    <td class="p-4 font-bold text-gray-800">${r.student}</td>
                    <td class="p-4 text-gray-600">${r.gradeSection}</td>
                    <td class="p-4 text-gray-600">${r.picker}</td>
                    <td class="p-4 text-gray-600">${r.contact}</td>
                    <td class="p-4 text-gray-600">${r.date}</td>
                    <td class="p-4 text-gray-600">${r.timeExit}</td>
                    <td class="p-4 text-gray-600">${r.relationship}</td>
                    <td class="p-4 text-gray-600 italic text-xs">${r.reason}</td>
                    <td class="p-4 text-center whitespace-nowrap">
                        <button onclick="window.location.href='index.html?editGp=${r.id}'" class="btn-edit mr-2">EDIT</button>
                        <button onclick="deleteRecord('gatepass', ${r.id})" class="btn-delete">DEL</button>
                    </td>
`;

      gpBody.appendChild(tr);
    });

    
const lfBody = document.getElementById("lfTableBody");
if (!lfBody) return;

lfBody.innerHTML = "";

// Inside your renderRecords function for Lost & Found:
lostFoundRecords.forEach(r => {
    const row = `
        <tr>
            <td class="p-4">${r.reporter}</td>
            <td class="p-4">${r.gradeSection}</td>
            <td class="p-4">${r.dateReported}</td>
            <td class="p-4">${r.status}</td>
            <td class="p-4">${r.item || 'N/A'}</td> <td class="p-4">${r.location}</td>
            <td class="p-4">${r.marks}</td>
            <td class="p-4">${r.dateTime}</td>
            <td class="p-4">${r.receivedBy || '---'}</td>
            <td class="p-4">${r.dateReceived || '---'}</td>
            <td class="p-4">${r.claimant || '---'}</td> <td class="p-4">${r.relationship || '---'}</td>
            <td class="p-4">${r.dateClaimed || '---'}</td>
            <td class="p-4 text-center">
            <div class="flex gap-2 justify-center">
                <button onclick="window.location.href='index.html?editLf=${r.id}'" class="btn-edit px-3 py-1 bg-yellow-500 text-white font-bold">EDIT</button>
                <button onclick="deleteLostFound(${r.id})" class="btn-delete px-3 py-1 bg-red-600 text-white font-bold">DEL</button>
            </div>
        </td>
        </tr>
    `;
    document.getElementById("lfTableBody").innerHTML += row;
});
}

// // Function to show the confirmation modal
// function showConfirm(text, callback) {
//     const confirmBox = document.getElementById("confirmBox");
//     const confirmText = document.getElementById("confirmText");
//     const confirmBtn = document.getElementById("confirmBtn");

//     confirmText.innerText = text;
//     confirmBox.classList.remove("hidden");
//     confirmBox.classList.add("flex"); // Ensure it shows up if using flex centering

//     // Set the callback for the confirm button
//     deleteCallback = () => {
//         callback();
//         closeConfirm();
//     };

//     confirmBtn.onclick = deleteCallback;
// }
function showConfirm(text, callback) {
    const confirmBox = document.getElementById("confirmBox");
    const confirmText = document.getElementById("confirmText");
    const confirmBtn = document.getElementById("confirmBtn");

    confirmText.innerText = text;

    confirmBox.classList.remove("hidden");

    confirmBtn.onclick = () => {
        closeConfirm()
        callback()
    };
}

// Function to close the confirmation modal
function closeConfirm() {
    const confirmBox = document.getElementById("confirmBox");
    confirmBox.classList.add("hidden");
    confirmBox.classList.remove("flex");
    
}

// The missing Delete function for Lost and Found
function deleteLostFound(id) {
    showConfirm("Are you sure you want to delete this Lost & Found record?", () => {
        lostFoundRecords = lostFoundRecords.filter((r) => r.id !== id);
        localStorage.setItem("lostFoundRecords", JSON.stringify(lostFoundRecords));
        renderRecords(); // Refresh the table
    });
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

window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tardyDateTime")) {
    setDefaultDates();
  }

  const tabBtn = document.getElementById("tab-tardy-btn");
  if (tabBtn) {
    updateTabIndicator(tabBtn);
  }

  if (document.getElementById("tardyTableBody")) {
    renderRecords();
  }
});


// Resize observer for tab indicator responsiveness
window.addEventListener("resize", () => {
  const activeTab = document.querySelector(".tab-btn.active");
  if (activeTab) updateTabIndicator(activeTab);
});

// function deleteRecord(type, id) {
//     id = Number(id);

//     if (type === "tardy") {
//         showConfirm("Confirm permanent deletion of this record?", () => {
//             tardyRecords = tardyRecords.filter(r => r.id !== id);
//             localStorage.setItem("tardyRecords", JSON.stringify(tardyRecords));
//             renderRecords();
//             closeConfirm();
//         });
//     }

//     else if (type === "gatepass") {
//     showConfirm("Discard this Gate Pass record?", () => {
//         gatePassRecords = gatePassRecords.filter(r => r.id !== id);
//         localStorage.setItem("gatePassRecords", JSON.stringify(gatePassRecords));
//         renderRecords(); 
//         saveToDisk();    
//         closeConfirm();  
//     });
// }

//     else if (type === "lostfound") {   
//         showConfirm("Delete this Lost & Found record?", () => {
//             lostFoundRecords = lostFoundRecords.filter(r => r.id !== id);
//             localStorage.setItem("lostFoundRecords", JSON.stringify(lostFoundRecords));
//             renderRecords();
//             saveToDisk();
//             closeConfirm();   
//         });
//     }
// }
function deleteRecord(type, id) {
    id = Number(id);

    if (type === "tardy") {
        showConfirm("Confirm permanent deletion of this record?", () => {
            tardyRecords = tardyRecords.filter(r => r.id !== id);
            localStorage.setItem("tardyRecords", JSON.stringify(tardyRecords));
            renderRecords();
        });
    }

    else if (type === "gatepass") {
        showConfirm("Discard this Gate Pass record?", () => {
            gatePassRecords = gatePassRecords.filter(r => r.id !== id);
            localStorage.setItem("gatePassRecords", JSON.stringify(gatePassRecords));
            renderRecords();
            saveToDisk();
        });
    }

    else if (type === "lostfound") {
        showConfirm("Delete this Lost & Found record?", () => {
            lostFoundRecords = lostFoundRecords.filter(r => r.id !== id);
            localStorage.setItem("lostFoundRecords", JSON.stringify(lostFoundRecords));
            renderRecords();
            saveToDisk();
        });
    }
}

function editRecord(type, id, newData) {
    id = Number(id);

    if (type === "tardy") {
        showConfirm("Save changes to this Tardy record?", () => {
            tardyRecords = tardyRecords.map((r) => {
                if (r.id === id) {
                    return { ...r, ...newData }; // update fields from user input
                }
                return r;
            });

            localStorage.setItem("tardyRecords", JSON.stringify(tardyRecords));
            renderRecords();
            closeConfirm();
        });
    }
    else if (type === "gatepass") {
        showConfirm("Save changes to this Gate Pass record?", () => {
            gatePassRecords = gatePassRecords.map((r) => {
                if (r.id === id) {
                    return { ...r, ...newData };
                }
                return r;
            });

            localStorage.setItem("gatePassRecords", JSON.stringify(gatePassRecords));
            renderRecords();
            closeConfirm();
        });
    }
}
window.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);

  const tardyId = params.get("editTardy");
  const gpId = params.get("editGp");
  const lfId = params.get("editLf");

  if (tardyId) {
    editTardy(Number(tardyId));
  }

  if (gpId) {
    editGp(Number(gpId));
  }
  if (lfId) {
    editLostFound(Number(lfId));
}

});

async function testSave() {
    const testData = {
        tardy: tardyRecords,
        gatepass: gatePassRecords
    };

    try {
        const response = await fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });
        
        const result = await response.json();
        console.log("Server Response:", result.message);
        alert("Saved to Hard Drive!");
    } catch (error) {
        console.error("Connection Failed:", error);
        alert("Is the server running? Check the console.");
    }
}

const { ipcRenderer } = require('electron');

// Call this to save
function saveToDisk() {
   const allData = {
       tardy: tardyRecords,
       gatepass: gatePassRecords,
       lostfound: lostFoundRecords
   };

   ipcRenderer.send('save-data', allData);
}

// Call this to load when app starts
ipcRenderer.on('loaded-data', (event, data) => {
    tardyRecords = (data.tardy || []).map(r => ({
        arrivalTime: r.arrivalTime || "", // auto add if missing
        ...r
    }));

    gatePassRecords = data.gatepass || [];
    lostFoundRecords = data.lostfound || [];
    renderRecords();
});

ipcRenderer.on('save-status', (event, message) => {
    console.log(message);
});