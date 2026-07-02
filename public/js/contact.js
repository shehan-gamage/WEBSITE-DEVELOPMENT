/* Contact Page — Form Validation & Submission */
const contactForm = document.getElementById('contactForm');
const contactBtn = document.getElementById('contactBtn');
const formMsg = document.getElementById('formMsg');

/* Inline status messaging (replaces blocking alert(), which suspends the page's
   JS event loop until dismissed — bad UX and un-testable by automation).
   `build` receives the message element and appends text/anchor nodes, so we
   never assign untrusted innerHTML. */
function hideMsg() {
  if (!formMsg) return;
  formMsg.hidden = true;
  formMsg.textContent = '';
  formMsg.className = 'form-msg';
}
function showMsg(type, build) {
  if (!formMsg) return;
  formMsg.textContent = '';
  formMsg.className = `form-msg form-msg--${type}`;
  build(formMsg);
  formMsg.hidden = false;
  formMsg.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMsg();

    const formData = {
      name: document.getElementById('fName').value.trim(),
      email: document.getElementById('fEmail').value.trim(),
      phone: document.getElementById('fPhone').value.trim(),
      company: document.getElementById('fCompany').value.trim(),
      service: document.getElementById('fService').value,
      subject: document.getElementById('fSubject').value.trim(),
      message: document.getElementById('fMsg').value.trim()
    };

    if (!formData.name || !formData.email || !formData.message) {
      showMsg('error', el => {
        el.textContent = 'Please fill in your name, email address, and message.';
      });
      return;
    }

    contactBtn.textContent = 'Sending...';
    contactBtn.disabled = true;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        // Redirect straight to the Thank You page on success.
        contactBtn.textContent = 'Inquiry Sent!';
        contactBtn.style.background = '#16a34a';
        let dest = '/thank-you';
        try { const data = await res.json(); if (data && data.redirect) dest = data.redirect; } catch {}
        window.location.assign(dest);
      } else {
        throw new Error();
      }
    } catch {
      contactBtn.textContent = 'Submit Inquiry';
      contactBtn.disabled = false;
      showMsg('error', el => {
        el.appendChild(document.createTextNode('Something went wrong. Please try again, or email us directly at '));
        const a = document.createElement('a');
        a.href = 'mailto:info@srpitl.com';
        a.textContent = 'info@srpitl.com';
        el.appendChild(a);
        el.appendChild(document.createTextNode('.'));
      });
    }
  });
}
