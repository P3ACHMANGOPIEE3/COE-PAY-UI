/**
 * COE-Pay: Collection Officer & Personnel View Controller
 * Persona: Pearl Catequista (Collection Officer / Treasury Personnel)
 * Features: View GCash Receipt Audit, Personnel Audit Notes, Approve & Decline Decisions
 */

const CoePersonnelView = {
  activeTab: 'pending',

  render() {
    const container = document.getElementById('personnel-view-container') || 
                      document.getElementById('main-app-container');
    if (!container) return;

    ['developer-view-container', 'admin-view-container', 'student-view-container', 'login-view-container'].forEach(id => {
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
    const userProfile = (auth.getProfile && auth.getProfile()) || {};
    
    const fullName = userProfile.full_name || 'Engr. Pearl Catequista';
    const designation = userProfile.designation || 'Collection Officer / Treasury Personnel';
    const responsibility = userProfile.responsibility || 'Verifying student GCash payment proofs and updating clearance statuses.';

    container.innerHTML = `
      <div class="relative min-h-[calc(100vh-80px)] w-full py-8 px-4 sm:px-8 lg:px-10 overflow-hidden" 
           style="background: linear-gradient(135deg, #eef5f1 0%, #f1f5f9 50%, #e2e8f0 100%);">
        
        <!-- RIGHT-SIDE ACCENT PHOTO BACKDROP: TREASURY-LEDGER.JPEG -->
        <div class="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <div class="absolute -top-24 -left-24 w-[32rem] h-[32rem] bg-emerald-200/35 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-24 left-1/4 w-[30rem] h-[30rem] bg-amber-100/35 rounded-full blur-3xl"></div>

          <div class="absolute top-0 right-0 w-full sm:w-[50%] lg:w-[42%] h-full overflow-hidden opacity-30">
            <img src="js/assets/treasury-ledger.jpeg" 
                 alt="Treasury Ledger" 
                 class="w-full h-full object-cover object-left filter brightness-95 contrast-105"
                 onerror="if(!this.dataset.r1){this.dataset.r1=1;this.src='assets/treasury-ledger.jpeg';}else if(!this.dataset.r2){this.dataset.r2=1;this.src='js/assets/cainta-campus.jpeg';}">
            <div class="absolute inset-0 bg-gradient-to-r from-[#eef5f1] via-transparent to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-[#eef5f1]/60 via-transparent to-[#e2e8f0]/80"></div>
          </div>

          <svg class="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="personnel-arch-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="4 4" />
                <circle cx="0" cy="0" r="1.5" fill="#0f766e" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#personnel-arch-grid)" />
          </svg>
        </div>

        <!-- MAIN INTERACTIVE CONTENT -->
        <div class="relative z-10 w-full space-y-6 pointer-events-auto">

          <!-- EXECUTIVE TOP HEADER -->
          <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-1.5">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0f2e5a] text-white tracking-wide shadow-xs">
                <i class="fa-solid fa-clipboard-user"></i> TREASURY & COLLECTION VERIFICATION DESK
              </span>
              <h1 class="text-3xl sm:text-4xl font-black font-brand tracking-tight text-slate-900">${fullName}</h1>
              <p class="text-xs sm:text-sm font-medium text-slate-600">
                <strong class="text-slate-900">${designation}</strong> • Responsibility: <strong class="text-emerald-800">${responsibility}</strong>
              </p>
            </div>

            <div class="flex items-center gap-2.5 flex-wrap flex-shrink-0">
              <button type="button" onclick="CoePersonnelView.openModal('receipt')" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-plus text-xs"></i>
                <span>Direct Cash Receipt</span>
              </button>
              <button type="button" onclick="CoePersonnelView.openModal('outbox')" class="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-inbox text-amber-600"></i>
                <span>Outbox Dispatch</span>
              </button>
            </div>
          </div>

          <!-- 4 STAT BOXES WITH AMBIENT GLOW -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-amber-200/80 shadow-[0_4px_20px_rgba(245,158,11,0.08)] hover:shadow-[0_0_28px_rgba(245,158,11,0.25)] hover:border-amber-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-clock"></i>
                </div>
                <button type="button" onclick="CoePersonnelView.switchTab('pending')" class="text-xs font-mono font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition cursor-pointer">
                  Review (2) <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </button>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">PENDING PROOF AUDIT</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">2 Requests</div>
              <div class="text-xs text-amber-700 font-medium flex items-center gap-1.5 mt-2">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Awaiting GCash validation
              </div>
            </div>

            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-emerald-200/80 shadow-[0_4px_20px_rgba(16,185,129,0.08)] hover:shadow-[0_0_28px_rgba(16,185,129,0.25)] hover:border-emerald-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
                <button type="button" onclick="CoePersonnelView.switchTab('cleared')" class="text-xs font-mono font-bold text-slate-400 hover:text-emerald-700 flex items-center gap-1 transition cursor-pointer">
                  Archive <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </button>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">VERIFIED CLEARED</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">2 Settled</div>
              <div class="text-xs text-emerald-700 font-semibold mt-2">
                Ready for Dean Sign-off
              </div>
            </div>

            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-emerald-200/80 shadow-[0_4px_20px_rgba(16,185,129,0.08)] hover:shadow-[0_0_28px_rgba(16,185,129,0.25)] hover:border-emerald-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-sack-dollar"></i>
                </div>
                <span class="text-xs font-mono font-bold text-slate-400">Ledger</span>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">TOTAL FUNDS COLLECTED</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">₱750.00</div>
              <div class="text-xs text-slate-500 font-medium mt-2">
                Department Bank Acct
              </div>
            </div>

            <div class="relative group bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-rose-200/80 shadow-[0_4px_20px_rgba(244,63,94,0.08)] hover:shadow-[0_0_28px_rgba(244,63,94,0.28)] hover:border-rose-400 transition-all duration-300">
              <div class="flex items-center justify-between pb-3">
                <div class="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-hand-holding-dollar"></i>
                </div>
                <span class="text-xs font-mono font-bold text-slate-400">Target</span>
              </div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">UNCOLLECTED BALANCE</div>
              <div class="text-2xl font-black font-brand text-slate-900 mt-0.5">₱600.00</div>
              <div class="text-xs text-rose-700 font-semibold mt-2">
                Pending Verification
              </div>
            </div>
          </div>

          <!-- BALANCED 2-COLUMN WORKSTATION -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            <!-- KALIWA: Policy Box -->
            <div class="lg:col-span-4 bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono">&lt;DISPATCH_DESK&gt;</span>
                    <h3 class="font-brand text-base font-extrabold text-stone-900">Officer Verification Policy</h3>
                  </div>
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>

                <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200 mt-4 space-y-2.5 text-xs">
                  <div class="font-bold text-stone-900 flex items-center gap-1.5">
                    <i class="fa-solid fa-shield-halved text-emerald-700"></i> Standard Audit Protocol:
                  </div>
                  <p class="text-stone-600 leading-relaxed text-xs">
                    1. Pindutin ang <strong>"View Receipt"</strong> upang suriin ang GCash Reference No. at student information.<br>
                    2. Maglagay ng <strong>Personnel Audit Notes</strong> kung may discrepancy o confirmation details.<br>
                    3. Piliin ang <strong>"Approve & Clear"</strong> o <strong>"Decline Submission"</strong>.
                  </p>
                </div>
              </div>

              <div class="pt-4 border-t border-stone-200 mt-6 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span>Verification Authority</span>
                <span class="text-emerald-800 font-bold"><i class="fa-solid fa-stamp"></i> Treasury Validated</span>
              </div>
            </div>

            <!-- KANAN: Verification Table Queue -->
            <div class="lg:col-span-8 bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div class="inline-flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 font-mono text-xs font-bold">
                    <button type="button" onclick="CoePersonnelView.switchTab('pending')" class="px-3.5 py-1.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${this.activeTab === 'pending' ? 'bg-emerald-800 text-amber-200 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'}">
                      <i class="fa-solid fa-inbox"></i>
                      <span>Pending Clearance Queue</span>
                      <span class="px-1.5 py-0.2 rounded-full ${this.activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'} text-[10px]">2</span>
                    </button>
                    <button type="button" onclick="CoePersonnelView.switchTab('cleared')" class="px-3.5 py-1.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${this.activeTab === 'cleared' ? 'bg-emerald-800 text-amber-200 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'}">
                      <i class="fa-solid fa-circle-check"></i>
                      <span>Settled Archive</span>
                      <span class="px-1.5 py-0.2 rounded-full ${this.activeTab === 'cleared' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'} text-[10px]">2</span>
                    </button>
                  </div>

                  <div class="text-xs text-stone-500 font-mono flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-dot text-emerald-600 text-[8px]"></i> Treasury Ledger Sync
                  </div>
                </div>

                <div class="overflow-x-auto rounded-2xl border border-stone-200 bg-white mt-3 shadow-2xs">
                  ${this.renderActiveTable()}
                </div>
              </div>

              <div class="pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span>Active Ledger: <strong class="text-stone-800">${this.activeTab === 'pending' ? 'Pending Review Queue' : 'Settled Archive'}</strong></span>
                <span>COE-Pay Collection Desk</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;
  },

  renderActiveTable() {
    if (this.activeTab === 'pending') {
      return `
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-100/90 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 font-mono">
              <th class="py-3 px-3.5">STUDENT NO.</th>
              <th class="py-3 px-3.5">REQUIREMENT</th>
              <th class="py-3 px-3.5">AMOUNT</th>
              <th class="py-3 px-3.5">STATUS</th>
              <th class="py-3 px-3.5 text-right">AUDIT ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium text-slate-800 font-mono text-[11px]">
            <tr class="hover:bg-emerald-50/40 transition">
              <td class="py-3.5 px-3.5 font-bold text-slate-900">
                <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">2023-10001</span>
              </td>
              <td class="py-3.5 px-3.5 font-sans">
                <div class="font-bold text-slate-900 text-xs">Departmental Shirt (Batch 2026)</div>
                <div class="text-[10px] text-slate-500">Student: Christian Dave Guiyab</div>
              </td>
              <td class="py-3.5 px-3.5 font-black text-emerald-800">₱450.00</td>
              <td class="py-3.5 px-3.5">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending
                </span>
              </td>
              <td class="py-3.5 px-3.5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button type="button" onclick="CoePersonnelView.openGcashProofModal('2023-10001', 'Christian Dave Guiyab', 'Departmental Shirt (Batch 2026)', '450.00', '9028129481023', 'Oct 29, 2026 14:22:10')" 
                          class="px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 font-bold text-[10px] shadow-2xs transition flex items-center gap-1 cursor-pointer">
                    <i class="fa-solid fa-receipt text-[10px]"></i>
                    <span>View Receipt</span>
                  </button>
                  <button type="button" onclick="CoePersonnelView.declineItem('2023-10001', 'Departmental Shirt')" 
                          class="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-bold text-[10px] shadow-2xs transition cursor-pointer">
                    Decline
                  </button>
                  <button type="button" onclick="CoePersonnelView.approveItem('2023-10001', 'Departmental Shirt')" 
                          class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 text-amber-200 font-bold text-[10px] shadow-2xs transition cursor-pointer">
                    Approve
                  </button>
                </div>
              </td>
            </tr>
            <tr class="hover:bg-emerald-50/40 transition">
              <td class="py-3.5 px-3.5 font-bold text-slate-900">
                <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">2023-10004</span>
              </td>
              <td class="py-3.5 px-3.5 font-sans">
                <div class="font-bold text-slate-900 text-xs">General Academic Clearance Fee</div>
                <div class="text-[10px] text-slate-500">Student: Jerome Opana</div>
              </td>
              <td class="py-3.5 px-3.5 font-black text-emerald-800">₱150.00</td>
              <td class="py-3.5 px-3.5">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending
                </span>
              </td>
              <td class="py-3.5 px-3.5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button type="button" onclick="CoePersonnelView.openGcashProofModal('2023-10004', 'Jerome Opana', 'General Academic Clearance Fee', '150.00', '8019381029481', 'Oct 30, 2026 09:14:05')" 
                          class="px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 font-bold text-[10px] shadow-2xs transition flex items-center gap-1 cursor-pointer">
                    <i class="fa-solid fa-receipt text-[10px]"></i>
                    <span>View Receipt</span>
                  </button>
                  <button type="button" onclick="CoePersonnelView.declineItem('2023-10004', 'Clearance Fee')" 
                          class="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-bold text-[10px] shadow-2xs transition cursor-pointer">
                    Decline
                  </button>
                  <button type="button" onclick="CoePersonnelView.approveItem('2023-10004', 'Clearance Fee')" 
                          class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 text-amber-200 font-bold text-[10px] shadow-2xs transition cursor-pointer">
                    Approve
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `;
    } else {
      return `
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-100/90 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 font-mono">
              <th class="py-3 px-3.5">STUDENT NO.</th>
              <th class="py-3 px-3.5">REQUIREMENT</th>
              <th class="py-3 px-3.5">AMOUNT</th>
              <th class="py-3 px-3.5">STATUS</th>
              <th class="py-3 px-3.5 text-right">AUDITED RECORD</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium text-slate-800 font-mono text-[11px]">
            <tr class="hover:bg-emerald-50/40 transition">
              <td class="py-3.5 px-3.5 font-bold text-slate-900">2023-10012</td>
              <td class="py-3.5 px-3.5 font-sans font-semibold text-slate-800">Departmental Shirt (Batch 2026)</td>
              <td class="py-3.5 px-3.5 font-bold text-emerald-800">₱450.00</td>
              <td class="py-3.5 px-3.5">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Cleared
                </span>
              </td>
              <td class="py-3.5 px-3.5 text-right">
                <button type="button" onclick="CoePersonnelView.openGcashProofModal('2023-10012', 'Maria Santos', 'Departmental Shirt (Batch 2026)', '450.00', '7028129481001', 'Oct 28, 2026 11:05:22', true)" 
                        class="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-sans font-semibold transition cursor-pointer">
                  Inspect Proof
                </button>
              </td>
            </tr>
            <tr class="hover:bg-emerald-50/40 transition">
              <td class="py-3.5 px-3.5 font-bold text-slate-900">2023-10025</td>
              <td class="py-3.5 px-3.5 font-sans font-semibold text-slate-800">Engineering Day Laboratory Fee</td>
              <td class="py-3.5 px-3.5 font-bold text-emerald-800">₱300.00</td>
              <td class="py-3.5 px-3.5">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Cleared
                </span>
              </td>
              <td class="py-3.5 px-3.5 text-right">
                <button type="button" onclick="CoePersonnelView.openGcashProofModal('2023-10025', 'John Michael Reyes', 'Engineering Day Laboratory Fee', '300.00', '6028129481099', 'Oct 28, 2026 16:40:12', true)" 
                        class="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-sans font-semibold transition cursor-pointer">
                  Inspect Proof
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    this.render();
  },

  approveItem(studentNo, item, notes = "") {
    const noteMsg = notes ? `\nNotes: "${notes}"` : "";
    alert(`Payment verification APPROVED for student ${studentNo} (${item})!${noteMsg}\nMarked as Cleared.`);
    this.switchTab('cleared');
  },

  declineItem(studentNo, item, notes = "") {
    const reason = notes || prompt("Enter reason for declining proof (e.g. Reference number not found in merchant bank):", "Unverified Reference Number");
    if (!reason) return;
    alert(`Payment verification DECLINED for student ${studentNo} (${item}).\nReason: "${reason}"\nDispatched notice to student.`);
    this.render();
  },

  // ==========================================
  // GCASH RECEIPT PROOF AUDIT MODAL (WITH NOTES & APPROVE/DECLINE)
  // ==========================================
  openGcashProofModal(studentNo, studentName, itemTitle, amount, refNo, timestamp, isSettled = false) {
    this.closeModal();

    const titleHtml = `<i class="fa-solid fa-receipt text-amber-300 mr-2"></i><span>GCash Electronic Payment Proof Audit</span>`;

    const bodyHtml = `
      <div class="space-y-4 text-xs font-sans">
        
        <!-- GCash Official Header Banner -->
        <div class="bg-gradient-to-r from-blue-600 to-sky-600 text-white p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white text-blue-600 font-black text-xl flex items-center justify-center shadow-xs">
              G
            </div>
            <div>
              <div class="text-[10px] uppercase font-bold tracking-wider text-blue-100 font-mono">GCASH EXPRESS SEND RECEIPT</div>
              <div class="text-base font-extrabold font-brand">COE Treasury Gateway</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-blue-100 font-mono">Total Paid</div>
            <div class="text-lg font-black font-mono">₱${amount}</div>
          </div>
        </div>

        <!-- Receipt Details Key-Value Table -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 font-mono text-[11px]">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <span class="text-slate-400 font-bold uppercase text-[10px]">13-DIGIT REFERENCE NO.</span>
            <span class="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">${refNo}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-slate-500">Sender / Student Name</span>
            <span class="font-bold text-slate-800 font-sans">${studentName}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-slate-500">Student Number</span>
            <span class="font-bold text-slate-800">${studentNo}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-slate-500">Contribution Item</span>
            <span class="font-bold text-slate-800 font-sans">${itemTitle}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-slate-500">Transaction Timestamp</span>
            <span class="text-slate-600">${timestamp}</span>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-200/80">
            <span class="text-slate-500">Audit Status</span>
            <span class="font-bold ${isSettled ? 'text-emerald-700' : 'text-amber-700'}">
              ${isSettled ? 'Verified in Treasury Ledger' : 'Awaiting Personnel Decision'}
            </span>
          </div>
        </div>

        <!-- PERSONNEL AUDIT NOTES FIELD -->
        <div>
          <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono flex items-center justify-between">
            <span>Personnel Audit Notes / Justification:</span>
            <span class="text-[10px] text-slate-400 font-normal">Optional for approval, required for decline</span>
          </label>
          <textarea id="personnel-audit-notes" rows="2" 
                    placeholder="e.g. Verified with GCash merchant statement reference ending in 1023. Confirmed full payment."
                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white transition"></textarea>
        </div>

      </div>
    `;

    const footerHtml = `
      <div class="flex items-center justify-between w-full gap-2">
        <button type="button" onclick="CoePersonnelView.closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer">
          Close Preview
        </button>
        ${!isSettled ? `
          <div class="flex items-center gap-2">
            <button type="button" onclick="CoePersonnelView.handleDeclineWithNotes('${studentNo}', '${itemTitle}')" 
                    class="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer">
              <i class="fa-solid fa-xmark text-xs"></i>
              <span>Decline Submission</span>
            </button>
            <button type="button" onclick="CoePersonnelView.handleApproveWithNotes('${studentNo}', '${itemTitle}')" 
                    class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer">
              <i class="fa-solid fa-check text-xs"></i>
              <span>Approve & Grant Clearance</span>
            </button>
          </div>
        ` : `
          <span class="text-xs font-bold text-emerald-800 flex items-center gap-1">
            <i class="fa-solid fa-circle-check"></i> Verified and Cleared
          </span>
        `}
      </div>
    `;

    this.injectModal(titleHtml, bodyHtml, footerHtml);
  },

  handleApproveWithNotes(studentNo, itemTitle) {
    const notes = document.getElementById('personnel-audit-notes')?.value?.trim();
    this.closeModal();
    this.approveItem(studentNo, itemTitle, notes);
  },

  handleDeclineWithNotes(studentNo, itemTitle) {
    const notes = document.getElementById('personnel-audit-notes')?.value?.trim();
    this.closeModal();
    this.declineItem(studentNo, itemTitle, notes);
  },

  // ==========================================
  // DIRECT INJECTION MODAL ENGINE
  // ==========================================
  openModal(type) {
    this.closeModal();

    let titleHtml = "";
    let bodyHtml = "";
    let footerHtml = "";

    if (type === 'receipt') {
      titleHtml = `<i class="fa-solid fa-receipt text-amber-300 mr-2"></i><span>Direct Cash Collection Receipt</span>`;
      bodyHtml = `
        <div class="space-y-4 text-xs">
          <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <div class="font-bold text-slate-900 flex items-center gap-1.5">
              <i class="fa-solid fa-hand-holding-dollar text-emerald-800"></i>
              <span>Over-the-Counter Settlement</span>
            </div>
            <p class="text-slate-600 text-xs">Record immediate cash transactions and grant instant examination clearances to the student.</p>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">Student Number *</label>
            <input type="text" id="manual-student-input" placeholder="e.g. 2023-10004" 
                   class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white transition">
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">Assessment Requirement *</label>
            <select id="manual-item-select" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-700">
              <option value="Departmental Shirt (Batch 2026)">Departmental Shirt (Batch 2026) - ₱450.00</option>
              <option value="General Academic Clearance Fee">General Academic Clearance Fee - ₱150.00</option>
              <option value="Engineering Laboratory Fee">Engineering Laboratory Fee - ₱300.00</option>
            </select>
          </div>
        </div>
      `;
      footerHtml = `
        <button type="button" onclick="CoePersonnelView.closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer">Cancel</button>
        <button type="button" onclick="CoePersonnelView.submitReceipt()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 text-amber-200 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-check text-xs"></i><span>Record & Clear</span>
        </button>
      `;
    } else {
      titleHtml = `<i class="fa-solid fa-inbox text-amber-300 mr-2"></i><span>Treasury Outbox Dispatch</span>`;
      bodyHtml = `
        <div class="space-y-3.5 text-xs">
          <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div class="flex items-center justify-between font-mono">
              <span class="font-bold text-slate-900">Dispatched Clearance Notices</span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">SMTP Active</span>
            </div>
            <p class="text-slate-600 text-xs leading-relaxed">Official electronic receipts and clearance updates are automatically generated and relayed to student institutional email addresses upon verification.</p>
          </div>
        </div>
      `;
      footerHtml = `
        <button type="button" onclick="CoePersonnelView.closeModal()" class="px-5 py-2.5 rounded-xl bg-emerald-800 text-amber-200 font-bold text-xs cursor-pointer">Acknowledge</button>
      `;
    }

    this.injectModal(titleHtml, bodyHtml, footerHtml);
  },

  injectModal(titleHtml, bodyHtml, footerHtml) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'personnel-injected-modal';
    modalDiv.className = 'fixed inset-0 z-[9999999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto';
    modalDiv.innerHTML = `
      <div class="bg-white rounded-3xl border border-white/90 shadow-[0_25px_70px_rgba(0,0,0,0.5)] overflow-hidden w-full max-w-xl mx-auto flex flex-col my-auto transition-all transform scale-100">
        <div class="px-7 py-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shadow-sm">
          <h3 class="font-brand font-black text-base flex items-center">${titleHtml}</h3>
          <button type="button" onclick="CoePersonnelView.closeModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition cursor-pointer">
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
    const existing = document.getElementById('personnel-injected-modal');
    if (existing) existing.remove();
  },

  submitReceipt() {
    const std = document.getElementById('manual-student-input')?.value?.trim();
    if (!std) {
      alert("Please enter a student number.");
      return;
    }
    alert(`Cash payment logged! Student ${std} has been marked as Cleared.`);
    this.closeModal();
    this.switchTab('cleared');
  }
};

window.CoePersonnelView = CoePersonnelView;