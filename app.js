
const CH={
Physical:["Mole Concept","Atomic Structure","Redox Reactions","States of Matter","Thermodynamics","Thermochemistry","Chemical Equilibrium","Ionic Equilibrium","Solutions","Electrochemistry","Chemical Kinetics","Solid State","Surface Chemistry"],
Inorganic:["Periodic Table","Chemical Bonding","Hydrogen and s-Block","p-Block","d- and f-Block","Coordination Compounds","Metallurgy","Salt Analysis","Environmental Chemistry"],
Organic:["GOC","Isomerism","Hydrocarbons","Haloalkanes and Haloarenes","Alcohols Phenols Ethers","Aldehydes and Ketones","Carboxylic Acids","Amines","Biomolecules","Polymers","Chemistry in Everyday Life"]};
const chapters=Object.entries(CH).flatMap(([branch,names])=>names.map(name=>({branch,name})));
const key="nsec-prep-hq-v1",today=()=>new Date().toLocaleDateString("en-CA");
const defaults=()=>({start:"2026-11-17",plans:[],attempts:[],tests:[],completed:[],notes:{}});
let db;try{db={...defaults(),...JSON.parse(localStorage.getItem(key)||"{}")}}catch{db=defaults()}
const $=id=>document.getElementById(id),save=()=>{localStorage.setItem(key,JSON.stringify(db));toast("Saved successfully")},escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),id=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7),num=n=>Number(n)||0;
const allNames=chapters.map(c=>c.name),opts=(names=allNames)=>names.map(n=>'<option value="'+escape(n)+'">'+escape(n)+'</option>').join("");
const field=(label,html)=>'<label class="field">'+label+html+'</label>',box=(title,body)=>'<section class="card"><h2>'+title+'</h2>'+body+'</section>';
const date=()=> $("activeDate").value||today();
const accuracy=(correct,total)=>total?Math.round(100*correct/total):0;
const verdict=p=>p>=75?["Strong","Quick recall, then move to tougher PYQs.","good"]:p>=50?["Needs revision","Revise missed subtopics and solve 5–10 fresh questions.","warn"]:["Theory repair","Review the concept and worked examples, then retry new PYQs.","bad"];
const branch=n=>chapters.find(c=>c.name===n)?.branch||"Other";
const attempts=n=>db.attempts.filter(a=>a.chapter===n);
const total=n=>attempts(n).reduce((s,a)=>s+a.total,0);
const correct=n=>attempts(n).reduce((s,a)=>s+a.correct,0);
const latest=n=>attempts(n).slice(-1)[0];
const toast=s=>{let el=$("toast");el.textContent=s;el.style.display="block";clearTimeout(window.toastTimeout);window.toastTimeout=setTimeout(()=>el.style.display="none",2500)};
function selectedDate(){if(!$("activeDate").value)$("activeDate").value=today()}
const views={dashboard:"Dashboard",planner:"Daily planner",diagnostic:"Diagnostic lab",chapters:"Chapter tracker",tests:"Daily tests",history:"Attempt history",library:"PYQ library",settings:"Data & backup"};
let view="dashboard";
function go(v){view=v;$("pageTitle").textContent=views[v];document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===v));render()}
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>go(b.dataset.view));
$("activeDate").value=today();$("activeDate").onchange=render;
function render(){
const d=date(),day=Math.round((new Date(d+"T12:00:00")-new Date(db.start+"T12:00:00"))/86400000)+1;
const done=db.plans.filter(p=>p.done).length,answered=db.attempts.reduce((s,a)=>s+a.total,0),right=db.attempts.reduce((s,a)=>s+a.correct,0);
if(view==="dashboard"){
const todayPlans=db.plans.filter(p=>p.date===d),todayTests=db.tests.filter(t=>t.date===d);
$("app").innerHTML='<div class="grid">'+[
["Study day",day+" / 5","Change the study start date in Data & backup"],
["Questions solved",answered,accuracy(right,answered)+"% overall accuracy"],
["Chapters completed",db.completed.length+" / "+chapters.length,"Completed checkboxes are tracked separately"],
["Planner tasks",done+" / "+db.plans.length,"Tasks checked off"],
["Tests today",todayTests.length+" / 2","Aim for two analysed tests"],
["Practice sessions",db.attempts.length,"Every diagnostic attempt stays in history"]
].map(x=>'<div class="card"><div class="muted small">'+x[0]+'</div><div class="stat">'+x[1]+'</div><div class="muted small">'+x[2]+'</div></div>').join("")+'</div>'+
'<div class="two">'+box("Today's plan",todayPlans.length?todayPlans.map(p=>'<div class="item"><span>'+(p.done?"✓ ":"○ ")+escape(p.chapter)+' · '+p.target+' questions</span><span class="pill">'+(p.done?"Done":"Pending")+'</span></div>').join(""):'No tasks yet. Open Daily planner to add chapters.')+
box("Next revision priorities",chapters.filter(c=>latest(c.name)&&!db.completed.includes(c.name)).sort((a,b)=>accuracy(latest(a.name).correct,latest(a.name).total)-accuracy(latest(b.name).correct,latest(b.name).total)).slice(0,6).map(c=>{let a=latest(c.name),p=accuracy(a.correct,a.total);return '<div class="item"><span>'+escape(c.name)+'</span><span class="'+verdict(p)[2]+'">'+p+'% · '+verdict(p)[0]+'</span></div>'}).join("")||"Take your first diagnostic to receive recommendations.")+'</div>';
}
if(view==="planner"){
const plans=db.plans.filter(p=>p.date===d);
$("app").innerHTML=box("Plan for "+d,'<form id="planForm" class="formgrid">'+field("Chapter",'<select name="chapter">'+opts()+'</select>')+field("Question target",'<input name="target" type="number" min="1" value="15" required>')+field("Focus / notes",'<input name="note" placeholder="e.g. Nernst equation">')+'<button class="btn">Add task</button></form>')+
box("Today's checklist",plans.length?plans.map(p=>'<div class="item"><label><input type="checkbox" data-task="'+p.id+'" '+(p.done?"checked":"")+'> '+escape(p.chapter)+' · '+p.target+' PYQs <span class="muted small">'+escape(p.note)+'</span></label><button class="btn secondary" data-remove-task="'+p.id+'">Remove</button></div>').join(""):"No tasks planned yet.")+
box("Two tests per day",'<p class="muted">Tests logged for this date: '+db.tests.filter(t=>t.date===d).length+'/2. Use the Daily tests tab to enter scores and analysis.</p>');
$("planForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);db.plans.push({id:id(),date:d,chapter:f.get("chapter"),target:num(f.get("target")),note:f.get("note"),done:false});save();render()};
document.querySelectorAll("[data-task]").forEach(x=>x.onchange=()=>{db.plans.find(p=>p.id===x.dataset.task).done=x.checked;save();render()});
document.querySelectorAll("[data-remove-task]").forEach(x=>x.onclick=()=>{db.plans=db.plans.filter(p=>p.id!==x.dataset.removeTask);save();render()});
}
if(view==="diagnostic"){
$("app").innerHTML=box("Chapter diagnostic",'<p class="muted">Attempt 10–15 chapter-wise PYQs without notes. Log your result and the concepts you missed. Your history is never overwritten.</p><form id="diagForm"><div class="formgrid">'+field("Chapter",'<select id="diagChapter" name="chapter">'+opts()+'</select>')+field("Questions attempted",'<input name="total" type="number" min="1" required value="15">')+field("Correct answers",'<input name="correct" type="number" min="0" required>')+field("Weak concepts",'<input name="weak" placeholder="e.g. conductance">')+field("Notes",'<input name="note" placeholder="What went wrong?">')+'</div><p><button class="btn">Save diagnostic & get next steps</button></p></form><div id="diagResult"></div>')+
box("Latest result",db.attempts.length?(()=>{let a=db.attempts[db.attempts.length-1],p=accuracy(a.correct,a.total),v=verdict(p);return '<h2 class="'+v[2]+'">'+p+'% — '+v[0]+'</h2><p>'+escape(a.chapter)+' · '+a.correct+'/'+a.total+' correct</p><p>'+v[1]+'</p><p class="muted">'+escape(a.weak||"No weak concepts entered")+'</p>'})():"No diagnostics logged yet.");
$("diagForm").onsubmit=e=>{e.preventDefault();let f=new FormData(e.target),t=num(f.get("total")),c=num(f.get("correct"));if(c>t){toast("Correct answers cannot exceed attempted questions");return}db.attempts.push({id:id(),date:d,chapter:f.get("chapter"),total:t,correct:c,weak:f.get("weak"),note:f.get("note")});save();render()};
}
if(view==="chapters"){
let rows=chapters.map(c=>{let n=c.name,t=total(n),p=accuracy(correct(n),t),a=latest(n),v=a?verdict(accuracy(a.correct,a.total)):null;return '<tr><td><input type="checkbox" data-complete="'+escape(n)+'" '+(db.completed.includes(n)?"checked":"")+'></td><td>'+escape(n)+'</td><td>'+c.branch+'</td><td>'+t+'</td><td>'+correct(n)+'</td><td>'+(t?p+"%":"—")+'</td><td>'+(v?'<span class="'+v[2]+'">'+v[0]+'</span>':"Not attempted")+'</td></tr>'}).join("");
$("app").innerHTML=box("All chapters — cumulative history",'<p class="muted small">Completion is manual. Your attempts remain saved even after you tick a chapter.</p><div class="scroll"><table><thead><tr><th>Done</th><th>Chapter</th><th>Branch</th><th>Attempted</th><th>Correct</th><th>Accuracy</th><th>Latest diagnostic</th></tr></thead><tbody>'+rows+'</tbody></table></div>');
document.querySelectorAll("[data-complete]").forEach(x=>x.onchange=()=>{db.completed=x.checked?[...new Set([...db.completed,x.dataset.complete])]:db.completed.filter(n=>n!==x.dataset.complete);save();render()});
}
if(view==="tests"){
$("app").innerHTML=box("Log a timed test",'<form id="testForm"><div class="formgrid">'+field("Test slot",'<select name="slot"><option value="1">Test 1</option><option value="2">Test 2</option></select>')+field("Type",'<select name="type"><option>NSEC mixed</option><option>JEE Advanced</option><option>Chapter test</option><option>Full NSEC paper</option></select>')+field("Total questions",'<input type="number" name="total" min="1" value="50" required>')+field("Correct",'<input type="number" name="correct" min="0" required>')+field("Mistakes / review",'<input name="note" placeholder="Concepts to revisit">')+'</div><p><button class="btn">Save test</button></p></form>')+
box("Test history",'<div class="scroll"><table><tr><th>Date</th><th>Slot</th><th>Type</th><th>Score</th><th>Accuracy</th><th>Notes</th></tr>'+db.tests.slice().reverse().map(t=>'<tr><td>'+t.date+'</td><td>'+t.slot+'</td><td>'+escape(t.type)+'</td><td>'+t.correct+'/'+t.total+'</td><td>'+accuracy(t.correct,t.total)+'%</td><td>'+escape(t.note)+'</td></tr>').join("")+'</table></div>');
$("testForm").onsubmit=e=>{e.preventDefault();let f=new FormData(e.target),t=num(f.get("total")),c=num(f.get("correct"));if(c>t){toast("Correct cannot exceed total");return}db.tests.push({id:id(),date:d,slot:f.get("slot"),type:f.get("type"),total:t,correct:c,note:f.get("note")});save();render()};
}
if(view==="history"){
$("app").innerHTML=box("All diagnostic attempts",'<div class="scroll"><table><tr><th>Date</th><th>Branch</th><th>Chapter</th><th>Correct</th><th>Accuracy</th><th>Weak topics / notes</th><th></th></tr>'+db.attempts.slice().reverse().map(a=>'<tr><td>'+a.date+'</td><td>'+branch(a.chapter)+'</td><td>'+escape(a.chapter)+'</td><td>'+a.correct+'/'+a.total+'</td><td>'+accuracy(a.correct,a.total)+'%</td><td>'+escape(a.weak)+' '+escape(a.note)+'</td><td><button class="btn danger" data-delete="'+a.id+'">Delete</button></td></tr>').join("")+'</table></div>');
document.querySelectorAll("[data-delete]").forEach(x=>x.onclick=()=>{if(confirm("Delete this individual attempt?")){db.attempts=db.attempts.filter(a=>a.id!==x.dataset.delete);save();render()}});
}
if(view==="library"){
const links=[["Chapter-wise NSEC practice","https://www.acadxl.com/resources/jee-pyqs/nsec-chapter-wise"],["Full NSEC past papers","https://www.acadxl.com/resources/jee-pyqs/nsec-full-papers"],["Chemistry Olympiad resources","https://chemistry-olympiad.com/chemistry/in/"],["HBCSE Chemistry Olympiad","https://olympiads.hbcse.tifr.res.in/"]];
$("app").innerHTML=box("NSEC PYQ resources",'<p class="muted">External resources: use chapter-wise papers for diagnostics and full papers for timed tests. Availability of individual questions may change.</p>'+links.map(l=>'<div class="item"><a target="_blank" rel="noopener" href="'+l[1]+'">'+l[0]+' ↗</a></div>').join(""))+
box("50-question mixed practice blueprint",'<p class="muted">Create a 50-question set using chapter-wise PYQs: 20 Physical, 15 Inorganic, 15 Organic. Use a timer and enter your result in Daily tests. This is a practice blueprint, not an embedded copyrighted 50-question paper.</p>')+
box("Open chapter-wise PYQs",'<div class="formgrid">'+field("Choose chapter",'<select id="libChapter">'+opts()+'</select>')+'<button id="libGo" class="btn">Open PYQ library</button></div>');
$("libGo").onclick=()=>window.open("https://www.acadxl.com/resources/jee-pyqs/nsec-chapter-wise","_blank","noopener");
}
if(view==="settings"){
$("app").innerHTML=box("Study settings",'<form id="settingsForm">'+field("Day 1 of your five-day plan",'<input type="date" name="start" value="'+escape(db.start)+'">')+'<p><button class="btn">Save start date</button></p></form>')+
box("Back up your progress",'<p class="muted">Data stays in this browser. Export regularly to avoid losing history when clearing browser storage or switching devices.</p><div class="actions"><button id="export" class="btn">Export JSON backup</button><label class="btn secondary">Import backup <input id="import" type="file" accept=".json,application/json" style="display:none"></label></div>')+
box("Data safety",'<p class="muted">No login or server sync is included. Your history is stored using localStorage. Importing a backup replaces the current browser history.</p>');
$("settingsForm").onsubmit=e=>{e.preventDefault();db.start=new FormData(e.target).get("start");save();render()};
$("export").onclick=()=>{const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"}),u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download="nsec-prep-backup-"+today()+".json";a.click();setTimeout(()=>URL.revokeObjectURL(u),500)};
$("import").onchange=async e=>{try{let x=JSON.parse(await e.target.files[0].text());if(!Array.isArray(x.attempts)||!Array.isArray(x.plans)||!Array.isArray(x.tests))throw Error("Invalid backup");if(confirm("Replace current data with this backup?")){db={...defaults(),...x};save();render()}}catch(err){toast("Could not import backup: "+err.message)}};
}
}
selectedDate();render();
