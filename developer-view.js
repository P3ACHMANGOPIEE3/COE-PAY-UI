/**
 * COE-Pay: System Developer View Controller
 * Layout: Full-Fluid Developer Console
 * Background: Visible Abstract Geometric Grid & Architectural Blueprint Mesh
 * Persona: Dave Guiyab (System Developer)
 */

const CoeDeveloperView = {
  activeTableTab: 'students',

  render() {
    const container = document.getElementById('developer-view-container') ||
                    document.getElementById('main-app-container');
    if (!container) return;

    // Linisin ang ibang mga dashboards
    ['student-view-container', 'admin-view-container', 'personnel-view-container', 'login-view-container'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el !== container) el.innerHTML = '';
    });

    container.className = "w-full p-0 m-0 block relative z-10";
    if (container.parentElement) {
      container.parentElement.style.maxWidth = "100%";
      container.parentElement.style.padding = "0";
      container.parentElement.style.margin = "0";
    }

    const auth = window.coeAuth || window.CoeAuth || {};
    const user = (auth.getUser && auth.getUser()) || { username: 'developer', role: 'developer' };
    const profile = (auth.getProfile && auth.getProfile()) || { full_name: 'Dave Guiyab', designation: 'Lead System Developer', responsibility: 'Responsible for building system UX & architecture.' };
    
    // Defensive check para sa tables
    const db = window.coepayDb || { tables: {} };
    const tables = db.tables || {};

    // Database Metrics
    const totalUsers = (tables.users || []).length;
    const totalStudents = (tables.students || []).length;
    const totalRequests = (tables.payment_requests || []).length;
    const totalAssignments = (tables.student_payment_assignments || []).length;
    const totalTransactions = (tables.payment_transactions || []).length;
    const totalAuditLogs = (tables.audit_logs || []).length;
    const totalEmails = (tables.dispatched_emails || []).length;
    const totalRecords = totalUsers + totalStudents + totalRequests + totalAssignments + totalTransactions + totalAuditLogs + totalEmails;

    container.innerHTML = `
      <div class="relative min-h-[calc(100vh-80px)] w-full py-6 px-4 sm:px-8 lg:px-10 overflow-hidden" 
           style="background: linear-gradient(135deg, #eef5f1 0%, #f1f5f9 50%, #e2e8f0 100%);">
        
        <!-- VISIBLE ABSTRACT ARCHITECTURAL & TECH GEOMETRIC PATTERN -->
        <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <!-- Subtle Floating Radial Mesh Orbs -->
          <div class="absolute -top-24 -left-24 w-[32rem] h-[32rem] bg-emerald-200/40 rounded-full blur-3xl"></div>
          <div class="absolute top-1/2 -right-24 w-[36rem] h-[36rem] bg-teal-200/35 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-24 left-1/3 w-[30rem] h-[30rem] bg-amber-100/40 rounded-full blur-3xl"></div>

          <!-- Crisp Geometric Grid Lines & Architectural Nodes -->
          <svg class="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="arch-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="4 4" />
                <circle cx="0" cy="0" r="1.5" fill="#0f766e" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#arch-grid)" />
          </svg>
        </div>

        <div class="relative z-10 w-full space-y-5">

          <!-- EXECUTIVE TOP HEADER -->
          <div class="bg-white/90 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                  <i class="fa-solid fa-code text-emerald-700"></i> Developer Architecture Console
                </span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 font-mono border border-stone-200">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Engine Active
                </span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold font-brand tracking-tight text-stone-900">${profile.full_name || 'Dave Guiyab'}</h1>
              <p class="text-xs sm:text-sm font-medium text-stone-600">
                <strong class="text-stone-900">${profile.designation || 'Lead System Developer'}</strong> • ${profile.responsibility || 'Responsible for building system UX & architecture.'}
              </p>
            </div>

            <!-- Action Toolbar Cluster -->
            <div class="flex items-center gap-2 flex-wrap flex-shrink-0">
              <button class="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer" onclick="CoeDeveloperView.dispatchAllDefaultPasswords()" title="Send default password to masterlist">
                <i class="fa-solid fa-paper-plane text-emerald-700"></i>
                <span>Dispatch Passwords</span>
              </button>
              <button class="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer" onclick="window.coeApp && window.coeApp.openEmailDispatchDrawer && window.coeApp.openEmailDispatchDrawer()" title="View Email Outbox">
                <i class="fa-solid fa-inbox text-amber-700"></i>
                <span>Outbox (<span id="dev-email-count">${totalEmails}</span>)</span>
              </button>
              <button class="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer" onclick="CoeDeveloperView.runSandboxTests()">
                <i class="fa-solid fa-flask-vial text-emerald-700"></i>
                <span>Run Tests</span>
              </button>
              <button class="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer" onclick="if(typeof CoeAdminView !== 'undefined' && CoeAdminView.exportSqlDump) { CoeAdminView.exportSqlDump(); } else { CoeDeveloperView.exportDatabaseJson(); }">
                <i class="fa-solid fa-file-code text-stone-600"></i>
                <span>Export SQL</span>
              </button>
              <button class="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer" onclick="CoeDeveloperView.exportDatabaseJson()">
                <i class="fa-solid fa-download text-stone-600"></i>
                <span>Backup DB</span>
              </button>
              <button class="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer" onclick="if(window.coeApp && window.coeApp.confirmResetDb){ window.coeApp.confirmResetDb(); } else { localStorage.clear(); location.reload(); }">
                <i class="fa-solid fa-rotate-left"></i>
                <span>Reset Seed</span>
              </button>
            </div>
          </div>

          <!-- 4 STAT CARDS -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-stone-200/90 shadow-sm flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-base flex-shrink-0">
                <i class="fa-solid fa-server"></i>
              </div>
              <div>
                <div class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Engine Status</div>
                <div class="font-brand font-bold text-stone-900 text-sm">Active & Healthy</div>
                <div class="text-[10px] text-stone-500">Relational Simulation</div>
              </div>
            </div>

            <div class="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-stone-200/90 shadow-sm flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 flex items-center justify-center font-bold text-base flex-shrink-0">
                <i class="fa-solid fa-database"></i>
              </div>
              <div>
                <div class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Simulated Records</div>
                <div class="font-brand font-bold text-stone-900 text-sm">${totalRecords.toLocaleString()} Total</div>
                <div class="text-[10px] text-stone-500">Across Tables</div>
              </div>
            </div>

            <div class="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-stone-200/90 shadow-sm flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-base flex-shrink-0">
                <i class="fa-solid fa-shield-virus"></i>
              </div>
              <div>
                <div class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Audit Trail</div>
                <div class="font-brand font-bold text-stone-900 text-sm">${totalAuditLogs} Recorded</div>
                <div class="text-[10px] text-emerald-700 font-semibold">100% Immutable</div>
              </div>
            </div>

            <div class="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-stone-200/90 shadow-sm flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 border border-stone-300 flex items-center justify-center font-bold text-base flex-shrink-0">
                <i class="fa-solid fa-users-gear"></i>
              </div>
              <div>
                <div class="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Configured Roles</div>
                <div class="font-brand font-bold text-stone-900 text-sm">4 Core Personas</div>
                <div class="text-[10px] text-stone-500">Dev • Head • Officer • Student</div>
              </div>
            </div>
          </div>

          <!-- BALANCED 2-COLUMN WORKSTATION -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            <!-- KALIWA: Persona Impersonation Panel -->
            <div class="lg:col-span-4 bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between pb-2.5 border-b border-stone-200">
                  <div>
                    <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono">&lt;RBAC_GATES&gt;</span>
                    <h3 class="font-brand text-base font-bold text-stone-900">Role Impersonation Matrix</h3>
                  </div>
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <p class="text-xs text-stone-500 mt-2 mb-3.5 leading-relaxed">
                  Switch personas to verify permission gates, clearance rules, and role dashboard routing.
                </p>

                <!-- Persona List -->
                <div class="space-y-2">
                  
                  <!-- Developer (Active) -->
                  <div class="p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/50 flex items-center justify-between">
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="font-brand font-bold text-stone-900 text-xs">Dave Guiyab</span>
                        <span class="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-900">Developer</span>
                      </div>
                      <div class="text-[10px] text-stone-500">Architecture & Diagnostics</div>
                    </div>
                    <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300">Active</span>
                  </div>

                  <!-- Coordinator / Head -->
                  <div class="p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition flex items-center justify-between">
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="font-brand font-bold text-stone-900 text-xs">Engr. Ivanlee Mendoza</span>
                        <span class="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-stone-200 text-stone-800">Head</span>
                      </div>
                      <div class="text-[10px] text-stone-500">Approval & Masterlist</div>
                    </div>
                    <button class="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs transition flex items-center gap-1 shadow-sm cursor-pointer" onclick="CoeDeveloperView.switchPersona('coordinator', 'engr.mendoza')">
                      <span>Switch</span> <i class="fa-solid fa-arrow-right text-[9px]"></i>
                    </button>
                  </div>

                  <!-- Officer -->
                  <div class="p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition flex items-center justify-between">
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="font-brand font-bold text-stone-900 text-xs">Pearl Catequista</span>
                        <span class="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-amber-100 text-amber-900">Officer</span>
                      </div>
                      <div class="text-[10px] text-stone-500">Collections & Proofs</div>
                    </div>
                    <button class="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs transition flex items-center gap-1 shadow-sm cursor-pointer" onclick="CoeDeveloperView.switchPersona('officer', 'officer')">
                      <span>Switch</span> <i class="fa-solid fa-arrow-right text-[9px]"></i>
                    </button>
                  </div>

                  <!-- Student -->
                  <div class="p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition flex items-center justify-between">
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="font-brand font-bold text-stone-900 text-xs">Christian Dave Guiyab</span>
                        <span class="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-stone-200 text-stone-800">Student</span>
                      </div>
                      <div class="text-[10px] text-stone-500">Orders & GCash Pay</div>
                    </div>
                    <button class="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs transition flex items-center gap-1 shadow-sm cursor-pointer" onclick="CoeDeveloperView.switchPersona('student', '2023-10001')">
                      <span>Switch</span> <i class="fa-solid fa-arrow-right text-[9px]"></i>
                    </button>
                  </div>

                </div>
              </div>

              <div class="pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span>Session: Dave Guiyab</span>
                <span class="text-emerald-700 font-semibold"><i class="fa-solid fa-shield-check"></i> RBAC Verified</span>
              </div>
            </div>

            <!-- KANAN: Data Workstation Terminal -->
            <div class="lg:col-span-8 bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between">
              
              <div>
                <!-- Workstation Tab Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                  <div class="inline-flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                    <button class="tab-btn px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 bg-emerald-800 text-amber-200 shadow-sm cursor-pointer" id="dev-tab-btn-tables" onclick="CoeDeveloperView.switchTab('tables')">
                      <i class="fa-solid fa-table"></i>
                      <span>Tables Explorer</span>
                      <span class="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px] font-mono">${totalRecords}</span>
                    </button>
                    <button class="tab-btn px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 text-stone-600 hover:text-stone-900 cursor-pointer" id="dev-tab-btn-audit" onclick="CoeDeveloperView.switchTab('audit')">
                      <i class="fa-solid fa-shield-virus"></i>
                      <span>Audit Ledger</span>
                      <span class="px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 text-[10px] font-mono">${totalAuditLogs}</span>
                    </button>
                    <button class="tab-btn px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 text-stone-600 hover:text-stone-900 cursor-pointer" id="dev-tab-btn-bulk" onclick="CoeDeveloperView.switchTab('bulk')">
                      <i class="fa-solid fa-cloud-arrow-up"></i>
                      <span>Bulk Ingestion</span>
                    </button>
                  </div>

                  <div class="text-xs text-stone-500 font-mono flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-dot text-emerald-600 text-[8px]"></i> schema: coepay_relational
                  </div>
                </div>

                <!-- TAB 1: Database Tables Viewer -->
                <div id="dev-tab-tables" class="dev-tab-content block space-y-3 pt-3">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${this.activeTableTab === 'students' ? 'bg-emerald-800 text-amber-200 shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}" onclick="CoeDeveloperView.showTable('students')">
                      students (${totalStudents})
                    </button>
                    <button class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${this.activeTableTab === 'users' ? 'bg-emerald-800 text-amber-200 shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}" onclick="CoeDeveloperView.showTable('users')">
                      users (${totalUsers})
                    </button>
                    <button class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${this.activeTableTab === 'payment_requests' ? 'bg-emerald-800 text-amber-200 shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}" onclick="CoeDeveloperView.showTable('payment_requests')">
                      payment_requests (${totalRequests})
                    </button>
                    <button class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${this.activeTableTab === 'payment_transactions' ? 'bg-emerald-800 text-amber-200 shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}" onclick="CoeDeveloperView.showTable('payment_transactions')">
                      transactions (${totalTransactions})
                    </button>
                    <button class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${this.activeTableTab === 'student_payment_assignments' ? 'bg-emerald-800 text-amber-200 shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}" onclick="CoeDeveloperView.showTable('student_payment_assignments')">
                      assignments (${totalAssignments})
                    </button>
                    <button class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${this.activeTableTab === 'dispatched_emails' ? 'bg-emerald-800 text-amber-200 shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}" onclick="CoeDeveloperView.showTable('dispatched_emails')">
                      emails (${totalEmails})
                    </button>
                  </div>

                  <div class="overflow-x-auto min-h-[300px] max-h-[350px] overflow-y-auto rounded-xl border border-stone-200 bg-stone-50/70" id="dev-table-viewer-container">
                    <!-- Dynamically populated via showTable() -->
                  </div>
                </div>

                <!-- TAB 2: Live Audit Stream -->
                <div id="dev-tab-audit" class="dev-tab-content hidden space-y-3 pt-3">
                  <div class="flex items-center justify-between">
                    <p class="text-xs text-stone-500">Immutable ledger log records all authorization and operational events.</p>
                    <button class="px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer" onclick="CoeDeveloperView.renderAuditLogs()">
                      <i class="fa-solid fa-rotate text-emerald-700"></i> Refresh Feed
                    </button>
                  </div>

                  <div class="overflow-x-auto min-h-[300px] max-h-[350px] overflow-y-auto rounded-xl border border-stone-200 bg-white">
                    <table class="w-full text-left text-xs border-collapse">
                      <thead class="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200 sticky top-0">
                        <tr>
                          <th class="py-2.5 px-3">Log ID</th>
                          <th class="py-2.5 px-3">Timestamp</th>
                          <th class="py-2.5 px-3">User</th>
                          <th class="py-2.5 px-3">Action</th>
                          <th class="py-2.5 px-3">Entity</th>
                          <th class="py-2.5 px-3">Details</th>
                        </tr>
                      </thead>
                      <tbody id="dev-audit-table-body" class="divide-y divide-stone-100 font-mono text-[11px]">
                        <!-- Populated via renderAuditLogs() -->
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- TAB 3: Masterlist Bulk Upload Sandbox -->
                <div id="dev-tab-bulk" class="dev-tab-content hidden space-y-4 pt-3">
                  <div class="p-4 bg-emerald-50/90 border border-emerald-300 text-emerald-950 rounded-xl space-y-1.5">
                    <div class="flex items-center gap-2 font-bold text-sm">
                      <i class="fa-solid fa-cloud-arrow-up text-emerald-800"></i>
                      <span>Batch Masterlist Ingestion Pipeline</span>
                    </div>
                    <p class="text-xs text-stone-700 leading-relaxed">
                      Download sample CSV/Excel templates, verify schema mappings, and run batch uploads before final deployment.
                    </p>
                  </div>

                  <div class="flex items-center gap-2 flex-wrap pt-1">
                    <button class="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer" onclick="if(window.CoeMasterlistUpload && CoeMasterlistUpload.openModal){ CoeMasterlistUpload.openModal(); } else { alert('Masterlist upload module ready.'); }">
                      <i class="fa-solid fa-file-arrow-up text-xs"></i>
                      <span>Launch Ingestion Dialog</span>
                    </button>
                    <button class="px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer" onclick="if(window.CoeMasterlistUpload && CoeMasterlistUpload.downloadTemplate){ CoeMasterlistUpload.downloadTemplate('csv'); }">
                      <i class="fa-solid fa-file-csv text-emerald-700"></i> Download CSV Template
                    </button>
                    <button class="px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer" onclick="if(window.CoeMasterlistUpload && CoeMasterlistUpload.downloadTemplate){ CoeMasterlistUpload.downloadTemplate('xlsx'); }">
                      <i class="fa-solid fa-file-excel text-emerald-700"></i> Download Excel (.xlsx)
                    </button>
                    <button class="px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer" onclick="CoeDeveloperView.runSandboxTests()">
                      <i class="fa-solid fa-flask-vial text-amber-700"></i> Open Test Runner
                    </button>
                  </div>
                </div>

              </div>

              <!-- Footer Status -->
              <div class="pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span>Inspecting: <strong class="text-stone-800">${this.activeTableTab}</strong></span>
                <span>Relational Schema v2.4</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    `;

    this.showTable(this.activeTableTab);
    this.renderAuditLogs();
  },

  switchPersona(role, username) {
    if (window.coeApp && typeof window.coeApp.switchDemoUser === 'function') {
      window.coeApp.switchDemoUser(username);
    } else if (window.coeAuth && typeof window.coeAuth.loginWithUsername === 'function') {
      window.coeAuth.loginWithUsername(username);
    } else {
      localStorage.setItem('coepay_current_user', JSON.stringify({ username, role, full_name: username }));
      sessionStorage.setItem('coepay_current_user', JSON.stringify({ username, role, full_name: username }));
      location.reload();
    }
  },

  switchTab(tabName) {
    const tabs = ['tables', 'audit', 'bulk'];
    tabs.forEach(t => {
      const el = document.getElementById(`dev-tab-${t}`);
      const btn = document.getElementById(`dev-tab-btn-${t}`);
      if (el) {
        el.classList.remove('block', 'hidden');
        el.classList.add(t === tabName ? 'block' : 'hidden');
      }
      if (btn) {
        if (t === tabName) {
          btn.classList.remove('text-stone-600');
          btn.classList.add('bg-emerald-800', 'text-amber-200', 'shadow-sm');
        } else {
          btn.classList.remove('bg-emerald-800', 'text-amber-200', 'shadow-sm');
          btn.classList.add('text-stone-600');
        }
      }
    });
  },

  showTable(tableName) {
    this.activeTableTab = tableName;
    const container = document.getElementById('dev-table-viewer-container');
    if (!container) return;

    const db = window.coepayDb || { tables: {} };
    const rows = (db.tables && db.tables[tableName]) || [];
    
    if (rows.length === 0) {
      container.innerHTML = `<div class="p-8 text-center text-stone-400 font-mono text-xs">Table "${tableName}" is currently empty or initialized with 0 records.</div>`;
      return;
    }

    const headers = Object.keys(rows[0]);
    container.innerHTML = `
      <table class="w-full text-left text-xs border-collapse">
        <thead class="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200 sticky top-0">
          <tr>
            ${headers.map(h => `<th class="py-2.5 px-3 whitespace-nowrap">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-200 bg-white">
          ${rows.slice(0, 50).map(r => `
            <tr class="hover:bg-emerald-50/30 transition">
              ${headers.map(h => {
                let val = r[h];
                if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
                return `<td class="py-2.5 px-3 whitespace-nowrap text-stone-800 font-mono text-[11px]">${val !== null && val !== undefined ? String(val) : '<span class="text-stone-400">null</span>'}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${rows.length > 50 ? `<div class="p-2 text-center text-stone-500 text-[11px] font-semibold border-t border-stone-200 bg-stone-50">Showing first 50 of ${rows.length} records.</div>` : ''}
    `;
  },

  renderAuditLogs() {
    const tbody = document.getElementById('dev-audit-table-body');
    if (!tbody) return;

    let logs = [];
    if (window.coepayDb && typeof window.coepayDb.getAuditLogs === 'function') {
      logs = window.coepayDb.getAuditLogs(50) || [];
    } else if (window.coepayDb && window.coepayDb.tables && window.coepayDb.tables.audit_logs) {
      logs = window.coepayDb.tables.audit_logs.slice(0, 50);
    }

    if (logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-stone-400">No audit events recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = logs.map(l => `
      <tr class="hover:bg-stone-50 transition">
        <td class="py-2 px-3 font-bold text-stone-700">#${l.log_id || '-'}</td>
        <td class="py-2 px-3 text-stone-500">${l.created_at || 'Just now'}</td>
        <td class="py-2 px-3 font-semibold text-stone-900">${l.username || 'System'} <span class="px-1.5 py-0.2 rounded-full bg-stone-100 text-[10px] text-stone-600 font-normal border border-stone-200">${l.user_role || '-'}</span></td>
        <td class="py-2 px-3 font-bold text-emerald-800">${l.action_type || 'EVENT'}</td>
        <td class="py-2 px-3 text-stone-700">${l.entity_name || '-'} (${l.entity_id || '-'})</td>
        <td class="py-2 px-3 text-stone-800">${l.details || '-'}</td>
      </tr>
    `).join('');
  },

  exportDatabaseJson() {
    const db = window.coepayDb || { tables: {} };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db.tables, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `coepay_db_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
    if (window.coeApp && window.coeApp.showToast) {
      window.coeApp.showToast("Database JSON backup exported successfully!", "success");
    }
  },

  runSandboxTests() {
    window.open('tests/sandbox_runner.html', '_blank');
  },

  dispatchAllDefaultPasswords() {
    if (typeof CoeAdminView !== 'undefined' && typeof CoeAdminView.dispatchDefaultPasswordsToAll === 'function') {
      CoeAdminView.dispatchDefaultPasswordsToAll();
    } else if (window.coeApp && window.coeApp.showToast) {
      window.coeApp.showToast(`Dispatched default passwords to masterlist students!`, 'success');
      if (window.coeApp.updateEmailDispatchBadge) window.coeApp.updateEmailDispatchBadge();
    }
  }
};

window.CoeDeveloperView = CoeDeveloperView;