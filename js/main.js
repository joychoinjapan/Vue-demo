var eventBus = new Vue();

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
        <button v-on:click="removeCart">Remove Cart</button>
     </div>
     <product-tabs :reviews="reviews"></product-tabs>
   
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

    },

    mounted(){
        eventBus.$on('review-submitted',productReview=>{
            this.reviews.push(productReview);
        })
    }

});


Vue.component('product-tabs', {
    props:{
        reviews: {
            type:Array,
            required:true
        }
    },
    template: `
    <div>
        <span class="tab"
            :class="{activeTab:selectedTab===tab}"
            v-for="(tab,index) in tabs" 
            :key="index"
            @click="selectedTab=tab">
            {{tab}}
       </span>
       
            <div v-show="selectedTab==='Reviews'">
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>Name:{{ review.name }}</p>
                        <p>Rating:{{ review.rating }}</p>
                        <p>Review:{{ review.review }}</p>
                        <p>Answer:{{review.answer}}</p>
                    </li>
                </ul>  
            </div>
     <div>
        <product-review v-show="selectedTab==='Make a Review'"></product-review>
     </div>
</div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
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
    <label for="review">Review:</label>
    <textarea id="review" v-model="review"></textarea>
   </p>
   <p>
    <label for="rating">Rating:</label>
    <select name="rating" id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
    </select>
   </p>
   <p>Would you recommend this product?</p>
   <div>
    <input class="radio" type="radio" id="Yes" value="Yes" v-model="answer"><label for="yes">yes</label>
    <input class="radio" type="radio" id="No"  value="No" v-model="answer"><label for="no">No</label>
   </div>
   <p>
    <input type="submit" value="Submit">
   </p>
  </form>`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            answer: '',
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating && this.answer) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    answer: this.answer
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null;
                this.review = null;
                this.rating = null;
                this.answer = '';
            } else {
                this.errors = [];
                if (!this.name) this.errors.push("Name required");
                if (!this.review) this.errors.push("Review required");
                if (!this.rating) this.errors.push("Rating required");
                if (!this.answer) this.errors.push("Answer required");
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