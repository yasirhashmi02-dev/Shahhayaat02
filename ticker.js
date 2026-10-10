document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.tk').forEach(function(tk){
    var b=tk.querySelector('.tk-pause');if(!b)return;
    b.addEventListener('click',function(){
      var p=tk.classList.toggle('is-paused');
      b.setAttribute('aria-pressed',p?'true':'false');
      b.setAttribute('aria-label',p?'Play announcements':'Pause announcements');
    });
  });
});
