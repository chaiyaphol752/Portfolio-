import { chromium } from "@playwright/test";
const [,, url, w="360"] = process.argv;
const b = await chromium.launch(); const p = await (await b.newContext({viewport:{width:+w,height:780}})).newPage();
await p.goto(url,{waitUntil:"networkidle"});
const r = await p.evaluate(()=>{const process_all=true;const W=document.documentElement.clientWidth;const out=[];
for(const el of document.querySelectorAll("body *")){const b=el.getBoundingClientRect();if(b.right>W+1&&b.width>0){ // skip if an ancestor clips
 let a=el.parentElement,clipped=false;while(a&&a!==document.body){const s=getComputedStyle(a);if(/(auto|scroll|hidden|clip)/.test(s.overflowX)){clipped=true;break}a=a.parentElement}
 if(!clipped||process_all)out.push(el.tagName+"."+String(el.className).slice(0,80)+" right="+Math.round(b.right)+" w="+Math.round(b.width));}}
return out.slice(0,12)});
console.log(r.join("\n"));await b.close();
