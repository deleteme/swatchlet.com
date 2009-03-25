var Content = {

  setup: function(){
    this.content = $('content');
    this.hidden = true;
    this.close = $('close').observe('click', this.closeContent.bind(this));
    
    document.observe('link:clicked', function(e){
      if (e.target.match('a[href=#about]')) {
        this.showAbout();
        e.target.blur();
        e.stop();
      } else {
        this.closeContent();
      }
    }.bind(this));
  },

  closeContent: function(e){
    if (!this._hidden) {
      this.content.morph({
        opacity: '0'
      },{
        duration: .3,
        beforeStart: function(){ this.content.setStyle('visibility: hidden'); }.bind(this),
        afterFinish: function(){ this.hidden = true; }.bind(this)
      });
    }
    if (e) e.stop();
  },
  
  showAbout: function(){
    if (!this.hidden) return;
    this.content.appear({
      duration: .3,
      beforeStart: function(){ this.content.setStyle('visibility: visible'); }.bind(this),
      afterFinish: function(){ this.hidden = false; }.bind(this)
    });
  }
  
};
