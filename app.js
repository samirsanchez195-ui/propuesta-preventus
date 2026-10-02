/* ==========================================================================
   PROPUESTA COMERCIAL PREVENTUS - INTERACTIVE APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. ROI & Funnel Simulator Logic
  initSimulator();

  // 3. Header Scroll Effect
  initHeaderScroll();
});

function initSimulator() {
  // Controls
  const inputBudget = document.getElementById('inputBudget');
  const inputCpc = document.getElementById('inputCpc');
  const inputQualRate = document.getElementById('inputQualRate');
  const inputQuoteRate = document.getElementById('inputQuoteRate');
  const inputCloseRate = document.getElementById('inputCloseRate');
  const inputTicket = document.getElementById('inputTicket');
  const toggleGoogleModule = document.getElementById('toggleGoogleModule');

  if (!inputBudget) return;

  // Value Display Labels
  const valBudget = document.getElementById('valBudget');
  const valCpc = document.getElementById('valCpc');
  const valQualRate = document.getElementById('valQualRate');
  const valQuoteRate = document.getElementById('valQuoteRate');
  const valCloseRate = document.getElementById('valCloseRate');
  const valTicket = document.getElementById('valTicket');

  // Result Displays
  const resConversationsMonth = document.getElementById('resConversationsMonth');
  const resConversationsWeek = document.getElementById('resConversationsWeek');
  const resQualified = document.getElementById('resQualified');
  const resQuotes = document.getElementById('resQuotes');
  const resClients = document.getElementById('resClients');
  const resRevenue = document.getElementById('resRevenue');
  const resTotalInv = document.getElementById('resTotalInv');
  const resRoas = document.getElementById('resRoas');
  const resCac = document.getElementById('resCac');

  const adminCostFixed = 2000000; // Fixed administration fee COP
  const googleModuleCost = 5000000; // Optional Google Search module COP

  function calculate() {
    const budget = parseFloat(inputBudget.value) || 3000000;
    const cpc = parseFloat(inputCpc.value) || 7500;
    let qualRate = (parseFloat(inputQualRate.value) / 100) || 0.30;
    const quoteRate = (parseFloat(inputQuoteRate.value) / 100) || 0.50;
    const closeRate = (parseFloat(inputCloseRate.value) / 100) || 0.20;
    const ticket = parseFloat(inputTicket.value) || 2500000;
    const isGoogleEnabled = toggleGoogleModule ? toggleGoogleModule.checked : false;

    // Update Slider Value Displays
    valBudget.textContent = formatCOP(budget);
    valCpc.textContent = formatCOP(cpc);
    valQualRate.textContent = `${inputQualRate.value}%`;
    valQuoteRate.textContent = `${inputQuoteRate.value}%`;
    valCloseRate.textContent = `${inputCloseRate.value}%`;
    valTicket.textContent = formatCOP(ticket);

    // Google Module Additions
    let totalAdInvestment = budget;
    let googleConversations = 0;

    if (isGoogleEnabled) {
      totalAdInvestment += googleModuleCost;
      // Google leads have higher commercial intent -> estimated Google CPC ~$25,000 COP for high intent SST keywords
      googleConversations = Math.round(googleModuleCost / 25000); 
      // Boost qualification rate slightly due to high search intent
      qualRate = Math.min(0.80, qualRate + 0.15); 
    }

    // Funnel Computations
    const baseConversations = Math.round(budget / cpc);
    const monthlyConversations = baseConversations + googleConversations;
    const weeklyConversations = Math.round(monthlyConversations / 4);

    const qualifiedLeads = Math.round(monthlyConversations * qualRate);
    const quotesGenerated = Math.round(qualifiedLeads * quoteRate);
    const clientsAcquired = Math.round(quotesGenerated * closeRate);

    const totalRevenue = clientsAcquired * ticket;
    const totalInvestment = totalAdInvestment + adminCostFixed;
    
    const roas = totalInvestment > 0 ? (totalRevenue / totalInvestment).toFixed(1) : 0;
    const cac = clientsAcquired > 0 ? Math.round(totalInvestment / clientsAcquired) : 0;

    // Update DOM Results
    if (resConversationsMonth) resConversationsMonth.textContent = monthlyConversations.toLocaleString('es-CO');
    if (resConversationsWeek) {
      resConversationsWeek.textContent = isGoogleEnabled 
        ? `~${weeklyConversations} por semana (Meta + Google)` 
        : `~${weeklyConversations} por semana`;
    }
    if (resQualified) resQualified.textContent = qualifiedLeads.toLocaleString('es-CO');
    if (resQuotes) resQuotes.textContent = quotesGenerated.toLocaleString('es-CO');
    if (resClients) resClients.textContent = clientsAcquired.toLocaleString('es-CO');

    if (resRevenue) resRevenue.textContent = formatCOP(totalRevenue);
    if (resTotalInv) resTotalInv.textContent = formatCOP(totalInvestment);
    if (resRoas) resRoas.textContent = `${roas}x (${Math.round(roas * 100)}%)`;
    if (resCac) resCac.textContent = clientsAcquired > 0 ? formatCOP(cac) : 'N/A';
  }

  // Event Listeners
  [inputBudget, inputCpc, inputQualRate, inputQuoteRate, inputCloseRate, inputTicket].forEach(input => {
    input.addEventListener('input', calculate);
  });

  if (toggleGoogleModule) {
    toggleGoogleModule.addEventListener('change', calculate);
  }

  // Initial Calculation
  calculate();
}

function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount) + ' COP';
}

function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      header.style.padding = '0.6rem 0';
    } else {
      header.style.boxShadow = 'none';
      header.style.padding = '0.85rem 0';
    }
  });
}
