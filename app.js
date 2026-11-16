// JOBORA MVP – illustrative sample listings only. No live job feed is connected.
const sampleJobs = [
  {id:1,title:'Barista / Café-Aushilfe',company:'Café Küstenkind (Beispiel)',city:'Rostock',district:'Landkreis Rostock',pay:'14,50 € / Std.',hours:'Wochenende',type:'Minijob',industry:'Gastronomie',category:'Café & Barista',terms:['café','kaffee','barista','service','getränke','minijob','aushilfe'],direct:['café','kaffee','barista']},
  {id:2,title:'Servicekraft im Café',company:'Kaffeekontor (Beispiel)',city:'Rostock',district:'Landkreis Rostock',pay:'14,00 € / Std.',hours:'Flexible Zeiten',type:'Minijob',industry:'Gastronomie',category:'Café & Barista',terms:['café','service','bedienung','minijob','aushilfe'],direct:['café']},
  {id:3,title:'Frühstücksservice',company:'Hotel am Stadthafen (Beispiel)',city:'Rostock',district:'Landkreis Rostock',pay:'15,00 € / Std.',hours:'Wochenende',type:'Minijob',industry:'Hotel',category:'Hotel & Rezeption',terms:['hotel','frühstück','service','gastronomie','minijob','aushilfe'],direct:['hotel','frühstück']},
  {id:4,title:'Aushilfe im Restaurant',company:'Restaurant Hafenblick (Beispiel)',city:'Wismar',district:'Nordwestmecklenburg',pay:'14,50 € / Std.',hours:'Abends',type:'Minijob',industry:'Gastronomie',category:'Restaurant & Service',terms:['restaurant','service','kellner','gastronomie','minijob','aushilfe'],direct:['restaurant','kellner']},
  {id:5,title:'Aushilfe an der Hotelrezeption',company:'Hotel Ostsee (Beispiel)',city:'Stralsund',district:'Vorpommern-Rügen',pay:'Keine Angabe',hours:'Nachmittags',type:'Minijob',industry:'Hotel',category:'Hotel & Rezeption',terms:['hotel','rezeption','empfang','minijob','aushilfe'],direct:['hotel','rezeption']},
  {id:6,title:'Verkaufsaushilfe',company:'Lieblingsladen (Beispiel)',city:'Greifswald',district:'Vorpommern-Greifswald',pay:'14,20 € / Std.',hours:'Samstags',type:'Minijob',industry:'Einzelhandel',category:'Verkauf & Handel',terms:['verkauf','einzelhandel','shop','laden','minijob','aushilfe'],direct:['verkauf','einzelhandel']},
  {id:7,title:'Eventservice am Wochenende',company:'Eventcrew MV (Beispiel)',city:'Schwerin',district:'Schwerin',pay:'15,50 € / Std.',hours:'Wochenende',type:'Minijob',industry:'Events',category:'Events',terms:['event','veranstaltung','service','wochenende','minijob'],direct:['event','veranstaltung']},
  {id:8,title:'Küchenhilfe',company:'Seeblick Bistro (Beispiel)',city:'Waren (Müritz)',district:'Mecklenburgische Seenplatte',pay:'14,00 € / Std.',hours:'Flexible Zeiten',type:'Minijob',industry:'Gastronomie',category:'Restaurant & Service',terms:['küche','küchenhilfe','restaurant','gastronomie','minijob'],direct:['küche','küchenhilfe']},
  {id:9,title:'Barista-Aushilfe',company:'Café Morgenrot (Beispiel)',city:'Neubrandenburg',district:'Mecklenburgische Seenplatte',pay:'14,00 € / Std.',hours:'Wochenende',type:'Minijob',industry:'Gastronomie',category:'Café & Barista',terms:['café','kaffee','barista','minijob','aushilfe'],direct:['café','barista']},
  {id:10,title:'Servicekraft im Hotel',company:'Hotel am Markt (Beispiel)',city:'Parchim',district:'Ludwigslust-Parchim',pay:'Keine Angabe',hours:'Abends',type:'Minijob',industry:'Hotel',category:'Hotel & Rezeption',terms:['hotel','service','gastronomie','minijob'],direct:['hotel']},
  {id:11,title:'Aushilfe im Café',company:'Kleine Auszeit (Beispiel)',city:'Bergen auf Rügen',district:'Vorpommern-Rügen',pay:'14,00 € / Std.',hours:'Saison / Wochenende',type:'Minijob',industry:'Gastronomie',category:'Café & Barista',terms:['café','kaffee','service','minijob','aushilfe'],direct:['café']},
  {id:12,title:'Werkstudent:in Gästeservice',company:'Cityhotel (Beispiel)',city:'Greifswald',district:'Vorpommern-Greifswald',pay:'15,00 € / Std.',hours:'Bis 20 Std./Woche',type:'Werkstudent',industry:'Hotel',category:'Hotel & Rezeption',terms:['hotel','rezeption','service','werkstudent'],direct:['hotel','rezeption']}
];
const synonyms = {
  'café':['café','kaffee','barista'], 'barista':['barista','kaffee','café'], 'hotel':['hotel','rezeption','frühstück'],
  'rezeption':['rezeption','empfang','hotel'], 'service':['service','kellner','restaurant','frühstück'], 'kellner':['kellner','restaurant','service'],
  'restaurant':['restaurant','kellner','service'], 'verkauf':['verkauf','einzelhandel','laden'], 'wochenende':['wochenende'], 'küche':['küche','küchenhilfe']
};
const related = {
  'Café & Barista':['Hotel & Rezeption','Restaurant & Service'],
  'Hotel & Rezeption':['Café & Barista','Restaurant & Service'],
  'Restaurant & Service':['Café & Barista','Hotel & Rezeption'],
  'Verkauf & Handel':['Events'], 'Events':['Restaurant & Service','Verkauf & Handel']
};
const $ = (id)=>document.getElementById(id);
const normalize = (s)=>s.toLocaleLowerCase('de-DE').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function classifyQuery(q){
  const n=normalize(q); const keys=Object.keys(synonyms).sort((a,b)=>b.length-a.length);
  for(const key of keys){if(n.includes(normalize(key))) return {key, terms:synonyms[key]};}
  return {key:'',terms:n.split(/\s+/).filter(Boolean)};
}
function makeCard(job, similar=false){
  const card=document.createElement('article'); card.className='job-card';
  card.innerHTML=`<div class="job-top"><span class="job-type">${job.type}</span><span class="job-category">${job.category}</span></div><h4>${job.title}</h4><div class="company">${job.company} · ${job.city}</div><div class="job-meta"><span>€ ${job.pay}</span><span>◷ ${job.hours}</span></div><div class="job-bottom"><span>${similar?'Ähnliche Tätigkeit':'Direkt passend'}</span><b>Beispiel · nicht live ↗</b></div>`;
  return card;
}
function runSearch(){
  const q=$('query').value.trim(); const city=$('city').value; const type=$('typeFilter').value; const industry=$('industryFilter').value; const parsed=classifyQuery(q);
  let candidates=sampleJobs.filter(j=>(!city||j.city===city)&&(!type||j.type===type)&&(!industry||j.industry===industry));
  let direct=[],similar=[];
  if(!q){direct=candidates;}
  else {
    const qn=normalize(q);
    for(const job of candidates){
      const hay=normalize([job.title,job.company,job.city,...job.terms].join(' '));
      const directMatch=parsed.terms.some(t=>job.direct.map(normalize).includes(normalize(t))) || hay.includes(qn);
      const broaderMatch=parsed.terms.some(t=>job.terms.map(normalize).includes(normalize(t)));
      if(directMatch) direct.push(job); else if(broaderMatch) similar.push(job);
    }
    if(direct.length){const directCats=[...new Set(direct.map(j=>j.category))];const wanted=directCats.flatMap(c=>related[c]||[]);const directIds=new Set(direct.map(j=>j.id));similar=candidates.filter(j=>!directIds.has(j.id)&&wanted.includes(j.category));}
  }
  const rank=(a,b)=>a.city.localeCompare(b.city,'de'); direct.sort(rank); similar.sort(rank);
  $('directJobs').replaceChildren(...direct.map(j=>makeCard(j)));
  $('similarJobs').replaceChildren(...similar.map(j=>makeCard(j,true)));
  $('directCount').textContent=`${direct.length} ${direct.length===1?'Job':'Jobs'}`;
  $('similarCount').textContent=`${similar.length} Alternativen`;
  $('directEmpty').hidden=direct.length>0; $('similarEmpty').hidden=similar.length>0;
  $('resultsTitle').textContent=q?`Ergebnisse für „${q}“`:'Entdecke passende Jobs';
  $('resultsSub').textContent=city?`Auswahl für ${city}. Direkte Treffer zuerst, ähnliche Jobs separat.`:'Direkte Treffer zuerst. Ähnliche Jobs separat.';
}
$('searchForm').addEventListener('submit',e=>{e.preventDefault();runSearch();$('results').scrollIntoView({behavior:'smooth'});});
$('typeFilter').addEventListener('change',runSearch); $('industryFilter').addEventListener('change',runSearch); $('city').addEventListener('change',runSearch);
document.querySelectorAll('[data-query]').forEach(btn=>btn.addEventListener('click',()=>{$('query').value=btn.dataset.query;runSearch();$('results').scrollIntoView({behavior:'smooth'});}));
runSearch();
