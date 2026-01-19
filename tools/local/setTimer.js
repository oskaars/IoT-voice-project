import notifier from 'node-notifier'

async function setTimer({ seconds, message }) {
    if (seconds > 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                notifier.notify({
                    title: 'Timer c:',
                    message: message,
                    sound: true
                })
                resolve("timer complete: " + message)
            }, seconds * 1000)
        })
    } else {
    return "Error: time must be greater than 0 seconds"
}

}

export { setTimer }