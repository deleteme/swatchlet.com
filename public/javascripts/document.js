//= require <prototype>
//= require <effects>
//= require <dragdrop>
//= require <ColorPicker>
//= require "swatchlet"

if(window['console'] === undefined)
  window.console = { log: Prototype.emptyFunction };

new Swatchlet();

Event.observe(window, 'unload', Prototype.emptyFunction);

Event.observe(window, 'load', document.fire.curry('window:loaded'));

