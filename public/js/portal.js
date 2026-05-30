/* Portal Page — Placeholder login interaction */
const portalForm = document.querySelector('.portal-login-form');
if (portalForm) {
  portalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('The Client Portal is coming soon. Please contact info@srpitl.com to learn more about portal access.');
  });
}
