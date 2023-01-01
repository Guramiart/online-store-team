import "./style.scss";
import { AbstractView } from "../abstractView";
import * as CartItem from "./cartItem";
import { Product } from "../../interface/product";
import { createOrderBlock, getPromo } from "./orderBlock";
import { getModal } from "./modal";
import { Cart, CartData } from "./cart/cart";
import { PromoCode } from "../../enum/promo";

export class CartView extends AbstractView {

    private _cart: Cart;

    constructor(cart: Cart) {
        super();
        this._cart = cart;
    }
    
    async getView(): Promise<HTMLElement>  {
        let content = document.createElement('section') as HTMLElement;
        content.classList.add('cart-page');
        content.innerHTML = this.getEmptyCart();
        return content;
    }

    draw(): void {
        const parent = document.querySelector('.cart-page') as HTMLElement;
        if (this._cart.cartData.length !== 0) {
            const fragment = document.createDocumentFragment();
            const cardTemp = CartItem.createTemplate();

            this._cart.cartData.forEach(item => {
                const card = cardTemp.cloneNode(true) as HTMLElement;
                card.classList.add('products__card');
                CartItem.setData(card, item);
                fragment.append(card);
                card.addEventListener('click', (e: Event) => this.clickItem(e, item, parent));
            });

            parent.innerHTML = 
            `<section class="cart__products">
                <div class="cart__list"></div>
                <div class="cart__order"></div>
                <div class="modal hidden"></div>
            </section>`;
            const cart = document.querySelector('.cart__list') as HTMLElement;
            cart.appendChild(fragment);

            const order = document.querySelector('.cart__order') as HTMLElement;
            order.append(createOrderBlock(this._cart.cartData));

            const orderParent = document.querySelector('.order__promo-content') as HTMLElement;
            const orderInput = document.querySelector('.order__promo') as HTMLInputElement;
            orderInput.addEventListener('input', (e) => this.findPromo(e, orderParent));

            const modal = document.querySelector('.modal') as HTMLElement;
            modal.append(getModal());
        }
    }

    private clickItem(e: Event, data: CartData, parent: HTMLElement) {
        const target = e.target! as HTMLElement;
        if (target.closest('.product-cart__button')) {
            this.removeFromCart(e, data.product, parent);
        } else {
            const titleNum = document.getElementById(`count-${data.product.id}`) as HTMLElement;
            const orderProduct = document.querySelector('.order__count') as HTMLElement;
            const orderPrice = document.querySelector('.order__cost') as HTMLElement;
            const price = document.getElementById(`price-${data.product.id}`) as HTMLElement;
            if(target.closest('.order-num__btn-right')) {
                e.preventDefault();
                data.count++;
                if(data.count > data.product.stock) {
                    return;
                }
                titleNum.innerText = `${Number(titleNum.innerHTML) + 1}`;
                orderProduct.innerText = `${Number(orderProduct.innerHTML) + 1}`;
                price.innerText = `${data.product.price * data.count}`;
                orderPrice.innerText = `Total: ${this._cart.plusNumber(data)}`;
            } else if (target.closest('.order-num__btn-left')) {
                e.preventDefault();
                data.count--;
                if(data.count < 1) {
                    this.removeFromCart(e, data.product, parent);
                    return;
                }
                titleNum.innerText = `${Number(titleNum.innerHTML) - 1}`;
                orderProduct.innerText = `${Number(orderProduct.innerHTML) - 1}`;
                price.innerText = `${data.product.price * data.count}`;
                orderPrice.innerText = `Total: ${this._cart.minusNumber(data)}`;
            }
        } 
    }

    private removeFromCart(e: Event, product: Product, parent: HTMLElement) {
        e.preventDefault();
        this._cart.removeFromCart(product);
        if(this._cart.getSize() === 0) {
            localStorage.removeItem('cart-storage');
            parent.innerHTML = this.getEmptyCart();
        } else {
            this.draw();
        }
    }

    private findPromo(e: Event, parent: HTMLElement) {
        const input = (<HTMLTextAreaElement>e.target).value.toUpperCase();
        if(input == PromoCode.RSS) {
            const content = 'Rolling Scopes School - 10%'
            getPromo(parent, content);
        } else if(input == PromoCode.EPM) {
            const content = 'EPAM Systems - 10%'
            getPromo(parent, content);
        } else {
            parent.innerHTML = '';
        }
    }

    private getEmptyCart() {
        return `<div class="cart-message">
                    <span class="cart__text">Your cart is empty</span>
                    <a href="#" class="cart__btn">Go shopping</a>
                </div>`;
    }

}