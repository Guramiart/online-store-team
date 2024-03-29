import "./style.scss";
import { CartData } from "../cart/cart";

function createTemplate(): HTMLElement {
    const card = document.createElement('a');
    card.setAttribute('href', '#');
    card.classList.add('product-cart');

    const box = document.createElement('div');
    box.classList.add('product-cart__box');

    const block = document.createElement('div');
    block.classList.add('product-cart__block');

    const id = document.createElement('span');
    id.classList.add('product-cart__id');

    const image = document.createElement('div');
    image.classList.add('product-cart__thumbnail');

    const detailing = document.createElement('div');
    detailing.classList.add('product-cart__detailing');

    const title = document.createElement('p');
    title.classList.add('product-cart__title');

    const brand = document.createElement('p');
    brand.classList.add('product-cart__brand');

    const description = document.createElement('p');
    description.classList.add('product-cart__desc');

    const buy = document.createElement('div');
    buy.classList.add('product-cart__buy');

    const count = document.createElement('div');
    count.classList.add('product-cart__count');

    const price = document.createElement('div');
    price.classList.add('product-cart__price');

    const orderCountBox = document.createElement('div');
    orderCountBox.classList.add('product-cart__order-num');

    const orderBtnLeft = document.createElement('button');
    orderBtnLeft.classList.add('order-num__btn', 'order-num__btn-left');
    orderBtnLeft.textContent = '-';

    const orderCount = document.createElement('p');
    orderCount.classList.add('order-num__count');

    const orderBtnRight = document.createElement('button');
    orderBtnRight.classList.add('order-num__btn', 'order-num__btn-right');
    orderBtnRight.textContent = '+';

    const button = document.createElement('button');
    button.classList.add('product-cart__button');

    orderCountBox.append(orderBtnLeft, orderCount, orderBtnRight);

    buy.append(count, price, orderCountBox);

    detailing.append(title, brand, description);

    block.append(id, image, detailing);
    box.append(block, buy, button);
    card.append(box);

    return card;
}

function setData(card: HTMLElement, data: CartData, index: number): void {
    card.setAttribute('href', `#/product?id=${data.product.id}`);
    (card.querySelector('.product-cart__id') as HTMLElement).innerText = index.toString();
    (card.querySelector('.product-cart__thumbnail') as HTMLElement).style.backgroundImage =
        `url(${data.product.thumbnail})`;
    (card.querySelector('.product-cart__title') as HTMLElement).textContent = data.product.title;
    (card.querySelector('.product-cart__brand') as HTMLElement).textContent = data.product.brand;
    (card.querySelector('.product-cart__desc') as HTMLElement).textContent = `${data.product.description}`;
    (card.querySelector('.product-cart__price') as HTMLElement).textContent = `${data.product.price * data.count}`;
    (card.querySelector('.product-cart__price') as HTMLElement).id = `price-${data.product.id}`;
    (card.querySelector('.product-cart__count') as HTMLElement).textContent = `Stock: ${data.product.stock}`;
    (card.querySelector('.order-num__count') as HTMLElement).id = `count-${data.product.id}`;
    (card.querySelector('.order-num__count') as HTMLElement).innerHTML = `${data.count}`;
}

export { createTemplate, setData };
