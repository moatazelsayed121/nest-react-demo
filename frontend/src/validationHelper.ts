export function validateEmailPattern(email: string) {
    const regexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regexPattern.test(email)
}

export function validatePasswordPattern(password: string) {
    const regexPattern =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/
    return regexPattern.test(password)
}

export function validateNamePattern(name: string) {
    const regexPattern = /^(.*[A-Za-z]){3,}.*$/
    return regexPattern.test(name)
}
