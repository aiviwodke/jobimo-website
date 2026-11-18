// JOBIMO – Minijobs und Studentenjobs gleichberechtigt.
// Ohne Supabase-Konfiguration werden ausschließlich klar gekennzeichnete Beispieldaten angezeigt.
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
let availableJobs = sampleJobs;
let demoMode = true;

function safeWebUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function formatHourlyWage(job) {
  const currency = job.wage_currency || 'EUR';
  const formatter = new Intl.NumberFormat('de-DE', {style:'currency', currency, maximumFractionDigits:2});
  if (job.hourly_wage_min != null && job.hourly_wage_max != null) {
    return `${formatter.format(job.hourly_wage_min)}–${formatter.format(job.hourly_wage_max)} / Std.`;
  }
  if (job.hourly_wage_min != null) return `ab ${formatter.format(job.hourly_wage_min)} / Std.`;
  return 'Vergütung laut Anzeige';
}

function makeCard(job) {
  const card = document.createElement('article');
  card.className = 'job-card';
  const type = document.createElement('span');
  type.className = `job-type ${job.type === 'Studentenjob' ? 'student-type' : ''}`;
  type.textContent = job.type;
  const category = document.createElement('span');
  category.className = 'job-category';
  category.textContent = job.industry || 'Weitere';
  const top = document.createElement('div');
  top.className = 'job-top';
  top.append(type, category);

  const title = document.createElement('h4');
  title.textContent = job.title;
  const company = document.createElement('div');
  company.className = 'company';
  company.textContent = `${job.company || 'Arbeitgeber'} · ${job.city}`;
  const meta = document.createElement('div');
  meta.className = 'job-meta';
  const pay = document.createElement('span');
  pay.textContent = job.pay || 'Vergütung laut Anzeige';
  const hours = document.createElement('span');
  hours.textContent = `◷ ${job.hours || 'Arbeitszeit laut Anzeige'}`;
  meta.append(pay, hours);

  const bottom = document.createElement('div');
  bottom.className = 'job-bottom';
  const note = document.createElement('span');
  note.textContent = demoMode ? 'Beispielanzeige' : 'Aktuelle Anzeige';
  bottom.append(note);

  const applicationUrl = safeWebUrl(job.applicationUrl);
  if (!demoMode && applicationUrl) {
    const link = document.createElement('a');
    link.href = applicationUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Zur Bewerbung ↗';
    bottom.append(link);
  } else {
    const status = document.createElement('b');
    status.textContent = demoMode ? 'Nicht live' : 'Keine Bewerbungs-URL';
    bottom.append(status);
  }

  card.append(top, title, company, meta, bottom);
  return card;
}

function runSearch() {
  const query = normalize($('query').value.trim());
  const city = $('city').value;
  const type = $('typeFilter').value;
  const industry = $('industryFilter').value;
  const jobs = availableJobs.filter(job => {
    const matchesCity = !city || job.city === city;
    const matchesType = !type || job.type === type;
    const matchesIndustry = !industry || job.industry === industry;
    const searchable = normalize(`${job.title} ${job.company} ${job.city} ${job.industry} ${job.type} ${job.hours} ${job.terms}`);
    const matchesQuery = !query || query.split(/\s+/).every(word => searchable.includes(word));
    return matchesCity && matchesType && matchesIndustry && matchesQuery;
  });

  $('directJobs').replaceChildren(...jobs.map(makeCard));
  $('directCount').textContent = `${jobs.length} ${jobs.length === 1 ? 'Job' : 'Jobs'}`;
  $('directEmpty').hidden = jobs.length > 0;
  $('resultsTitle').textContent = query ? `Ergebnisse für „${$('query').value.trim()}“` : 'Entdecke Minijobs & Studentenjobs';
  $('resultsSub').textContent = city ? `Nebenjobs in ${city}.` : 'Minijobs und Studentenjobs in Mecklenburg-Vorpommern.';
}

function setNotice(message, isError = false) {
  const notice = $('dataNotice');
  notice.textContent = message;
  notice.style.borderColor = isError ? '#d98b8b' : '';
}

function mapLiveJob(row) {
  const type = row.employment_type === 'werkstudent' ? 'Studentenjob' : 'Minijob';
  const tags = Array.isArray(row.activity_tags) ? row.activity_tags.join(' ') : '';
  return {
    id: row.id,
    title: row.title,
    company: row.company_name || 'Arbeitgeber',
    city: row.city,
    pay: formatHourlyWage(row),
    hours: row.working_time || 'Arbeitszeit laut Anzeige',
    type,
    industry: row.industry || 'Weitere',
    terms: `${row.description || ''} ${tags} ${row.title || ''}`,
    applicationUrl: row.application_url
  };
}

async function loadLiveJobs() {
  const config = window.JOBIMO_SUPABASE_CONFIG || {};
  const configured = config.url && config.anonKey &&
    !String(config.url).includes('DEINE_') &&
    !String(config.anonKey).includes('DEIN_');

  if (!configured) {
    demoMode = true;
    availableJobs = sampleJobs;
    setNotice('ⓘ Vorschau mit Beispieldaten: Diese Stellen sind nicht echt und noch nicht bewerbbar. Trage zuerst deine Supabase-Daten in supabase-config.js ein, um freigegebene Live-Stellen zu laden.');
    runSearch();
    return;
  }

  if (!window.supabase?.createClient) {
    demoMode = false;
    availableJobs = [];
    setNotice('Die Supabase-Bibliothek konnte nicht geladen werden. Bitte prüfe deine Internetverbindung und lade die Seite neu.', true);
    runSearch();
    return;
  }

  demoMode = false;
  setNotice('Live-Stellenangebote werden geladen …');
  try {
    const client = window.supabase.createClient(config.url, config.anonKey);
    const {data, error} = await client
      .from('public_jobs')
      .select('id,title,company_name,city,employment_type,industry,activity_tags,description,hourly_wage_min,hourly_wage_max,wage_currency,working_time,application_url')
      .order('published_at', {ascending:false});

    if (error) throw error;
    availableJobs = (data || []).map(mapLiveJob);
    setNotice(availableJobs.length
      ? `✓ ${availableJobs.length} freigegebene Stellenangebote aus JOBIMO werden angezeigt.`
      : 'Aktuell sind noch keine freigegebenen Stellenangebote vorhanden.');
  } catch (error) {
    availableJobs = [];
    setNotice('Live-Stellen konnten nicht geladen werden. Bitte prüfe die Supabase-Konfiguration und die SQL-Migration „public_jobs“.', true);
    console.error('JOBIMO Supabase error:', error);
  }
  runSearch();
}

$('searchForm').addEventListener('submit', event => {
  event.preventDefault();
  runSearch();
  $('jobs').scrollIntoView({behavior:'smooth'});
});
$('typeFilter').addEventListener('change', runSearch);
$('industryFilter').addEventListener('change', runSearch);
$('city').addEventListener('change', runSearch);
document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => {
  $('query').value = button.dataset.query;
  runSearch();
  $('jobs').scrollIntoView({behavior:'smooth'});
}));
document.querySelectorAll('[data-type]').forEach(button => button.addEventListener('click', () => {
  $('typeFilter').value = button.dataset.type;
  runSearch();
  $('jobs').scrollIntoView({behavior:'smooth'});
}));

loadLiveJobs();
