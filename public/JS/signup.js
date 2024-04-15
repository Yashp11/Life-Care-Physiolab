function toggleSignupForm(userType) {


    var doctorSignupForm = document.getElementById('doctor');
    var patientSignupForm = document.getElementById('patient');

    if (userType === 'doctor') {
        doctorSignupForm.style.display = 'block';
        patientSignupForm.style.display = 'none';
    } else if (userType === 'patient') {
        doctorSignupForm.style.display = 'none';
        patientSignupForm.style.display = 'block';
    }
}