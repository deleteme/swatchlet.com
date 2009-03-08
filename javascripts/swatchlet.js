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
      this.content.fade({
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

var Swatchlet = Class.create({
  
  initialize: function(){
    document.observe('dom:loaded', this.setup.bind(this));
  },
  
  setup: function(){
    this.domain = '';// 'http://swatchlet.com/';
    this.stage = $('stage');
    this.colors = $A();
    
    this.color = new Template(
      ['<div class="color" style="background-color: #{bgColor}; width: #{width}; display: none;">',
        '<input type="text" value="#{bgColor}" title="Copy or Change This Value" />',
        '<ul>',
          '<li><a href="#Color">c</a></li>',
          '<li><a href="#Remove">x</a></li>',
        '</ul>',
      '</div>'].join('')
    );
    this.startBgColor = '#ffffff';
    this.URL = String(window.location);
    
    this.links = Links;
    this.links.setup();
    // cl(this.links);
    
    this.content = Content;
    this.content.setup();
    // cl(this.content);
    
    document.observe('link:clicked', function(e){
      if (e.target.match('a[href=#add]')){
        this.addNewColor();
        this.content.closeContent();
        e.target.blur();
        e.stop();
      }
    }.bind(this));
    
    
    this.parseURL();
  },
  
  parseURL: function(){
    var u = this.URL;
    // if (!u.include('#') || u.endsWith('#')) return;
    if (u.include('%2C')) {
      window.location = u.gsub('%2C', ',');
      this.URL = String(window.location);
      var u = this.URL;
    }
    if (!u.include(',')) {
      this.colors.push(stripColors(this.URL) || '');
    } else {
      this.colors = stripColors(this.URL).split(',');
    }
    if (u.include('#') && !u.endsWith('#')) {
      this.prependOctothorpe();
      this.addColorsToStage();
    }
    this.observeStage();
  },
  
  prependOctothorpe: function(){
    this.colors.map(function(c, i){
      this.colors[i] = '#' + c;
    }.bind(this));
  },
  
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
  
  addNewColor: function(){
    this.stage.insert(
      this.color.evaluate({ bgColor: this.startBgColor, width: '0px' })
    );
    $$('.color').last().appear({ queue: 'end' });
    if (this.colors.first() != '')
      this.colors.push(this.startBgColor);
    else if (this.colors.first() == '')
      this.colors[0] = this.startBgColor;
    this.setColorDivs();
    this.resetWidths();
    this.refresh();
  },
  
  observeStage: function(){
    this.stage
      .observe('click', function(e){
        if (e.target.match('a[href=#Remove]')){
          this.removeColorLink(e, $$('a[href=#Remove]').indexOf(e.target));
        }
        if (e.target.match('input')){
          e.target.select();
        }
      }.bind(this))
    .observe('change', function(e){
      if (e.target.match('input')){
        e.target.up('.color').setStyle({
          backgroundColor: e.target.value
        });
        this.updateColorArray();
        this.refresh();
      }
    }.bind(this));
  },
  
  removeColorLink: function(e, i){
    e.target.up('.color').fade({
      duration: .3,
      beforeStart: function(){
        this.colors[i] = null;
        this.colors = this.colors.compact();
        this.setColorDivs(e.target.up('.color'));
      }.bind(this),
      afterFinish: function(){
        e.target.up('.color').remove();
        this.resetWidths();
        this.refresh();
        this.stage.focus();
      }.bind(this)
    });
    e.target.blur();
    e.stop();
  },
  
  updateColorArray: function(){
    this.colors = $$('.color').collect(function(c){
      return c.down('input').value;
    }.bind(this));
  },
  
  resetWidths: function(){
    this.colorDivs.each(function(c, i){
      var width = (this.colors.length == 1) ? '100%' : (1/this.colors.length * 100) + '%';
      c.setStyle({ width: width });
    }.bind(this));
  },
  
  setColorDivs: function(excludeMe){
    this.colorDivs = $$('.color');
    if (excludeMe) {
      this.colorDivs = this.colorDivs.without(excludeMe);
    }
  },
  
  refresh: function(){
    window.location = this.domain + '#' + this.colors.collect(function(s) {
      return s.gsub('#', '');
    }).join(',');
  }
  
});

function stripColors (str) {
  var s = new String(str);
  s = s.substr(s.indexOf('#') + 1, s.length);
  if (str != s){
    return s;
  }
}

function cl (s) {
  console.log(s);
}

if(window['console'] === undefined)
  window.console = { log: Prototype.emptyFunction };

new Swatchlet();

Event.observe(window, 'unload', Prototype.emptyFunction);

function fireWindowLoaded(){
  document.fire('window:loaded');
};

Event.observe(window, 'load', function(){ fireWindowLoaded.defer(); });


document.observe('window:loaded',function() {
  cp1 = new Refresh.Web.ColorPicker('cp1', { startHex: 'ff0000', startMode:'s' });
});