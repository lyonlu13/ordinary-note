export function formatSec(sec) {
    sec = Math.floor(sec);
    let min = Math.floor(sec / 60);
    sec = sec % 60;
    if (min >= 60) {
        let hour = Math.floor(min / 60);
        min = min % 60;
        return `${zero(hour)}:${zero(min)}:${zero(sec)}`
    } else
        return `${zero(min)}:${zero(sec)}`
}

function zero(num) {
    return `${num >= 10 ? num : '0' + num}`
}

