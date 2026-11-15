(function () {
  'use strict';
  var EMAIL = 'enquiries@zevqostudios.com';

  // nav background once the page has scrolled
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-stuck', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // reveal on scroll
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // reel timecode (24 fps)
  var reel = document.getElementById('reel');
  var tc = document.getElementById('tc');
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var t = reel.currentTime || 0;
    var s = Math.floor(t);
    tc.textContent = '00:' + pad(Math.floor(s / 60)) + ':' + pad(s % 60) + ':' + pad(Math.floor((t - s) * 24));
    requestAnimationFrame(tick);
  }
  if (reel && tc) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reel.removeAttribute('autoplay');
      reel.pause();
      reel.setAttribute('controls', '');
    } else {
      requestAnimationFrame(tick);
    }
  }

  // film players: swap the poster for the video on click, one playing at a time
  var players = document.querySelectorAll('.player');
  players.forEach(function (p) {
    var btn = p.querySelector('.play');
    btn.addEventListener('click', function () {
      document.querySelectorAll('.player video').forEach(function (v) { v.pause(); });
      var v = document.createElement('video');
      v.src = p.getAttribute('data-src');
      v.controls = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.poster = p.querySelector('img').getAttribute('src');
      v.addEventListener('play', function () {
        document.querySelectorAll('.player video').forEach(function (o) { if (o !== v) o.pause(); });
      });
      p.innerHTML = '';
      p.appendChild(v);
      v.play().catch(function () {});
      v.focus();
    });
  });

  // brief form: compose an email in the visitor's own mail app
  var form = document.getElementById('brief');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var subject = 'New project: ' + (d.get('Need') || '') + (d.get('Business') ? ' for ' + d.get('Business') : '');
      var body = (d.get('Brief') || '') + '\n\n' + (d.get('Name') || '') + (d.get('Business') ? '\n' + d.get('Business') : '');
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
