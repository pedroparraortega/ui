export const isEmptyObject = (obj) => {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
            return false
    }
    return true
}

export const isEmptyArray = (arr) => {
    return !arr || arr.length === 0;
}

export const getRandomInt = () => {
    return Math.floor(Math.random(1) * Math.floor(1048576));
}

export const uniqueMessages = (messages) => {
    let temp = []

    messages.map(item => {
        const element = temp.find(tempI => tempI.severity === item.severity && tempI.msg === item.msg)

        if (!element) {
            temp.push(item)
        }
    })

    return temp
}

export const uniqueObjects = (objects) => {
    let temp = []

    objects.map(item => {
        const element = temp.find(tempI => tempI.dn === item.dn)

        if (!element) {
            temp.push(item)
        }
    })

    return temp
}

export const sortSeverity = (a, b) => {
    if (a.severity === 'error' && b.severity === 'warn') {
        return -1
    }

    if (a.severity === 'warn' && b.severity === 'error') {
        return 1
    }

    return 0
}
