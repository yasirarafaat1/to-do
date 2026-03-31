const dateTimeElement = document.getElementById("datetime");

function updateDateTime() {
    if (!dateTimeElement) {
        return;
    }

    const now = new Date();
    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    };

    dateTimeElement.textContent = now.toLocaleString("en-US", options);
}

updateDateTime();
setInterval(updateDateTime, 1000);
