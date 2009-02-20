var Swatchlet = Class.create({
  initialize: function(){
    document.observe('dom:loaded', this.setup.bind(this));
  },
  setup: function(){
    this.domain = '';// 'http://swatchlet.com/';
    this.stage = $('stage');
    this.colors = $A();
    this.o = .8;
    this.d = .3;
    this.content = $('content').setStyle({ opacity: this.o }).hide();
    this.content._hidden = true;
    this.close = $('close').setStyle({ opacity: this.o });
    this.links = $('links');
    this.toplinks = $('toplinks');
    this.color = new Template(
      ['<div class="color" style="background-color: #{bgColor}; width: #{width}">',
        '<input type="text" value="#{bgColor}" title="Copy or Change This Value" />',
        '<a href="#Remove">Remove</a>',
      '</div>'].join('')
    );
    this.startBgColor = '#ffffff';
    this.URL = String(window.location);
    this.parseURL();
    this.behavior();
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
  },
  behavior: function(){
    this.close.observe('click', this.closeContent.bind(this));
    
    this.links.observe('click', function(e){
      if (e.target.match('a[href=#add]')){
        this.addNewColor();
        this.closeContent();
        e.target.blur();
        e.stop();
      }
    }.bind(this));
    
    this.toplinks.observe('click', function(e){
      if (this.content._hidden) {
        this.content
          .setStyle({ opacity: 0 })
          .show()
          .morph({ opacity: new String(this.o) }, { duration: this.d,
            afterFinish: function(){
              this.content._hidden = false;
            }.bind(this)
          });
      }
      e.target.blur();
      e.stop();
    }.bind(this));
    
    Event.observe(window, 'unload', function(){});
  },
  closeContent: function(e){
    if (!this.content._hidden) {
      this.content.fade({ duration: this.d,
        afterFinish: function(){
          this.content._hidden = true;
        }.bind(this)
      });
    }
    if (e) e.stop();
  },
  addNewColor: function(){
    cl(this.colors);
    this.stage.insert(
      this.color.evaluate({ bgColor: this.startBgColor, width: '0px' })
    );
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
          this.removeColorLink(e);
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
  removeColorLink: function(e){
    e.target.up('.color').fade({
      beforeStart: function(){
        var excludeMe = e.target.up('.color');
        this.colors = this.colors.without(excludeMe.down('input').value);
        this.setColorDivs(excludeMe);
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
      var width = (1/this.colors.length * 100) + '%';
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
  cl(s);
  cl(str);
  if (str != s){
    cl(s);
    return s;
  }
}

function cl (s) {
  console.log(s);
}

if(window['console'] === undefined)
  window.console = { log: Prototype.emptyFunction };

new Swatchlet();