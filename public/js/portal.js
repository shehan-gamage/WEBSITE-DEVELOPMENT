/* Portal Page — Placeholder login interaction */
const portalForm = document.querySelector('.portal-login-form');
if (portalForm) {
  let msg = null;
  portalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Inline notice instead of a blocking alert(). Built from nodes (no innerHTML).
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'portal-msg';
      msg.setAttribute('role', 'status');
      portalForm.appendChild(msg);
    }
    msg.textContent = '';
    msg.appendChild(document.createTextNode('The Client Portal is coming soon. To learn more about portal access, email us at '));
    const a = document.createElement('a');
    a.href = 'mailto:info@srpitl.com';
    a.textContent = 'info@srpitl.com';
    msg.appendChild(a);
    msg.appendChild(document.createTextNode('.'));
  });
}
