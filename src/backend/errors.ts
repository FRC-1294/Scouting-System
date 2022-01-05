export class ErrorWrangler {
    errorDictionary: namedError[] = [
        {
            id: 101,
            message: "Unable to connect to Discord"
        }
    ]
    /**
     * error
     * @param {Number} id The id of the error
     * @param {string} message (optional) Message to send with the error
     */
    public error(id: Number, file: string, message?: string): void {
        if(message ?? false) {
            throw new Error(`ERROR [${id}] in ${file} -- ${message}`)
        } else {
            let found = false
            this.errorDictionary.forEach(e => {
                if(e.id == id && !found) {
                    found = true
                    throw new Error(`ERROR [${id}] in ${file} -- ${e.message}`)
                }
            })
            if(!found) {
                throw new Error(`ERROR [${id}] in ${file} -- =NO DESCRIPTION=`)
            }
        }
    }
}

type namedError = {
    id: Number
    message: string
}