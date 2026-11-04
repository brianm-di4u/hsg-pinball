// Baseline regression for S3 pinball-baseline-D2-glass-title-overlap.
// Real DOM layout and actual Play click; no state/clock/score/ball mutations.
export const tests=[{
 name:'desktop backglass title clears artwork in direct and player-sized frames',viewports:['desktop'],
 async run(t){
  await t.page.locator('#b-play').click();
  for(const [name,width,height]of [['D1-direct',1920,1080],['D2-direct',1366,768],['D1-player-frame',1920,1032],['D2-player-frame',1366,720]]){
   await t.page.setViewportSize({width,height});await t.page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const boxes=await t.page.evaluate(()=>{const box=selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,top:r.top,bottom:r.bottom,right:r.right};};return{title:box('.glass-title'),art:box('.glass-art'),bigFont:parseFloat(getComputedStyle(document.querySelector('.glass-title .t-big')).fontSize),smallFont:parseFloat(getComputedStyle(document.querySelector('.glass-title .t-small')).fontSize),viewport:{width:innerWidth,height:innerHeight}};});
   const gap=boxes.art.top-boxes.title.bottom;t.log(name,JSON.stringify({...boxes,gap}));
   t.expect(gap>=12,name+': at least12px between title andart; actual '+gap.toFixed(3));
   t.expect(boxes.title.top>=0&&boxes.art.bottom<=height+1,name+': title andart remain inside frame');
   t.expect(Math.abs(boxes.art.width/boxes.art.height-2/3)<0.002,name+': backdrop retains2:3aspect');
   t.expect(Math.abs(boxes.bigFont-(32+width*0.022))<0.03&&Math.abs(boxes.smallFont-(16.8+width*0.006))<0.03,name+': normal desktop title font sizes unchanged');
   await t.shot('backglass-layout-'+name,{fullPage:false});
  }
 }
}];
