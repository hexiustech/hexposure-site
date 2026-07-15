// site.js — Hexposure mini-site shared behavior
(function(){
  try { var t = localStorage.getItem('hxp-theme') || 'dark'; document.documentElement.setAttribute('data-theme', t); } catch(e){}
})();
function hxpToggleTheme(){
  var r = document.documentElement;
  var t = r.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  r.setAttribute('data-theme', t);
  try { localStorage.setItem('hxp-theme', t); } catch(e){}
}
function joinWaitlist(e, capId){
  e.preventDefault();
  var cap = document.getElementById(capId);
  var email = (cap.querySelector('input[name=email]').value || '').trim();
  if(!email) return false;
  try {
    var list = JSON.parse(localStorage.getItem('hxp-waitlist') || '[]');
    if(list.indexOf(email) === -1){ list.push(email); localStorage.setItem('hxp-waitlist', JSON.stringify(list)); }
  } catch(err){}
  document.querySelectorAll('.capture').forEach(function(c){ c.classList.add('done'); });
  return false;
}
document.addEventListener('DOMContentLoaded', function(){
  var els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){ els.forEach(function(el){ el.classList.add('in'); }); return; }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(function(el){ obs.observe(el); });

  // legal TOC scroll-spy
  var toc = document.querySelector('.legal-toc');
  if(toc){
    var links = [].slice.call(toc.querySelectorAll('a'));
    var secs = links.map(function(a){ return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
    if('IntersectionObserver' in window && secs.length){
      var spy = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){
            links.forEach(function(a){ a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); });
          }
        });
      }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
      secs.forEach(function(s){ spy.observe(s); });
    }
  }
});
