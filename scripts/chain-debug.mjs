import { chromium } from "@playwright/test";
const b = await chromium.launch(); const p = await (await b.newContext({viewport:{width:360,height:780}})).newPage();
await p.goto(process.argv[2],{waitUntil:"networkidle"});
console.log(await p.evaluate((sel)=>{let e=document.querySelector(sel);const o=[];while(e&&e!==document.documentElement){const s=getComputedStyle(e);o.push(e.tagName+"."+String(e.className).slice(0,60)+" w="+Math.round(e.getBoundingClientRect().width)+" disp="+s.display+" ox="+s.overflowX);e=e.parentElement}return o.join("\n")},process.argv[3]));await b.close();
