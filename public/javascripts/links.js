var Links = {
  
  setup: function(){
    this.links = $('links');
    
    this.links.observe('click', function(e){
      if ($(e.target).readAttribute('href').include('#')) {
        $(e.target).fire('link:clicked', { href: $(e.target).readAttribute('href') });
        $(e.target).blur();
        e.stop();
      }
    });
  }
};
