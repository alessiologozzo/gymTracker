import { inject } from "@angular/core"
import { HttpErrorService } from "../services/httpError/http-error.service"
import { Router } from "@angular/router"

export const httpErrorGuard = () => {
    const httpErrorService = inject(HttpErrorService)
    const router = inject(Router)
    if(!httpErrorService.errorOccured && !httpErrorService.fatalError()) {
        router.navigateByUrl('/')
    }

    return httpErrorService.errorOccured || httpErrorService.fatalError()
}