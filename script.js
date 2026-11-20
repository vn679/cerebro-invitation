const CONFIG = {
  company:"Cerebro",
  tagline:"Celebrating a year of great work, together.",
  date:"2026-12-14T18:00:00+08:00", // YYYY-MM-DDTHH:mm:ss+offset (event time in Asia/Manila)
  dateText:"DEC 14, 2026 / 6:00 PM",
  city:"PASAY CITY",
  venue:"Lola Cafe S'Maison",
  address:"2nd Floor, S Maison, Conrad Hotel, MOA Complex, Seaside Boulevard, Coral Way, Pasay City",
  dress:"Festive business attire. Think black, burgundy, and cream, with a touch of sparkle.",
  gift:"Optional Exchange Gifts. Budget of 700, wrapped, with no name on the tag. Draw names by Dec 10.",
  parking:"Free parking is available in the venue garage from 5:30 PM. Bring your ticket for validation.",
  shuttle:"From QC take EDSA southbound, exit at Buendia, turn right on Buendia, then left on Evergreen Avenue. From Makati take EDSA northbound, exit at Buendia, turn left on Buendia, then left on Evergreen Avenue.",
  rsvpBy:"December 5",
  contactEmail:"hr@cerebro.ph", // Email address of HR (Ms. Naomi/Ms. Carmela/Sir Erick)
  sheetUrl:"https://script.google.com/macros/s/AKfycbxCkT4bASnkaGb9h3_UHhIjaO4LxJpLHVm8j7j38gk-7fEnJDI93XnrmkvR9AAbcs_9CQ/exec",   // paste your Google Apps Script web app URL here
  mapsUrl:"https://www.google.com/maps/place/LOLA+Cafe+-+S'Maison/@14.5311156,120.977497,17z/data=!3m1!4b1!4m6!3m5!1s0x3397cbad5d53170b:0xa8220c7e3d5c1892!8m2!3d14.5311156!4d120.9800719!16s%2Fg%2F11j4sfjx8v?entry=ttu&g_ep=EgoyMDI2MTExNi4wIKXMDSoASAFQAw%3D%3D"
};
const PROGRAM=[
 ["6:00 PM","Welcome Drinks","M8 3h8l-1 7a3 3 0 01-6 0z M12 13v7 M8 20h8"],
 ["7:00 PM","Dinner","M12 6a6 6 0 100 12 6 6 0 000-12z M12 9a3 3 0 100 6 3 3 0 000-6z"],
 ["8:00 PM","Leadership Address","M9 3h6a0 0 0 010 0v8a3 3 0 01-6 0z M6 11a6 6 0 0012 0 M12 17v4"],
 ["8:20 PM","Awards","M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"],
 ["8:45 PM","Games & Raffle","M5 5h14v14H5z M9 9h.01 M15 9h.01 M9 15h.01 M15 15h.01 M12 12h.01"],
 ["9:15 PM","Gift Exchange","M4 9h16v11H4z M12 9v11 M4 13h16 M12 9c-4-5-7 0 0 0 4-5 7 0 0 0"],
 ["9:45 PM","Dessert & Music","M9 18V6l10-2v12 M7 16a2 2 0 100 4 2 2 0 000-4z M17 14a2 2 0 100 4 2 2 0 000-4z"],
 ["10:30 PM","Farewell","M12 3v18 M4 7.5l16 9 M4 16.5l16-9"]
];
/* ============================================== */

const $=s=>document.querySelector(s);
document.title=CONFIG.company+" Christmas Party | You're Invited";
document.querySelectorAll("[data-k]").forEach(e=>e.textContent=CONFIG[e.dataset.k]||"");
$("#maps").href=CONFIG.mapsUrl;
$("#mail").textContent=CONFIG.contactEmail;$("#mail").href="mailto:"+CONFIG.contactEmail;

const calendarStart=new Date(CONFIG.date);
const calendarEnd=new Date(calendarStart.getTime()+3*36e5);
const calendarDate=d=>d.toISOString().replace(/[-:]|\.\d{3}/g,"").slice(0,15);
const calendarParams=new URLSearchParams({
 action:"TEMPLATE",
 text:CONFIG.company+" Christmas Party",
 dates:calendarDate(calendarStart)+"/"+calendarDate(calendarEnd),
 ctz:"Asia/Manila",
 location:CONFIG.venue+", "+CONFIG.address,
 details:"Join us for the "+CONFIG.company+" Christmas Party."
});
$("#calendar").href="https://calendar.google.com/calendar/render?"+calendarParams.toString();

/* program icons */
$("#prog").innerHTML=PROGRAM.map(p=>`<div class="it"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${p[2]}"/></svg><span class="n">${p[1]}</span><span class="t">${p[0]}</span></div>`).join("");

/* hero reveal (skippable) */
const stage=$("#home");
const open=()=>stage.classList.add("opened");
setTimeout(open,700);$("#skip").onclick=open;

/* countdown */
const target=new Date(CONFIG.date).getTime();
function tick(){let s=Math.max(0,Math.floor((target-Date.now())/1000));
 const v=[["days",86400],["hours",3600],["minutes",60],["seconds",1]].map(([l,u])=>{const n=Math.floor(s/u);s-=n*u;return `<div><b>${String(n).padStart(2,"0")}</b><span>${l}</span></div>`});
 $("#count").innerHTML=v.join("")}
tick();setInterval(tick,1000);

/* RSVP */
$("#form").addEventListener("submit",e=>{
 e.preventDefault();let ok=true,firstBad=null;const f=e.target;
 const nameEl=f.elements.namedItem("name");
 const chk=(el,bad,msg)=>{el.parentElement.querySelector(".err").textContent=bad?msg:"";el.setAttribute("aria-invalid",bad?"true":"false");if(bad){ok=false;firstBad=firstBad||el}};
 chk(nameEl,nameEl.value.trim().length<2,"Enter your full name.");
 chk(f.email,!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value),"Enter a valid work email.");
 chk(f.att,!f.att.value,"Tell us if you can make it.");
 if(!ok){firstBad.focus();return}
 const data=Object.fromEntries(new FormData(f));
 const btn=f.querySelector("button[type=submit]");btn.disabled=true;btn.textContent="Sending...";
 const finish=()=>{$("#who").textContent=nameEl.value.split(" ")[0];f.style.display="none";$("#done").classList.add("show");$("#done").focus()};
 if(!CONFIG.sheetUrl){console.log("RSVP (no sheetUrl set)",data);finish();return}
 fetch(CONFIG.sheetUrl,{method:"POST",mode:"no-cors",body:new URLSearchParams(data)})
  .then(finish)
  .catch(()=>{btn.disabled=false;btn.textContent="Send my reply";alert("We couldn't send your reply. Please try again.")})});

/* scroll reveal + active nav */
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&(x.target.classList.add("in"),io.unobserve(x.target))),{threshold:.12});
document.querySelectorAll(".rv").forEach(e=>io.observe(e));
const links=[...document.querySelectorAll("nav a")];
const so=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)links.forEach(l=>l.classList.toggle("on",l.getAttribute("href")==="#"+x.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
["home","story","details","rsvp"].forEach(id=>so.observe(document.getElementById(id)));

/* snow */
(function(){const c=$("#snow"),x=c.getContext("2d");
 if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
 let W,H;const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight};rs();addEventListener("resize",rs);
 const P=Array.from({length:60},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.2+.6,v:Math.random()*.8+.3,d:Math.random()*Math.PI*2,o:Math.random()*.5+.3}));
 (function f(){x.clearRect(0,0,W,H);
  for(const p of P){p.y+=p.v;p.d+=.01;p.x+=Math.sin(p.d)*.4;if(p.y>H+5){p.y=-5;p.x=Math.random()*W}
   x.globalAlpha=p.o;x.fillStyle="#fff";x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}
  requestAnimationFrame(f)})()})();
