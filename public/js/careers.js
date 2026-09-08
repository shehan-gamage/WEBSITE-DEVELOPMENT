/* Careers — speculative / role application form.
   Mirrors public/js/contact.js: inline status messaging (never alert(), which
   blocks the event loop and cannot be driven by automation) and a redirect to
   /thank-you on success. Text nodes only — no innerHTML with user input. */
const careersForm = document.getElementById('careersForm');
const careersBtn  = document.getElementById('careersBtn');
const careersMsg  = document.getElementById('careersMsg');

function hideCareersMsg() {
  if (!careersMsg) return;
  careersMsg.hidden = true;
  careersMsg.textContent = '';
  careersMsg.className = 'form-msg';
}

function showCareersMsg(type, build) {
  if (!careersMsg) return;
  careersMsg.textContent = '';
  careersMsg.className = `form-msg form-msg--${type}`;
  build(careersMsg);
  careersMsg.hidden = false;
  careersMsg.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* "Apply for This Role" on a listed vacancy jumps to the form and pre-fills the
   position, so a candidate never has to retype the title they just clicked. */
document.querySelectorAll('[data-apply-role]').forEach((link) => {
  link.addEventListener('click', () => {
    const field = document.getElementById('cPosition');
    if (field) field.value = link.getAttribute('data-apply-role') || '';
  });
});

if (careersForm) {
  careersForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideCareersMsg();

    const payload = {
      name:     document.getElementById('cName').value.trim(),
      email:    document.getElementById('cEmail').value.trim(),
      phone:    document.getElementById('cPhone').value.trim(),
      position: document.getElementById('cPosition').value.trim(),
      location: document.getElementById('cLocation').value,
      cvLink:   document.getElementById('cCvLink').value.trim(),
      message:  document.getElementById('cMsg').value.trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      showCareersMsg('error', (el) => {
        el.textContent = 'Please provide your name, email address, and a short covering note.';
      });
      return;
    }

    const originalLabel = careersBtn.textContent;
    careersBtn.textContent = 'Sending...';
    careersBtn.disabled = true;

    try {
      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        careersBtn.textContent = 'Application Sent';
        careersBtn.style.background = '#16a34a';
        let dest = '/thank-you';
        try {
          const data = await res.json();
          if (data && data.redirect) dest = data.redirect;
        } catch { /* non-JSON success — fall back to the default destination */ }
        window.location.assign(dest);
      } else {
        throw new Error();
      }
    } catch {
      careersBtn.textContent = originalLabel;
      careersBtn.disabled = false;
      showCareersMsg('error', (el) => {
        el.appendChild(document.createTextNode('Something went wrong. Please try again, or email your application to '));
        const a = document.createElement('a');
        /* Read from the form so this address stays in step with data/careers.js
           rather than drifting as a second hardcoded copy. */
        const to = careersForm.dataset.careersEmail || 'info@srpitl.com';
        a.href = `mailto:${to}`;
        a.textContent = to;
        el.appendChild(a);
        el.appendChild(document.createTextNode('.'));
      });
    }
  });
}
