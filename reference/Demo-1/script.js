/* ============================================================
   Includio — Demo-1 interactions
   Client-side simulation only. No backend, no real AI.
   ============================================================ */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- view router ---------- */
  const VIEWS = {
    landing:   "view-landing",
    employer:  "view-employer",
    candidate: "view-candidate",
  };

  // screen id → owning app view
  const SCREEN_APP = {};
  $$(".screen").forEach((s) => {
    const v = s.closest(".view");
    SCREEN_APP[s.id.replace(/^screen-/, "")] = v.dataset.app;
  });

  const navFor = {};
  navFor["employer"]  = { nav: "employer-nav",  screens: {} };
  navFor["candidate"] = { nav: "cand-nav",       screens: {} };

  let currentScreen = "landing";
  let switching = false;

  function showApp(app) {
    Object.entries(VIEWS).forEach(([key, id]) => {
      $("#" + id).hidden = key !== app;
    });
  }

  function revealScreen(screen) {
    const app = SCREEN_APP[screen];
    if (!app) { // landing
      showApp("landing");
      currentScreen = "landing";
      window.scrollTo({ top: 0 });
      return;
    }
    showApp(app);
    $$(".screen").forEach((s) => {
      const isTarget = s.id === "screen-" + screen;
      s.hidden = !isTarget;
      if (isTarget) { // restart the entrance animation
        s.style.animation = "none";
        void s.offsetWidth;
        s.style.animation = "";
      }
    });
    setActiveNav(app, screen);
    currentScreen = screen;
    window.scrollTo({ top: 0 });
    if (screen === "candidate-dashboard") syncDashboard();
    if (screen === "candidate-practice") resetPractice();
    if (screen === "candidate-live") resetLive();
  }

  function showScreen(screen) {
    if (screen === currentScreen) return;
    const outgoing = $(".screen:not([hidden])");
    const sameView = outgoing && (SCREEN_APP[screen] === undefined
      ? outgoing.closest(".view").dataset.app === "landing"
      : outgoing.closest(".view").dataset.app === SCREEN_APP[screen]);
    if (outgoing && sameView) {
      if (switching) return;
      switching = true;
      outgoing.style.animation = "screenOut .2s ease forwards";
      setTimeout(() => {
        outgoing.style.animation = "";
        revealScreen(screen);
        switching = false;
      }, 190);
    } else {
      revealScreen(screen);
    }
  }

  function setActiveNav(app, screen) {
    const nav = $("#" + navFor[app].nav);
    if (!nav) return;
    $$("button", nav).forEach((b) => {
      const target = b.dataset.go.replace(/^employer-|^candidate-/, "");
      const want   = screen.replace(/^employer-|^candidate-/, "");
      b.classList.toggle("on", target === want);
    });
  }

  // delegate every [data-go]
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-go]");
    if (!el) return;
    e.preventDefault();
    const screen = el.dataset.go;
    if (el.dataset.wizardStep) {
      showScreen("employer-wizard");
      setWizardStep(Number(el.dataset.wizardStep));
    } else {
      showScreen(screen);
    }
  });

  // workspace switcher
  $$("[data-app-switch]").forEach((b) => {
    b.addEventListener("click", () => {
      const app = b.dataset.appSwitch;
      showScreen(app === "employer" ? "employer-dashboard" : "candidate-dashboard");
    });
  });

  /* ---------- toasts ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => { t.hidden = true; }, 220);
    }, 2400);
  }
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-toast]");
    if (el) toast(el.dataset.toast);
  });

  /* ---------- modals ---------- */
  const MODALS = {
    "send-invites": {
      title: "Send invitations?",
      body: "4 candidates will receive an Includio account, a 14-day practice window and their interview time. You can change the schedule until invitations are accepted.",
      confirm: "Send invitations",
      done: "Invitations sent to 4 candidates",
    },
    "confirm-plan": {
      title: "Confirm this interview plan?",
      body: "The plan is locked to this approved version so the interview runs as designed. You can still create a new version later.",
      confirm: "Confirm plan",
      done: "Interview plan ready — version 1 approved",
    },
  };
  let pendingModal = null;

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-modal]");
    if (!el) return;
    e.preventDefault();
    const cfg = MODALS[el.dataset.modal];
    if (!cfg) return;
    pendingModal = cfg;
    $("#modal-title").textContent = cfg.title;
    $("#modal-body").textContent  = cfg.body;
    $("[data-modal-confirm]").textContent = cfg.confirm;
    $("#scrim").hidden = false;
  });
  $("[data-modal-cancel]").addEventListener("click", closeModal);
  $("#scrim").addEventListener("click", (e) => { if (e.target.id === "scrim") closeModal(); });
  $("[data-modal-confirm]").addEventListener("click", () => {
    const done = pendingModal && pendingModal.done;
    closeModal();
    if (done) toast(done);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  function closeModal() { $("#scrim").hidden = true; pendingModal = null; }

  /* ============================================================
     EMPLOYER — campaign filters
     ============================================================ */
  function filterTable(bodyId, emptyId, statusId, searchId, term, status, attr) {
    const rows = $$("#" + bodyId + " tr");
    let shown = 0;
    rows.forEach((r) => {
      const hay = r.textContent.toLowerCase();
      const okTerm = !term || hay.includes(term);
      const okStatus = !status || (r.dataset[attr] || "") === status;
      const vis = okTerm && okStatus;
      r.hidden = !vis;
      if (vis) shown++;
    });
    $("#" + emptyId).hidden = shown > 0;
  }
  const campSearch = $("#camp-search"), campStatus = $("#camp-status");
  if (campSearch) {
    const run = () => filterTable("camp-body", "camp-empty", "camp-status", "camp-search",
      campSearch.value.trim().toLowerCase(), campStatus.value, "status");
    campSearch.addEventListener("input", run);
    campStatus.addEventListener("change", run);
    $("#camp-clear").addEventListener("click", () => {
      campSearch.value = ""; campStatus.value = ""; run();
    });
  }
  const repSearch = $("#rep-search"), repStatus = $("#rep-status");
  if (repSearch) {
    const run = () => filterTable("rep-body", "rep-empty", "rep-status", "rep-search",
      repSearch.value.trim().toLowerCase(), repStatus.value, "status");
    repSearch.addEventListener("input", run);
    repStatus.addEventListener("change", run);
  }

  /* ---------- employer: add candidate ---------- */
  const addCand = $("#add-cand-btn");
  if (addCand) {
    addCand.addEventListener("click", () => {
      const input = $("#cand-email");
      const raw = input.value.trim();
      if (!raw) { toast("Enter at least one email address"); return; }
      const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
      const tbody = $("#screen-employer-invitations").querySelector("tbody");
      list.forEach((email) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td><b>${email.split("@")[0]}</b><small>${email}</small></td>
          <td><span class="badge badge-draft">Pending</span></td>
          <td><span class="badge badge-draft">Not sent</span></td>
          <td><span class="badge badge-draft">—</span></td>
          <td class="mono">—</td>`;
        tbody.appendChild(tr);
      });
      input.value = "";
      toast(list.length + (list.length === 1 ? " candidate added" : " candidates added"));
    });
  }

  /* ---------- employer: mark reviewed ---------- */
  const markReviewed = $("#mark-reviewed");
  if (markReviewed) {
    markReviewed.addEventListener("click", () => {
      markReviewed.textContent = "Reviewed ✓";
      markReviewed.disabled = true;
      markReviewed.style.opacity = ".6";
      toast("Report marked as reviewed");
    });
  }

  /* ============================================================
     WIZARD
     ============================================================ */
  function setWizardStep(n) {
    $$("#wizard-bar li").forEach((li) => {
      const s = Number(li.dataset.step);
      li.classList.toggle("on", s === n);
      li.classList.toggle("done", s < n);
    });
    $$("#screen-employer-wizard .wizard-step").forEach((el) => {
      el.hidden = Number(el.dataset.step) !== n;
    });
    window.scrollTo({ top: 0 });
  }
  $$("[data-wizard-next]").forEach((b) => {
    b.addEventListener("click", () => {
      const next = Number(b.dataset.wizardNext);
      if (next === 4) buildPreview();
      setWizardStep(next);
    });
  });
  // clickable step headers
  $$("#wizard-bar li").forEach((li) => {
    li.addEventListener("click", () => setWizardStep(Number(li.dataset.step)));
  });

  // section list in builder
  $$("#section-list li").forEach((li) => {
    li.addEventListener("click", () => {
      $$("#section-list li").forEach((x) => x.classList.remove("on"));
      li.classList.add("on");
    });
  });

  /* ---------- quota calculation ---------- */
  const calcQuota = () => {
    const s = Number($("#q-sessions").value) || 0;
    const p = 14; // 14-day window from the timeline
    $("#quota-total").textContent = s * p;
  };
  ["#q-sessions"].forEach((sel) => {
    const el = $(sel);
    if (el) el.addEventListener("input", calcQuota);
  });

  /* ============================================================
     INTERVIEW BUILDER — questions + AI simulation
     ============================================================ */
  const QUESTIONS = [
    { q: "Tell us a little about yourself and what drew you to this role.",
      cat: "Introduction", comp: "Communication", t: "3:00" },
    { q: "Tell us about a time you handled a challenging situation in a team project.",
      cat: "Behavioural", comp: "Collaboration", t: "4:00" },
    { q: "Describe a moment you had to learn something quickly to finish a task.",
      cat: "Behavioural", comp: "Learning agility", t: "4:00" },
    { q: "How would you approach debugging a request that is slow only for some users?",
      cat: "Technical", comp: "Problem-solving", t: "6:00" },
    { q: "How would you test a function you didn't write yourself?",
      cat: "Technical", comp: "Problem-solving", t: "6:00" },
    { q: "What questions do you have for us, or what would you like to know about the team?",
      cat: "Closing", comp: "Communication", t: "3:00" },
  ];
  const AI_SUGGESTIONS = [
    { q: "Give an example of a time you asked for help when you were stuck.",
      cat: "Behavioural", comp: "Learning agility", t: "4:00",
      why: "Learning agility is thinly covered. This adds a concrete, job-relevant signal." },
    { q: "Imagine a deadline moves forward by two days. What do you do first?",
      cat: "Situational", comp: "Problem-solving", t: "5:00",
      why: "Adds a situational question so the plan isn't only retrospective." },
  ];

  function qCard(item, opts = {}) {
    const c = document.createElement("div");
    c.className = "q-card" + (opts.ai ? " ai" : "");
    c.innerHTML = `
      <div class="q-top">
        <span class="q-num">${opts.ai ? "AI suggestion" : "Q" + (opts.n ?? "")}</span>
        <span class="badge badge-soft">${item.cat}</span>
        ${opts.ai ? "" : `<span class="badge badge-draft">Approved</span>`}
        <span class="mono" style="margin-left:auto">${item.t}</span>
      </div>
      <p>${item.q}</p>
      ${opts.ai ? `<p class="q-why">${item.why}</p>` : ""}
      <div class="q-meta"><span>${item.comp}</span>${opts.ai ? "" : "<span>English</span>"}</div>
      <div class="q-actions">
        ${opts.ai
          ? `<button class="q-btn coral" data-add>Add to interview</button>
             <button class="q-btn" data-edit>Edit</button>
             <button class="q-btn ghost" data-dismiss>Dismiss</button>`
          : `<button class="q-btn" data-edit>Edit</button>
             <button class="q-btn" data-dup>Duplicate</button>
             <button class="q-btn coral" data-remove>Remove</button>`}
      </div>`;

    c.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.remove)  { c.remove(); toast("Question removed"); renumber(); }
      if (b.dataset.dismiss) { c.remove(); toast("Suggestion dismissed"); }
      if (b.dataset.dup)     { c.after(qCard(item, {})); renumber(); toast("Question duplicated"); }
      if (b.dataset.edit)    { toast("Question editor opens here (demo)"); }
      if (b.dataset.add) {
        const list = $("#question-list");
        list.insertBefore(qCard(item, {}), list.firstChild);
        renumber();
        c.remove();
        toast("Added to interview");
      }
    });
    return c;
  }

  function renumber() {
    $$("#question-list .q-card").forEach((c, i) => {
      const n = c.querySelector(".q-num");
      if (n && !c.classList.contains("ai")) n.textContent = "Q" + (i + 1);
    });
  }

  const questionList = $("#question-list");
  if (questionList) {
    QUESTIONS.forEach((item, i) => questionList.appendChild(qCard(item, { n: i + 1 })));

    $("#generate-btn").addEventListener("click", () => {
      const status = $("#ai-status");
      status.hidden = false;
      setTimeout(() => {
        status.hidden = true;
        AI_SUGGESTIONS.forEach((s) => {
          if (!$(`#question-list [data-ai-key="${s.q}"]`)) {
            const card = qCard(s, { ai: true });
            card.dataset.aiKey = s.q;
            questionList.insertBefore(card, questionList.firstChild);
          }
        });
        toast("AI plan ready — 2 suggestions to review");
      }, 1500);
    });

    $("#add-q-btn").addEventListener("click", () => {
      const input = $("#new-q");
      const val = input.value.trim();
      if (!val) { toast("Type a question first"); return; }
      const card = qCard({ q: val, cat: "Custom", comp: "Your choice", t: "4:00" }, { n: 0 });
      questionList.appendChild(card);
      input.value = "";
      renumber();
      toast("Question added");
    });
  }

  /* ---------- preview navigation ---------- */
  const PREVIEW = [
    ["Question 1 of 7 · Introduction", "Tell us a little about yourself and what drew you to this role."],
    ["Question 2 of 7 · Behavioural", "Tell us about a time you handled a challenging situation in a team project."],
    ["Question 3 of 7 · Behavioural", "Describe a moment you had to learn something quickly to finish a task."],
    ["Question 4 of 7 · Technical", "How would you approach debugging a request that is slow only for some users?"],
    ["Question 5 of 7 · Technical", "How would you test a function you didn't write yourself?"],
    ["Question 6 of 7 · Behavioural", "Give an example of a time you asked for help when you were stuck."],
    ["Question 7 of 7 · Closing", "What questions do you have for us, or what would you like to know about the team?"],
  ];
  let pIdx = 0;
  function buildPreview() { pIdx = 0; paintPreview(); }
  function paintPreview() {
    const [tag, text] = PREVIEW[pIdx];
    $("#screen-employer-wizard .preview-q .q-tag").textContent = tag;
    $("#screen-employer-wizard .preview-q p").textContent = text;
    $("#preview-count").textContent = (pIdx + 1) + " / " + PREVIEW.length;
  }
  const prevBtn = $("#prev-q"), nextBtn = $("#next-q");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => { pIdx = (pIdx - 1 + PREVIEW.length) % PREVIEW.length; paintPreview(); });
    nextBtn.addEventListener("click", () => { pIdx = (pIdx + 1) % PREVIEW.length; paintPreview(); });
  }

  /* ============================================================
     CANDIDATE — practice setup
     ============================================================ */
  $$(".choice").forEach((c) => {
    c.addEventListener("click", () => {
      $$(".choice").forEach((x) => x.classList.remove("on"));
      c.classList.add("on");
      $("#upload-row").style.opacity = c.dataset.source === "personalised" ? "1" : ".45";
      updateSummary();
    });
  });

  $$(".seg").forEach((seg) => {
    $$("button", seg).forEach((b) => {
      b.addEventListener("click", () => {
        $$("button", seg).forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        updateSummary();
      });
    });
  });

  function segValue(name) {
    const seg = document.querySelector(`.seg[data-seg="${name}"]`);
    const on = seg && seg.querySelector("button.on");
    return on ? on.textContent.trim() : "";
  }
  function updateSummary() {
    const src = $(".choice.on")?.dataset.source === "library" ? "Question library" : "Personalised";
    const el = $("#session-summary");
    if (el) el.textContent =
      `${src} · ${segValue("count")} questions · ${segValue("duration")} · ` +
      `${segValue("format").toLowerCase()} · ${segValue("think")} thinking time`;
  }

  /* ---------- practice quota state ---------- */
  const state = { used: 2, max: 3 };
  function syncDashboard() {
    $("#quota-used").textContent = state.used;
    $("#quota-max").textContent  = state.max;
    const pct = Math.min(100, Math.round((state.used / state.max) * 100));
    $("#quota-meter").style.setProperty("--w", pct + "%");
  }
  function spendSession() {
    if (state.used < state.max) state.used++;
    syncDashboard();
  }

  /* ============================================================
     PRACTICE STUDIO
     ============================================================ */
  const PRACTICE_QS = [
    { tag: "Question 1 of 5 · Behavioural",
      q: "Tell me about a time you worked with someone who had a very different working style.",
      ideas: "You described the difference, then adapted how you communicated rather than asking the other person to change.",
      role: "This maps to the collaboration criterion in the job description.",
      try: "Try opening with the situation in one line, then the action you took." },
    { tag: "Question 2 of 5 · Behavioural",
      q: "Describe a time you received feedback that was hard to hear.",
      ideas: "You named the feedback plainly and showed what you changed afterwards.",
      role: "Relevant to learning agility.",
      try: "Add one concrete detail about what you did differently next time." },
    { tag: "Question 3 of 5 · Problem-solving",
      q: "Walk me through how you would approach a task you have never done before.",
      ideas: "You broke it into steps and mentioned checking assumptions before starting.",
      role: "Relevant to problem-solving and how you work with ambiguity.",
      try: "Mention how you would know you were on the right track." },
    { tag: "Question 4 of 5 · Technical",
      q: "How would you explain a technical idea to someone who doesn't code?",
      ideas: "You reached for a familiar comparison and avoided jargon.",
      role: "Relevant to communication on a cross-functional team.",
      try: "Keep the analogy to one clear sentence." },
    { tag: "Question 5 of 5 · Closing",
      q: "What would you like to know about the team or the role?",
      ideas: "You asked about how the team works, not just the tasks.",
      role: "Shows engagement with how the team operates.",
      try: "Prepare two questions so you always have a fallback." },
  ];
  let pState = { i: 0, thinking: 0, tTimer: null, answering: false };

  function resetPractice() {
    pState = { i: 0, thinking: 0, tTimer: null, answering: false };
    paintPractice();
    $("#p-feedback").hidden = true;
    $("#p-wave").classList.remove("on");
    $("#p-record").textContent = "Start answering";
  }
  function paintPractice() {
    const cur = PRACTICE_QS[pState.i];
    $("#p-qtag").textContent  = cur.tag;
    $("#p-qtext").textContent = cur.q;
    $("#p-dots").innerHTML = PRACTICE_QS.map((_, i) =>
      `<i class="${i < pState.i ? "done" : i === pState.i ? "on" : ""}"></i>`).join("");
    startThinking();
  }
  function startThinking() {
    clearInterval(pState.tTimer);
    pState.thinking = 20;
    $("#p-think").hidden = false;
    $("#p-thinkcount").textContent = 20;
    pState.tTimer = setInterval(() => {
      pState.thinking--;
      $("#p-thinkcount").textContent = Math.max(0, pState.thinking);
      if (pState.thinking <= 0) {
        clearInterval(pState.tTimer);
        $("#p-think").innerHTML = "You can start whenever you're ready.";
      }
    }, 1000);
  }
  const recordBtn = $("#p-record");
  if (recordBtn) {
    recordBtn.addEventListener("click", () => {
      clearInterval(pState.tTimer);
      $("#p-think").hidden = true;
      pState.answering = !pState.answering;
      $("#p-wave").classList.toggle("on", pState.answering);
      if (pState.answering) {
        recordBtn.textContent = "Finish answer";
      } else {
        recordBtn.textContent = "Start answering";
        showFeedback();
      }
    });
    $("#p-next").addEventListener("click", () => {
      if (pState.i < PRACTICE_QS.length - 1) {
        pState.i++;
        $("#p-feedback").hidden = true;
        $("#p-wave").classList.remove("on");
        pState.answering = false;
        recordBtn.textContent = "Start answering";
        paintPractice();
      } else {
        spendSession();
        toast("Practice session complete — private feedback saved");
        showScreen("candidate-dashboard");
      }
    });
    $("#p-end").addEventListener("click", () => {
      clearInterval(pState.tTimer);
      showScreen("candidate-dashboard");
    });
  }
  function showFeedback() {
    const cur = PRACTICE_QS[pState.i];
    $("#fb-ideas").textContent = cur.ideas;
    $("#fb-role").textContent  = cur.role;
    $("#fb-try").textContent   = cur.try;
    $("#p-feedback").hidden = false;
    $("#p-feedback").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ============================================================
     LIVE INTERVIEW
     ============================================================ */
  const LIVE_QS = [
    ["Question 1 of 7 · Introduction", "Tell us a little about yourself and what drew you to this role.", 180],
    ["Question 2 of 7 · Behavioural", "Tell us about a time you handled a challenging situation in a team project.", 240],
    ["Question 3 of 7 · Behavioural", "Describe a moment you had to learn something quickly to finish a task.", 240],
    ["Question 4 of 7 · Technical", "How would you approach debugging a request that is slow only for some users?", 360],
    ["Question 5 of 7 · Technical", "How would you test a function you didn't write yourself?", 360],
    ["Question 6 of 7 · Behavioural", "Give an example of a time you asked for help when you were stuck.", 240],
    ["Question 7 of 7 · Closing", "What questions do you have for us?", 180],
  ];
  let lState = { i: 0, left: 0, timer: null, running: false };

  function resetLive() {
    lState = { i: 0, left: 0, timer: null, running: false };
    paintLive();
    $("#l-caption").textContent = "";
    $("#l-start").textContent = "Start response";
  }
  function paintLive() {
    const [tag, q, secs] = LIVE_QS[lState.i];
    $("#l-qtag").textContent = tag;
    $("#l-qtext").textContent = q;
    $("#l-progress").textContent = (lState.i + 1) + " / " + LIVE_QS.length;
    lState.left = secs;
    paintLiveTimer();
    $("#l-dots").innerHTML = LIVE_QS.map((_, i) =>
      `<i class="${i < lState.i ? "done" : i === lState.i ? "on" : ""}"></i>`).join("");
  }
  function paintLiveTimer() {
    const m = String(Math.floor(lState.left / 60)).padStart(2, "0");
    const s = String(lState.left % 60).padStart(2, "0");
    $("#l-timer").textContent = `${m}:${s}`;
  }
  const lStart = $("#l-start");
  if (lStart) {
    lStart.addEventListener("click", () => {
      lState.running = !lState.running;
      if (lState.running) {
        lStart.textContent = "Finish response";
        $("#l-caption").textContent = "Listening… (simulated transcription)";
        clearInterval(lState.timer);
        lState.timer = setInterval(() => {
          lState.left--;
          paintLiveTimer();
          if (lState.left === 30) toast("About 30 seconds left — take your time");
          if (lState.left <= 0) {
            clearInterval(lState.timer);
            nextLive();
          }
        }, 1000);
      } else {
        lStart.textContent = "Start response";
        $("#l-caption").textContent = "";
        clearInterval(lState.timer);
        nextLive();
      }
    });
    $("#l-end").addEventListener("click", () => {
      clearInterval(lState.timer);
      showScreen("candidate-complete");
    });
  }
  function nextLive() {
    lState.running = false;
    if (lState.i < LIVE_QS.length - 1) {
      lState.i++;
      $("#l-start").textContent = "Start response";
      paintLive();
      toast("Next question");
    } else {
      showScreen("candidate-complete");
    }
  }

  /* ============================================================
     ACCESSIBILITY TOGGLES
     ============================================================ */
  const a11y = { text: false, motion: false };
  function applyA11y() {
    document.body.classList.toggle("a11y-text", a11y.text);
    document.body.classList.toggle("a11y-motion", a11y.motion);
  }
  document.addEventListener("change", (e) => {
    const el = e.target.closest("[data-a11y]");
    if (!el) return;
    const kind = el.dataset.a11y;
    if (kind === "text" || kind === "motion") {
      a11y[kind] = el.checked;
      applyA11y();
      if (kind === "text") toast(el.checked ? "Larger text on" : "Larger text off");
      if (kind === "motion") toast(el.checked ? "Reduced motion on" : "Reduced motion off");
    }
  });

  /* ---------- boot ---------- */
  showScreen("landing");
  syncDashboard();
})();
