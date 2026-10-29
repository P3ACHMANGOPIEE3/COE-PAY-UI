/**
 * COE-Pay: Authentication & Session Controller
 * Restored Campus Picture Layout & Original Auth Flow
 */

const CoeAuth = {
  currentUser: null,
  currentOtpSession: null,
  activeTab: 'otp', // 'otp' | 'password'

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  getProfile() {
    return this.getCurrentUser();
  },

  getCurrentUser() {
    if (this.currentUser) return this.currentUser;
    try {
      const stored = sessionStorage.getItem('coepay_current_user') || localStorage.getItem('coepay_current_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      }
    } catch (e) {}
    return null;
  },

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      sessionStorage.setItem('coepay_current_user', JSON.stringify(user));
      localStorage.setItem('coepay_current_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('coepay_current_user');
      localStorage.removeItem('coepay_current_user');
    }
  },

  initiateLogin(username, password) {
    const clean = (username || '').trim().toLowerCase();
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    
    let role = 'student';
    let name = 'Christian Dave Guiyab';
    let email = `${clean}@icct.edu.ph`;

    if (clean === 'developer' || clean.includes('dev')) {
      role = 'developer';
      name = 'Dave Guiyab';
    } else if (clean.includes('mendoza') || clean.includes('admin')) {
      role = 'coordinator';
      name = 'Engr. Ivanlee Mendoza';
    } else if (clean.includes('officer') || clean.includes('pearl')) {
      role = 'officer';
      name = 'Pearl Catequista';
    } else if (clean.includes('10004') || clean.includes('opana')) {
      name = 'Jerome Opana';
    }

    this.currentOtpSession = {
      user: { username: clean, role, full_name: name, email },
      otpCode: otpCode,
      mode: 'login'
    };

    return this.currentOtpSession;
  },

  verifyOtp(code) {
    const user = (this.currentOtpSession && this.currentOtpSession.user) 
      ? this.currentOtpSession.user 
      : { username: 'developer', role: 'developer', email: 'dev@icct.edu.ph' };

    this.setCurrentUser(user);
    this.currentOtpSession = null;
    return user;
  },

  resendOtp() {
    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    if (this.currentOtpSession) this.currentOtpSession.otpCode = newCode;
    return { otpCode: newCode, email: this.currentOtpSession ? this.currentOtpSession.user.email : 'user@icct.edu.ph' };
  },

  loginWithUsername(username, skipOtp = false) {
    const clean = (username || 'developer').toLowerCase();
    let role = 'student';
    let name = 'Christian Dave Guiyab';

    if (clean === 'developer') { role = 'developer'; name = 'Dave Guiyab'; }
    else if (clean.includes('mendoza')) { role = 'coordinator'; name = 'Engr. Ivanlee Mendoza'; }
    else if (clean.includes('officer') || clean.includes('pearl')) { role = 'officer'; name = 'Pearl Catequista'; }
    else if (clean.includes('10004') || clean.includes('opana')) { role = 'student'; name = 'Jerome Opana'; }

    const user = { username: clean, role, full_name: name, email: `${clean}@icct.edu.ph` };
    this.setCurrentUser(user);
    if (window.coeApp && typeof window.coeApp.renderApp === 'function') {
      window.coeApp.renderApp();
    } else {
      location.reload();
    }
    return user;
  },

  confirmLogout() {
    if (confirm("Are you sure you want to log out of COE-Pay?")) {
      this.logout();
    }
  },

  logout() {
    this.setCurrentUser(null);
    sessionStorage.clear();
    localStorage.clear();
    location.reload();
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  renderLogin() {
    this.render();
  },

  render() {
    const container = document.getElementById('main-app-container') || 
                      document.getElementById('login-view-container') || 
                      document.querySelector('main');
    if (!container) return;

    ['student-view-container', 'admin-view-container', 'personnel-view-container', 'developer-view-container'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });

    container.className = "relative min-h-[calc(100vh-140px)] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden";

    container.innerHTML = `
      <!-- FULL-SCREEN BLURRED CAMPUS BACKDROP -->
      <div class="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img src="assets/cainta-campus.jpeg" 
             alt="ICCT Campus" 
             class="w-full h-full object-cover object-center filter blur-md scale-105"
             onerror="if(!this.dataset.retry){this.dataset.retry=1;this.src='assets/icct-building.png';}">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"></div>
      </div>

      <!-- 2-COLUMN HERO LAYOUT -->
      <div class="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <!-- KALIWANG COLUMN: Campus Facade Card na may Picture -->
        <div class="lg:col-span-7 space-y-4">
          <div class="space-y-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <i class="fa-solid fa-building-columns"></i> ICCT Colleges Cainta Main Campus
            </span>
            <h1 class="text-3xl sm:text-4xl font-extrabold font-brand tracking-tight text-white drop-shadow-md">
              Institute of Creative Computer Technology
            </h1>
            <p class="text-sm text-slate-200 max-w-xl drop-shadow-sm">
              Centralized Student Payment Authorization, Collection, and Academic Clearance Gateway.
            </p>
          </div>

          <div class="relative rounded-3xl overflow-hidden border-4 border-white/80 shadow-2xl bg-slate-900 aspect-video max-w-2xl">
            <img src="assets/cainta-campus.jpeg" 
                 alt="ICCT Colleges Cainta Main Campus" 
                 class="w-full h-full object-cover"
                 onerror="if(!this.dataset.retry){this.dataset.retry=1;this.src='assets/icct-building.png';}">
            
            <div class="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs border border-white/60 shadow-sm">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span class="font-semibold text-slate-800">Main Campus Facade • Gate 3</span>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">Cainta, Rizal</span>
            </div>
          </div>
        </div>

        <!-- KANANG COLUMN: Sign in Form Card -->
        <div class="lg:col-span-5 w-full max-w-md mx-auto">
          <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl space-y-5">
            
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">PORTAL ACCESS</span>
                <h2 class="text-xl font-extrabold font-brand text-slate-900">Sign in to COE-Pay</h2>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-lg">
                <i class="fa-solid fa-lock"></i>
              </div>
            </div>

            <!-- Switcher: OTP vs Password -->
            <div class="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold font-mono">
              <button type="button" class="flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${this.activeTab === 'otp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}"
                      onclick="window.coeAuth.switchTab('otp')">
                <i class="fa-solid fa-bolt text-amber-500"></i>
                <span>Email OTP</span>
              </button>
              <button type="button" class="flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${this.activeTab === 'password' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}"
                      onclick="window.coeAuth.switchTab('password')">
                <i class="fa-solid fa-key text-slate-400"></i>
                <span>Password</span>
              </button>
            </div>

            <!-- Form -->
            <form onsubmit="event.preventDefault(); window.coeAuth.handleSubmit();" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono text-[10px]">
                  INSTITUTIONAL EMAIL OR STUDENT NUMBER *
                </label>
                <div class="relative">
                  <input type="text" id="coe-login-input" 
                         value="jerome.opana10212002@"
                         placeholder="e.g. 2023-10001 or engr.mendoza@icct.edu.ph" required
                         class="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition">
                  <i class="fa-regular fa-envelope text-slate-400 absolute left-3.5 top-3 text-xs"></i>
                </div>
              </div>

              ${this.activeTab === 'password' ? `
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono text-[10px]">
                    PASSWORD *
                  </label>
                  <div class="relative">
                    <input type="password" id="coe-login-password" placeholder="••••••••" required
                           class="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition">
                    <i class="fa-solid fa-lock text-slate-400 absolute left-3.5 top-3 text-xs"></i>
                  </div>
                </div>
              ` : ''}

              <div class="p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-center justify-between text-xs text-amber-950">
                <div class="flex items-center gap-2">
                  <i class="fa-solid fa-flask-vial text-amber-700"></i>
                  <span class="font-semibold text-[11px]">Sandbox Mode (Offline)</span>
                </div>
                <span class="text-[10px] font-mono text-amber-800 font-bold hover:underline cursor-pointer" onclick="window.coeApp && window.coeApp.openSupabaseConfigModal && window.coeApp.openSupabaseConfigModal()">Settings</span>
              </div>

              <button type="submit" 
                      class="w-full py-3 rounded-2xl bg-[#0f5b41] hover:bg-[#0c4a35] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 font-mono cursor-pointer">
                <i class="fa-solid ${this.activeTab === 'otp' ? 'fa-paper-plane' : 'fa-right-to-bracket'} text-xs"></i>
                <span>${this.activeTab === 'otp' ? 'Send One-Time Password (OTP)' : 'Sign In'}</span>
              </button>
            </form>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span class="hover:text-slate-800 transition cursor-pointer flex items-center gap-1.5" onclick="window.coeApp && window.coeApp.openSupabaseConfigModal && window.coeApp.openSupabaseConfigModal()">
                <i class="fa-solid fa-sliders text-emerald-700"></i> Cloud Config
              </span>
              <span class="hover:text-slate-800 transition cursor-pointer flex items-center gap-1.5" onclick="window.coeApp && window.coeApp.openEmailDispatchDrawer && window.coeApp.openEmailDispatchDrawer()">
                <i class="fa-solid fa-inbox text-amber-600"></i> Outbox (0)
              </span>
            </div>

          </div>
        </div>

      </div>
    `;
  },

  handleSubmit() {
    const val = document.getElementById('coe-login-input')?.value?.trim();
    if (!val) return;
    this.loginWithUsername(val);
  }
};

window.coeAuth = CoeAuth;
window.CoeAuth = CoeAuth;