if (!window.Neone.loadedScript.has("product-tabs.js")) {
  window.Neone.loadedScript.add("product-tabs.js");

  requestAnimationFrame(() => {
    document.addEventListener("alpine:init", () => {
      Alpine.data("xProductTabs", () => ({
        open: 0, 
        openMobile: false, 
        tabActive: '',
        setTabActive() {
          const tabActive = this.$el.dataset.tabtitle;
          this.tabActive = tabActive;
        }
      }));
    });
  });
}
