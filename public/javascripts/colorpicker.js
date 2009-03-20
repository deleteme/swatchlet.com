var ColorPicker = {
  
  setup: function(){
    this.cp = $('colorpicker').setStyle('height: 0; top: 0; opacity: 0; overflow: hidden;');
    document.observe('window:loaded', function() {
      this.cp1 = new Refresh.Web.ColorPicker('cp1', { startHex: START_HEX, startMode:'h' });
      this.cp1.hide();
    }.bind(this));
    
    this.cancelButton = $('cp_cancel');
    this.okButton = $('cp_ok');
    
    // wiring the buttons
    this.cancelButton.observe('click', function(e){
      this.close();
      this.cancelButton.blur();
      e.stop();
    }.bind(this));
    
    this.okButton.observe('click', function(e){
      document.fire('color:picked', { hex: this.cp1._cvp.color.hex });
      this.close();
      e.stop();
    }.bind(this));
    
    document.observe('move:mousedown', this.close.bind(this));
    
  },
  
  close: function(){
    this.cp1.hide();
    this.cp.hide();
  },
  
  show: function(){
    this.cp.setStyle('height: auto; top: 30px;').appear({
      duration: .2,
      afterFinish: function(){
        this.cp1.show();
      }.bind(this)
    });
  },
  
  update: function(e){
    // console.log('updated', e);
  }
  
};
