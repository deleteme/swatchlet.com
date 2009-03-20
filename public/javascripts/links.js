var Links = {
  
  setup: function(){
    this.links = $('links');
    
    this.links.observe('click', function(e){
      if (e.element().readAttribute('href').include('#')) {
        e.element().fire('link:clicked', { href: e.element().readAttribute('href') });
        e.element().blur();
        e.stop();
      }
    });
  }
};
