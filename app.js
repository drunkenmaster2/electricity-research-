const D=window.RESEARCH_DATA;
const fmt=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:2});
document.getElementById('updated').textContent='עודכן '+D.meta.updated;
const S=D.summary;
document.getElementById('kpis').innerHTML=[
  ['₪'+fmt(S.peak_bill_amount),'החשבון החריג','9.6–18.8 • '+fmt(S.peak_bill_kwh)+' קוט״ש'],
  [fmt(S.peak_bill_daily),'קוט״ש ליום בשיא','לעומת 22.3 בתקופה הראשונה'],
  [fmt(S.boiler_june),'קוט״ש לדוד ביוני','≈56.5 קוט״ש ליום'],
  ['~'+fmt(S.boiler_power_kw)+' kW','הספק דוד בזמן חימום','נמדד מהבהובי המונה']
].map(x=>`<div class="kpi"><div class="v">${x[0]}</div><div class="l">${x[1]}</div><div class="small">${x[2]}</div></div>`).join('');
document.getElementById('findings').innerHTML=D.findings.map(f=>`<div class="finding"><strong>${f.title}<span class="confidence ${f.confidence==='בינוני'?'med':''}">${f.confidence}</span></strong><div>${f.text}</div></div>`).join('');

const maxCompare=Math.max(...D.monthly_compare.map(x=>x.total));
document.getElementById('compareChart').innerHTML=D.monthly_compare.map(x=>`<div class="month-group" title="${x.note}">
  <div class="month-bars">
    <div class="compare-bar total" style="height:${Math.max(5,x.total/maxCompare*100)}%"><span class="compare-val">${fmt(Math.round(x.total))}</span></div>
    <div class="compare-bar boiler" style="height:${Math.max(5,x.boiler/maxCompare*100)}%"><span class="compare-val">${fmt(Math.round(x.boiler))}</span></div>
  </div>
  <div class="month-label">${x.month}</div>
  <div class="share-label">דוד ${fmt(x.boiler_share)}%</div>
</div>`).join('');

const maxB=Math.max(...D.boiler_monthly.map(x=>x[1]));
document.getElementById('boilerChart').innerHTML=D.boiler_monthly.map((x,i)=>`<div class="bar ${i===D.boiler_monthly.length-1?'partial':''}" style="height:${Math.max(5,x[1]/maxB*100)}%"><span class="val">${fmt(x[1])}</span><span class="label">${x[0]}</span></div>`).join('');
const maxBill=Math.max(...D.bills.map(x=>x.daily));
document.getElementById('billChart').innerHTML=D.bills.map((x,i)=>`<div class="bar ${i===2?'red':'blue'}" style="height:${x.daily/maxBill*100}%"><span class="val">${fmt(x.daily)}</span><span class="label">${x.period}</span></div>`).join('');
document.getElementById('timelineList').innerHTML=D.timeline.map(x=>`<div class="event"><div class="date">${x[0]}</div><strong>${x[1]}</strong><div>${x[2]}</div></div>`).join('');
document.getElementById('devicesGrid').innerHTML=D.devices.map(d=>`<div class="card"><h3>${d.name}</h3><span class="badge">${d.status}</span><div class="spec">${d.specs.map(s=>`<span class="k">${s[0]}</span><b>${s[1]}</b>`).join('')}</div></div>`).join('');
document.getElementById('billsBody').innerHTML=D.bills.map(b=>`<tr><td>${b.period}</td><td>${b.days}</td><td>${fmt(b.kwh)} קוט״ש</td><td>${fmt(b.daily)}</td><td>${fmt(b.from)} → ${fmt(b.to)}</td><td class="money">₪${fmt(b.amount)}</td></tr>`).join('');
document.getElementById('meterReadings').innerHTML=D.meter_points.map(m=>`<div class="reading"><span>${m.date}</span><b>${fmt(m.reading)}</b></div>`).join('');
document.getElementById('openQuestions').innerHTML=D.open_questions.map(q=>`<li>${q}</li>`).join('');

const getJSON=async path=>{
  const r=await fetch(`${path}?v=${Date.now()}`,{cache:'no-store'});
  if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
};

const statusValue=(map,codes)=>{
  for(const c of codes){if(map && map[c]) return [c,map[c]];}
  return null;
};

const statusText=item=>{
  if(!item) return '—';
  const v=item[1];
  const value=typeof v.value==='boolean'?(v.value?'ON':'OFF'):fmt(v.value);
  return value+(v.unit?` ${v.unit}`:'');
};

function renderTuyaLine(rows){
  const el=document.getElementById('tuyaDaily');
  if(!rows.length){el.textContent='Tuya לא החזירה עדיין היסטוריית צריכה יומית.';return;}
  const values=rows.map(r=>Number(r.value)).filter(Number.isFinite);
  if(!values.length){el.textContent='אין ערכים מספריים בנתוני Tuya.';return;}
  const max=Math.max(...values,1), min=Math.min(0,...values);
  const W=900,H=270,padX=45,padY=25;
  const x=i=>padX+(W-padX*2)*(rows.length===1?0.5:i/(rows.length-1));
  const y=v=>H-padY-(H-padY*2)*((Number(v)-min)/(max-min||1));
  const points=rows.map((r,i)=>`${x(i).toFixed(1)},${y(r.value).toFixed(1)}`).join(' ');
  const first=rows[0].time,last=rows[rows.length-1].time;
  const latest=rows[rows.length-1];
  el.innerHTML=`<div class="api-line-wrap"><svg class="api-line" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tuya daily energy history">
    <line x1="${padX}" y1="${H-padY}" x2="${W-padX}" y2="${H-padY}" class="api-axis"/>
    <line x1="${padX}" y1="${padY}" x2="${padX}" y2="${H-padY}" class="api-axis"/>
    <polyline points="${points}" class="api-polyline"/>
    ${rows.map((r,i)=>`<circle cx="${x(i).toFixed(1)}" cy="${y(r.value).toFixed(1)}" r="2.5" class="api-dot"><title>${r.time}: ${fmt(r.value)} kWh</title></circle>`).join('')}
    <text x="${padX}" y="${H-5}" class="api-label" text-anchor="start">${first}</text>
    <text x="${W-padX}" y="${H-5}" class="api-label" text-anchor="end">${last}</text>
    <text x="${padX-8}" y="${padY+5}" class="api-label" text-anchor="end">${fmt(max)}</text>
  </svg></div><div class="small">נקודה אחרונה: ${latest.time} — ${fmt(latest.value)} קוט״ש • ${rows.length} ימים שנשמרו</div>`;
}

(async()=>{
  const current=document.getElementById('tuyaCurrent');
  const sync=document.getElementById('tuyaSync');
  try{
    const [latest,meta,daily]=await Promise.all([
      getJSON('data/tuya/latest.json'),
      getJSON('data/tuya/sync_meta.json'),
      getJSON('data/tuya/energy_daily.json').catch(()=>({data:[]}))
    ]);
    const n=latest.normalized_status||{};
    const sw=statusValue(n,['switch_1','switch','switch_led']);
    const power=statusValue(n,['cur_power','power']);
    const currentAmp=statusValue(n,['cur_current','current']);
    const voltage=statusValue(n,['cur_voltage','voltage']);
    const energy=statusValue(n,['add_ele','total_energy','forward_energy_total']);
    current.innerHTML=`<div class="reading"><span>Switch</span><b>${statusText(sw)}</b></div>
      <div class="reading"><span>Power</span><b>${statusText(power)}</b></div>
      <div class="reading"><span>Current</span><b>${statusText(currentAmp)}</b></div>
      <div class="reading"><span>Voltage</span><b>${statusText(voltage)}</b></div>
      <div class="reading"><span>Energy DP</span><b>${statusText(energy)}</b></div>`;
    const errors=Array.isArray(meta.errors)?meta.errors:[];
    sync.innerHTML=`<div class="reading"><span>עודכן</span><b>${new Date(meta.synced_at).toLocaleString('he-IL')}</b></div>
      <div class="reading"><span>Device ID</span><b>${meta.device_id}</b></div>
      <div class="reading"><span>API</span><b>${meta.endpoint}</b></div>
      <div class="reading"><span>שגיאות API</span><b>${errors.length}</b></div>
      ${errors.length?`<div class="small api-error">${errors.slice(0,3).map(e=>`${e.stage}: ${e.error}`).join('<br>')}</div>`:''}`;
    renderTuyaLine(Array.isArray(daily.data)?daily.data:[]);
  }catch(e){
    current.textContent='ה־Tuya connector מוכן, אך עדיין לא נוצר snapshot. יש להגדיר את שני ה־GitHub secrets ולהריץ Sync Tuya Boiler.';
    sync.textContent='ממתין לסנכרון ראשון.';
  }
})();
