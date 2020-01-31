Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
   <div class="product">
        <div class="product-image">
        <img :src="image" alt="">
    </div>
    <div class="product-info">
     <h1>{{title}}</h1>
     <p v-if="inventory>10">In Stock</p>
     <p v-else-if="inventory<=10&&inventory>0">Almost sold out!</p>
     <p v-else :class="{'out-of-stock':!inStock}">Out of Stock</p>
     <p>User is Premium:{{premium}}</p>
     <p>Shipping : {{shipping}}</p>
     <p>{{description}}</p>
     <a :href="link">More product here</a>
     <ul>
      <li v-for="detail in details">{{detail}}</li>
     </ul>
     <div v-for="(variant, index) in variants"
       @mouseover="updateProduct(index)"
       :key="variant.variantId"
     class="color-box" 
     :style="{backgroundColor:variant.variantColor}">
     </div>
     <div class="cart-button">
        <button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton:!inStock}">Add to Cart
        </button>
        <button v-on:click="removeCart">Move out of Cart</button>
     </div>
     <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
            <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating:{{ review.rating }}</p>
                <p>{{ review.review }}</p>
            </li>
        </ul>  
     </div>
     <div>
        <product-review @review-submitted="addReview"></product-review>
     </div>
    </div>                 
   </div>
   `,
    data() {
        return {
            product: 'Socks',
            brand: 'Vue Mastery',
            selectedVariant: 0,
            description: 'A pair of warm, fuzzy socks',
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: 'assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: 'assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 20
                }
            ],
            sizes: ['S', 'M', 'L', 'XL'],
            reviews: []

        }
    },
    methods: {

        updateProduct(index) {
            this.selectedVariant = index;
        },
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeCart() {
            this.$emit('remove-cart', this.variants[this.selectedVariant].variantId);
        },
        addReview(productReview) {
            this.reviews.push(productReview);
            console.log("this.reviews:");
            console.log(this.reviews);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        inventory() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        inStock() {
            return this.inventory > 0 ? true : false;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }

    }

});

Vue.component('product-review', {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
           <li v-for="error in errors">
           {{ error }}     
           </li>
        </ul>
      </p>
   <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name">
   </p>
   <p>
    <label for="review"></label>
    <textarea id="review" v-model="review"></textarea>
   </p>
   <p>
    <label for="rating"></label>
    <select name="rating" id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
    </select>
   </p>
   <p>
    <input type="submit" value="Submit">
   </p>
  </form>`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null;
                this.review = null;
                this.rating = null;
            } else {
                this.errors=[];
                if (!this.name) this.errors.push("Name required");
                if (!this.review) this.errors.push("Review required");
                if (!this.rating) this.errors.push("Rating required");
            }

        }
    }

})

let app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        moveOutOfCart(id) {
            console.log(id);
            if (this.cart.length > 0) {
                this.cart.splice(this.cart.lastIndexOf(id), 1);
            }
        }
    }
});