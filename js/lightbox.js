/* Thomp Tech lightbox: opens figure.shot / .walk-shot images and image links in an overlay. No dependencies. */
(()=>{
  const isImg=h=>/\.(webp|png|jpe?g|gif|avif)(\?|#|$)/i.test(h||"");
  const triggers=[...document.querySelectorAll("a[href]")].filter(a=>isImg(a.getAttribute("href"))&&a.querySelector("img"));
  document.querySelectorAll("figure.shot img, .walk-shot img").forEach(img=>{if(!img.closest("a"))triggers.push(img)});
  if(!triggers.length)return;
  const items=triggers.map(t=>{const i=t.tagName==="IMG"?t:t.querySelector("img");const f=t.closest("figure");const c=f&&f.querySelector("figcaption");
    return{src:t.tagName==="A"?t.href:(i.currentSrc||i.src),alt:i.alt||"",cap:c?c.textContent.replace(/View full size\s*$/,"").trim():""}});
  const box=document.createElement("div");box.className="lb";box.hidden=true;
  box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-label","Screenshot viewer");
  box.innerHTML='<button class="lb-close" type="button" aria-label="Close">&times;</button><button class="lb-prev" type="button" aria-label="Previous image">&#8249;</button><figure class="lb-fig"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure><button class="lb-next" type="button" aria-label="Next image">&#8250;</button>';
  document.body.appendChild(box);
  const im=box.querySelector(".lb-img"),cap=box.querySelector(".lb-cap"),closeB=box.querySelector(".lb-close");
  let idx=0,last=null;
  const show=i=>{idx=(i+items.length)%items.length;const it=items[idx];im.src=it.src;im.alt=it.alt;cap.textContent=it.cap;
    box.querySelectorAll(".lb-prev,.lb-next").forEach(b=>b.hidden=items.length<2)};
  const open=i=>{last=document.activeElement;show(i);box.hidden=false;document.documentElement.classList.add("lb-open");closeB.focus()};
  const close=()=>{box.hidden=true;im.removeAttribute("src");document.documentElement.classList.remove("lb-open");last&&last.focus&&last.focus()};
  triggers.forEach((t,i)=>{if(t.tagName==="IMG"){t.tabIndex=0;t.setAttribute("role","button");t.style.cursor="zoom-in"}
    t.addEventListener("click",e=>{if(e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();open(i)});
    t.addEventListener("keydown",e=>{if(t.tagName==="IMG"&&(e.key==="Enter"||e.key===" ")){e.preventDefault();open(i)}})});
  closeB.onclick=close;box.querySelector(".lb-prev").onclick=()=>show(idx-1);box.querySelector(".lb-next").onclick=()=>show(idx+1);
  box.addEventListener("click",e=>{if(e.target===box||e.target.classList.contains("lb-fig"))close()});
  document.addEventListener("keydown",e=>{if(box.hidden)return;
    if(e.key==="Escape")close();else if(e.key==="ArrowLeft")show(idx-1);else if(e.key==="ArrowRight")show(idx+1);
    else if(e.key==="Tab"){const f=[...box.querySelectorAll("button:not([hidden])")];const a=f.indexOf(document.activeElement);e.preventDefault();f[(a+(e.shiftKey?-1:1)+f.length)%f.length].focus()}});
  let x0=null;box.addEventListener("touchstart",e=>{x0=e.touches[0].clientX},{passive:true});
  box.addEventListener("touchend",e=>{if(x0===null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)show(idx+(d<0?1:-1));x0=null});
})();
