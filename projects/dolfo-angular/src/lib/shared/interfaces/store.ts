export enum StoreLists {
    EMPTY
}

export type StorageListType = {
    [StoreLists.EMPTY]: null
}

export enum StorageValues {
    TOKEN = "token",
    LANG = "lang"
}

export interface IStore {
    readonly pressingCtrl: boolean
    readonly lists: {
        [k in StoreLists]?: StorageListType[k][]
    }
    readonly entities: {
        [x: string]: any
    }
}

export const MAX_DEVICE_SIZE = 750
export const MAX_SMALL_DEVICE = 500