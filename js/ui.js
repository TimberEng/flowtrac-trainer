/* =====================================================================
   UI — breadcrumb, contextual help panel, and the guided-lessons
   framework (lesson picker + step self-check against nav/state).
   ===================================================================== */

const crumbEl=document.getElementById("crumb");
const helpEl=document.getElementById("help");

/* breadcrumb */
function renderCrumb(){
  const labels = stack.map(c => c==="" ? "Main Menu" : nodeByCode[c].label);
  crumbEl.innerHTML = labels.map((l,i)=> i===labels.length-1 ? "<b>"+l+"</b>" : l).join(" &rsaquo; ");
}

/* help panel */
function renderHelp(){
  const code=current(), screen=Screens.get(code), node=nodeByCode[code];
  if(screen){ helpEl.innerHTML=screen.help; return; }
  if(node && node.children){
    helpEl.innerHTML =
      `<h3>${code?code+" ":""}${node.label}</h3>`+
      `<p>${DESCRIPTIONS[code]||""}</p>`+
      `<ul class="keyhelp">
        <li><kbd>1</kbd>–<kbd>${node.children.length}</kbd><span>press an item's number to open it</span></li>
        <li><kbd>Esc</kbd><span>back &middot; <kbd>Menu</kbd> home</span></li>
      </ul>`;
    return;
  }
  helpEl.innerHTML =
    `<h3>${node?node.label:""}</h3>`+
    `<p class="muted">This panel hasn't been added to the trainer yet — the display shows a placeholder.
      Send its screen capture and it slots in here.</p>
     <ul class="keyhelp"><li><kbd>Esc</kbd><span>back to the menu</span></li></ul>`;
}

/* =====================================================================
   GUIDED LESSONS
   ===================================================================== */
let lesson=null, step=0;
const lessonPick=document.getElementById("lessonPick");
const lessonBody=document.getElementById("lessonBody");

function renderLessonPick(){
  lessonPick.innerHTML="";
  LESSONS.forEach(L=>{
    const b=document.createElement("button");
    b.className="btn"+(lesson&&lesson.id===L.id?" primary":"");
    b.textContent=L.title;
    b.onclick=()=>startLesson(L.id);
    lessonPick.appendChild(b);
  });
}
function startLesson(id){ lesson=LESSONS.find(l=>l.id===id); step=0; renderLessonPick(); renderLesson(); }
function renderLesson(){
  if(!lesson){ lessonBody.innerHTML='<p class="muted" style="margin-top:12px;font-size:14px">Pick a lesson to walk through the steps on the panel. More appear as new screens are added.</p>'; return; }
  const complete = step>=lesson.steps.length;
  let html=`<p class="muted" style="margin:12px 0 0;font-size:14px">${lesson.blurb}</p><ol class="steps">`;
  lesson.steps.forEach((s,i)=>{
    const cls = i<step?"done":(i===step?"active":"");
    const mark = i<step?"✓":(i+1);
    html+=`<li class="${cls}"><span class="mark">${mark}</span><span>${s.t}</span></li>`;
  });
  html+="</ol>";
  if(complete) html+='<div class="done-banner">Done — you\'ve operated both valves. Pick another lesson or explore the menus freely.</div>';
  lessonBody.innerHTML=html;
}
function afterInput(){
  if(lesson && step<lesson.steps.length){
    /* advance through any steps now satisfied */
    while(step<lesson.steps.length && lesson.steps[step].done()) step++;
    renderLesson();
  }
}
