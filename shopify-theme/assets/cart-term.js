if (!window.Neone.loadedScript.has('cart-term.js')) {
  window.Neone.loadedScript.add('cart-term.js');

  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.data('xCartTerm', (message) => ({
        message: message,
        checked: false,
        init() {
          this.checked = localStorage.cart_term_checked == 'agreed' ? true : false;

          this.$watch('checked', () => {
            this.save();
          });

          document.addEventListener('neone:cart:validate', () => {
            this.checked = localStorage.cart_term_checked == 'agreed' ? true : false;
            if (!this.checked) Alpine.store('xCartHelper').validated = false;
          });
        },
        save() {
          clearTimeout(this.t);

          const func = () => {
            var status = this.checked ? 'agreed' : 'not agreed';
            Alpine.store('xCartHelper').updateCart({
              attributes: {
                'Terms and conditions': status
              }
            });
            localStorage.cart_term_checked = status;
          }
          
          this.t = setTimeout(() => {
            func();
          }, 200);
        }
      }));
    })
  });
};