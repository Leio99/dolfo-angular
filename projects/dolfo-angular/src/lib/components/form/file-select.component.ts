import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, Input, Output, signal, ViewChild } from "@angular/core"
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms"
import { OnBlur, OnFocus } from "../../shared/interfaces/events"
import { BaseFormInput } from "./base-form-input"

@Component({
	selector: "dolfo-file-select",
	template: `<dolfo-input-container>
		<input #formInput type="file" (change)="changeFiles($event)" [multiple]="multiple" [accept]="accept" (focus)="onFocus.emit($event)" (blur)="onBlur.emit($event)" [disabled]="input.disabled" (dragover)="setDragging()" (dragleave)="dragging.set(false)" (drop)="onDrop($event)" [class.dragging]="dragging()" />
	</dolfo-input-container>`,
	standalone: false,
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileSelectComponent), multi: true },
		{ provide: NG_VALIDATORS, useExisting: forwardRef(() => FileSelectComponent), multi: true },
		{ provide: BaseFormInput, useExisting: FileSelectComponent }
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileSelectComponent extends BaseFormInput<FileList> implements OnFocus, OnBlur{
    @ViewChild("formInput") private formInput: ElementRef<HTMLInputElement>
	@Output() onFocus = new EventEmitter<FocusEvent>()
	@Output() onBlur = new EventEmitter<FocusEvent>()
    @Input({ transform: booleanAttribute }) multiple = false
    @Input() accept: string

    public dragging = signal(false)

    public changeFiles = (e: Event) => {
        if(!this.input.disabled)
            this.control.setValue((e.target as HTMLInputElement).files)
    }

    override writeValue = (obj: FileList) => {
        super.writeValue(obj)
        
        if(this.formInput)
            this.formInput.nativeElement.value = null
    }

    public setDragging = () => {
        if(!this.input.disabled)
            this.dragging.set(true)
    }

    public onDrop = (event: DragEvent) => {
        event.preventDefault()
        event.stopPropagation()

        if(this.input.disabled)
            return

        const rawFiles = event.dataTransfer?.files

        if (!rawFiles || rawFiles.length === 0)
            return

        const validFiles = Array.from(rawFiles).filter(f => this.isValidFile(f))

        if (validFiles.length > 0)
            this.control.setValue(validFiles)

        this.dragging.set(false)
    }

    public isValidFile = (file: File) =>  {
        if(!this.accept)
            return true

        const allowedExtensions = this.accept.split(",").map(ext => ext.trim().toLowerCase()),
        fileName = file.name.toLowerCase()
        
        return allowedExtensions.some(ext => {
            if (ext.startsWith("."))
                return fileName.endsWith(ext)

            if (ext.includes("/")) {
                if (ext.endsWith("/*")) {
                    const mainType = ext.split("/")[0]
                    return file.type.startsWith(mainType + "/")
                }

                return file.type === ext
            }

            return file.type === this.accept
        })
    }
}
