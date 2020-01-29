let app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        brand: 'Vue Mastery',
        selectedVariant:0,
        description: 'A pair of warm, fuzzy socks',
        link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: 'assets/vmSocks-green-onWhite.jpg',
                variantQuantity:0
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: 'assets/vmSocks-blue-onWhite.jpg',
                variantQuantity:20
            }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        cart: 0
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        inventory(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        inStock(){
            return this.inventory>0?true:false;
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        }

    },
    methods: {
        addToCart: function () {
            this.cart++;
        },
        moveOutOfCart() {
            if (this.cart > 0) {
                this.cart--;
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },

    }
});