/**
 * COE-Pay: Bulk Masterlist Ingestion & CSV Processor
 * Theme: Editorial Forest Emerald & Warm Amber Architecture
 * Features: Drag-and-drop CSV upload, batch student registration, auto-preview grid, and validation.
 */

const CoeMasterlistUpload = {
  parsedStudents: [],

  openModal() {
    const modalContainer = document.getElementById('global-modal-container');
    if (modalContainer) {
      modalContainer.className = modalContainer.className
        .replace(/max-w-[a-z0-9]+/g, '')
        .trim();
      modalContainer.classList.add('max-w-3xl', 'w-full', 'mx-4', 'sm:mx-auto');
    }

    const modalBody = `
      <div class="py-2 space-y-4 font-sans text-stone-800">
        
        <!-- Header Banner: Gradient Accent -->
        <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-[#1e293b] text-white shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-emerald-200 font-mono">
              <i class="fa-solid fa-file-arrow-up"></i> BATCH STUDENT INGESTION ENGINE
            </span>
            <h4 class="font-brand text-lg sm:text-xl font-extrabold text-white">Bulk Upload Masterlist</h4>
            <p class="text-xs text-white/80">Batch register official departmental cohorts, sections, and emails via CSV or Excel file.</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl text-amber-300 flex-shrink-0">
            <i class="fa-solid fa-users-gear"></i>
          </div>
        </div>

        <!-- CSV File Drag and Drop Zone -->
        <div>
          <div class="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-2xl p-5 bg-stone-50/70 hover:bg-emerald-50/30 transition text-center cursor-pointer group" onclick="document.getElementById('masterlist-file-input').click()">
            <input type="file" id="masterlist-file-input" accept=".csv,.txt" class="hidden" onchange="CoeMasterlistUpload.handleFileSelect(event)">
            
            <div id="upload-idle-state" class="space-y-1.5">
              <div class="w-12 h-12 rounded-2xl bg-white text-emerald-800 shadow-2xs flex items-center justify-center mx-auto text-xl border border-stone-200 group-hover:scale-105 transition">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div class="text-xs font-bold text-stone-800">Click to upload CSV or drag and drop file here</div>
              <p class="text-[10px] text-stone-500">Supported format: CSV (Student_ID, Full_Name, Section, Email, Contact)</p>
            </div>

            <!-- Upload Loaded State -->
            <div id="upload-success-state" class="hidden items-center justify-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold flex-shrink-0">
                <i class="fa-solid fa-file-csv"></i>
              </div>
              <div class="text-left">
                <div id="uploaded-file-name" class="font-bold text-stone-900 text-xs">masterlist.csv</div>
                <div id="uploaded-record-count" class="text-[10px] text-emerald-700 font-semibold"><i class="fa-solid fa-circle-check"></i> Ready for ingestion</div>
              </div>
              <button type="button" class="ml-auto text-xs text-stone-400 hover:text-rose-600 font-bold p-1" onclick="event.stopPropagation(); CoeMasterlistUpload.clearFile();">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Template and Guidelines Strip -->
        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div class="text-stone-600 flex items-center gap-2">
            <i class="fa-solid fa-circle-info text-emerald-700"></i>
            <span>Need the official institutional format?</span>
          </div>
          <button type="button" class="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-bold text-[11px] shadow-2xs transition inline-flex items-center gap-1.5" onclick="CoeMasterlistUpload.downloadSampleCsv()">
            <i class="fa-solid fa-download text-emerald-800 text-[10px]"></i>
            <span>Download CSV Template</span>
          </button>
        </div>

        <!-- Parsed Data Preview Grid -->
        <div id="masterlist-preview-area" class="space-y-2 hidden">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-stone-800 uppercase tracking-wider">Cohort Ingestion Preview</span>
            <span id="preview-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 font-mono">0 Parsed</span>
          </div>
          
          <div class="overflow-x-auto max-h-48 overflow-y-auto rounded-xl border border-stone-200 bg-white">
            <table class="w-full text-left text-xs border-collapse font-mono">
              <thead class="bg-stone-50 text-stone-600 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200 sticky top-0">
                <tr>
                  <th class="py-2.5 px-3">Student ID</th>
                  <th class="py-2.5 px-3">Full Name</th>
                  <th class="py-2.5 px-3">Section</th>
                  <th class="py-2.5 px-3">Registered Email</th>
                </tr>
              </thead>
              <tbody id="masterlist-preview-tbody" class="divide-y divide-stone-100 text-[11px]">
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    const footer = `
      <div class="flex items-center justify-between w-full">
        <button class="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs transition" onclick="window.coeApp.closeModal()">
          Cancel
        </button>
        <button id="commit-ingestion-btn" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-2 opacity-50 cursor-not-allowed" disabled onclick="CoeMasterlistUpload.commitIngestion()">
          <i class="fa-solid fa-user-plus text-xs"></i>
          <span>Ingest & Register Students</span>
        </button>
      </div>
    `;

    window.coeApp.showModal('Bulk Masterlist Ingestion', modalBody, footer, 'max-w-3xl');
  },

  handleFileSelect(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      this.parseCsvContent(text, file.name);
    };
    reader.readAsText(file);
  },

  parseCsvContent(csvText, fileName) {
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      alert("Invalid CSV: File must contain a header and at least one student row.");
      return;
    }

    const students = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length >= 3) {
        students.push({
          student_no: parts[0],
          full_name: parts[1],
          section: parts[2] || 'BSCpE-4A',
          email: parts[3] || `${parts[0]}@students.edu.ph`,
          status: 'Enrolled'
        });
      }
    }

    this.parsedStudents = students;

    // Toggle UI States
    const idleState = document.getElementById('upload-idle-state');
    const successState = document.getElementById('upload-success-state');
    const fileLabel = document.getElementById('uploaded-file-name');
    const countLabel = document.getElementById('uploaded-record-count');
    const previewArea = document.getElementById('masterlist-preview-area');
    const tbody = document.getElementById('masterlist-preview-tbody');
    const badge = document.getElementById('preview-badge');
    const commitBtn = document.getElementById('commit-ingestion-btn');

    if (idleState) idleState.classList.add('hidden');
    if (successState) {
      successState.classList.remove('hidden');
      successState.classList.add('flex');
    }
    if (fileLabel) fileLabel.textContent = fileName;
    if (countLabel) countLabel.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${students.length} students detected`;

    if (previewArea) previewArea.classList.remove('hidden');
    if (badge) badge.textContent = `${students.length} Students Parsed`;

    if (tbody) {
      tbody.innerHTML = students.map(s => `
        <tr class="hover:bg-emerald-50/20 transition">
          <td class="py-2.5 px-3 font-bold text-stone-900">${s.student_no}</td>
          <td class="py-2.5 px-3 font-semibold text-stone-800">${s.full_name}</td>
          <td class="py-2.5 px-3 text-stone-600">${s.section}</td>
          <td class="py-2.5 px-3 text-stone-500">${s.email}</td>
        </tr>
      `).join('');
    }

    if (commitBtn) {
      commitBtn.disabled = false;
      commitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  },

  clearFile() {
    this.parsedStudents = [];
    const input = document.getElementById('masterlist-file-input');
    const idleState = document.getElementById('upload-idle-state');
    const successState = document.getElementById('upload-success-state');
    const previewArea = document.getElementById('masterlist-preview-area');
    const commitBtn = document.getElementById('commit-ingestion-btn');

    if (input) input.value = '';
    if (successState) {
      successState.classList.add('hidden');
      successState.classList.remove('flex');
    }
    if (idleState) idleState.classList.remove('hidden');
    if (previewArea) previewArea.classList.add('hidden');

    if (commitBtn) {
      commitBtn.disabled = true;
      commitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  },

  commitIngestion() {
    if (this.parsedStudents.length === 0) return;

    const db = window.coepayDb;
    if (db && db.tables && Array.isArray(db.tables.students)) {
      this.parsedStudents.forEach(newStud => {
        const exists = db.tables.students.some(s => s.student_no === newStud.student_no);
        if (!exists) {
          db.tables.students.push(newStud);
        }
      });
    }

    const count = this.parsedStudents.length;
    window.coeApp.closeModal();
    window.coeApp.showToast(`Batch Ingestion Complete: ${count} students registered!`, 'success');

    // Re-render admin view if currently in Coordinator console
    if (window.CoeAdminView && typeof window.CoeAdminView.render === 'function') {
      window.CoeAdminView.render();
    }
  },

  downloadSampleCsv() {
    const sample = "Student_ID,Full_Name,Section,Email,Contact\n" +
      "2023-10011,Dela Cruz Juan P.,BSCpE-4A,juan.delacruz@students.edu.ph,09171112233\n" +
      "2023-10012,Santos Maria A.,BSCpE-4A,maria.santos@students.edu.ph,09182223344\n" +
      "2023-10013,Reyes Mark L.,BSCpE-4A,mark.reyes@students.edu.ph,09193334455\n";

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "COE_Masterlist_Template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

window.CoeMasterlistUpload = CoeMasterlistUpload;