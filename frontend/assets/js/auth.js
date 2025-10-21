/* QuickSite auth.js
- Handles signup/login forms, client-side validation, password toggles
- Provides apiFetch() wrapper that injects Authorization header when JWT exists
- Stores JWT in localStorage for demo; for production, prefer secure HTTP-only cookies
- BASE_API_URL: set to your backend origin
*/

export const BASE_API_URL = 'http://localhost:4000'; // change to your backend URL

function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

export function getToken() { return localStorage.getItem('quicksite_token'); }
export function setToken(token) { localStorage.setItem('quicksite_token', token); }
export function clearToken() { localStorage.removeItem('quicksite_token'); }

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${BASE_API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let message = 'Request failed';
    try { const body = await res.json(); message = body.message || JSON.stringify(body); } catch {}
    throw new Error(message);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

// Password visibility toggle
function bindPasswordToggles() {
  $$('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.querySelector(btn.dataset.togglePassword);
      if (!input) return;
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      btn.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  });
}

// Basic validators
function isCollegeEmail(email) {
  return /\.edu$|\.ac\.in$/.test(email.trim().toLowerCase());
}
function validatePasswordStrength(pw) { return typeof pw === 'string' && pw.length >= 8; }

// Serialize form to object
function formToJSON(form) {
  const data = new FormData(form);
  const obj = {};
  for (const [k, v] of data.entries()) obj[k] = v;
  // Include skills tags
  const tagsContainer = $('[data-tags]');
  if (tagsContainer && tagsContainer.dataset.name) {
    const name = tagsContainer.dataset.name;
    obj[name] = $$('.tag', tagsContainer).map(t => t.dataset.value);
  }
  // Include lat/lng if present
  const lat = $('#latitude')?.value; const lng = $('#longitude')?.value;
  if (lat && lng) { obj.latitude = lat; obj.longitude = lng; }
  return obj;
}

// Skills tags UI
function bindTags() {
  const container = $('[data-tags]');
  if (!container) return;
  const input = $('.tags__input', container);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      e.preventDefault();
      addTag(input.value.trim());
      input.value = '';
    }
  });
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.tag__remove');
    if (!btn) return;
    btn.parentElement.remove();
  });
  function addTag(value) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.dataset.value = value;
    tag.innerHTML = `${value} <button type="button" class="tag__remove" aria-label="Remove ${value}">×</button>`;
    container.insertBefore(tag, input);
  }
}

// Loading and error helpers
function setLoading(form, loading) {
  const btn = form.querySelector('button[type="submit"]');
  const spinner = form.querySelector('.spinner');
  if (btn && spinner) {
    btn.disabled = loading;
    spinner.hidden = !loading;
    spinner.setAttribute('aria-hidden', String(!loading));
  }
}
function setError(el, message = '') {
  if (!el) return;
  el.textContent = message;
  el.hidden = message === '';
}
function setSuccess(el, message = '') {
  if (!el) return;
  el.textContent = message;
  el.hidden = message === '';
}

// Form bindings
function bindLogin() {
  const form = $('#login-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setError($('#login-error'), '');
    setLoading(form, true);
    const body = formToJSON(form);
    try {
      const data = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
      if (data && data.token) setToken(data.token);
      // role-based redirect
      if (data && data.user && data.user.role === 'student') {
        window.location.href = './dashboard-placeholder/student.html';
      } else if (data && data.user && data.user.role === 'owner') {
        window.location.href = './dashboard-placeholder/owner.html';
      } else {
        window.location.href = './';
      }
    } catch (err) {
      setError($('#login-error'), err.message || 'Login failed');
    } finally {
      setLoading(form, false);
    }
  });
}

function bindStudentSignup() {
  const form = $('#student-signup-form');
  if (!form) return;
  const emailEl = $('#student-email');
  const pwEl = $('#student-password');
  const pwConfirmEl = $('#student-confirm-password');
  const strengthEl = $('#password-strength');

  emailEl.addEventListener('input', () => {
    emailEl.setCustomValidity('');
    const validDomain = isCollegeEmail(emailEl.value);
    if (!validDomain) {
      emailEl.setCustomValidity('Please use a college email (.edu or .ac.in)');
    }
  });

  pwEl.addEventListener('input', () => {
    const ok = validatePasswordStrength(pwEl.value);
    strengthEl.textContent = ok ? 'Strong enough' : 'Must be at least 8 characters.';
  });

  pwConfirmEl.addEventListener('input', () => {
    pwConfirmEl.setCustomValidity('');
    if (pwConfirmEl.value !== pwEl.value) pwConfirmEl.setCustomValidity('Passwords do not match');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setError($('#student-error'), '');
    setSuccess($('#student-success'), '');
    if (!form.reportValidity()) return;
    setLoading(form, true);
    const body = formToJSON(form);
    body.role = 'student';
    try {
      const data = await apiFetch('/api/auth/signup-student', { method: 'POST', body: JSON.stringify(body) });
      setSuccess($('#student-success'), 'Account created! Check your email for an OTP to verify.');
      // Placeholder: Show OTP entry UI and call /api/auth/verify-otp
      // await apiFetch('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email: body.email, otp }) });
    } catch (err) {
      setError($('#student-error'), err.message || 'Signup failed');
    } finally {
      setLoading(form, false);
    }
  });
}

function bindOwnerSignup() {
  const form = $('#owner-signup-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setError($('#owner-error'), '');
    setSuccess($('#owner-success'), '');
    if (!form.reportValidity()) return;
    setLoading(form, true);
    const body = formToJSON(form);
    body.role = 'owner';
    try {
      const data = await apiFetch('/api/auth/signup-owner', { method: 'POST', body: JSON.stringify(body) });
      setSuccess($('#owner-success'), 'Account created! Check your email for an OTP to verify.');
      // Placeholder: Show OTP entry UI and call /api/auth/verify-otp
    } catch (err) {
      setError($('#owner-error'), err.message || 'Signup failed');
    } finally {
      setLoading(form, false);
    }
  });
}

// Initialize
(function init() {
  bindPasswordToggles();
  bindTags();
  bindLogin();
  bindStudentSignup();
  bindOwnerSignup();
})();

// Socket.io placeholder example (commented):
// import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js';
// const socket = io(BASE_API_URL, { auth: { token: getToken() } });
// socket.on('connect', () => console.log('socket connected'));
