// nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // header shadow on scroll
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // reveal-on-scroll (respects reduced motion)
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { obs.observe(el); });
    }
  }

  // contact / evaluation forms -> send to Formspree (email) + offer WhatsApp as instant option
  var FORMSPREE = 'https://formspree.io/f/xjywjjdl';
  document.querySelectorAll('form[data-lead]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var kind = (data.get('intent') || form.getAttribute('data-lead') || 'General enquiry').toString();
      var msg = (data.get('message') || '').toString().trim();
      var addr = (data.get('address') || '').toString().trim();

      // give Formspree tidy fields + a useful subject line
      data.set('_subject', 'New website lead: ' + kind);
      if (phone) data.set('_replyto', email || phone);

      var btn = form.querySelector('button[type="submit"]');
      var ok = form.querySelector('.msg-ok');
      var origBtnText = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }

      // build the WhatsApp fallback link
      var lines = ['Hi Tarak, I would like to connect about real estate.', ''];
      if (name) lines.push('Name: ' + name);
      if (phone) lines.push('Phone: ' + phone);
      if (email) lines.push('Email: ' + email);
      if (kind) lines.push('Interested in: ' + kind);
      if (addr) lines.push('Property/Address: ' + addr);
      if (msg) lines.push('Message: ' + msg);
      var wa = 'https://wa.me/13063710190?text=' + encodeURIComponent(lines.join('\n'));

      fetch(FORMSPREE, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          if (ok) {
            ok.classList.add('show');
            ok.innerHTML = 'Thanks ' + (name ? name.split(' ')[0] : '') +
              '! Your message has been sent — I\u2019ll be in touch soon. ' +
              'Prefer to chat now? <a href="' + wa + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">Message me on WhatsApp</a>.';
          }
        } else {
          throw new Error('Formspree error');
        }
      }).catch(function () {
        // if the email send fails, fall back to WhatsApp so the lead isn't lost
        if (ok) {
          ok.classList.add('show');
          ok.innerHTML = 'Opening WhatsApp so you can send your message directly…';
        }
        window.open(wa, '_blank');
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = origBtnText; }
      });
    });
  });
});
