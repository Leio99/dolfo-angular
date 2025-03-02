import { formatDate } from "@angular/common"
import { HttpClient } from "@angular/common/http"
import { Inject, Injectable } from "@angular/core"
import { BehaviorSubject, distinctUntilChanged, tap } from "rxjs"
import { ILanguage, ILanguageToken, LANGUAGE_TOKEN, TRANSLATE_STORAGE_KEY } from "../interfaces"

@Injectable({
    providedIn: "root"
})
export class TranslateService {
    private lang$ = new BehaviorSubject<ILanguage>(null)
    private langContent: Record<string, string>
    private langs: ILanguage[]

    constructor(@Inject(LANGUAGE_TOKEN) langConfig: ILanguageToken, private httpClient: HttpClient) {
        if(!localStorage.getItem(TRANSLATE_STORAGE_KEY))
            localStorage.setItem(TRANSLATE_STORAGE_KEY, langConfig.defaultLanguage)
        
        const { langs } = langConfig,
        lang = localStorage.getItem(TRANSLATE_STORAGE_KEY) as string,
        foundLang = langConfig.langs.find(l => l.name === lang)

        this.langs = langs

        if(!foundLang)
            localStorage.removeItem(TRANSLATE_STORAGE_KEY)
        else
            this.lang$.next(foundLang)
    }

    public changeLanguage$ = (lang: ILanguage) => {
        if(this.langs.some(l => l.name === lang.name))
            localStorage.setItem(TRANSLATE_STORAGE_KEY, lang.name)

        return this.load$(lang).pipe(
            tap(() => this.lang$.next(lang))
        )
    }

    public loadFromStorage$ = () => {
        const lang = localStorage.getItem(TRANSLATE_STORAGE_KEY)

        if(!lang)
            throw new Error("Language not set or not valid!!")

        const foundLang = this.langs.find(l => l.name === lang)

        return this.load$(foundLang)
    }

    private load$ = ({ name }: ILanguage) => this.httpClient.get<Record<string, string>>(`assets/langs/${name}.json`).pipe(
        tap(content => this.langContent = content)
    )

    public translate = (key: string, params?: Record<string, string>): string => {
        const base = key.split(".").reduce((prev, curr) => prev?.[curr], this.langContent as any),
        ret = base || key

        if (params){
            return Object.keys(params).reduce(
                (curr, key) => curr.replace(`{${key}}`, params[key as keyof Object]),
                ret
            )
        }

        return ret
    }

    public getLang = () => this.lang$.getValue()

    public getLang$ = () => this.lang$.asObservable().pipe(distinctUntilChanged())

    private getLocale = () => this.getLang()?.locale || "en-US"

    public formatDate = (d: string) => formatDate(new Date(d), this.translate("dateFormat"), this.getLocale())
}
