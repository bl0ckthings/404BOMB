export function startTimer(timestamp, callback) {
    // Convert the timestamp to milliseconds
    const targetTime = timestamp * 1000;

    // Function to format the time as HH:MM:SS
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Function to display the remaining time
    function displayRemainingTime() {
        const currentTime = new Date().getTime();
        const timeRemaining = targetTime - currentTime;

        if (timeRemaining > 0) {
            const secondsRemaining = Math.floor(timeRemaining / 1000);
            const formattedTime = formatTime(secondsRemaining);
            callback(formattedTime);
        } else {
            clearInterval(intervalId);
            callback('00:00:00'); // Timer reached 0
        }
    }

    // Call the function every second
    const intervalId = setInterval(displayRemainingTime, 1000);

    return intervalId;
}
