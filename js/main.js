var app = new Vue({
  el:   '#app',
  data: {
    cart: {
      amounts_subtotal: {},
      items_subtotal:   {},
      items_total:      0,
      amounts_total:    0
    },
    products: {
      socks: {
        description:  'I am a pair of socks',
        image: '',
        images: {
          default:  'https://www.dim.com/dw/image/v2/AARR_PRD/on/demandware.static/-/Sites-dim-master/default/dw00b2106a/D025WM2-0HY_01.jpg?sw=600&sh=600&sm=fit',
          one:      'https://cdn.shopify.com/s/files/1/0006/9969/5159/products/sx0131-100-0e79e4134d202f6384a26da843eb96102cb886ab_cb1fefeb-ae08-40b4-99a5-e2689843ccc9_2000x.jpg?v=1591898334',
          two:      'https://m.media-amazon.com/images/I/61Xls0GWrRL._AC_UX679_.jpg'
        },
        stock: 3,
        price: 3.99,
        details: [
          '80% Cotton',
          '20% Polyester',
          'Gender-Neutral'
        ],
        selected_price:       3.99,
        selected_variant_key: 'default'
      },
      boots: {
        description:  'I am a pair of boots',
        price: 79.98,
        image: '',
        images: {
          default:  'https://www.dim.com/dw/image/v2/AARR_PRD/on/demandware.static/-/Sites-dim-master/default/dw00b2106a/D025WM2-0HY_01.jpg?sw=600&sh=600&sm=fit',
          one:      'https://cdn.shopify.com/s/files/1/0006/9969/5159/products/sx0131-100-0e79e4134d202f6384a26da843eb96102cb886ab_cb1fefeb-ae08-40b4-99a5-e2689843ccc9_2000x.jpg?v=1591898334',
          two:      'https://m.media-amazon.com/images/I/61Xls0GWrRL._AC_UX679_.jpg'
        },
        stock: 1,
        selected_price:       79.98,
        selected_variant_key: 'default'
      }
    },
    form_errors: {
      cart_input: {}
    }
  },
  methods: {
    cartIncrement: function ( cart , product_key , product ) {
      this.cartIncrementAmountsSubtotal( cart , product_key , product );
      this.cartIncrementItemsSubtotal( cart , product_key , product );
      this.cartCalcTotal( cart , [ 'items' , 'amounts' ] );
    },
    cartDecrement: function ( cart , product_key , product , variant_key ) {
      this.cartDecrementAmountsSubtotal( cart , product_key , product , variant_key );
      this.cartDecrementItemsSubtotal( cart , product_key , product , variant_key );
      this.cartCalcTotal( cart , [ 'items' , 'amounts' ] );
    },
    cartRemoveProduct: function ( cart , product_key , variant_key ) {
      delete cart.amounts_subtotal[ product_key ];
      delete cart.items_subtotal[ product_key ];
      this.cartCalcTotal( cart , [ 'items' , 'amounts' ] );
    },
    cartRemoveProductVariants: function ( cart , product_key , variant_key ) {
      delete cart.amounts_subtotal[ product_key ][ variant_key ];
      delete cart.items_subtotal[ product_key ][ variant_key ];
      this.cartCalcTotal( cart , [ 'items' , 'amounts' ] );

      if ( 0 === Object.keys( cart.items_subtotal[ product_key ] ).length ) delete cart.items_subtotal[ product_key ];
    },
    cartIncrementAmountsSubtotal: function ( cart , product_key , product ) {
      if ( undefined === cart.amounts_subtotal[ product_key ] )
        cart.amounts_subtotal[ product_key ] = {};

      const variant_key = product.selected_variant_key;
      cart.amounts_subtotal[ product_key ][ variant_key ] ?
        cart.amounts_subtotal[ product_key ][ variant_key ] += this.mathValueDecimal2( product.price ):
        cart.amounts_subtotal[ product_key ][ variant_key ] = this.mathValueDecimal2( product.price );

      const subtotal = cart.amounts_subtotal[ product_key ][ variant_key ];
      cart.amounts_subtotal[ product_key ][ variant_key ] = this.mathValueDecimal2( subtotal );
    },
    cartIncrementItemsSubtotal: function ( cart , product_key, product )  {
      if ( undefined === cart.items_subtotal[ product_key ] )
        cart.items_subtotal[ product_key ] = {};

      const variant_key = product.selected_variant_key;
      cart.items_subtotal[ product_key ][ variant_key ] ?
        cart.items_subtotal[ product_key ][ variant_key ]++ :
        cart.items_subtotal[ product_key ][ variant_key ] = 1;
    },
    cartDecrementAmountsSubtotal: function ( cart , product_key , product , variant_key ) {
      cart.amounts_subtotal[ product_key ][ variant_key ] -= this.mathValueDecimal2( product.price );

      const subtotal = cart.amounts_subtotal[ product_key ][ variant_key ];
      cart.amounts_subtotal[ product_key ][ variant_key ] = this.mathValueDecimal2( subtotal );

      if ( 0 === cart.amounts_subtotal[ product_key ][ variant_key ] )
        delete cart.amounts_subtotal[ product_key ][ variant_key ];
    },
    cartDecrementItemsSubtotal: function ( cart , product_key, product , variant_key )  {
      cart.items_subtotal[ product_key ][ variant_key ]--;

      if ( 0 === cart.items_subtotal[ product_key ][ variant_key ] )
        delete cart.items_subtotal[ product_key ][ variant_key ];
    },
    cartCalcTotal: function ( cart , cart_props ) {
      cart_props.forEach( prop => {
        let total = 0;
        for ( const product_key in cart[ `${prop}_subtotal` ] ) {
          for ( const variant_key in cart[ `${prop}_subtotal` ][ product_key ] ) {
            total += cart[ `${prop}_subtotal` ][ product_key ][ variant_key ];
          }
        }

        cart[ `${prop}_total` ] = this.mathValueDecimal2( total );
      });
    },
    cartProductItemsSubtotal: function ( product , passed_variant_key ) {
      let total = 0;
      for ( const variant_key in product ) {
        if ( passed_variant_key !== variant_key ) total += product[ variant_key ];
      }
      return total;
    },
    mathValueDecimal2: function ( value , persist ) {
      return Number( value.toFixed(2) );
    },
    productVariantSelect: function ( product , variant , variant_key ) {
      if ( product.selected_variant_key !== variant_key ) {
        product.image                 = variant;
        product.selected_variant_key  = variant_key;
        product.selected_price        = product.price;
      }
    },
    productStockEval: function ( cart , product_key , product )  {
      return this.cartProductItemsSubtotal( cart.items_subtotal[ product_key ] ) < product.stock;
    },
    productVariantInputValue: function ( event , product_key , variant_key , product , cart ) {
      if ( '' === event.target.value) return;

      const value         = Number( event.target.value );
      const present_cart  = this.cartProductItemsSubtotal( cart.items_subtotal[ product_key ] , variant_key );
      const validate      = this.formValidateProductStock( ( present_cart + value ) , product.stock , product_key );

      if ( validate ) {
        if (value) {
          cart.amounts_subtotal[product_key][variant_key] = this.mathValueDecimal2(value * product.price);
          cart.items_subtotal[product_key][variant_key] = value;
        } else {
          delete cart.amounts_subtotal[product_key][variant_key];
          delete cart.items_subtotal[product_key][variant_key];
        }

        this.cartCalcTotal(cart, ['items', 'amounts']);
      }

      // this will rerender the component in the client
      // be wary if your intent is to pull data via a route on reload
      // different method should be used if that is intent
      this.$forceUpdate();
    },
    formValidateProductStock: function ( value , stock , product_key ) {
      if ( value > stock ) {
        this.form_errors.cart_input[product_key] = `Product has a stock limit of ${stock}`;
        return false;
      }

      delete this.form_errors.cart_input[product_key];
      return true;
    }
  }
})
