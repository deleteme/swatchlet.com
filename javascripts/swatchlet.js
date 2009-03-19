var START_HEX = '#000000';
var Content = {

  setup: function(){
    this.content = $('content');
    this.hidden = true;
    this.close = $('close').observe('click', this.closeContent.bind(this));
    
    document.observe('link:clicked', function(e){
      if (e.element().match('a[href=#about]')) {
        this.showAbout();
        e.target.blur();
        e.stop();
      }
    }.bind(this));
  },

  closeContent: function(e){
    if (!this._hidden) {
      this.content.morph({
        opacity: '0'
      },{
        duration: .3,
        afterFinish: function(){ this.hidden = true; }.bind(this)
      });
    }
    if (e) e.stop();
  },
  
  showAbout: function(){
    if (!this.hidden) return;
    this.content.appear({
      duration: .3,
      afterFinish: function(){ this.hidden = false; }.bind(this)
    });
  }
  
};


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
    
    // document.observe('color:picked', this.update.bind(this));
  },
  
  close: function(){
    this.cp1.hide();
    this.cp.hide();
  },
  
  show: function(){
    this.cp.setStyle('height: auto; top: 40px;').appear({
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

var Color = Class.create({
  
  initialize: function(hex, index){
    this.hex = '#' + hex.gsub('#', '');
    this.index = index;
    console.log(this.index);
    this.hasColorPicker = false;
    this.html = new Template([
      '<div class="color" style="background-color: #{bgColor}; width: #{width}; display: none;">',
        '<strong>#{bgColor}</strong>',
        '<input type="text" value="#{bgColor}" />',
        '<ul>',
          '<li><a href="#Remove" title="Remove">x</a></li>',
          '<li><a href="#Edit">edit</a></li>',
          '<li><a href="#Move" class="move">move</a></li>',
        '</ul>',
      '</div>'
    ].join(''));
    this.add();
  },
  
  add: function(){
    $('stage').insert(this.html.evaluate({ bgColor: this.hex, width: '0px' }));
    this.acquireElements();
    this.updateWidthsOfColors();
    this.element.appear({ duration: .3, queue: 'end' }); // appear effect should try to be merged in with the morph method
    document.fire('color:added', { hex: this.hex });
  },
  
  acquireElements: function(){
    this.element = $$('.color').last();
    this.input = this.element.down('input');
    this.strong = this.element.down('strong');
  },
  
  remove: function(){
    this.element.fade({ duration: .25, afterFinish: function(){
      this.element.remove();
      document.fire('color:removed', { hex: this.hex });
      this.updateWidthsOfColors();
    }.bind(this)});
  },
  
  update: function(color){
    this.hex = '#' + color;
    this.element.morph({ background: this.hex }, { duration: .3 });
    this.input.value = this.hex;
    this.strong.update(this.hex);
  },
  
  updateWidthsOfColors: function(){
    // TODO: use an internal object, not a DOM element
    var colors = $$('.color');
    colors.each(function(c, i){
      var width = (colors.length == 1) ? '100%' : (1/colors.length * 100) + '%';
      c.morph({ width: width }, { duration: .5 });
    });
  }
  
});


var Swatchlet = Class.create({
  
  initialize: function(){
    document.observe('dom:loaded', this.setup.bind(this));
  },
  
  setup: function(){
    this.domain = '';// 'http://swatchlet.com/';
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
    // if (!u.include('#') || u.endsWith('#')) return;
    if (u.include('%2C')) {
      window.location = u.gsub('%2C', ',');
      this.URL = String(window.location);
      var u = this.URL;
    }
    if (stripColors(this.URL)) {
      if (!u.include(',')) {
        // this.colors.push(stripColors(this.URL) || '');
        this.colors.push(new Color(stripColors(this.URL), 0) || '');
      } else {
        // this.colors = stripColors(this.URL).split(',');
        this.colors = stripColors(this.URL).split(',').map(function(c, i){
          return new Color(c, i);
        });
      }
    }
    // if (u.include('#') && !u.endsWith('#')) {
    //   this.prependOctothorpe();
    //   // this.addColorsToStage();
    // }
  },
  
/*
  prependOctothorpe: function(){
    // this.colors.map(function(c, i){
    //   this.colors[i] = '#' + c;
    // }.bind(this));
    this.colors.each(function(color, i){
      color.hex = '#' + color.hex;
    });
  },
*/
/*
  
  addColorsToStage: function(){
    this.colors.each(function(color, i){
      var width = (1/this.colors.length * 100) + '%';
      this.stage.insert(
        this.color.evaluate({
          bgColor: color,
          width: width
        })
      );
    }.bind(this));
    
    // animate in
    $$('.color').each(function(c, i){
      c.appear({ delay: i/5 });
    });
  },
  
*/
  addNewColor: function(){
    this.colors.push(new Color(this.startBgColor, this.colors.length - 1));
    this.colors.last().hasColorPicker = true;
    // this.stage.insert(
    //   this.color.evaluate({ bgColor: this.startBgColor, width: '0px' })
    // );
    // $$('.color').last().appear({ queue: 'end' });
    // if (this.colors.first() != '')
    //   this.colors.push(this.startBgColor);
    // else if (this.colors.first() == '')
    //   this.colors[0] = this.startBgColor;
    // this.setColorDivs();
    // this.resetWidths();
    this.colorpicker.show();
    this.updateURL();
    this.makeSortable();
  },
  
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
    // .observe('change', function(e){
    //   if (e.target.match('input')){
    //     this.setColor(e.target);
    //   }
    // }.bind(this));
    
    document.observe('color:removed', function(){
      this.updateURL();
      this.stage.focus();
    }.bind(this));
  },
  
  removeColor: function(e, i){
    // this.setColorDivs(e.target.up('.color'));
    this.colors[i].remove();
    this.colors = this.colors.without(this.colors[i]);
    // e.target.up('.color').fade({
    //   duration: .3,
    //   beforeStart: function(){
    //     this.colors[i] = null;
    //     this.colors = this.colors.compact();
    //     this.setColorDivs(e.target.up('.color'));
    //   }.bind(this),
    //   afterFinish: function(){
    //     e.target.up('.color').remove();
    //     this.resetWidths();
    //     this.updateURL();
    //     this.stage.focus();
    //   }.bind(this)
    // });
    // e.target.blur();
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
  
  // updateColorArray: function(){
  //   this.colors = $$('.color').collect(function(c){
  //     return c.down('input').value;
  //   }.bind(this));
  // },
  
  updateOrderOfColors: function(){
    console.log('updateOrderOfColors');
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
  
  // resetWidths: function(){
  //   this.colorDivs.each(function(c, i){
  //     var width = (this.colors.length == 1) ? '100%' : (1/this.colors.length * 100) + '%';
  //     c.setStyle({ width: width });
  //   }.bind(this));
  // },
  
  // setColor: function(input){
  //   input.value = e.memo.hex;
  //   input.up('.color').setStyle({
  //     backgroundColor: input.value
  //   });
  //   this.updateColorArray();
  //   this.updateURL();
  // },
  
  // setColorDivs: function(excludeMe){
  //   this.colorDivs = $$('.color');
  //   if (excludeMe) {
  //     this.colorDivs = this.colorDivs.without(excludeMe);
  //   }
  // },
  
  updateURL: function(){
    window.location = this.domain + '#' + this.colors.pluck('hex').invoke('gsub', '#', '').join(',');
  },
  
  makeSortable: function(){
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

if(window['console'] === undefined)
  window.console = { log: Prototype.emptyFunction };

new Swatchlet();

Event.observe(window, 'unload', Prototype.emptyFunction);

function fireWindowLoaded(){
  document.fire('window:loaded');
};

Event.observe(window, 'load', function(){ fireWindowLoaded.defer(); });

