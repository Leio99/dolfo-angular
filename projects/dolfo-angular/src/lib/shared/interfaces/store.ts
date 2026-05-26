export enum StorageValues {
    TOKEN = "token",
    LANG = "lang"
}

export interface IStore {
    readonly pressingCtrl: boolean
    readonly lists: {
        [x: string]: Array<any>
    }
    readonly entities: {
        [x: string]: any
    }
}

export const MAX_DEVICE_SIZE = 750
export const MAX_SMALL_DEVICE = 500