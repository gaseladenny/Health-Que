async function registerPatient() {
  if (!db) {
    showToast("Database connection is completely offline.", "error");
    return;
  }

  // 1. Extract values exactly matching your layout inputs
  const firstName = document.getElementById('r-first').value.trim();
  const surname = document.getElementById('r-last').value.trim();
  const phone = document.getElementById('r-phone').value.trim();
  const complaint = document.getElementById('r-complaint').value.trim();

  // Basic verification catch
  if (!firstName || !surname || !phone || !complaint) {
    alert("Please complete all fields marked with an asterisk (*)");
    return;
  }

  const btn = document.getElementById('reg-btn');
  btn.disabled = true;
  btn.innerHTML = `<span class="spin"></span>Processing...`;

  // 2. Map payload names cleanly to database parameters
  const payload = {
    first_name: firstName,
    surname: surname,
    sa_id_passport: document.getElementById('r-id').value.trim() || null,
    date_of_birth: document.getElementById('r-dob').value || null,
    phone: phone,
    gender: document.getElementById('r-gender').value,
    chief_complaint: complaint,
    department: document.getElementById('r-dept').value,
    visit_type: document.getElementById('r-type').value,
    triage_status: selectedTriage, // Tracked via your grid selectors
    blood_pressure: document.getElementById('r-bp').value.trim() || null,
    temperature_c: parseFloat(document.getElementById('r-temp').value) || null,
    pulse_bpm: parseInt(document.getElementById('r-pulse').value) || null,
    o2_sat_percent: parseInt(document.getElementById('r-o2').value) || null,
    send_sms_confirmation: document.getElementById('chk-sms').checked,
    send_whatsapp_confirmation: document.getElementById('chk-wa').checked
  };

  // 3. Post cleanly into 'queue_entries'
  const { error } = await db.from('queue_entries').insert([payload]);

  if (error) {
    console.error("Database mismatch details:", error);
    alert("Error submitting entry: " + error.message);
  } else {
    alert("Patient successfully synced to live queue database!");
    clearReg(); // Resets layout form smoothly
    if (typeof fetchQueueData === 'function') fetchQueueData(); 
  }
  
  btn.disabled = false;
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Register &amp; Add to Queue`;
}
