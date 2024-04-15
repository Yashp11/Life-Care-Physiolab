function submit() {
    const date = document.getElementById('date').value;
    console.log(date);
    const selected_date = new Date(date);
    const Current_Date = new Date();

    const diff = selected_date.getTime() - Current_Date.getTime();
    if (diff < 0) {
        alert('Invalid Date');
        return false;
    } else {
        return true;
    }
}