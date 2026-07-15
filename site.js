// site.js — Hexposure mini-site shared behavior
(function(){
  try { var t = localStorage.getItem('hxp-theme') || 'light'; document.documentElement.setAttribute('data-theme', t); } catch(e){}
})();
function hxpToggleTheme(){
  var r = document.documentElement;
  var t = r.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  r.setAttribute('data-theme', t);
  try { localStorage.setItem('hxp-theme', t); } catch(e){}
}
// Waitlist submission — same mechanism/destination as hexius-source-v2:
// POST to the shared Google Form's formResponse endpoint via a hidden iframe
// (no CORS). Email-only leads are tagged so they're recognizable in the sheet.
// To route Hexposure elsewhere, swap HXP_FORM.url / entry ids for a dedicated form.
var HXP_FORM = {
  url: 'https://docs.google.com/forms/d/e/1FAIpQLScn-Sr6Ibc2z4MgFDctcvkW_aCvRVnmZnWBKCh7qB1_hY7ONA/formResponse',
  entry: {
    name: 'entry.327635613',
    email: 'entry.966433351',
    company: 'entry.46439575',
    company2: 'entry.1960370376',
    service: 'entry.610128610',
    message: 'entry.835111868',
    consent: 'entry.2115631709'
  }
};
function hxpIsFr(){ return document.documentElement.lang === 'fr'; }
function joinWaitlist(e, capId){
  e.preventDefault();
  var cap = document.getElementById(capId);
  var form = cap ? cap.querySelector('form') : null;
  var input = form ? form.querySelector('input[name=email]') : null;
  var email = ((input && input.value) || '').trim();
  var fr = hxpIsFr();
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!email || !emailRe.test(email)){
    if(input){ input.setAttribute('aria-invalid','true'); input.focus(); }
    return false;
  }
  if(input) input.removeAttribute('aria-invalid');

  var btn = form ? form.querySelector('button[type=submit]') : null;
  var btnHtml = btn ? btn.innerHTML : '';
  if(btn){ btn.disabled = true; btn.textContent = fr ? 'Envoi…' : 'Submitting…'; }

  // Only the email is user-provided; fill every other Google Form field with
  // blank data and tag the lead as "hexposure.ca waitlist" so it's recognizable.
  var TAG = 'hexposure.ca waitlist';
  var data = {};
  data[HXP_FORM.entry.name]     = TAG;
  data[HXP_FORM.entry.email]    = email;
  data[HXP_FORM.entry.company]  = '';
  data[HXP_FORM.entry.company2] = '';
  data[HXP_FORM.entry.service]  = '';
  data[HXP_FORM.entry.message]  = TAG;
  data[HXP_FORM.entry.consent]  = '';

  hxpSubmitWaitlist(data, function(ok){
    if(ok){
      document.querySelectorAll('.capture').forEach(function(c){ c.classList.add('done'); });
    } else {
      if(btn){ btn.disabled = false; btn.innerHTML = btnHtml; }
      if(input) input.setAttribute('aria-invalid','true');
      alert(fr ? "Une erreur s'est produite. Réessayez ou écrivez-nous." : 'Something went wrong. Please try again or email us.');
    }
  });
  return false;
}
function hxpSubmitWaitlist(data, done){
  var old = document.getElementById('hxp-gf-iframe'); if(old) old.remove();
  var iframe = document.createElement('iframe');
  iframe.id = 'hxp-gf-iframe'; iframe.name = 'hxp-gf-iframe';
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:0;opacity:0;visibility:hidden;pointer-events:none;';
  document.body.appendChild(iframe);

  var tf = document.createElement('form');
  tf.method = 'POST'; tf.action = HXP_FORM.url; tf.target = 'hxp-gf-iframe';
  tf.acceptCharset = 'UTF-8'; tf.style.display = 'none';
  Object.keys(data).forEach(function(k){
    var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = String(data[k] || ''); tf.appendChild(i);
  });
  document.body.appendChild(tf);

  var handled = false, tid;
  function finish(ok){
    if(handled) return; handled = true;
    if(tid) clearTimeout(tid);
    setTimeout(function(){
      if(document.body.contains(tf)) tf.remove();
      if(document.body.contains(iframe)) iframe.remove();
    }, 2000);
    done(ok);
  }
  // Google's response is cross-origin (opaque): a load or the timeout means it went through.
  iframe.onload = function(){ setTimeout(function(){ finish(true); }, 600); };
  iframe.onerror = function(){ finish(false); };
  tid = setTimeout(function(){ finish(true); }, 5000);
  try { tf.submit(); } catch(err){ finish(false); }
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
