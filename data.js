async function registerPatient() {
  if (!db) {
    alert("Database connection offline. Check your Supabase configuration.");
    return;
  }

  // Gather your HTML text values
  const fName = document.getElementById('r-first').value.trim();
  const sName = document.getElementById('r-last').value.trim();
  const pNum = document.getElementById('r-phone').value.trim();
  const cPlaint = document.getElementById('r-complaint').value.trim();

  if (!fName || !sName || !pNum || !cPlaint) {
    alert("Please fill in all fields marked with an asterisk (*)");
    return;
  }

  const btn = document.getElementById('reg-btn');
  btn.disabled = true;
  btn.innerText = "Processing...";

  // PAYLOAD FIELDS MUST MATCH THE SQL COLUMNS LOWERCASE
  const payload = {
    first_name: fName,
    surname: sName,
    sa_id_passport: document.getElementById('r-id').value.trim() || null,
    date_of_birth: document.getElementById('r-dob').value || null,
    phone: pNum,
    gender: document.getElementById('r-gender').value,
    chief_complaint: cPlaint,
    department: document.getElementById('r-dept').value,
    visit_type: document.getElementById('r-type').value,
    triage_status: typeof selectedTriage !== 'undefined' ? selectedTriage : 'routine',
    blood_pressure: document.getElementById('r-bp').value.trim() || null,
    temperature_c: parseFloat(document.getElementById('r-temp').value) || null,
    pulse_bpm: parseInt(document.getElementById('r-pulse').value) || null,
    o2_sat_percent: parseInt(document.getElementById('r-o2').value) || null,
    send_sms_confirmation: document.getElementById('chk-sms')?.checked ?? true,
    send_whatsapp_confirmation: document.getElementById('chk-wa')?.checked ?? true
  };

  console.log("Sending clean payload to Supabase:", payload);

  const { error } = await db.from('queue_entries').insert([payload]);

  if (error) {
    console.error("Supabase Error Details:", error);
    alert("Database Rejected Data:\n" + error.message + "\n\nHint: Check your browser developer console (F12) to see exactly what failed.");
  } else {
    alert("Success! Patient added to the queue database.");
    if (typeof clearReg === 'function') clearReg();
    if (typeof fetchQueueData === 'function') fetchQueueData();
  }

  btn.disabled = false;
  btn.innerText = "Register & Add to Queue";
}
