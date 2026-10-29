/**
 * COE-Pay: Receipt Generator & Printable E-Receipt Helper
 * Persona Integration: Pearl Catequista (Treasury) & Student Portal
 */

const CoeReceiptHelper = {
  renderReceiptModal(receiptData) {
    this.closeModal();

    const data = receiptData || {
      receiptNo: 'OR-2026-' + Math.floor(1000 + Math.random() * 9000),
      studentNo: '2023-10001',
      studentName: 'Christian Dave Guiyab',
      itemTitle: 'Departmental Shirt (Batch 2026)',
      amount: '450.00',
      refNo: '9028129481023',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      cashier: 'Pearl Catequista (Collection Officer)'
    };

    const titleHtml = `<i class="fa-solid fa-receipt text-amber-300 mr-2"></i><span>Official Institutional E-Receipt</span>`;

    const bodyHtml = `
      <div id="printable-official-receipt" class="space-y-4 text-xs font-sans bg-white p-2">
        
        <!-- Header Receipt Slip -->
        <div class="text-center pb-3 border-b-2 border-dashed border-slate-200 space-y-1">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 text-amber-300 flex items-center justify-center font-bold text-lg mx-auto shadow-xs">
            <i class="fa-solid fa-microchip"></i>
          </div>
          <h4 class="font-black font-brand text-sm text-slate-900 mt-2">ICCT COLLEGES FOUNDATION, INC.</h4>
          <p class="text-[10px] text-slate-500 font-mono uppercase tracking-tight">College of Engineering & Digital Technology</p>
          <div class="pt-1">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono border border-emerald-300">
              OFFICIAL ELECTRONIC RECEIPT
            </span>
          </div>
        </div>

        <!-- Receipt Metadata Table -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 font-mono text-[11px]">
          <div class="flex justify-between">
            <span class="text-slate-400">Official Receipt #:</span>
            <span class="font-bold text-slate-900">${data.receiptNo}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">GCash Ref No:</span>
            <span class="font-bold text-slate-900">${data.refNo}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Student No:</span>
            <span class="font-bold text-slate-800">${data.studentNo}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Payor / Student:</span>
            <span class="font-bold text-slate-800 font-sans">${data.studentName}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Particulars:</span>
            <span class="font-bold text-slate-800 font-sans">${data.itemTitle}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Date & Time:</span>
            <span class="text-slate-600">${data.date}</span>
          </div>
          <div class="flex justify-between pt-2.5 border-t border-slate-200">
            <span class="text-slate-500 font-bold uppercase text-[10px]">TOTAL AMOUNT PAID:</span>
            <span class="font-black text-emerald-800 text-base">₱${data.amount}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Authorized Officer:</span>
            <span class="font-semibold text-slate-700">${data.cashier}</span>
          </div>
        </div>

        <div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
          <p class="text-[10px] text-slate-400 font-mono">
            This digital receipt serves as official proof of payment for department clearance validation.
          </p>
          <div class="text-[9px] font-mono text-emerald-700 font-semibold">
            Status: Immutable Ledger Hash Verified
          </div>
        </div>
      </div>
    `;

    const footerHtml = `
      <div class="flex items-center justify-between w-full gap-2">
        <button type="button" onclick="CoeReceiptHelper.closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer">
          Close
        </button>
        <button type="button" onclick="window.print()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 text-amber-200 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-print text-xs"></i>
          <span>Print / Save PDF</span>
        </button>
      </div>
    `;

    this.injectModal(titleHtml, bodyHtml, footerHtml);
  },

  injectModal(titleHtml, bodyHtml, footerHtml) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'receipt-injected-modal';
    modalDiv.className = 'fixed inset-0 z-[9999999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto';
    modalDiv.innerHTML = `
      <div class="bg-white rounded-3xl border border-white/90 shadow-[0_25px_70px_rgba(0,0,0,0.5)] overflow-hidden w-full max-w-md mx-auto flex flex-col my-auto transition-all transform scale-100">
        <div class="px-7 py-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shadow-sm">
          <h3 class="font-brand font-black text-base flex items-center">${titleHtml}</h3>
          <button type="button" onclick="CoeReceiptHelper.closeModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition cursor-pointer">
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
    const existing = document.getElementById('receipt-injected-modal');
    if (existing) existing.remove();
  }
};

window.CoeReceiptHelper = CoeReceiptHelper;