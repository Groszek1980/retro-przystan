/* Galeria gry LOT NAD WISLA: bez zewnetrznych bibliotek i bez ingerencji w emulator. */
(function(){
  'use strict';
  var buttons=Array.prototype.slice.call(document.querySelectorAll('.game-gallery-thumb'));
  var dialog=document.getElementById('gameGalleryDialog');
  var big=document.getElementById('gameGalleryBig');
  var caption=document.getElementById('gameGalleryTitle');
  var counter=document.getElementById('gameGalleryCounter');
  if(!buttons.length||!dialog||!big) return;
  var active=0;
  var lastTrigger=null;
  function display(index){
    active=(index+buttons.length)%buttons.length;
    var thumb=buttons[active];
    var img=thumb.querySelector('img');
    // W powiększeniu używamy osobnego obrazu wysokiej rozdzielczości,
    // a nie miniatury 240 px. Miniatury pozostają lekkie.
    var full=thumb.getAttribute('data-full') || img.getAttribute('src');
    big.src=full;
    var original=document.getElementById('gameGalleryOriginalLink');
    if(original) original.href=full;
    big.alt=img.alt;
    caption.textContent=thumb.closest('figure').querySelector('figcaption strong').textContent;
    counter.textContent=(active+1)+' / '+buttons.length;
  }
  function close(){
    dialog.close();
  }
  buttons.forEach(function(button,index){
    button.addEventListener('click',function(){
      lastTrigger=button;
      display(index);
      if(typeof dialog.showModal==='function') dialog.showModal();
      else dialog.setAttribute('open','');
      document.getElementById('gameGalleryClose').focus();
    });
  });
  document.getElementById('gameGalleryClose').addEventListener('click',close);
  document.getElementById('gameGalleryPrev').addEventListener('click',function(){display(active-1);});
  document.getElementById('gameGalleryNext').addEventListener('click',function(){display(active+1);});
  dialog.addEventListener('click',function(event){if(event.target===dialog)close();});
  dialog.addEventListener('close',function(){if(lastTrigger)lastTrigger.focus();});
  document.addEventListener('keydown',function(event){
    if(!dialog.open) return;
    if(event.key==='ArrowLeft'){event.preventDefault();display(active-1);}
    else if(event.key==='ArrowRight'){event.preventDefault();display(active+1);}
    else if(event.key==='Escape'&&typeof dialog.close!=='function'){
      dialog.removeAttribute('open');if(lastTrigger)lastTrigger.focus();
    }
  });
})();