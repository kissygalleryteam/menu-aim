/**
 * @fileoverview menu-aim.js
 * @author 莫争 <gaoli.gl@taobao.com>
 * @version 1.0
 */

KISSY.add('gallery/menu-aim/1.0/menu-aim', function(S) {

  var $ = S.all;

  var Menu = function(opts) {
    var self = this;

    self.opts  = S.mix(Menu.defs, opts);
    self.$wrap = $(self.opts.wrap);
    self.$menu = $(self.opts.menu);

    self.locs = [];
    self.rNow = null;
    self.tOut = null;

    self.init();
  };

  Menu.defs = {
    wrap     : '',
    menu     : '',
    rows     : '',
    dealy    : 300,
    handler  : null,
    tolerance: 0
  };

  /**
   * getOffset
   */
  Menu.prototype.getOffset = function() {
    var self   = this,
        opts   = self.opts,
        $menu  = self.$menu,
        offset = $menu.offset();

    self.menuOffset = offset;

    self.upperRight = {
        x: offset.left + $menu.outerWidth(),
        y: offset.top - opts.tolerance
    };

    self.lowerRight = {
        x: offset.left + $menu.outerWidth(),
        y: offset.top + $menu.outerHeight() + opts.tolerance
    };
  };

  /**
   * bindEvent
   */
  Menu.prototype.bindEvent = function() {
    var self       = this,
        opts       = self.opts,
        locs       = self.locs,
        rNow       = self.rNow,
        tOut       = self.tOut,
        menuOffset = self.menuOffset,
        upperRight = self.upperRight,
        lowerRight = self.lowerRight;

    var lastDelayLoc = null;

    var activationDelay = function() {
      var loc     = locs[locs.length - 1],
          prevLoc = locs[0];

      if (!rNow || !loc) {
        return 0;
      }

      if (prevLoc.x < menuOffset.left || prevLoc.x > lowerRight.x ||
          prevLoc.y < menuOffset.top  || prevLoc.y > lowerRight.y) {
          return 0;
      }

      if (lastDelayLoc &&
        loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
        return 0;
      }

      function slope(a, b) {
          return (b.y - a.y) / (b.x - a.x);
      };

      var upperSlope     = slope(loc, upperRight),
          lowerSlope     = slope(loc, lowerRight),
          prevUpperSlope = slope(prevLoc, upperRight),
          prevLowerSlope = slope(prevLoc, lowerRight);

      if (upperSlope < prevUpperSlope && lowerSlope > prevLowerSlope) {
        lastDelayLoc = loc;
        return opts.dealy;
      }

      lastDelayLoc = null;
      return 0;
    };

    var activate = function(e) {
      if (rNow != e.currentTarget) {
        opts.handler.enterHandler(e);
        rNow = e.currentTarget;
      }
    };

    var possiblyActivate = function(e) {
      var delay = activationDelay();

      if (delay) {
          tOut = setTimeout(function() {
            possiblyActivate(e);
          }, delay);
      } else {
          activate(e);
      }
    };

    var mousemoveWrap = function(e) {
      locs.push({
        x: e.pageX,
        y: e.pageY
      });

      if (locs.length > 3) {
        locs.shift();
      }
    };

    var mouseleaveWrap = function(e) {
      rNow = null;
      opts.handler.leaveHandler(e);
    };

    var mouseleaveMenu = function() {
      tOut && clearTimeout(tOut);
    };

    var mouseenterRow = function(e) {
      tOut && clearTimeout(tOut);
      possiblyActivate(e);
    };

    self.$wrap.on('mousemove', mousemoveWrap)
              .on('mouseleave', mouseleaveWrap);
    self.$menu.on('mouseleave', mouseleaveMenu)
              .on('mouseenter', opts.rows, mouseenterRow);
  };

  /**
   * init
   */
  Menu.prototype.init = function() {
    this.getOffset();    
    this.bindEvent();
  };

  return Menu;

}, {
  requires: ['node']
});