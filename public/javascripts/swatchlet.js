//= require "content"
//= require "links"
//= require "colorpicker"
//= require "color"
var START_HEX = '#000000';

var Swatchlet = Class.create({
  
  initialize: function(){
    document.observe('dom:loaded', this.setup.bind(this));
  },
  
  setup: function(){
    // 'http://swatchlet.com/';
    this.domain = '';
    this.stage = $('stage');
    this.colors = [];
    
    this.startBgColor = START_HEX;
    this.URL = String(window.location);
    
    this.links = Links;
    this.links.setup();
    
    this.content = Content;
    this.content.setup();
    
    this.colorpicker = ColorPicker;
    this.colorpicker.setup();
    
    this.moveMouseDown = document.fire.curry('move:mousedown');
    
    document.observe('link:clicked', function(e){
      if (e.target.match('a[href=#add]')){
        this.addNewColor();
        this.content.closeContent();
        e.target.blur();
        e.stop();
      }
    }.bind(this));
    
    document.observe('color:picked', function(e){
      this.colors.find(function(color){
        if (color.hasColorPicker){
          color.hasColorPicker = false;
          return true;
        }
      }).update(e.memo.hex);
      this.updateURL();
    }.bind(this));
    
    this.addColorsBasedOnURL();
    this.makeSortable();
    this.observeStage();
  },
  
  addColorsBasedOnURL: function(){
    var u = this.URL;
    if (u.include('%2C')) {
      window.location = u.gsub('%2C', ',');
      this.URL = String(window.location);
      var u = this.URL;
    }
    if (stripColors(this.URL)) {
      if (!u.include(',')) {
        this.colors.push(new Color(stripColors(this.URL), 0) || '');
      } else {
        this.colors = stripColors(this.URL).split(',').map(function(c, i){
          return new Color(c, i);
        });
      }
    }
  },
  
  addNewColor: function(){
    this.colors.push(new Color(this.startBgColor, this.colors.length - 1));
    this.colors.last().hasColorPicker = true;
    
    this.colorpicker.show();
    this.updateURL();
    this.makeSortable();
  },
  // unobtrusively monitor the interaction on the stage
  observeStage: function(){
    this.stage
      .observe('click', function(e){
        if (e.target.match('a[href=#Remove]')){
          this.removeColor(e, $$('a[href=#Remove]').indexOf(e.target));
        }
        if (e.target.match('input')){
          e.target.select();
        }
        if (e.target.match('a[href=#Edit]')){
          this.editColor(e, $$('a[href=#Edit]').indexOf(e.target));
        }
        if (e.target.match('a.move')){
          e.stop();
        }
      }.bind(this));
    
    document.observe('color:removed', function(){
      this.updateURL();
      this.stage.focus();
    }.bind(this));
  },
  
  registerMoveHandleObservers: function(){
    this.stage.select('a.move').each(function(a){
      a.stopObserving('mousedown', this.moveMouseDown);
      a.observe('mousedown', this.moveMouseDown);
    }.bind(this));
  },
  
  removeColor: function(e, i){
    this.colors[i].remove();
    this.colors = this.colors.without(this.colors[i]);
    
    e.stop();
  },
  
  editColor: function(e, i){
    this.colors[i].hasColorPicker = true;
    this.colorpicker.show();
    
    $('cp1_Hex').value = this.colors[i].hex.gsub('#', '');
    this.colorpicker.cp1._cvp.setValuesFromHex()
    this.colorpicker.cp1.textValuesChanged();
    
    e.target.blur();
    e.stop();
  },
  
  updateOrderOfColors: function(){
    var colorDivs = $$('.color').map(function(c, i){
      return { element: c, index: i };
    });
    
    this.colors = this.colors.sortBy(function(color){
      return colorDivs.find(function(c, i){
        return (c.element == color.element);
      }).index;
    });
    
    this.updateURL();
    
  },
  
  updateURL: function(){
    window.location = this.domain + '#' + this.colors.pluck('hex').invoke('gsub', '#', '').join(',');
  },
  
  makeSortable: function(){
    this.registerMoveHandleObservers();
    Sortable.create(this.stage, {
      tag: 'div',
      handle: 'move',
      overlap: 'horizontal',
      constraint: 'horizontal',
      onChange: this.updateOrderOfColors.bind(this)
    });
  }
  
});

function stripColors (str) {
  var s = new String(str);
  s = s.substr(s.indexOf('#') + 1, s.length);
  if (str != s){
    return s;
  }
}
