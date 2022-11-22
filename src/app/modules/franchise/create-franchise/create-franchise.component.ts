import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {API_URL} from "src/app/core/core-urls/api-url";
import {CreateUpdateFranchiseInput} from "src/app/models/franchise/input/franchise-create-update-input";
import {CommonDataService} from "src/app/core/services/common/common-data.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, of} from "rxjs";
import {map, switchMap, takeUntil} from "rxjs/operators";
import {GarDestroyService} from "../../../gar-lib/gar-destroy.service";
import {FranchiseOutput} from "../../../models/franchise/output/franchise-output";
import {CreateUpdateFranchiseModel} from "../../../models/franchise/create-update-franchise.model";

@Component({
  selector: "app-create-franchise",
  templateUrl: "create-franchise.component.html",
  styleUrls: ["create-franchise.component.scss"],
  providers: [GarDestroyService]
})

/**
 * Класс модуля создания франшизы.
 */
export class CreateFranchiseComponent implements OnInit {

  private _attachedFiles$ = new BehaviorSubject<string[]>([]);

  logoName?: string;
  responsiveOptions: any;
  aNamesFranchisePhotos: any = [];
  aFiles: any[] = [];
  lead?: string;
  generalInvest?: number;
  lumpSumPayment?: number;
  royalty?: number;
  royaltyPack?: number;
  payback?: number;
  profitMonth?: number;
  launchDate?: number;
  priceInvest?: string;
  nameInvest?: string;
  baseDate?: number;
  yearStart?: number;
  dotCount?: number;
  businessCount?: number;
  peculiarity?: string;
  isHidePacks?: boolean;
  packName?: string;
  packDetails?: string;
  packLumpSumPayment?: string;
  isGarant: boolean = false;
  fileLogoFormData?: any;
  franchisePhotos: any;
  fileEducationFormData: any;
  activityDetail?: string;
  featureFranchise?: string;
  defailsFranchise?: string;
  paymentDetails?: string;
  namesIndicators?: string;
  finIndicator1?: string;
  finIndicator2?: string;
  finIndicator3?: string;
  finIndicator4?: string;
  percentFinancial1?: number;
  percentFinancial2?: number;
  percentFinancial3?: number;
  percentFinancial4?: number;
  educationDetails?: string;
  totalInvest?: number;
  videoLink?: string;
  modelFile: any;
  presentFile: any;
  ainvestIn: any;
  ind: number = 0;
  aPacks: any;
  pInd: number = 0;
  fio: string = "";
  routeParamCategory: any;
  routeParamSubCategory: any;
  routeParamSubCity: any;

  constructor(
    private http: HttpClient,
    private commonService: CommonDataService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private _destroy$: GarDestroyService
  ) {
    this.routeParamCategory = this.route.snapshot.queryParams["category"];
    this.routeParamSubCategory = this.route.snapshot.queryParams["subCategory"];
    this.routeParamSubCity = this.route.snapshot.queryParams["city"];

    this.responsiveOptions = [
      {breakpoint: '1024px', numVisible: 5},
      {breakpoint: '768px', numVisible: 3},
      {breakpoint: '560px', numVisible: 1}
    ];

    // Первоначальная инициализация инвестиций.
    this.ainvestIn = [
      {Name: "", Price: "", isHideInvest: false}
    ];

    // Первоначальная инициализация пакетов.
    this.aPacks = [{Name: "", Text: "", LumpSumPayment: "", Royalty: "", TotalInvest: "", IsHidePack: false}];

    console.log("ainvestIn", this.ainvestIn);
    console.log("aPacks", this.aPacks);
  };

  public ngOnInit() {
    this.getUserFio();
  };

  public uploadImages(files: string[]) {
    this._attachedFiles$.next(files);
  }

  /**
   * Функция создаст новую франшизу.
   * @returns - Данные созданной франшизы.
   */
  public onCreateFranchiseAsync() {
    console.log("onCreateFranchiseAsync");

    let logoName = this.logoName;
    let lead = this.lead;
    let generalInvest = this.generalInvest;
    let royalty = this.royalty;
    let payback = this.payback;
    let profitMonth = this.profitMonth;
    let launchDate = this.launchDate;
    let activityDetail = this.activityDetail;
    let baseDate = this.baseDate;
    let yearStart = this.yearStart;
    let dotCount = this.dotCount;
    let businessCount = this.businessCount;
    let featureFranchise = this.featureFranchise;
    let defailsFranchise = this.defailsFranchise;
    let paymentDetails = this.paymentDetails;
    let namesIndicators = this.namesIndicators;
    let finIndicator1 = this.finIndicator1;
    let finIndicator2 = this.finIndicator2;
    let finIndicator3 = this.finIndicator3;
    let finIndicator4 = this.finIndicator4;
    let percentFinancial1 = this.percentFinancial1;
    let percentFinancial2 = this.percentFinancial2;
    let percentFinancial3 = this.percentFinancial3;
    let percentFinancial4 = this.percentFinancial4;
    let educationDetails = this.educationDetails;
    let videoLink = this.videoLink;
    let isGarant = this.isGarant || false;

    // Уберет ключи флагов.
    let newainvestIn = this.ainvestIn.map((item: any) => ({Name: item.Name, Price: item.Price}));

    let investInJsonString = JSON.stringify(newainvestIn);

    // Формирование json фин.индикаторов.
    let namesIndicatorsJson = [
      {Name: finIndicator1, Price: percentFinancial1},
      {Name: finIndicator2, Price: percentFinancial2},
      {Name: finIndicator3, Price: percentFinancial3},
      {Name: finIndicator4, Price: percentFinancial4}
    ];

    let namesIndicatorsJsonString = JSON.stringify(namesIndicatorsJson);

    // Уберет ключи флагов.
    let newPacks = this.aPacks.map((item: any) => ({
      Name: item.Name,
      Text: item.Text,
      LumpSumPayment: item.LumpSumPayment,
      Royalty: item.Royalty,
      TotalInvest: item.TotalInvest
    }))

    let packetJsonString = JSON.stringify(newPacks);

    // let createUpdateFranchiseInput = new CreateUpdateFranchiseInput();
    // //createUpdateFranchiseInput.Status = lead;
    // createUpdateFranchiseInput.status = lead;
    // // createUpdateFranchiseInput.GeneralInvest = generalInvest;
    // createUpdateFranchiseInput.generalInvest = generalInvest as number;
    // // createUpdateFranchiseInput.LumpSumPayment = this.lumpSumPayment;
    // createUpdateFranchiseInput.lumpSumPayment = this.lumpSumPayment as number;
    // // createUpdateFranchiseInput.Royalty = royalty;
    // createUpdateFranchiseInput.royalty = royalty as number;
    // // createUpdateFranchiseInput.Payback = payback;
    // createUpdateFranchiseInput.payback = payback as number;
    // // createUpdateFranchiseInput.ProfitMonth = profitMonth;
    // createUpdateFranchiseInput.profitMonth = profitMonth as number;
    // // createUpdateFranchiseInput.LaunchDate = launchDate;
    // createUpdateFranchiseInput.launchDate = launchDate as number;
    // // createUpdateFranchiseInput.ActivityDetail = activityDetail;
    // createUpdateFranchiseInput.activityDetail = activityDetail;
    // // createUpdateFranchiseInput.BaseDate = baseDate;
    // createUpdateFranchiseInput.baseDate = baseDate as number;
    // // createUpdateFranchiseInput.YearStart = yearStart;
    // createUpdateFranchiseInput.yearStart = yearStart as number;
    // // createUpdateFranchiseInput.DotCount = dotCount;
    // createUpdateFranchiseInput.dotCount = dotCount as number;
    // // createUpdateFranchiseInput.BusinessCount = businessCount;
    // createUpdateFranchiseInput.businessCount = businessCount as number;
    // // createUpdateFranchiseInput.Peculiarity = featureFranchise;
    // createUpdateFranchiseInput.peculiarity = featureFranchise as string;
    // // createUpdateFranchiseInput.Text = defailsFranchise;
    // createUpdateFranchiseInput.text = defailsFranchise;
    // // createUpdateFranchiseInput.PaymentDetail = paymentDetails;
    // createUpdateFranchiseInput.paymentDetail = paymentDetails;
    // // createUpdateFranchiseInput.UrlVideo = videoLink;
    // createUpdateFranchiseInput.urlVideo = videoLink;
    // // createUpdateFranchiseInput.IsGarant = isGarant;
    // createUpdateFranchiseInput.isGarant = isGarant;
    // // createUpdateFranchiseInput.InvestInclude = investInJsonString;
    // createUpdateFranchiseInput.investInclude = investInJsonString;
    // // createUpdateFranchiseInput.FinIndicators = namesIndicatorsJsonString;
    // createUpdateFranchiseInput.finIndicators = namesIndicatorsJsonString;
    // // createUpdateFranchiseInput.NameFinIndicators = namesIndicators;
    // createUpdateFranchiseInput.nameFinIndicators = namesIndicators;
    // // createUpdateFranchiseInput.FranchisePacks = packetJsonString;
    // createUpdateFranchiseInput.franchisePacks = packetJsonString;
    // // createUpdateFranchiseInput.IsNew = true;
    // //createUpdateFranchiseInput.IsNew = true;
    // // createUpdateFranchiseInput.Title = logoName;
    // createUpdateFranchiseInput.title = logoName;
    // // createUpdateFranchiseInput.TrainingDetails = educationDetails;
    // createUpdateFranchiseInput.trainingDetails = educationDetails;
    // // createUpdateFranchiseInput.Category = this.routeParamCategory;
    // createUpdateFranchiseInput.category = this.routeParamCategory;
    // // createUpdateFranchiseInput.SubCategory = this.routeParamSubCategory;
    // createUpdateFranchiseInput.subCategory = this.routeParamSubCategory;
    // // createUpdateFranchiseInput.UrlsFranchise = this.aNamesFranchisePhotos;
    // //createUpdateFranchiseInput.UrlsFranchise = this.aNamesFranchisePhotos;
    // исправил новый экземпляр класса на объект:
    let createUpdateFranchiseInput = {
      status: lead,
      generalInvest: generalInvest as number,
      lumpSumPayment: this.lumpSumPayment as number,
      royalty: royalty as number,
      payback: payback as number,
      profitMonth: profitMonth as number,
      launchDate: launchDate as number,
      activityDetail: activityDetail,
      baseDate: baseDate as number,
      yearStart: yearStart as number,
      dotCount: dotCount as number,
      businessCount: businessCount as number,
      peculiarity: featureFranchise as string,
      text: defailsFranchise,
      paymentDetail: paymentDetails,
      urlVideo: videoLink,
      isGarant: isGarant,
      investInclude: investInJsonString,
      finIndicators: namesIndicatorsJsonString,
      nameFinIndicators: namesIndicators,
      franchisePacks: packetJsonString,
      title: logoName,
      trainingDetails: educationDetails,
      category: this.routeParamCategory,
      subCategory: this.routeParamSubCategory,
    } as CreateUpdateFranchiseModel;

    // Если не добавляли записи и осталась лежать одна пустая.
    if (!this.ainvestIn[0].Name || !this.ainvestIn[0].Price) {
      this.ainvestIn[0].Name = this.nameInvest;
      this.ainvestIn[0].Price = this.priceInvest;
    } else {
      this.ainvestIn.push({Name: this.nameInvest, Price: this.priceInvest});
    }

    // Уберет пустые записи.
    this.ainvestIn = this.ainvestIn.filter((item: any) => item.Name !== "" && item.Price !== "");

    if (!this.aPacks[0].Name || !this.aPacks[0].Text || !this.aPacks[0].LumpSumPayment || !this.aPacks[0].Royalty || !this.aPacks[0].TotalInvest) {
      this.aPacks[0].Name = this.packName;
      this.aPacks[0].Text = this.packDetails;
      this.aPacks[0].LumpSumPayment = this.packLumpSumPayment;
      this.aPacks[0].Royalty = this.royaltyPack;
      this.aPacks[0].TotalInvest = this.totalInvest;
    } else {
      this.aPacks.push({
        Name: this.packName,
        Text: this.packDetails,
        LumpSumPayment: this.packLumpSumPayment,
        Royalty: this.royaltyPack,
        TotalInvest: this.totalInvest
      });
    }

    // Уберет пустые записи.
    this.aPacks = this.aPacks.filter((item: any) => item.Name !== "" && item.Text !== "" && item.LumpSumPayment !== "" && item.Royalty !== "" && item.TotalInvest !== "");

    let sendFormData = new FormData();
    sendFormData.append("franchiseDataInput", JSON.stringify(createUpdateFranchiseInput));
    sendFormData.append("filesLogo", this.fileLogoFormData);
    sendFormData.append("urlsDetails", this.franchisePhotos);
    sendFormData.append("trainingPhoto", this.fileEducationFormData);
    sendFormData.append("finModelFile", this.modelFile);
    sendFormData.append("presentFile", this.presentFile);
    sendFormData.append("franchiseFile", this.presentFile);

    of(true).pipe(
      switchMap(_ => this._attachedFiles$),
      map(res => {
        // @ts-ignore
        sendFormData.append('UrlsFranchise', res);
        return sendFormData;
      }),
      switchMap(data => this.http.post<FranchiseOutput>(API_URL.apiUrl.concat("/franchise/create-update-franchise"), data)),
      // switchMap(data => this.http.post<CatalogFranchiseModel>(API_URL.apiUrl.concat("/franchise/create-update-franchise"), data)),
      takeUntil(this._destroy$)
    ).subscribe(response => {
      console.log("Франшиза успешно создана:", response);
      this.showMessageAfterSuccessCreateFranchise();

      setTimeout(() => {
        this.router.navigate(["/franchise/view"], {queryParams: {franchiseId: response.franchiseId, mode: "view"}});
      }, 2000);
    }, (error) => {
      this.commonService.routeToStart(error);
      throw new Error(error);
    });
  };

  /**
   * Функция добавит файл лого франшизы.
   */
  public uploadFranchiseLogoAsync(event: any) {
    event.stopPropagation();
    console.log("uploadFranchiseLogoAsync");
    this.fileLogoFormData = event.target.files[0];
  };

  /**
   * Функция добавит файл обучения.
   */
  public uploadEducationPhotosAsync(event: any) {
    console.log("uploadEducationPhotosAsync");
    this.fileEducationFormData = event.target.files[0];
  };

  /**
   * Функция добавит фото франшизы.
   */
  public uploadFranchisePhotosBeforeSaveAsync(event: any) {
    console.log("uploadFranchisePhotosBeforeSaveAsync");
    this.franchisePhotos = event.target.files[0];
  };

  /**
   * Функция добавит файл фин.модели.
   */
  public uploadFinModelAsync(event: any) {
    console.log("uploadFinModelAsync");
    this.modelFile = event.target.files[0];
  };

  /**
   * Функция добавит файл презентации.
   */
  public uploadPresentAsync(event: any) {
    console.log("uploadPresentAsync");
    this.presentFile = event.target.files[0];
  };

  /**
   * Функция покажет сообщение об успешном создании франшизы.
   */
  private showMessageAfterSuccessCreateFranchise() {
    this.messageService.add({
      severity: 'success',
      summary: 'Успешно!',
      detail: 'Франшиза успешно создана'
    });
  };

  /**
   * Функция нарастит блоки с данными входит в инвестиции.
   * @param priceInvest - цена.
   * @param nameInvest - название.
   */
  public onAddInveest(priceInvest: any, nameInvest: any) {
    if (this.ainvestIn.length == 1) {
      this.ainvestIn[0] = {Name: nameInvest, Price: priceInvest};
      this.ainvestIn.push({Name: "", Price: ""});
      this.ainvestIn[this.ind].isHideInvest = true;
      this.ind++;
      return;
    }
    this.ainvestIn[this.ind].Name = nameInvest;
    this.ainvestIn[this.ind].Price = priceInvest;
    this.ainvestIn.push({Name: "", Price: ""});
    this.ainvestIn[this.ind].isHideInvest = true;
    this.ind++;
    console.log("investInJson", this.ainvestIn);
  };

  /**
   * Функция нарастит блоки с пакетами.
   * @param packName - название пакета.
   * @param packDetails - детали пакета.
   * @param packLumpSumPayment - паушальный взнос.
   * @param royaltyPack - роялти.
   * @param totalInvest - всего инвестиций.
   */
  public onAddPack(packName: any, packDetails: any, packLumpSumPayment: any, royaltyPack: any, totalInvest: any) {
    if (this.aPacks.length == 1) {
      this.aPacks[0] = {
        Name: packName,
        Text: packDetails,
        LumpSumPayment: packLumpSumPayment,
        Royalty: royaltyPack,
        TotalInvest: totalInvest
      };

      this.aPacks.push({Name: "", Text: "", LumpSumPayment: "", Royalty: "", TotalInvest: ""});

      this.aPacks[this.pInd].IsHidePack = true;
      this.pInd++;

      return;
    }

    this.aPacks[this.pInd].Name = packName;
    this.aPacks[this.pInd].Text = packDetails;
    this.aPacks[this.pInd].LumpSumPayment = packLumpSumPayment;
    this.aPacks[this.pInd].Royalty = royaltyPack;
    this.aPacks[this.pInd].TotalInvest = totalInvest;

    this.aPacks.push({Name: "", Text: "", LumpSumPayment: "", Royalty: "", TotalInvest: ""});

    this.aPacks[this.ind].IsHidePack = true;
    this.pInd++;

    console.log("packs", this.aPacks);
  };

  public onCheckedGarant() {
    console.log("isGarant", this.isGarant);
  };

  private getUserFio() {
    this.http.post(API_URL.apiUrl.concat("/user/user-fio"), {})
      .subscribe((response: any) => this.fio = response.fullName, (err) => {
        this.commonService.routeToStart(err);
        throw new Error(err);
      });
  };
}
