export async function urlCheck(text) {
    // Ref: https://blog.xuite.net/vexed/tech/46146920
    const regex = /(https?:\/\/[\w-\.]+(:\d+)?(\/[~\w\/\.]*)?(\?\S*)?(#\S*)?)/
    return new Promise(async (resolve, reject) => {
        if (text.match(regex)) {
            if (text.indexOf("www.youtube.com") > -1) return resolve("yt")
            const isAudio = await audioCheck(text);
            if (isAudio) return resolve("audio")
            const isImg = await imageCheck(text);
            if (isImg) return resolve("image")
            resolve("else")
        }
        else resolve(null);
    })

}



// Ref: https://stackoverflow.com/questions/9714525/javascript-image-url-verify
function imageCheck(url) {
    const timeout = 500;
    let timer;
    let img = new Image();
    return new Promise((resolve, reject) => {
        img.onerror = img.onabort = function () {
            img = null
            clearTimeout(timer)
            resolve(false)
        };
        img.onload = function () {
            img = null
            clearTimeout(timer)
            resolve(true)
        };
        img.src = url;
        timer = setTimeout(function () {
            img = null
            resolve(null);
        }, timeout);
    })
}

// Ref: https://stackoverflow.com/questions/29681907/check-if-sound-file-exists-javascript
function audioCheck(url) {
    const timeout = 500;
    let timer;
    let audio = new Audio();
    return new Promise((resolve, reject) => {
        audio.onerror = audio.onabort = function () {
            audio = null
            clearTimeout(timer)
            resolve(false)
        };
        audio.oncanplay = function () {
            audio = null
            clearTimeout(timer)
            resolve(true)
        };
        audio.src = url;
        audio.load();
        timer = setTimeout(function () {
            audio = null
            resolve(null);
        }, timeout);
    })
}