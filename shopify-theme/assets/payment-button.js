if (!window.Neone.loadedScript.has('payment-button.js')) {
  window.Neone.loadedScript.add('payment-button.js');

  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.store('xShopifyPaymentBtn', {
        load(e) {
          if (Shopify && Shopify.PaymentButton) {
            Shopify.PaymentButton.init();
          }
        },
      });
    });
  });
}