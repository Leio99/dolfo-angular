import { InjectionToken, ValueProvider } from "@angular/core"

export interface ILanguage{
    readonly name: string
    readonly locale: string
}

export interface ILanguageToken{
    readonly defaultLanguage: string
    readonly langs: ILanguage[]
}

export const TRANSLATE_STORAGE_KEY = "dolfo-lang-stored"

export const LANGUAGE_TOKEN = new InjectionToken<ILanguageToken>("LANGUAGE_TOKEN")

export const provideDolfoLanguages = (langs: ILanguage[], defaultLanguage: string): ValueProvider => ({
    provide: LANGUAGE_TOKEN,
    useValue: { defaultLanguage, langs } as ILanguageToken
})