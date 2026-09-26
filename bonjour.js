// bonjour.js — event landing page (/bonjour) lead form.
// Posts to the same Google Form as the waitlist via hxpSubmitWaitlist() (site.js).
// No backend means no email confirmation, so the gate is up front: work email only,
// and the analyzed domain is always the email's own. The team re-checks each lead by
// hand before running a scan.
//
// Injection policy: every value sent to the form is whitelisted character by
// character, because leads land in a Google Sheet that may later be exported to CSV
// or rendered by another tool. Visitor input only ever reaches the DOM through
// textContent. (The form endpoint itself is public, so the sheet must still be
// treated as untrusted: this page is not the only thing that can post to it.)
(function(){
  // Free webmail, ISP mailboxes (Québec / Canada heavy) and disposable providers.
  // A subdomain of any of these is blocked too (e.g. mail.yahoo.com).
  var BLOCKED = [
    // webmail
    'gmail.com','googlemail.com','outlook.com','outlook.fr','outlook.ca','hotmail.com','hotmail.ca',
    'hotmail.fr','live.com','live.ca','live.fr','msn.com','yahoo.com','yahoo.ca','yahoo.fr',
    'ymail.com','rocketmail.com','icloud.com','me.com','mac.com','aol.com','aim.com',
    'proton.me','protonmail.com','protonmail.ch','pm.me','gmx.com','gmx.net','gmx.fr','gmx.de',
    'mail.com','email.com','yandex.com','yandex.ru','zohomail.com','fastmail.com','fastmail.fm',
    'tutanota.com','tuta.io','tutamail.com','hey.com','inbox.com','hushmail.com','mail.ru',
    'laposte.net','orange.fr','free.fr','sfr.fr','wanadoo.fr','qq.com','163.com',
    // Canadian ISPs
    'videotron.ca','videotron.net','sympatico.ca','bell.net','rogers.com','shaw.ca','telus.net',
    'cgocable.ca','cogeco.ca','cogeco.net','globetrotter.net','eastlink.ca','bellnet.ca',
    'b2b2c.ca','ebox.com','distributel.ca','teksavvy.com','oricom.ca','derytele.com',
    // disposable
    'mailinator.com','guerrillamail.com','guerrillamail.net','guerrillamailblock.com','grr.la',
    'sharklasers.com','10minutemail.com','10minutemail.net','temp-mail.org','tempmail.com',
    'tempmail.net','tempmailo.com','tmpmail.org','yopmail.com','yopmail.fr','yopmail.net',
    'trashmail.com','trashmail.de','getnada.com','nada.email','dispostable.com','maildrop.cc',
    'mailnesia.com','mintemail.com','throwawaymail.com','fakeinbox.com','spamgourmet.com',
    'mohmal.com','emailondeck.com','burnermail.io','moakt.com','mail.tm','mailpoof.com',
    'inboxkitten.com','mytemp.email','tempr.email','discard.email','33mail.com','spam4.me',
    'getairmail.com','harakirimail.com','mailcatch.com','temp-mail.io','emailfake.com'
  ];
  var blockedSet = {};
  BLOCKED.forEach(function(d){ blockedSet[d] = true; });

  function isBlocked(domain){
    var parts = domain.split('.');
    for(var i = 0; i < parts.length - 1; i++){
      if(blockedSet[parts.slice(i).join('.')]) return true;
    }
    return false;
  }

  // Strict on purpose: letters, digits, dots, hyphens only. No `<>"'=` or spaces
  // can reach the lead record, and nothing can start with a formula character.
  var DOMAIN_RE = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{0,61}[a-z0-9]$/;
  var LOCAL_RE = /^[a-z0-9][a-z0-9._%+-]{0,63}$/;
  var LANGS = { fr: 'fr', en: 'en' };

  // Split and validate a lowercased email; null unless both halves are clean.
  function parseEmail(v){
    var at = v.lastIndexOf('@');
    if(at < 1 || v.indexOf('@') !== at) return null;
    var local = v.slice(0, at), domain = v.slice(at + 1);
    if(!LOCAL_RE.test(local) || !DOMAIN_RE.test(domain)) return null;
    return { email: local + '@' + domain, domain: domain };
  }

  // UTM values come straight from the URL, so they are the one input fully under an
  // attacker's control: keep [a-z0-9._-] only, capped.
  function utm(key){
    var v = '';
    try { v = new URLSearchParams(location.search).get(key) || ''; } catch(e){}
    return v.toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 50);
  }

  function setupForm(form){
    var cap = form.closest('.capture');
    var eIn = form.querySelector('input[name=email]');
    var hp = form.querySelector('input[name=website]');
    var err = form.querySelector('.lp-err');
    var btn = form.querySelector('button[type=submit]');
    var ds = form.dataset;
    var lang = LANGS[ds.lang] || 'fr';

    function fail(msg){
      if(msg){ eIn.setAttribute('aria-invalid', 'true'); eIn.focus(); }
      else eIn.removeAttribute('aria-invalid');
      err.textContent = msg;
    }
    function done(domain){
      // textContent, never innerHTML: the domain came from the visitor.
      var tx = cap.querySelector('.lp-thanks-text');
      if(tx) tx.textContent = ds.thanks.replace('{domain}', domain);
      cap.classList.add('done');
      var th = cap.querySelector('.thanks'); if(th) th.focus();
    }

    eIn.addEventListener('input', function(){ fail(''); });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var parsed = parseEmail((eIn.value || '').trim().toLowerCase());
      if(!parsed) return fail(ds.errEmail);
      if(isBlocked(parsed.domain)) return fail(ds.errFree);
      fail('');

      var email = parsed.email;
      var domain = parsed.domain.replace(/^www\./, '');

      // Bots fill every field; pretend it worked and send nothing.
      if(hp && hp.value) return done(domain);

      var E = HXP_FORM.entry, data = {};
      data[E.name]     = 'hexposure.ca event: ' + ds.event;
      data[E.email]    = email;
      data[E.company]  = domain;
      data[E.company2] = ds.event;
      // Required checkbox on the shared form; same valid option site.js uses.
      data[E.service]  = 'General inquiry / Demande Générale';
      // key=value pairs so the sheet column can be split on " | ". Starts with fixed
      // text, so the cell can never be read as a formula.
      data[E.message]  = [
        'Free attack surface report (500$ offer)',
        'event=' + ds.event,
        'email=' + email,
        'domain=' + domain,
        'language=' + lang,
        'utm_source=' + utm('utm_source'),
        'utm_medium=' + utm('utm_medium'),
        'utm_campaign=' + utm('utm_campaign'),
        'timestamp=' + new Date().toISOString(),
        'ref=/bonjour'
      ].join(' | ');

      var btnHtml = btn.innerHTML;  // author markup only, restored on failure
      btn.disabled = true; btn.textContent = ds.sending;
      hxpSubmitWaitlist(data, function(ok){
        if(ok){
          done(domain);
          try { if(window.umami) umami.track('bonjour-lead', { lang: lang, event: ds.event }); } catch(e){}
        } else {
          btn.disabled = false; btn.innerHTML = btnHtml;
          fail(ds.errGeneric);
        }
      });
    });
  }

  document.querySelectorAll('form.lp-form').forEach(setupForm);

  // Second CTA: scroll back to this column's form, then put the cursor in it.
  document.querySelectorAll('a.lp-jump').forEach(function(a){
    a.addEventListener('click', function(e){
      var cap = document.querySelector(a.getAttribute('href'));
      var input = document.getElementById(a.dataset.target);
      if(!cap) return;
      e.preventDefault();
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      cap.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      if(input && !cap.classList.contains('done')){
        setTimeout(function(){ input.focus({ preventScroll: true }); }, reduce ? 0 : 450);
      }
    });
  });
})();
