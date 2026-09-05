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
