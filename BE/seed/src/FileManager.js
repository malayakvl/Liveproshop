import fs from 'fs'
import { rootDir } from '../constants.js'

export default class FileManager {
    /**
     * @public
     * @type {string}
     */
    seedsDir

    constructor() {
        this.seedsDir = rootDir + '/seeds/';
    }

    /**
     * @return {string[]}
     */
    getSeedFiles() {
        let files = []

        fs.readdirSync(this.seedsDir).forEach(file => {
            let fullPath = this.seedsDir + file
            files.push(fullPath)

        })

        return files

    }
}

