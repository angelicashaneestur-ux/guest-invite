(function () {
  const app = document.getElementById('app');

  app.style.setProperty('--accent', CONFIG.event.accentColor);
  document.title = `Join ${CONFIG.event.childName}'s Celebration`;

  const state = { screen: 'opening', guestCount: 1, guestName: '' };

  let musicAudio = null;
  let musicMuted = false;
  let musicBtn = null;
  const ICON_SOUND_ON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 5V4L8 9H4z" fill="#fff"/><path d="M16.5 8.5a5 5 0 010 7" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M19 6a9 9 0 010 12" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/></svg>';
  const ICON_SOUND_OFF = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 5V4L8 9H4z" fill="#fff"/><path d="M16 9l5 6M21 9l-5 6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>';

  function ensureMusicButton() {
    if (musicBtn || !CONFIG.backgroundMusicUrl) return;
    musicBtn = document.createElement('button');
    musicBtn.setAttribute('aria-label', 'Toggle background music');
    musicBtn.style.cssText = 'position:fixed; bottom:calc(18px + env(safe-area-inset-bottom)); right:18px; z-index:1000; width:42px; height:42px; border-radius:50%; border:none; cursor:pointer; background:rgba(30,24,16,0.72); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,0.25);';
    musicBtn.innerHTML = ICON_SOUND_ON;
    musicBtn.addEventListener('click', () => {
      if (!musicAudio) return;
      musicMuted = !musicMuted;
      musicAudio.muted = musicMuted;
      musicBtn.innerHTML = musicMuted ? ICON_SOUND_OFF : ICON_SOUND_ON;
    });
    document.body.appendChild(musicBtn);
  }

  function startMusic() {
    if (!CONFIG.backgroundMusicUrl || musicAudio) return;
    ensureMusicButton();
    musicAudio = new Audio(CONFIG.backgroundMusicUrl);
    musicAudio.loop = true;
    musicAudio.volume = 0.4;
    musicAudio.play().catch(() => {});
    if (musicBtn) musicBtn.style.display = 'flex';
  }

  function goTo(screen) {
    state.screen = screen;
    render();
  }

  function submitRsvp(response) {
    if (CONFIG.rsvpEndpoint) {
      fetch(CONFIG.rsvpEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: state.guestName || 'Guest',
          response,
          guestCount: state.guestCount,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {
        // Best-effort: the confirmation screen still shows regardless of network state.
      });
    }
    goTo(response === 'accepted' ? 'confirmed-accept' : 'confirmed-decline');
  }

  function photoGrid(images, cols, tint) {
    const rows = cols ? Math.ceil(images.length / cols) : images.length;
    const gridStyle = cols
      ? `grid-template-columns:${'1fr '.repeat(cols).trim()}; grid-template-rows:${'1fr '.repeat(rows).trim()};`
      : `grid-template-rows:${'1fr '.repeat(images.length).trim()};`;
    return `
      <div style="position:absolute; inset:0; display:grid; ${gridStyle}">
        ${images.map(src => `<img src="${src}" alt="${CONFIG.event.childName}" style="width:100%; height:100%; object-fit:cover; display:block;" />`).join('')}
      </div>
      <div style="position:absolute; inset:0; background:${tint || 'rgba(239,233,220,0.3)'};"></div>`;
  }

  function screenOpening() {
    return `
      <div class="screen screen-opening">
        <img src="assets/baby-photo.jpg" alt="${CONFIG.event.childName}">
        <div class="scrim"></div>
        <div class="copy fade-up">
          <div class="eyebrow">I'd love to see you at my</div>
          <div class="headline">Celebration</div>
          <button class="btn-primary-light pulse-glow" data-action="goToInvite">Open Invitation</button>
        </div>
      </div>`;
  }

  function screenInvite() {
    return `
      <div class="screen screen-photo-bg">
        ${photoGrid(['assets/invite-bg-1.jpg', 'assets/invite-bg-2.jpg', 'assets/invite-bg-3.jpg'])}
        <div class="scroll-content" style="padding:36px 24px calc(28px + env(safe-area-inset-bottom)); gap:18px;">
          <div class="card-white fade-up" style="animation-delay:.1s">
            <p class="invite-msg">Hi, it's me, ${CONFIG.event.childName}! I would be so happy to have you there as I celebrate this special day.</p>
          </div>
          <div class="card-event fade-up" style="animation-delay:.15s">
            <div class="title">${CONFIG.event.childName}'s Celebration</div>
            <div class="row"><div class="label">Date</div><div class="value">${CONFIG.event.eventDate}</div></div>
            <div class="row"><div class="label">Time</div><div class="value">${CONFIG.event.reception.time}</div></div>
            <div class="row"><div class="label">Venue</div><div class="value">${CONFIG.event.reception.name}</div></div>
          </div>
          <button class="btn-primary-dark fade-up" style="animation-delay:.2s" data-action="goToRsvp">Give Your Answer</button>
        </div>
      </div>`;
  }

  function screenRsvp() {
    return `
      <div class="screen screen-photo-bg">
        ${photoGrid(['assets/rsvp-bg-1.jpg', 'assets/rsvp-bg-2.jpg', 'assets/rsvp-bg-3.jpg'])}
        <div class="scroll-content" style="padding:calc(20px + env(safe-area-inset-top)) 24px calc(28px + env(safe-area-inset-bottom));">
          <button style="align-self:flex-start; border:none; background:rgba(255,255,255,0.9); color:#6B5E42; font-size:14px; font-weight:600; padding:8px 14px; border-radius:10px; font-family:'DM Sans', sans-serif;" data-action="backToInvite">&larr; Back</button>

          <div class="card-white fade-up" style="margin-top:18px;">
            <div class="question">So, will you?</div>
            <p class="rsvp-text">I'd love to know if you can join me on ${CONFIG.event.eventDate}.</p>
          </div>

          <div class="card-white" style="margin-top:20px;">
            <div style="font-size:13px; font-weight:700; color:#2B2118;">Your name</div>
            <input type="text" placeholder="e.g. Maria Santos" value="${state.guestName}" data-action="guestName" style="width:100%; margin-top:8px; padding:12px 14px; border-radius:10px; border:1px solid #D8CDB4; font-family:'DM Sans', sans-serif; font-size:15px; font-weight:600; color:#2B2118; box-sizing:border-box;" />
            <div style="font-size:13px; font-weight:700; color:#2B2118; margin-top:16px;">How many will be attending, including you?</div>
            <input type="number" min="1" value="${state.guestCount}" data-action="guestCount" style="width:100%; margin-top:8px; padding:12px 14px; border-radius:10px; border:1px solid #D8CDB4; font-family:'DM Sans', sans-serif; font-size:15px; font-weight:600; color:#2B2118; box-sizing:border-box;" />
          </div>

          <div style="margin-top:20px; display:flex; flex-direction:column; gap:14px;">
            <button class="btn-accept" data-action="accept">Yes, I'll be there</button>
            <button class="btn-decline-solid" data-action="decline">I'm unable to attend</button>
          </div>
        </div>
      </div>`;
  }

  function screenConfirmed(accepted) {
    const confirmColor = accepted ? CONFIG.event.accentColor : '#B08B5A';
    const confirmGlyph = accepted ? '✓' : '♥';
    const confirmTitle = accepted ? 'Yay, thank you!' : "That's okay";
    const guestPhrase = state.guestCount == 1 ? 'just you' : `plus ${state.guestCount - 1} more`;
    const confirmBody = accepted
      ? `I'm so happy you said yes! Can't wait to see you (${guestPhrase}) on ${CONFIG.event.eventDate} at ${CONFIG.event.reception.name}.`
      : `Thank you for letting me know. I'll miss having you there, but I understand — I still love you either way.`;

    const detailsHtml = accepted ? `
      <div class="card-note fade-up" style="animation-delay:.18s">
        <div style="font-size:13px; color:#42392A; font-style:italic;">Color code:</div>
        <div style="display:flex; gap:8px; margin-top:6px;">
          ${CONFIG.event.colorCodes.map(c => `<img src="${c.img}" alt="${c.label}" style="width:44px; height:44px; border-radius:50%; object-fit:cover; border:1px solid rgba(0,0,0,0.08);" />`).join('')}
        </div>
        <p style="font-size:13px; line-height:1.6; color:#42392A; margin:8px 0 0; font-style:italic;">${CONFIG.event.dressCode}</p>
      </div>

      <div class="gift-card fade-up" style="animation-delay:.2s">
        <div class="heading">Your presence is enough, but if you'd like to bring a gift, here are some ideas:</div>
        <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:10px;">
          ${CONFIG.giftIdeas.map((g, i) => `
            <div style="width:calc(50% - 6px); font-size:13px; color:#42392A; display:flex; align-items:center; gap:8px; animation: fadeUp .5s ease ${(0.1 * i).toFixed(1)}s both;">
              <img src="${g.img}" alt="${g.label}" style="width:36px; height:36px; border-radius:8px; object-fit:cover; flex:none; background:#F3ECD9;" />
              ${g.label}
            </div>`).join('')}
        </div>
      </div>` : '';

    const receptionBtn = accepted
      ? `<button class="btn-primary-dark" style="width:auto; padding:14px 22px; margin-top:0;" data-action="goToReception">Reception Details</button>`
      : '';

    return `
      <div class="screen screen-photo-bg">
        ${photoGrid(['assets/confirm-bg-1.jpg','assets/confirm-bg-2.jpg','assets/confirm-bg-3.jpg','assets/confirm-bg-4.jpg','assets/confirm-bg-5.jpg','assets/confirm-bg-6.jpg','assets/confirm-bg-7.jpg','assets/confirm-bg-8.jpg'], 2)}
        <div class="scroll-content" style="align-items:center; padding:32px 32px calc(32px + env(safe-area-inset-bottom)); text-align:center;">
          <div class="badge pop-in pulse-glow" style="background:${confirmColor}"><span>${confirmGlyph}</span></div>
          <div class="card-white fade-up" style="margin-top:22px; animation-delay:.1s;">
            <div class="title" style="margin-top:0;">${confirmTitle}</div>
            <p class="body-text">${confirmBody}</p>
          </div>
          ${detailsHtml}
          <div style="display:flex; gap:12px; margin-top:26px;">
            <button style="padding:14px 22px; border:none; border-radius:12px; background:rgba(255,255,255,0.9); color:#6B5E42; font-size:14px; font-weight:600; font-family:'DM Sans', sans-serif;" data-action="backToInvite">Back to Invitation</button>
            ${receptionBtn}
          </div>
        </div>
      </div>`;
  }

  function screenReception() {
    return `
      <div class="screen screen-photo-bg screen-reception">
        ${photoGrid(['assets/reception-bg.jpg', 'assets/reception-bg-2.jpg', 'assets/reception-bg-3.jpg'], null, 'rgba(244,238,224,0.3)')}
        <div class="checker-corner checker-corner--tl"></div>
        <div class="checker-corner checker-corner--tr"></div>
        <div class="checker-corner checker-corner--bl"></div>
        <div class="checker-corner checker-corner--br"></div>

        <button class="btn-back" style="position:absolute; top:20px; left:24px; z-index:2;" data-action="backToConfirmed">&larr; Back</button>
        <button style="position:absolute; top:20px; right:24px; z-index:2; border:none; background:rgba(255,255,255,0.9); color:#2B2118; font-size:13px; font-weight:600; padding:8px 14px; border-radius:10px; font-family:'DM Sans', sans-serif;" data-action="goToClosing">Next &rarr;</button>

        <div class="scroll-content" style="align-items:center; padding:88px 32px calc(40px + env(safe-area-inset-bottom));">
          <div style="background:rgba(255,255,255,0.92); border-radius:14px; padding:8px 20px; font-family:'Cormorant Garamond', serif; font-style:italic; font-weight:600; font-size:34px; color:#1c2634;">Location Guide</div>
          <div style="background:rgba(255,255,255,0.92); border-radius:10px; padding:5px 14px; font-size:11.5px; letter-spacing:1.5px; text-transform:uppercase; color:${CONFIG.event.accentColor}; font-weight:700; margin-top:10px;">The Race to Celebrate</div>

          <div class="stop-card" style="margin-top:44px;">
            <img src="${CONFIG.event.reception.logo}" alt="${CONFIG.event.reception.name}" style="width:56px; height:56px; border-radius:50%; object-fit:cover; border:2px solid ${CONFIG.event.accentColor}; margin-bottom:8px; background:#fff;" />
            <div class="stop-time">🏁 ${CONFIG.event.reception.time}</div>
            <div class="stop-name">${CONFIG.event.reception.name}</div>
            <div class="stop-label">Reception</div>
          </div>

          <div class="reception-note">${CONFIG.event.reception.note}</div>
        </div>
      </div>`;
  }

  function screenClosing() {
    return `
      <div class="screen screen-closing">
        <img src="assets/closing-photo.jpg" alt="${CONFIG.event.childName}">
        <div class="scrim"></div>
        <button style="position:absolute; top:20px; left:24px; border:none; background:rgba(255,255,255,0.9); color:#2B2118; font-size:14px; font-weight:600; padding:8px 14px; border-radius:10px; font-family:'DM Sans', sans-serif;" data-action="backToReception">&larr; Back</button>
        <div class="closing-copy fade-up" style="animation-delay:.1s">
          <div class="closing-signoff">Love,</div>
          <div class="closing-name">${CONFIG.event.childName}</div>
        </div>
      </div>`;
  }

  function render() {
    switch (state.screen) {
      case 'opening': app.innerHTML = screenOpening(); break;
      case 'invite': app.innerHTML = screenInvite(); break;
      case 'rsvp': app.innerHTML = screenRsvp(); break;
      case 'confirmed-accept': app.innerHTML = screenConfirmed(true); break;
      case 'confirmed-decline': app.innerHTML = screenConfirmed(false); break;
      case 'reception': app.innerHTML = screenReception(); break;
      case 'closing': app.innerHTML = screenClosing(); break;
    }
  }

  app.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'goToInvite') { startMusic(); goTo('invite'); }
    else if (action === 'goToRsvp') goTo('rsvp');
    else if (action === 'backToInvite') goTo('invite');
    else if (action === 'accept') submitRsvp('accepted');
    else if (action === 'decline') submitRsvp('declined');
    else if (action === 'goToReception') goTo('reception');
    else if (action === 'backToConfirmed') goTo('confirmed-accept');
    else if (action === 'goToClosing') goTo('closing');
    else if (action === 'backToReception') goTo('reception');
  });

  app.addEventListener('change', (e) => {
    if (e.target.dataset.action === 'guestCount') {
      state.guestCount = Math.max(1, parseInt(e.target.value, 10) || 1);
    } else if (e.target.dataset.action === 'guestName') {
      state.guestName = e.target.value;
    }
  });

  render();
})();
