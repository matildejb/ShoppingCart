class Cart {
    #products
    #currency
    #cart

    constructor(products, currency){
        this.#products = products
        this.#currency = currency
        this.#cart = {}
    }

    getCart(){
        return this.#cart
    }

    getProduct(){
        return this.#products
    }
    getCurrency(){
        return this.#currency
    }
    updateUnits(sku, units){
        if(units < 1){
            delete this.#cart[sku]
        }else {
            this.#cart[sku]  = units
        }
    }
    getInfoProduct(sku) {
        return this.#products.find(product => product.SKU === sku)
    }
    getUnits(sku){
       return (typeof this.#cart[sku] === "undefined") ? 0 :  this.#cart[sku]
    }

   
}