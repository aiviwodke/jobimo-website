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

    document.getElementById("signedInType").textContent =
      profile?.account_type === "company"
        ? "Kontoart: Unternehmen"
        : "Kontoart: Privatperson";

    showMessage(
      error
        ? "Du bist angemeldet. Dein Profil konnte gerade nicht geladen werden."
        : "Du bist erfolgreich angemeldet."
    );
  }

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
})();
