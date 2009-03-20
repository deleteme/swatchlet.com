
var Color = Class.create({
  
  initialize: function(hex, index){
    this.hex = '#' + hex.gsub('#', '');
    this.index = index;
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
