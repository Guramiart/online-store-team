import { Endpoint } from "../enum/endpoint";
import { Callback } from "../interface/callback";
import { Product, ProductResponse } from "../interface/product";
import AppLoader from "./appLoader";
import Router from "../utils/router";
import AppView from "../view/appView";

export class AppController extends AppLoader {
    private router: Router;
    private appView: AppView;

    constructor() {
        super();
        this.router = new Router();
        this.appView = new AppView(this);

        this.router.addRoute(/product\/\d+/g, 'Product', this.appView.productView);
        this.router.addRoute(/cart/g, 'Cart', this.appView.cartView)
        this.router.addRoute(/\//g, 'Online store', this.appView.homeView);
    }

    getProducts(callback: Callback<ProductResponse>): void {
        const path = window.location.hash.split('/');
        const id = (path.length > 1) ? path[1] : '';
        super.getResp<ProductResponse>(
            {
                endpoint: Endpoint.Products + `/${id}`,
            },
            callback
        );
        return;
    }

    handleLocation() {
        this.router.locationHandler().then((view) => {
            this.getProducts((data) => {
                if (data.products !== undefined) {
                    view?.draw(data.products);
                } else {
                    view?.draw(data);
                }
            })
        })
    }
}