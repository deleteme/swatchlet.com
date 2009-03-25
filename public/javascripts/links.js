var Links = {
  
  setup: function(){
    this.links = $('links');
    
    this.links.observe('click', function(e){
      if ($(e.target).readAttribute('href').include('#')) {
        var el = $(e.target);
        el.fire('link:clicked', { href: el.readAttribute('href') });
        el.blur();
        e.stop();
      }
    });
  }
};
