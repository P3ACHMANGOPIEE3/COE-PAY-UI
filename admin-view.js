/**
 * COE-Pay: Head Engineer & Academic Coordinator View Controller
 * Persona: Engr. Ivanlee Mendoza (Head Engineer & Program Coordinator)
 * UI Only: Standalone Direct Modal Injector (Zero Backend Dependency)
 */

const CoeAdminView = {
  activeTab: 'authorizations',

  render() {
    const container = document.getElementById('admin-view-container') || 
                      document.getElementById('main-app-container');
    if (!container) return;

    ['developer-view-container', 'personnel-view-container', 'student-view-container', 'login-view-container'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el !== container) el.innerHTML = '';
    });

    container.className = "w-full p-0 m-0 block relative z-10 pointer-events-auto";
    if (container.parentElement) {
      container.parentElement.style.maxWidth = "100%";
      container.parentElement.style.padding = "0";
      container.parentElement.style.margin = "0";
    }

    container.innerHTML = `
      <div class="relative min-h-[calc(100vh-80px)] w-full py-8 px-4 sm:px-8 lg:px-10 overflow-hidden" 
           style="background: linear-gradient(135deg, #eef5f1 0%, #f1f5f9 50%, #e2e8f0 100%);">
        
        <!-- RIGHT-SIDE ACCENT PHOTO BACKDROP -->
        <div class="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <div class="absolute -top-24 -left-24 w-[32rem] h-[32rem] bg-emerald-200/35 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-24 left-1/4 w-[30rem] h-[30rem] bg-amber-100/35 rounded-full blur-3xl"></div>

          <div class="absolute top-0 right-0 w-full sm:w-[50%] lg:w-[42%] h-full overflow-hidden opacity-30">
            <img src="js/assets/icct-building.png" 
                 alt="ICCT Building" 
                 class="w-full h-full object-cover object-left filter brightness-95 contrast-105"
                 onerror="if(!this.dataset.r1){this.dataset.r1=1;this.src='assets/icct-building.png';}else if(!this.dataset.r2){this.dataset.r2=1;this.src='js/assets/cainta-campus.jpeg';}">
            <div class="absolute inset-0 bg-gradient-to-r from-[#eef5f1] via-transparent to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-[#eef5f1]/60 via-transparent to-[#e2e8f0]/80"></div>
          </div>

          <svg class="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="admin-arch-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="4 4" />
                <circle cx="0" cy="0" r="1.5" fill="#0f766e" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#admin-arch-grid)" />
          </svg>
        </div>

        <!-- MAIN INTERACTIVE CONTENT -->
        <div class="relative z-10 w-full space-y-6 pointer-events-auto">

          <!-- EXECUTIVE TOP HEADER -->
          <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-1.5">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0f2e5a] text-white tracking-wide shadow-xs">
                <i class="fa-solid fa-user-tie"></i> HEAD ENGINEER / COORDINATOR CONSOLE
              </span>
              <h1 class="text-3xl sm:text-4xl font-black font-brand tracking-tight text-slate-900">Engr. Ivanlee Mendoza</h1>
              <p class="text-xs sm:text-sm font-medium text-slate-600">
                <strong class="text-slate-900">Head Engineer & Academic Program Coordinator</strong> • Responsibility: <strong class="text-emerald-800">Approve Requests & Add Students</strong> • Current Term: <span class="font-mono text-slate-800 font-bold">2026-2027 (1st Semester)</span>
              </p>
            </div>

            <!-- Action Toolbar Cluster -->
            <div class="flex items-center gap-2.5 flex-wrap flex-shrink-0">
              <button type="button" onclick="CoeAdminView.openModal('supabase')" class="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-sliders text-emerald-700"></i>
                <span>Supabase Setup</span>
              </button>
              <button type="button" onclick="CoeAdminView.openModal('outbox')" class="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-inbox text-amber-600"></i>
                <span>Outbox ( <strong class="text-emerald-800">9</strong> )</span>
              </button>
              <button type="button" onclick="CoeAdminView.openModal('bulk')" class="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-file-excel text-emerald-700"></i>
                <span>Bulk Upload Masterlist</span>
              </button>
              <button type="button" onclick="CoeAdminView.openModal('enroll')" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-user-plus text-xs"></i>
                <span>Enroll Student</span>
              </button>
            </div>
          </div>

          <!-- 4 STAT BOXES WITH AMBIENT GLOW -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-emerald-200/80 shadow-[0_4px_20px_rgba(16,185,129,0.08)] hover:shadow-[0_0_28px_rgba(16,185,129,0.25)] hover:border-emerald-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg shadow-2xs group-hover:scale-105 transition-transform">
                  ₱
                </div>
                <button type="button" onclick="CoeAdminView.openModal('inspect_collections')" class="text-xs font-mono font-bold text-slate-400 hover:text-emerald-700 flex items-center gap-1 transition cursor-pointer">
                  Inspect <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </button>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">TOTAL VERIFIED COLLECTIONS</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">₱7,350.00</div>
              <div class="text-xs text-emerald-700 font-medium flex items-center gap-1.5 mt-2">
                <i class="fa-solid fa-arrow-trend-up"></i> Collected via GCash Gateway
              </div>
            </div>

            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-amber-200/80 shadow-[0_4px_20px_rgba(245,158,11,0.08)] hover:shadow-[0_0_28px_rgba(245,158,11,0.25)] hover:border-amber-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-chart-pie"></i>
                </div>
                <button type="button" onclick="CoeAdminView.openModal('inspect_compliance')" class="text-xs font-mono font-bold text-slate-400 hover:text-amber-700 flex items-center gap-1 transition cursor-pointer">
                  Inspect <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </button>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">COLLECTION COMPLIANCE RATE</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">44%</div>
              <div class="text-xs text-slate-500 font-medium mt-2">
                Target: <span class="font-mono font-bold text-slate-800">₱16,800.00</span>
              </div>
            </div>

            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-rose-200/80 shadow-[0_4px_20px_rgba(244,63,94,0.08)] hover:shadow-[0_0_28px_rgba(244,63,94,0.28)] hover:border-rose-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-user-clock"></i>
                </div>
                <button type="button" onclick="CoeAdminView.openModal('review_req', 'REQ-2026-001')" class="text-xs font-mono font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 transition cursor-pointer">
                  Review (1) <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </button>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">PENDING AUTHORIZATIONS</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">1</div>
              <div class="text-xs text-rose-700 font-semibold mt-2 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Requires Dean Decision
              </div>
            </div>

            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-teal-200/80 shadow-[0_4px_20px_rgba(20,184,166,0.08)] hover:shadow-[0_0_28px_rgba(20,184,166,0.25)] hover:border-teal-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-id-card-clip"></i>
                </div>
                <button type="button" onclick="CoeAdminView.openModal('inspect_students')" class="text-xs font-mono font-bold text-slate-400 hover:text-teal-700 flex items-center gap-1 transition cursor-pointer">
                  Inspect <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </button>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">ACTIVE COE STUDENTS</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">5</div>
              <div class="text-xs text-slate-500 font-medium mt-2">
                Across 5 Program Cohorts
              </div>
            </div>

          </div>

          <!-- TAB CONTROLLER -->
          <div class="flex items-center gap-2 sm:gap-6 border-b border-stone-200/80 text-xs font-bold font-mono overflow-x-auto pb-1">
            <button type="button" onclick="CoeAdminView.switchTab('authorizations')" class="pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${this.activeTab === 'authorizations' ? 'border-emerald-800 text-emerald-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i class="fa-solid fa-clipboard-check text-emerald-700"></i>
              <span>Payment Authorizations (1)</span>
            </button>
            <button type="button" onclick="CoeAdminView.switchTab('roster')" class="pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${this.activeTab === 'roster' ? 'border-emerald-800 text-emerald-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i class="fa-solid fa-graduation-cap text-emerald-700"></i>
              <span>Student Roster & Clearances</span>
            </button>
            <button type="button" onclick="CoeAdminView.switchTab('categories')" class="pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${this.activeTab === 'categories' ? 'border-emerald-800 text-emerald-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i class="fa-solid fa-tags text-emerald-700"></i>
              <span>Payment Categories</span>
            </button>
            <button type="button" onclick="CoeAdminView.switchTab('audit')" class="pb-3 border-b-2 transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${this.activeTab === 'audit' ? 'border-emerald-800 text-emerald-950 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i class="fa-solid fa-shield-halved text-emerald-700"></i>
              <span>Security & Audit Trail</span>
            </button>
          </div>

          <!-- WORKSTATION TABLE CARD -->
          <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.04)] space-y-5">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <h3 class="text-xl font-black font-brand text-slate-900 tracking-tight">
                    ${this.activeTab === 'authorizations' ? 'Payment Requests Authorization Queue' :
                      this.activeTab === 'roster' ? 'COE Student Master Roster & Clearance Status' :
                      this.activeTab === 'categories' ? 'Department Fee & Collection Categories' :
                      'Immutable Security Ledger & Operational Audit Logs'}
                  </h3>
                </div>
                <p class="text-xs text-slate-500 font-medium">
                  Review, approve, or inspect records in real-time.
                </p>
              </div>

              ${this.activeTab === 'authorizations' ? `
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">FILTER:</span>
                  <select class="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-mono font-bold text-slate-700 focus:outline-none focus:border-emerald-600 shadow-2xs">
                    <option>Pending Authorization (1)</option>
                    <option>Approved Requests</option>
                  </select>
                </div>
              ` : ''}
            </div>

            <!-- TABLE VIEW -->
            <div class="overflow-x-auto rounded-2xl border border-stone-200 shadow-2xs bg-white">
              ${this.renderActiveTable()}
            </div>

          </div>

        </div>
      </div>
    `;
  },

  renderActiveTable() {
    if (this.activeTab === 'authorizations') {
      return `
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-100/90 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 font-mono">
              <th class="py-3.5 px-4">REF #</th>
              <th class="py-3.5 px-4">PURPOSE / TITLE</th>
              <th class="py-3.5 px-4">CATEGORY</th>
              <th class="py-3.5 px-4">AMOUNT</th>
              <th class="py-3.5 px-4">DEADLINE</th>
              <th class="py-3.5 px-4">TARGET COHORT</th>
              <th class="py-3.5 px-4">SUBMITTED BY</th>
              <th class="py-3.5 px-4">STATUS</th>
              <th class="py-3.5 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium text-slate-800">
            <tr class="bg-white hover:bg-emerald-50/40 transition">
              <td class="py-4 px-4 font-mono font-bold text-slate-900"><span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">REQ-2026-001</span></td>
              <td class="py-4 px-4">
                <div class="font-bold text-slate-900 text-sm">Departmental Shirt (Batch 2026)</div>
                <div class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Official department engineering uniform polo and batch shirt collection...</div>
              </td>
              <td class="py-4 px-4"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">Merchandise</span></td>
              <td class="py-4 px-4 font-black text-emerald-800 font-mono text-sm">₱450.00</td>
              <td class="py-4 px-4 font-mono text-[11px] text-slate-600">Nov 15, 2026</td>
              <td class="py-4 px-4 text-[11px] font-semibold text-slate-700">BSCpE & BSCS</td>
              <td class="py-4 px-4 text-[11px] font-mono text-slate-500">Pearl Catequista (Officer)</td>
              <td class="py-4 px-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span> Pending
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <button type="button" onclick="CoeAdminView.openModal('review_req', 'REQ-2026-001')" 
                        class="px-3.5 py-1.5 rounded-xl border border-emerald-600/40 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 font-bold text-xs shadow-2xs transition flex items-center gap-1.5 ml-auto cursor-pointer">
                  <i class="fa-solid fa-eye text-[11px]"></i>
                  <span>View Details</span>
                </button>
              </td>
            </tr>
            <tr class="bg-slate-50/40 hover:bg-emerald-50/40 transition">
              <td class="py-4 px-4 font-mono font-bold text-slate-900"><span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">REQ-2026-002</span></td>
              <td class="py-4 px-4">
                <div class="font-bold text-slate-900 text-sm">General Academic Clearance Fee</div>
                <div class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Institutional clearance evaluation and student documentation processing fee.</div>
              </td>
              <td class="py-4 px-4"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 font-mono">Clearance</span></td>
              <td class="py-4 px-4 font-black text-emerald-800 font-mono text-sm">₱150.00</td>
              <td class="py-4 px-4 font-mono text-[11px] text-slate-600">Dec 01, 2026</td>
              <td class="py-4 px-4 text-[11px] font-semibold text-slate-700">All Graduating Cohorts</td>
              <td class="py-4 px-4 text-[11px] font-mono text-slate-500">Faculty Board</td>
              <td class="py-4 px-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Approved
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <button type="button" onclick="CoeAdminView.openModal('review_req', 'REQ-2026-002')" 
                        class="px-3.5 py-1.5 rounded-xl border border-emerald-600/40 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 font-bold text-xs shadow-2xs transition flex items-center gap-1.5 ml-auto cursor-pointer">
                  <i class="fa-solid fa-eye text-[11px]"></i>
                  <span>View Details</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      `;
    } else if (this.activeTab === 'roster') {
      const rosterList = [
        { no: '2023-10001', name: 'Christian Dave Guiyab', prog: 'BSCpE', sec: '4A', status: 'Cleared' },
        { no: '2023-10004', name: 'Jerome Opana', prog: 'BSCpE', sec: '4A', status: 'Pending' },
        { no: '2023-10012', name: 'Maria Santos', prog: 'BSCS', sec: '3B', status: 'Cleared' },
        { no: '2023-10025', name: 'John Michael Reyes', prog: 'BSIT', sec: '2A', status: 'Cleared' },
        { no: '2023-10033', name: 'Alyssa Valdez', prog: 'BSCpE', sec: '1C', status: 'Cleared' }
      ];

      return `
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-100/90 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 font-mono">
              <th class="py-3.5 px-4">STUDENT NUMBER</th>
              <th class="py-3.5 px-4">STUDENT PROFILE</th>
              <th class="py-3.5 px-4">PROGRAM</th>
              <th class="py-3.5 px-4">YEAR & SECTION</th>
              <th class="py-3.5 px-4">CLEARANCE STATUS</th>
              <th class="py-3.5 px-4 text-right">STUDENT ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium text-slate-800 font-mono">
            ${rosterList.map((s, idx) => `
              <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-emerald-50/40 transition">
                <td class="py-4 px-4 font-bold text-slate-900">
                  <span class="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono">${s.no}</span>
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700 to-teal-800 text-white font-bold flex items-center justify-center font-sans text-xs flex-shrink-0 shadow-2xs">
                      ${s.name.charAt(0)}
                    </div>
                    <div>
                      <div class="font-sans font-extrabold text-slate-900 text-xs">${s.name}</div>
                      <div class="text-[10px] text-slate-400">Regular Student</div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4 font-bold text-slate-700">${s.prog}</td>
                <td class="py-4 px-4 font-semibold text-slate-600">${s.sec}</td>
                <td class="py-4 px-4">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${s.status === 'Cleared' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}">
                    <span class="w-1.5 h-1.5 rounded-full ${s.status === 'Cleared' ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'}"></span>
                    ${s.status}
                  </span>
                </td>
                <td class="py-4 px-4 text-right">
                  <button type="button" onclick="CoeAdminView.openModal('student_detail', '${s.no}')" 
                          class="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-sans font-bold shadow-2xs transition ml-auto flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-id-card text-[11px]"></i>
                    <span>Inspect Clearance</span>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      return `<div class="p-10 text-center text-slate-400 font-mono text-xs">Section synchronized with database schema. All entries active.</div>`;
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  // ==========================================
  // DIRECT INJECTION MODAL ENGINE (100% RELIABLE)
  // ==========================================
  openModal(type, id = null) {
    this.closeModal(); // Linisin ang anumang existing modal

    let titleHtml = "";
    let bodyHtml = "";
    let footerHtml = "";

    if (type === 'review_req') {
      const isReq1 = (id === 'REQ-2026-001' || !id);
      const refNo = isReq1 ? 'REQ-2026-001' : 'REQ-2026-002';
      const itemTitle = isReq1 ? 'Departmental Shirt (Batch 2026)' : 'General Academic Clearance Fee';
      const amount = isReq1 ? '450.00' : '150.00';
      const submitter = isReq1 ? 'Pearl Catequista (Officer)' : 'Faculty Board';
      const cohort = isReq1 ? 'BSCpE & BSCS' : 'All Graduating Cohorts';
      const desc = isReq1 ? 'Official department engineering uniform polo and batch shirt collection for academic year 2026-2027.' : 'Institutional clearance evaluation and student documentation processing fee.';

      titleHtml = `<i class="fa-solid fa-file-signature text-amber-300 mr-2"></i><span>Payment Authorization Review</span>`;
      bodyHtml = `
        <div class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <span class="text-[10px] font-bold text-slate-400 font-mono block">REFERENCE CODE</span>
              <span class="font-bold text-slate-900 font-mono text-xs">${refNo}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 font-mono block">ASSESSMENT AMOUNT</span>
              <span class="font-black text-emerald-800 font-mono text-base">₱${amount}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 font-mono block">SUBMITTED BY</span>
              <span class="text-slate-800 font-semibold">${submitter}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 font-mono block">TARGET COHORT</span>
              <span class="text-slate-800 font-semibold">${cohort}</span>
            </div>
            <div class="col-span-2 pt-2 border-t border-slate-200">
              <span class="text-[10px] font-bold text-slate-400 font-mono block">TITLE / PURPOSE</span>
              <span class="font-bold text-slate-900 text-sm">${itemTitle}</span>
            </div>
            <div class="col-span-2">
              <span class="text-[10px] font-bold text-slate-400 font-mono block">DESCRIPTION</span>
              <p class="text-slate-600 leading-relaxed text-xs mt-0.5">${desc}</p>
            </div>
          </div>
          <div class="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation text-amber-700"></i>
            <span>Approving this request will publish the requirement to all eligible students.</span>
          </div>
        </div>
      `;
      footerHtml = `
        <button type="button" onclick="CoeAdminView.closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer">Close</button>
        <button type="button" onclick="alert('Proposal approved!'); CoeAdminView.closeModal();" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 text-amber-200 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-check text-xs"></i><span>Approve & Publish</span>
        </button>
      `;
    } 
    else if (type === 'student_detail') {
      const studentNo = id || '2023-10001';
      titleHtml = `<i class="fa-solid fa-id-card text-amber-300 mr-2"></i><span>Student Clearance Dossier</span>`;
      bodyHtml = `
        <div class="space-y-4 text-xs">
          <div class="flex items-center gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div class="w-12 h-12 rounded-2xl bg-emerald-800 text-white font-black text-lg flex items-center justify-center shadow-xs">
              ${studentNo.charAt(studentNo.length - 1)}
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Enrolled Engineering Student</h4>
              <p class="font-mono text-slate-500 text-xs">${studentNo} • BSCpE (Year 4A)</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3.5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200 font-mono">
            <div>
              <span class="text-[10px] font-bold text-slate-400 block">ENROLLMENT STATUS</span>
              <span class="font-bold text-slate-800">Officially Enrolled</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 block">CLEARANCE STATUS</span>
              <span class="font-bold text-emerald-700">Verified & Cleared</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 block">GCASH VERIFIED PROOFS</span>
              <span class="text-slate-800">1 Matched (Ref: 902812)</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 block">OUTSTANDING BALANCE</span>
              <span class="text-slate-800 font-bold">₱0.00</span>
            </div>
          </div>

          <div class="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-emerald-700"></i>
            <span>Student holds active academic standing and is cleared for semester completion.</span>
          </div>
        </div>
      `;
      footerHtml = `
        <button type="button" onclick="CoeAdminView.closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">Close Dossier</button>
      `;
    }
    else if (type === 'enroll') {
      titleHtml = `<i class="fa-solid fa-user-plus text-amber-300 mr-2"></i><span>Enroll Student into Masterlist</span>`;
      bodyHtml = `
        <div class="space-y-4 text-xs">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">Student Number *</label>
            <input type="text" placeholder="e.g. 2026-10099" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white transition">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">Full Name *</label>
            <input type="text" placeholder="Lastname, Firstname M." class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white transition">
          </div>
          <div class="grid grid-cols-2 gap-3.5">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">Program *</label>
              <select class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900">
                <option>BS Computer Engineering</option>
                <option>BS Computer Science</option>
                <option>BS Information Technology</option>
                <option>BS Electrical Engineering</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">Section *</label>
              <input type="text" placeholder="e.g. 4A" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900">
            </div>
          </div>
        </div>
      `;
      footerHtml = `
        <button type="button" onclick="CoeAdminView.closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer">Cancel</button>
        <button type="button" onclick="alert('Student saved to masterlist!'); CoeAdminView.closeModal();" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 text-amber-200 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-save text-xs"></i><span>Save to Masterlist</span>
        </button>
      `;
    }
    else if (type === 'bulk') {
      titleHtml = `<i class="fa-solid fa-file-excel text-amber-300 mr-2"></i><span>Bulk Upload Masterlist Ingestion</span>`;
      bodyHtml = `
        <div class="space-y-4 text-xs">
          <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <div class="font-bold text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-cloud-arrow-up text-emerald-800"></i>
              <span>Batch Roster File Ingestion</span>
            </div>
            <p class="text-slate-600 text-xs">Upload your CSV or Excel masterlist to ingest enrolled students automatically.</p>
          </div>
          <div class="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-600 transition cursor-pointer bg-slate-50" onclick="alert('Select file (.csv, .xlsx)')">
            <i class="fa-solid fa-file-circle-plus text-3xl text-emerald-700 mb-2"></i>
            <div class="font-bold text-slate-800 text-xs">Click to browse or drop masterlist file here</div>
            <div class="text-[11px] text-slate-400 mt-1 font-mono">Accepts .CSV, .XLSX</div>
          </div>
        </div>
      `;
      footerHtml = `
        <button type="button" onclick="CoeAdminView.closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer">Cancel</button>
        <button type="button" onclick="alert('Batch queued!'); CoeAdminView.closeModal();" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 text-amber-200 font-bold text-xs shadow-md cursor-pointer">Process Ingestion</button>
      `;
    }
    else {
      titleHtml = `<i class="fa-solid fa-sliders text-amber-300 mr-2"></i><span>Gateway Setup</span>`;
      bodyHtml = `
        <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div class="font-bold text-slate-900">Database Connection Active</div>
          <p class="text-slate-500 text-xs">PostgreSQL relational database schema initialized. All endpoints ready for backend connection.</p>
        </div>
      `;
      footerHtml = `
        <button type="button" onclick="CoeAdminView.closeModal()" class="px-5 py-2.5 rounded-xl bg-emerald-800 text-amber-200 font-bold text-xs cursor-pointer">Acknowledge</button>
      `;
    }

    // Direct DOM Injection sa Body para walang anumang sagabal
    const modalDiv = document.createElement('div');
    modalDiv.id = 'direct-injected-modal';
    modalDiv.className = 'fixed inset-0 z-[9999999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto';
    modalDiv.innerHTML = `
      <div class="bg-white rounded-3xl border border-white/90 shadow-[0_25px_70px_rgba(0,0,0,0.5)] overflow-hidden w-full max-w-xl mx-auto flex flex-col my-auto transition-all transform scale-100">
        <div class="px-7 py-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shadow-sm">
          <h3 class="font-brand font-black text-base flex items-center">${titleHtml}</h3>
          <button type="button" onclick="CoeAdminView.closeModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition cursor-pointer">
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
    const existing = document.getElementById('direct-injected-modal');
    if (existing) existing.remove();
  }
};

window.CoeAdminView = CoeAdminView;