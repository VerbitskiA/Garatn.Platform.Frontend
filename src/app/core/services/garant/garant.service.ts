import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GarantInitInput } from "src/app/models/garant/input/garant-init-input";
import { GetPaymentStateInput } from "src/app/models/garant/input/get-payment-state-input";
import { TransitionInput } from "src/app/models/transition/input/transition-input";
import { API_URL } from "../../core-urls/api-url";
import { CommonDataService } from "../common/common-data.service";
import { DataService } from "../common/data-service";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {InitModel} from "../../../models/garant/init.model";
import {GetTransitionModel} from "../../../models/user/get-transition.model";
import {GetStatePaymentModel} from "../../../models/garant/get-state-payment.model";

/**
 * Сервис Гаранта.
 */
@Injectable()
export class GarantService {
    constructor(private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private commonService: CommonDataService,
        private dataService: DataService) {

    }

   /**
     * Функция получит данные Гаранта на ините.
     * @param stage - Номер этапа.
     * @param isChat - Флаг чата.
     * @param otherId - Id другого пользователя.
     * @returns Данные инита страницы.
     */
    public initGarantDataAsync(stage: number, isChat: boolean, otherId: string): Observable<any> {
     let garantInput = new GarantInitInput();

     // TODO: позже убрать хардкод!
     garantInput.OriginalId = 1000005;
     garantInput.OrderType = "Franchise";
     garantInput.Stage = stage;
     garantInput.IsChat = isChat;
     garantInput.OtherId = otherId;
     return this.http.post<InitModel>(API_URL.apiUrl.concat("/garant/init"), garantInput)
       .pipe(tap((response) => response), catchError(err => {
         this.commonService.routeToStart(err);
         return of(new Error(err));
       }));
    };

    /**
     * Функция получит переход по параметрам.
     * @returns Данные перехода.
     */
     public async getTransitionWithParamsAsync(referenceId: number) {
        try {
            let transitionInput = new TransitionInput();
            transitionInput.ReferenceId = referenceId;

            return new Promise(async resolve => {
                await this.http.post<GetTransitionModel>(API_URL.apiUrl.concat("/user/get-transition-with-params"), transitionInput)
                    .subscribe({
                        next: (response: any) => {
                            resolve(response);
                        },

                        error: (err) => {
                            this.commonService.routeToStart(err);
                            throw new Error(err);
                        }
                    });
            })
        }

        catch (e: any) {
            throw new Error(e);
        }
    };

    /**
     * Функция периодически проверяет, оплачен ли заказ.
     */
    public async checkPaymentStateAsync(orderId: string, referenceId: number, itemDealId: number, typeItemDeal: string) {
        // setInterval(async () => {

        // }, 5000); // Каждые 5 сек.

        try {
            let getStateInput = new GetPaymentStateInput();
            getStateInput.PaymentId = orderId;
            getStateInput.OrderId = referenceId;
            getStateInput.ItemDealId = itemDealId;
            getStateInput.DealItemType = typeItemDeal;

            return new Promise(async resolve => {
                await this.http.post<GetStatePaymentModel>(API_URL.apiUrl.concat("/garant/get-state-payment"), getStateInput)
                .subscribe({
                    next: (response: any) => {
                        console.log("payment state: ", response);

                        if (response == null) {
                            return;
                        }

                        // Если покупатель оплатил заказ, то запустить вычитание комиссии и выплату средств за этап на счет продавца.
                        if (response.status == "CONFIRMED" || response.status == "PaymentSuccess") {
                            this.dataService.isPayCustomerAct = true;
                        }

                        else {
                            this.dataService.isPayCustomerAct = false;
                        }

                        console.log("Статус платежа: ", this.dataService.isPayCustomerAct);

                        resolve(response);
                    },

                    error: (err) => {
                        this.commonService.routeToStart(err);
                        throw new Error(err);
                    }
                });
            })
        }

        catch (e: any) {
            throw new Error(e);
        }
    };
};
