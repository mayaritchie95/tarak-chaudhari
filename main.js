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

  // contact / evaluation form -> opens WhatsApp or mail with the details, since there's no backend
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

      var lines = ['Hi Tarak, I would like to connect about real estate.'];
      lines.push('');
      if (name) lines.push('Name: ' + name);
      if (phone) lines.push('Phone: ' + phone);
      if (email) lines.push('Email: ' + email);
      if (kind) lines.push('Interested in: ' + kind);
      if (addr) lines.push('Property/Address: ' + addr);
      if (msg) lines.push('Message: ' + msg);

      var text = encodeURIComponent(lines.join('\n'));
      var wa = 'https://wa.me/13063710190?text=' + text;

      var ok = form.querySelector('.msg-ok');
      if (ok) ok.classList.add('show');
      window.open(wa, '_blank');
    });
  });
});
