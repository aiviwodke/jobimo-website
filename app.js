// JOBIMO – fokussierter MVP für Minijobs und Studentenjobs in Mecklenburg-Vorpommern.
// Alle Einträge unten sind ausdrücklich Beispieldaten, keine echten Stellenangebote.
const sampleJobs = [
  {id:1,title:'Service-Aushilfe am Wochenende',company:'Beispielbetrieb Küstenblick',city:'Rostock',pay:'14,50 € / Std.',hours:'Wochenende',type:'Minijob',industry:'Gastronomie',terms:'service gastronomie restaurant kellner wochenende aushilfe'},
  {id:2,title:'Barista / Café-Aushilfe',company:'Beispielcafé Morgenrot',city:'Rostock',pay:'14,00 € / Std.',hours:'Flexible Zeiten',type:'Minijob',industry:'Gastronomie',terms:'café kaffee barista gastronomie aushilfe'},
  {id:3,title:'Aushilfe an der Hotelrezeption',company:'Beispielhotel am Hafen',city:'Stralsund',pay:'15,00 € / Std.',hours:'Nachmittags',type:'Minijob',industry:'Hotel',terms:'hotel rezeption empfang gäste service'},
  {id:4,title:'Verkaufsaushilfe',company:'Beispielshop Lieblingsladen',city:'Greifswald',pay:'14,20 € / Std.',hours:'Samstags',type:'Minijob',industry:'Einzelhandel',terms:'verkauf einzelhandel shop laden kasse'},
  {id:5,title:'Event-Aushilfe',company:'Beispiel Eventteam MV',city:'Schwerin',pay:'15,50 € / Std.',hours:'Nach Bedarf',type:'Minijob',industry:'Events',terms:'event veranstaltung aufbau service wochenende'},
  {id:6,title:'Küchenhilfe',company:'Beispiel Bistro Seeblick',city:'Waren (Müritz)',pay:'14,00 € / Std.',hours:'Flexible Zeiten',type:'Minijob',industry:'Gastronomie',terms:'küche küchenhilfe restaurant gastronomie'},
  {id:7,title:'Werkstudent:in im Marketing',company:'Beispielagentur Nordlicht',city:'Rostock',pay:'16,00 € / Std.',hours:'10–15 Std. / Woche',type:'Studentenjob',industry:'Büro',terms:'werkstudent studentenjob marketing social media büro studium'},
  {id:8,title:'Studentische Aushilfe im Hotel',company:'Beispielhotel Stadtmitte',city:'Greifswald',pay:'15,50 € / Std.',hours:'Bis 20 Std. / Woche',type:'Studentenjob',industry:'Hotel',terms:'studentenjob werkstudent hotel rezeption empfang studium'},
  {id:9,title:'Werkstudent:in im Verkauf',company:'Beispielhandel Nord',city:'Schwerin',pay:'15,00 € / Std.',hours:'8–16 Std. / Woche',type:'Studentenjob',industry:'Einzelhandel',terms:'werkstudent studentenjob verkauf einzelhandel kasse'},
  {id:10,title:'Studentische Bürohilfe',company:'Beispielbüro Hanse',city:'Wismar',pay:'15,00 € / Std.',hours:'Flexible Zeiten',type:'Studentenjob',industry:'Büro',terms:'studentenjob büro verwaltung organisation werkstudent'},
  {id:11,title:'Werkstudent:in Lager & Logistik',company:'Beispiellogistik MV',city:'Neubrandenburg',pay:'15,25 € / Std.',hours:'Nach Absprache',type:'Studentenjob',industry:'Logistik',terms:'werkstudent studentenjob lager logistik kommissionierung'},
  {id:12,title:'Studentische Servicekraft',company:'Beispielrestaurant am Markt',city:'Rostock',pay:'14,50 € / Std.',hours:'Abends und am Wochenende',type:'Studentenjob',industry:'Gastronomie',terms:'studentenjob service restaurant gastronomie kellner'}
];
const $ = (id) => document.getElementById(id);
const normalize = (value) => String(value || '').toLocaleLowerCase('de-DE').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function makeCard(job) {
  const card = document.createElement('article');
  card.className = 'job-card';
  const type = document.createElement('span'); type.className = `job-type ${job.type === 'Studentenjob' ? 'student-type' : ''}`; type.textContent = job.type;
  const category = document.createElement('span'); category.className = 'job-category'; category.textContent = job.industry;
  const top = document.createElement('div'); top.className = 'job-top'; top.append(type, category);
  const title = document.createElement('h4'); title.textContent = job.title;
  const company = document.createElement('div'); company.className = 'company'; company.textContent = `${job.company} · ${job.city}`;
  const meta = document.createElement('div'); meta.className = 'job-meta';
  const pay = document.createElement('span'); pay.textContent = job.pay;
  const hours = document.createElement('span'); hours.textContent = `◷ ${job.hours}`;
  meta.append(pay, hours);
  const bottom = document.createElement('div'); bottom.className = 'job-bottom';
  const note = document.createElement('span'); note.textContent = 'Beispielanzeige';
  const status = document.createElement('b'); status.textContent = 'Nicht live ↗';
  bottom.append(note, status);
  card.append(top, title, company, meta, bottom);
  return card;
}
function runSearch() {
  const query = normalize($('query').value.trim());
  const city = $('city').value;
  const type = $('typeFilter').value;
  const industry = $('industryFilter').value;
  const jobs = sampleJobs.filter(job => {
    const matchesCity = !city || job.city === city;
    const matchesType = !type || job.type === type;
    const matchesIndustry = !industry || job.industry === industry;
    const searchable = normalize(`${job.title} ${job.company} ${job.city} ${job.industry} ${job.type} ${job.hours} ${job.terms}`);
    const matchesQuery = !query || searchable.includes(query) || query.split(/\s+/).every(word => searchable.includes(word));
    return matchesCity && matchesType && matchesIndustry && matchesQuery;
  });
  $('directJobs').replaceChildren(...jobs.map(makeCard));
  $('directCount').textContent = `${jobs.length} ${jobs.length === 1 ? 'Job' : 'Jobs'}`;
  $('directEmpty').hidden = jobs.length > 0;
  $('resultsTitle').textContent = query ? `Ergebnisse für „${$('query').value.trim()}“` : 'Entdecke Minijobs & Studentenjobs';
  $('resultsSub').textContent = city ? `Nebenjobs in ${city}.` : 'Minijobs und Studentenjobs in Mecklenburg-Vorpommern.';
}
$('searchForm').addEventListener('submit', event => { event.preventDefault(); runSearch(); $('jobs').scrollIntoView({behavior:'smooth'}); });
$('typeFilter').addEventListener('change', runSearch);
$('industryFilter').addEventListener('change', runSearch);
$('city').addEventListener('change', runSearch);
document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => { $('query').value = button.dataset.query; runSearch(); $('jobs').scrollIntoView({behavior:'smooth'}); }));
document.querySelectorAll('[data-type]').forEach(button => button.addEventListener('click', () => { $('typeFilter').value = button.dataset.type; runSearch(); $('jobs').scrollIntoView({behavior:'smooth'}); }));
runSearch();
