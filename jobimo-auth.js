(() => {
  const config = window.JOBIMO_SUPABASE_CONFIG || {};

  // Supabase benötigt die Projekt-URL ohne /rest/v1/
  const projectUrl = (config.url || "").replace(/\/rest\/v1\/?$/, "");

  if (!projectUrl || !config.anonKey || !window.supabase) {
    console.error("JOBIMO: Supabase-Konfiguration fehlt.");
    return;
  }

  const jobimoAuthClient = window.supabase.createClient(
    projectUrl,
    config.anonKey
  );

  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const accountStatus = document.getElementById("accountStatus");
  const accountForms = document.getElementById("accountForms");
  const signedInPanel = document.getElementById("signedInPanel");
  const logoutButton = document.getElementById("logoutButton");

  function showMessage(message) {
    accountStatus.textContent = message;
  }

  async function updateAccountView(session) {
    if (!session) {
      accountForms.hidden = false;
      signedInPanel.hidden = true;
      showMessage("Du bist noch nicht angemeldet.");
      return;
    }

    const user = session.user;

    accountForms.hidden = true;
    signedInPanel.hidden = false;

    document.getElementById("signedInEmail").textContent =
      user.email || "";

    const { data: profile, error } = await jobimoAuthClient
      .from("profiles")
      .select("display_name, account_type")
      .eq("id", user.id)
      .maybeSingle();

    document.getElementById("signedInName").textContent =
      "Willkommen bei JOBIMO, " +
      (profile?.display_name || "Nutzer") + "!";

    const accountLabels = {
  jobseeker: "Kontoart: Jobsuchender",
  company: "Kontoart: Arbeitgeber – Unternehmen",
  private_employer: "Kontoart: Arbeitgeber – Privatperson",
  private: "Kontoart: Privatperson"
};

document.getElementById("signedInType").textContent =
  accountLabels[profile?.account_type] || "Kontoart: Privatperson";


    showMessage(
  error
    ? "Profilfehler: " + error.message
    : "Du bist erfolgreich angemeldet."
);

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const type = document.getElementById("signupType").value;
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    const button = signupForm.querySelector('button[type="submit"]');
    button.disabled = true;
    showMessage("Dein Konto wird erstellt ...");

    const { data, error } = await jobimoAuthClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          account_type: type
        },
        emailRedirectTo: window.location.href.split("#")[0]
      }
    });

    button.disabled = false;

    if (error) {
      showMessage("Registrierung fehlgeschlagen: " + error.message);
      return;
    }

    if (data.session) {
      signupForm.reset();
      await updateAccountView(data.session);
    } else {
      showMessage(
        "Fast geschafft! Bitte bestätige deine E-Mail-Adresse über den Link in deinem Postfach. Danach kannst du dich anmelden."
      );
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const button = loginForm.querySelector('button[type="submit"]');
    button.disabled = true;
    showMessage("Du wirst angemeldet ...");

    const { data, error } =
      await jobimoAuthClient.auth.signInWithPassword({
        email,
        password
      });

    button.disabled = false;

    if (error) {
      showMessage("Anmeldung fehlgeschlagen: " + error.message);
      return;
    }

    loginForm.reset();
    await updateAccountView(data.session);
  });

  logoutButton.addEventListener("click", async () => {
    const { error } = await jobimoAuthClient.auth.signOut();

    if (error) {
      showMessage("Abmeldung fehlgeschlagen: " + error.message);
      return;
    }

    await updateAccountView(null);
  });

  jobimoAuthClient.auth.onAuthStateChange((_event, session) => {
    updateAccountView(session);
  });

  jobimoAuthClient.auth.getSession().then(({ data }) => {
    updateAccountView(data.session);
  });
   // JOBIMO: Arbeitgeber-Dashboard und Stellenanzeigen

  const employerDashboard = document.getElementById("arbeitgeberDashboard");
  const submitJobForm = document.getElementById("submitJobForm");
  const jobSubmitStatus = document.getElementById("jobSubmitStatus");
  const employerJobs = document.getElementById("employerJobs");

  async function loadEmployerDashboard(session) {
    if (!employerDashboard) return;

    if (!session) {
      employerDashboard.hidden = true;
      return;
    }

    const { data: profile } = await jobimoAuthClient
      .from("profiles")
      .select("account_type, display_name, contact_email")
      .eq("id", session.user.id)
      .maybeSingle();

    const isEmployer =
      profile?.account_type === "company" ||
      profile?.account_type === "private_employer";

    employerDashboard.hidden = !isEmployer;

    if (!isEmployer) return;

    document.getElementById("jobCompany").value =
      profile?.display_name || "";

    document.getElementById("jobContactEmail").value =
      profile?.contact_email || session.user.email || "";

    await loadEmployerJobs(session.user.id);
  }

  async function loadEmployerJobs(userId) {
    const { data, error } = await jobimoAuthClient
      .from("jobs")
      .select("title, status, created_at")
      .eq("employer_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      employerJobs.textContent = "Deine Anzeigen konnten nicht geladen werden.";
      return;
    }

    employerJobs.replaceChildren();

    if (!data || data.length === 0) {
      employerJobs.textContent = "Du hast noch keine Stellenanzeigen eingereicht.";
      return;
    }

    data.forEach((job) => {
      const item = document.createElement("p");
      const statusLabels = {
        pending: "Wird von JOBIMO geprüft",
        approved: "Freigegeben",
        rejected: "Abgelehnt"
      };

      item.textContent =
        job.title + " – " + (statusLabels[job.status] || job.status);

      employerJobs.appendChild(item);
    });
  }

  if (submitJobForm) {
    submitJobForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { data: sessionData } =
        await jobimoAuthClient.auth.getSession();

      const session = sessionData.session;

      if (!session) {
        jobSubmitStatus.textContent =
          "Bitte melde dich zuerst an.";
        return;
      }

      const button = submitJobForm.querySelector('button[type="submit"]');
      button.disabled = true;
      jobSubmitStatus.textContent = "Deine Anzeige wird eingereicht ...";

      const { error } = await jobimoAuthClient.from("jobs").insert({
        employer_id: session.user.id,
        title: document.getElementById("jobTitle").value.trim(),
        company_name: document.getElementById("jobCompany").value.trim(),
        job_type: document.getElementById("jobType").value,
        category: document.getElementById("jobCategory").value.trim(),
        description: document.getElementById("jobDescription").value.trim(),
        location: document.getElementById("jobLocation").value.trim(),
        salary: document.getElementById("jobSalary").value.trim(),
        working_hours: document.getElementById("jobHours").value.trim(),
        contact_email: document.getElementById("jobContactEmail").value.trim(),
        status: "pending"
      });

      button.disabled = false;

      if (error) {
        jobSubmitStatus.textContent =
          "Fehler beim Einreichen: " + error.message;
        return;
      }

      submitJobForm.reset();
      jobSubmitStatus.textContent =
        "Erfolgreich eingereicht! Deine Anzeige wird jetzt von JOBIMO geprüft.";

      await loadEmployerJobs(session.user.id);
    });
  }

  jobimoAuthClient.auth.onAuthStateChange((_event, session) => {
    loadEmployerDashboard(session);
  });

  jobimoAuthClient.auth.getSession().then(({ data }) => {
    loadEmployerDashboard(data.session);
  });

})();
