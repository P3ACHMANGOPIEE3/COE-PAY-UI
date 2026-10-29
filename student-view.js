/**
 * COE-Pay: Student Portal View Controller
 * Persona: Christian Dave Guiyab / Jerome Opana (Engineering Student)
 * Features: Working Clearance Pass Modal, GCash Submission, E-Receipt Viewer
 */

const CoeStudentView = {
  activeTab: 'assessments', // 'assessments' | 'history' | 'clearance'

  render() {
    const container = document.getElementById('student-view-container') || 
                      document.getElementById('main-app-container');
    if (!container) return;

    ['developer-view-container', 'admin-view-container', 'personnel-view-container', 'login-view-container'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el !== container) el.innerHTML = '';
    });

    container.className = "w-full p-0 m-0 block relative z-10 pointer-events-auto";
    if (container.parentElement) {
      container.parentElement.style.maxWidth = "100%";
      container.parentElement.style.padding = "0";
      container.parentElement.style.margin = "0";
    }

    const auth = window.coeAuth || window.CoeAuth || {};
    const currentUser = (auth.getUser && auth.getUser()) || {};
    const studentProfile = (auth.getProfile && auth.getProfile()) || {};

    const studentName = studentProfile.full_name || currentUser.full_name || 'Christian Dave Guiyab';
    const studentNo = currentUser.student_no || '2023-10001';
    const program = currentUser.program || 'BS Computer Engineering';
    const section = currentUser.section || 'BSCpE-4A';

    container.innerHTML = `
      <div class="relative min-h-[calc(100vh-80px)] w-full py-8 px-4 sm:px-8 lg:px-10 overflow-hidden" 
           style="background: linear-gradient(135deg, #eef5f1 0%, #f1f5f9 50%, #e2e8f0 100%);">
        
        <!-- RIGHT-SIDE ACCENT PHOTO BACKDROP: ENGINEERING-UNIFORM.JPEG -->
        <div class="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <div class="absolute -top-24 -left-24 w-[32rem] h-[32rem] bg-emerald-200/35 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-24 left-1/4 w-[30rem] h-[30rem] bg-amber-100/35 rounded-full blur-3xl"></div>

          <div class="absolute top-0 right-0 w-full sm:w-[50%] lg:w-[42%] h-full overflow-hidden opacity-30">
            <img src="js/assets/engineering-uniform.jpeg" 
                 alt="COE Uniform" 
                 class="w-full h-full object-cover object-left filter brightness-95 contrast-105"
                 onerror="if(!this.dataset.r1){this.dataset.r1=1;this.src='assets/engineering-uniform.jpeg';}else if(!this.dataset.r2){this.dataset.r2=1;this.src='js/assets/cainta-campus.jpeg';}">
            <div class="absolute inset-0 bg-gradient-to-r from-[#eef5f1] via-transparent to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-[#eef5f1]/60 via-transparent to-[#e2e8f0]/80"></div>
          </div>

          <svg class="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="student-arch-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="4 4" />
                <circle cx="0" cy="0" r="1.5" fill="#0f766e" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#student-arch-grid)" />
          </svg>
        </div>

        <!-- MAIN INTERACTIVE CONTENT -->
        <div class="relative z-10 w-full space-y-6 pointer-events-auto">

          <!-- EXECUTIVE STUDENT HEADER -->
          <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-1.5">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0f2e5a] text-white tracking-wide shadow-xs">
                  <i class="fa-solid fa-graduation-cap"></i> COE STUDENT CLEARANCE PORTAL
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                  AY 2026-2027 • 1st Sem
                </span>
              </div>
              <h1 class="text-3xl sm:text-4xl font-black font-brand tracking-tight text-slate-900">${studentName}</h1>
              <p class="text-xs sm:text-sm font-medium text-slate-600">
                Student No: <strong class="text-slate-900 font-mono">${studentNo}</strong> • Program: <strong class="text-emerald-800">${program}</strong> (${section})
              </p>
            </div>

            <!-- Action Toolbar Cluster -->
            <div class="flex items-center gap-2.5 flex-wrap flex-shrink-0">
              <button type="button" onclick="CoeStudentView.openGcashSubmitModal()" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-wallet text-xs"></i>
                <span>Submit GCash Payment Proof</span>
              </button>
              <button type="button" onclick="CoeStudentView.openClearancePassModal('${studentName}', '${studentNo}', '${program}', '${section}')" class="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-certificate text-emerald-700"></i>
                <span>Clearance Pass</span>
              </button>
            </div>
          </div>

          <!-- 4 STAT BOXES WITH AMBIENT GLOW -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-blue-200/80 shadow-[0_4px_20px_rgba(59,130,246,0.08)] hover:shadow-[0_0_28px_rgba(59,130,246,0.25)] hover:border-blue-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-lg shadow-2xs group-hover:scale-105 transition-transform">
                  ₱
                </div>
                <span class="text-xs font-mono font-bold text-slate-400">Total Due</span>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">SEMESTER ASSESSMENTS</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">₱900.00</div>
              <div class="text-xs text-slate-500 font-medium mt-2">
                2 Required Department Items
              </div>
            </div>

            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-emerald-200/80 shadow-[0_4px_20px_rgba(16,185,129,0.08)] hover:shadow-[0_0_28px_rgba(16,185,129,0.25)] hover:border-emerald-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
                <span class="text-xs font-mono font-bold text-slate-400">Paid</span>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">TOTAL PAID & VERIFIED</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">₱450.00</div>
              <div class="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1.5">
                <i class="fa-solid fa-receipt"></i> Verified by Treasury
              </div>
            </div>

            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-amber-200/80 shadow-[0_4px_20px_rgba(245,158,11,0.08)] hover:shadow-[0_0_28px_rgba(245,158,11,0.25)] hover:border-amber-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-clock"></i>
                </div>
                <button type="button" onclick="CoeStudentView.openGcashSubmitModal()" class="text-xs font-mono font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition cursor-pointer">
                  Pay Now <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </button>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">REMAINING UNPAID BALANCE</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">₱450.00</div>
              <div class="text-xs text-amber-700 font-medium mt-2 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> 1 Pending Obligation
              </div>
            </div>

            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-teal-200/80 shadow-[0_4px_20px_rgba(20,184,166,0.08)] hover:shadow-[0_0_28px_rgba(20,184,166,0.25)] hover:border-teal-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-stamp"></i>
                </div>
                <button type="button" onclick="CoeStudentView.openClearancePassModal('${studentName}', '${studentNo}', '${program}', '${section}')" class="text-xs font-mono font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition cursor-pointer">
                  Pass <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </button>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">EXAMINATION STATUS</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">Cleared</div>
              <div class="text-xs text-emerald-700 font-semibold mt-2">
                Eligible for Examination
              </div>
            </div>

          </div>

          <!-- TAB CONTROLLER -->
          <div class="flex items-center gap-2 sm:gap-6 border-b border-stone-200/80 text-xs font-bold font-mono overflow-x-auto pb-1">
            <button type="button" onclick="CoeStudentView.switchTab('assessments')" class="pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${this.activeTab === 'assessments' ? 'border-emerald-800 text-emerald-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i class="fa-solid fa-list-check text-emerald-700"></i>
              <span>Assigned Department Fees (2)</span>
            </button>
            <button type="button" onclick="CoeStudentView.switchTab('history')" class="pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${this.activeTab === 'history' ? 'border-emerald-800 text-emerald-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i class="fa-solid fa-clock-rotate-left text-emerald-700"></i>
              <span>Payment & Submission Log</span>
            </button>
            <button type="button" onclick="CoeStudentView.switchTab('clearance')" class="pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${this.activeTab === 'clearance' ? 'border-emerald-800 text-emerald-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i class="fa-solid fa-certificate text-emerald-700"></i>
              <span>Official Academic Clearance Card</span>
            </button>
          </div>

          <!-- WORKSTATION TABLE CARD -->
          <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.04)] space-y-5">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <h3 class="text-xl font-black font-brand text-slate-900 tracking-tight">
                    ${this.activeTab === 'assessments' ? 'Prescribed Department Fees & Assessment Obligations' :
                      this.activeTab === 'history' ? 'Verified GCash Receipts & Payment Transactions' :
                      'Departmental Academic Clearance Certificate'}
                  </h3>
                </div>
                <p class="text-xs text-slate-500 font-medium">
                  ${this.activeTab === 'assessments' ? 'Review assigned contributions, payment deadlines, and submit your GCash transaction proofs.' :
                    this.activeTab === 'history' ? 'View status of your submitted payment proofs and download official electronic receipts.' :
                    'Instant clearance validation pass signed digitally by program head Engr. Ivanlee Mendoza.'}
                </p>
              </div>
            </div>

            <!-- TABLE CONTENT -->
            <div class="overflow-x-auto rounded-2xl border border-stone-200 shadow-2xs bg-white">
              ${this.renderActiveTabContent(studentName, studentNo, program, section)}
            </div>

          </div>

        </div>
      </div>
    `;
  },

  renderActiveTabContent(studentName, studentNo, program, section) {
    if (this.activeTab === 'assessments') {
      return `
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-100/90 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 font-mono">
              <th class="py-3.5 px-4">ITEM CODE</th>
              <th class="py-3.5 px-4">CONTRIBUTION TITLE</th>
              <th class="py-3.5 px-4">CATEGORY</th>
              <th class="py-3.5 px-4">AMOUNT</th>
              <th class="py-3.5 px-4">DEADLINE</th>
              <th class="py-3.5 px-4">STATUS</th>
              <th class="py-3.5 px-4 text-right">PAYMENT ACTION</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium text-slate-800">
            <tr class="hover:bg-emerald-50/40 transition">
              <td class="py-4 px-4 font-mono font-bold text-slate-900"><span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">COE-2026-01</span></td>
              <td class="py-4 px-4">
                <div class="font-bold text-slate-900 text-sm">Departmental Shirt (Batch 2026)</div>
                <div class="text-[11px] text-slate-500">Official engineering uniform polo & batch shirt</div>
              </td>
              <td class="py-4 px-4"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">Merchandise</span></td>
              <td class="py-4 px-4 font-black text-emerald-800 font-mono text-sm">₱450.00</td>
              <td class="py-4 px-4 font-mono text-[11px] text-slate-600">Nov 15, 2026</td>
              <td class="py-4 px-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <button type="button" onclick="CoeStudentView.openGcashSubmitModal('Departmental Shirt (Batch 2026)', '450.00')" 
                        class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 text-amber-200 font-bold text-xs shadow-2xs transition flex items-center gap-1.5 ml-auto cursor-pointer">
                  <i class="fa-solid fa-wallet text-[11px]"></i>
                  <span>Pay via GCash</span>
                </button>
              </td>
            </tr>
            <tr class="hover:bg-emerald-50/40 transition">
              <td class="py-4 px-4 font-mono font-bold text-slate-900"><span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">COE-2026-02</span></td>
              <td class="py-4 px-4">
                <div class="font-bold text-slate-900 text-sm">General Academic Clearance Fee</div>
                <div class="text-[11px] text-slate-500">Evaluation and documentation processing fee</div>
              </td>
              <td class="py-4 px-4"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 font-mono">Clearance</span></td>
              <td class="py-4 px-4 font-black text-emerald-800 font-mono text-sm">₱150.00</td>
              <td class="py-4 px-4 font-mono text-[11px] text-slate-600">Dec 01, 2026</td>
              <td class="py-4 px-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Cleared
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <button type="button" onclick="CoeStudentView.openReceiptModal('General Academic Clearance Fee', '150.00', '9028129481023')" 
                        class="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs transition flex items-center gap-1.5 ml-auto cursor-pointer">
                  <i class="fa-solid fa-file-invoice text-[11px] text-emerald-700"></i>
                  <span>View E-Receipt</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      `;
    } else if (this.activeTab === 'history') {
      return `
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-100/90 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 font-mono">
              <th class="py-3.5 px-4">TRANSACTION REF</th>
              <th class="py-3.5 px-4">ITEM DESCRIPTION</th>
              <th class="py-3.5 px-4">AMOUNT PAID</th>
              <th class="py-3.5 px-4">SUBMITTED DATE</th>
              <th class="py-3.5 px-4">AUDIT DECISION</th>
              <th class="py-3.5 px-4 text-right">E-RECEIPT</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium text-slate-800 font-mono text-[11px]">
            <tr class="hover:bg-emerald-50/40 transition">
              <td class="py-4 px-4 font-bold text-slate-900">GCASH-9028129481023</td>
              <td class="py-4 px-4 font-sans font-bold text-slate-800">General Academic Clearance Fee</td>
              <td class="py-4 px-4 font-black text-emerald-800 text-sm">₱150.00</td>
              <td class="py-4 px-4 text-slate-500">Oct 28, 2026 14:15</td>
              <td class="py-4 px-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Verified & Settled
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <button type="button" onclick="CoeStudentView.openReceiptModal('General Academic Clearance Fee', '150.00', '9028129481023')" class="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-sans font-bold text-xs shadow-2xs transition ml-auto flex items-center gap-1.5 cursor-pointer">
                  <i class="fa-solid fa-download text-emerald-700"></i> Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      `;
    } else {
      return `
        <div class="p-8 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-2xl mx-auto shadow-sm">
            <i class="fa-solid fa-certificate"></i>
          </div>
          <div>
            <h4 class="text-lg font-black font-brand text-slate-900">Official Department Clearance Certificate</h4>
            <p class="text-xs text-slate-500 max-w-md mx-auto mt-1">Validated electronic clearance slip for midterms and final examination admission.</p>
          </div>
          <button type="button" onclick="CoeStudentView.openClearancePassModal('${studentName}', '${studentNo}', '${program}', '${section}')" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 text-amber-200 font-bold text-xs shadow-md cursor-pointer flex items-center gap-2 mx-auto">
            <i class="fa-solid fa-qrcode text-xs"></i>
            <span>Generate & View Clearance Pass</span>
          </button>
        </div>
      `;
    }
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    this.render();
  },

  // ==========================================
  // WORKING CLEARANCE PASS MODAL
  // ==========================================
  openClearancePassModal(studentName, studentNo, program, section) {
    this.closeModal();

    const titleHtml = `<i class="fa-solid fa-certificate text-amber-300 mr-2"></i><span>Official Examination Clearance Pass</span>`;

    const bodyHtml = `
      <div class="space-y-4 text-xs font-sans">
        
        <!-- Institutional Header Certificate Card -->
        <div class="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg border border-emerald-500/30">
          <div class="absolute -right-6 -bottom-6 text-white/5 text-8xl pointer-events-none select-none">
            <i class="fa-solid fa-shield-halved"></i>
          </div>

          <div class="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div>
              <div class="text-[10px] font-mono tracking-widest text-emerald-300 font-bold uppercase">ICCT COLLEGES FOUNDATION, INC.</div>
              <h3 class="font-brand font-black text-base text-white mt-0.5">COLLEGE OF ENGINEERING</h3>
              <p class="text-[10px] text-slate-300 font-mono">Academic Year 2026-2027 • 1st Semester</p>
            </div>
            <span class="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              OFFICIAL PASS
            </span>
          </div>

          <div class="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            <!-- Left Info Details -->
            <div class="sm:col-span-8 space-y-2 text-xs">
              <div>
                <span class="text-[10px] text-emerald-200/70 font-mono uppercase block">STUDENT CANDIDATE</span>
                <span class="font-bold text-white text-sm">${studentName}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div>
                  <span class="text-[10px] text-emerald-200/70 uppercase block">STUDENT NO.</span>
                  <span class="text-white font-bold">${studentNo}</span>
                </div>
                <div>
                  <span class="text-[10px] text-emerald-200/70 uppercase block">YEAR & SEC</span>
                  <span class="text-white font-bold">${section}</span>
                </div>
              </div>
              <div>
                <span class="text-[10px] text-emerald-200/70 font-mono uppercase block">PROGRAM</span>
                <span class="text-white font-semibold">${program}</span>
              </div>
            </div>

            <!-- Right QR Simulation Badge -->
            <div class="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-center">
              <i class="fa-solid fa-qrcode text-4xl text-amber-300 mb-1"></i>
              <span class="text-[9px] font-mono text-emerald-200 tracking-wider">SECURE HASH</span>
              <span class="text-[8px] font-mono text-slate-300">#COE-2026-CLR</span>
            </div>

          </div>

          <!-- Bottom Signature Notice -->
          <div class="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300">
            <span>Verified: <strong class="text-emerald-300">Engr. Ivanlee Mendoza</strong> (Head)</span>
            <span class="text-amber-300 font-bold"><i class="fa-solid fa-circle-check"></i> ADMITTED TO EXAMS</span>
          </div>
        </div>

        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 text-xs flex items-center gap-2">
          <i class="fa-solid fa-circle-check text-emerald-700"></i>
          <span>Present this electronic clearance pass to the examination proctor alongside your official student ID.</span>
        </div>

      </div>
    `;

    const footerHtml = `
      <div class="flex items-center justify-between w-full gap-2">
        <button type="button" onclick="CoeStudentView.closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer">
          Close Pass
        </button>
        <button type="button" onclick="window.print()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-print text-xs"></i>
          <span>Print / Save PDF</span>
        </button>
      </div>
    `;

    this.injectModal(titleHtml, bodyHtml, footerHtml);
  },

  // ==========================================
  // GCASH PAYMENT SUBMISSION MODAL
  // ==========================================
  openGcashSubmitModal(itemTitle = 'Departmental Shirt (Batch 2026)', amount = '450.00') {
    this.closeModal();

    const titleHtml = `<i class="fa-solid fa-wallet text-amber-300 mr-2"></i><span>GCash Payment Proof Submission</span>`;

    const bodyHtml = `
      <div class="space-y-4 text-xs font-sans">
        
        <div class="bg-gradient-to-r from-blue-600 to-sky-600 text-white p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white text-blue-600 font-black text-xl flex items-center justify-center shadow-xs">
              G
            </div>
            <div>
              <div class="text-[10px] uppercase font-bold tracking-wider text-blue-100 font-mono">OFFICIAL GCASH MERCHANT</div>
              <div class="text-sm font-extrabold font-brand">ICCT COE TREASURY</div>
              <div class="text-xs font-mono text-blue-100">0917-888-2026 (Pearl C.)</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-blue-100 font-mono">Amount to Pay</div>
            <div class="text-lg font-black font-mono">₱${amount}</div>
          </div>
        </div>

        <form id="student-gcash-form" onsubmit="event.preventDefault(); CoeStudentView.submitPaymentProof();" class="space-y-3.5">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">Assessment Item</label>
            <input type="text" value="${itemTitle}" disabled 
                   class="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">13-Digit GCash Reference Number *</label>
            <input type="text" id="gcash-ref-input" placeholder="e.g. 9028129481023" required maxlength="13"
                   class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white transition">
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">Attach Screenshot / Receipt Photo *</label>
            <div class="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-600 transition cursor-pointer bg-slate-50/50" onclick="alert('Choose receipt image from your phone/desktop.')">
              <i class="fa-solid fa-cloud-arrow-up text-2xl text-emerald-700 mb-1"></i>
              <div class="font-bold text-slate-800 text-xs">Tap to upload GCash confirmation screenshot</div>
              <div class="text-[10px] text-slate-400 font-mono">PNG, JPG, or PDF supported</div>
            </div>
          </div>
        </form>

      </div>
    `;

    const footerHtml = `
      <div class="flex items-center justify-between w-full gap-2">
        <button type="button" onclick="CoeStudentView.closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer">
          Cancel
        </button>
        <button type="button" onclick="CoeStudentView.submitPaymentProof()" 
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-paper-plane text-xs"></i>
          <span>Submit for Verification</span>
        </button>
      </div>
    `;

    this.injectModal(titleHtml, bodyHtml, footerHtml);
  },

  submitPaymentProof() {
    const ref = document.getElementById('gcash-ref-input')?.value?.trim();
    if (!ref) {
      alert("Please provide the 13-digit GCash Reference Number.");
      return;
    }
    alert(`Payment proof submitted with Reference No: ${ref}!\nIt is now dispatched to Officer Pearl Catequista for verification.`);
    this.closeModal();
    this.switchTab('history');
  },

  // ==========================================
  // VIEW E-RECEIPT MODAL
  // ==========================================
  openReceiptModal(title, amount, refNo) {
    this.closeModal();

    const titleHtml = `<i class="fa-solid fa-receipt text-amber-300 mr-2"></i><span>Official Electronic Receipt</span>`;

    const bodyHtml = `
      <div class="space-y-4 text-xs font-sans">
        <div class="text-center pb-2 border-b border-slate-200 space-y-0.5">
          <h4 class="font-black font-brand text-sm text-slate-900">ICCT COLLEGES FOUNDATION, INC.</h4>
          <p class="text-[10px] text-slate-500 font-mono uppercase">College of Engineering and Digital Technology</p>
          <div class="pt-1">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">OFFICIAL E-RECEIPT</span>
          </div>
        </div>

        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 font-mono text-[11px]">
          <div class="flex justify-between">
            <span class="text-slate-400">Receipt No:</span>
            <span class="font-bold text-slate-900">OR-2026-8819</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">GCash Ref:</span>
            <span class="font-bold text-slate-900">${refNo}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Particulars:</span>
            <span class="font-bold text-slate-800 font-sans">${title}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-slate-200">
            <span class="text-slate-400">Amount Paid:</span>
            <span class="font-black text-emerald-800 text-sm">₱${amount}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Issued By:</span>
            <span class="font-semibold text-slate-700">Treasury (Pearl Catequista)</span>
          </div>
        </div>

        <p class="text-[10px] text-center text-slate-400 font-mono">
          Digitally verified by COE-Pay Centralized Gateway Relational System.
        </p>
      </div>
    `;

    const footerHtml = `
      <div class="flex items-center justify-between w-full gap-2">
        <button type="button" onclick="CoeStudentView.closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer">
          Close
        </button>
        <button type="button" onclick="window.print()" class="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-print text-xs"></i>
          <span>Print Receipt</span>
        </button>
      </div>
    `;

    this.injectModal(titleHtml, bodyHtml, footerHtml);
  },

  injectModal(titleHtml, bodyHtml, footerHtml) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'student-injected-modal';
    modalDiv.className = 'fixed inset-0 z-[9999999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto';
    modalDiv.innerHTML = `
      <div class="bg-white rounded-3xl border border-white/90 shadow-[0_25px_70px_rgba(0,0,0,0.5)] overflow-hidden w-full max-w-xl mx-auto flex flex-col my-auto transition-all transform scale-100">
        <div class="px-7 py-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shadow-sm">
          <h3 class="font-brand font-black text-base flex items-center">${titleHtml}</h3>
          <button type="button" onclick="CoeStudentView.closeModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="p-7 overflow-y-auto max-h-[70vh] space-y-4">${bodyHtml}</div>
        <div class="px-7 py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-end gap-2.5">${footerHtml}</div>
      </div>
    `;

    document.body.appendChild(modalDiv);
  },

  closeModal() {
    const existing = document.getElementById('student-injected-modal');
    if (existing) existing.remove();
  }
};

window.CoeStudentView = CoeStudentView;