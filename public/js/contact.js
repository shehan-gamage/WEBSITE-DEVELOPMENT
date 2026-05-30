/* Contact Page — Form Validation & Submission */
const contactForm = document.getElementById('contactForm');
const contactBtn = document.getElementById('contactBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

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
      alert('Please fill in your name, email address, and message.');
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
        contactBtn.textContent = 'Enquiry Sent!';
        contactBtn.style.background = '#16a34a';
        contactForm.reset();
        setTimeout(() => {
          contactBtn.textContent = 'Submit Enquiry';
          contactBtn.style.background = '';
          contactBtn.disabled = false;
        }, 4000);
      } else {
        throw new Error();
      }
    } catch {
      contactBtn.textContent = 'Submit Enquiry';
      contactBtn.disabled = false;
      alert('Something went wrong. Please try again or contact us directly at info@srpitl.com.');
    }
  });
}
