import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {CommonDataService} from 'src/app/core/services/common/common-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {BehaviorSubject, Observable, of} from "rxjs";
import {SessionService} from "../../../core/services/session/session.service";
import {filter, map, shareReplay, takeUntil} from "rxjs/operators";
import {GarDestroyService} from "../../../gar-lib/gar-destroy.service";

export namespace Header {
  export interface IItem {
    name: string;
    type: string;
    position: number;
  }

  export interface IHeaderItem {
    name: string;
    icon: string;
    link?: string;
    linkAction?: () => void;
  }

  export interface ISearchOption {
    name: string;
    type: string;
  }
  export const routerLink = {
    sel: '',

  }
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [GarDestroyService]
})

/**
 * Класс модуля хидера.
 */
export class HeaderComponent implements OnInit {
  private _aHeader$ = new BehaviorSubject<Header.IItem[] | null>(null);

  public aHeader$: Observable<Header.IItem[] | null> = this._aHeader$.pipe(
    filter((aHeader) => !!aHeader?.length),
    map((aHeader) => {
      return !this._sessionService.isLogin ? aHeader : aHeader!.filter(h => h.name !== 'Вход или регистрация')
    }),
    shareReplay({refCount: true, bufferSize: 1}),
    takeUntil(this._destroy$)
  )

  aBreadcrumbs: any[] = [];
  routeParam: any;
  searchText: string = "";
  searchOptions: Header.ISearchOption[];
  selectedSearchOption: Header.ISearchOption;
  isGarant: boolean = false;
  items!: MenuItem[];
  isMenuHidden: boolean = true;
  categories: Header.IHeaderItem[] = [
    {name: 'Главная', icon: 'category-home', link: '/'},
    {name: 'Франшизы', icon: 'category-franchise', link: '/catalog-franchise'},
    {name: 'Готовый бизнес', icon: 'category-business', link: '/catalog-business'},
    {name: 'Покупка через гарант', icon: 'category-deal', link: '/deal/start'},
    {name: 'Консалтинг', icon: 'category-consulting', link: '/consulting/start'},
    {name: 'Упаковка франшиз', icon: 'category-franchise-start', link: '/franchise/start'}
  ];

  cabinetLinks$: Observable<Header.IHeaderItem[]> | undefined;

  private headerLink: Header.IHeaderItem[] | undefined;

  constructor(
    private commonService: CommonDataService,
    private router: Router,
    private route: ActivatedRoute,
    private _sessionService: SessionService,
    private _destroy$: GarDestroyService
  ) {
    this.searchOptions = [
      {name: 'франшиза', type: 'franchise'},
      {name: 'бизнес', type: 'business'}
    ];

    this.selectedSearchOption = this.searchOptions[0];

    this.items = [
      {label: 'Подтверждение продажи'},
      {label: 'Согласование этапов сделки'},
      {label: 'Согласование договора'},
      {label: 'Оплата и исполнение этапов сделки'}
    ];

    this.routeParam = this.route.snapshot.queryParams;
  };

  ngDoCheck() {
    this.isGarant = window.location.href.includes("stage");

    if (this.isMenuHidden) {
      document.body.classList.remove('no-overflow');
    } else {
      document.body.classList.add('no-overflow');
    }
  }

  public ngOnInit() {
    this.headerLink = [
      {name: 'Продать', icon: 'cabinet-megaphone', linkAction: () => this.toLoginOrCabinetLink()},
      {name: 'Мои сделки', icon: 'cabinet-deal', linkAction: () => this.toLoginOrCabinetLink()},
      {name: 'Избранное', icon: 'cabinet-star', linkAction: () => this.toLoginOrCabinetLink()},
      {name: 'Уведомления', icon: 'cabinet-bell', linkAction: () => this.toLoginOrCabinetLink()},
      {name: this._sessionService.isLogin ? 'Аккаунт' : 'Войти', icon: 'cabinet-profile', linkAction: () => this.toLoginOrCabinetLink()}
    ];
    this.cabinetLinks$ = of(this.headerLink).pipe(takeUntil(this._destroy$));
    this.initHeaderAsync();
    // this.commonService.refreshToken();
    this.getBreadcrumbsAsync();
    this.items = [{label: 'Step 1'}, {label: 'Step 2'}, {label: 'Step 3'}];
  };
  private toLoginOrCabinetLink(): void{
    this.router.navigate(["/login"], {queryParams: {loginType: "code"}})
  }
  @HostListener('window:resize', ['$event'])
  @HostListener('window:load', ['$event'])
  onResize() {
  }

  public toggleMenu(show: boolean): void {
    this.isMenuHidden = !show;
  }

  /**
   * Функция получит поля хидера.
   */
  private initHeaderAsync() {
    this.commonService.initHeaderAsync("Main").subscribe((data: Header.IItem[]) => this._aHeader$.next(data));
  };

  /**
   * Функция распределит роуты по пунктам хидера.
   * @param name - параметр роута с названием пункта.
   */
  // TODO refactor onGetMenuHeader method
  public onGetMenuHeader(name: string) {
    switch (name) {
      case "Вход или регистрация":
        this.toLoginOrCabinetLink();
        break;
      // Переход к созданию объявления.
      case "Разместить объявление":
        this._sessionService.isLogin ? this.toLoginOrCabinetLink() : this.router.navigate(["/ad/create"]);
        break;
    }
  };

  /**
   * Функция сформирует хлебные крошки страницы.
   * @returns - Список пунктов цепочки хлебных крошек.
   */
  private getBreadcrumbsAsync() {
    this.commonService.getBreadcrumbsAsync(this.router.url).subscribe((data: any) => this.aBreadcrumbs = data);
  };

  public onRouteSearch(searchText: string) {
    this.router.navigate(["/search"], {
      queryParams: {
        searchType: this.selectedSearchOption.type,
        searchText: searchText
      }
    });
  };
}
