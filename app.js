/**
 * COE-Pay: Main Application Controller
 * Handles global app state, view routing, top navigation bar,
 * modal dialogs, toast notifications, and fast demo switching.
 * Feature: Full Campus Drawing Background with Soft Blur & Integrated Central Layout.
 */

class CoeApp {
  constructor() {
    this.currentView = 'dashboard';
    this.currentAuthMode = 'supabase_otp';
    this.otpTimerInterval = null;
    this.init();
  }

  init() {
    const run = async () => {
      this.bindGlobalEvents();
      await this.checkIncomingSupabaseSession();
      this.renderApp();
      this.bindSupabaseAuthStateListener();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  async checkIncomingSupabaseSession() {
    if (window.CoeSupabaseAuth && window.CoeSupabaseAuth.client && !window.CoeSupabaseAuth.isSandbox) {
      try {
        const { data, error } = await window.CoeSupabaseAuth.client.auth.getSession();
        if (data && data.session && data.session.user) {
          const user = await window.coeAuth.loginWithSupabaseSession(data.session);
          if (user) {
            if (window.location.hash && window.location.hash.includes('access_token')) {
              window.history.replaceState(null, null, window.location.pathname);
            }
          }
        }
      } catch (err) {
        console.warn("[COE-Pay] Supabase incoming session check:", err.message);
      }
    }
  }

  bindSupabaseAuthStateListener() {
    if (window.CoeSupabaseAuth && window.CoeSupabaseAuth.client && !window.CoeSupabaseAuth.isSandbox) {
      try {
        window.CoeSupabaseAuth.client.auth.onAuthStateChange(async (event, session) => {
          if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session && !window.coeAuth.isLoggedIn()) {
            try {
              const user = await window.coeAuth.loginWithSupabaseSession(session);
              if (user) {
                if (window.location.hash && window.location.hash.includes('access_token')) {
                  window.history.replaceState(null, null, window.location.pathname);
                }
                this.renderApp();
                this.showToast(`Logged in successfully via Supabase Email Link! Welcome, ${user.first_name || user.username}.`, 'success');
              }
            } catch (err) {
              this.showToast(err.message, 'warning');
            }
          }
        });
      } catch (e) {}
    }
  }

  bindGlobalEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });

    const modalBackdrop = document.getElementById('global-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          this.closeModal();
        }
      });
    }
  }

  onUserChanged() {
    this.renderApp();
  }

  renderApp() {
    const isAuth = window.coeAuth.isLoggedIn();
    const user = window.coeAuth.getUser();
    const profile = window.coeAuth.getProfile();

    const authContainer = document.getElementById('auth-view-container');
    const mainAppContainer = document.getElementById('main-app-container');
    const devBanner = document.getElementById('dev-impersonation-banner');

    if (!isAuth) {
      if (devBanner) devBanner.style.display = 'none';
      if (authContainer) authContainer.style.display = 'block';
      if (mainAppContainer) mainAppContainer.style.display = 'none';
      this.renderLoginView();
      return;
    }

    if (authContainer) authContainer.style.display = 'none';
    if (mainAppContainer) mainAppContainer.style.display = 'block';

    this.renderTopNav(user, profile);

    const devView = document.getElementById('developer-view-container');
    const adminView = document.getElementById('admin-view-container');
    const personnelView = document.getElementById('personnel-view-container');
    const studentView = document.getElementById('student-view-container');

    if (devView) devView.style.display = 'none';
    if (adminView) adminView.style.display = 'none';
    if (personnelView) personnelView.style.display = 'none';
    if (studentView) studentView.style.display = 'none';

    if (user.role === 'developer') {
      if (devView) devView.style.display = 'block';
      const view = window.CoeDeveloperView || (typeof CoeDeveloperView !== 'undefined' ? CoeDeveloperView : null);
      if (view && typeof view.render === 'function') view.render();
    } else if (user.role === 'coordinator' || user.role === 'admin') {
      if (adminView) adminView.style.display = 'block';
      const view = window.CoeAdminView || (typeof CoeAdminView !== 'undefined' ? CoeAdminView : null);
      if (view && typeof view.render === 'function') view.render();
    } else if (user.role === 'officer' || user.role === 'personnel') {
      if (personnelView) personnelView.style.display = 'block';
      const view = window.CoePersonnelView || (typeof CoePersonnelView !== 'undefined' ? CoePersonnelView : null);
      if (view && typeof view.render === 'function') view.render();
    } else if (user.role === 'student') {
      if (studentView) studentView.style.display = 'block';
      const view = window.CoeStudentView || (typeof CoeStudentView !== 'undefined' ? CoeStudentView : null);
      if (view && typeof view.render === 'function') view.render();
    }
  }

  renderTopNav(user, profile) {
    const navRight = document.getElementById('nav-user-controls');
    if (!navRight) return;

    let roleBadge = '';
    if (user.role === 'developer') {
      roleBadge = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300"><i class="fa-solid fa-code"></i> System Developer</span>';
    } else if (user.role === 'coordinator' || user.role === 'admin') {
      roleBadge = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300"><i class="fa-solid fa-user-tie"></i> Head Engineer</span>';
    } else if (user.role === 'officer' || user.role === 'personnel') {
      roleBadge = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-300"><i class="fa-solid fa-clipboard-user"></i> Officer</span>';
    } else {
      roleBadge = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-300"><i class="fa-solid fa-graduation-cap"></i> Student</span>';
    }

    const isDeveloper = user.role === 'developer';
    const isImpersonating = sessionStorage.getItem('coepay_dev_impersonating') === 'true';

    let switcherHtml = '';
    if (isDeveloper) {
      switcherHtml = `
        <div class="relative">
          <select id="demo-account-select" class="text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 font-semibold text-stone-800 focus:outline-none focus:border-emerald-700 cursor-pointer" onchange="window.coeApp.switchDemoUser(this.value)">
            <optgroup label="Official Roles">
              <option value="developer" ${user.role === 'developer' ? 'selected' : ''}>Dave Guiyab (Developer)</option>
              <option value="engr.mendoza" ${user.role === 'coordinator' || user.role === 'admin' ? 'selected' : ''}>Engr. Ivanlee Mendoza (Head)</option>
              <option value="officer" ${user.role === 'officer' || user.username === 'officer' ? 'selected' : ''}>Pearl Catequista (Officer)</option>
              <option value="2023-10001" ${user.username === '2023-10001' ? 'selected' : ''}>Christian Dave Guiyab (Student)</option>
            </optgroup>
            <optgroup label="BSCpE-4A Masterlist">
              <option value="2023-10009" ${user.username === '2023-10009' ? 'selected' : ''}>Jay-are Mesias (Cleared)</option>
              <option value="2023-10003" ${user.username === '2023-10003' ? 'selected' : ''}>Jefferson Sadoguio (Cleared)</option>
              <option value="2023-10004" ${user.username === '2023-10004' ? 'selected' : ''}>Jerome Opana (Pending)</option>
              <option value="2023-10005" ${user.username === '2023-10005' ? 'selected' : ''}>Aaron Mikhael Canonizado (Pending)</option>
              <option value="2023-10006" ${user.username === '2023-10006' ? 'selected' : ''}>John Robin Fernandez (In Progress)</option>
              <option value="2023-10007" ${user.username === '2023-10007' ? 'selected' : ''}>Ma. Sophia Dimasu-ay (Cleared)</option>
              <option value="2023-10008" ${user.username === '2023-10008' ? 'selected' : ''}>Tricia Mae Gonzaga (Unpaid)</option>
            </optgroup>
          </select>
        </div>
      `;
    }

    let resetDbHtml = '';
    if (isDeveloper) {
      resetDbHtml = `
        <button class="px-2.5 py-1.5 rounded-xl border border-stone-300 text-stone-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold transition" title="Reset Database to Seed State" onclick="window.coeApp.confirmResetDb()">
          <i class="fa-solid fa-rotate-left"></i>
        </button>
      `;
    }

    navRight.innerHTML = `
      <div class="flex items-center gap-2">
        ${roleBadge}
      </div>

      ${switcherHtml}

      <div class="flex items-center gap-2.5 bg-stone-100 border border-stone-300/80 rounded-xl px-3 py-1.5">
        <div class="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center text-xs font-bold">
          <i class="fa-solid ${user.role === 'developer' ? 'fa-code' : user.role === 'student' ? 'fa-user-graduate' : user.role === 'officer' || user.role === 'personnel' ? 'fa-clipboard-user' : 'fa-user-tie'}"></i>
        </div>
        <div class="text-left hidden sm:block">
          <div class="text-xs font-bold text-stone-800 leading-tight">${profile ? profile.full_name : user.username}</div>
          <div class="text-[10px] text-stone-500 font-medium">${user.email}</div>
        </div>
      </div>

      <button class="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition flex items-center gap-1.5" title="System Email Dispatch Outbox" onclick="window.coeApp.openEmailDispatchDrawer()">
        <i class="fa-solid fa-inbox text-emerald-700"></i>
        <span class="hidden md:inline">Outbox</span>
        <span class="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold dispatched-email-badge">0</span>
      </button>

      <button class="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-rose-50 hover:text-rose-700 text-stone-700 text-xs font-bold transition flex items-center gap-1.5" title="Logout" onclick="window.coeAuth.confirmLogout()">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
        <span class="hidden md:inline">Logout</span>
      </button>

      ${resetDbHtml}
    `;

    this.renderDevImpersonationBanner(user, profile, isImpersonating);
    this.updateEmailDispatchBadge();
  }

  renderDevImpersonationBanner(user, profile, isImpersonating) {
    let banner = document.getElementById('dev-impersonation-banner');
    if (!banner) return;

    if (!isImpersonating) {
      banner.style.display = 'none';
      banner.innerHTML = '';
      return;
    }

    banner.style.display = 'flex';
    banner.className = 'dev-impersonation-banner bg-amber-50 border-b border-amber-300 text-amber-950 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs';
    banner.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-user-ninja text-amber-700"></i>
        <span><strong>Developer Impersonation Active:</strong> Testing view as <strong>${profile ? profile.full_name : user.username}</strong> (${user.role.toUpperCase()}).</span>
      </div>
      <div class="flex items-center gap-2">
        <select class="text-xs bg-white border border-amber-300 rounded-lg px-2 py-1 font-semibold text-stone-800" onchange="window.coeApp.switchDemoUser(this.value)">
          <optgroup label="Roles">
            <option value="developer">Dave Guiyab (Developer)</option>
            <option value="engr.mendoza" ${user.role === 'coordinator' || user.role === 'admin' ? 'selected' : ''}>Engr. Ivanlee Mendoza (Coordinator)</option>
            <option value="officer" ${user.role === 'officer' ? 'selected' : ''}>Pearl Catequista (Officer)</option>
            <option value="2023-10001" ${user.username === '2023-10001' ? 'selected' : ''}>Christian Dave Guiyab (Student)</option>
          </optgroup>
          <optgroup label="Students">
            <option value="2023-10009" ${user.username === '2023-10009' ? 'selected' : ''}>Jay-are Mesias</option>
            <option value="2023-10003" ${user.username === '2023-10003' ? 'selected' : ''}>Jefferson Sadoguio</option>
            <option value="2023-10004" ${user.username === '2023-10004' ? 'selected' : ''}>Jerome Opana</option>
            <option value="2023-10005" ${user.username === '2023-10005' ? 'selected' : ''}>Aaron Mikhael Canonizado</option>
            <option value="2023-10006" ${user.username === '2023-10006' ? 'selected' : ''}>John Robin Fernandez</option>
            <option value="2023-10007" ${user.username === '2023-10007' ? 'selected' : ''}>Ma. Sophia Dimasu-ay</option>
            <option value="2023-10008" ${user.username === '2023-10008' ? 'selected' : ''}>Tricia Mae Gonzaga</option>
          </optgroup>
        </select>
        <button class="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition" onclick="window.coeApp.returnToDeveloper()">
          <i class="fa-solid fa-rotate-left"></i> Return to Dev
        </button>
      </div>
    `;
  }

  switchAuthMode(mode) {
    this.currentAuthMode = mode;
    const boxSupabase = document.getElementById('auth-box-supabase');
    const boxPassword = document.getElementById('auth-box-password');
    const tabs = document.querySelectorAll('.auth-mode-tab');

    tabs.forEach(t => {
      t.classList.remove('bg-white', 'text-emerald-900', 'shadow-sm');
      t.classList.add('text-stone-500');
    });

    const activeTab = document.getElementById(`tab-auth-${mode}`);
    if (activeTab) {
      activeTab.classList.remove('text-stone-500');
      activeTab.classList.add('bg-white', 'text-emerald-900', 'shadow-sm');
    }

    if (boxSupabase) boxSupabase.style.display = (mode === 'supabase_otp') ? 'block' : 'none';
    if (boxPassword) boxPassword.style.display = (mode === 'password') ? 'block' : 'none';
  }

  renderLoginView() {
    const authContainer = document.getElementById('auth-view-container');
    if (!authContainer) return;

    const sbStatus = (window.CoeSupabaseAuth && typeof window.CoeSupabaseAuth.getStatus === 'function')
      ? window.CoeSupabaseAuth.getStatus()
      : { isSandbox: true, url: '' };
    const isLiveSupabase = !sbStatus.isSandbox;

    // Full Campus Background na may malinis na blur sa gilid habang kitang-kita ang kabuuan ng Cainta Main Campus
    authContainer.innerHTML = `
      <div class="relative min-h-[calc(100vh-140px)] w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden">
        
        <!-- Malaking Background: Full Screen Blurred Backdrop ng Campus -->
        <div class="absolute inset-0 z-0">
          <img src="js/assets/cainta-campus.jpeg" 
               alt="ICCT Campus Ambient Backdrop" 
               class="w-full h-full object-cover filter blur-md brightness-[0.90] scale-105"
               onerror="if(!this.dataset.retry){this.dataset.retry=1;this.src='assets/cainta-campus.jpeg';}else if(this.dataset.retry==1){this.dataset.retry=2;this.src='js/assets/cainta-campus.png';}else if(this.dataset.retry==2){this.dataset.retry=3;this.src='assets/cainta-campus.png';}">
          <div class="absolute inset-0 bg-stone-950/25"></div>
        </div>

        <!-- Gitna: 2-Column Institutional Gateway Card -->
        <div class="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          <!-- KALIWA: Buong Artwork ng Campus na Malinaw at Kitang-kita ang Kabuuan -->
          <div class="lg:col-span-7 space-y-4">
            
            <div class="space-y-1.5 drop-shadow-sm">
              <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/90 text-emerald-900 border border-white/60 shadow-sm backdrop-blur-md">
                <i class="fa-solid fa-building-columns text-emerald-700"></i> ICCT Colleges Cainta Main Campus
              </span>
              <h1 class="text-3xl sm:text-4xl font-extrabold font-brand tracking-tight text-white drop-shadow-md leading-tight">
                Institute of Creative Computer Technology
              </h1>
              <p class="text-xs sm:text-sm text-stone-100 drop-shadow-md max-w-xl leading-relaxed">
                Centralized Student Payment Authorization, Collection, and Academic Clearance Gateway.
              </p>
            </div>

            <!-- Centralized Malinaw na Campus Artwork Window -->
            <div class="relative rounded-3xl overflow-hidden border-2 border-white/80 shadow-2xl bg-white/40 backdrop-blur-sm group">
              <img src="js/assets/cainta-campus.jpeg" 
                   alt="ICCT Colleges Cainta Main Campus" 
                   class="w-full h-auto object-cover max-h-[460px] rounded-3xl group-hover:scale-[1.01] transition-transform duration-500"
                   onerror="if(!this.dataset.retry){this.dataset.retry=1;this.src='assets/cainta-campus.jpeg';}else if(this.dataset.retry==1){this.dataset.retry=2;this.src='js/assets/cainta-campus.png';}else if(this.dataset.retry==2){this.dataset.retry=3;this.src='assets/cainta-campus.png';}">
              
              <!-- Clean White Glass Caption Strip -->
              <div class="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md border border-stone-200 px-4 py-2 rounded-2xl flex items-center justify-between text-xs shadow-md">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span class="font-bold text-stone-800 tracking-wide">Main Campus Facade • Gate 3</span>
                </div>
                <span class="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                  Cainta, Rizal
                </span>
              </div>
            </div>

          </div>

          <!-- KANAN: Login Card (Warm White Glass Layout) -->
          <div class="lg:col-span-5">
            <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 border-2 border-white/80 shadow-2xl relative">
              
              <div class="flex items-center justify-between mb-5">
                <div>
                  <span class="text-[11px] font-bold text-emerald-800 tracking-wider uppercase">Portal Access</span>
                  <h2 class="font-brand text-2xl font-bold text-stone-900 mt-0.5">Sign in to COE-Pay</h2>
                </div>
                <div class="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-lg shadow-sm">
                  <i class="fa-solid fa-lock"></i>
                </div>
              </div>

              <!-- Auth Mode Navigation Tabs -->
              <div class="bg-stone-100 p-1.5 rounded-2xl flex items-center mb-6 border border-stone-200">
                <button type="button" id="tab-auth-supabase_otp" 
                  class="auth-mode-tab flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${this.currentAuthMode === 'supabase_otp' ? 'bg-white text-emerald-900 shadow-sm' : 'text-stone-500'}" 
                  onclick="window.coeApp.switchAuthMode('supabase_otp')">
                  <i class="fa-solid fa-bolt text-amber-500"></i>
                  <span>Email OTP</span>
                </button>
                <button type="button" id="tab-auth-password" 
                  class="auth-mode-tab flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${this.currentAuthMode === 'password' ? 'bg-white text-emerald-900 shadow-sm' : 'text-stone-500'}" 
                  onclick="window.coeApp.switchAuthMode('password')">
                  <i class="fa-solid fa-key text-stone-600"></i>
                  <span>Password</span>
                </button>
              </div>

              <!-- MODE 1: Supabase Email OTP Sign-In -->
              <div id="auth-box-supabase" style="display: ${this.currentAuthMode === 'supabase_otp' ? 'block' : 'none'};">
                <form id="supabase-otp-login-form" onsubmit="event.preventDefault(); window.coeApp.handleSupabaseOtpLogin();" class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Institutional Email or Student Number *
                    </label>
                    <div class="relative">
                      <i class="fa-regular fa-envelope absolute left-4 top-3.5 text-stone-400"></i>
                      <input type="text" id="supabase-login-email" required autofocus autocomplete="email"
                        placeholder="e.g. 2023-10001 or student@icct.edu.ph"
                        class="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-700 focus:bg-white text-stone-900 transition">
                    </div>
                  </div>

                  <div class="p-2.5 rounded-xl ${isLiveSupabase ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' : 'bg-amber-50 border border-amber-300 text-amber-950'} text-xs flex items-center justify-between">
                    <span class="flex items-center gap-1.5">
                      <i class="fa-solid ${isLiveSupabase ? 'fa-cloud-check text-emerald-700' : 'fa-flask text-amber-600'}"></i>
                      <strong>${isLiveSupabase ? 'Supabase Live Cloud' : 'Sandbox Mode (Offline)'}</strong>
                    </span>
                    <button type="button" class="underline font-bold text-emerald-900 hover:text-emerald-700" onclick="window.coeApp.openSupabaseConfigModal()">Settings</button>
                  </div>

                  <button type="submit" id="btn-supabase-send-otp"
                    class="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-sm shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-paper-plane text-xs"></i>
                    <span>Send One-Time Password (OTP)</span>
                  </button>
                </form>
              </div>

              <!-- MODE 2: Traditional Password Sign-In -->
              <div id="auth-box-password" style="display: ${this.currentAuthMode === 'password' ? 'block' : 'none'};">
                <form id="login-form" onsubmit="event.preventDefault(); window.coeApp.handleLogin();" class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Username, Email, or Student ID *
                    </label>
                    <div class="relative">
                      <i class="fa-regular fa-id-card absolute left-4 top-3.5 text-stone-400"></i>
                      <input type="text" id="login-username" required autocomplete="username"
                        placeholder="e.g. developer, engr.mendoza, or 2023-10001"
                        class="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-700 focus:bg-white text-stone-900 transition">
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider">Password *</label>
                      <a href="javascript:void(0)" class="text-xs text-emerald-800 font-bold hover:underline" onclick="window.coeApp.openForgotPasswordModal()">Forgot Password?</a>
                    </div>
                    <div class="relative">
                      <i class="fa-solid fa-lock absolute left-4 top-3.5 text-stone-400"></i>
                      <input type="password" id="login-password" required autocomplete="current-password"
                        placeholder="Default: password123"
                        class="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-700 focus:bg-white text-stone-900 transition">
                    </div>
                  </div>

                  <button type="submit"
                    class="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-sm shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-right-to-bracket text-xs"></i>
                    <span>Sign In to Dashboard</span>
                  </button>
                </form>
              </div>

              <!-- Footer Utility Controls -->
              <div class="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs">
                <button type="button" class="text-stone-600 hover:text-emerald-800 font-semibold flex items-center gap-1.5 transition" onclick="window.coeApp.openSupabaseConfigModal()">
                  <i class="fa-solid fa-sliders text-stone-500"></i>
                  <span>Cloud Config</span>
                </button>
                <button type="button" class="text-stone-600 hover:text-emerald-800 font-semibold flex items-center gap-1.5 transition" onclick="window.coeApp.openEmailDispatchDrawer()">
                  <i class="fa-solid fa-inbox text-emerald-700"></i>
                  <span>Outbox (<span class="dispatched-email-badge">0</span>)</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    `;

    this.updateEmailDispatchBadge();
  }

  openSupabaseConfigModal() {
    const sb = window.CoeSupabaseAuth;
    const currentUrl = (sb && sb.config && sb.config.url && !sb.config.url.includes('your-project-id')) ? sb.config.url : '';
    const currentKey = (sb && sb.config && sb.config.anonKey && !sb.config.anonKey.includes('placeholder')) ? sb.config.anonKey : '';
    const isConnected = sb && !sb.isSandbox;

    const modalBody = `
      <div class="py-2 space-y-4">
        <div class="text-center">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto mb-2 text-xl shadow-sm">
            <i class="fa-solid fa-bolt"></i>
          </div>
          <h4 class="font-brand text-lg font-bold text-stone-900">Supabase Auth Settings</h4>
          <p class="text-stone-600 text-xs mt-1 max-w-sm mx-auto">
            Connect COE-Pay to your live Supabase project to dispatch real 6-digit OTP codes.
          </p>
        </div>

        <div class="p-3 rounded-xl ${isConnected ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' : 'bg-amber-50 border border-amber-300 text-amber-950'} text-xs">
          <div class="font-bold flex items-center gap-1.5">
            <i class="fa-solid ${isConnected ? 'fa-circle-check text-emerald-700' : 'fa-triangle-exclamation text-amber-600'}"></i>
            <span>${isConnected ? 'Connected to Live Supabase Cloud' : 'Running Offline Sandbox Simulation'}</span>
          </div>
          <div class="text-[11px] mt-1 text-stone-600">
            ${isConnected ? `Connected URL: <code>${currentUrl}</code>` : 'Simulating locally with pre-filled OTP codes.'}
          </div>
        </div>

        <form id="supabase-config-form" onsubmit="event.preventDefault(); window.coeApp.saveSupabaseConfig();" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Supabase Project URL *</label>
            <input type="url" id="sb-input-url" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-emerald-700 font-mono"
                   placeholder="https://your-project-id.supabase.co" value="${currentUrl}" required>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Supabase Anon Public Key *</label>
            <textarea id="sb-input-anon-key" rows="2" class="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-emerald-700 font-mono"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." required>${currentKey}</textarea>
          </div>
        </form>
      </div>
    `;

    const footer = `
      <div class="flex items-center justify-end gap-2.5 w-full">
        <button class="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs transition" onclick="window.coeApp.resetSupabaseConfigToSandbox()">
          Use Sandbox
        </button>
        <button class="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-1.5" onclick="window.coeApp.saveSupabaseConfig()">
          <i class="fa-solid fa-cloud-arrow-up text-[11px]"></i>
          <span>Save & Connect</span>
        </button>
      </div>
    `;

    this.showModal('Supabase Setup', modalBody, footer);
  }

  saveSupabaseConfig() {
    const url = document.getElementById('sb-input-url')?.value?.trim();
    const key = document.getElementById('sb-input-anon-key')?.value?.trim();

    if (!url || !key) {
      alert("Please enter both the Supabase Project URL and Anon Public Key.");
      return;
    }

    if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
      alert("Invalid Supabase URL format. It should look like: https://xxxx.supabase.co");
      return;
    }

    if (window.CoeSupabaseAuth && typeof window.CoeSupabaseAuth.updateConfig === 'function') {
      window.CoeSupabaseAuth.updateConfig(url, key);
    }
  }

  resetSupabaseConfigToSandbox() {
    if (confirm("Switch back to offline sandbox mode?")) {
      if (window.CoeSupabaseAuth && typeof window.CoeSupabaseAuth.resetToSandbox === 'function') {
        window.CoeSupabaseAuth.resetToSandbox();
      }
    }
  }

  async handleSupabaseOtpLogin() {
    const emailInput = document.getElementById('supabase-login-email')?.value;
    const btn = document.getElementById('btn-supabase-send-otp');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Dispatching OTP...`;
    }

    try {
      const res = await window.coeAuth.initiateSupabaseLogin(emailInput);
      this.showOtpModal({
        email: res.email,
        maskedEmail: res.maskedEmail,
        otpCode: res.otpCode,
        isRateLimitFallback: res.isRateLimitFallback,
        provider: res.provider,
        mode: 'login'
      });
      this.updateEmailDispatchBadge();
    } catch (err) {
      alert(err.message);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-paper-plane text-xs"></i> <span>Send One-Time Password (OTP)</span>`;
      }
    }
  }

  handleLogin() {
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;

    try {
      const otpSession = window.coeAuth.initiateLogin(u, p);
      this.showOtpModal(otpSession);
      this.updateEmailDispatchBadge();
    } catch (err) {
      alert(err.message);
    }
  }

  showOtpModal(otpSession) {
    this.currentOtpSession = otpSession || {};
    const mode = this.currentOtpSession.mode || 'login';
    const isRegister = mode === 'register';
    const email = otpSession.email || 'student@institution.edu.ph';

    const modalBody = `
      <div class="text-center py-2 space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center justify-center mx-auto text-xl shadow-sm">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        
        <div>
          <h4 class="font-brand text-lg font-bold text-stone-900">
            ${isRegister ? 'Confirm Student Registration' : '6-Digit Verification OTP'}
          </h4>
          <p class="text-stone-600 text-xs mt-1 max-w-sm mx-auto">
            Dispatched to registered email: <strong class="text-stone-800">${email}</strong>
          </p>
        </div>

        ${otpSession.isRateLimitFallback ? `
          <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs text-left">
            <i class="fa-solid fa-triangle-exclamation text-amber-700"></i>
            <span>Supabase rate limit reached. Fallback code <strong>${otpSession.otpCode}</strong> generated.</span>
          </div>` : ''}

        <form id="otp-verify-form" onsubmit="event.preventDefault(); window.coeApp.submitOtpVerification();" class="space-y-3">
          <div class="max-w-[240px] mx-auto">
            <input type="text" id="otp-input-code" maxlength="6" value="${otpSession.otpCode || ''}" autofocus required
                   placeholder="• • • • • •"
                   class="w-full text-center py-3 bg-stone-50 border-2 border-emerald-700/80 rounded-xl text-2xl font-bold tracking-[0.4em] text-stone-800 focus:outline-none focus:border-emerald-800">
          </div>
          
          <div id="otp-error-alert" class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs" style="display:none;"></div>
        </form>

        <div class="text-xs text-stone-500 flex flex-col items-center gap-1">
          <div id="otp-cooldown-text">Resend code in <strong id="otp-seconds-timer">60</strong>s</div>
          <button type="button" id="btn-resend-otp" disabled class="text-emerald-800 font-bold hover:underline disabled:opacity-50" onclick="window.coeApp.handleResendOtp()">
            Resend Verification Code
          </button>
        </div>
      </div>
    `;

    const footer = `
      <div class="flex items-center justify-between w-full">
        <button class="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs transition" onclick="window.coeApp.closeModal()">
          Back
        </button>
        <button id="btn-submit-otp" class="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-1.5" onclick="window.coeApp.submitOtpVerification()">
          <i class="fa-solid fa-shield-check text-[11px]"></i>
          <span>${isRegister ? 'Verify & Create' : 'Verify & Enter'}</span>
        </button>
      </div>
    `;

    this.showModal('Security Verification', modalBody, footer);
    this.startOtpCooldownTimer(60);
  }

  startOtpCooldownTimer(seconds = 60) {
    if (this.otpCooldownInterval) {
      clearInterval(this.otpCooldownInterval);
      this.otpCooldownInterval = null;
    }

    let remaining = seconds;
    const timerSpan = document.getElementById('otp-seconds-timer');
    const cooldownText = document.getElementById('otp-cooldown-text');
    const resendBtn = document.getElementById('btn-resend-otp');

    if (resendBtn) resendBtn.disabled = true;
    if (cooldownText) cooldownText.style.display = 'block';
    if (timerSpan) timerSpan.innerText = remaining;

    this.otpCooldownInterval = setInterval(() => {
      remaining -= 1;
      const el = document.getElementById('otp-seconds-timer');
      if (el) el.innerText = remaining;

      if (remaining <= 0) {
        clearInterval(this.otpCooldownInterval);
        this.otpCooldownInterval = null;
        const btn = document.getElementById('btn-resend-otp');
        const txt = document.getElementById('otp-cooldown-text');
        if (btn) btn.disabled = false;
        if (txt) txt.style.display = 'none';
      }
    }, 1000);
  }

  async submitOtpVerification() {
    const entered = document.getElementById('otp-input-code')?.value?.trim();
    const errAlert = document.getElementById('otp-error-alert');
    const submitBtn = document.getElementById('btn-submit-otp');

    if (!entered || entered.length !== 6) {
      if (errAlert) {
        errAlert.innerText = 'Please enter the complete 6-digit numeric OTP code.';
        errAlert.style.display = 'block';
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Verifying...`;
    }

    try {
      sessionStorage.removeItem('coepay_dev_impersonating');
      sessionStorage.removeItem('coepay_original_dev');

      const session = this.currentOtpSession || {};
      let user = null;

      if (session.mode === 'register') {
        user = await window.coeAuth.completeSupabaseRegistration(entered);
        if (this.otpCooldownInterval) clearInterval(this.otpCooldownInterval);
        this.closeModal();
        this.showToast(`Registration verified! Welcome, ${user.first_name || user.name || 'Student'}.`, 'success');
      } else if (session.mode === 'login' || window.coeAuth.pendingSupabaseEmail) {
        const targetEmail = session.email || window.coeAuth.pendingSupabaseEmail;
        user = await window.coeAuth.verifySupabaseLogin(targetEmail, entered);
        if (this.otpCooldownInterval) clearInterval(this.otpCooldownInterval);
        this.closeModal();
        this.showToast(`Login Successful! Directed to ${user.role.toUpperCase()} dashboard.`, 'success');
      } else {
        user = window.coeAuth.verifyOtp(entered);
        if (this.otpCooldownInterval) clearInterval(this.otpCooldownInterval);
        this.closeModal();
        this.showToast(`Login Successful! Directed to ${user.role.toUpperCase()} dashboard.`, 'success');
      }
    } catch (err) {
      if (errAlert) {
        errAlert.innerText = err.message || 'OTP verification failed. Please try again.';
        errAlert.style.display = 'block';
      } else {
        alert(err.message);
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        const isRegister = (this.currentOtpSession && this.currentOtpSession.mode === 'register');
        submitBtn.innerHTML = `<i class="fa-solid fa-shield-check text-[11px]"></i> <span>${isRegister ? 'Verify & Create' : 'Verify & Enter'}</span>`;
      }
    }
  }

  async handleResendOtp() {
    const resendBtn = document.getElementById('btn-resend-otp');
    const errAlert = document.getElementById('otp-error-alert');
    if (errAlert) errAlert.style.display = 'none';

    if (resendBtn) {
      resendBtn.disabled = true;
      resendBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
    }

    try {
      const session = this.currentOtpSession || {};
      if (session.mode === 'register') {
        const regData = window.coeAuth.pendingRegistrationData;
        if (!regData) throw new Error('No pending registration data found.');
        const res = await window.coeAuth.initiateSupabaseRegistration(regData);
        this.currentOtpSession.otpCode = res.otpCode;
        this.showToast(`New verification OTP sent to ${res.email}.`, 'info');
        const input = document.getElementById('otp-input-code');
        if (input && res.otpCode) input.value = res.otpCode;
      } else if (session.mode === 'login' && window.coeAuth.pendingSupabaseEmail) {
        const res = await window.coeAuth.initiateSupabaseLogin(window.coeAuth.pendingSupabaseEmail);
        this.currentOtpSession.otpCode = res.otpCode;
        this.showToast(`New verification OTP sent to ${res.email}.`, 'info');
        const input = document.getElementById('otp-input-code');
        if (input && res.otpCode) input.value = res.otpCode;
      } else {
        const res = window.coeAuth.resendOtp();
        this.showToast(`New OTP code (${res.otpCode}) dispatched to ${res.email}.`, 'info');
        const input = document.getElementById('otp-input-code');
        if (input) input.value = res.otpCode;
      }
      this.updateEmailDispatchBadge();
      this.startOtpCooldownTimer(60);
    } catch (err) {
      if (errAlert) {
        errAlert.innerText = err.message || 'Failed to resend OTP.';
        errAlert.style.display = 'block';
      } else {
        alert(err.message);
      }
      if (resendBtn) resendBtn.disabled = false;
    } finally {
      if (resendBtn) {
        resendBtn.innerHTML = `Resend Verification Code`;
      }
    }
  }

  openForgotPasswordModal() {
    const modalBody = `
      <div class="py-2 space-y-4">
        <div class="text-center">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center justify-center mx-auto mb-2 text-xl shadow-sm">
            <i class="fa-solid fa-key"></i>
          </div>
          <h4 class="font-brand text-lg font-bold text-stone-900">Password Recovery</h4>
          <p class="text-stone-600 text-xs mt-1 max-w-sm mx-auto">
            Input your registered email to receive a recovery code.
          </p>
        </div>

        <form id="forgot-password-form" onsubmit="event.preventDefault(); window.coeApp.submitForgotPassword();" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Registered Student Email *</label>
            <input type="email" id="forgot-email-input" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                   placeholder="e.g. sdimasuay13@gmail.com" required autofocus>
          </div>
        </form>
      </div>
    `;

    const footer = `
      <div class="flex items-center justify-end gap-2.5 w-full">
        <button class="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs transition" onclick="window.coeApp.closeModal()">
          Cancel
        </button>
        <button class="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-1.5" onclick="window.coeApp.submitForgotPassword()">
          <i class="fa-solid fa-paper-plane text-[11px]"></i>
          <span>Send Code</span>
        </button>
      </div>
    `;

    this.showModal('Forgot Password', modalBody, footer);
  }

  submitForgotPassword() {
    const email = document.getElementById('forgot-email-input')?.value;
    try {
      const res = window.coeAuth.requestPasswordReset(email);
      this.updateEmailDispatchBadge();
      this.showToast(`Reset code (${res.resetCode}) dispatched to ${res.email}`, 'success');
      this.showResetPasswordModal(res.email, res.resetCode, res.recipientName);
    } catch (err) {
      alert(err.message);
    }
  }

  showResetPasswordModal(email, defaultCode, recipientName) {
    const modalBody = `
      <div class="py-2 space-y-4">
        <div class="text-center">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto mb-2 text-xl shadow-sm">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h4 class="font-brand text-lg font-bold text-stone-900">Set New Password</h4>
          <p class="text-stone-600 text-xs mt-1">Dispatched to: <strong>${email}</strong></p>
        </div>

        <form id="reset-password-form" onsubmit="event.preventDefault(); window.coeApp.submitResetNewPassword('${email}');" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Verification Code *</label>
            <input type="text" id="reset-code-input" maxlength="6" value="${defaultCode}" required
                   class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900">
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">New Password *</label>
            <input type="password" id="reset-new-password" placeholder="Minimum 6 characters" required minlength="6"
                   class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900">
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Confirm New Password *</label>
            <input type="password" id="reset-confirm-password" placeholder="Re-type new password" required minlength="6"
                   class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900">
          </div>

          <div id="reset-error-alert" class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs" style="display:none;"></div>
        </form>
      </div>
    `;

    const footer = `
      <div class="flex items-center justify-end gap-2.5 w-full">
        <button class="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs transition" onclick="window.coeApp.closeModal()">
          Cancel
        </button>
        <button class="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-1.5" onclick="window.coeApp.submitResetNewPassword('${email}')">
          <i class="fa-solid fa-check text-[11px]"></i>
          <span>Save Password</span>
        </button>
      </div>
    `;

    this.showModal('Reset Your Password', modalBody, footer);
  }

  submitResetNewPassword(email) {
    const code = document.getElementById('reset-code-input')?.value;
    const newPass = document.getElementById('reset-new-password')?.value;
    const confirmPass = document.getElementById('reset-confirm-password')?.value;
    const errAlert = document.getElementById('reset-error-alert');

    if (!code) {
      if (errAlert) { errAlert.innerText = "Please enter the verification code sent to your email."; errAlert.style.display = 'block'; }
      return;
    }
    if (!newPass || newPass.length < 6) {
      if (errAlert) { errAlert.innerText = "New password must be at least 6 characters long."; errAlert.style.display = 'block'; }
      return;
    }
    if (newPass !== confirmPass) {
      if (errAlert) { errAlert.innerText = "Passwords do not match."; errAlert.style.display = 'block'; }
      return;
    }

    try {
      const res = window.coeAuth.completePasswordReset(email, code, newPass);
      this.closeModal();
      this.showToast(res.message, 'success');
      this.updateEmailDispatchBadge();

      const uInput = document.getElementById('login-username');
      const pInput = document.getElementById('login-password');
      if (uInput) uInput.value = email;
      if (pInput) pInput.value = newPass;

      alert(`✅ Password Successfully Updated!\n\nYour new password is now active.`);
    } catch (err) {
      if (errAlert) {
        errAlert.innerText = err.message;
        errAlert.style.display = 'block';
      } else {
        alert(err.message);
      }
    }
  }

  updateEmailDispatchBadge() {
    const emails = (window.coepayDb && window.coepayDb.getDispatchedEmails()) || [];
    const count = emails.length;
    document.querySelectorAll('.dispatched-email-badge').forEach(el => {
      el.textContent = count;
    });
  }

  openEmailDispatchDrawer() {
    const emails = window.coepayDb.getDispatchedEmails();

    const emailRowsHtml = emails.length === 0 ? `
      <div class="text-center py-6 text-stone-400">
        <i class="fa-regular fa-envelope-open text-3xl"></i>
        <p class="text-xs mt-2">No system emails dispatched yet.</p>
      </div>
    ` : emails.map(m => {
      return `
        <div class="p-3 bg-white border border-stone-200 rounded-xl mb-2.5">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-xs font-bold text-stone-800">${m.subject}</span>
            <span class="text-[10px] text-stone-400 font-mono">${m.dispatched_at}</span>
          </div>
          <div class="text-[11px] text-stone-600 mb-2">
            <strong>To:</strong> ${m.recipient_name} &lt;${m.recipient_email}&gt;
          </div>
          <div class="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono text-stone-800 whitespace-pre-wrap max-h-28 overflow-y-auto">${m.body_text}</div>
        </div>
      `;
    }).join('');

    const modalBody = `
      <div class="max-h-[500px] overflow-y-auto space-y-2">
        <div class="flex items-center justify-between pb-2 border-b border-stone-200">
          <p class="text-xs text-stone-600 mb-0">Total: <strong>${emails.length}</strong> transmissions</p>
          <button class="text-xs text-emerald-800 font-bold hover:underline" onclick="window.coeApp.openEmailDispatchDrawer()">
            <i class="fa-solid fa-rotate"></i> Refresh
          </button>
        </div>
        ${emailRowsHtml}
      </div>
    `;

    const footer = `
      <button class="px-4 py-2 rounded-xl bg-emerald-800 text-amber-200 font-bold text-xs" onclick="window.coeApp.closeModal()">Close Outbox</button>
    `;

    this.showModal('COE-Pay System Mail Outbox', modalBody, footer);
  }

  switchDemoUser(username) {
    const currentUser = window.coeAuth.getUser();
    const isDeveloper = currentUser && currentUser.role === 'developer';
    const isImpersonating = sessionStorage.getItem('coepay_dev_impersonating') === 'true';

    if (!isDeveloper && !isImpersonating) {
      alert('Access Denied: Role switching is restricted to the System Developer (Dave Guiyab).');
      return;
    }

    try {
      if (username === 'developer') {
        sessionStorage.removeItem('coepay_dev_impersonating');
        sessionStorage.removeItem('coepay_original_dev');
      } else {
        sessionStorage.setItem('coepay_dev_impersonating', 'true');
      }

      window.coeAuth.loginWithUsername(username, true);
      this.showToast(`Switched view to ${username}`, 'info');
    } catch (err) {
      alert(err.message);
    }
  }

  returnToDeveloper() {
    sessionStorage.removeItem('coepay_dev_impersonating');
    sessionStorage.removeItem('coepay_original_dev');
    try {
      window.coeAuth.loginWithUsername('developer', true);
      this.showToast('Returned to Developer Console', 'success');
    } catch (err) {
      alert(err.message);
    }
  }

  confirmResetDb() {
    const currentUser = window.coeAuth.getUser();
    if (!currentUser || currentUser.role !== 'developer') {
      alert('Access Denied.');
      return;
    }

    if (confirm("Reset COE-Pay database to its initial seed state?")) {
      window.coepayDb.resetToSeed();
      sessionStorage.removeItem('coepay_dev_impersonating');
      sessionStorage.removeItem('coepay_original_dev');
      window.coeAuth.loginWithUsername('developer', false);
      this.showToast("Database restored to default seed.", "info");
      this.renderApp();
    }
  }

  showModal(title, bodyHtml, footerHtml = null, sizeClass = '') {
    const modalBackdrop = document.getElementById('global-modal-backdrop');
    const modalContainer = document.getElementById('global-modal-container');
    const modalTitle = document.getElementById('global-modal-title');
    const modalBody = document.getElementById('global-modal-body');
    const modalFooter = document.getElementById('global-modal-footer');

    if (!modalBackdrop) return;

    modalTitle.innerHTML = title;
    modalBody.innerHTML = bodyHtml;

    if (footerHtml) {
      modalFooter.innerHTML = footerHtml;
      modalFooter.style.display = 'flex';
    } else {
      modalFooter.innerHTML = '';
      modalFooter.style.display = 'none';
    }

    modalBackdrop.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (this.otpCooldownInterval) {
      clearInterval(this.otpCooldownInterval);
      this.otpCooldownInterval = null;
    }
    const modalBackdrop = document.getElementById('global-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const borderCol = type === 'success' ? 'border-emerald-600 text-emerald-950' : type === 'warning' ? 'border-amber-500 text-amber-950' : 'border-stone-800 text-stone-900';
    toast.className = `p-3.5 bg-white border-l-4 ${borderCol} rounded-xl shadow-lg border border-stone-200 text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 pointer-events-auto transform translate-y-2 opacity-0`;

    let icon = 'fa-circle-info text-emerald-800';
    if (type === 'success') icon = 'fa-circle-check text-emerald-600';
    if (type === 'warning') icon = 'fa-triangle-exclamation text-amber-600';
    if (type === 'danger') icon = 'fa-circle-xmark text-rose-600';

    toast.innerHTML = `
      <i class="fa-solid ${icon} text-sm"></i>
      <span class="flex-1">${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-4');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

window.coeApp = new CoeApp();