import {createHash} from 'crypto'

//This function hashes and salts important information like passwords. If you don't want salt, don't use this method
export function hash(stuffToHash: string): string {
    return createHash("sha256").update("P4cK-0f-paRTz-secUR3pas$w0rdHA5hLOL").update(stuffToHash).digest("hex")
}