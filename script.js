/*Pintar filas formato html desde javaScript*/
const getProductRowHTML = (product, currency) => {
	return ` 
<tr class="list__row" data-carrito-sku=${product.SKU}>
    <td class="list__row-cell">
        <p class="list__title">${product.title}</p>
        <p class="list__sku">${product.SKU}</p>
    </td>
    <td class="list__row-cell">
        <buton class="list__control" data-carrito-action="sub">-</buton>
        <input
            type="number"
            class="list__control-number"
            value="0" data-carrito-action="set" data-carrito-product-units />
        <buton class="list__control" data-carrito-action="add">+</buton>
    </td>
    <td class="list__row-cell">
        <span class="list__price">${product.price}${currency}</span>
    </td>
    <td class="list__row-cell">
        <span class="list__price" data-carrito-product-total>0${currency}</span>
    </td>
</tr>`;
};

const getProductTotalRowHTML = (product, total) => {
	return ` 
 <tr>
    <td>${product.title}</td>
    <td>${total}</td>
 </tr>
`;
};

/* Peticion get a API jsonBlob para obtener los datos */
document.addEventListener("DOMContentLoaded", () => {
    let cart;
	const carrito = document.querySelector("#carrito");
	const carritoProducts = carrito.querySelector("#carrito-products");
    const carritoTotalProducts = carrito.querySelector("#carrito-total-products")
    const carritoTotal = carrito.querySelector("#carrito-total")

    const formatPrice = (price) => {
     return  `${price.toFixed(2)}${cart.getCurrency()}`
    }

    const sync = () => {
    //Actualizar las filas
    //Actualizar los inputs con las unidades correctas
    //Actualizar los totales por producto
    carritoProducts.querySelectorAll("[data-carrito-sku]").forEach(row => {
        const sku = row.dataset.carritoSku
        const infoProduct = cart.getInfoProduct(sku)
        const units = cart.getUnits(sku)
        const total = infoProduct.price * units;
        row.querySelector("[data-carrito-product-units]").value = units;
        row.querySelector("[data-carrito-product-total]").innerText = formatPrice(total);
    })
    //Actualizar la filas del total
    const infoCart = cart.getCart()
    let ttal = 0 
    let carritoTotalProductsHTML = ""
    Object.entries(infoCart).forEach(([sku, units]) => {
        console.log(sku, units)
        const info = cart.getInfoProduct(sku)
        const total = info.price * units
        ttal = ttal + total
        carritoTotalProductsHTML = carritoTotalProductsHTML +  getProductTotalRowHTML(info, formatPrice(total))
    })
    carritoTotalProducts.innerHTML = ""
    carritoTotalProducts.innerHTML = carritoTotalProductsHTML
    //Actualizar total
    carritoTotal.innerText = formatPrice(ttal)
    } 
    
    /*Manejadores botones*/
    const controlHandler = (ev) => {
        const element = ev.target
        const action = element.dataset.carritoAction
        const sku = element.closest("[data-carrito-sku]").dataset.carritoSku
        console.log(action, sku)
let units
        switch(action) {
            case "sub":
                units = cart.getUnits(sku)
                units--
                break;
            case "set":
                units = element.value
                break; 
            case "add":
                units = cart.getUnits(sku)
                units++
                break;
        }
        cart.updateUnits(sku, units)
        sync ()
    }

	/* esta constante INIT guarda dentro el array de productos */
    const init = (info) => {
        const {currency, products} = info 
        cart = new Cart(products, currency)
       
//PINTAR TABLA
        let carritoProductsHTML = ""
		info.products.forEach((product) => {
			carritoProductsHTML = carritoProductsHTML + getProductRowHTML(product, currency)
		});
        carritoProducts.innerHTML = carritoProductsHTML

        carritoProducts.querySelectorAll("[data-carrito-action]").forEach(control => {
            if (control.tagName === "BUTON") {
                control.addEventListener("click", controlHandler)
            }
            if (control.tagName === "INPUT") {
                control.addEventListener("change", controlHandler)
            }
            
        })
        sync()
	};

	fetch("https://jsonblob.com/api/jsonBlob/1208433715339714560")
		.then((res) => res.json())
		.then(init);
});
