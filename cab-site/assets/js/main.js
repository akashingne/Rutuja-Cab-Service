
const destinations = [
  {
    name: "Mumbai (Gateway of India)",
    region: "Konkan",
    image: "https://cdn.jsdelivr.net/gh/akashingne/images/Mumbai_03-2016_30_Gateway_of_India.webp",
    approxFare: 1800,
    from: "Pune",
    to: "Mumbai"
  },
  {
    name: "Pune (Shaniwar Wada)",
    region: "Western Ghats",
    image: "https://cdn.jsdelivr.net/gh/akashingne/images/Shaniwar_wada_(pune).webp",
    approxFare: 1600,
    from: "Mumbai",
    to: "Pune"
  },
  {
    name: "Ajanta Caves (Aurangabad)",
    region: "Marathwada",
    image: "https://cdn.jsdelivr.net/gh/akashingne/images/Cave_26,_Ajanta.webp",
    approxFare: 4800,
    from: "Aurangabad",
    to: "Ajanta Caves"
  },
  {
    name: "Mahabaleshwar",
    region: "Western Ghats",
    image: "https://cdn.jsdelivr.net/gh/akashingne/images/Panoramic_view_from_Elphinstone_Point.webp",
    approxFare: 2800,
    from: "Pune",
    to: "Mahabaleshwar"
  },
  {
    name: "Lonavala (Bhushi Dam)",
    region: "Western Ghats",
    image: "https://cdn.jsdelivr.net/gh/akashingne/images/Bhushi_dam.webp",
    approxFare: 2200,
    from: "Mumbai",
    to: "Lonavala"
  },
  {
    name: "Shirdi",
    region: "Khandesh",
    image: "https://cdn.jsdelivr.net/gh/akashingne/images/Shirdi_Sai_Baba_Samadhi.webp",
    approxFare: 3800,
    from: "Pune",
    to: "Shirdi"
  },
  {
    name: "Alibaug",
    region: "Konkan",
    image: "https://cdn.jsdelivr.net/gh/akashingne/images/Alibag1.webp",
    approxFare: 1900,
    from: "Mumbai",
    to: "Alibaug"
  },
  {
    name: "Nashik (Sula Vineyards)",
    region: "Khandesh",
    image: "https://cdn.jsdelivr.net/gh/akashingne/images/Sula%E2%80%99s_estate_vineyards_in_Nashik.webp",
    approxFare: 3200,
    from: "Mumbai",
    to: "Nashik"
  },
  {
    name: "Aurangabad (Bibi Ka Maqbara)",
    region: "Marathwada",
    image: "https://cdn.jsdelivr.net/gh/akashingne/images/Aurangabad_Bibi_ka_Maqbara.webp",
    approxFare: 4200,
    from: "Pune",
    to: "Aurangabad"
  },
  {
    name: "Tadoba Andhari Tiger Reserve",
    region: "Vidarbha",
    image: "https://cdn.jsdelivr.net/gh/akashingne/images/Panthera_tigris_tigris_Tidoba_20150306.webp",
    approxFare: 7800,
    from: "Nagpur",
    to: "Tadoba"
  }
];

const cities = [...new Set(destinations.flatMap(d => [d.from, d.to]))];

function toggleMenu(){
  document.querySelector('.nav').classList.toggle('show');
}

function estimateFare(){
  const km = parseFloat(document.getElementById('est-distance').value || '0');
  const cab = document.getElementById('est-cabtype').value;
  const result = document.getElementById('est-result');
  const pricing = {
    base: 100,
    perKm: { sedan: 12, suv: 15, premium: 20 },
    driverAllowance: 250 // flat per day
  };
  const fare = Math.round(pricing.base + km * pricing.perKm[cab] + pricing.driverAllowance);
  result.textContent = `Estimated fare: ₹${fare.toLocaleString('en-IN')} (includes driver allowance)`;
}

function renderRoutes(){
  const routes = [
    { from:"Pune", to:"Mumbai", km: 150, img: "https://cdn.jsdelivr.net/gh/akashingne/images/Bhushi_dam.webp" },
    { from:"Pune", to:"Mahabaleshwar", km: 150, img: "https://cdn.jsdelivr.net/gh/akashingne/images/Panoramic_view_from_Elphinstone_Point.webp" },
    { from:"Pune", to:"Nashik", km: 250, img: "https://cdn.jsdelivr.net/gh/akashingne/images/Sula%E2%80%99s_estate_vineyards_in_Nashik.webp" },
  ];
  const wrap = document.getElementById('routes');
  if(!wrap) return;
  wrap.innerHTML = routes.map(r => {
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
}

function buildDestinations(){
  const grid = document.getElementById('dest-grid');
  if(!grid) return;
  grid.innerHTML = destinations.map((d, i) => `
    <article class="dest" data-region="${d.region}" data-name="${d.name.toLowerCase()}">
      <img src="${d.image}" alt="${d.name}" loading="lazy">
      <div class="body">
        <h4>${d.name}</h4>
        <p class="meta">${d.region} • Typical from ${d.from} — ₹${d.approxFare.toLocaleString('en-IN')}</p>
        <button class="btn small" onclick="prefill('${d.from}','${d.to}', 0)">Book</button>
      </div>
    </article>
  `).join('');
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
  const pricing = { base: 100, perKm: { sedan: 12, suv: 15, premium: 20 }, driverAllowance: 250 };
  const fare = Math.round(pricing.base + km * pricing.perKm[cab] + pricing.driverAllowance);
  document.getElementById('fare-output').textContent = `Estimated fare: ₹${fare.toLocaleString('en-IN')}`;
}

function initBooking(){
  const datalist = document.getElementById('cities');
  if(datalist){
    datalist.innerHTML = cities.map(c => `<option value="${c}"></option>`).join('');
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
