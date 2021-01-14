export const config = {
    EXPIRATION_TIME: (3600 * 1000) / 2, // 3600 seconds * 1000 = 1 hour in milliseconds = 30min
    KEEP_ALIVE: 60 * 30, // 30min
};

// Format milliseconds into MM:SS
export const formatDuration = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// Format milliseconds into X minutes and Y seconds
export const formatDurationForHumans = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes} Mins ${seconds} Secs`;
};

// Get year from YYYY-MM-DD
export const getYear = (date: string) => date.split("-")[0];

// Transform Pitch Class Notation to string
export const parsePitchClass = (note: number) => {
    let key = note;

    switch (note) {
        case 0:
            key = "C";
            break;
        case 1:
            key = "D♭";
            break;
        case 2:
            key = "D";
            break;
        case 3:
            key = "E♭";
            break;
        case 4:
            key = "E";
            break;
        case 5:
            key = "F";
            break;
        case 6:
            key = "G♭";
            break;
        case 7:
            key = "G";
            break;
        case 8:
            key = "A♭";
            break;
        case 9:
            key = "A";
            break;
        case 10:
            key = "B♭";
            break;
        case 11:
            key = "B";
            break;
        default:
            return null;
    }

    return key;
};

export const formatWithCommas = (n: string) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Higher-order function for async/await error handling
export const catchErrors = (fn) => {
    return function (...args) {
        return fn(...args).catch((err) => {
            console.error(err);
        });
    };
};
