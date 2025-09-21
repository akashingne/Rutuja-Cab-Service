
function toggleMenu(){
  document.querySelector('.nav').classList.toggle('show');
}

function estimateFare(){
  const km = parseFloat(document.getElementById('est-distance').value || '0');
  const cab = document.getElementById('est-cabtype').value;
  const result = document.getElementById('est-result');
  fetch("https://raw.githubusercontent.com/akashingne/Rutuja-Cab-Service/refs/heads/main/data/pricing.json")
      .then(response => response.json())
      .then(pricing => {
        const fare = Math.round(pricing.base + km * pricing.perKm[cab] + pricing.driverAllowance);
        result.textContent = `Estimated fare: ₹${fare.toLocaleString('en-IN')} (includes driver allowance)`;
      })
      .catch(error => console.error("Error fetching JSON:", error));
}

function renderRoutes(){
  fetch("https://raw.githubusercontent.com/akashingne/Rutuja-Cab-Service/refs/heads/main/data/routes.json")
  .then(response => response.json())
  .then(data => {
    const wrap = document.getElementById('routes');
    if(!wrap) return;
    wrap.innerHTML = data.map(r => {
      const fare = Math.round(100 + r.km * 12 + 250);
      return `
        <div class="route">
          <img alt="${r.from} to ${r.to}" src="${r.img}" loading="lazy">
          <div class="body">
            <h4>${r.from} → ${r.to}</h4>
            <p class="meta">${r.km} km • Est. ₹${fare.toLocaleString('en-IN')}</p>
            <button class="btn small" onclick="prefill('${r.from}','${r.to}',${r.km})">Book</button>
          </div>
        </div>
      `;
    }).join('');
  })
  .catch(error => console.error("Error fetching JSON:", error));
}

function buildDestinations(){
  const grid = document.getElementById('dest-grid');
  if(!grid) return;
  fetch("https://raw.githubusercontent.com/akashingne/Rutuja-Cab-Service/refs/heads/main/data/destinations.json")
      .then(response => response.json())
      .then(data => {
        grid.innerHTML = data.map((d, i) => `
        <article class="dest" data-region="${d.region}" data-name="${d.name.toLowerCase()}">
          <img src="${d.image}" alt="${d.name}" loading="lazy">
          <div class="body">
            <h4>${d.name}</h4>
            <p class="meta">${d.region} • Typical from ${d.from} — ₹${d.approxFare.toLocaleString('en-IN')}</p>
            <button class="btn small" onclick="prefill('${d.from}','${d.to}', 0)">Book</button>
          </div>
        </article>
      `).join('');
      })
      .catch(error => console.error("Error fetching JSON:", error));
}

function filterDestinations(){
  const q = (document.getElementById('search-dest').value || '').toLowerCase();
  const region = document.getElementById('filter-region').value;
  document.querySelectorAll('.dest').forEach(el => {
    const matchesQ = el.dataset.name.includes(q);
    const matchesRegion = region === 'all' || el.dataset.region === region;
    el.style.display = (matchesQ && matchesRegion) ? '' : 'none';
  });
}

function prefill(from, to, km){
  window.location.href = `booking.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&km=${km}`;
}

function prefillTest(){
  document.querySelector('[name=pickup]').value = 'Pune';
  document.querySelector('[name=drop]').value = 'Mumbai';
  document.querySelector('[name=date]').valueAsNumber = Date.now() + 86400000;
  document.querySelector('[name=time]').value = '09:00';
  document.querySelector('[name=cab]').value = 'sedan';
  document.querySelector('[name=distance]').value = 150;
}

function calcAndShowFare(){
  const km = parseFloat(document.querySelector('[name=distance]').value || '0');
  const cab = document.querySelector('[name=cab]').value;
  fetch("https://raw.githubusercontent.com/akashingne/Rutuja-Cab-Service/refs/heads/main/data/pricing.json")
      .then(response => response.json())
      .then(pricing => {
        const fare = Math.round(pricing.base + km * pricing.perKm[cab] + pricing.driverAllowance);
        document.getElementById('fare-output').textContent = `Estimated fare: ₹${fare.toLocaleString('en-IN')}`;
      })
      .catch(error => console.error("Error fetching JSON:", error));
}

function initBooking(){
  const datalist = document.getElementById('cities');
  if(datalist){
    fetch("https://raw.githubusercontent.com/akashingne/Rutuja-Cab-Service/refs/heads/main/data/destinations.json")
      .then(response => response.json())
      .then(data => {
        datalist.innerHTML = data.map(c => `<option value="${c}"></option>`).join('');
      })
      .catch(error => console.error("Error fetching JSON:", error));
  }
  const params = new URLSearchParams(location.search);
  const from = params.get('from');
  const to = params.get('to');
  const km = params.get('km');
  if(from) document.querySelector('[name=pickup]').value = from;
  if(to) document.querySelector('[name=drop]').value = to;
  if(km && +km>0) document.querySelector('[name=distance]').value = km;

  document.getElementById('booking-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    document.getElementById('confirm').classList.remove('hidden');
    document.getElementById('confirm-data').textContent = JSON.stringify(data, null, 2);
    e.target.reset();
    window.scrollTo({ top: document.getElementById('confirm').offsetTop - 60, behavior: 'smooth' });
  });
}

function initContact(){
  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('contact-ok').classList.remove('hidden');
    e.target.reset();
  });
}

function estimateOnLoad(){
  if(document.getElementById('routes')) renderRoutes();
  if(document.getElementById('dest-grid')) buildDestinations();
  if(document.getElementById('booking-form')) initBooking();
  if(document.getElementById('contact-form')) initContact();
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
}
document.addEventListener('DOMContentLoaded', estimateOnLoad);

(function () {
  try {
    const el = document.getElementById('whatsapp-button');
    if (!el) return;
    const phone = el.getAttribute('data-phone') || '917769963488';
    const message = el.getAttribute('data-message') || 'Hello! I want to book a taxi.';
    const url = 'https://wa.me/' + encodeURIComponent(phone) + '?text=' + encodeURIComponent(message);
    el.setAttribute('href', url);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
    el.setAttribute('aria-label', 'Chat with us on WhatsApp');
  } catch (err) {
    console.warn('WhatsApp widget init error:', err);
  }
})();
