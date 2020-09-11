/**
 * File typography.js
 *
 * Handles Typography of the site
 *
 * @package Astra
 */

( function( $ ) {

	/* Internal shorthand */
	var api = wp.customize;

	/**
	 * Helper class for the main Customizer interface.
	 *
	 * @since 1.0.0
	 * @class AstTypography
	 */
	AstTypography = {

		/**
		 * Initializes our custom logic for the Customizer.
		 *
		 * @since 1.0.0
		 * @method init
		 */
		init: function() {
			AstTypography._initFonts();
		},

		/**
		 * Initializes logic for font controls.
		 *
		 * @since 1.0.0
		 * @access private
		 * @method _initFonts
		 */
		_initFonts: function()
		{
			$( '.customize-control-ast-font-family select' ).each( function(e) {

				if( 'undefined' != typeof astra.customizer ) {
					var fonts = astra.customizer.settings.google_fonts;
					var optionName = $(this).data('name');

					$(this).html( fonts );

					// Set inherit option text defined in control parameters.
					$("select[data-name='" + optionName + "'] option[value='inherit']").text( $(this).data('inherit') );

					var font_val = $(this).data('value');

					$(this).val( font_val );
				}
			});

			$( '.customize-control-ast-font-family select' ).each( AstTypography._initFont );
			// Added select2 for all font family & font variant.
			$('.customize-control-ast-font-family select, .customize-control-ast-font-variant select').selectWoo();

			$('.customize-control-ast-font-variant select').on('select2:unselecting', function (e) {
				var variantSelect = $(this).data( 'customize-setting-link' ),
				    unselectedValue = e.params.args.data.id || '';

				if ( unselectedValue ) {
					$(this).find('option[value="' + e.params.args.data.id + '"]').removeAttr('selected');
					if ( null === $(this).val() ) {
						api( variantSelect ).set( '' );
					}
				}
			});
		},

		/**
		 * Initializes logic for a single font control.
		 *
		 * @since 1.0.0
		 * @access private
		 * @method _initFont
		 */
		_initFont: function()
		{
			var select  = $( this ),
			link    = select.data( 'customize-setting-link' ),
			weight  = select.data( 'connected-control' ),
			variant  = select.data( 'connected-variant' );

			if ( 'undefined' != typeof weight ) {
				api( link ).bind( AstTypography._fontSelectChange );
				AstTypography._setFontWeightOptions.apply( api( link ), [ true ] );
			}

			if ( 'undefined' != typeof variant ) {
				api( link ).bind( AstTypography._fontSelectChange );
				AstTypography._setFontVarianttOptions.apply( api( link ), [ true ] );
			}
		},

		/**
		 * Callback for when a font control changes.
		 *
		 * @since 1.0.0
		 * @access private
		 * @method _fontSelectChange
		 */
		_fontSelectChange: function()
		{
			var fontSelect          = api.control( this.id ).container.find( 'select' ),
			variants            	= fontSelect.data( 'connected-variant' );

			AstTypography._setFontWeightOptions.apply( this, [ false ] );
			
			if ( 'undefined' != typeof variants ) {
				AstTypography._setFontVarianttOptions.apply( this, [ false ] );
			}
		},

		/**
		 * Clean font name.
		 *
		 * Google Fonts are saved as {'Font Name', Category}. This function cleanes this up to retreive only the {Font Name}.
		 *
		 * @since  1.3.0
		 * @param  {String} fontValue Name of the font.
		 * 
		 * @return {String}  Font name where commas and inverted commas are removed if the font is a Google Font.
		 */
		_cleanGoogleFonts: function(fontValue)
		{
			// Bail if fontVAlue does not contain a comma.
			if ( ! fontValue.includes(',') ) return fontValue;

			var splitFont 	= fontValue.split(',');
			var pattern 	= new RegExp("'", 'gi');

			// Check if the cleaned font exists in the Google fonts array.
			var googleFontValue = splitFont[0].replace(pattern, '');
			if ( 'undefined' != typeof AstFontFamilies.google[ googleFontValue ] ) {
				fontValue = googleFontValue;
			}

			return fontValue;
		},

		/**
		 * Get font Weights.
		 *
		 * This function gets the font weights values respective to the selected fonts family{Font Name}.
		 *
		 * @since  1.5.2
		 * @param  {String} fontValue Name of the font.
		 * 
		 * @return {String}  Available font weights for the selected fonts.
		 */
		_getWeightObject: function(fontValue)
		{
			var weightObject        = [ '400', '600' ];
			if ( fontValue == 'inherit' ) {
				weightObject = [ '100','200','300','400','500','600','700','800','900' ];
			} else if ( 'undefined' != typeof AstFontFamilies.system[ fontValue ] ) {
				weightObject = AstFontFamilies.system[ fontValue ].weights;
			} else if ( 'undefined' != typeof AstFontFamilies.google[ fontValue ] ) {
				weightObject = AstFontFamilies.google[ fontValue ][0];
				weightObject = Object.keys(weightObject).map(function(k) {
				  return weightObject[k];
				});
			} else if ( 'undefined' != typeof AstFontFamilies.custom[ fontValue ] ) {
				weightObject = AstFontFamilies.custom[ fontValue ].weights;
			}

			return weightObject;
		},

		/**
		 * Sets the options for a font weight control when a
		 * font family control changes.
		 *
		 * @since 1.0.0
		 * @access private
		 * @method _setFontWeightOptions
		 * @param {Boolean} init Whether or not we're initializing this font weight control.
		 */
		_setFontWeightOptions: function( init )
		{
			var i               = 0,
			fontSelect          = api.control( this.id ).container.find( 'select' ),
			fontValue           = this(),
			selected            = '',
			weightKey           = fontSelect.data( 'connected-control' ),
			inherit             = fontSelect.data( 'inherit' ),
			weightSelect        = api.control( weightKey ).container.find( 'select' ),
			currentWeightTitle  = weightSelect.data( 'inherit' ),
			weightValue         = init ? weightSelect.val() : '400',
			inheritWeightObject = [ 'inherit' ],
			weightObject        = [ '400', '600' ],
			weightOptions       = '',
			weightMap           = astraTypo;
			if ( fontValue == 'inherit' ) {
				weightValue     = init ? weightSelect.val() : 'inherit';
			}

			var fontValue = AstTypography._cleanGoogleFonts(fontValue);
			var weightObject = AstTypography._getWeightObject( fontValue );

			weightObject = $.merge( inheritWeightObject, weightObject )
			weightMap[ 'inherit' ] = currentWeightTitle;
			for ( ; i < weightObject.length; i++ ) {

				if ( 0 === i && -1 === $.inArray( weightValue, weightObject ) ) {
					weightValue = weightObject[ 0 ];
					selected 	= ' selected="selected"';
				} else {
					selected = weightObject[ i ] == weightValue ? ' selected="selected"' : '';
				}
				if( ! weightObject[ i ].includes( "italic" ) ){
					weightOptions += '<option value="' + weightObject[ i ] + '"' + selected + '>' + weightMap[ weightObject[ i ] ] + '</option>';
				}
			}

			weightSelect.html( weightOptions );

			if ( ! init ) {
				api( weightKey ).set( '' );
				api( weightKey ).set( weightValue );
			}
		},
		/**
		 * Sets the options for a font variant control when a
		 * font family control changes.
		 *
		 * @since 1.5.2
		 * @access private
		 * @method _setFontVarianttOptions
		 * @param {Boolean} init Whether or not we're initializing this font variant control.
		 */
		_setFontVarianttOptions: function( init )
		{
				var i               = 0,
				fontSelect          = api.control( this.id ).container.find( 'select' ),
				fontValue           = this(),
				selected            = '',
				variants            = fontSelect.data( 'connected-variant' ),
				inherit             = fontSelect.data( 'inherit' ),
				variantSelect       = api.control( variants ).container.find( 'select' ),
				variantSavedField   = api.control( variants ).container.find( '.ast-font-variant-hidden-value' ),
				weightValue        = '',
				weightOptions       = '',
				currentWeightTitle  = variantSelect.data( 'inherit' ),
				weightMap           = astraTypo;

				var variantArray = variantSavedField.val().split(',');

				// Hide font variant for any ohter fonts then Google
				var selectedOptionGroup = fontSelect.find('option[value="' + fontSelect.val() + '"]').closest('optgroup').attr('label') || '';
				if ( 'Google' == selectedOptionGroup ) {
					variantSelect.parent().removeClass('ast-hide');
				} else{
					variantSelect.parent().addClass('ast-hide');
				}

				var fontValue = AstTypography._cleanGoogleFonts(fontValue);
				var weightObject = AstTypography._getWeightObject( fontValue );

				weightMap[ 'inherit' ] = currentWeightTitle;
				
				for ( var i = 0; i < weightObject.length; i++ ) {
					for ( var e = 0; e < variantArray.length; e++ ) {
						if ( weightObject[i] === variantArray[e] ) {
							weightValue = weightObject[ i ];
							selected 	= ' selected="selected"';
						} else{
							selected = ( weightObject[ i ] == weightValue ) ? ' selected="selected"' : '';
						}
					}
					weightOptions += '<option value="' + weightObject[ i ] + '"' + selected + '>' + weightMap[ weightObject[ i ] ] + '</option>';
				}

				variantSelect.html( weightOptions );
				if ( ! init ) {
					api( variants ).set( '' );
				}
		},
	};

	$( function() { AstTypography.init(); } );

})( jQuery );

/*!
 * SelectWoo 1.0.1
 * https://github.com/woocommerce/selectWoo
 *
 * Released under the MIT license
 * https://github.com/woocommerce/selectWoo/blob/master/LICENSE.md
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function (root, jQuery) {
      if (jQuery === undefined) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if (typeof window !== 'undefined') {
          jQuery = require('jquery');
        }
        else {
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
} (function (jQuery) {
  // This is needed so we can catch the AMD loader configuration and use it
  // The inner file should be wrapped (by `banner.start.js`) in a function that
  // returns the AMD loader references.
  var S2 =(function () {
  // Restore the Select2 AMD loader so it can be used
  // Needed mostly in the language files, where the loader is not inserted
  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
    var S2 = jQuery.fn.select2.amd;
  }
var S2;(function () { if (!S2 || !S2.requirejs) {
if (!S2) { S2 = {}; } else { require = S2; }
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

S2.requirejs = requirejs;S2.require = require;S2.define = define;
}
}());
S2.define("almond", function(){});

/* global jQuery:false, $:false */
S2.define('jquery',[],function () {
  var _$ = jQuery || $;

  if (_$ == null && console && console.error) {
    console.error(
      'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
      'found. Make sure that you are including jQuery before Select2 on your ' +
      'web page.'
    );
  }

  return _$;
});

S2.define('select2/utils',[
  'jquery'
], function ($) {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty;

    function BaseConstructor () {
      this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
      if (__hasProp.call(SuperClass, key)) {
        ChildClass[key] = SuperClass[key];
      }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  function getMethods (theClass) {
    var proto = theClass.prototype;

    var methods = [];

    for (var methodName in proto) {
      var m = proto[methodName];

      if (typeof m !== 'function') {
        continue;
      }

      if (methodName === 'constructor') {
        continue;
      }

      methods.push(methodName);
    }

    return methods;
  }

  Utils.Decorate = function (SuperClass, DecoratorClass) {
    var decoratedMethods = getMethods(DecoratorClass);
    var superMethods = getMethods(SuperClass);

    function DecoratedClass () {
      var unshift = Array.prototype.unshift;

      var argCount = DecoratorClass.prototype.constructor.length;

      var calledConstructor = SuperClass.prototype.constructor;

      if (argCount > 0) {
        unshift.call(arguments, SuperClass.prototype.constructor);

        calledConstructor = DecoratorClass.prototype.constructor;
      }

      calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function ctr () {
      this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new ctr();

    for (var m = 0; m < superMethods.length; m++) {
        var superMethod = superMethods[m];

        DecoratedClass.prototype[superMethod] =
          SuperClass.prototype[superMethod];
    }

    var calledMethod = function (methodName) {
      // Stub out the original method if it's not decorating an actual method
      var originalMethod = function () {};

      if (methodName in DecoratedClass.prototype) {
        originalMethod = DecoratedClass.prototype[methodName];
      }

      var decoratedMethod = DecoratorClass.prototype[methodName];

      return function () {
        var unshift = Array.prototype.unshift;

        unshift.call(arguments, originalMethod);

        return decoratedMethod.apply(this, arguments);
      };
    };

    for (var d = 0; d < decoratedMethods.length; d++) {
      var decoratedMethod = decoratedMethods[d];

      DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
  };

  var Observable = function () {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    var slice = Array.prototype.slice;
    var params = slice.call(arguments, 1);

    this.listeners = this.listeners || {};

    // Params should always come in as an array
    if (params == null) {
      params = [];
    }

    // If there are no arguments to the event, use a temporary object
    if (params.length === 0) {
      params.push({});
    }

    // Set the `_type` of the first object to the event
    params[0]._type = event;

    if (event in this.listeners) {
      this.invoke(this.listeners[event], slice.call(arguments, 1));
    }

    if ('*' in this.listeners) {
      this.invoke(this.listeners['*'], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  Utils.generateChars = function (length) {
    var chars = '';

    for (var i = 0; i < length; i++) {
      var randomChar = Math.floor(Math.random() * 36);
      chars += randomChar.toString(36);
    }

    return chars;
  };

  Utils.bind = function (func, context) {
    return function () {
      func.apply(context, arguments);
    };
  };

  Utils._convertData = function (data) {
    for (var originalKey in data) {
      var keys = originalKey.split('-');

      var dataLevel = data;

      if (keys.length === 1) {
        continue;
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];

        // Lowercase the first letter
        // By default, dash-separated becomes camelCase
        key = key.substring(0, 1).toLowerCase() + key.substring(1);

        if (!(key in dataLevel)) {
          dataLevel[key] = {};
        }

        if (k == keys.length - 1) {
          dataLevel[key] = data[originalKey];
        }

        dataLevel = dataLevel[key];
      }

      delete data[originalKey];
    }

    return data;
  };

  Utils.hasScroll = function (index, el) {
    // Adapted from the function created by @ShadowScripter
    // and adapted by @BillBarry on the Stack Exchange Code Review website.
    // The original code can be found at
    // http://codereview.stackexchange.com/q/13338
    // and was designed to be used with the Sizzle selector engine.

    var $el = $(el);
    var overflowX = el.style.overflowX;
    var overflowY = el.style.overflowY;

    //Check both x and y declarations
    if (overflowX === overflowY &&
        (overflowY === 'hidden' || overflowY === 'visible')) {
      return false;
    }

    if (overflowX === 'scroll' || overflowY === 'scroll') {
      return true;
    }

    return ($el.innerHeight() < el.scrollHeight ||
      $el.innerWidth() < el.scrollWidth);
  };

  Utils.escapeMarkup = function (markup) {
    var replaceMap = {
      '\\': '&#92;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
      '/': '&#47;'
    };

    // Do not try to escape the markup if it's not a string
    if (typeof markup !== 'string') {
      return markup;
    }

    return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
      return replaceMap[match];
    });
  };

  Utils.entityDecode = function(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Append an array of jQuery nodes to a given element.
  Utils.appendMany = function ($element, $nodes) {
    // jQuery 1.7.x does not support $.fn.append() with an array
    // Fall back to a jQuery object collection using $.fn.add()
    if ($.fn.jquery.substr(0, 3) === '1.7') {
      var $jqNodes = $();

      $.map($nodes, function (node) {
        $jqNodes = $jqNodes.add(node);
      });

      $nodes = $jqNodes;
    }

    $element.append($nodes);
  };

  // Determine whether the browser is on a touchscreen device.
  Utils.isTouchscreen = function() {
    if ('undefined' === typeof Utils._isTouchscreenCache) {
      Utils._isTouchscreenCache = 'ontouchstart' in document.documentElement;
    }
    return Utils._isTouchscreenCache;
  }

  return Utils;
});

S2.define('select2/results',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Results ($element, options, dataAdapter) {
    this.$element = $element;
    this.data = dataAdapter;
    this.options = options;

    Results.__super__.constructor.call(this);
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
      '<ul class="select2-results__options" role="listbox" tabindex="-1"></ul>'
    );

    if (this.options.get('multiple')) {
      $results.attr('aria-multiselectable', 'true');
    }

    this.$results = $results;

    return $results;
  };

  Results.prototype.clear = function () {
    this.$results.empty();
  };

  Results.prototype.displayMessage = function (params) {
    var escapeMarkup = this.options.get('escapeMarkup');

    this.clear();
    this.hideLoading();

    var $message = $(
      '<li role="alert" aria-live="assertive"' +
      ' class="select2-results__option"></li>'
    );

    var message = this.options.get('translations').get(params.message);

    $message.append(
      escapeMarkup(
        message(params.args)
      )
    );

    $message[0].className += ' select2-results__message';

    this.$results.append($message);
  };

  Results.prototype.hideMessages = function () {
    this.$results.find('.select2-results__message').remove();
  };

  Results.prototype.append = function (data) {
    this.hideLoading();

    var $options = [];

    if (data.results == null || data.results.length === 0) {
      if (this.$results.children().length === 0) {
        this.trigger('results:message', {
          message: 'noResults'
        });
      }

      return;
    }

    data.results = this.sort(data.results);

    for (var d = 0; d < data.results.length; d++) {
      var item = data.results[d];

      var $option = this.option(item);

      $options.push($option);
    }

    this.$results.append($options);
  };

  Results.prototype.position = function ($results, $dropdown) {
    var $resultsContainer = $dropdown.find('.select2-results');
    $resultsContainer.append($results);
  };

  Results.prototype.sort = function (data) {
    var sorter = this.options.get('sorter');

    return sorter(data);
  };

  Results.prototype.highlightFirstItem = function () {
    var $options = this.$results
      .find('.select2-results__option[data-selected]');

    var $selected = $options.filter('[data-selected=true]');

    // Check if there are any selected options
    if ($selected.length > 0) {
      // If there are selected options, highlight the first
      $selected.first().trigger('mouseenter');
    } else {
      // If there are no selected options, highlight the first option
      // in the dropdown
      $options.first().trigger('mouseenter');
    }

    this.ensureHighlightVisible();
  };

  Results.prototype.setClasses = function () {
    var self = this;

    this.data.current(function (selected) {
      var selectedIds = $.map(selected, function (s) {
        return s.id.toString();
      });

      var $options = self.$results
        .find('.select2-results__option[data-selected]');

      $options.each(function () {
        var $option = $(this);

        var item = $.data(this, 'data');

        // id needs to be converted to a string when comparing
        var id = '' + item.id;

        if ((item.element != null && item.element.selected) ||
            (item.element == null && $.inArray(id, selectedIds) > -1)) {
          $option.attr('data-selected', 'true');
        } else {
          $option.attr('data-selected', 'false');
        }
      });

    });
  };

  Results.prototype.showLoading = function (params) {
    this.hideLoading();

    var loadingMore = this.options.get('translations').get('searching');

    var loading = {
      disabled: true,
      loading: true,
      text: loadingMore(params)
    };
    var $loading = this.option(loading);
    $loading.className += ' loading-results';

    this.$results.prepend($loading);
  };

  Results.prototype.hideLoading = function () {
    this.$results.find('.loading-results').remove();
  };

  Results.prototype.option = function (data) {
    var option = document.createElement('li');
    option.className = 'select2-results__option';

    var attrs = {
      'role': 'option',
      'data-selected': 'false',
      'tabindex': -1
    };

    if (data.disabled) {
      delete attrs['data-selected'];
      attrs['aria-disabled'] = 'true';
    }

    if (data.id == null) {
      delete attrs['data-selected'];
    }

    if (data._resultId != null) {
      option.id = data._resultId;
    }

    if (data.title) {
      option.title = data.title;
    }

    if (data.children) {
      attrs['aria-label'] = data.text;
      delete attrs['data-selected'];
    }

    for (var attr in attrs) {
      var val = attrs[attr];

      option.setAttribute(attr, val);
    }

    if (data.children) {
      var $option = $(option);

      var label = document.createElement('strong');
      label.className = 'select2-results__group';

      var $label = $(label);
      this.template(data, label);
      $label.attr('role', 'presentation');

      var $children = [];

      for (var c = 0; c < data.children.length; c++) {
        var child = data.children[c];

        var $child = this.option(child);

        $children.push($child);
      }

      var $childrenContainer = $('<ul></ul>', {
        'class': 'select2-results__options select2-results__options--nested',
        'role': 'listbox'
      });
      $childrenContainer.append($children);
      $option.attr('role', 'list');

      $option.append(label);
      $option.append($childrenContainer);
    } else {
      this.template(data, option);
    }

    $.data(option, 'data', data);

    return option;
  };

  Results.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-results';

    this.$results.attr('id', id);

    container.on('results:all', function (params) {
      self.clear();
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
        self.highlightFirstItem();
      }
    });

    container.on('results:append', function (params) {
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
      }
    });

    container.on('query', function (params) {
      self.hideMessages();
      self.showLoading(params);
    });

    container.on('select', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();
      self.highlightFirstItem();
    });

    container.on('unselect', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();
      self.highlightFirstItem();
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expended="true"
      self.$results.attr('aria-expanded', 'true');
      self.$results.attr('aria-hidden', 'false');

      self.setClasses();
      self.ensureHighlightVisible();
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expended="false"
      self.$results.attr('aria-expanded', 'false');
      self.$results.attr('aria-hidden', 'true');
      self.$results.removeAttr('aria-activedescendant');
    });

    container.on('results:toggle', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      $highlighted.trigger('mouseup');
    });

    container.on('results:select', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      var data = $highlighted.data('data');

      if ($highlighted.attr('data-selected') == 'true') {
        self.trigger('close', {});
      } else {
        self.trigger('select', {
          data: data
        });
      }
    });

    container.on('results:previous', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[data-selected]');

      var currentIndex = $options.index($highlighted);

      // If we are already at te top, don't move further
      if (currentIndex === 0) {
        return;
      }

      var nextIndex = currentIndex - 1;

      // If none are highlighted, highlight the first
      if ($highlighted.length === 0) {
        nextIndex = 0;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top;
      var nextTop = $next.offset().top;
      var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextTop - currentOffset < 0) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:next', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[data-selected]');

      var currentIndex = $options.index($highlighted);

      var nextIndex = currentIndex + 1;

      // If we are at the last option, stay there
      if (nextIndex >= $options.length) {
        return;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var nextBottom = $next.offset().top + $next.outerHeight(false);
      var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextBottom > currentOffset) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:focus', function (params) {
      params.element.addClass('select2-results__option--highlighted').attr('aria-selected', 'true');
      self.$results.attr('aria-activedescendant', params.element.attr('id'));
    });

    container.on('results:message', function (params) {
      self.displayMessage(params);
    });

    if ($.fn.mousewheel) {
      this.$results.on('mousewheel', function (e) {
        var top = self.$results.scrollTop();

        var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

        var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
        var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

        if (isAtTop) {
          self.$results.scrollTop(0);

          e.preventDefault();
          e.stopPropagation();
        } else if (isAtBottom) {
          self.$results.scrollTop(
            self.$results.get(0).scrollHeight - self.$results.height()
          );

          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    this.$results.on('mouseup', '.select2-results__option[data-selected]',
      function (evt) {
      var $this = $(this);

      var data = $this.data('data');

      if ($this.attr('data-selected') === 'true') {
        if (self.options.get('multiple')) {
          self.trigger('unselect', {
            originalEvent: evt,
            data: data
          });
        } else {
          self.trigger('close', {});
        }

        return;
      }

      self.trigger('select', {
        originalEvent: evt,
        data: data
      });
    });

    this.$results.on('mouseenter', '.select2-results__option[data-selected]',
      function (evt) {
      var data = $(this).data('data');

      self.getHighlightedResults()
          .removeClass('select2-results__option--highlighted')
          .attr('aria-selected', 'false');

      self.trigger('results:focus', {
        data: data,
        element: $(this)
      });
    });
  };

  Results.prototype.getHighlightedResults = function () {
    var $highlighted = this.$results
    .find('.select2-results__option--highlighted');

    return $highlighted;
  };

  Results.prototype.destroy = function () {
    this.$results.remove();
  };

  Results.prototype.ensureHighlightVisible = function () {
    var $highlighted = this.getHighlightedResults();

    if ($highlighted.length === 0) {
      return;
    }

    var $options = this.$results.find('[data-selected]');

    var currentIndex = $options.index($highlighted);

    var currentOffset = this.$results.offset().top;
    var nextTop = $highlighted.offset().top;
    var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

    var offsetDelta = nextTop - currentOffset;
    nextOffset -= $highlighted.outerHeight(false) * 2;

    if (currentIndex <= 2) {
      this.$results.scrollTop(0);
    } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
      this.$results.scrollTop(nextOffset);
    }
  };

  Results.prototype.template = function (result, container) {
    var template = this.options.get('templateResult');
    var escapeMarkup = this.options.get('escapeMarkup');

    var content = template(result, container);

    if (content == null) {
      container.style.display = 'none';
    } else if (typeof content === 'string') {
      container.innerHTML = escapeMarkup(content);
    } else {
      $(container).append(content);
    }
  };

  return Results;
});

S2.define('select2/keys',[

], function () {
  var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
  };

  return KEYS;
});

S2.define('select2/selection/base',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function BaseSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    var $selection = $(
      '<span class="select2-selection" ' +
      ' aria-haspopup="true" aria-expanded="false">' +
      '</span>'
    );

    this._tabindex = 0;

    if (this.$element.data('old-tabindex') != null) {
      this._tabindex = this.$element.data('old-tabindex');
    } else if (this.$element.attr('tabindex') != null) {
      this._tabindex = this.$element.attr('tabindex');
    }

    $selection.attr('title', this.$element.attr('title'));
    $selection.attr('tabindex', this._tabindex);

    this.$selection = $selection;

    return $selection;
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-container';
    var resultsId = container.id + '-results';
    var searchHidden = this.options.get('minimumResultsForSearch') === Infinity;

    this.container = container;

    this.$selection.on('focus', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('blur', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      if (evt.which === KEYS.SPACE) {
        evt.preventDefault();
      }
    });

    container.on('results:focus', function (params) {
      self.$selection.attr('aria-activedescendant', params.data._resultId);
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expanded="true"
      self.$selection.attr('aria-expanded', 'true');
      self.$selection.attr('aria-owns', resultsId);

      self._attachCloseHandler(container);
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expanded="false"
      self.$selection.attr('aria-expanded', 'false');
      self.$selection.removeAttr('aria-activedescendant');
      self.$selection.removeAttr('aria-owns');

      // This needs to be delayed as the active element is the body when the
      // key is pressed.
      window.setTimeout(function () {
        self.$selection.focus();
      }, 1);

      self._detachCloseHandler(container);
    });

    container.on('enable', function () {
      self.$selection.attr('tabindex', self._tabindex);
    });

    container.on('disable', function () {
      self.$selection.attr('tabindex', '-1');
    });
  };

  BaseSelection.prototype._handleBlur = function (evt) {
    var self = this;

    // This needs to be delayed as the active element is the body when the tab
    // key is pressed, possibly along with others.
    window.setTimeout(function () {
      // Don't trigger `blur` if the focus is still in the selection
      if (
        (document.activeElement == self.$selection[0]) ||
        ($.contains(self.$selection[0], document.activeElement))
      ) {
        return;
      }

      self.trigger('blur', evt);
    }, 1);
  };

  BaseSelection.prototype._attachCloseHandler = function (container) {
    var self = this;

    $(document.body).on('mousedown.select2.' + container.id, function (e) {
      var $target = $(e.target);

      var $select = $target.closest('.select2');

      var $all = $('.select2.select2-container--open');

      $all.each(function () {
        var $this = $(this);

        if (this == $select[0]) {
          return;
        }

        var $element = $this.data('element');
        $element.select2('close');

        // Remove any focus when dropdown is closed by clicking outside the select area.
        // Timeout of 1 required for close to finish wrapping up.
        setTimeout(function(){
         $this.find('*:focus').blur();
         $target.focus();
        }, 1);
      });
    });
  };

  BaseSelection.prototype._detachCloseHandler = function (container) {
    $(document.body).off('mousedown.select2.' + container.id);
  };

  BaseSelection.prototype.position = function ($selection, $container) {
    var $selectionContainer = $container.find('.selection');
    $selectionContainer.append($selection);
  };

  BaseSelection.prototype.destroy = function () {
    this._detachCloseHandler(this.container);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  return BaseSelection;
});

S2.define('select2/selection/single',[
  'jquery',
  './base',
  '../utils',
  '../keys'
], function ($, BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = SingleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--single');

    $selection.html(
      '<span class="select2-selection__rendered"></span>' +
      '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
      '</span>'
    );

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';

    this.$selection.find('.select2-selection__rendered')
      .attr('id', id)
      .attr('role', 'textbox')
      .attr('aria-readonly', 'true');
    this.$selection.attr('aria-labelledby', id);

    // This makes single non-search selects work in screen readers. If it causes problems elsewhere, remove.
    this.$selection.attr('role', 'combobox');

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('focus', function (evt) {
      // User focuses on the container
    });

    this.$selection.on('keydown', function (evt) {
      // If user starts typing an alphanumeric key on the keyboard, open if not opened.
      if (!container.isOpen() && evt.which >= 48 && evt.which <= 90) {
        container.open();
      }
    });

    this.$selection.on('blur', function (evt) {
      // User exits the container
    });

    container.on('focus', function (evt) {
      if (!container.isOpen()) {
        self.$selection.focus();
      }
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });
  };

  SingleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  SingleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var $rendered = this.$selection.find('.select2-selection__rendered');
    var formatted = Utils.entityDecode(this.display(selection, $rendered));

    $rendered.empty().text(formatted);
    $rendered.prop('title', selection.title || selection.text);
  };

  return SingleSelection;
});

S2.define('select2/selection/multiple',[
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--multiple');

    $selection.html(
      '<ul class="select2-selection__rendered" aria-live="polite" aria-relevant="additions removals" aria-atomic="true"></ul>'
    );

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on(
      'click',
      '.select2-selection__choice__remove',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.options.get('disabled')) {
          return;
        }

        var $remove = $(this);
        var $selection = $remove.parent();

        var data = $selection.data('data');

        self.trigger('unselect', {
          originalEvent: evt,
          data: data
        });
      }
    );

    this.$selection.on('keydown', function (evt) {
      // If user starts typing an alphanumeric key on the keyboard, open if not opened.
      if (!container.isOpen() && evt.which >= 48 && evt.which <= 90) {
        container.open();
      }
    });

    // Focus on the search field when the container is focused instead of the main container.
    container.on( 'focus', function(){
      self.focusOnSearch();
    });
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  MultipleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<span class="select2-selection__choice__remove" role="presentation" aria-hidden="true">' +
          '&times;' +
        '</span>' +
      '</li>'
    );

    return $container;
  };

  /**
   * Focus on the search field instead of the main multiselect container.
   */
  MultipleSelection.prototype.focusOnSearch = function() {
    var self = this;

    if ('undefined' !== typeof self.$search) {
      // Needs 1 ms delay because of other 1 ms setTimeouts when rendering.
      setTimeout(function(){
        // Prevent the dropdown opening again when focused from this.
        // This gets reset automatically when focus is triggered.
        self._keyUpPrevented = true;

        self.$search.focus();
      }, 1);
    }
  }

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var $selection = this.selectionContainer();
      var formatted = this.display(selection, $selection);
      if ('string' === typeof formatted) {
        formatted = Utils.entityDecode(formatted.trim());
      }

      $selection.text(formatted);
      $selection.prop('title', selection.title || selection.text);

      $selection.data('data', selection);

      $selections.push($selection);
    }

    var $rendered = this.$selection.find('.select2-selection__rendered');

    Utils.appendMany($rendered, $selections);
  };

  return MultipleSelection;
});

S2.define('select2/selection/placeholder',[
  '../utils'
], function (Utils) {
  function Placeholder (decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options);
  }

  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
    var $placeholder = this.selectionContainer();

    $placeholder.text(Utils.entityDecode(this.display(placeholder)));
    $placeholder.addClass('select2-selection__placeholder')
                .removeClass('select2-selection__choice');

    return $placeholder;
  };

  Placeholder.prototype.update = function (decorated, data) {
    var singlePlaceholder = (
      data.length == 1 && data[0].id != this.placeholder.id
    );
    var multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
      return decorated.call(this, data);
    }

    this.clear();

    var $placeholder = this.createPlaceholder(this.placeholder);

    this.$selection.find('.select2-selection__rendered').append($placeholder);
  };

  return Placeholder;
});

S2.define('select2/selection/allowClear',[
  'jquery',
  '../keys'
], function ($, KEYS) {
  function AllowClear () { }

  AllowClear.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    if (this.placeholder == null) {
      if (this.options.get('debug') && window.console && console.error) {
        console.error(
          'Select2: The `allowClear` option should be used in combination ' +
          'with the `placeholder` option.'
        );
      }
    }

    this.$selection.on('mousedown', '.select2-selection__clear',
      function (evt) {
        self._handleClear(evt);
    });

    container.on('keypress', function (evt) {
      self._handleKeyboardClear(evt, container);
    });
  };

  AllowClear.prototype._handleClear = function (_, evt) {
    // Ignore the event if it is disabled
    if (this.options.get('disabled')) {
      return;
    }

    var $clear = this.$selection.find('.select2-selection__clear');

    // Ignore the event if nothing has been selected
    if ($clear.length === 0) {
      return;
    }

    evt.stopPropagation();

    var data = $clear.data('data');

    for (var d = 0; d < data.length; d++) {
      var unselectData = {
        data: data[d]
      };

      // Trigger the `unselect` event, so people can prevent it from being
      // cleared.
      this.trigger('unselect', unselectData);

      // If the event was prevented, don't clear it out.
      if (unselectData.prevented) {
        return;
      }
    }

    this.$element.val(this.placeholder.id).trigger('change');

    this.trigger('toggle', {});
  };

  AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
    if (container.isOpen()) {
      return;
    }

    if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
      this._handleClear(evt);
    }
  };

  AllowClear.prototype.update = function (decorated, data) {
    decorated.call(this, data);

    if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
        data.length === 0) {
      return;
    }

    var $remove = $(
      '<span class="select2-selection__clear">' +
        '&times;' +
      '</span>'
    );
    $remove.data('data', data);

    this.$selection.find('.select2-selection__rendered').prepend($remove);
  };

  return AllowClear;
});

S2.define('select2/selection/search',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function Search (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  Search.prototype.render = function (decorated) {
    var $search = $(
      '<li class="select2-search select2-search--inline">' +
        '<input class="select2-search__field" type="text" tabindex="-1"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
        ' spellcheck="false" role="textbox" aria-autocomplete="list" />' +
      '</li>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    var $rendered = decorated.call(this);

    this._transferTabIndex();

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var resultsId = container.id + '-results';

    decorated.call(this, container, $container);

    container.on('open', function () {
      self.$search.attr('aria-owns', resultsId);
      self.$search.trigger('focus');
    });

    container.on('close', function () {
      self.$search.val('');
      self.$search.removeAttr('aria-activedescendant');
      self.$search.removeAttr('aria-owns');
      self.$search.trigger('focus');
    });

    container.on('enable', function () {
      self.$search.prop('disabled', false);

      self._transferTabIndex();
    });

    container.on('disable', function () {
      self.$search.prop('disabled', true);
    });

    container.on('focus', function (evt) {
      self.$search.trigger('focus');
    });

    container.on('results:focus', function (params) {
      self.$search.attr('aria-activedescendant', params.data._resultId);
    });

    this.$selection.on('focusin', '.select2-search--inline', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('focusout', '.select2-search--inline', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', '.select2-search--inline', function (evt) {
      evt.stopPropagation();

      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();

      var key = evt.which;

      if (key === KEYS.BACKSPACE && self.$search.val() === '') {
        var $previousChoice = self.$searchContainer
          .prev('.select2-selection__choice');

        if ($previousChoice.length > 0) {
          var item = $previousChoice.data('data');

          self.searchRemoveChoice(item);

          evt.preventDefault();
        }
      } else if (evt.which === KEYS.ENTER) {
        container.open();
        evt.preventDefault();
      }
    });

    // Try to detect the IE version should the `documentMode` property that
    // is stored on the document. This is only implemented in IE and is
    // slightly cleaner than doing a user agent check.
    // This property is not available in Edge, but Edge also doesn't have
    // this bug.
    var msie = document.documentMode;
    var disableInputEvents = msie && msie <= 11;

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$selection.on(
      'input.searchcheck',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents) {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        // Unbind the duplicated `keyup` event
        self.$selection.off('keyup.search');
      }
    );

    this.$selection.on(
      'keyup.search input.search',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents && evt.type === 'input') {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        var key = evt.which;

        // We can freely ignore events from modifier keys
        if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
          return;
        }

        // Tabbing will be handled during the `keydown` phase
        if (key == KEYS.TAB) {
          return;
        }

        self.handleSearch(evt);
      }
    );
  };

  /**
   * This method will transfer the tabindex attribute from the rendered
   * selection to the search box. This allows for the search box to be used as
   * the primary focus instead of the selection container.
   *
   * @private
   */
  Search.prototype._transferTabIndex = function (decorated) {
    this.$search.attr('tabindex', this.$selection.attr('tabindex'));
    this.$selection.attr('tabindex', '-1');
  };

  Search.prototype.createPlaceholder = function (decorated, placeholder) {
    this.$search.attr('placeholder', placeholder.text);
  };

  Search.prototype.update = function (decorated, data) {
    var searchHadFocus = this.$search[0] == document.activeElement;

    this.$search.attr('placeholder', '');

    decorated.call(this, data);

    this.$selection.find('.select2-selection__rendered')
                   .append(this.$searchContainer);

    this.resizeSearch();
    if (searchHadFocus) {
      this.$search.focus();
    }
  };

  Search.prototype.handleSearch = function () {
    this.resizeSearch();

    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.searchRemoveChoice = function (decorated, item) {
    this.trigger('unselect', {
      data: item
    });

    this.$search.val(item.text);
    this.handleSearch();
  };

  Search.prototype.resizeSearch = function () {
    this.$search.css('width', '25px');

    var width = '';

    if (this.$search.attr('placeholder') !== '') {
      width = this.$selection.find('.select2-selection__rendered').innerWidth();
    } else {
      var minimumWidth = this.$search.val().length + 1;

      width = (minimumWidth * 0.75) + 'em';
    }

    this.$search.css('width', width);
  };

  return Search;
});

S2.define('select2/selection/eventRelay',[
  'jquery'
], function ($) {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var relayEvents = [
      'open', 'opening',
      'close', 'closing',
      'select', 'selecting',
      'unselect', 'unselecting'
    ];

    var preventableEvents = ['opening', 'closing', 'selecting', 'unselecting'];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
      // Ignore events that should not be relayed
      if ($.inArray(name, relayEvents) === -1) {
        return;
      }

      // The parameters should always be an object
      params = params || {};

      // Generate the jQuery event for the Select2 event
      var evt = $.Event('select2:' + name, {
        params: params
      });

      self.$element.trigger(evt);

      // Only handle preventable events if it was one
      if ($.inArray(name, preventableEvents) === -1) {
        return;
      }

      params.prevented = evt.isDefaultPrevented();
    });
  };

  return EventRelay;
});

S2.define('select2/translation',[
  'jquery',
  'require'
], function ($, require) {
  function Translation (dict) {
    this.dict = dict || {};
  }

  Translation.prototype.all = function () {
    return this.dict;
  };

  Translation.prototype.get = function (key) {
    return this.dict[key];
  };

  Translation.prototype.extend = function (translation) {
    this.dict = $.extend({}, translation.all(), this.dict);
  };

  // Static functions

  Translation._cache = {};

  Translation.loadPath = function (path) {
    if (!(path in Translation._cache)) {
      var translations = require(path);

      Translation._cache[path] = translations;
    }

    return new Translation(Translation._cache[path]);
  };

  return Translation;
});

S2.define('select2/diacritics',[

], function () {
  var diacritics = {
    '\u24B6': 'A',
    '\uFF21': 'A',
    '\u00C0': 'A',
    '\u00C1': 'A',
    '\u00C2': 'A',
    '\u1EA6': 'A',
    '\u1EA4': 'A',
    '\u1EAA': 'A',
    '\u1EA8': 'A',
    '\u00C3': 'A',
    '\u0100': 'A',
    '\u0102': 'A',
    '\u1EB0': 'A',
    '\u1EAE': 'A',
    '\u1EB4': 'A',
    '\u1EB2': 'A',
    '\u0226': 'A',
    '\u01E0': 'A',
    '\u00C4': 'A',
    '\u01DE': 'A',
    '\u1EA2': 'A',
    '\u00C5': 'A',
    '\u01FA': 'A',
    '\u01CD': 'A',
    '\u0200': 'A',
    '\u0202': 'A',
    '\u1EA0': 'A',
    '\u1EAC': 'A',
    '\u1EB6': 'A',
    '\u1E00': 'A',
    '\u0104': 'A',
    '\u023A': 'A',
    '\u2C6F': 'A',
    '\uA732': 'AA',
    '\u00C6': 'AE',
    '\u01FC': 'AE',
    '\u01E2': 'AE',
    '\uA734': 'AO',
    '\uA736': 'AU',
    '\uA738': 'AV',
    '\uA73A': 'AV',
    '\uA73C': 'AY',
    '\u24B7': 'B',
    '\uFF22': 'B',
    '\u1E02': 'B',
    '\u1E04': 'B',
    '\u1E06': 'B',
    '\u0243': 'B',
    '\u0182': 'B',
    '\u0181': 'B',
    '\u24B8': 'C',
    '\uFF23': 'C',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010A': 'C',
    '\u010C': 'C',
    '\u00C7': 'C',
    '\u1E08': 'C',
    '\u0187': 'C',
    '\u023B': 'C',
    '\uA73E': 'C',
    '\u24B9': 'D',
    '\uFF24': 'D',
    '\u1E0A': 'D',
    '\u010E': 'D',
    '\u1E0C': 'D',
    '\u1E10': 'D',
    '\u1E12': 'D',
    '\u1E0E': 'D',
    '\u0110': 'D',
    '\u018B': 'D',
    '\u018A': 'D',
    '\u0189': 'D',
    '\uA779': 'D',
    '\u01F1': 'DZ',
    '\u01C4': 'DZ',
    '\u01F2': 'Dz',
    '\u01C5': 'Dz',
    '\u24BA': 'E',
    '\uFF25': 'E',
    '\u00C8': 'E',
    '\u00C9': 'E',
    '\u00CA': 'E',
    '\u1EC0': 'E',
    '\u1EBE': 'E',
    '\u1EC4': 'E',
    '\u1EC2': 'E',
    '\u1EBC': 'E',
    '\u0112': 'E',
    '\u1E14': 'E',
    '\u1E16': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u00CB': 'E',
    '\u1EBA': 'E',
    '\u011A': 'E',
    '\u0204': 'E',
    '\u0206': 'E',
    '\u1EB8': 'E',
    '\u1EC6': 'E',
    '\u0228': 'E',
    '\u1E1C': 'E',
    '\u0118': 'E',
    '\u1E18': 'E',
    '\u1E1A': 'E',
    '\u0190': 'E',
    '\u018E': 'E',
    '\u24BB': 'F',
    '\uFF26': 'F',
    '\u1E1E': 'F',
    '\u0191': 'F',
    '\uA77B': 'F',
    '\u24BC': 'G',
    '\uFF27': 'G',
    '\u01F4': 'G',
    '\u011C': 'G',
    '\u1E20': 'G',
    '\u011E': 'G',
    '\u0120': 'G',
    '\u01E6': 'G',
    '\u0122': 'G',
    '\u01E4': 'G',
    '\u0193': 'G',
    '\uA7A0': 'G',
    '\uA77D': 'G',
    '\uA77E': 'G',
    '\u24BD': 'H',
    '\uFF28': 'H',
    '\u0124': 'H',
    '\u1E22': 'H',
    '\u1E26': 'H',
    '\u021E': 'H',
    '\u1E24': 'H',
    '\u1E28': 'H',
    '\u1E2A': 'H',
    '\u0126': 'H',
    '\u2C67': 'H',
    '\u2C75': 'H',
    '\uA78D': 'H',
    '\u24BE': 'I',
    '\uFF29': 'I',
    '\u00CC': 'I',
    '\u00CD': 'I',
    '\u00CE': 'I',
    '\u0128': 'I',
    '\u012A': 'I',
    '\u012C': 'I',
    '\u0130': 'I',
    '\u00CF': 'I',
    '\u1E2E': 'I',
    '\u1EC8': 'I',
    '\u01CF': 'I',
    '\u0208': 'I',
    '\u020A': 'I',
    '\u1ECA': 'I',
    '\u012E': 'I',
    '\u1E2C': 'I',
    '\u0197': 'I',
    '\u24BF': 'J',
    '\uFF2A': 'J',
    '\u0134': 'J',
    '\u0248': 'J',
    '\u24C0': 'K',
    '\uFF2B': 'K',
    '\u1E30': 'K',
    '\u01E8': 'K',
    '\u1E32': 'K',
    '\u0136': 'K',
    '\u1E34': 'K',
    '\u0198': 'K',
    '\u2C69': 'K',
    '\uA740': 'K',
    '\uA742': 'K',
    '\uA744': 'K',
    '\uA7A2': 'K',
    '\u24C1': 'L',
    '\uFF2C': 'L',
    '\u013F': 'L',
    '\u0139': 'L',
    '\u013D': 'L',
    '\u1E36': 'L',
    '\u1E38': 'L',
    '\u013B': 'L',
    '\u1E3C': 'L',
    '\u1E3A': 'L',
    '\u0141': 'L',
    '\u023D': 'L',
    '\u2C62': 'L',
    '\u2C60': 'L',
    '\uA748': 'L',
    '\uA746': 'L',
    '\uA780': 'L',
    '\u01C7': 'LJ',
    '\u01C8': 'Lj',
    '\u24C2': 'M',
    '\uFF2D': 'M',
    '\u1E3E': 'M',
    '\u1E40': 'M',
    '\u1E42': 'M',
    '\u2C6E': 'M',
    '\u019C': 'M',
    '\u24C3': 'N',
    '\uFF2E': 'N',
    '\u01F8': 'N',
    '\u0143': 'N',
    '\u00D1': 'N',
    '\u1E44': 'N',
    '\u0147': 'N',
    '\u1E46': 'N',
    '\u0145': 'N',
    '\u1E4A': 'N',
    '\u1E48': 'N',
    '\u0220': 'N',
    '\u019D': 'N',
    '\uA790': 'N',
    '\uA7A4': 'N',
    '\u01CA': 'NJ',
    '\u01CB': 'Nj',
    '\u24C4': 'O',
    '\uFF2F': 'O',
    '\u00D2': 'O',
    '\u00D3': 'O',
    '\u00D4': 'O',
    '\u1ED2': 'O',
    '\u1ED0': 'O',
    '\u1ED6': 'O',
    '\u1ED4': 'O',
    '\u00D5': 'O',
    '\u1E4C': 'O',
    '\u022C': 'O',
    '\u1E4E': 'O',
    '\u014C': 'O',
    '\u1E50': 'O',
    '\u1E52': 'O',
    '\u014E': 'O',
    '\u022E': 'O',
    '\u0230': 'O',
    '\u00D6': 'O',
    '\u022A': 'O',
    '\u1ECE': 'O',
    '\u0150': 'O',
    '\u01D1': 'O',
    '\u020C': 'O',
    '\u020E': 'O',
    '\u01A0': 'O',
    '\u1EDC': 'O',
    '\u1EDA': 'O',
    '\u1EE0': 'O',
    '\u1EDE': 'O',
    '\u1EE2': 'O',
    '\u1ECC': 'O',
    '\u1ED8': 'O',
    '\u01EA': 'O',
    '\u01EC': 'O',
    '\u00D8': 'O',
    '\u01FE': 'O',
    '\u0186': 'O',
    '\u019F': 'O',
    '\uA74A': 'O',
    '\uA74C': 'O',
    '\u01A2': 'OI',
    '\uA74E': 'OO',
    '\u0222': 'OU',
    '\u24C5': 'P',
    '\uFF30': 'P',
    '\u1E54': 'P',
    '\u1E56': 'P',
    '\u01A4': 'P',
    '\u2C63': 'P',
    '\uA750': 'P',
    '\uA752': 'P',
    '\uA754': 'P',
    '\u24C6': 'Q',
    '\uFF31': 'Q',
    '\uA756': 'Q',
    '\uA758': 'Q',
    '\u024A': 'Q',
    '\u24C7': 'R',
    '\uFF32': 'R',
    '\u0154': 'R',
    '\u1E58': 'R',
    '\u0158': 'R',
    '\u0210': 'R',
    '\u0212': 'R',
    '\u1E5A': 'R',
    '\u1E5C': 'R',
    '\u0156': 'R',
    '\u1E5E': 'R',
    '\u024C': 'R',
    '\u2C64': 'R',
    '\uA75A': 'R',
    '\uA7A6': 'R',
    '\uA782': 'R',
    '\u24C8': 'S',
    '\uFF33': 'S',
    '\u1E9E': 'S',
    '\u015A': 'S',
    '\u1E64': 'S',
    '\u015C': 'S',
    '\u1E60': 'S',
    '\u0160': 'S',
    '\u1E66': 'S',
    '\u1E62': 'S',
    '\u1E68': 'S',
    '\u0218': 'S',
    '\u015E': 'S',
    '\u2C7E': 'S',
    '\uA7A8': 'S',
    '\uA784': 'S',
    '\u24C9': 'T',
    '\uFF34': 'T',
    '\u1E6A': 'T',
    '\u0164': 'T',
    '\u1E6C': 'T',
    '\u021A': 'T',
    '\u0162': 'T',
    '\u1E70': 'T',
    '\u1E6E': 'T',
    '\u0166': 'T',
    '\u01AC': 'T',
    '\u01AE': 'T',
    '\u023E': 'T',
    '\uA786': 'T',
    '\uA728': 'TZ',
    '\u24CA': 'U',
    '\uFF35': 'U',
    '\u00D9': 'U',
    '\u00DA': 'U',
    '\u00DB': 'U',
    '\u0168': 'U',
    '\u1E78': 'U',
    '\u016A': 'U',
    '\u1E7A': 'U',
    '\u016C': 'U',
    '\u00DC': 'U',
    '\u01DB': 'U',
    '\u01D7': 'U',
    '\u01D5': 'U',
    '\u01D9': 'U',
    '\u1EE6': 'U',
    '\u016E': 'U',
    '\u0170': 'U',
    '\u01D3': 'U',
    '\u0214': 'U',
    '\u0216': 'U',
    '\u01AF': 'U',
    '\u1EEA': 'U',
    '\u1EE8': 'U',
    '\u1EEE': 'U',
    '\u1EEC': 'U',
    '\u1EF0': 'U',
    '\u1EE4': 'U',
    '\u1E72': 'U',
    '\u0172': 'U',
    '\u1E76': 'U',
    '\u1E74': 'U',
    '\u0244': 'U',
    '\u24CB': 'V',
    '\uFF36': 'V',
    '\u1E7C': 'V',
    '\u1E7E': 'V',
    '\u01B2': 'V',
    '\uA75E': 'V',
    '\u0245': 'V',
    '\uA760': 'VY',
    '\u24CC': 'W',
    '\uFF37': 'W',
    '\u1E80': 'W',
    '\u1E82': 'W',
    '\u0174': 'W',
    '\u1E86': 'W',
    '\u1E84': 'W',
    '\u1E88': 'W',
    '\u2C72': 'W',
    '\u24CD': 'X',
    '\uFF38': 'X',
    '\u1E8A': 'X',
    '\u1E8C': 'X',
    '\u24CE': 'Y',
    '\uFF39': 'Y',
    '\u1EF2': 'Y',
    '\u00DD': 'Y',
    '\u0176': 'Y',
    '\u1EF8': 'Y',
    '\u0232': 'Y',
    '\u1E8E': 'Y',
    '\u0178': 'Y',
    '\u1EF6': 'Y',
    '\u1EF4': 'Y',
    '\u01B3': 'Y',
    '\u024E': 'Y',
    '\u1EFE': 'Y',
    '\u24CF': 'Z',
    '\uFF3A': 'Z',
    '\u0179': 'Z',
    '\u1E90': 'Z',
    '\u017B': 'Z',
    '\u017D': 'Z',
    '\u1E92': 'Z',
    '\u1E94': 'Z',
    '\u01B5': 'Z',
    '\u0224': 'Z',
    '\u2C7F': 'Z',
    '\u2C6B': 'Z',
    '\uA762': 'Z',
    '\u24D0': 'a',
    '\uFF41': 'a',
    '\u1E9A': 'a',
    '\u00E0': 'a',
    '\u00E1': 'a',
    '\u00E2': 'a',
    '\u1EA7': 'a',
    '\u1EA5': 'a',
    '\u1EAB': 'a',
    '\u1EA9': 'a',
    '\u00E3': 'a',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u1EB1': 'a',
    '\u1EAF': 'a',
    '\u1EB5': 'a',
    '\u1EB3': 'a',
    '\u0227': 'a',
    '\u01E1': 'a',
    '\u00E4': 'a',
    '\u01DF': 'a',
    '\u1EA3': 'a',
    '\u00E5': 'a',
    '\u01FB': 'a',
    '\u01CE': 'a',
    '\u0201': 'a',
    '\u0203': 'a',
    '\u1EA1': 'a',
    '\u1EAD': 'a',
    '\u1EB7': 'a',
    '\u1E01': 'a',
    '\u0105': 'a',
    '\u2C65': 'a',
    '\u0250': 'a',
    '\uA733': 'aa',
    '\u00E6': 'ae',
    '\u01FD': 'ae',
    '\u01E3': 'ae',
    '\uA735': 'ao',
    '\uA737': 'au',
    '\uA739': 'av',
    '\uA73B': 'av',
    '\uA73D': 'ay',
    '\u24D1': 'b',
    '\uFF42': 'b',
    '\u1E03': 'b',
    '\u1E05': 'b',
    '\u1E07': 'b',
    '\u0180': 'b',
    '\u0183': 'b',
    '\u0253': 'b',
    '\u24D2': 'c',
    '\uFF43': 'c',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010B': 'c',
    '\u010D': 'c',
    '\u00E7': 'c',
    '\u1E09': 'c',
    '\u0188': 'c',
    '\u023C': 'c',
    '\uA73F': 'c',
    '\u2184': 'c',
    '\u24D3': 'd',
    '\uFF44': 'd',
    '\u1E0B': 'd',
    '\u010F': 'd',
    '\u1E0D': 'd',
    '\u1E11': 'd',
    '\u1E13': 'd',
    '\u1E0F': 'd',
    '\u0111': 'd',
    '\u018C': 'd',
    '\u0256': 'd',
    '\u0257': 'd',
    '\uA77A': 'd',
    '\u01F3': 'dz',
    '\u01C6': 'dz',
    '\u24D4': 'e',
    '\uFF45': 'e',
    '\u00E8': 'e',
    '\u00E9': 'e',
    '\u00EA': 'e',
    '\u1EC1': 'e',
    '\u1EBF': 'e',
    '\u1EC5': 'e',
    '\u1EC3': 'e',
    '\u1EBD': 'e',
    '\u0113': 'e',
    '\u1E15': 'e',
    '\u1E17': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u00EB': 'e',
    '\u1EBB': 'e',
    '\u011B': 'e',
    '\u0205': 'e',
    '\u0207': 'e',
    '\u1EB9': 'e',
    '\u1EC7': 'e',
    '\u0229': 'e',
    '\u1E1D': 'e',
    '\u0119': 'e',
    '\u1E19': 'e',
    '\u1E1B': 'e',
    '\u0247': 'e',
    '\u025B': 'e',
    '\u01DD': 'e',
    '\u24D5': 'f',
    '\uFF46': 'f',
    '\u1E1F': 'f',
    '\u0192': 'f',
    '\uA77C': 'f',
    '\u24D6': 'g',
    '\uFF47': 'g',
    '\u01F5': 'g',
    '\u011D': 'g',
    '\u1E21': 'g',
    '\u011F': 'g',
    '\u0121': 'g',
    '\u01E7': 'g',
    '\u0123': 'g',
    '\u01E5': 'g',
    '\u0260': 'g',
    '\uA7A1': 'g',
    '\u1D79': 'g',
    '\uA77F': 'g',
    '\u24D7': 'h',
    '\uFF48': 'h',
    '\u0125': 'h',
    '\u1E23': 'h',
    '\u1E27': 'h',
    '\u021F': 'h',
    '\u1E25': 'h',
    '\u1E29': 'h',
    '\u1E2B': 'h',
    '\u1E96': 'h',
    '\u0127': 'h',
    '\u2C68': 'h',
    '\u2C76': 'h',
    '\u0265': 'h',
    '\u0195': 'hv',
    '\u24D8': 'i',
    '\uFF49': 'i',
    '\u00EC': 'i',
    '\u00ED': 'i',
    '\u00EE': 'i',
    '\u0129': 'i',
    '\u012B': 'i',
    '\u012D': 'i',
    '\u00EF': 'i',
    '\u1E2F': 'i',
    '\u1EC9': 'i',
    '\u01D0': 'i',
    '\u0209': 'i',
    '\u020B': 'i',
    '\u1ECB': 'i',
    '\u012F': 'i',
    '\u1E2D': 'i',
    '\u0268': 'i',
    '\u0131': 'i',
    '\u24D9': 'j',
    '\uFF4A': 'j',
    '\u0135': 'j',
    '\u01F0': 'j',
    '\u0249': 'j',
    '\u24DA': 'k',
    '\uFF4B': 'k',
    '\u1E31': 'k',
    '\u01E9': 'k',
    '\u1E33': 'k',
    '\u0137': 'k',
    '\u1E35': 'k',
    '\u0199': 'k',
    '\u2C6A': 'k',
    '\uA741': 'k',
    '\uA743': 'k',
    '\uA745': 'k',
    '\uA7A3': 'k',
    '\u24DB': 'l',
    '\uFF4C': 'l',
    '\u0140': 'l',
    '\u013A': 'l',
    '\u013E': 'l',
    '\u1E37': 'l',
    '\u1E39': 'l',
    '\u013C': 'l',
    '\u1E3D': 'l',
    '\u1E3B': 'l',
    '\u017F': 'l',
    '\u0142': 'l',
    '\u019A': 'l',
    '\u026B': 'l',
    '\u2C61': 'l',
    '\uA749': 'l',
    '\uA781': 'l',
    '\uA747': 'l',
    '\u01C9': 'lj',
    '\u24DC': 'm',
    '\uFF4D': 'm',
    '\u1E3F': 'm',
    '\u1E41': 'm',
    '\u1E43': 'm',
    '\u0271': 'm',
    '\u026F': 'm',
    '\u24DD': 'n',
    '\uFF4E': 'n',
    '\u01F9': 'n',
    '\u0144': 'n',
    '\u00F1': 'n',
    '\u1E45': 'n',
    '\u0148': 'n',
    '\u1E47': 'n',
    '\u0146': 'n',
    '\u1E4B': 'n',
    '\u1E49': 'n',
    '\u019E': 'n',
    '\u0272': 'n',
    '\u0149': 'n',
    '\uA791': 'n',
    '\uA7A5': 'n',
    '\u01CC': 'nj',
    '\u24DE': 'o',
    '\uFF4F': 'o',
    '\u00F2': 'o',
    '\u00F3': 'o',
    '\u00F4': 'o',
    '\u1ED3': 'o',
    '\u1ED1': 'o',
    '\u1ED7': 'o',
    '\u1ED5': 'o',
    '\u00F5': 'o',
    '\u1E4D': 'o',
    '\u022D': 'o',
    '\u1E4F': 'o',
    '\u014D': 'o',
    '\u1E51': 'o',
    '\u1E53': 'o',
    '\u014F': 'o',
    '\u022F': 'o',
    '\u0231': 'o',
    '\u00F6': 'o',
    '\u022B': 'o',
    '\u1ECF': 'o',
    '\u0151': 'o',
    '\u01D2': 'o',
    '\u020D': 'o',
    '\u020F': 'o',
    '\u01A1': 'o',
    '\u1EDD': 'o',
    '\u1EDB': 'o',
    '\u1EE1': 'o',
    '\u1EDF': 'o',
    '\u1EE3': 'o',
    '\u1ECD': 'o',
    '\u1ED9': 'o',
    '\u01EB': 'o',
    '\u01ED': 'o',
    '\u00F8': 'o',
    '\u01FF': 'o',
    '\u0254': 'o',
    '\uA74B': 'o',
    '\uA74D': 'o',
    '\u0275': 'o',
    '\u01A3': 'oi',
    '\u0223': 'ou',
    '\uA74F': 'oo',
    '\u24DF': 'p',
    '\uFF50': 'p',
    '\u1E55': 'p',
    '\u1E57': 'p',
    '\u01A5': 'p',
    '\u1D7D': 'p',
    '\uA751': 'p',
    '\uA753': 'p',
    '\uA755': 'p',
    '\u24E0': 'q',
    '\uFF51': 'q',
    '\u024B': 'q',
    '\uA757': 'q',
    '\uA759': 'q',
    '\u24E1': 'r',
    '\uFF52': 'r',
    '\u0155': 'r',
    '\u1E59': 'r',
    '\u0159': 'r',
    '\u0211': 'r',
    '\u0213': 'r',
    '\u1E5B': 'r',
    '\u1E5D': 'r',
    '\u0157': 'r',
    '\u1E5F': 'r',
    '\u024D': 'r',
    '\u027D': 'r',
    '\uA75B': 'r',
    '\uA7A7': 'r',
    '\uA783': 'r',
    '\u24E2': 's',
    '\uFF53': 's',
    '\u00DF': 's',
    '\u015B': 's',
    '\u1E65': 's',
    '\u015D': 's',
    '\u1E61': 's',
    '\u0161': 's',
    '\u1E67': 's',
    '\u1E63': 's',
    '\u1E69': 's',
    '\u0219': 's',
    '\u015F': 's',
    '\u023F': 's',
    '\uA7A9': 's',
    '\uA785': 's',
    '\u1E9B': 's',
    '\u24E3': 't',
    '\uFF54': 't',
    '\u1E6B': 't',
    '\u1E97': 't',
    '\u0165': 't',
    '\u1E6D': 't',
    '\u021B': 't',
    '\u0163': 't',
    '\u1E71': 't',
    '\u1E6F': 't',
    '\u0167': 't',
    '\u01AD': 't',
    '\u0288': 't',
    '\u2C66': 't',
    '\uA787': 't',
    '\uA729': 'tz',
    '\u24E4': 'u',
    '\uFF55': 'u',
    '\u00F9': 'u',
    '\u00FA': 'u',
    '\u00FB': 'u',
    '\u0169': 'u',
    '\u1E79': 'u',
    '\u016B': 'u',
    '\u1E7B': 'u',
    '\u016D': 'u',
    '\u00FC': 'u',
    '\u01DC': 'u',
    '\u01D8': 'u',
    '\u01D6': 'u',
    '\u01DA': 'u',
    '\u1EE7': 'u',
    '\u016F': 'u',
    '\u0171': 'u',
    '\u01D4': 'u',
    '\u0215': 'u',
    '\u0217': 'u',
    '\u01B0': 'u',
    '\u1EEB': 'u',
    '\u1EE9': 'u',
    '\u1EEF': 'u',
    '\u1EED': 'u',
    '\u1EF1': 'u',
    '\u1EE5': 'u',
    '\u1E73': 'u',
    '\u0173': 'u',
    '\u1E77': 'u',
    '\u1E75': 'u',
    '\u0289': 'u',
    '\u24E5': 'v',
    '\uFF56': 'v',
    '\u1E7D': 'v',
    '\u1E7F': 'v',
    '\u028B': 'v',
    '\uA75F': 'v',
    '\u028C': 'v',
    '\uA761': 'vy',
    '\u24E6': 'w',
    '\uFF57': 'w',
    '\u1E81': 'w',
    '\u1E83': 'w',
    '\u0175': 'w',
    '\u1E87': 'w',
    '\u1E85': 'w',
    '\u1E98': 'w',
    '\u1E89': 'w',
    '\u2C73': 'w',
    '\u24E7': 'x',
    '\uFF58': 'x',
    '\u1E8B': 'x',
    '\u1E8D': 'x',
    '\u24E8': 'y',
    '\uFF59': 'y',
    '\u1EF3': 'y',
    '\u00FD': 'y',
    '\u0177': 'y',
    '\u1EF9': 'y',
    '\u0233': 'y',
    '\u1E8F': 'y',
    '\u00FF': 'y',
    '\u1EF7': 'y',
    '\u1E99': 'y',
    '\u1EF5': 'y',
    '\u01B4': 'y',
    '\u024F': 'y',
    '\u1EFF': 'y',
    '\u24E9': 'z',
    '\uFF5A': 'z',
    '\u017A': 'z',
    '\u1E91': 'z',
    '\u017C': 'z',
    '\u017E': 'z',
    '\u1E93': 'z',
    '\u1E95': 'z',
    '\u01B6': 'z',
    '\u0225': 'z',
    '\u0240': 'z',
    '\u2C6C': 'z',
    '\uA763': 'z',
    '\u0386': '\u0391',
    '\u0388': '\u0395',
    '\u0389': '\u0397',
    '\u038A': '\u0399',
    '\u03AA': '\u0399',
    '\u038C': '\u039F',
    '\u038E': '\u03A5',
    '\u03AB': '\u03A5',
    '\u038F': '\u03A9',
    '\u03AC': '\u03B1',
    '\u03AD': '\u03B5',
    '\u03AE': '\u03B7',
    '\u03AF': '\u03B9',
    '\u03CA': '\u03B9',
    '\u0390': '\u03B9',
    '\u03CC': '\u03BF',
    '\u03CD': '\u03C5',
    '\u03CB': '\u03C5',
    '\u03B0': '\u03C5',
    '\u03C9': '\u03C9',
    '\u03C2': '\u03C3'
  };

  return diacritics;
});

S2.define('select2/data/base',[
  '../utils'
], function (Utils) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Utils.Observable);

  BaseAdapter.prototype.current = function (callback) {
    throw new Error('The `current` method must be defined in child classes.');
  };

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The `query` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.destroy = function () {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.generateResultId = function (container, data) {
    var id = '';

    if (container != null) {
      id += container.id
    } else {
      id += Utils.generateChars(4);
    }

    id += '-result-';
    id += Utils.generateChars(4);

    if (data.id != null) {
      id += '-' + data.id.toString();
    } else {
      id += '-' + Utils.generateChars(4);
    }
    return id;
  };

  return BaseAdapter;
});

S2.define('select2/data/select',[
  './base',
  '../utils',
  'jquery'
], function (BaseAdapter, Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;
    this.options = options;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, BaseAdapter);

  SelectAdapter.prototype.current = function (callback) {
    var data = [];
    var self = this;

    this.$element.find(':selected').each(function () {
      var $option = $(this);

      var option = self.item($option);

      data.push(option);
    });

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var self = this;

    data.selected = true;

    // If data.element is a DOM node, use it instead
    if ($(data.element).is('option')) {
      data.element.selected = true;

      this.$element.trigger('change');

      return;
    }

    if (this.$element.prop('multiple')) {
      this.current(function (currentData) {
        var val = [];

        data = [data];
        data.push.apply(data, currentData);

        for (var d = 0; d < data.length; d++) {
          var id = data[d].id;

          if ($.inArray(id, val) === -1) {
            val.push(id);
          }
        }

        self.$element.val(val);
        self.$element.trigger('change');
      });
    } else {
      var val = data.id;

      this.$element.val(val);
      this.$element.trigger('change');
    }
  };

  SelectAdapter.prototype.unselect = function (data) {
    var self = this;

    if (!this.$element.prop('multiple')) {
      return;
    }

    data.selected = false;

    if ($(data.element).is('option')) {
      data.element.selected = false;

      this.$element.trigger('change');

      return;
    }

    this.current(function (currentData) {
      var val = [];

      for (var d = 0; d < currentData.length; d++) {
        var id = currentData[d].id;

        if (id !== data.id && $.inArray(id, val) === -1) {
          val.push(id);
        }
      }

      self.$element.val(val);

      self.$element.trigger('change');
    });
  };

  SelectAdapter.prototype.bind = function (container, $container) {
    var self = this;

    this.container = container;

    container.on('select', function (params) {
      self.select(params.data);
    });

    container.on('unselect', function (params) {
      self.unselect(params.data);
    });
  };

  SelectAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
      // Remove any custom data set by Select2
      $.removeData(this, 'data');
    });
  };

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    var $options = this.$element.children();

    $options.each(function () {
      var $option = $(this);

      if (!$option.is('option') && !$option.is('optgroup')) {
        return;
      }

      var option = self.item($option);

      var matches = self.matches(params, option);

      if (matches !== null) {
        data.push(matches);
      }
    });

    callback({
      results: data
    });
  };

  SelectAdapter.prototype.addOptions = function ($options) {
    Utils.appendMany(this.$element, $options);
  };

  SelectAdapter.prototype.option = function (data) {
    var option;

    if (data.children) {
      option = document.createElement('optgroup');
      option.label = data.text;
    } else {
      option = document.createElement('option');

      if (option.textContent !== undefined) {
        option.textContent = data.text;
      } else {
        option.innerText = data.text;
      }
    }

    if (data.id !== undefined) {
      option.value = data.id;
    }

    if (data.disabled) {
      option.disabled = true;
    }

    if (data.selected) {
      option.selected = true;
    }

    if (data.title) {
      option.title = data.title;
    }

    var $option = $(option);

    var normalizedData = this._normalizeItem(data);
    normalizedData.element = option;

    // Override the option's data with the combined data
    $.data(option, 'data', normalizedData);

    return $option;
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {};

    data = $.data($option[0], 'data');

    if (data != null) {
      return data;
    }

    if ($option.is('option')) {
      data = {
        id: $option.val(),
        text: $option.text(),
        disabled: $option.prop('disabled'),
        selected: $option.prop('selected'),
        title: $option.prop('title')
      };
    } else if ($option.is('optgroup')) {
      data = {
        text: $option.prop('label'),
        children: [],
        title: $option.prop('title')
      };

      var $children = $option.children('option');
      var children = [];

      for (var c = 0; c < $children.length; c++) {
        var $child = $($children[c]);

        var child = this.item($child);

        children.push(child);
      }

      data.children = children;
    }

    data = this._normalizeItem(data);
    data.element = $option[0];

    $.data($option[0], 'data', data);

    return data;
  };

  SelectAdapter.prototype._normalizeItem = function (item) {
    if (!$.isPlainObject(item)) {
      item = {
        id: item,
        text: item
      };
    }

    item = $.extend({}, {
      text: ''
    }, item);

    var defaults = {
      selected: false,
      disabled: false
    };

    if (item.id != null) {
      item.id = item.id.toString();
    }

    if (item.text != null) {
      item.text = item.text.toString();
    }

    if (item._resultId == null && item.id) {
      item._resultId = this.generateResultId(this.container, item);
    }

    return $.extend({}, defaults, item);
  };

  SelectAdapter.prototype.matches = function (params, data) {
    var matcher = this.options.get('matcher');

    return matcher(params, data);
  };

  return SelectAdapter;
});

S2.define('select2/data/array',[
  './select',
  '../utils',
  'jquery'
], function (SelectAdapter, Utils, $) {
  function ArrayAdapter ($element, options) {
    var data = options.get('data') || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);

    this.addOptions(this.convertToOptions(data));
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.select = function (data) {
    var $option = this.$element.find('option').filter(function (i, elm) {
      return elm.value == data.id.toString();
    });

    if ($option.length === 0) {
      $option = this.option(data);

      this.addOptions($option);
    }

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    var self = this;

    var $existing = this.$element.find('option');
    var existingIds = $existing.map(function () {
      return self.item($(this)).id;
    }).get();

    var $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem (item) {
      return function () {
        return $(this).val() == item.id;
      };
    }

    for (var d = 0; d < data.length; d++) {
      var item = this._normalizeItem(data[d]);

      // Skip items which were pre-loaded, only merge the data
      if ($.inArray(item.id, existingIds) >= 0) {
        var $existingOption = $existing.filter(onlyItem(item));

        var existingData = this.item($existingOption);
        var newData = $.extend(true, {}, item, existingData);

        var $newOption = this.option(newData);

        $existingOption.replaceWith($newOption);

        continue;
      }

      var $option = this.option(item);

      if (item.children) {
        var $children = this.convertToOptions(item.children);

        Utils.appendMany($option, $children);
      }

      $options.push($option);
    }

    return $options;
  };

  return ArrayAdapter;
});

S2.define('select2/data/ajax',[
  './array',
  '../utils',
  'jquery'
], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter ($element, options) {
    this.ajaxOptions = this._applyDefaults(options.get('ajax'));

    if (this.ajaxOptions.processResults != null) {
      this.processResults = this.ajaxOptions.processResults;
    }

    AjaxAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype._applyDefaults = function (options) {
    var defaults = {
      data: function (params) {
        return $.extend({}, params, {
          q: params.term
        });
      },
      transport: function (params, success, failure) {
        var $request = $.ajax(params);

        $request.then(success);
        $request.fail(failure);

        return $request;
      }
    };

    return $.extend({}, defaults, options, true);
  };

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request != null) {
      // JSONP requests cannot always be aborted
      if ($.isFunction(this._request.abort)) {
        this._request.abort();
      }

      this._request = null;
    }

    var options = $.extend({
      type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
      options.url = options.url.call(this.$element, params);
    }

    if (typeof options.data === 'function') {
      options.data = options.data.call(this.$element, params);
    }

    function request () {
      var $request = options.transport(options, function (data) {
        var results = self.processResults(data, params);

        if (self.options.get('debug') && window.console && console.error) {
          // Check to make sure that the response included a `results` key.
          if (!results || !results.results || !$.isArray(results.results)) {
            console.error(
              'Select2: The AJAX results did not return an array in the ' +
              '`results` key of the response.'
            );
          }
        }

        callback(results);
        self.container.focusOnActiveElement();
      }, function () {
        // Attempt to detect if a request was aborted
        // Only works if the transport exposes a status property
        if ($request.status && $request.status === '0') {
          return;
        }

        self.trigger('results:message', {
          message: 'errorLoading'
        });
      });

      self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term != null) {
      if (this._queryTimeout) {
        window.clearTimeout(this._queryTimeout);
      }

      this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
      request();
    }
  };

  return AjaxAdapter;
});

S2.define('select2/data/tags',[
  'jquery'
], function ($) {
  function Tags (decorated, $element, options) {
    var tags = options.get('tags');

    var createTag = options.get('createTag');

    if (createTag !== undefined) {
      this.createTag = createTag;
    }

    var insertTag = options.get('insertTag');

    if (insertTag !== undefined) {
        this.insertTag = insertTag;
    }

    decorated.call(this, $element, options);

    if ($.isArray(tags)) {
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t];
        var item = this._normalizeItem(tag);

        var $option = this.option(item);

        this.$element.append($option);
      }
    }
  }

  Tags.prototype.query = function (decorated, params, callback) {
    var self = this;

    this._removeOldTags();

    if (params.term == null || params.page != null) {
      decorated.call(this, params, callback);
      return;
    }

    function wrapper (obj, child) {
      var data = obj.results;

      for (var i = 0; i < data.length; i++) {
        var option = data[i];

        var checkChildren = (
          option.children != null &&
          !wrapper({
            results: option.children
          }, true)
        );

        var optionText = (option.text || '').toUpperCase();
        var paramsTerm = (params.term || '').toUpperCase();

        var checkText = optionText === paramsTerm;

        if (checkText || checkChildren) {
          if (child) {
            return false;
          }

          obj.data = data;
          callback(obj);

          return;
        }
      }

      if (child) {
        return true;
      }

      var tag = self.createTag(params);

      if (tag != null) {
        var $option = self.option(tag);
        $option.attr('data-select2-tag', true);

        self.addOptions([$option]);

        self.insertTag(data, tag);
      }

      obj.results = data;

      callback(obj);
    }

    decorated.call(this, params, wrapper);
  };

  Tags.prototype.createTag = function (decorated, params) {
    var term = $.trim(params.term);

    if (term === '') {
      return null;
    }

    return {
      id: term,
      text: term
    };
  };

  Tags.prototype.insertTag = function (_, data, tag) {
    data.unshift(tag);
  };

  Tags.prototype._removeOldTags = function (_) {
    var tag = this._lastTag;

    var $options = this.$element.find('option[data-select2-tag]');

    $options.each(function () {
      if (this.selected) {
        return;
      }

      $(this).remove();
    });
  };

  return Tags;
});

S2.define('select2/data/tokenizer',[
  'jquery'
], function ($) {
  function Tokenizer (decorated, $element, options) {
    var tokenizer = options.get('tokenizer');

    if (tokenizer !== undefined) {
      this.tokenizer = tokenizer;
    }

    decorated.call(this, $element, options);
  }

  Tokenizer.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    this.$search =  container.dropdown.$search || container.selection.$search ||
      $container.find('.select2-search__field');
  };

  Tokenizer.prototype.query = function (decorated, params, callback) {
    var self = this;

    function createAndSelect (data) {
      // Normalize the data object so we can use it for checks
      var item = self._normalizeItem(data);

      // Check if the data object already exists as a tag
      // Select it if it doesn't
      var $existingOptions = self.$element.find('option').filter(function () {
        return $(this).val() === item.id;
      });

      // If an existing option wasn't found for it, create the option
      if (!$existingOptions.length) {
        var $option = self.option(item);
        $option.attr('data-select2-tag', true);

        self._removeOldTags();
        self.addOptions([$option]);
      }

      // Select the item, now that we know there is an option for it
      select(item);
    }

    function select (data) {
      self.trigger('select', {
        data: data
      });
    }

    params.term = params.term || '';

    var tokenData = this.tokenizer(params, this.options, createAndSelect);

    if (tokenData.term !== params.term) {
      // Replace the search term if we have the search box
      if (this.$search.length) {
        this.$search.val(tokenData.term);
        this.$search.focus();
      }

      params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
  };

  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    var separators = options.get('tokenSeparators') || [];
    var term = params.term;
    var i = 0;

    var createTag = this.createTag || function (params) {
      return {
        id: params.term,
        text: params.term
      };
    };

    while (i < term.length) {
      var termChar = term[i];

      if ($.inArray(termChar, separators) === -1) {
        i++;

        continue;
      }

      var part = term.substr(0, i);
      var partParams = $.extend({}, params, {
        term: part
      });

      var data = createTag(partParams);

      if (data == null) {
        i++;
        continue;
      }

      callback(data);

      // Reset the term to not include the tokenized portion
      term = term.substr(i + 1) || '';
      i = 0;
    }

    return {
      term: term
    };
  };

  return Tokenizer;
});

S2.define('select2/data/minimumInputLength',[

], function () {
  function MinimumInputLength (decorated, $e, options) {
    this.minimumInputLength = options.get('minimumInputLength');

    decorated.call(this, $e, options);
  }

  MinimumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (params.term.length < this.minimumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooShort',
        args: {
          minimum: this.minimumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MinimumInputLength;
});

S2.define('select2/data/maximumInputLength',[

], function () {
  function MaximumInputLength (decorated, $e, options) {
    this.maximumInputLength = options.get('maximumInputLength');

    decorated.call(this, $e, options);
  }

  MaximumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (this.maximumInputLength > 0 &&
        params.term.length > this.maximumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooLong',
        args: {
          maximum: this.maximumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MaximumInputLength;
});

S2.define('select2/data/maximumSelectionLength',[

], function (){
  function MaximumSelectionLength (decorated, $e, options) {
    this.maximumSelectionLength = options.get('maximumSelectionLength');

    decorated.call(this, $e, options);
  }

  MaximumSelectionLength.prototype.query =
    function (decorated, params, callback) {
      var self = this;

      this.current(function (currentData) {
        var count = currentData != null ? currentData.length : 0;
        if (self.maximumSelectionLength > 0 &&
          count >= self.maximumSelectionLength) {
          self.trigger('results:message', {
            message: 'maximumSelected',
            args: {
              maximum: self.maximumSelectionLength
            }
          });
          return;
        }
        decorated.call(self, params, callback);
      });
  };

  return MaximumSelectionLength;
});

S2.define('select2/dropdown',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<span class="select2-dropdown">' +
        '<span class="select2-results"></span>' +
      '</span>'
    );

    $dropdown.attr('dir', this.options.get('dir'));

    this.$dropdown = $dropdown;

    return $dropdown;
  };

  Dropdown.prototype.bind = function () {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.position = function ($dropdown, $container) {
    // Should be implmented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.$dropdown.remove();
  };

  return Dropdown;
});

S2.define('select2/dropdown/search',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function Search () { }

  Search.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);

    var $search = $(
      '<span class="select2-search select2-search--dropdown">' +
        '<input class="select2-search__field" type="text" tabindex="-1"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
        ' spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="true" />' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    $rendered.prepend($search);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var resultsId = container.id + '-results';

    decorated.call(this, container, $container);

    this.$search.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();
    });

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$search.on('input', function (evt) {
      // Unbind the duplicated `keyup` event
      $(this).off('keyup');
    });

    this.$search.on('keyup input', function (evt) {
      self.handleSearch(evt);
    });

    container.on('open', function () {
      self.$search.attr('tabindex', 0);
      self.$search.attr('aria-owns', resultsId);
      self.$search.focus();

      window.setTimeout(function () {
        self.$search.focus();
      }, 0);
    });

    container.on('close', function () {
      self.$search.attr('tabindex', -1);
      self.$search.removeAttr('aria-activedescendant');
      self.$search.removeAttr('aria-owns');
      self.$search.val('');
    });

    container.on('focus', function () {
      if (!container.isOpen()) {
        self.$search.focus();
      }
    });

    container.on('results:all', function (params) {
      if (params.query.term == null || params.query.term === '') {
        var showSearch = self.showSearch(params);

        if (showSearch) {
          self.$searchContainer.removeClass('select2-search--hide');
        } else {
          self.$searchContainer.addClass('select2-search--hide');
        }
      }
    });

    container.on('results:focus', function (params) {
      self.$search.attr('aria-activedescendant', params.data._resultId);
    });
  };

  Search.prototype.handleSearch = function (evt) {
    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.showSearch = function (_, params) {
    return true;
  };

  return Search;
});

S2.define('select2/dropdown/hidePlaceholder',[

], function () {
  function HidePlaceholder (decorated, $element, options, dataAdapter) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options, dataAdapter);
  }

  HidePlaceholder.prototype.append = function (decorated, data) {
    data.results = this.removePlaceholder(data.results);

    decorated.call(this, data);
  };

  HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  HidePlaceholder.prototype.removePlaceholder = function (_, data) {
    var modifiedData = data.slice(0);

    for (var d = data.length - 1; d >= 0; d--) {
      var item = data[d];

      if (this.placeholder.id === item.id) {
        modifiedData.splice(d, 1);
      }
    }

    return modifiedData;
  };

  return HidePlaceholder;
});

S2.define('select2/dropdown/infiniteScroll',[
  'jquery'
], function ($) {
  function InfiniteScroll (decorated, $element, options, dataAdapter) {
    this.lastParams = {};

    decorated.call(this, $element, options, dataAdapter);

    this.$loadingMore = this.createLoadingMore();
    this.loading = false;
  }

  InfiniteScroll.prototype.append = function (decorated, data) {
    this.$loadingMore.remove();
    this.loading = false;

    decorated.call(this, data);

    if (this.showLoadingMore(data)) {
      this.$results.append(this.$loadingMore);
    }
  };

  InfiniteScroll.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('query', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    container.on('query:append', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    this.$results.on('scroll', function () {
      var isLoadMoreVisible = $.contains(
        document.documentElement,
        self.$loadingMore[0]
      );

      if (self.loading || !isLoadMoreVisible) {
        return;
      }

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var loadingMoreOffset = self.$loadingMore.offset().top +
        self.$loadingMore.outerHeight(false);

      if (currentOffset + 50 >= loadingMoreOffset) {
        self.loadMore();
      }
    });
  };

  InfiniteScroll.prototype.loadMore = function () {
    this.loading = true;

    var params = $.extend({}, {page: 1}, this.lastParams);

    params.page++;

    this.trigger('query:append', params);
  };

  InfiniteScroll.prototype.showLoadingMore = function (_, data) {
    return data.pagination && data.pagination.more;
  };

  InfiniteScroll.prototype.createLoadingMore = function () {
    var $option = $(
      '<li ' +
      'class="select2-results__option select2-results__option--load-more"' +
      'role="option" aria-disabled="true"></li>'
    );

    var message = this.options.get('translations').get('loadingMore');

    $option.html(message(this.lastParams));

    return $option;
  };

  return InfiniteScroll;
});

S2.define('select2/dropdown/attachBody',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function AttachBody (decorated, $element, options) {
    this.$dropdownParent = options.get('dropdownParent') || $(document.body);

    decorated.call(this, $element, options);
  }

  AttachBody.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var setupResultsEvents = false;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self._showDropdown();
      self._attachPositioningHandler(container);

      if (!setupResultsEvents) {
        setupResultsEvents = true;

        container.on('results:all', function () {
          self._positionDropdown();
          self._resizeDropdown();
        });

        container.on('results:append', function () {
          self._positionDropdown();
          self._resizeDropdown();
        });
      }
    });

    container.on('close', function () {
      self._hideDropdown();
      self._detachPositioningHandler(container);
    });

    this.$dropdownContainer.on('mousedown', function (evt) {
      evt.stopPropagation();
    });
  };

  AttachBody.prototype.destroy = function (decorated) {
    decorated.call(this);

    this.$dropdownContainer.remove();
  };

  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown.attr('class', $container.attr('class'));

    $dropdown.removeClass('select2');
    $dropdown.addClass('select2-container--open');

    $dropdown.css({
      position: 'absolute',
      top: -999999
    });

    this.$container = $container;
  };

  AttachBody.prototype.render = function (decorated) {
    var $container = $('<span></span>');

    var $dropdown = decorated.call(this);
    $container.append($dropdown);

    this.$dropdownContainer = $container;

    return $container;
  };

  AttachBody.prototype._hideDropdown = function (decorated) {
    this.$dropdownContainer.detach();
  };

  AttachBody.prototype._attachPositioningHandler =
      function (decorated, container) {
    var self = this;

    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.each(function () {
      $(this).data('select2-scroll-position', {
        x: $(this).scrollLeft(),
        y: $(this).scrollTop()
      });
    });

    $watchers.on(scrollEvent, function (ev) {
      var position = $(this).data('select2-scroll-position');
      $(this).scrollTop(position.y);
    });

    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
      function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });
  };

  AttachBody.prototype._detachPositioningHandler =
      function (decorated, container) {
    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.off(scrollEvent);

    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
  };

  AttachBody.prototype._positionDropdown = function () {
    var $window = $(window);

    var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
    var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

    var newDirection = null;

    var offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    var container = {
      height: this.$container.outerHeight(false)
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    var dropdown = {
      height: this.$dropdown.outerHeight(false)
    };

    var viewport = {
      top: $window.scrollTop(),
      bottom: $window.scrollTop() + $window.height()
    };

    var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
    var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

    var css = {
      left: offset.left,
      top: container.bottom
    };

    // Determine what the parent element is to use for calciulating the offset
    var $offsetParent = this.$dropdownParent;

    // For statically positoned elements, we need to get the element
    // that is determining the offset
    if ($offsetParent.css('position') === 'static') {
      $offsetParent = $offsetParent.offsetParent();
    }

    var parentOffset = $offsetParent.offset();

    css.top -= parentOffset.top;
    css.left -= parentOffset.left;

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
      newDirection = 'below';
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
      newDirection = 'above';
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
      newDirection = 'below';
    }

    if (newDirection == 'above' ||
      (isCurrentlyAbove && newDirection !== 'below')) {
      css.top = container.top - parentOffset.top - dropdown.height;
    }

    if (newDirection != null) {
      this.$dropdown
        .removeClass('select2-dropdown--below select2-dropdown--above')
        .addClass('select2-dropdown--' + newDirection);
      this.$container
        .removeClass('select2-container--below select2-container--above')
        .addClass('select2-container--' + newDirection);
    }

    this.$dropdownContainer.css(css);
  };

  AttachBody.prototype._resizeDropdown = function () {
    var css = {
      width: this.$container.outerWidth(false) + 'px'
    };

    if (this.options.get('dropdownAutoWidth')) {
      css.minWidth = css.width;
      css.position = 'relative';
      css.width = 'auto';
    }

    this.$dropdown.css(css);
  };

  AttachBody.prototype._showDropdown = function (decorated) {
    this.$dropdownContainer.appendTo(this.$dropdownParent);

    this._positionDropdown();
    this._resizeDropdown();
  };

  return AttachBody;
});

S2.define('select2/dropdown/minimumResultsForSearch',[

], function () {
  function countResults (data) {
    var count = 0;

    for (var d = 0; d < data.length; d++) {
      var item = data[d];

      if (item.children) {
        count += countResults(item.children);
      } else {
        count++;
      }
    }

    return count;
  }

  function MinimumResultsForSearch (decorated, $element, options, dataAdapter) {
    this.minimumResultsForSearch = options.get('minimumResultsForSearch');

    if (this.minimumResultsForSearch < 0) {
      this.minimumResultsForSearch = Infinity;
    }

    decorated.call(this, $element, options, dataAdapter);
  }

  MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
    if (countResults(params.data.results) < this.minimumResultsForSearch) {
      return false;
    }

    return decorated.call(this, params);
  };

  return MinimumResultsForSearch;
});

S2.define('select2/dropdown/selectOnClose',[

], function () {
  function SelectOnClose () { }

  SelectOnClose.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('close', function (params) {
      self._handleSelectOnClose(params);
    });
  };

  SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
    if (params && params.originalSelect2Event != null) {
      var event = params.originalSelect2Event;

      // Don't select an item if the close event was triggered from a select or
      // unselect event
      if (event._type === 'select' || event._type === 'unselect') {
        return;
      }
    }

    var $highlightedResults = this.getHighlightedResults();

    // Only select highlighted results
    if ($highlightedResults.length < 1) {
      return;
    }

    var data = $highlightedResults.data('data');

    // Don't re-select already selected resulte
    if (
      (data.element != null && data.element.selected) ||
      (data.element == null && data.selected)
    ) {
      return;
    }

    this.trigger('select', {
        data: data
    });
  };

  return SelectOnClose;
});

S2.define('select2/dropdown/closeOnSelect',[

], function () {
  function CloseOnSelect () { }

  CloseOnSelect.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('select', function (evt) {
      self._selectTriggered(evt);
    });

    container.on('unselect', function (evt) {
      self._selectTriggered(evt);
    });
  };

  CloseOnSelect.prototype._selectTriggered = function (_, evt) {
    var originalEvent = evt.originalEvent;

    // Don't close if the control key is being held
    if (originalEvent && originalEvent.ctrlKey) {
      return;
    }

    this.trigger('close', {
      originalEvent: originalEvent,
      originalSelect2Event: evt
    });
  };

  return CloseOnSelect;
});

S2.define('select2/i18n/en',[],function () {
  // English
  return {
    errorLoading: function () {
      return 'The results could not be loaded.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Please delete ' + overChars + ' character';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Please enter ' + remainingChars + ' or more characters';

      return message;
    },
    loadingMore: function () {
      return 'Loading more results…';
    },
    maximumSelected: function (args) {
      var message = 'You can only select ' + args.maximum + ' item';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'No results found';
    },
    searching: function () {
      return 'Searching…';
    }
  };
});

S2.define('select2/defaults',[
  'jquery',
  'require',

  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',
  './selection/allowClear',
  './selection/search',
  './selection/eventRelay',

  './utils',
  './translation',
  './diacritics',

  './data/select',
  './data/array',
  './data/ajax',
  './data/tags',
  './data/tokenizer',
  './data/minimumInputLength',
  './data/maximumInputLength',
  './data/maximumSelectionLength',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',
  './dropdown/infiniteScroll',
  './dropdown/attachBody',
  './dropdown/minimumResultsForSearch',
  './dropdown/selectOnClose',
  './dropdown/closeOnSelect',

  './i18n/en'
], function ($, require,

             ResultsList,

             SingleSelection, MultipleSelection, Placeholder, AllowClear,
             SelectionSearch, EventRelay,

             Utils, Translation, DIACRITICS,

             SelectData, ArrayData, AjaxData, Tags, Tokenizer,
             MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

             Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
             AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect,

             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend(true, {}, this.defaults, options);

    if (options.dataAdapter == null) {
      if (options.ajax != null) {
        options.dataAdapter = AjaxData;
      } else if (options.data != null) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }

      if (options.minimumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MinimumInputLength
        );
      }

      if (options.maximumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumInputLength
        );
      }

      if (options.maximumSelectionLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumSelectionLength
        );
      }

      if (options.tags) {
        options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
      }

      if (options.tokenSeparators != null || options.tokenizer != null) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Tokenizer
        );
      }

      if (options.query != null) {
        var Query = require(options.amdBase + 'compat/query');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Query
        );
      }

      if (options.initSelection != null) {
        var InitSelection = require(options.amdBase + 'compat/initSelection');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          InitSelection
        );
      }
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;

      if (options.ajax != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          InfiniteScroll
        );
      }

      if (options.placeholder != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          HidePlaceholder
        );
      }

      if (options.selectOnClose) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          SelectOnClose
        );
      }
    }

    if (options.dropdownAdapter == null) {
      if (options.multiple) {
        options.dropdownAdapter = Dropdown;
      } else {
        var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

        options.dropdownAdapter = SearchableDropdown;
      }

      if (options.minimumResultsForSearch !== 0) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          MinimumResultsForSearch
        );
      }

      if (options.closeOnSelect) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          CloseOnSelect
        );
      }

      if (
        options.dropdownCssClass != null ||
        options.dropdownCss != null ||
        options.adaptDropdownCssClass != null
      ) {
        var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');

        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          DropdownCSS
        );
      }

      options.dropdownAdapter = Utils.Decorate(
        options.dropdownAdapter,
        AttachBody
      );
    }

    if (options.selectionAdapter == null) {
      if (options.multiple) {
        options.selectionAdapter = MultipleSelection;
      } else {
        options.selectionAdapter = SingleSelection;
      }

      // Add the placeholder mixin if a placeholder was specified
      if (options.placeholder != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          Placeholder
        );
      }

      if (options.allowClear) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          AllowClear
        );
      }

      if (options.multiple) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          SelectionSearch
        );
      }

      if (
        options.containerCssClass != null ||
        options.containerCss != null ||
        options.adaptContainerCssClass != null
      ) {
        var ContainerCSS = require(options.amdBase + 'compat/containerCss');

        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          ContainerCSS
        );
      }

      options.selectionAdapter = Utils.Decorate(
        options.selectionAdapter,
        EventRelay
      );
    }

    if (typeof options.language === 'string') {
      // Check if the language is specified with a region
      if (options.language.indexOf('-') > 0) {
        // Extract the region information if it is included
        var languageParts = options.language.split('-');
        var baseLanguage = languageParts[0];

        options.language = [options.language, baseLanguage];
      } else {
        options.language = [options.language];
      }
    }

    if ($.isArray(options.language)) {
      var languages = new Translation();
      options.language.push('en');

      var languageNames = options.language;

      for (var l = 0; l < languageNames.length; l++) {
        var name = languageNames[l];
        var language = {};

        try {
          // Try to load it with the original name
          language = Translation.loadPath(name);
        } catch (e) {
          try {
            // If we couldn't load it, check if it wasn't the full path
            name = this.defaults.amdLanguageBase + name;
            language = Translation.loadPath(name);
          } catch (ex) {
            // The translation could not be loaded at all. Sometimes this is
            // because of a configuration problem, other times this can be
            // because of how Select2 helps load all possible translation files.
            if (options.debug && window.console && console.warn) {
              console.warn(
                'Select2: The language file for "' + name + '" could not be ' +
                'automatically loaded. A fallback will be used instead.'
              );
            }

            continue;
          }
        }

        languages.extend(language);
      }

      options.translations = languages;
    } else {
      var baseTranslation = Translation.loadPath(
        this.defaults.amdLanguageBase + 'en'
      );
      var customTranslation = new Translation(options.language);

      customTranslation.extend(baseTranslation);

      options.translations = customTranslation;
    }

    return options;
  };

  Defaults.prototype.reset = function () {
    function stripDiacritics (text) {
      // Used 'uni range + named function' from http://jsperf.com/diacritics/18
      function match(a) {
        return DIACRITICS[a] || a;
      }

      return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function matcher (params, data) {
      // Always return the object if there is nothing to compare
      if ($.trim(params.term) === '') {
        return data;
      }

      // Do a recursive check for options with children
      if (data.children && data.children.length > 0) {
        // Clone the data object if there are children
        // This is required as we modify the object to remove any non-matches
        var match = $.extend(true, {}, data);

        // Check each child of the option
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          var matches = matcher(params, child);

          // If there wasn't a match, remove the object in the array
          if (matches == null) {
            match.children.splice(c, 1);
          }
        }

        // If any children matched, return the new object
        if (match.children.length > 0) {
          return match;
        }

        // If there were no matching children, check just the plain object
        return matcher(params, match);
      }

      var original = stripDiacritics(data.text).toUpperCase();
      var term = stripDiacritics(params.term).toUpperCase();

      // Check if the text contains the term
      if (original.indexOf(term) > -1) {
        return data;
      }

      // If it doesn't contain the term, don't return anything
      return null;
    }

    this.defaults = {
      amdBase: './',
      amdLanguageBase: './i18n/',
      closeOnSelect: true,
      debug: false,
      dropdownAutoWidth: false,
      escapeMarkup: Utils.escapeMarkup,
      language: EnglishTranslation,
      matcher: matcher,
      minimumInputLength: 0,
      maximumInputLength: 0,
      maximumSelectionLength: 0,
      minimumResultsForSearch: 0,
      selectOnClose: false,
      sorter: function (data) {
        return data;
      },
      templateResult: function (result) {
        return result.text;
      },
      templateSelection: function (selection) {
        return selection.text;
      },
      theme: 'default',
      width: 'resolve'
    };
  };

  Defaults.prototype.set = function (key, value) {
    var camelKey = $.camelCase(key);

    var data = {};
    data[camelKey] = value;

    var convertedData = Utils._convertData(data);

    $.extend(this.defaults, convertedData);
  };

  var defaults = new Defaults();

  return defaults;
});

S2.define('select2/options',[
  'require',
  'jquery',
  './defaults',
  './utils'
], function (require, $, Defaults, Utils) {
  function Options (options, $element) {
    this.options = options;

    if ($element != null) {
      this.fromElement($element);
    }

    this.options = Defaults.apply(this.options);

    if ($element && $element.is('input')) {
      var InputCompat = require(this.get('amdBase') + 'compat/inputData');

      this.options.dataAdapter = Utils.Decorate(
        this.options.dataAdapter,
        InputCompat
      );
    }
  }

  Options.prototype.fromElement = function ($e) {
    var excludedData = ['select2'];

    if (this.options.multiple == null) {
      this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
      this.options.disabled = $e.prop('disabled');
    }

    if (this.options.language == null) {
      if ($e.prop('lang')) {
        this.options.language = $e.prop('lang').toLowerCase();
      } else if ($e.closest('[lang]').prop('lang')) {
        this.options.language = $e.closest('[lang]').prop('lang');
      }
    }

    if (this.options.dir == null) {
      if ($e.prop('dir')) {
        this.options.dir = $e.prop('dir');
      } else if ($e.closest('[dir]').prop('dir')) {
        this.options.dir = $e.closest('[dir]').prop('dir');
      } else {
        this.options.dir = 'ltr';
      }
    }

    $e.prop('disabled', this.options.disabled);
    $e.prop('multiple', this.options.multiple);

    if ($e.data('select2Tags')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-select2-tags` attribute has been changed to ' +
          'use the `data-data` and `data-tags="true"` attributes and will be ' +
          'removed in future versions of Select2.'
        );
      }

      $e.data('data', $e.data('select2Tags'));
      $e.data('tags', true);
    }

    if ($e.data('ajaxUrl')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-ajax-url` attribute has been changed to ' +
          '`data-ajax--url` and support for the old attribute will be removed' +
          ' in future versions of Select2.'
        );
      }

      $e.attr('ajax--url', $e.data('ajaxUrl'));
      $e.data('ajax--url', $e.data('ajaxUrl'));
    }

    var dataset = {};

    // Prefer the element's `dataset` attribute if it exists
    // jQuery 1.x does not correctly handle data attributes with multiple dashes
    if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
      dataset = $.extend(true, {}, $e[0].dataset, $e.data());
    } else {
      dataset = $e.data();
    }

    var data = $.extend(true, {}, dataset);

    data = Utils._convertData(data);

    for (var key in data) {
      if ($.inArray(key, excludedData) > -1) {
        continue;
      }

      if ($.isPlainObject(this.options[key])) {
        $.extend(this.options[key], data[key]);
      } else {
        this.options[key] = data[key];
      }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});

S2.define('select2/core',[
  'jquery',
  './options',
  './utils',
  './keys'
], function ($, Options, Utils, KEYS) {
  var Select2 = function ($element, options) {
    if ($element.data('select2') != null) {
      $element.data('select2').destroy();
    }

    this.$element = $element;

    this.id = this._generateId($element);

    options = options || {};

    this.options = new Options(options, $element);

    Select2.__super__.constructor.call(this);

    // Set up the tabindex

    var tabindex = $element.attr('tabindex') || 0;
    $element.data('old-tabindex', tabindex);
    $element.attr('tabindex', '-1');

    // Set up containers and adapters

    var DataAdapter = this.options.get('dataAdapter');
    this.dataAdapter = new DataAdapter($element, this.options);

    var $container = this.render();

    this._placeContainer($container);

    var SelectionAdapter = this.options.get('selectionAdapter');
    this.selection = new SelectionAdapter($element, this.options);
    this.$selection = this.selection.render();

    this.selection.position(this.$selection, $container);

    var DropdownAdapter = this.options.get('dropdownAdapter');
    this.dropdown = new DropdownAdapter($element, this.options);
    this.$dropdown = this.dropdown.render();

    this.dropdown.position(this.$dropdown, $container);

    var ResultsAdapter = this.options.get('resultsAdapter');
    this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
    this.$results = this.results.render();

    this.results.position(this.$results, this.$dropdown);

    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerDataEvents();
    this._registerSelectionEvents();
    this._registerDropdownEvents();
    this._registerResultsEvents();
    this._registerEvents();

    // Set the initial state
    this.dataAdapter.current(function (initialData) {
      self.trigger('selection:update', {
        data: initialData
      });
    });

    // Hide the original select
    $element.addClass('select2-hidden-accessible');
    $element.attr('aria-hidden', 'true');

    // Synchronize any monitored attributes
    this._syncAttributes();

    $element.data('select2', this);
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype._generateId = function ($element) {
    var id = '';

    if ($element.attr('id') != null) {
      id = $element.attr('id');
    } else if ($element.attr('name') != null) {
      id = $element.attr('name') + '-' + Utils.generateChars(2);
    } else {
      id = Utils.generateChars(4);
    }

    id = id.replace(/(:|\.|\[|\]|,)/g, '');
    id = 'select2-' + id;

    return id;
  };

  Select2.prototype._placeContainer = function ($container) {
    $container.insertAfter(this.$element);

    var width = this._resolveWidth(this.$element, this.options.get('width'));

    if (width != null) {
      $container.css('width', width);
    }
  };

  Select2.prototype._resolveWidth = function ($element, method) {
    var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

    if (method == 'resolve') {
      var styleWidth = this._resolveWidth($element, 'style');

      if (styleWidth != null) {
        return styleWidth;
      }

      return this._resolveWidth($element, 'element');
    }

    if (method == 'element') {
      var elementWidth = $element.outerWidth(false);

      if (elementWidth <= 0) {
        return 'auto';
      }

      return elementWidth + 'px';
    }

    if (method == 'style') {
      var style = $element.attr('style');

      if (typeof(style) !== 'string') {
        return null;
      }

      var attrs = style.split(';');

      for (var i = 0, l = attrs.length; i < l; i = i + 1) {
        var attr = attrs[i].replace(/\s/g, '');
        var matches = attr.match(WIDTH);

        if (matches !== null && matches.length >= 1) {
          return matches[1];
        }
      }

      return null;
    }

    return method;
  };

  Select2.prototype._bindAdapters = function () {
    this.dataAdapter.bind(this, this.$container);
    this.selection.bind(this, this.$container);

    this.dropdown.bind(this, this.$container);
    this.results.bind(this, this.$container);
  };

  Select2.prototype._registerDomEvents = function () {
    var self = this;

    this.$element.on('change.select2', function () {
      self.dataAdapter.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });

    this.$element.on('focus.select2', function (evt) {
      self.trigger('focus', evt);
    });

    this._syncA = Utils.bind(this._syncAttributes, this);
    this._syncS = Utils.bind(this._syncSubtree, this);

    if (this.$element[0].attachEvent) {
      this.$element[0].attachEvent('onpropertychange', this._syncA);
    }

    var observer = window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver
    ;

    if (observer != null) {
      this._observer = new observer(function (mutations) {
        $.each(mutations, self._syncA);
        $.each(mutations, self._syncS);
      });
      this._observer.observe(this.$element[0], {
        attributes: true,
        childList: true,
        subtree: false
      });
    } else if (this.$element[0].addEventListener) {
      this.$element[0].addEventListener(
        'DOMAttrModified',
        self._syncA,
        false
      );
      this.$element[0].addEventListener(
        'DOMNodeInserted',
        self._syncS,
        false
      );
      this.$element[0].addEventListener(
        'DOMNodeRemoved',
        self._syncS,
        false
      );
    }
  };

  Select2.prototype._registerDataEvents = function () {
    var self = this;

    this.dataAdapter.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerSelectionEvents = function () {
    var self = this;
    var nonRelayEvents = ['toggle', 'focus'];

    this.selection.on('toggle', function () {
      self.toggleDropdown();
    });

    this.selection.on('focus', function (params) {
      self.focus(params);
    });

    this.selection.on('*', function (name, params) {
      if ($.inArray(name, nonRelayEvents) !== -1) {
        return;
      }

      self.trigger(name, params);
    });
  };

  Select2.prototype._registerDropdownEvents = function () {
    var self = this;

    this.dropdown.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerResultsEvents = function () {
    var self = this;

    this.results.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerEvents = function () {
    var self = this;

    this.on('open', function () {
      self.$container.addClass('select2-container--open');
    });

    this.on('close', function () {
      self.$container.removeClass('select2-container--open');
    });

    this.on('enable', function () {
      self.$container.removeClass('select2-container--disabled');
    });

    this.on('disable', function () {
      self.$container.addClass('select2-container--disabled');
    });

    this.on('blur', function () {
      self.$container.removeClass('select2-container--focus');
    });

    this.on('query', function (params) {
      if (!self.isOpen()) {
        self.trigger('open', {});
      }

      this.dataAdapter.query(params, function (data) {
        self.trigger('results:all', {
          data: data,
          query: params
        });
      });
    });

    this.on('query:append', function (params) {
      this.dataAdapter.query(params, function (data) {
        self.trigger('results:append', {
          data: data,
          query: params
        });
      });
    });

    this.on('open', function(){
      // Focus on the active element when opening dropdown.
      // Needs 1 ms delay because of other 1 ms setTimeouts when rendering.
      setTimeout(function(){
        self.focusOnActiveElement();
      }, 1);
    });

    $(document).on('keydown', function (evt) {
      var key = evt.which;
      if (self.isOpen()) {
        if (key === KEYS.ESC || key === KEYS.TAB ||
            (key === KEYS.UP && evt.altKey)) {
          self.close();

          evt.preventDefault();
        } else if (key === KEYS.ENTER) {
          self.trigger('results:select', {});

          evt.preventDefault();
        } else if ((key === KEYS.SPACE && evt.ctrlKey)) {
          self.trigger('results:toggle', {});

          evt.preventDefault();
        } else if (key === KEYS.UP) {
          self.trigger('results:previous', {});

          evt.preventDefault();
        } else if (key === KEYS.DOWN) {
          self.trigger('results:next', {});

          evt.preventDefault();
        }

        var $searchField = self.$dropdown.find('.select2-search__field');
        if (! $searchField.length) {
          $searchField = self.$container.find('.select2-search__field');
        }

        // Move the focus to the selected element on keyboard navigation.
        // Required for screen readers to work properly.
        if (key === KEYS.DOWN || key === KEYS.UP) {
            self.focusOnActiveElement();
        } else {
          // Focus on the search if user starts typing.
          $searchField.focus();
          // Focus back to active selection when finished typing.
          // Small delay so typed character can be read by screen reader.
          setTimeout(function(){
              self.focusOnActiveElement();
          }, 1000);
        }
      } else if (self.hasFocus()) {
        if (key === KEYS.ENTER || key === KEYS.SPACE ||
            key === KEYS.DOWN) {
          self.open();
          evt.preventDefault();
        }
      }
    });
  };

  Select2.prototype.focusOnActiveElement = function () {
    // Don't mess with the focus on touchscreens because it causes havoc with on-screen keyboards.
    if (this.isOpen() && ! Utils.isTouchscreen()) {
      this.$results.find('li.select2-results__option--highlighted').focus();
    }
  };

  Select2.prototype._syncAttributes = function () {
    this.options.set('disabled', this.$element.prop('disabled'));

    if (this.options.get('disabled')) {
      if (this.isOpen()) {
        this.close();
      }

      this.trigger('disable', {});
    } else {
      this.trigger('enable', {});
    }
  };

  Select2.prototype._syncSubtree = function (evt, mutations) {
    var changed = false;
    var self = this;

    // Ignore any mutation events raised for elements that aren't options or
    // optgroups. This handles the case when the select element is destroyed
    if (
      evt && evt.target && (
        evt.target.nodeName !== 'OPTION' && evt.target.nodeName !== 'OPTGROUP'
      )
    ) {
      return;
    }

    if (!mutations) {
      // If mutation events aren't supported, then we can only assume that the
      // change affected the selections
      changed = true;
    } else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
      for (var n = 0; n < mutations.addedNodes.length; n++) {
        var node = mutations.addedNodes[n];

        if (node.selected) {
          changed = true;
        }
      }
    } else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
      changed = true;
    }

    // Only re-pull the data if we think there is a change
    if (changed) {
      this.dataAdapter.current(function (currentData) {
        self.trigger('selection:update', {
          data: currentData
        });
      });
    }
  };

  /**
   * Override the trigger method to automatically trigger pre-events when
   * there are events that can be prevented.
   */
  Select2.prototype.trigger = function (name, args) {
    var actualTrigger = Select2.__super__.trigger;
    var preTriggerMap = {
      'open': 'opening',
      'close': 'closing',
      'select': 'selecting',
      'unselect': 'unselecting'
    };

    if (args === undefined) {
      args = {};
    }

    if (name in preTriggerMap) {
      var preTriggerName = preTriggerMap[name];
      var preTriggerArgs = {
        prevented: false,
        name: name,
        args: args
      };

      actualTrigger.call(this, preTriggerName, preTriggerArgs);

      if (preTriggerArgs.prevented) {
        args.prevented = true;

        return;
      }
    }

    actualTrigger.call(this, name, args);
  };

  Select2.prototype.toggleDropdown = function () {
    if (this.options.get('disabled')) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  };

  Select2.prototype.open = function () {
    if (this.isOpen()) {
      return;
    }

    this.trigger('query', {});
  };

  Select2.prototype.close = function () {
    if (!this.isOpen()) {
      return;
    }

    this.trigger('close', {});
  };

  Select2.prototype.isOpen = function () {
    return this.$container.hasClass('select2-container--open');
  };

  Select2.prototype.hasFocus = function () {
    return this.$container.hasClass('select2-container--focus');
  };

  Select2.prototype.focus = function (data) {
    // No need to re-trigger focus events if we are already focused
    if (this.hasFocus()) {
      return;
    }

    this.$container.addClass('select2-container--focus');
    this.trigger('focus', {});
  };

  Select2.prototype.enable = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("enable")` method has been deprecated and will' +
        ' be removed in later Select2 versions. Use $element.prop("disabled")' +
        ' instead.'
      );
    }

    if (args == null || args.length === 0) {
      args = [true];
    }

    var disabled = !args[0];

    this.$element.prop('disabled', disabled);
  };

  Select2.prototype.data = function () {
    if (this.options.get('debug') &&
        arguments.length > 0 && window.console && console.warn) {
      console.warn(
        'Select2: Data can no longer be set using `select2("data")`. You ' +
        'should consider setting the value instead using `$element.val()`.'
      );
    }

    var data = [];

    this.dataAdapter.current(function (currentData) {
      data = currentData;
    });

    return data;
  };

  Select2.prototype.val = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("val")` method has been deprecated and will be' +
        ' removed in later Select2 versions. Use $element.val() instead.'
      );
    }

    if (args == null || args.length === 0) {
      return this.$element.val();
    }

    var newVal = args[0];

    if ($.isArray(newVal)) {
      newVal = $.map(newVal, function (obj) {
        return obj.toString();
      });
    }

    this.$element.val(newVal).trigger('change');
  };

  Select2.prototype.destroy = function () {
    this.$container.remove();

    if (this.$element[0].detachEvent) {
      this.$element[0].detachEvent('onpropertychange', this._syncA);
    }

    if (this._observer != null) {
      this._observer.disconnect();
      this._observer = null;
    } else if (this.$element[0].removeEventListener) {
      this.$element[0]
        .removeEventListener('DOMAttrModified', this._syncA, false);
      this.$element[0]
        .removeEventListener('DOMNodeInserted', this._syncS, false);
      this.$element[0]
        .removeEventListener('DOMNodeRemoved', this._syncS, false);
    }

    this._syncA = null;
    this._syncS = null;

    this.$element.off('.select2');
    this.$element.attr('tabindex', this.$element.data('old-tabindex'));

    this.$element.removeClass('select2-hidden-accessible');
    this.$element.attr('aria-hidden', 'false');
    this.$element.removeData('select2');

    this.dataAdapter.destroy();
    this.selection.destroy();
    this.dropdown.destroy();
    this.results.destroy();

    this.dataAdapter = null;
    this.selection = null;
    this.dropdown = null;
    this.results = null;
  };

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container">' +
        '<span class="selection"></span>' +
        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
      '</span>'
    );

    $container.attr('dir', this.options.get('dir'));

    this.$container = $container;

    this.$container.addClass('select2-container--' + this.options.get('theme'));

    $container.data('element', this.$element);

    return $container;
  };

  return Select2;
});

S2.define('jquery-mousewheel',[
  'jquery'
], function ($) {
  // Used to shim jQuery.mousewheel for non-full builds.
  return $;
});

S2.define('jquery.select2',[
  'jquery',
  'jquery-mousewheel',

  './select2/core',
  './select2/defaults'
], function ($, _, Select2, Defaults) {
  if ($.fn.selectWoo == null) {
    // All methods that should return the element
    var thisMethods = ['open', 'close', 'destroy'];

    $.fn.selectWoo = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instanceOptions = $.extend(true, {}, options);

          var instance = new Select2($(this), instanceOptions);
        });

        return this;
      } else if (typeof options === 'string') {
        var ret;
        var args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
          var instance = $(this).data('select2');

          if (instance == null && window.console && console.error) {
            console.error(
              'The select2(\'' + options + '\') method was called on an ' +
              'element that is not using Select2.'
            );
          }

          ret = instance[options].apply(instance, args);
        });

        // Check if we should be returning `this`
        if ($.inArray(options, thisMethods) > -1) {
          return this;
        }

        return ret;
      } else {
        throw new Error('Invalid arguments for Select2: ' + options);
      }
    };
  }

  if ($.fn.select2 != null && $.fn.select2.defaults != null) {
    $.fn.selectWoo.defaults = $.fn.select2.defaults;
  }

  if ($.fn.selectWoo.defaults == null) {
    $.fn.selectWoo.defaults = Defaults;
  }

  // Also register selectWoo under select2 if select2 is not already present.
  $.fn.select2 = $.fn.select2 || $.fn.selectWoo;

  return Select2;
});

  // Return the AMD loader configuration so it can be used outside of this file
  return {
    define: S2.define,
    require: S2.require
  };
}());

  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var select2 = S2.require('jquery.select2');

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows Select2 to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.select2.amd = S2;
  jQuery.fn.selectWoo.amd = S2;

  // Return the Select2 instance for anyone who is importing it.
  return select2;
}));

!function(t){var e={};function r(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,function(e){return t[e]}.bind(null,a));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=79)}([function(t,e){!function(){t.exports=this.wp.element}()},function(t,e){function r(e){return t.exports=r=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},r(e)}t.exports=r},function(t,e,r){t.exports=r(36)()},function(t,e){t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}},function(t,e){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e){function r(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}t.exports=function(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),t}},function(t,e,r){var n=r(34);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&n(t,e)}},function(t,e,r){var n=r(35),a=r(3);t.exports=function(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?a(t):e}},function(t,e){!function(){t.exports=this.wp.components}()},function(t,e){!function(){t.exports=this.wp.i18n}()},function(t,e){function r(){return t.exports=r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},r.apply(this,arguments)}t.exports=r},function(t,e){t.exports=function(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}},function(t,e,r){var n=r(19),a=r(23);function o(e,r){return delete t.exports[e],t.exports[e]=r,r}t.exports={Parser:n,Tokenizer:r(20),ElementType:r(13),DomHandler:a,get FeedHandler(){return o("FeedHandler",r(43))},get Stream(){return o("Stream",r(54))},get WritableStream(){return o("WritableStream",r(26))},get ProxyHandler(){return o("ProxyHandler",r(62))},get DomUtils(){return o("DomUtils",r(25))},get CollectingHandler(){return o("CollectingHandler",r(63))},DefaultHandler:a,get RssHandler(){return o("RssHandler",this.FeedHandler)},parseDOM:function(t,e){var r=new a(e);return new n(r,e).end(t),r.dom},parseFeed:function(e,r){var a=new t.exports.FeedHandler(r);return new n(a,r).end(e),a.dom},createDomStream:function(t,e,r){var o=new a(t,e,r);return new n(o,e)},EVENTS:{attribute:2,cdatastart:0,cdataend:0,text:1,processinginstruction:2,comment:1,commentend:0,closetag:1,opentag:2,opentagname:1,error:1,end:0}}},function(t,e){t.exports={Text:"text",Directive:"directive",Comment:"comment",Script:"script",Style:"style",Tag:"tag",CDATA:"cdata",Doctype:"doctype",isTag:function(t){return"tag"===t.type||"script"===t.type||"style"===t.type}}},function(t,e){"function"==typeof Object.create?t.exports=function(t,e){e&&(t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}))}:t.exports=function(t,e){if(e){t.super_=e;var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e){return t.filter((function(t){return!(0,n.default)(t)})).map((function(t,r){var n=void 0;return"function"!=typeof e||null!==(n=e(t,r))&&!n?(0,a.default)(t,r,e):n}))};var n=o(r(38)),a=o(r(18));function o(t){return t&&t.__esModule?t:{default:t}}},function(t){t.exports=JSON.parse('{"Aacute":"Á","aacute":"á","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"Â","acirc":"â","acute":"´","Acy":"А","acy":"а","AElig":"Æ","aelig":"æ","af":"⁡","Afr":"𝔄","afr":"𝔞","Agrave":"À","agrave":"à","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"𝔸","aopf":"𝕒","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"\'","ApplyFunction":"⁡","approx":"≈","approxeq":"≊","Aring":"Å","aring":"å","Ascr":"𝒜","ascr":"𝒶","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"𝔅","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"𝔹","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"¦","bscr":"𝒷","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"Ç","ccedil":"ç","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"¸","Cedilla":"¸","cemptyv":"⦲","cent":"¢","centerdot":"·","CenterDot":"·","cfr":"𝔠","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"®","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"𝕔","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"©","COPY":"©","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"𝒞","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"°","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"𝔇","dfr":"𝔡","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"𝔻","dopf":"𝕕","Dot":"¨","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"𝒟","dscr":"𝒹","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"É","eacute":"é","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"Ê","ecirc":"ê","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"𝔈","efr":"𝔢","eg":"⪚","Egrave":"È","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"𝔼","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"𝔉","ffr":"𝔣","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"𝔽","fopf":"𝕗","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"𝔊","gfr":"𝔤","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"𝔾","gopf":"𝕘","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"½","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"𝒽","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"Í","iacute":"í","ic":"⁣","Icirc":"Î","icirc":"î","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"¡","iff":"⇔","ifr":"𝔦","Ifr":"ℑ","Igrave":"Ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"⁣","InvisibleTimes":"⁢","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"𝕀","iopf":"𝕚","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"¿","iscr":"𝒾","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"Ï","iuml":"ï","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"𝔍","jfr":"𝔧","jmath":"ȷ","Jopf":"𝕁","jopf":"𝕛","Jscr":"𝒥","jscr":"𝒿","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"𝔎","kfr":"𝔨","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"𝕂","kopf":"𝕜","Kscr":"𝒦","kscr":"𝓀","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"«","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"𝔏","lfr":"𝔩","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"𝕃","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"¯","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","mfr":"𝔪","mho":"℧","micro":"µ","midast":"*","midcir":"⫰","mid":"∣","middot":"·","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"𝕄","mopf":"𝕞","mp":"∓","mscr":"𝓂","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","nexist":"∄","nexists":"∄","Nfr":"𝔑","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"⁠","NonBreakingSpace":" ","nopf":"𝕟","Nopf":"ℕ","Not":"⫬","not":"¬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"𝒩","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"Ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"Ó","oacute":"ó","oast":"⊛","Ocirc":"Ô","ocirc":"ô","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"𝔒","ofr":"𝔬","ogon":"˛","Ograve":"Ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"𝕆","oopf":"𝕠","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"𝒪","oscr":"ℴ","Oslash":"Ø","oslash":"ø","osol":"⊘","Otilde":"Õ","otilde":"õ","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"Ö","ouml":"ö","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"¶","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"𝔓","pfr":"𝔭","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","Poincareplane":"ℌ","pointint":"⨕","popf":"𝕡","Popf":"ℙ","pound":"£","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"𝒫","pscr":"𝓅","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"𝔔","qfr":"𝔮","qint":"⨌","qopf":"𝕢","Qopf":"ℚ","qprime":"⁗","Qscr":"𝒬","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\\"","QUOT":"\\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"»","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"®","REG":"®","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"𝓇","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"𝔖","sfr":"𝔰","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"­","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"𝕊","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"𝒮","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"¹","sup2":"²","sup3":"³","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"ß","Tab":"\\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"𝔗","tfr":"𝔱","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"Þ","thorn":"þ","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"×","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"𝕋","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"𝒯","tscr":"𝓉","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"Ú","uacute":"ú","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"Û","ucirc":"û","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"𝔘","ufr":"𝔲","Ugrave":"Ù","ugrave":"ù","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"¨","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"𝕌","uopf":"𝕦","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"𝒰","uscr":"𝓊","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"Ü","uuml":"ü","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"𝕍","vopf":"𝕧","vprop":"∝","vrtri":"⊳","Vscr":"𝒱","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"𝔚","wfr":"𝔴","Wopf":"𝕎","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","Wscr":"𝒲","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"𝔛","xfr":"𝔵","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"𝕏","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"𝒳","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"Ý","yacute":"ý","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"¥","Yfr":"𝔜","yfr":"𝔶","YIcy":"Ї","yicy":"ї","Yopf":"𝕐","yopf":"𝕪","Yscr":"𝒴","yscr":"𝓎","YUcy":"Ю","yucy":"ю","yuml":"ÿ","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"​","Zeta":"Ζ","zeta":"ζ","zfr":"𝔷","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","Zopf":"ℤ","Zscr":"𝒵","zscr":"𝓏","zwj":"‍","zwnj":"‌"}')},function(t){t.exports=JSON.parse('{"amp":"&","apos":"\'","gt":">","lt":"<","quot":"\\""}')},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e,r){return o.default[t.type](t,e,r)};var n,a=r(39),o=(n=a)&&n.__esModule?n:{default:n}},function(t,e,r){var n=r(20),a={input:!0,option:!0,optgroup:!0,select:!0,button:!0,datalist:!0,textarea:!0},o={tr:{tr:!0,th:!0,td:!0},th:{th:!0},td:{thead:!0,th:!0,td:!0},body:{head:!0,link:!0,script:!0},li:{li:!0},p:{p:!0},h1:{p:!0},h2:{p:!0},h3:{p:!0},h4:{p:!0},h5:{p:!0},h6:{p:!0},select:a,input:a,output:a,button:a,datalist:a,textarea:a,option:{option:!0},optgroup:{optgroup:!0}},i={__proto__:null,area:!0,base:!0,basefont:!0,br:!0,col:!0,command:!0,embed:!0,frame:!0,hr:!0,img:!0,input:!0,isindex:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},s={__proto__:null,math:!0,svg:!0},c={__proto__:null,mi:!0,mo:!0,mn:!0,ms:!0,mtext:!0,"annotation-xml":!0,foreignObject:!0,desc:!0,title:!0},l=/\s|\//;function u(t,e){this._options=e||{},this._cbs=t||{},this._tagname="",this._attribname="",this._attribvalue="",this._attribs=null,this._stack=[],this._foreignContext=[],this.startIndex=0,this.endIndex=null,this._lowerCaseTagNames="lowerCaseTags"in this._options?!!this._options.lowerCaseTags:!this._options.xmlMode,this._lowerCaseAttributeNames="lowerCaseAttributeNames"in this._options?!!this._options.lowerCaseAttributeNames:!this._options.xmlMode,this._options.Tokenizer&&(n=this._options.Tokenizer),this._tokenizer=new n(this._options,this),this._cbs.onparserinit&&this._cbs.onparserinit(this)}r(14)(u,r(41).EventEmitter),u.prototype._updatePosition=function(t){null===this.endIndex?this._tokenizer._sectionStart<=t?this.startIndex=0:this.startIndex=this._tokenizer._sectionStart-t:this.startIndex=this.endIndex+1,this.endIndex=this._tokenizer.getAbsoluteIndex()},u.prototype.ontext=function(t){this._updatePosition(1),this.endIndex--,this._cbs.ontext&&this._cbs.ontext(t)},u.prototype.onopentagname=function(t){if(this._lowerCaseTagNames&&(t=t.toLowerCase()),this._tagname=t,!this._options.xmlMode&&t in o)for(var e;(e=this._stack[this._stack.length-1])in o[t];this.onclosetag(e));!this._options.xmlMode&&t in i||(this._stack.push(t),t in s?this._foreignContext.push(!0):t in c&&this._foreignContext.push(!1)),this._cbs.onopentagname&&this._cbs.onopentagname(t),this._cbs.onopentag&&(this._attribs={})},u.prototype.onopentagend=function(){this._updatePosition(1),this._attribs&&(this._cbs.onopentag&&this._cbs.onopentag(this._tagname,this._attribs),this._attribs=null),!this._options.xmlMode&&this._cbs.onclosetag&&this._tagname in i&&this._cbs.onclosetag(this._tagname),this._tagname=""},u.prototype.onclosetag=function(t){if(this._updatePosition(1),this._lowerCaseTagNames&&(t=t.toLowerCase()),(t in s||t in c)&&this._foreignContext.pop(),!this._stack.length||t in i&&!this._options.xmlMode)this._options.xmlMode||"br"!==t&&"p"!==t||(this.onopentagname(t),this._closeCurrentTag());else{var e=this._stack.lastIndexOf(t);if(-1!==e)if(this._cbs.onclosetag)for(e=this._stack.length-e;e--;)this._cbs.onclosetag(this._stack.pop());else this._stack.length=e;else"p"!==t||this._options.xmlMode||(this.onopentagname(t),this._closeCurrentTag())}},u.prototype.onselfclosingtag=function(){this._options.xmlMode||this._options.recognizeSelfClosing||this._foreignContext[this._foreignContext.length-1]?this._closeCurrentTag():this.onopentagend()},u.prototype._closeCurrentTag=function(){var t=this._tagname;this.onopentagend(),this._stack[this._stack.length-1]===t&&(this._cbs.onclosetag&&this._cbs.onclosetag(t),this._stack.pop())},u.prototype.onattribname=function(t){this._lowerCaseAttributeNames&&(t=t.toLowerCase()),this._attribname=t},u.prototype.onattribdata=function(t){this._attribvalue+=t},u.prototype.onattribend=function(){this._cbs.onattribute&&this._cbs.onattribute(this._attribname,this._attribvalue),this._attribs&&!Object.prototype.hasOwnProperty.call(this._attribs,this._attribname)&&(this._attribs[this._attribname]=this._attribvalue),this._attribname="",this._attribvalue=""},u.prototype._getInstructionName=function(t){var e=t.search(l),r=e<0?t:t.substr(0,e);return this._lowerCaseTagNames&&(r=r.toLowerCase()),r},u.prototype.ondeclaration=function(t){if(this._cbs.onprocessinginstruction){var e=this._getInstructionName(t);this._cbs.onprocessinginstruction("!"+e,"!"+t)}},u.prototype.onprocessinginstruction=function(t){if(this._cbs.onprocessinginstruction){var e=this._getInstructionName(t);this._cbs.onprocessinginstruction("?"+e,"?"+t)}},u.prototype.oncomment=function(t){this._updatePosition(4),this._cbs.oncomment&&this._cbs.oncomment(t),this._cbs.oncommentend&&this._cbs.oncommentend()},u.prototype.oncdata=function(t){this._updatePosition(1),this._options.xmlMode||this._options.recognizeCDATA?(this._cbs.oncdatastart&&this._cbs.oncdatastart(),this._cbs.ontext&&this._cbs.ontext(t),this._cbs.oncdataend&&this._cbs.oncdataend()):this.oncomment("[CDATA["+t+"]]")},u.prototype.onerror=function(t){this._cbs.onerror&&this._cbs.onerror(t)},u.prototype.onend=function(){if(this._cbs.onclosetag)for(var t=this._stack.length;t>0;this._cbs.onclosetag(this._stack[--t]));this._cbs.onend&&this._cbs.onend()},u.prototype.reset=function(){this._cbs.onreset&&this._cbs.onreset(),this._tokenizer.reset(),this._tagname="",this._attribname="",this._attribs=null,this._stack=[],this._cbs.onparserinit&&this._cbs.onparserinit(this)},u.prototype.parseComplete=function(t){this.reset(),this.end(t)},u.prototype.write=function(t){this._tokenizer.write(t)},u.prototype.end=function(t){this._tokenizer.end(t)},u.prototype.pause=function(){this._tokenizer.pause()},u.prototype.resume=function(){this._tokenizer.resume()},u.prototype.parseChunk=u.prototype.write,u.prototype.done=u.prototype.end,t.exports=u},function(t,e,r){t.exports=gt;var n=r(21),a=r(16),o=r(22),i=r(17),s=0,c=s++,l=s++,u=s++,p=s++,h=s++,f=s++,d=s++,m=s++,g=s++,b=s++,v=s++,y=s++,_=s++,w=s++,O=s++,k=s++,E=s++,j=s++,C=s++,S=s++,x=s++,N=s++,R=s++,T=s++,A=s++,D=s++,z=s++,P=s++,L=s++,q=s++,I=s++,B=s++,M=s++,V=s++,U=s++,Q=s++,H=s++,F=s++,G=s++,Y=s++,J=s++,X=s++,W=s++,Z=s++,K=s++,$=s++,tt=s++,et=s++,rt=s++,nt=s++,at=s++,ot=s++,it=s++,st=s++,ct=s++,lt=0,ut=lt++,pt=lt++,ht=lt++;function ft(t){return" "===t||"\n"===t||"\t"===t||"\f"===t||"\r"===t}function dt(t,e,r){var n=t.toLowerCase();return t===n?function(t){t===n?this._state=e:(this._state=r,this._index--)}:function(a){a===n||a===t?this._state=e:(this._state=r,this._index--)}}function mt(t,e){var r=t.toLowerCase();return function(n){n===r||n===t?this._state=e:(this._state=u,this._index--)}}function gt(t,e){this._state=c,this._buffer="",this._sectionStart=0,this._index=0,this._bufferOffset=0,this._baseState=c,this._special=ut,this._cbs=e,this._running=!0,this._ended=!1,this._xmlMode=!(!t||!t.xmlMode),this._decodeEntities=!(!t||!t.decodeEntities)}gt.prototype._stateText=function(t){"<"===t?(this._index>this._sectionStart&&this._cbs.ontext(this._getSection()),this._state=l,this._sectionStart=this._index):this._decodeEntities&&this._special===ut&&"&"===t&&(this._index>this._sectionStart&&this._cbs.ontext(this._getSection()),this._baseState=c,this._state=at,this._sectionStart=this._index)},gt.prototype._stateBeforeTagName=function(t){"/"===t?this._state=h:"<"===t?(this._cbs.ontext(this._getSection()),this._sectionStart=this._index):">"===t||this._special!==ut||ft(t)?this._state=c:"!"===t?(this._state=O,this._sectionStart=this._index+1):"?"===t?(this._state=E,this._sectionStart=this._index+1):(this._state=this._xmlMode||"s"!==t&&"S"!==t?u:I,this._sectionStart=this._index)},gt.prototype._stateInTagName=function(t){("/"===t||">"===t||ft(t))&&(this._emitToken("onopentagname"),this._state=m,this._index--)},gt.prototype._stateBeforeCloseingTagName=function(t){ft(t)||(">"===t?this._state=c:this._special!==ut?"s"===t||"S"===t?this._state=B:(this._state=c,this._index--):(this._state=f,this._sectionStart=this._index))},gt.prototype._stateInCloseingTagName=function(t){(">"===t||ft(t))&&(this._emitToken("onclosetag"),this._state=d,this._index--)},gt.prototype._stateAfterCloseingTagName=function(t){">"===t&&(this._state=c,this._sectionStart=this._index+1)},gt.prototype._stateBeforeAttributeName=function(t){">"===t?(this._cbs.onopentagend(),this._state=c,this._sectionStart=this._index+1):"/"===t?this._state=p:ft(t)||(this._state=g,this._sectionStart=this._index)},gt.prototype._stateInSelfClosingTag=function(t){">"===t?(this._cbs.onselfclosingtag(),this._state=c,this._sectionStart=this._index+1):ft(t)||(this._state=m,this._index--)},gt.prototype._stateInAttributeName=function(t){("="===t||"/"===t||">"===t||ft(t))&&(this._cbs.onattribname(this._getSection()),this._sectionStart=-1,this._state=b,this._index--)},gt.prototype._stateAfterAttributeName=function(t){"="===t?this._state=v:"/"===t||">"===t?(this._cbs.onattribend(),this._state=m,this._index--):ft(t)||(this._cbs.onattribend(),this._state=g,this._sectionStart=this._index)},gt.prototype._stateBeforeAttributeValue=function(t){'"'===t?(this._state=y,this._sectionStart=this._index+1):"'"===t?(this._state=_,this._sectionStart=this._index+1):ft(t)||(this._state=w,this._sectionStart=this._index,this._index--)},gt.prototype._stateInAttributeValueDoubleQuotes=function(t){'"'===t?(this._emitToken("onattribdata"),this._cbs.onattribend(),this._state=m):this._decodeEntities&&"&"===t&&(this._emitToken("onattribdata"),this._baseState=this._state,this._state=at,this._sectionStart=this._index)},gt.prototype._stateInAttributeValueSingleQuotes=function(t){"'"===t?(this._emitToken("onattribdata"),this._cbs.onattribend(),this._state=m):this._decodeEntities&&"&"===t&&(this._emitToken("onattribdata"),this._baseState=this._state,this._state=at,this._sectionStart=this._index)},gt.prototype._stateInAttributeValueNoQuotes=function(t){ft(t)||">"===t?(this._emitToken("onattribdata"),this._cbs.onattribend(),this._state=m,this._index--):this._decodeEntities&&"&"===t&&(this._emitToken("onattribdata"),this._baseState=this._state,this._state=at,this._sectionStart=this._index)},gt.prototype._stateBeforeDeclaration=function(t){this._state="["===t?N:"-"===t?j:k},gt.prototype._stateInDeclaration=function(t){">"===t&&(this._cbs.ondeclaration(this._getSection()),this._state=c,this._sectionStart=this._index+1)},gt.prototype._stateInProcessingInstruction=function(t){">"===t&&(this._cbs.onprocessinginstruction(this._getSection()),this._state=c,this._sectionStart=this._index+1)},gt.prototype._stateBeforeComment=function(t){"-"===t?(this._state=C,this._sectionStart=this._index+1):this._state=k},gt.prototype._stateInComment=function(t){"-"===t&&(this._state=S)},gt.prototype._stateAfterComment1=function(t){this._state="-"===t?x:C},gt.prototype._stateAfterComment2=function(t){">"===t?(this._cbs.oncomment(this._buffer.substring(this._sectionStart,this._index-2)),this._state=c,this._sectionStart=this._index+1):"-"!==t&&(this._state=C)},gt.prototype._stateBeforeCdata1=dt("C",R,k),gt.prototype._stateBeforeCdata2=dt("D",T,k),gt.prototype._stateBeforeCdata3=dt("A",A,k),gt.prototype._stateBeforeCdata4=dt("T",D,k),gt.prototype._stateBeforeCdata5=dt("A",z,k),gt.prototype._stateBeforeCdata6=function(t){"["===t?(this._state=P,this._sectionStart=this._index+1):(this._state=k,this._index--)},gt.prototype._stateInCdata=function(t){"]"===t&&(this._state=L)},gt.prototype._stateAfterCdata1=function(t){this._state="]"===t?q:P},gt.prototype._stateAfterCdata2=function(t){">"===t?(this._cbs.oncdata(this._buffer.substring(this._sectionStart,this._index-2)),this._state=c,this._sectionStart=this._index+1):"]"!==t&&(this._state=P)},gt.prototype._stateBeforeSpecial=function(t){"c"===t||"C"===t?this._state=M:"t"===t||"T"===t?this._state=W:(this._state=u,this._index--)},gt.prototype._stateBeforeSpecialEnd=function(t){this._special!==pt||"c"!==t&&"C"!==t?this._special!==ht||"t"!==t&&"T"!==t?this._state=c:this._state=tt:this._state=F},gt.prototype._stateBeforeScript1=mt("R",V),gt.prototype._stateBeforeScript2=mt("I",U),gt.prototype._stateBeforeScript3=mt("P",Q),gt.prototype._stateBeforeScript4=mt("T",H),gt.prototype._stateBeforeScript5=function(t){("/"===t||">"===t||ft(t))&&(this._special=pt),this._state=u,this._index--},gt.prototype._stateAfterScript1=dt("R",G,c),gt.prototype._stateAfterScript2=dt("I",Y,c),gt.prototype._stateAfterScript3=dt("P",J,c),gt.prototype._stateAfterScript4=dt("T",X,c),gt.prototype._stateAfterScript5=function(t){">"===t||ft(t)?(this._special=ut,this._state=f,this._sectionStart=this._index-6,this._index--):this._state=c},gt.prototype._stateBeforeStyle1=mt("Y",Z),gt.prototype._stateBeforeStyle2=mt("L",K),gt.prototype._stateBeforeStyle3=mt("E",$),gt.prototype._stateBeforeStyle4=function(t){("/"===t||">"===t||ft(t))&&(this._special=ht),this._state=u,this._index--},gt.prototype._stateAfterStyle1=dt("Y",et,c),gt.prototype._stateAfterStyle2=dt("L",rt,c),gt.prototype._stateAfterStyle3=dt("E",nt,c),gt.prototype._stateAfterStyle4=function(t){">"===t||ft(t)?(this._special=ut,this._state=f,this._sectionStart=this._index-5,this._index--):this._state=c},gt.prototype._stateBeforeEntity=dt("#",ot,it),gt.prototype._stateBeforeNumericEntity=dt("X",ct,st),gt.prototype._parseNamedEntityStrict=function(){if(this._sectionStart+1<this._index){var t=this._buffer.substring(this._sectionStart+1,this._index),e=this._xmlMode?i:a;e.hasOwnProperty(t)&&(this._emitPartial(e[t]),this._sectionStart=this._index+1)}},gt.prototype._parseLegacyEntity=function(){var t=this._sectionStart+1,e=this._index-t;for(e>6&&(e=6);e>=2;){var r=this._buffer.substr(t,e);if(o.hasOwnProperty(r))return this._emitPartial(o[r]),void(this._sectionStart+=e+1);e--}},gt.prototype._stateInNamedEntity=function(t){";"===t?(this._parseNamedEntityStrict(),this._sectionStart+1<this._index&&!this._xmlMode&&this._parseLegacyEntity(),this._state=this._baseState):(t<"a"||t>"z")&&(t<"A"||t>"Z")&&(t<"0"||t>"9")&&(this._xmlMode||this._sectionStart+1===this._index||(this._baseState!==c?"="!==t&&this._parseNamedEntityStrict():this._parseLegacyEntity()),this._state=this._baseState,this._index--)},gt.prototype._decodeNumericEntity=function(t,e){var r=this._sectionStart+t;if(r!==this._index){var a=this._buffer.substring(r,this._index),o=parseInt(a,e);this._emitPartial(n(o)),this._sectionStart=this._index}else this._sectionStart--;this._state=this._baseState},gt.prototype._stateInNumericEntity=function(t){";"===t?(this._decodeNumericEntity(2,10),this._sectionStart++):(t<"0"||t>"9")&&(this._xmlMode?this._state=this._baseState:this._decodeNumericEntity(2,10),this._index--)},gt.prototype._stateInHexEntity=function(t){";"===t?(this._decodeNumericEntity(3,16),this._sectionStart++):(t<"a"||t>"f")&&(t<"A"||t>"F")&&(t<"0"||t>"9")&&(this._xmlMode?this._state=this._baseState:this._decodeNumericEntity(3,16),this._index--)},gt.prototype._cleanup=function(){this._sectionStart<0?(this._buffer="",this._bufferOffset+=this._index,this._index=0):this._running&&(this._state===c?(this._sectionStart!==this._index&&this._cbs.ontext(this._buffer.substr(this._sectionStart)),this._buffer="",this._bufferOffset+=this._index,this._index=0):this._sectionStart===this._index?(this._buffer="",this._bufferOffset+=this._index,this._index=0):(this._buffer=this._buffer.substr(this._sectionStart),this._index-=this._sectionStart,this._bufferOffset+=this._sectionStart),this._sectionStart=0)},gt.prototype.write=function(t){this._ended&&this._cbs.onerror(Error(".write() after done!")),this._buffer+=t,this._parse()},gt.prototype._parse=function(){for(;this._index<this._buffer.length&&this._running;){var t=this._buffer.charAt(this._index);this._state===c?this._stateText(t):this._state===l?this._stateBeforeTagName(t):this._state===u?this._stateInTagName(t):this._state===h?this._stateBeforeCloseingTagName(t):this._state===f?this._stateInCloseingTagName(t):this._state===d?this._stateAfterCloseingTagName(t):this._state===p?this._stateInSelfClosingTag(t):this._state===m?this._stateBeforeAttributeName(t):this._state===g?this._stateInAttributeName(t):this._state===b?this._stateAfterAttributeName(t):this._state===v?this._stateBeforeAttributeValue(t):this._state===y?this._stateInAttributeValueDoubleQuotes(t):this._state===_?this._stateInAttributeValueSingleQuotes(t):this._state===w?this._stateInAttributeValueNoQuotes(t):this._state===O?this._stateBeforeDeclaration(t):this._state===k?this._stateInDeclaration(t):this._state===E?this._stateInProcessingInstruction(t):this._state===j?this._stateBeforeComment(t):this._state===C?this._stateInComment(t):this._state===S?this._stateAfterComment1(t):this._state===x?this._stateAfterComment2(t):this._state===N?this._stateBeforeCdata1(t):this._state===R?this._stateBeforeCdata2(t):this._state===T?this._stateBeforeCdata3(t):this._state===A?this._stateBeforeCdata4(t):this._state===D?this._stateBeforeCdata5(t):this._state===z?this._stateBeforeCdata6(t):this._state===P?this._stateInCdata(t):this._state===L?this._stateAfterCdata1(t):this._state===q?this._stateAfterCdata2(t):this._state===I?this._stateBeforeSpecial(t):this._state===B?this._stateBeforeSpecialEnd(t):this._state===M?this._stateBeforeScript1(t):this._state===V?this._stateBeforeScript2(t):this._state===U?this._stateBeforeScript3(t):this._state===Q?this._stateBeforeScript4(t):this._state===H?this._stateBeforeScript5(t):this._state===F?this._stateAfterScript1(t):this._state===G?this._stateAfterScript2(t):this._state===Y?this._stateAfterScript3(t):this._state===J?this._stateAfterScript4(t):this._state===X?this._stateAfterScript5(t):this._state===W?this._stateBeforeStyle1(t):this._state===Z?this._stateBeforeStyle2(t):this._state===K?this._stateBeforeStyle3(t):this._state===$?this._stateBeforeStyle4(t):this._state===tt?this._stateAfterStyle1(t):this._state===et?this._stateAfterStyle2(t):this._state===rt?this._stateAfterStyle3(t):this._state===nt?this._stateAfterStyle4(t):this._state===at?this._stateBeforeEntity(t):this._state===ot?this._stateBeforeNumericEntity(t):this._state===it?this._stateInNamedEntity(t):this._state===st?this._stateInNumericEntity(t):this._state===ct?this._stateInHexEntity(t):this._cbs.onerror(Error("unknown _state"),this._state),this._index++}this._cleanup()},gt.prototype.pause=function(){this._running=!1},gt.prototype.resume=function(){this._running=!0,this._index<this._buffer.length&&this._parse(),this._ended&&this._finish()},gt.prototype.end=function(t){this._ended&&this._cbs.onerror(Error(".end() after done!")),t&&this.write(t),this._ended=!0,this._running&&this._finish()},gt.prototype._finish=function(){this._sectionStart<this._index&&this._handleTrailingData(),this._cbs.onend()},gt.prototype._handleTrailingData=function(){var t=this._buffer.substr(this._sectionStart);this._state===P||this._state===L||this._state===q?this._cbs.oncdata(t):this._state===C||this._state===S||this._state===x?this._cbs.oncomment(t):this._state!==it||this._xmlMode?this._state!==st||this._xmlMode?this._state!==ct||this._xmlMode?this._state!==u&&this._state!==m&&this._state!==v&&this._state!==b&&this._state!==g&&this._state!==_&&this._state!==y&&this._state!==w&&this._state!==f&&this._cbs.ontext(t):(this._decodeNumericEntity(3,16),this._sectionStart<this._index&&(this._state=this._baseState,this._handleTrailingData())):(this._decodeNumericEntity(2,10),this._sectionStart<this._index&&(this._state=this._baseState,this._handleTrailingData())):(this._parseLegacyEntity(),this._sectionStart<this._index&&(this._state=this._baseState,this._handleTrailingData()))},gt.prototype.reset=function(){gt.call(this,{xmlMode:this._xmlMode,decodeEntities:this._decodeEntities},this._cbs)},gt.prototype.getAbsoluteIndex=function(){return this._bufferOffset+this._index},gt.prototype._getSection=function(){return this._buffer.substring(this._sectionStart,this._index)},gt.prototype._emitToken=function(t){this._cbs[t](this._getSection()),this._sectionStart=-1},gt.prototype._emitPartial=function(t){this._baseState!==c?this._cbs.onattribdata(t):this._cbs.ontext(t)}},function(t,e,r){var n=r(40);t.exports=function(t){if(t>=55296&&t<=57343||t>1114111)return"�";t in n&&(t=n[t]);var e="";t>65535&&(t-=65536,e+=String.fromCharCode(t>>>10&1023|55296),t=56320|1023&t);return e+=String.fromCharCode(t)}},function(t){t.exports=JSON.parse('{"Aacute":"Á","aacute":"á","Acirc":"Â","acirc":"â","acute":"´","AElig":"Æ","aelig":"æ","Agrave":"À","agrave":"à","amp":"&","AMP":"&","Aring":"Å","aring":"å","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","brvbar":"¦","Ccedil":"Ç","ccedil":"ç","cedil":"¸","cent":"¢","copy":"©","COPY":"©","curren":"¤","deg":"°","divide":"÷","Eacute":"É","eacute":"é","Ecirc":"Ê","ecirc":"ê","Egrave":"È","egrave":"è","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","frac12":"½","frac14":"¼","frac34":"¾","gt":">","GT":">","Iacute":"Í","iacute":"í","Icirc":"Î","icirc":"î","iexcl":"¡","Igrave":"Ì","igrave":"ì","iquest":"¿","Iuml":"Ï","iuml":"ï","laquo":"«","lt":"<","LT":"<","macr":"¯","micro":"µ","middot":"·","nbsp":" ","not":"¬","Ntilde":"Ñ","ntilde":"ñ","Oacute":"Ó","oacute":"ó","Ocirc":"Ô","ocirc":"ô","Ograve":"Ò","ograve":"ò","ordf":"ª","ordm":"º","Oslash":"Ø","oslash":"ø","Otilde":"Õ","otilde":"õ","Ouml":"Ö","ouml":"ö","para":"¶","plusmn":"±","pound":"£","quot":"\\"","QUOT":"\\"","raquo":"»","reg":"®","REG":"®","sect":"§","shy":"­","sup1":"¹","sup2":"²","sup3":"³","szlig":"ß","THORN":"Þ","thorn":"þ","times":"×","Uacute":"Ú","uacute":"ú","Ucirc":"Û","ucirc":"û","Ugrave":"Ù","ugrave":"ù","uml":"¨","Uuml":"Ü","uuml":"ü","Yacute":"Ý","yacute":"ý","yen":"¥","yuml":"ÿ"}')},function(t,e,r){var n=r(13),a=/\s+/g,o=r(24),i=r(42);function s(t,e,r){"object"==typeof t?(r=e,e=t,t=null):"function"==typeof e&&(r=e,e=c),this._callback=t,this._options=e||c,this._elementCB=r,this.dom=[],this._done=!1,this._tagStack=[],this._parser=this._parser||null}var c={normalizeWhitespace:!1,withStartIndices:!1,withEndIndices:!1};s.prototype.onparserinit=function(t){this._parser=t},s.prototype.onreset=function(){s.call(this,this._callback,this._options,this._elementCB)},s.prototype.onend=function(){this._done||(this._done=!0,this._parser=null,this._handleCallback(null))},s.prototype._handleCallback=s.prototype.onerror=function(t){if("function"==typeof this._callback)this._callback(t,this.dom);else if(t)throw t},s.prototype.onclosetag=function(){var t=this._tagStack.pop();this._options.withEndIndices&&t&&(t.endIndex=this._parser.endIndex),this._elementCB&&this._elementCB(t)},s.prototype._createDomElement=function(t){if(!this._options.withDomLvl1)return t;var e;for(var r in e="tag"===t.type?Object.create(i):Object.create(o),t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e},s.prototype._addDomElement=function(t){var e=this._tagStack[this._tagStack.length-1],r=e?e.children:this.dom,n=r[r.length-1];t.next=null,this._options.withStartIndices&&(t.startIndex=this._parser.startIndex),this._options.withEndIndices&&(t.endIndex=this._parser.endIndex),n?(t.prev=n,n.next=t):t.prev=null,r.push(t),t.parent=e||null},s.prototype.onopentag=function(t,e){var r={type:"script"===t?n.Script:"style"===t?n.Style:n.Tag,name:t,attribs:e,children:[]},a=this._createDomElement(r);this._addDomElement(a),this._tagStack.push(a)},s.prototype.ontext=function(t){var e,r=this._options.normalizeWhitespace||this._options.ignoreWhitespace;if(!this._tagStack.length&&this.dom.length&&(e=this.dom[this.dom.length-1]).type===n.Text)r?e.data=(e.data+t).replace(a," "):e.data+=t;else if(this._tagStack.length&&(e=this._tagStack[this._tagStack.length-1])&&(e=e.children[e.children.length-1])&&e.type===n.Text)r?e.data=(e.data+t).replace(a," "):e.data+=t;else{r&&(t=t.replace(a," "));var o=this._createDomElement({data:t,type:n.Text});this._addDomElement(o)}},s.prototype.oncomment=function(t){var e=this._tagStack[this._tagStack.length-1];if(e&&e.type===n.Comment)e.data+=t;else{var r={data:t,type:n.Comment},a=this._createDomElement(r);this._addDomElement(a),this._tagStack.push(a)}},s.prototype.oncdatastart=function(){var t={children:[{data:"",type:n.Text}],type:n.CDATA},e=this._createDomElement(t);this._addDomElement(e),this._tagStack.push(e)},s.prototype.oncommentend=s.prototype.oncdataend=function(){this._tagStack.pop()},s.prototype.onprocessinginstruction=function(t,e){var r=this._createDomElement({name:t,data:e,type:n.Directive});this._addDomElement(r)},t.exports=s},function(t,e){var r=t.exports={get firstChild(){var t=this.children;return t&&t[0]||null},get lastChild(){var t=this.children;return t&&t[t.length-1]||null},get nodeType(){return a[this.type]||a.element}},n={tagName:"name",childNodes:"children",parentNode:"parent",previousSibling:"prev",nextSibling:"next",nodeValue:"data"},a={element:1,text:3,cdata:4,comment:8};Object.keys(n).forEach((function(t){var e=n[t];Object.defineProperty(r,t,{get:function(){return this[e]||null},set:function(t){return this[e]=t,t}})}))},function(t,e,r){var n=t.exports;[r(44),r(49),r(50),r(51),r(52),r(53)].forEach((function(t){Object.keys(t).forEach((function(e){n[e]=t[e].bind(n)}))}))},function(t,e,r){t.exports=s;var n=r(19),a=r(55).Writable,o=r(56).StringDecoder,i=r(27).Buffer;function s(t,e){var r=this._parser=new n(t,e),i=this._decoder=new o;a.call(this,{decodeStrings:!1}),this.once("finish",(function(){r.end(i.end())}))}r(14)(s,a),s.prototype._write=function(t,e,r){t instanceof i&&(t=this._decoder.write(t)),this._parser.write(t),r()}},function(t,e,r){"use strict";(function(t){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
var n=r(59),a=r(60),o=r(61);function i(){return c.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function s(t,e){if(i()<e)throw new RangeError("Invalid typed array length");return c.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(e)).__proto__=c.prototype:(null===t&&(t=new c(e)),t.length=e),t}function c(t,e,r){if(!(c.TYPED_ARRAY_SUPPORT||this instanceof c))return new c(t,e,r);if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string");return p(this,t)}return l(this,t,e,r)}function l(t,e,r,n){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer?function(t,e,r,n){if(e.byteLength,r<0||e.byteLength<r)throw new RangeError("'offset' is out of bounds");if(e.byteLength<r+(n||0))throw new RangeError("'length' is out of bounds");e=void 0===r&&void 0===n?new Uint8Array(e):void 0===n?new Uint8Array(e,r):new Uint8Array(e,r,n);c.TYPED_ARRAY_SUPPORT?(t=e).__proto__=c.prototype:t=h(t,e);return t}(t,e,r,n):"string"==typeof e?function(t,e,r){"string"==typeof r&&""!==r||(r="utf8");if(!c.isEncoding(r))throw new TypeError('"encoding" must be a valid string encoding');var n=0|d(e,r),a=(t=s(t,n)).write(e,r);a!==n&&(t=t.slice(0,a));return t}(t,e,r):function(t,e){if(c.isBuffer(e)){var r=0|f(e.length);return 0===(t=s(t,r)).length||e.copy(t,0,0,r),t}if(e){if("undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return"number"!=typeof e.length||(n=e.length)!=n?s(t,0):h(t,e);if("Buffer"===e.type&&o(e.data))return h(t,e.data)}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(t,e)}function u(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function p(t,e){if(u(e),t=s(t,e<0?0:0|f(e)),!c.TYPED_ARRAY_SUPPORT)for(var r=0;r<e;++r)t[r]=0;return t}function h(t,e){var r=e.length<0?0:0|f(e.length);t=s(t,r);for(var n=0;n<r;n+=1)t[n]=255&e[n];return t}function f(t){if(t>=i())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i().toString(16)+" bytes");return 0|t}function d(t,e){if(c.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var r=t.length;if(0===r)return 0;for(var n=!1;;)switch(e){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return M(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return V(t).length;default:if(n)return M(t).length;e=(""+e).toLowerCase(),n=!0}}function m(t,e,r){var n=!1;if((void 0===e||e<0)&&(e=0),e>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(e>>>=0))return"";for(t||(t="utf8");;)switch(t){case"hex":return N(this,e,r);case"utf8":case"utf-8":return C(this,e,r);case"ascii":return S(this,e,r);case"latin1":case"binary":return x(this,e,r);case"base64":return j(this,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return R(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}function g(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}function b(t,e,r,n,a){if(0===t.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,isNaN(r)&&(r=a?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(a)return-1;r=t.length-1}else if(r<0){if(!a)return-1;r=0}if("string"==typeof e&&(e=c.from(e,n)),c.isBuffer(e))return 0===e.length?-1:v(t,e,r,n,a);if("number"==typeof e)return e&=255,c.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?a?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):v(t,[e],r,n,a);throw new TypeError("val must be string, number or Buffer")}function v(t,e,r,n,a){var o,i=1,s=t.length,c=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return-1;i=2,s/=2,c/=2,r/=2}function l(t,e){return 1===i?t[e]:t.readUInt16BE(e*i)}if(a){var u=-1;for(o=r;o<s;o++)if(l(t,o)===l(e,-1===u?0:o-u)){if(-1===u&&(u=o),o-u+1===c)return u*i}else-1!==u&&(o-=o-u),u=-1}else for(r+c>s&&(r=s-c),o=r;o>=0;o--){for(var p=!0,h=0;h<c;h++)if(l(t,o+h)!==l(e,h)){p=!1;break}if(p)return o}return-1}function y(t,e,r,n){r=Number(r)||0;var a=t.length-r;n?(n=Number(n))>a&&(n=a):n=a;var o=e.length;if(o%2!=0)throw new TypeError("Invalid hex string");n>o/2&&(n=o/2);for(var i=0;i<n;++i){var s=parseInt(e.substr(2*i,2),16);if(isNaN(s))return i;t[r+i]=s}return i}function _(t,e,r,n){return U(M(e,t.length-r),t,r,n)}function w(t,e,r,n){return U(function(t){for(var e=[],r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function O(t,e,r,n){return w(t,e,r,n)}function k(t,e,r,n){return U(V(e),t,r,n)}function E(t,e,r,n){return U(function(t,e){for(var r,n,a,o=[],i=0;i<t.length&&!((e-=2)<0);++i)r=t.charCodeAt(i),n=r>>8,a=r%256,o.push(a),o.push(n);return o}(e,t.length-r),t,r,n)}function j(t,e,r){return 0===e&&r===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(e,r))}function C(t,e,r){r=Math.min(t.length,r);for(var n=[],a=e;a<r;){var o,i,s,c,l=t[a],u=null,p=l>239?4:l>223?3:l>191?2:1;if(a+p<=r)switch(p){case 1:l<128&&(u=l);break;case 2:128==(192&(o=t[a+1]))&&(c=(31&l)<<6|63&o)>127&&(u=c);break;case 3:o=t[a+1],i=t[a+2],128==(192&o)&&128==(192&i)&&(c=(15&l)<<12|(63&o)<<6|63&i)>2047&&(c<55296||c>57343)&&(u=c);break;case 4:o=t[a+1],i=t[a+2],s=t[a+3],128==(192&o)&&128==(192&i)&&128==(192&s)&&(c=(15&l)<<18|(63&o)<<12|(63&i)<<6|63&s)>65535&&c<1114112&&(u=c)}null===u?(u=65533,p=1):u>65535&&(u-=65536,n.push(u>>>10&1023|55296),u=56320|1023&u),n.push(u),a+=p}return function(t){var e=t.length;if(e<=4096)return String.fromCharCode.apply(String,t);var r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=4096));return r}(n)}e.Buffer=c,e.SlowBuffer=function(t){+t!=t&&(t=0);return c.alloc(+t)},e.INSPECT_MAX_BYTES=50,c.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}(),e.kMaxLength=i(),c.poolSize=8192,c._augment=function(t){return t.__proto__=c.prototype,t},c.from=function(t,e,r){return l(null,t,e,r)},c.TYPED_ARRAY_SUPPORT&&(c.prototype.__proto__=Uint8Array.prototype,c.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&c[Symbol.species]===c&&Object.defineProperty(c,Symbol.species,{value:null,configurable:!0})),c.alloc=function(t,e,r){return function(t,e,r,n){return u(e),e<=0?s(t,e):void 0!==r?"string"==typeof n?s(t,e).fill(r,n):s(t,e).fill(r):s(t,e)}(null,t,e,r)},c.allocUnsafe=function(t){return p(null,t)},c.allocUnsafeSlow=function(t){return p(null,t)},c.isBuffer=function(t){return!(null==t||!t._isBuffer)},c.compare=function(t,e){if(!c.isBuffer(t)||!c.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var r=t.length,n=e.length,a=0,o=Math.min(r,n);a<o;++a)if(t[a]!==e[a]){r=t[a],n=e[a];break}return r<n?-1:n<r?1:0},c.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},c.concat=function(t,e){if(!o(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return c.alloc(0);var r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;var n=c.allocUnsafe(e),a=0;for(r=0;r<t.length;++r){var i=t[r];if(!c.isBuffer(i))throw new TypeError('"list" argument must be an Array of Buffers');i.copy(n,a),a+=i.length}return n},c.byteLength=d,c.prototype._isBuffer=!0,c.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)g(this,e,e+1);return this},c.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)g(this,e,e+3),g(this,e+1,e+2);return this},c.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)g(this,e,e+7),g(this,e+1,e+6),g(this,e+2,e+5),g(this,e+3,e+4);return this},c.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?C(this,0,t):m.apply(this,arguments)},c.prototype.equals=function(t){if(!c.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===c.compare(this,t)},c.prototype.inspect=function(){var t="",r=e.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(t+=" ... ")),"<Buffer "+t+">"},c.prototype.compare=function(t,e,r,n,a){if(!c.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===a&&(a=this.length),e<0||r>t.length||n<0||a>this.length)throw new RangeError("out of range index");if(n>=a&&e>=r)return 0;if(n>=a)return-1;if(e>=r)return 1;if(this===t)return 0;for(var o=(a>>>=0)-(n>>>=0),i=(r>>>=0)-(e>>>=0),s=Math.min(o,i),l=this.slice(n,a),u=t.slice(e,r),p=0;p<s;++p)if(l[p]!==u[p]){o=l[p],i=u[p];break}return o<i?-1:i<o?1:0},c.prototype.includes=function(t,e,r){return-1!==this.indexOf(t,e,r)},c.prototype.indexOf=function(t,e,r){return b(this,t,e,r,!0)},c.prototype.lastIndexOf=function(t,e,r){return b(this,t,e,r,!1)},c.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e|=0,isFinite(r)?(r|=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var a=this.length-e;if((void 0===r||r>a)&&(r=a),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var o=!1;;)switch(n){case"hex":return y(this,t,e,r);case"utf8":case"utf-8":return _(this,t,e,r);case"ascii":return w(this,t,e,r);case"latin1":case"binary":return O(this,t,e,r);case"base64":return k(this,t,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return E(this,t,e,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=!0}},c.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function S(t,e,r){var n="";r=Math.min(t.length,r);for(var a=e;a<r;++a)n+=String.fromCharCode(127&t[a]);return n}function x(t,e,r){var n="";r=Math.min(t.length,r);for(var a=e;a<r;++a)n+=String.fromCharCode(t[a]);return n}function N(t,e,r){var n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);for(var a="",o=e;o<r;++o)a+=B(t[o]);return a}function R(t,e,r){for(var n=t.slice(e,r),a="",o=0;o<n.length;o+=2)a+=String.fromCharCode(n[o]+256*n[o+1]);return a}function T(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function A(t,e,r,n,a,o){if(!c.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>a||e<o)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function D(t,e,r,n){e<0&&(e=65535+e+1);for(var a=0,o=Math.min(t.length-r,2);a<o;++a)t[r+a]=(e&255<<8*(n?a:1-a))>>>8*(n?a:1-a)}function z(t,e,r,n){e<0&&(e=4294967295+e+1);for(var a=0,o=Math.min(t.length-r,4);a<o;++a)t[r+a]=e>>>8*(n?a:3-a)&255}function P(t,e,r,n,a,o){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function L(t,e,r,n,o){return o||P(t,0,r,4),a.write(t,e,r,n,23,4),r+4}function q(t,e,r,n,o){return o||P(t,0,r,8),a.write(t,e,r,n,52,8),r+8}c.prototype.slice=function(t,e){var r,n=this.length;if((t=~~t)<0?(t+=n)<0&&(t=0):t>n&&(t=n),(e=void 0===e?n:~~e)<0?(e+=n)<0&&(e=0):e>n&&(e=n),e<t&&(e=t),c.TYPED_ARRAY_SUPPORT)(r=this.subarray(t,e)).__proto__=c.prototype;else{var a=e-t;r=new c(a,void 0);for(var o=0;o<a;++o)r[o]=this[o+t]}return r},c.prototype.readUIntLE=function(t,e,r){t|=0,e|=0,r||T(t,e,this.length);for(var n=this[t],a=1,o=0;++o<e&&(a*=256);)n+=this[t+o]*a;return n},c.prototype.readUIntBE=function(t,e,r){t|=0,e|=0,r||T(t,e,this.length);for(var n=this[t+--e],a=1;e>0&&(a*=256);)n+=this[t+--e]*a;return n},c.prototype.readUInt8=function(t,e){return e||T(t,1,this.length),this[t]},c.prototype.readUInt16LE=function(t,e){return e||T(t,2,this.length),this[t]|this[t+1]<<8},c.prototype.readUInt16BE=function(t,e){return e||T(t,2,this.length),this[t]<<8|this[t+1]},c.prototype.readUInt32LE=function(t,e){return e||T(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},c.prototype.readUInt32BE=function(t,e){return e||T(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},c.prototype.readIntLE=function(t,e,r){t|=0,e|=0,r||T(t,e,this.length);for(var n=this[t],a=1,o=0;++o<e&&(a*=256);)n+=this[t+o]*a;return n>=(a*=128)&&(n-=Math.pow(2,8*e)),n},c.prototype.readIntBE=function(t,e,r){t|=0,e|=0,r||T(t,e,this.length);for(var n=e,a=1,o=this[t+--n];n>0&&(a*=256);)o+=this[t+--n]*a;return o>=(a*=128)&&(o-=Math.pow(2,8*e)),o},c.prototype.readInt8=function(t,e){return e||T(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},c.prototype.readInt16LE=function(t,e){e||T(t,2,this.length);var r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},c.prototype.readInt16BE=function(t,e){e||T(t,2,this.length);var r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},c.prototype.readInt32LE=function(t,e){return e||T(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},c.prototype.readInt32BE=function(t,e){return e||T(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},c.prototype.readFloatLE=function(t,e){return e||T(t,4,this.length),a.read(this,t,!0,23,4)},c.prototype.readFloatBE=function(t,e){return e||T(t,4,this.length),a.read(this,t,!1,23,4)},c.prototype.readDoubleLE=function(t,e){return e||T(t,8,this.length),a.read(this,t,!0,52,8)},c.prototype.readDoubleBE=function(t,e){return e||T(t,8,this.length),a.read(this,t,!1,52,8)},c.prototype.writeUIntLE=function(t,e,r,n){(t=+t,e|=0,r|=0,n)||A(this,t,e,r,Math.pow(2,8*r)-1,0);var a=1,o=0;for(this[e]=255&t;++o<r&&(a*=256);)this[e+o]=t/a&255;return e+r},c.prototype.writeUIntBE=function(t,e,r,n){(t=+t,e|=0,r|=0,n)||A(this,t,e,r,Math.pow(2,8*r)-1,0);var a=r-1,o=1;for(this[e+a]=255&t;--a>=0&&(o*=256);)this[e+a]=t/o&255;return e+r},c.prototype.writeUInt8=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,1,255,0),c.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},c.prototype.writeUInt16LE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,2,65535,0),c.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):D(this,t,e,!0),e+2},c.prototype.writeUInt16BE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,2,65535,0),c.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):D(this,t,e,!1),e+2},c.prototype.writeUInt32LE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,4,4294967295,0),c.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):z(this,t,e,!0),e+4},c.prototype.writeUInt32BE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,4,4294967295,0),c.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):z(this,t,e,!1),e+4},c.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e|=0,!n){var a=Math.pow(2,8*r-1);A(this,t,e,r,a-1,-a)}var o=0,i=1,s=0;for(this[e]=255&t;++o<r&&(i*=256);)t<0&&0===s&&0!==this[e+o-1]&&(s=1),this[e+o]=(t/i>>0)-s&255;return e+r},c.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e|=0,!n){var a=Math.pow(2,8*r-1);A(this,t,e,r,a-1,-a)}var o=r-1,i=1,s=0;for(this[e+o]=255&t;--o>=0&&(i*=256);)t<0&&0===s&&0!==this[e+o+1]&&(s=1),this[e+o]=(t/i>>0)-s&255;return e+r},c.prototype.writeInt8=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,1,127,-128),c.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[e]=255&t,e+1},c.prototype.writeInt16LE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,2,32767,-32768),c.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):D(this,t,e,!0),e+2},c.prototype.writeInt16BE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,2,32767,-32768),c.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):D(this,t,e,!1),e+2},c.prototype.writeInt32LE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,4,2147483647,-2147483648),c.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):z(this,t,e,!0),e+4},c.prototype.writeInt32BE=function(t,e,r){return t=+t,e|=0,r||A(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),c.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):z(this,t,e,!1),e+4},c.prototype.writeFloatLE=function(t,e,r){return L(this,t,e,!0,r)},c.prototype.writeFloatBE=function(t,e,r){return L(this,t,e,!1,r)},c.prototype.writeDoubleLE=function(t,e,r){return q(this,t,e,!0,r)},c.prototype.writeDoubleBE=function(t,e,r){return q(this,t,e,!1,r)},c.prototype.copy=function(t,e,r,n){if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);var a,o=n-r;if(this===t&&r<e&&e<n)for(a=o-1;a>=0;--a)t[a+e]=this[a+r];else if(o<1e3||!c.TYPED_ARRAY_SUPPORT)for(a=0;a<o;++a)t[a+e]=this[a+r];else Uint8Array.prototype.set.call(t,this.subarray(r,r+o),e);return o},c.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===t.length){var a=t.charCodeAt(0);a<256&&(t=a)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!c.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t&=255);if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;var o;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(o=e;o<r;++o)this[o]=t;else{var i=c.isBuffer(t)?t:M(new c(t,n).toString()),s=i.length;for(o=0;o<r-e;++o)this[o+e]=i[o%s]}return this};var I=/[^+\/0-9A-Za-z-_]/g;function B(t){return t<16?"0"+t.toString(16):t.toString(16)}function M(t,e){var r;e=e||1/0;for(var n=t.length,a=null,o=[],i=0;i<n;++i){if((r=t.charCodeAt(i))>55295&&r<57344){if(!a){if(r>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(i+1===n){(e-=3)>-1&&o.push(239,191,189);continue}a=r;continue}if(r<56320){(e-=3)>-1&&o.push(239,191,189),a=r;continue}r=65536+(a-55296<<10|r-56320)}else a&&(e-=3)>-1&&o.push(239,191,189);if(a=null,r<128){if((e-=1)<0)break;o.push(r)}else if(r<2048){if((e-=2)<0)break;o.push(r>>6|192,63&r|128)}else if(r<65536){if((e-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return o}function V(t){return n.toByteArray(function(t){if((t=function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}(t).replace(I,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function U(t,e,r,n){for(var a=0;a<n&&!(a+r>=e.length||a>=t.length);++a)e[a+r]=t[a];return a}}).call(this,r(58))},function(t,e){!function(){t.exports=this.React}()},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t};e.default=function(t,e){var r=n({},(0,a.default)(t),{key:e});"string"==typeof r.style||r.style instanceof String?r.style=(0,o.default)(r.style):delete r.style;return r};var a=i(r(66)),o=i(r(69));function i(t){return t&&t.__esModule?t:{default:t}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){a.hasOwnProperty(t)||(a[t]=n.test(t));return a[t]};var n=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,a={}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.htmlparser2=e.convertNodeToElement=e.processNodes=void 0;var n=r(15);Object.defineProperty(e,"processNodes",{enumerable:!0,get:function(){return s(n).default}});var a=r(18);Object.defineProperty(e,"convertNodeToElement",{enumerable:!0,get:function(){return s(a).default}});var o=r(12);Object.defineProperty(e,"htmlparser2",{enumerable:!0,get:function(){return s(o).default}});var i=s(r(73));function s(t){return t&&t.__esModule?t:{default:t}}e.default=i.default},function(t,e){!function(){t.exports=this.wp.mediaUtils}()},function(t,e,r){var n=r(74),a=r(75),o=r(76),i=r(78);t.exports=function(t,e){return n(t)||a(t,e)||o(t,e)||i()}},function(t,e){function r(e,n){return t.exports=r=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},r(e,n)}t.exports=r},function(t,e){function r(e){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?t.exports=r=function(t){return typeof t}:t.exports=r=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(e)}t.exports=r},function(t,e,r){"use strict";var n=r(37);function a(){}function o(){}o.resetWarningCache=a,t.exports=function(){function t(t,e,r,a,o,i){if(i!==n){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function e(){return t}t.isRequired=t;var r={array:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:o,resetWarningCache:a};return r.PropTypes=r,r}},function(t,e,r){"use strict";t.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){return"text"===t.type&&/\r?\n/.test(t.data)&&""===t.data.trim()}},function(t,e,r){"use strict";var n;Object.defineProperty(e,"__esModule",{value:!0});var a=r(12),o=l(r(64)),i=l(r(65)),s=l(r(71)),c=l(r(72));function l(t){return t&&t.__esModule?t:{default:t}}function u(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}e.default=(u(n={},a.ElementType.Text,o.default),u(n,a.ElementType.Tag,i.default),u(n,a.ElementType.Style,s.default),u(n,a.ElementType.Directive,c.default),u(n,a.ElementType.Comment,c.default),u(n,a.ElementType.Script,c.default),u(n,a.ElementType.CDATA,c.default),u(n,a.ElementType.Doctype,c.default),n)},function(t){t.exports=JSON.parse('{"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376}')},function(t,e,r){"use strict";var n,a="object"==typeof Reflect?Reflect:null,o=a&&"function"==typeof a.apply?a.apply:function(t,e,r){return Function.prototype.apply.call(t,e,r)};n=a&&"function"==typeof a.ownKeys?a.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var i=Number.isNaN||function(t){return t!=t};function s(){s.init.call(this)}t.exports=s,s.EventEmitter=s,s.prototype._events=void 0,s.prototype._eventsCount=0,s.prototype._maxListeners=void 0;var c=10;function l(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function u(t){return void 0===t._maxListeners?s.defaultMaxListeners:t._maxListeners}function p(t,e,r,n){var a,o,i,s;if(l(r),void 0===(o=t._events)?(o=t._events=Object.create(null),t._eventsCount=0):(void 0!==o.newListener&&(t.emit("newListener",e,r.listener?r.listener:r),o=t._events),i=o[e]),void 0===i)i=o[e]=r,++t._eventsCount;else if("function"==typeof i?i=o[e]=n?[r,i]:[i,r]:n?i.unshift(r):i.push(r),(a=u(t))>0&&i.length>a&&!i.warned){i.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+i.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=t,c.type=e,c.count=i.length,s=c,console&&console.warn&&console.warn(s)}return t}function h(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function f(t,e,r){var n={fired:!1,wrapFn:void 0,target:t,type:e,listener:r},a=h.bind(n);return a.listener=r,n.wrapFn=a,a}function d(t,e,r){var n=t._events;if(void 0===n)return[];var a=n[e];return void 0===a?[]:"function"==typeof a?r?[a.listener||a]:[a]:r?function(t){for(var e=new Array(t.length),r=0;r<e.length;++r)e[r]=t[r].listener||t[r];return e}(a):g(a,a.length)}function m(t){var e=this._events;if(void 0!==e){var r=e[t];if("function"==typeof r)return 1;if(void 0!==r)return r.length}return 0}function g(t,e){for(var r=new Array(e),n=0;n<e;++n)r[n]=t[n];return r}Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return c},set:function(t){if("number"!=typeof t||t<0||i(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");c=t}}),s.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},s.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||i(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},s.prototype.getMaxListeners=function(){return u(this)},s.prototype.emit=function(t){for(var e=[],r=1;r<arguments.length;r++)e.push(arguments[r]);var n="error"===t,a=this._events;if(void 0!==a)n=n&&void 0===a.error;else if(!n)return!1;if(n){var i;if(e.length>0&&(i=e[0]),i instanceof Error)throw i;var s=new Error("Unhandled error."+(i?" ("+i.message+")":""));throw s.context=i,s}var c=a[t];if(void 0===c)return!1;if("function"==typeof c)o(c,this,e);else{var l=c.length,u=g(c,l);for(r=0;r<l;++r)o(u[r],this,e)}return!0},s.prototype.addListener=function(t,e){return p(this,t,e,!1)},s.prototype.on=s.prototype.addListener,s.prototype.prependListener=function(t,e){return p(this,t,e,!0)},s.prototype.once=function(t,e){return l(e),this.on(t,f(this,t,e)),this},s.prototype.prependOnceListener=function(t,e){return l(e),this.prependListener(t,f(this,t,e)),this},s.prototype.removeListener=function(t,e){var r,n,a,o,i;if(l(e),void 0===(n=this._events))return this;if(void 0===(r=n[t]))return this;if(r===e||r.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete n[t],n.removeListener&&this.emit("removeListener",t,r.listener||e));else if("function"!=typeof r){for(a=-1,o=r.length-1;o>=0;o--)if(r[o]===e||r[o].listener===e){i=r[o].listener,a=o;break}if(a<0)return this;0===a?r.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(r,a),1===r.length&&(n[t]=r[0]),void 0!==n.removeListener&&this.emit("removeListener",t,i||e)}return this},s.prototype.off=s.prototype.removeListener,s.prototype.removeAllListeners=function(t){var e,r,n;if(void 0===(r=this._events))return this;if(void 0===r.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==r[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete r[t]),this;if(0===arguments.length){var a,o=Object.keys(r);for(n=0;n<o.length;++n)"removeListener"!==(a=o[n])&&this.removeAllListeners(a);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=r[t]))this.removeListener(t,e);else if(void 0!==e)for(n=e.length-1;n>=0;n--)this.removeListener(t,e[n]);return this},s.prototype.listeners=function(t){return d(this,t,!0)},s.prototype.rawListeners=function(t){return d(this,t,!1)},s.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):m.call(t,e)},s.prototype.listenerCount=m,s.prototype.eventNames=function(){return this._eventsCount>0?n(this._events):[]}},function(t,e,r){var n=r(24),a=t.exports=Object.create(n),o={tagName:"name"};Object.keys(o).forEach((function(t){var e=o[t];Object.defineProperty(a,t,{get:function(){return this[e]||null},set:function(t){return this[e]=t,t}})}))},function(t,e,r){var n=r(23),a=r(25);function o(t,e){this.init(t,e)}function i(t,e){return a.getElementsByTagName(t,e,!0)}function s(t,e){return a.getElementsByTagName(t,e,!0,1)[0]}function c(t,e,r){return a.getText(a.getElementsByTagName(t,e,r,1)).trim()}function l(t,e,r,n,a){var o=c(r,n,a);o&&(t[e]=o)}r(14)(o,n),o.prototype.init=n;var u=function(t){return"rss"===t||"feed"===t||"rdf:RDF"===t};o.prototype.onend=function(){var t,e,r={},a=s(u,this.dom);a&&("feed"===a.name?(e=a.children,r.type="atom",l(r,"id","id",e),l(r,"title","title",e),(t=s("link",e))&&(t=t.attribs)&&(t=t.href)&&(r.link=t),l(r,"description","subtitle",e),(t=c("updated",e))&&(r.updated=new Date(t)),l(r,"author","email",e,!0),r.items=i("entry",e).map((function(t){var e,r={};return l(r,"id","id",t=t.children),l(r,"title","title",t),(e=s("link",t))&&(e=e.attribs)&&(e=e.href)&&(r.link=e),(e=c("summary",t)||c("content",t))&&(r.description=e),(e=c("updated",t))&&(r.pubDate=new Date(e)),r}))):(e=s("channel",a.children).children,r.type=a.name.substr(0,3),r.id="",l(r,"title","title",e),l(r,"link","link",e),l(r,"description","description",e),(t=c("lastBuildDate",e))&&(r.updated=new Date(t)),l(r,"author","managingEditor",e,!0),r.items=i("item",a.children).map((function(t){var e,r={};return l(r,"id","guid",t=t.children),l(r,"title","title",t),l(r,"link","link",t),l(r,"description","description",t),(e=c("pubDate",t))&&(r.pubDate=new Date(e)),r})))),this.dom=r,n.prototype._handleCallback.call(this,a?null:Error("couldn't find root of feed"))},t.exports=o},function(t,e,r){var n=r(13),a=r(45),o=n.isTag;t.exports={getInnerHTML:function(t,e){return t.children?t.children.map((function(t){return a(t,e)})).join(""):""},getOuterHTML:a,getText:function t(e){return Array.isArray(e)?e.map(t).join(""):o(e)||e.type===n.CDATA?t(e.children):e.type===n.Text?e.data:""}}},function(t,e,r){var n=r(13),a=r(46),o={__proto__:null,style:!0,script:!0,xmp:!0,iframe:!0,noembed:!0,noframes:!0,plaintext:!0,noscript:!0};var i={__proto__:null,area:!0,base:!0,basefont:!0,br:!0,col:!0,command:!0,embed:!0,frame:!0,hr:!0,img:!0,input:!0,isindex:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},s=t.exports=function(t,e){Array.isArray(t)||t.cheerio||(t=[t]),e=e||{};for(var r="",a=0;a<t.length;a++){var o=t[a];"root"===o.type?r+=s(o.children,e):n.isTag(o)?r+=c(o,e):o.type===n.Directive?r+=l(o):o.type===n.Comment?r+=h(o):o.type===n.CDATA?r+=p(o):r+=u(o,e)}return r};function c(t,e){"svg"===t.name&&(e={decodeEntities:e.decodeEntities,xmlMode:!0});var r="<"+t.name,n=function(t,e){if(t){var r,n="";for(var o in t)n&&(n+=" "),n+=o,(null!==(r=t[o])&&""!==r||e.xmlMode)&&(n+='="'+(e.decodeEntities?a.encodeXML(r):r)+'"');return n}}(t.attribs,e);return n&&(r+=" "+n),!e.xmlMode||t.children&&0!==t.children.length?(r+=">",t.children&&(r+=s(t.children,e)),i[t.name]&&!e.xmlMode||(r+="</"+t.name+">")):r+="/>",r}function l(t){return"<"+t.data+">"}function u(t,e){var r=t.data||"";return!e.decodeEntities||t.parent&&t.parent.name in o||(r=a.encodeXML(r)),r}function p(t){return"<![CDATA["+t.children[0].data+"]]>"}function h(t){return"\x3c!--"+t.data+"--\x3e"}},function(t,e,r){var n=r(47),a=r(48);e.decode=function(t,e){return(!e||e<=0?a.XML:a.HTML)(t)},e.decodeStrict=function(t,e){return(!e||e<=0?a.XML:a.HTMLStrict)(t)},e.encode=function(t,e){return(!e||e<=0?n.XML:n.HTML)(t)},e.encodeXML=n.XML,e.encodeHTML4=e.encodeHTML5=e.encodeHTML=n.HTML,e.decodeXML=e.decodeXMLStrict=a.XML,e.decodeHTML4=e.decodeHTML5=e.decodeHTML=a.HTML,e.decodeHTML4Strict=e.decodeHTML5Strict=e.decodeHTMLStrict=a.HTMLStrict,e.escape=n.escape},function(t,e,r){var n=s(r(17)),a=c(n);e.XML=f(n,a);var o=s(r(16)),i=c(o);function s(t){return Object.keys(t).sort().reduce((function(e,r){return e[t[r]]="&"+r+";",e}),{})}function c(t){var e=[],r=[];return Object.keys(t).forEach((function(t){1===t.length?e.push("\\"+t):r.push(t)})),r.unshift("["+e.join("")+"]"),new RegExp(r.join("|"),"g")}e.HTML=f(o,i);var l=/[^\0-\x7F]/g,u=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g;function p(t){return"&#x"+t.charCodeAt(0).toString(16).toUpperCase()+";"}function h(t){return"&#x"+(1024*(t.charCodeAt(0)-55296)+t.charCodeAt(1)-56320+65536).toString(16).toUpperCase()+";"}function f(t,e){function r(e){return t[e]}return function(t){return t.replace(e,r).replace(u,h).replace(l,p)}}var d=c(n);e.escape=function(t){return t.replace(d,p).replace(u,h).replace(l,p)}},function(t,e,r){var n=r(16),a=r(22),o=r(17),i=r(21),s=l(o),c=l(n);function l(t){var e=Object.keys(t).join("|"),r=h(t),n=new RegExp("&(?:"+(e+="|#[xX][\\da-fA-F]+|#\\d+")+");","g");return function(t){return String(t).replace(n,r)}}var u=function(){for(var t=Object.keys(a).sort(p),e=Object.keys(n).sort(p),r=0,o=0;r<e.length;r++)t[o]===e[r]?(e[r]+=";?",o++):e[r]+=";";var i=new RegExp("&(?:"+e.join("|")+"|#[xX][\\da-fA-F]+;?|#\\d+;?)","g"),s=h(n);function c(t){return";"!==t.substr(-1)&&(t+=";"),s(t)}return function(t){return String(t).replace(i,c)}}();function p(t,e){return t<e?1:-1}function h(t){return function(e){return"#"===e.charAt(1)?"X"===e.charAt(2)||"x"===e.charAt(2)?i(parseInt(e.substr(3),16)):i(parseInt(e.substr(2),10)):t[e.slice(1,-1)]}}t.exports={XML:s,HTML:u,HTMLStrict:c}},function(t,e){var r=e.getChildren=function(t){return t.children},n=e.getParent=function(t){return t.parent};e.getSiblings=function(t){var e=n(t);return e?r(e):[t]},e.getAttributeValue=function(t,e){return t.attribs&&t.attribs[e]},e.hasAttrib=function(t,e){return!!t.attribs&&hasOwnProperty.call(t.attribs,e)},e.getName=function(t){return t.name}},function(t,e){e.removeElement=function(t){if(t.prev&&(t.prev.next=t.next),t.next&&(t.next.prev=t.prev),t.parent){var e=t.parent.children;e.splice(e.lastIndexOf(t),1)}},e.replaceElement=function(t,e){var r=e.prev=t.prev;r&&(r.next=e);var n=e.next=t.next;n&&(n.prev=e);var a=e.parent=t.parent;if(a){var o=a.children;o[o.lastIndexOf(t)]=e}},e.appendChild=function(t,e){if(e.parent=t,1!==t.children.push(e)){var r=t.children[t.children.length-2];r.next=e,e.prev=r,e.next=null}},e.append=function(t,e){var r=t.parent,n=t.next;if(e.next=n,e.prev=t,t.next=e,e.parent=r,n){if(n.prev=e,r){var a=r.children;a.splice(a.lastIndexOf(n),0,e)}}else r&&r.children.push(e)},e.prepend=function(t,e){var r=t.parent;if(r){var n=r.children;n.splice(n.lastIndexOf(t),0,e)}t.prev&&(t.prev.next=e),e.parent=r,e.prev=t.prev,e.next=t,t.prev=e}},function(t,e,r){var n=r(13).isTag;function a(t,e,r,n){for(var o,i=[],s=0,c=e.length;s<c&&!(t(e[s])&&(i.push(e[s]),--n<=0))&&(o=e[s].children,!(r&&o&&o.length>0&&(o=a(t,o,r,n),i=i.concat(o),(n-=o.length)<=0)));s++);return i}t.exports={filter:function(t,e,r,n){Array.isArray(e)||(e=[e]);"number"==typeof n&&isFinite(n)||(n=1/0);return a(t,e,!1!==r,n)},find:a,findOneChild:function(t,e){for(var r=0,n=e.length;r<n;r++)if(t(e[r]))return e[r];return null},findOne:function t(e,r){for(var a=null,o=0,i=r.length;o<i&&!a;o++)n(r[o])&&(e(r[o])?a=r[o]:r[o].children.length>0&&(a=t(e,r[o].children)));return a},existsOne:function t(e,r){for(var a=0,o=r.length;a<o;a++)if(n(r[a])&&(e(r[a])||r[a].children.length>0&&t(e,r[a].children)))return!0;return!1},findAll:function t(e,r){for(var a=[],o=0,i=r.length;o<i;o++)n(r[o])&&(e(r[o])&&a.push(r[o]),r[o].children.length>0&&(a=a.concat(t(e,r[o].children))));return a}}},function(t,e,r){var n=r(13),a=e.isTag=n.isTag;e.testElement=function(t,e){for(var r in t)if(t.hasOwnProperty(r)){if("tag_name"===r){if(!a(e)||!t.tag_name(e.name))return!1}else if("tag_type"===r){if(!t.tag_type(e.type))return!1}else if("tag_contains"===r){if(a(e)||!t.tag_contains(e.data))return!1}else if(!e.attribs||!t[r](e.attribs[r]))return!1}else;return!0};var o={tag_name:function(t){return"function"==typeof t?function(e){return a(e)&&t(e.name)}:"*"===t?a:function(e){return a(e)&&e.name===t}},tag_type:function(t){return"function"==typeof t?function(e){return t(e.type)}:function(e){return e.type===t}},tag_contains:function(t){return"function"==typeof t?function(e){return!a(e)&&t(e.data)}:function(e){return!a(e)&&e.data===t}}};function i(t,e){return"function"==typeof e?function(r){return r.attribs&&e(r.attribs[t])}:function(r){return r.attribs&&r.attribs[t]===e}}function s(t,e){return function(r){return t(r)||e(r)}}e.getElements=function(t,e,r,n){var a=Object.keys(t).map((function(e){var r=t[e];return e in o?o[e](r):i(e,r)}));return 0===a.length?[]:this.filter(a.reduce(s),e,r,n)},e.getElementById=function(t,e,r){return Array.isArray(e)||(e=[e]),this.findOne(i("id",t),e,!1!==r)},e.getElementsByTagName=function(t,e,r,n){return this.filter(o.tag_name(t),e,r,n)},e.getElementsByTagType=function(t,e,r,n){return this.filter(o.tag_type(t),e,r,n)}},function(t,e){e.removeSubsets=function(t){for(var e,r,n,a=t.length;--a>-1;){for(e=r=t[a],t[a]=null,n=!0;r;){if(t.indexOf(r)>-1){n=!1,t.splice(a,1);break}r=r.parent}n&&(t[a]=e)}return t};var r=1,n=2,a=4,o=8,i=16,s=e.compareDocumentPosition=function(t,e){var s,c,l,u,p,h,f=[],d=[];if(t===e)return 0;for(s=t;s;)f.unshift(s),s=s.parent;for(s=e;s;)d.unshift(s),s=s.parent;for(h=0;f[h]===d[h];)h++;return 0===h?r:(l=(c=f[h-1]).children,u=f[h],p=d[h],l.indexOf(u)>l.indexOf(p)?c===e?a|i:a:c===t?n|o:n)};e.uniqueSort=function(t){var e,r,o=t.length;for(t=t.slice();--o>-1;)e=t[o],(r=t.indexOf(e))>-1&&r<o&&t.splice(o,1);return t.sort((function(t,e){var r=s(t,e);return r&n?-1:r&a?1:0})),t}},function(t,e,r){t.exports=a;var n=r(26);function a(t){n.call(this,new o(this),t)}function o(t){this.scope=t}r(14)(a,n),a.prototype.readable=!0;var i=r(12).EVENTS;Object.keys(i).forEach((function(t){if(0===i[t])o.prototype["on"+t]=function(){this.scope.emit(t)};else if(1===i[t])o.prototype["on"+t]=function(e){this.scope.emit(t,e)};else{if(2!==i[t])throw Error("wrong number of arguments!");o.prototype["on"+t]=function(e,r){this.scope.emit(t,e,r)}}}))},function(t,e){},function(t,e,r){"use strict";var n=r(57).Buffer,a=n.isEncoding||function(t){switch((t=""+t)&&t.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};function o(t){var e;switch(this.encoding=function(t){var e=function(t){if(!t)return"utf8";for(var e;;)switch(t){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return t;default:if(e)return;t=(""+t).toLowerCase(),e=!0}}(t);if("string"!=typeof e&&(n.isEncoding===a||!a(t)))throw new Error("Unknown encoding: "+t);return e||t}(t),this.encoding){case"utf16le":this.text=c,this.end=l,e=4;break;case"utf8":this.fillLast=s,e=4;break;case"base64":this.text=u,this.end=p,e=3;break;default:return this.write=h,void(this.end=f)}this.lastNeed=0,this.lastTotal=0,this.lastChar=n.allocUnsafe(e)}function i(t){return t<=127?0:t>>5==6?2:t>>4==14?3:t>>3==30?4:t>>6==2?-1:-2}function s(t){var e=this.lastTotal-this.lastNeed,r=function(t,e,r){if(128!=(192&e[0]))return t.lastNeed=0,"�";if(t.lastNeed>1&&e.length>1){if(128!=(192&e[1]))return t.lastNeed=1,"�";if(t.lastNeed>2&&e.length>2&&128!=(192&e[2]))return t.lastNeed=2,"�"}}(this,t);return void 0!==r?r:this.lastNeed<=t.length?(t.copy(this.lastChar,e,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):(t.copy(this.lastChar,e,0,t.length),void(this.lastNeed-=t.length))}function c(t,e){if((t.length-e)%2==0){var r=t.toString("utf16le",e);if(r){var n=r.charCodeAt(r.length-1);if(n>=55296&&n<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1],r.slice(0,-1)}return r}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=t[t.length-1],t.toString("utf16le",e,t.length-1)}function l(t){var e=t&&t.length?this.write(t):"";if(this.lastNeed){var r=this.lastTotal-this.lastNeed;return e+this.lastChar.toString("utf16le",0,r)}return e}function u(t,e){var r=(t.length-e)%3;return 0===r?t.toString("base64",e):(this.lastNeed=3-r,this.lastTotal=3,1===r?this.lastChar[0]=t[t.length-1]:(this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1]),t.toString("base64",e,t.length-r))}function p(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+this.lastChar.toString("base64",0,3-this.lastNeed):e}function h(t){return t.toString(this.encoding)}function f(t){return t&&t.length?this.write(t):""}e.StringDecoder=o,o.prototype.write=function(t){if(0===t.length)return"";var e,r;if(this.lastNeed){if(void 0===(e=this.fillLast(t)))return"";r=this.lastNeed,this.lastNeed=0}else r=0;return r<t.length?e?e+this.text(t,r):this.text(t,r):e||""},o.prototype.end=function(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+"�":e},o.prototype.text=function(t,e){var r=function(t,e,r){var n=e.length-1;if(n<r)return 0;var a=i(e[n]);if(a>=0)return a>0&&(t.lastNeed=a-1),a;if(--n<r||-2===a)return 0;if((a=i(e[n]))>=0)return a>0&&(t.lastNeed=a-2),a;if(--n<r||-2===a)return 0;if((a=i(e[n]))>=0)return a>0&&(2===a?a=0:t.lastNeed=a-3),a;return 0}(this,t,e);if(!this.lastNeed)return t.toString("utf8",e);this.lastTotal=r;var n=t.length-(r-this.lastNeed);return t.copy(this.lastChar,0,n),t.toString("utf8",e,n)},o.prototype.fillLast=function(t){if(this.lastNeed<=t.length)return t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,t.length),this.lastNeed-=t.length}},function(t,e,r){var n=r(27),a=n.Buffer;function o(t,e){for(var r in t)e[r]=t[r]}function i(t,e,r){return a(t,e,r)}a.from&&a.alloc&&a.allocUnsafe&&a.allocUnsafeSlow?t.exports=n:(o(n,e),e.Buffer=i),o(a,i),i.from=function(t,e,r){if("number"==typeof t)throw new TypeError("Argument must not be a number");return a(t,e,r)},i.alloc=function(t,e,r){if("number"!=typeof t)throw new TypeError("Argument must be a number");var n=a(t);return void 0!==e?"string"==typeof r?n.fill(e,r):n.fill(e):n.fill(0),n},i.allocUnsafe=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return a(t)},i.allocUnsafeSlow=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return n.SlowBuffer(t)}},function(t,e){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e,r){"use strict";e.byteLength=function(t){var e=l(t),r=e[0],n=e[1];return 3*(r+n)/4-n},e.toByteArray=function(t){var e,r,n=l(t),i=n[0],s=n[1],c=new o(function(t,e,r){return 3*(e+r)/4-r}(0,i,s)),u=0,p=s>0?i-4:i;for(r=0;r<p;r+=4)e=a[t.charCodeAt(r)]<<18|a[t.charCodeAt(r+1)]<<12|a[t.charCodeAt(r+2)]<<6|a[t.charCodeAt(r+3)],c[u++]=e>>16&255,c[u++]=e>>8&255,c[u++]=255&e;2===s&&(e=a[t.charCodeAt(r)]<<2|a[t.charCodeAt(r+1)]>>4,c[u++]=255&e);1===s&&(e=a[t.charCodeAt(r)]<<10|a[t.charCodeAt(r+1)]<<4|a[t.charCodeAt(r+2)]>>2,c[u++]=e>>8&255,c[u++]=255&e);return c},e.fromByteArray=function(t){for(var e,r=t.length,a=r%3,o=[],i=0,s=r-a;i<s;i+=16383)o.push(u(t,i,i+16383>s?s:i+16383));1===a?(e=t[r-1],o.push(n[e>>2]+n[e<<4&63]+"==")):2===a&&(e=(t[r-2]<<8)+t[r-1],o.push(n[e>>10]+n[e>>4&63]+n[e<<2&63]+"="));return o.join("")};for(var n=[],a=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=0,c=i.length;s<c;++s)n[s]=i[s],a[i.charCodeAt(s)]=s;function l(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return-1===r&&(r=e),[r,r===e?0:4-r%4]}function u(t,e,r){for(var a,o,i=[],s=e;s<r;s+=3)a=(t[s]<<16&16711680)+(t[s+1]<<8&65280)+(255&t[s+2]),i.push(n[(o=a)>>18&63]+n[o>>12&63]+n[o>>6&63]+n[63&o]);return i.join("")}a["-".charCodeAt(0)]=62,a["_".charCodeAt(0)]=63},function(t,e){e.read=function(t,e,r,n,a){var o,i,s=8*a-n-1,c=(1<<s)-1,l=c>>1,u=-7,p=r?a-1:0,h=r?-1:1,f=t[e+p];for(p+=h,o=f&(1<<-u)-1,f>>=-u,u+=s;u>0;o=256*o+t[e+p],p+=h,u-=8);for(i=o&(1<<-u)-1,o>>=-u,u+=n;u>0;i=256*i+t[e+p],p+=h,u-=8);if(0===o)o=1-l;else{if(o===c)return i?NaN:1/0*(f?-1:1);i+=Math.pow(2,n),o-=l}return(f?-1:1)*i*Math.pow(2,o-n)},e.write=function(t,e,r,n,a,o){var i,s,c,l=8*o-a-1,u=(1<<l)-1,p=u>>1,h=23===a?Math.pow(2,-24)-Math.pow(2,-77):0,f=n?0:o-1,d=n?1:-1,m=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(s=isNaN(e)?1:0,i=u):(i=Math.floor(Math.log(e)/Math.LN2),e*(c=Math.pow(2,-i))<1&&(i--,c*=2),(e+=i+p>=1?h/c:h*Math.pow(2,1-p))*c>=2&&(i++,c/=2),i+p>=u?(s=0,i=u):i+p>=1?(s=(e*c-1)*Math.pow(2,a),i+=p):(s=e*Math.pow(2,p-1)*Math.pow(2,a),i=0));a>=8;t[r+f]=255&s,f+=d,s/=256,a-=8);for(i=i<<a|s,l+=a;l>0;t[r+f]=255&i,f+=d,i/=256,l-=8);t[r+f-d]|=128*m}},function(t,e){var r={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==r.call(t)}},function(t,e,r){function n(t){this._cbs=t||{}}t.exports=n;var a=r(12).EVENTS;Object.keys(a).forEach((function(t){if(0===a[t])t="on"+t,n.prototype[t]=function(){this._cbs[t]&&this._cbs[t]()};else if(1===a[t])t="on"+t,n.prototype[t]=function(e){this._cbs[t]&&this._cbs[t](e)};else{if(2!==a[t])throw Error("wrong number of arguments");t="on"+t,n.prototype[t]=function(e,r){this._cbs[t]&&this._cbs[t](e,r)}}}))},function(t,e,r){function n(t){this._cbs=t||{},this.events=[]}t.exports=n;var a=r(12).EVENTS;Object.keys(a).forEach((function(t){if(0===a[t])t="on"+t,n.prototype[t]=function(){this.events.push([t]),this._cbs[t]&&this._cbs[t]()};else if(1===a[t])t="on"+t,n.prototype[t]=function(e){this.events.push([t,e]),this._cbs[t]&&this._cbs[t](e)};else{if(2!==a[t])throw Error("wrong number of arguments");t="on"+t,n.prototype[t]=function(e,r){this.events.push([t,e,r]),this._cbs[t]&&this._cbs[t](e,r)}}})),n.prototype.onreset=function(){this.events=[],this._cbs.onreset&&this._cbs.onreset()},n.prototype.restart=function(){this._cbs.onreset&&this._cbs.onreset();for(var t=0,e=this.events.length;t<e;t++)if(this._cbs[this.events[t][0]]){var r=this.events[t].length;1===r?this._cbs[this.events[t][0]]():2===r?this._cbs[this.events[t][0]](this.events[t][1]):this._cbs[this.events[t][0]](this.events[t][1],this.events[t][2])}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){return t.data}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e,r){var c=t.name;if(!(0,s.default)(c))return null;var l=(0,o.default)(t.attribs,e),u=null;-1===i.default.indexOf(c)&&(u=(0,a.default)(t.children,r));return n.default.createElement(c,l,u)};var n=c(r(28)),a=c(r(15)),o=c(r(29)),i=c(r(70)),s=c(r(30));function c(t){return t&&t.__esModule?t:{default:t}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){return Object.keys(t).filter((function(t){return(0,o.default)(t)})).reduce((function(e,r){var o=r.toLowerCase(),i=a.default[o]||o;return e[i]=function(t,e){n.default.map((function(t){return t.toLowerCase()})).indexOf(t.toLowerCase())>=0&&(e=t);return e}(i,t[r]),e}),{})};var n=i(r(67)),a=i(r(68)),o=i(r(30));function i(t){return t&&t.__esModule?t:{default:t}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=["allowfullScreen","async","autoplay","capture","checked","controls","default","defer","disabled","formnovalidate","hidden","loop","multiple","muted","novalidate","open","playsinline","readonly","required","reversed","scoped","seamless","selected","itemscope"]},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={accept:"accept","accept-charset":"acceptCharset",accesskey:"accessKey",action:"action",allowfullscreen:"allowFullScreen",allowtransparency:"allowTransparency",alt:"alt",as:"as",async:"async",autocomplete:"autoComplete",autoplay:"autoPlay",capture:"capture",cellpadding:"cellPadding",cellspacing:"cellSpacing",charset:"charSet",challenge:"challenge",checked:"checked",cite:"cite",classid:"classID",class:"className",cols:"cols",colspan:"colSpan",content:"content",contenteditable:"contentEditable",contextmenu:"contextMenu",controls:"controls",controlsList:"controlsList",coords:"coords",crossorigin:"crossOrigin",data:"data",datetime:"dateTime",default:"default",defer:"defer",dir:"dir",disabled:"disabled",download:"download",draggable:"draggable",enctype:"encType",form:"form",formaction:"formAction",formenctype:"formEncType",formmethod:"formMethod",formnovalidate:"formNoValidate",formtarget:"formTarget",frameborder:"frameBorder",headers:"headers",height:"height",hidden:"hidden",high:"high",href:"href",hreflang:"hrefLang",for:"htmlFor","http-equiv":"httpEquiv",icon:"icon",id:"id",inputmode:"inputMode",integrity:"integrity",is:"is",keyparams:"keyParams",keytype:"keyType",kind:"kind",label:"label",lang:"lang",list:"list",loop:"loop",low:"low",manifest:"manifest",marginheight:"marginHeight",marginwidth:"marginWidth",max:"max",maxlength:"maxLength",media:"media",mediagroup:"mediaGroup",method:"method",min:"min",minlength:"minLength",multiple:"multiple",muted:"muted",name:"name",nonce:"nonce",novalidate:"noValidate",open:"open",optimum:"optimum",pattern:"pattern",placeholder:"placeholder",playsinline:"playsInline",poster:"poster",preload:"preload",profile:"profile",radiogroup:"radioGroup",readonly:"readOnly",referrerpolicy:"referrerPolicy",rel:"rel",required:"required",reversed:"reversed",role:"role",rows:"rows",rowspan:"rowSpan",sandbox:"sandbox",scope:"scope",scoped:"scoped",scrolling:"scrolling",seamless:"seamless",selected:"selected",shape:"shape",size:"size",sizes:"sizes",slot:"slot",span:"span",spellcheck:"spellCheck",src:"src",srcdoc:"srcDoc",srclang:"srcLang",srcset:"srcSet",start:"start",step:"step",style:"style",summary:"summary",tabindex:"tabIndex",target:"target",title:"title",type:"type",usemap:"useMap",value:"value",width:"width",wmode:"wmode",wrap:"wrap",about:"about",datatype:"datatype",inlist:"inlist",prefix:"prefix",property:"property",resource:"resource",typeof:"typeof",vocab:"vocab",autocapitalize:"autoCapitalize",autocorrect:"autoCorrect",autosave:"autoSave",color:"color",itemprop:"itemProp",itemscope:"itemScope",itemtype:"itemType",itemid:"itemID",itemref:"itemRef",results:"results",security:"security",unselectable:"unselectable"}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(t,e){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return function(t,e){var r=[],n=!0,a=!1,o=void 0;try{for(var i,s=t[Symbol.iterator]();!(n=(i=s.next()).done)&&(r.push(i.value),!e||r.length!==e);n=!0);}catch(t){a=!0,o=t}finally{try{!n&&s.return&&s.return()}finally{if(a)throw o}}return r}(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")};e.default=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(""===t)return{};return t.split(";").reduce((function(t,e){var r=e.split(/^([^:]+):/).filter((function(t,e){return e>0})).map((function(t){return t.trim().toLowerCase()})),a=n(r,2),o=a[0],i=a[1];return void 0===i||(t[o=o.replace(/^-ms-/,"ms-").replace(/-(.)/g,(function(t,e){return e.toUpperCase()}))]=i),t}),{})}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"]},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e){var r=void 0;t.children.length>0&&(r=t.children[0].data);var o=(0,a.default)(t.attribs,e);return n.default.createElement("style",o,r)};var n=o(r(28)),a=o(r(29));function o(t){return t&&t.__esModule?t:{default:t}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(){return null}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=e.decodeEntities,o=void 0===r||r,i=e.transform,s=e.preprocessNodes,c=void 0===s?function(t){return t}:s,l=c(n.default.parseDOM(t,{decodeEntities:o}));return(0,a.default)(l,i)};var n=o(r(12)),a=o(r(15));function o(t){return t&&t.__esModule?t:{default:t}}},function(t,e){t.exports=function(t){if(Array.isArray(t))return t}},function(t,e){t.exports=function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var r=[],n=!0,a=!1,o=void 0;try{for(var i,s=t[Symbol.iterator]();!(n=(i=s.next()).done)&&(r.push(i.value),!e||r.length!==e);n=!0);}catch(t){a=!0,o=t}finally{try{n||null==s.return||s.return()}finally{if(a)throw o}}return r}}},function(t,e,r){var n=r(77);t.exports=function(t,e){if(t){if("string"==typeof t)return n(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(t,e):void 0}}},function(t,e){t.exports=function(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(t,e,r){"use strict";r.r(e);wp.customize.astraControl=wp.customize.Control.extend({initialize:function(t,e){var r=e||{};r.params=r.params||{},r.params.type||(r.params.type="astra-basic"),r.params.content||(r.params.content=jQuery("<li></li>"),r.params.content.attr("id","customize-control-"+t.replace(/]/g,"").replace(/\[/g,"-")),r.params.content.attr("class","customize-control customize-control-"+r.params.type)),this.propertyElements=[],wp.customize.Control.prototype.initialize.call(this,t,r)},_setUpSettingRootLinks:function(){var t=this;t.container.find("[data-customize-setting-link]").each((function(){var e=jQuery(this);wp.customize(e.data("customizeSettingLink"),(function(r){var n=new wp.customize.Element(e);t.elements.push(n),n.sync(r),n.set(r())}))}))},_setUpSettingPropertyLinks:function(){var t=this;t.setting&&t.container.find("[data-customize-setting-property-link]").each((function(){var e,r=jQuery(this),n=r.data("customizeSettingPropertyLink");e=new wp.customize.Element(r),t.propertyElements.push(e),e.set(t.setting()[n]),e.bind((function(e){var r=t.setting();e!==r[n]&&((r=_.clone(r))[n]=e,t.setting.set(r))})),t.setting.bind((function(t){t[n]!==e.get()&&e.set(t[n])}))}))},ready:function(){this._setUpSettingRootLinks(),this._setUpSettingPropertyLinks(),wp.customize.Control.prototype.ready.call(this),this.deferred.embedded.done((function(){}))},embed:function(){var t=this,e=t.section();e&&wp.customize.section(e,(function(e){e.expanded()||wp.customize.settings.autofocus.control===t.id?t.actuallyEmbed():e.expanded.bind((function(e){e&&t.actuallyEmbed()}))}))},actuallyEmbed:function(){"resolved"!==this.deferred.embedded.state()&&(this.renderContent(),this.deferred.embedded.resolve(),this.container.trigger("init"))},focus:function(t){this.actuallyEmbed(),wp.customize.Control.prototype.focus.call(this,t)}});var n=r(0),a=r(4),o=r.n(a),i=r(5),s=r.n(i),c=r(6),l=r.n(c),u=r(7),p=r.n(u),h=r(1),f=r.n(h),d=r(2),m=r.n(d);function g(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var b=function(t){l()(r,t);var e=g(r);function r(){return o()(this,r),e.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var t=null,e=null,r=null;return this.props.control.params.caption&&(t=Object(n.createElement)("span",{className:"customize-control-caption"},this.props.control.params.caption)),this.props.control.params.label&&(e=Object(n.createElement)("span",{className:"customize-control-title wp-ui-text-highlight"},this.props.control.params.label)),this.props.control.params.description&&(r=Object(n.createElement)("span",{className:"description customize-control-description"},this.props.control.params.description)),Object(n.createElement)(n.Fragment,null,t,Object(n.createElement)("div",{className:"ast-heading-wrapper wp-ui-highlight"},Object(n.createElement)("label",{className:"customizer-text"},e,r)))}}]),r}(n.Component);b.propTypes={control:m.a.object.isRequired};var v=b,y=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(v,{control:this}),this.container[0])}});function w(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var O=function(t){l()(r,t);var e=w(r);function r(t){var n;return o()(this,r),(n=e.call(this,t)).value=t.control.setting.get(),n.state={value:n.value},n.name=t.control.params.settings.default,n.name=n.name.replace("[","-"),n.name=n.name.replace("]",""),n}return s()(r,[{key:"render",value:function(){var t="hidden-field-".concat(this.name);return Object(n.createElement)("input",{type:"hidden",className:t,"data-name":this.name,value:this.state.value})}}]),r}(n.Component);O.propTypes={control:m.a.object.isRequired};var k=O,E=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(k,{control:this}),this.container[0])}}),j=r(31),C=r.n(j);function S(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var x=function(t){l()(r,t);var e=S(r);function r(){return o()(this,r),e.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var t=null,e=null,r=null;return this.props.control.params.label&&(t=Object(n.createElement)("span",{className:"customize-control-title"},this.props.control.params.label)),this.props.control.params.help&&(e=Object(n.createElement)("span",{className:"ast-description"},C()(this.props.control.params.help))),this.props.control.params.description&&(r=Object(n.createElement)("span",{className:"description customize-control-description"},this.props.control.params.description)),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",{className:"customizer-text"},t,e,r))}}]),r}(n.Component);x.propTypes={control:m.a.object.isRequired};var N=x,R=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(N,{control:this}),this.container[0])}}),T=r(11),A=r.n(T),D=r(3),z=r.n(D),P=r(9),L=r(8);function q(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function I(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?q(Object(r),!0).forEach((function(e){A()(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):q(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function B(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var M=function(t){l()(r,t);var e=B(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.state={value:a},n.onUrlChange=n.onUrlChange.bind(z()(n)),n.onCheckboxChange=n.onCheckboxChange.bind(z()(n)),n.onRelChange=n.onRelChange.bind(z()(n)),n}return s()(r,[{key:"onUrlChange",value:function(t){var e=I(I({},this.state.value),{},{url:t});this.setState({value:e}),this.props.control.setting.set(e)}},{key:"onCheckboxChange",value:function(){var t=I(I({},this.state.value),{},{new_tab:event.target.checked});this.setState({value:t}),this.props.control.setting.set(t)}},{key:"onRelChange",value:function(t){var e=I(I({},this.state.value),{},{link_rel:t});this.setState({value:e}),this.props.control.setting.set(e)}},{key:"render",value:function(){var t=this,e=this.props.control.params,r=e.value,a=e.label,o=e.settings,i=this.state.value,s=i.url,c=i.new_tab,l=i.link_rel,u=o.default;u=(u=u.replace("[","-")).replace("]","");var p=null;return a&&(p=Object(n.createElement)("label",null,Object(n.createElement)("span",{className:"customize-control-title"},a))),Object(n.createElement)(n.Fragment,null,p,Object(n.createElement)("div",{className:"customize-control-content"},Object(n.createElement)(L.TextControl,{value:s,className:"ast-link-input",onChange:function(e){t.onUrlChange(e)}})),Object(n.createElement)("div",{className:"customize-control-content ast-link-open-in-new-tab-wrapper"},Object(n.createElement)("input",{type:"checkbox",id:"ast-link-open-in-new-tab",className:"ast-link-open-in-new-tab",name:"ast-link-open-in-new-tab",checked:c,onChange:function(){return t.onCheckboxChange()}}),Object(n.createElement)("label",null,Object(P.__)("Open in a New Tab"))),Object(n.createElement)("div",{className:"customize-control-content"},Object(n.createElement)("label",null,Object(n.createElement)("span",{className:"customize-control-title"},Object(P.__)("Button Link Rel"))),Object(n.createElement)(L.TextControl,{value:l,className:"ast-link-relationship",onChange:function(e){t.onRelChange(e)}})),Object(n.createElement)("input",{type:"hidden",id:"_customize-input-".concat(o.default),className:"customize-link-control-data",name:u,"data-customize-setting-link":o.default,"data-value":JSON.stringify(r)}))}}]),r}(n.Component);M.propTypes={control:m.a.object.isRequired};var V=M,U=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(V,{control:this}),this.container[0])}});function Q(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var H=function(t){l()(r,t);var e=Q(r);function r(){return o()(this,r),e.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var t=this.props.control.params,e=t.caption,r=t.separator,a=t.label,o=t.description,i=null,s=null,c=null,l=null;return r&&(i=Object(n.createElement)("hr",null)),e&&(s=Object(n.createElement)("span",{className:"customize-control-caption"},e)),a&&(c=Object(n.createElement)("span",{className:"customize-control-title"},a)),o&&(l=Object(n.createElement)("span",{className:"description customize-control-description"},o)),Object(n.createElement)(n.Fragment,null,s,i,Object(n.createElement)("label",{className:"customizer-text"},c,l))}}]),r}(n.Component);H.propTypes={control:m.a.object.isRequired};var F=H,G=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(F,{control:this}),this.container[0])}});function Y(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var J=function(t){l()(r,t);var e=Y(r);function r(){return o()(this,r),e.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var t=null,e=null,r=this.props.control.params,a=r.label,o=r.help,i=r.name;return a&&(t=Object(n.createElement)("span",{className:"customize-control-title"},a)),o&&(e=Object(n.createElement)("span",{className:"ast-description"},o)),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("div",{className:"ast-toggle-desc-wrap"},Object(n.createElement)("label",{className:"customizer-text"},t,e,Object(n.createElement)("span",{className:"ast-adv-toggle-icon dashicons","data-control":i}))),Object(n.createElement)("div",{className:"ast-field-settings-wrap"}))}}]),r}(n.Component);J.propTypes={control:m.a.object.isRequired};var X=J,W=r(10),Z=r.n(W);function K(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function $(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var tt=function(t){l()(r,t);var e=$(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.state={value:a},n.onBorderChange=n.onBorderChange.bind(z()(n)),n.onConnectedClick=n.onConnectedClick.bind(z()(n)),n.onDisconnectedClick=n.onDisconnectedClick.bind(z()(n)),n}return s()(r,[{key:"onBorderChange",value:function(t){var e=this.props.control.params.choices,r=function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?K(Object(r),!0).forEach((function(e){A()(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):K(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},this.state.value);if(event.target.classList.contains("connected"))for(var n in e)r[n]=event.target.value;else r[t]=event.target.value;this.setState({value:r}),this.props.control.setting.set(r)}},{key:"onConnectedClick",value:function(){for(var t=event.target.parentElement.parentElement.querySelectorAll(".ast-border-input"),e=0;e<t.length;e++)t[e].classList.remove("connected"),t[e].setAttribute("data-element-connect","");event.target.parentElement.classList.remove("disconnected")}},{key:"onDisconnectedClick",value:function(){for(var t=event.target.dataset.elementConnect,e=event.target.parentElement.parentElement.querySelectorAll(".ast-border-input"),r=0;r<e.length;r++)e[r].classList.add("connected"),e[r].setAttribute("data-element-connect",t);event.target.parentElement.classList.add("disconnected")}},{key:"render",value:function(){var t,e=this,r=this.props.control.params,a=r.label,o=r.description,i=r.linked_choices,s=r.id,c=r.choices,l=r.inputAttrs,u=r.name,p=null,h=null,f=null,d=Object(P.__)("Link Values Together","astra");return a&&(p=Object(n.createElement)("span",{className:"customize-control-title"},a)),o&&(h=Object(n.createElement)("span",{className:"description customize-control-description"},o)),i&&(f=Object(n.createElement)("li",{key:s,className:"ast-border-input-item-link"},Object(n.createElement)("span",{className:"dashicons dashicons-admin-links ast-border-connected wp-ui-highlight",onClick:function(){e.onConnectedClick()},"data-element-connect":s,title:d}),Object(n.createElement)("span",{className:"dashicons dashicons-editor-unlink ast-border-disconnected",onClick:function(){e.onDisconnectedClick()},"data-element-connect":s,title:d}))),t=Object.keys(c).map((function(t){if(c[t])var r=Object(n.createElement)("li",Z()({},l,{key:t,className:"ast-border-input-item"}),Object(n.createElement)("input",{type:"number",className:"ast-border-input ast-border-desktop","data-id":t,"data-name":u,onChange:function(){return e.onBorderChange(t)},value:e.state.value[t]}),Object(n.createElement)("span",{className:"ast-border-title"},c[t]));return r})),Object(n.createElement)(n.Fragment,null,p,h,Object(n.createElement)("div",{className:"ast-border-outer-wrapper"},Object(n.createElement)("div",{className:"input-wrapper ast-border-wrapper"},Object(n.createElement)("ul",{className:"ast-border-wrapper desktop active"},f,t))))}}]),r}(n.Component);tt.propTypes={control:m.a.object.isRequired};var et=tt;function rt(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function nt(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?rt(Object(r),!0).forEach((function(e){A()(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):rt(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function at(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var ot=function(t){l()(r,t);var e=at(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.state={value:a},n.renderInputHtml=n.renderInputHtml.bind(z()(n)),n.onInputChange=n.onInputChange.bind(z()(n)),n.onSelectChange=n.onSelectChange.bind(z()(n)),n}return s()(r,[{key:"onInputChange",value:function(t){var e=nt({},this.state.value);e[t]=event.target.value,this.updateValues(e)}},{key:"onSelectChange",value:function(t){var e=nt({},this.state.value);e["".concat(t,"-unit")]=event.target.value,this.updateValues(e)}},{key:"renderInputHtml",value:function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],o=this.props.control.params.units,i=!1;1===o.length&&(i=!0);var s=Object.keys(o).map((function(t){return Object(n.createElement)("option",{key:t,value:t},o[t])}));return!1===a?Object(n.createElement)(n.Fragment,null,Object(n.createElement)("input",{key:t+"input","data-id":t,className:"ast-responsive-input ast-non-reponsive ".concat(t," ").concat(r),type:"number",value:this.state.value[t],onChange:function(){e.onInputChange(t)}}),Object(n.createElement)("select",{key:t+"select",value:this.state.value["".concat(t,"-unit")],className:"ast-responsive-select ".concat(t),"data-id":"".concat(t,"-unit"),disabled:i,onChange:function(){e.onSelectChange(t)}},s)):Object(n.createElement)(n.Fragment,null,Object(n.createElement)("input",{key:t+"input","data-id":t,className:"ast-responsive-input ".concat(t," ").concat(r),type:"number",value:this.state.value[t],onChange:function(){e.onInputChange(t)}}),Object(n.createElement)("select",{key:t+"select",value:this.state.value["".concat(t,"-unit")],className:"ast-responsive-select ".concat(t),"data-id":"".concat(t,"-unit"),disabled:i,onChange:function(){e.onSelectChange(t)}},s))}},{key:"render",value:function(){var t=this.props.control.params,e=t.description,r=t.label,a=t.responsive,o=null,i=null,s=null,c=null;return r&&(o=Object(n.createElement)("span",{className:"customize-control-title"},r),a&&(i=Object(n.createElement)("ul",{key:"ast-resp-ul",className:"ast-responsive-btns"},Object(n.createElement)("li",{key:"desktop",className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{key:"tablet",className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{key:"mobile",className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"})))))),e&&(s=Object(n.createElement)("span",{className:"description customize-control-description"},e)),c=a?Object(n.createElement)(n.Fragment,null,this.renderInputHtml("desktop","active"),this.renderInputHtml("tablet"),this.renderInputHtml("mobile")):Object(n.createElement)(n.Fragment,null,this.renderInputHtml("desktop","active",!1)),Object(n.createElement)("label",{key:"customizer-text",className:"customizer-text"},o,i,s,Object(n.createElement)("div",{className:"input-wrapper ast-responsive-wrapper"},c))}},{key:"updateValues",value:function(t){this.setState({value:t}),this.props.control.setting.set(t)}}]),r}(n.Component);ot.propTypes={control:m.a.object.isRequired};var it=ot;function st(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function ct(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var lt=function(t){l()(r,t);var e=ct(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.state={value:a},n.renderInputHtml=n.renderInputHtml.bind(z()(n)),n.onInputChange=n.onInputChange.bind(z()(n)),n.onResetClick=n.onResetClick.bind(z()(n)),n}return s()(r,[{key:"onResetClick",value:function(){this.updateValues(this.props.control.params.default)}},{key:"onInputChange",value:function(t){var e=function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?st(Object(r),!0).forEach((function(e){A()(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):st(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},this.state.value);e[t]=event.target.value,this.updateValues(e)}},{key:"renderInputHtml",value:function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=this.props.control.params,o=a.inputAttrs,i=a.suffix,s=null,c=[];if(i&&(s=Object(n.createElement)("span",{className:"ast-range-unit"},i)),void 0!==o){var l=o.split(" ");l.map((function(t,e){var r=t.split("=");void 0!==r[1]&&(c[r[0]]=r[1].replace(/"/g,""))}))}return Object(n.createElement)("div",{className:"input-field-wrapper ".concat(t," ").concat(r)},Object(n.createElement)("input",Z()({type:"range"},c,{value:this.state.value[t],"data-reset_value":this.props.control.params.default[t],onChange:function(){e.onInputChange(t)}})),Object(n.createElement)("div",{className:"astra_range_value"},Object(n.createElement)("input",Z()({type:"number"},c,{"data-id":t,className:"ast-responsive-range-value-input",value:this.state.value[t],onChange:function(){e.onInputChange(t)}})),s))}},{key:"render",value:function(){var t,e,r=this,a=this.props.control.params,o=a.description,i=a.label,s=Object(P.__)("Back to default","astra"),c=null,l=null,u=null;return i&&(c=Object(n.createElement)("span",{className:"customize-control-title"},i),l=Object(n.createElement)("ul",{key:"ast-resp-ul",className:"ast-responsive-slider-btns"},Object(n.createElement)("li",{className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop active","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"}))))),o&&(u=Object(n.createElement)("span",{className:"description customize-control-description"},o)),t=Object(n.createElement)(n.Fragment,null,this.renderInputHtml("desktop","active"),this.renderInputHtml("tablet"),this.renderInputHtml("mobile")),e=Object(n.createElement)("div",{className:"ast-responsive-slider-reset",onClick:function(){r.onResetClick()}},Object(n.createElement)("span",{className:"dashicons dashicons-image-rotate ast-control-tooltip",title:s})),Object(n.createElement)("label",{key:"customizer-text"},c,l,u,Object(n.createElement)("div",{className:"wrapper"},t,e))}},{key:"updateValues",value:function(t){var e=this.props.control.params.inputAttrs;if(e&&void 0!==e&&""!==e){var r=e.split(" "),n=[];for(var a in r.map((function(t,e){var r=t.split("=");void 0!==r[1]&&(n[r[0]]=r[1].replace(/"/g,""))})),t)void 0!==n.max&&""!==n.max&&t[a]>n.max&&(t[a]=n.max),void 0!==n.min&&""!==n.min&&t[a]<n.min&&(t[a]=n.min)}this.setState({value:t}),this.props.control.setting.set(t)}}]),r}(n.Component);lt.propTypes={control:m.a.object.isRequired};var ut=lt;function pt(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function ht(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?pt(Object(r),!0).forEach((function(e){A()(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):pt(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function ft(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var dt=function(t){l()(r,t);var e=ft(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return void 0!==a&&""!==a||(a=n.props.control.params.value),n.state={value:a},n.renderInputHtml=n.renderInputHtml.bind(z()(n)),n.renderResponsiveInput=n.renderResponsiveInput.bind(z()(n)),n.onUnitChange=n.onUnitChange.bind(z()(n)),n.updateValues=n.updateValues.bind(z()(n)),n.onSpacingChange=n.onSpacingChange.bind(z()(n)),n.onConnectedClick=n.onConnectedClick.bind(z()(n)),n.onDisconnectedClick=n.onDisconnectedClick.bind(z()(n)),n}return s()(r,[{key:"onConnectedClick",value:function(){for(var t=event.target.parentElement.parentElement.querySelectorAll(".ast-spacing-input"),e=0;e<t.length;e++)t[e].classList.remove("connected"),t[e].setAttribute("data-element-connect","");event.target.parentElement.classList.remove("disconnected")}},{key:"onDisconnectedClick",value:function(){for(var t=event.target.dataset.elementConnect,e=event.target.parentElement.parentElement.querySelectorAll(".ast-spacing-input"),r=0;r<e.length;r++)e[r].classList.add("connected"),e[r].setAttribute("data-element-connect",t);event.target.parentElement.classList.add("disconnected")}},{key:"onSpacingChange",value:function(t,e){var r=this.props.control.params.choices,n=ht({},this.state.value),a=ht({},n[t]);if(event.target.classList.contains("connected"))for(var o in r)a[o]=event.target.value;else a[e]=event.target.value;n[t]=a,this.updateValues(n)}},{key:"onUnitChange",value:function(t,e){var r=ht({},this.state.value);r["".concat(t,"-unit")]=e,this.updateValues(r)}},{key:"renderResponsiveInput",value:function(t){var e=this;return Object(n.createElement)("input",{key:t,type:"hidden",onChange:function(){return e.onUnitChange(t,"")},className:"ast-spacing-unit-input ast-spacing-".concat(t,"-unit"),"data-device":"".concat(t),value:this.state.value["".concat(t,"-unit")]})}},{key:"renderInputHtml",value:function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=this.props.control.params,o=a.linked_choices,i=a.id,s=a.choices,c=a.inputAttrs,l=a.unit_choices,u=Object(P.__)("Link Values Together","astra"),p=null,h=null,f=null;return o&&(p=Object(n.createElement)("li",{key:"connect-disconnect"+t,className:"ast-spacing-input-item-link"},Object(n.createElement)("span",{key:"connect"+t,className:"dashicons dashicons-admin-links ast-spacing-connected wp-ui-highlight",onClick:function(){e.onConnectedClick()},"data-element-connect":i,title:u}),Object(n.createElement)("span",{key:"disconnect"+t,className:"dashicons dashicons-editor-unlink ast-spacing-disconnected",onClick:function(){e.onDisconnectedClick()},"data-element-connect":i,title:u}))),h=Object.keys(s).map((function(r){return Object(n.createElement)("li",Z()({key:r},c,{className:"ast-spacing-input-item"}),Object(n.createElement)("input",{type:"number",className:"ast-spacing-input ast-spacing-".concat(t),"data-id":r,value:e.state.value[t][r],onChange:function(){return e.onSpacingChange(t,r)}}),Object(n.createElement)("span",{className:"ast-spacing-title"},s[r]))})),l&&void 0!==l&&(f=Object.values(l).map((function(r){var a="";return e.state.value["".concat(t,"-unit")]===r&&(a="active"),Object(n.createElement)("li",{key:r,className:"single-unit ".concat(a),onClick:function(){return e.onUnitChange(t,r)},"data-unit":r},Object(n.createElement)("span",{className:"unit-text"},r))}))),Object(n.createElement)("ul",{key:t,className:"ast-spacing-wrapper ".concat(t," ").concat(r)},p,h,Object(n.createElement)("ul",{key:"responsive-units",className:"ast-spacing-responsive-units ast-spacing-".concat(t,"-responsive-units")},f))}},{key:"render",value:function(){var t,e,r=this.props.control.params,a=r.label,o=r.description,i=null,s=null;return a&&(i=Object(n.createElement)("span",{className:"customize-control-title"},a)),o&&(s=Object(n.createElement)("span",{className:"description customize-control-description"},o)),t=Object(n.createElement)(n.Fragment,null,this.renderInputHtml("desktop","active"),this.renderInputHtml("tablet"),this.renderInputHtml("mobile")),e=Object(n.createElement)(n.Fragment,null,Object(n.createElement)("div",{className:"unit-input-wrapper ast-spacing-unit-wrapper"},this.renderResponsiveInput("desktop"),this.renderResponsiveInput("tablet"),this.renderResponsiveInput("mobile")),Object(n.createElement)("ul",{key:"ast-spacing-responsive-btns",className:"ast-spacing-responsive-btns"},Object(n.createElement)("li",{key:"desktop",className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop active","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{key:"tablet",className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{key:"mobile",className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"}))))),Object(n.createElement)("label",{key:"ast-spacing-responsive",className:"ast-spacing-responsive"},i,s,Object(n.createElement)("div",{className:"ast-spacing-responsive-outer-wrapper"},Object(n.createElement)("div",{className:"input-wrapper ast-spacing-responsive-wrapper"},t),Object(n.createElement)("div",{className:"ast-spacing-responsive-units-screen-wrap"},e)))}},{key:"updateValues",value:function(t){this.setState({value:t}),this.props.control.setting.set(t)}}]),r}(n.Component);dt.propTypes={control:m.a.object.isRequired};var mt=dt;function gt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var bt=function(t){l()(r,t);var e=gt(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.state={value:a},n.updateValues=n.updateValues.bind(z()(n)),n}return s()(r,[{key:"render",value:function(){var t=this,e=this.props.control.params,r=e.label,a=e.description,o=e.suffix,i=e.link,s=e.inputAttrs,c=e.name,l=null,u=null,p=null,h=[],f=Object(P.__)("Back to default","astra");(r&&(l=Object(n.createElement)("label",null,Object(n.createElement)("span",{className:"customize-control-title"},r))),a&&(u=Object(n.createElement)("span",{className:"description customize-control-description"},a)),o&&(p=Object(n.createElement)("span",{className:"ast-range-unit"},o)),void 0!==s)&&s.split(" ").map((function(t,e){var r=t.split("=");void 0!==r[1]&&(h[r[0]]=r[1].replace(/"/g,""))}));void 0!==i&&i.split(" ").map((function(t,e){var r=t.split("=");void 0!==r[1]&&(h[r[0]]=r[1].replace(/"/g,""))}));return Object(n.createElement)("label",null,l,u,Object(n.createElement)("div",{className:"wrapper"},Object(n.createElement)("input",Z()({},h,{type:"range",value:this.state.value,"data-reset_value":this.props.control.params.default,onChange:function(){return t.updateValues(event.target.value)}})),Object(n.createElement)("div",{className:"astra_range_value"},Object(n.createElement)("input",Z()({},h,{type:"number","data-name":c,className:"value ast-range-value-input",value:this.state.value,onChange:function(){return t.updateValues(event.target.value)}})),p),Object(n.createElement)("div",{className:"ast-slider-reset",onClick:function(){t.updateValues(t.props.control.params.default)}},Object(n.createElement)("span",{className:"dashicons dashicons-image-rotate ast-control-tooltip",title:f}))))}},{key:"updateValues",value:function(t){var e=this.props.control.params.inputAttrs;if(e&&void 0!==e&&""!==e){var r=e.split(" "),n=[];if(r.map((function(t,e){var r=t.split("=");void 0!==r[1]&&(n[r[0]]=r[1].replace(/"/g,""))})),void 0!==n.max&&""!==n.max&&t>n.max&&(t=n.max),void 0!==n.min&&""!==n.min&&t<n.min&&(t=n.min),void 0!==n.step&&""!==n.step){var a=t/n.step;t=(a=Math.round(a))*n.step}}this.setState({value:t}),this.props.control.setting.set(t)}}]),r}(n.Component);bt.propTypes={control:m.a.object.isRequired};var vt=bt,yt=r(32);function _t(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var wt=function(t){l()(r,t);var e=_t(r);function r(t){var n;return o()(this,r),(n=e.call(this,t)).onChangeComplete=n.onChangeComplete.bind(z()(n)),n.onChangeGradientComplete=n.onChangeGradientComplete.bind(z()(n)),n.renderImageSettings=n.renderImageSettings.bind(z()(n)),n.onRemoveImage=n.onRemoveImage.bind(z()(n)),n.onSelectImage=n.onSelectImage.bind(z()(n)),n.open=n.open.bind(z()(n)),n.state={isVisible:!1,refresh:!1,color:n.props.color,modalCanClose:!0,backgroundType:n.props.backgroundType,supportGradient:void 0!==L.__experimentalGradientPicker},n.props.allowImage&&(n.state.backgroundImage=n.props.backgroundImage,n.state.media=n.props.media,n.state.backgroundAttachment=n.props.backgroundAttachment,n.state.backgroundPosition=n.props.backgroundPosition,n.state.backgroundRepeat=n.props.backgroundRepeat,n.state.backgroundSize=n.props.backgroundSize),n}return s()(r,[{key:"render",value:function(){var t=this,e=this.state,r=e.refresh,a=e.modalCanClose,o=e.isVisible,i=e.supportGradient,s=e.backgroundType,c=e.color,l=this.props,u=l.allowGradient,p=l.allowImage,h=function(){a&&!0===o&&t.setState({isVisible:!1})},f=!(!u||!i),d=[{name:"color",title:Object(P.__)("Color","astra"),className:"astra-color-background"}];if(f){var m={name:"gradient",title:Object(P.__)("Gradient","astra"),className:"astra-image-background"};d.push(m)}if(p){var g={name:"image",title:Object(P.__)("Image","astra"),className:"astra-image-background"};d.push(g)}return Object(n.createElement)("div",{className:"astra-color-picker-wrap"},Object(n.createElement)(n.Fragment,null,o&&Object(n.createElement)(L.Popover,{position:"top left",className:"astra-popover-color",onClose:h},1<d.length&&Object(n.createElement)(L.TabPanel,{className:"astra-popover-tabs astra-background-tabs",activeClass:"active-tab",initialTabName:s,tabs:d},(function(e){var a;return e.name&&("gradient"===e.name&&(a=Object(n.createElement)(n.Fragment,null,Object(n.createElement)(L.__experimentalGradientPicker,{value:c&&c.includes("gradient")?c:"",onChange:function(e){return t.onChangeGradientComplete(e)}}))),"image"===e.name?a=t.renderImageSettings():"color"===e.name&&(a=Object(n.createElement)(n.Fragment,null,r&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(L.ColorPicker,{color:c,onChangeComplete:function(e){return t.onChangeComplete(e)}})),!r&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(L.ColorPicker,{color:c,onChangeComplete:function(e){return t.onChangeComplete(e)}}))))),Object(n.createElement)("div",null,a)})),1===d.length&&Object(n.createElement)(n.Fragment,null,r&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(L.ColorPicker,{color:c,onChangeComplete:function(e){return t.onChangeComplete(e)}})),!r&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(L.ColorPicker,{color:c,onChangeComplete:function(e){return t.onChangeComplete(e)}}))))),Object(n.createElement)("div",{className:"color-button-wrap"},Object(n.createElement)(L.Button,{className:"astra-color-icon-indicate",onClick:function(){o?h():(!0===r?t.setState({refresh:!1}):t.setState({refresh:!0}),t.setState({isVisible:!0}))}},("color"===s||"gradient"===s)&&Object(n.createElement)(L.ColorIndicator,{className:"astra-advanced-color-indicate",colorValue:this.props.color}),"image"===s&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(L.ColorIndicator,{className:"astra-advanced-color-indicate",colorValue:"#ffffff"}),Object(n.createElement)(L.Dashicon,{icon:"admin-site"})))))}},{key:"onChangeGradientComplete",value:function(t){var e;e=void 0===t?"":t,this.setState({color:e}),this.setState({backgroundType:"gradient"}),this.props.onChangeComplete(e,"gradient")}},{key:"onChangeComplete",value:function(t){var e;e=void 0!==t.rgb&&void 0!==t.rgb.a&&1!==t.rgb.a?"rgba("+t.rgb.r+","+t.rgb.g+","+t.rgb.b+","+t.rgb.a+")":t.hex,this.setState({color:e}),this.setState({backgroundType:"color"}),this.props.onChangeComplete(t,"color")}},{key:"onSelectImage",value:function(t){this.setState({modalCanClose:!0}),this.setState({media:t}),this.setState({backgroundType:"image"}),this.props.onSelectImage(t,"image")}},{key:"onRemoveImage",value:function(){this.setState({modalCanClose:!0}),this.setState({media:""}),this.props.onSelectImage("")}},{key:"open",value:function(t){this.setState({modalCanClose:!1}),t()}},{key:"onChangeImageOptions",value:function(t,e,r){this.setState(A()({},t,r)),this.setState({backgroundType:"image"}),this.props.onChangeImageOptions(e,r,"image")}},{key:"renderImageSettings",value:function(){var t=this,e=this.state,r=e.media,a=e.backgroundImage,o=e.backgroundPosition,i=e.backgroundAttachment,s=e.backgroundRepeat,c=e.backgroundSize;return Object(n.createElement)(n.Fragment,null,(r.url||a)&&Object(n.createElement)("img",{src:r.url?r.url:a,width:"200",height:"200"}),Object(n.createElement)(yt.MediaUpload,{title:"Select Background Image",onSelect:function(e){return t.onSelectImage(e)},allowedTypes:["image"],value:void 0!==r&&r?r:"",render:function(e){var o=e.open;return Object(n.createElement)(L.Button,{className:"upload-button button-add-media",isDefault:!0,onClick:function(){return t.open(o)}},r||a?"Replace image":"Select Background Image")}}),(r||a)&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(L.Button,{className:"uagb-rm-btn",onClick:this.onRemoveImage,isLink:!0,isDestructive:!0},"Remove Image"),Object(n.createElement)(L.SelectControl,{label:"Image Position",value:o,onChange:function(e){return t.onChangeImageOptions("backgroundPosition","background-position",e)},options:[{value:"top-left",label:"Top Left"},{value:"top-center",label:"Top Center"},{value:"top-right",label:"Top Right"},{value:"center-left",label:"Center Left"},{value:"center-center",label:"Center Center"},{value:"center-right",label:"Center Right"},{value:"bottom-left",label:"Bottom Left"},{value:"bottom-center",label:"Bottom Center"},{value:"bottom-right",label:"Bottom Right"}]}),Object(n.createElement)(L.SelectControl,{label:Object(P.__)("Attachment"),value:i,onChange:function(e){return t.onChangeImageOptions("backgroundAttachment","background-attachment",e)},options:[{value:"fixed",label:"Fixed"},{value:"scroll",label:"Scroll"}]}),Object(n.createElement)(L.SelectControl,{label:Object(P.__)("Repeat"),value:s,onChange:function(e){return t.onChangeImageOptions("backgroundRepeat","background-repeat",e)},options:[{value:"no-repeat",label:"No Repeat"},{value:"repeat",label:"Repeat"},{value:"repeat-x",label:"Repeat-x"},{value:"repeat-y",label:"Repeat-y"}]}),Object(n.createElement)(L.SelectControl,{label:Object(P.__)("Size"),value:c,onChange:function(e){return t.onChangeImageOptions("backgroundSize","background-size",e)},options:[{value:"auto",label:"Auto"},{value:"cover",label:"Cover"},{value:"contain",label:"Contain"}]})))}}]),r}(n.Component);wt.propTypes={color:m.a.string,usePalette:m.a.bool,palette:m.a.string,presetColors:m.a.object,onChangeComplete:m.a.func,onChange:m.a.func,customizer:m.a.object};var Ot=wt;function kt(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function Et(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?kt(Object(r),!0).forEach((function(e){A()(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):kt(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function jt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var Ct=function(t){l()(r,t);var e=jt(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.defaultValue=n.props.control.params.default,n.onSelectImage=n.onSelectImage.bind(z()(n)),n.state={value:a},n.updateBackgroundType(),n}return s()(r,[{key:"updateBackgroundType",value:function(){var t=Et({},this.state.value);void 0!==this.state.value["background-type"]&&""!==this.state.value["background-type"]||(void 0!==this.state.value["background-color"]&&(t["background-type"]="color",this.updateValues(t),this.state.value["background-color"].includes("gradient")&&(t["background-type"]="gradient",this.updateValues(t))),void 0!==this.state.value["background-image"]&&(t["background-type"]="image",this.updateValues(t)))}},{key:"renderReset",value:function(){var t=this;return Object(n.createElement)("span",{className:"customize-control-title"},Object(n.createElement)(L.Button,{className:"reset astra-reset",disabled:JSON.stringify(this.state.value)===JSON.stringify(this.defaultValue),onClick:function(){var e=JSON.parse(JSON.stringify(t.defaultValue));t.updateValues(e)}},Object(n.createElement)(L.Dashicon,{icon:"image-rotate"})))}},{key:"onSelectImage",value:function(t,e){var r=Et({},this.state.value);r["background-media"]=t.id,r["background-image"]=t.url,r["background-type"]=e,this.updateValues(r)}},{key:"onChangeImageOptions",value:function(t,e,r){var n=Et({},this.state.value);n[t]=e,n["background-type"]=r,this.updateValues(n)}},{key:"renderSettings",value:function(){var t=this;return Object(n.createElement)(n.Fragment,null,Object(n.createElement)(Ot,{color:void 0!==this.state.value["background-color"]&&this.state.value["background-color"]?this.state.value["background-color"]:"",onChangeComplete:function(e,r){return t.handleChangeComplete(e,r)},media:void 0!==this.state.value["background-media"]&&this.state.value["background-media"]?this.state.value["background-media"]:"",backgroundImage:void 0!==this.state.value["background-image"]&&this.state.value["background-image"]?this.state.value["background-image"]:"",backgroundAttachment:void 0!==this.state.value["background-attachment"]&&this.state.value["background-attachment"]?this.state.value["background-attachment"]:"",backgroundPosition:void 0!==this.state.value["background-position"]&&this.state.value["background-position"]?this.state.value["background-position"]:"",backgroundRepeat:void 0!==this.state.value["background-repeat"]&&this.state.value["background-repeat"]?this.state.value["background-repeat"]:"",backgroundSize:void 0!==this.state.value["background-size"]&&this.state.value["background-size"]?this.state.value["background-size"]:"",onSelectImage:function(e,r){return t.onSelectImage(e,r)},onChangeImageOptions:function(e,r,n){return t.onChangeImageOptions(e,r,n)},backgroundType:void 0!==this.state.value["background-type"]&&this.state.value["background-type"]?this.state.value["background-type"]:"color",allowGradient:!0,allowImage:!0}))}},{key:"handleChangeComplete",value:function(t,e){var r;r="string"==typeof t||t instanceof String?t:void 0!==t.rgb&&void 0!==t.rgb.a&&1!==t.rgb.a?"rgba("+t.rgb.r+","+t.rgb.g+","+t.rgb.b+","+t.rgb.a+")":t.hex;var n=Et({},this.state.value);n["background-color"]=r,n["background-type"]=e,this.updateValues(n)}},{key:"render",value:function(){var t,e=this.props.control.params,r=e.defaultValue,a=e.label,o=e.description,i="#RRGGBB",s=null,c=null;return r&&(i="#"!==r.substring(0,1)?"#"+r:r,defaultValueAttr=" data-default-color="+i),s=a&&""!==a&&void 0!==a?Object(n.createElement)("span",{className:"customize-control-title"},a):Object(n.createElement)("span",{className:"customize-control-title"},Object(P.__)("Background","astra")),o&&(c=Object(n.createElement)("span",{className:"description customize-control-description"},o)),t=Object(n.createElement)("div",{className:"background-wrapper"},Object(n.createElement)("div",{className:"background-container"},this.renderReset(),this.renderSettings())),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,s,c),Object(n.createElement)("div",{className:"customize-control-content"},t))}},{key:"updateValues",value:function(t){this.setState({value:t}),this.props.control.setting.set(t)}}]),r}(n.Component);Ct.propTypes={control:m.a.object.isRequired};var St=Ct;function xt(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function Nt(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?xt(Object(r),!0).forEach((function(e){A()(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):xt(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function Rt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var Tt=function(t){l()(r,t);var e=Rt(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.defaultValue=n.props.control.params.default,n.onSelectImage=n.onSelectImage.bind(z()(n)),n.state={value:a},n}return s()(r,[{key:"componentDidMount",value:function(){for(var t=0,e=["desktop","mobile","tablet"];t<e.length;t++){var r=e[t];this.updateBackgroundType(r)}}},{key:"updateBackgroundType",value:function(t){var e=Nt({},this.state.value);if(void 0===this.state.value[t]["background-type"]||""===this.state.value[t]["background-type"]){var r=Nt({},e[t]);void 0!==this.state.value[t]["background-color"]&&(r["background-type"]="color",e[t]=r,this.updateValues(e),this.state.value[t]["background-color"].includes("gradient")&&(r["background-type"]="gradient",e[t]=r,this.updateValues(e))),void 0!==this.state.value[t]["background-image"]&&(r["background-type"]="image",e[t]=r,this.updateValues(e))}}},{key:"renderReset",value:function(t){var e=this;return Object(n.createElement)("span",{className:"customize-control-title"},Object(n.createElement)(n.Fragment,null,Object(n.createElement)(L.Button,{className:"reset astra-reset",disabled:JSON.stringify(this.state.value)===JSON.stringify(this.defaultValue),onClick:function(){var t=JSON.parse(JSON.stringify(e.defaultValue));e.updateValues(t)}},Object(n.createElement)(L.Dashicon,{icon:"image-rotate"}))))}},{key:"onSelectImage",value:function(t,e,r){var n=Nt({},this.state.value),a=Nt({},n[e]);a["background-image"]=t.url,a["background-media"]=t.id,a["background-type"]=r,n[e]=a,this.updateValues(n)}},{key:"onChangeImageOptions",value:function(t,e,r,n){var a=Nt({},this.state.value),o=Nt({},a[r]);o[t]=e,o["background-type"]=n,a[r]=o,this.updateValues(a)}},{key:"renderSettings",value:function(t){var e=this;return Object(n.createElement)(n.Fragment,null,Object(n.createElement)(Ot,{color:void 0!==this.state.value[t]["background-color"]&&this.state.value[t]["background-color"]?this.state.value[t]["background-color"]:"",onChangeComplete:function(r,n){return e.handleChangeComplete(r,t,n)},media:void 0!==this.state.value[t]["background-media"]&&this.state.value[t]["background-media"]?this.state.value[t]["background-media"]:"",backgroundImage:void 0!==this.state.value[t]["background-image"]&&this.state.value[t]["background-image"]?this.state.value[t]["background-image"]:"",backgroundAttachment:void 0!==this.state.value[t]["background-attachment"]&&this.state.value[t]["background-attachment"]?this.state.value[t]["background-attachment"]:"",backgroundPosition:void 0!==this.state.value[t]["background-position"]&&this.state.value[t]["background-position"]?this.state.value[t]["background-position"]:"",backgroundRepeat:void 0!==this.state.value[t]["background-repeat"]&&this.state.value[t]["background-repeat"]?this.state.value[t]["background-repeat"]:"",backgroundSize:void 0!==this.state.value[t]["background-size"]&&this.state.value[t]["background-size"]?this.state.value[t]["background-size"]:"",onSelectImage:function(r,n){return e.onSelectImage(r,t,n)},onChangeImageOptions:function(r,n,a){return e.onChangeImageOptions(r,n,t,a)},backgroundType:void 0!==this.state.value[t]["background-type"]&&this.state.value[t]["background-type"]?this.state.value[t]["background-type"]:"color",allowGradient:!0,allowImage:!0}))}},{key:"handleChangeComplete",value:function(t,e,r){var n;n="string"==typeof t||t instanceof String?t:void 0!==t.rgb&&void 0!==t.rgb.a&&1!==t.rgb.a?"rgba("+t.rgb.r+","+t.rgb.g+","+t.rgb.b+","+t.rgb.a+")":t.hex;var a=Nt({},this.state.value),o=Nt({},a[e]);o["background-color"]=n,o["background-type"]=r,a[e]=o,this.updateValues(a)}},{key:"render",value:function(){var t,e,r=this.props.control.params,a=r.defaultValue,o=r.label,i=r.description,s="#RRGGBB",c=null,l=null;return a&&(s="#"!==a.substring(0,1)?"#"+a:a,defaultValueAttr=" data-default-color="+s),c=o&&""!==o&&void 0!==o?Object(n.createElement)("span",{className:"customize-control-title"},o):Object(n.createElement)("span",{className:"customize-control-title"},Object(P.__)("Background","astra")),i&&(l=Object(n.createElement)("span",{className:"description customize-control-description"},i)),t=Object(n.createElement)("ul",{className:"ast-responsive-btns"},Object(n.createElement)("li",{className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"})))),e=Object(n.createElement)("div",{className:"background-wrapper"},Object(n.createElement)("div",{className:"background-container desktop active"},this.renderReset("desktop"),this.renderSettings("desktop")),Object(n.createElement)("div",{className:"background-container tablet"},this.renderReset("tablet"),this.renderSettings("tablet")),Object(n.createElement)("div",{className:"background-container mobile"},this.renderReset("mobile"),this.renderSettings("mobile"))),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,c,l),t,Object(n.createElement)("div",{className:"customize-control-content"},e))}},{key:"updateValues",value:function(t){this.setState({value:t}),this.props.control.setting.set(t)}}]),r}(n.Component);Tt.propTypes={control:m.a.object.isRequired};var At=Tt;function Dt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var zt=function(t){l()(r,t);var e=Dt(r);function r(t){var n;o()(this,r),(n=e.call(this,t)).handleChangeComplete=n.handleChangeComplete.bind(z()(n)),n.updateValues=n.updateValues.bind(z()(n)),n.renderReset=n.renderReset.bind(z()(n));var a=n.props.control.setting.get();return n.defaultValue=n.props.control.params.default,n.state={value:a},n}return s()(r,[{key:"renderReset",value:function(){var t=this;return Object(n.createElement)("span",{className:"customize-control-title"},Object(n.createElement)(n.Fragment,null,Object(n.createElement)(L.Button,{className:"reset astra-reset",disabled:JSON.stringify(this.state.value)===JSON.stringify(this.defaultValue),onClick:function(){var e=JSON.parse(JSON.stringify(t.defaultValue));t.updateValues(e)}},Object(n.createElement)(L.Dashicon,{icon:"image-rotate"}))))}},{key:"handleChangeComplete",value:function(t){var e;e="string"==typeof t||t instanceof String?t:void 0!==t.rgb&&void 0!==t.rgb.a&&1!==t.rgb.a?"rgba("+t.rgb.r+","+t.rgb.g+","+t.rgb.b+","+t.rgb.a+")":t.hex,this.updateValues(e)}},{key:"render",value:function(){var t=this,e=null,r=this.props.control.params.label;return r&&(e=Object(n.createElement)("span",{className:"customize-control-title"},r)),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,e),Object(n.createElement)("div",{className:"ast-color-picker-alpha color-picker-hex"},this.renderReset(),Object(n.createElement)(Ot,{color:void 0!==this.state.value&&this.state.value?this.state.value:"",onChangeComplete:function(e,r){return t.handleChangeComplete(e)},backgroundType:"color",allowGradient:!1,allowImage:!1})))}},{key:"updateValues",value:function(t){this.setState({value:t}),this.props.control.setting.set(t)}}]),r}(n.Component);zt.propTypes={control:m.a.object.isRequired};var Pt=zt;function Lt(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function qt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var It=function(t){l()(r,t);var e=qt(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.defaultValue=n.props.control.params.default,n.state={value:a},n}return s()(r,[{key:"renderReset",value:function(t){var e=this;return Object(n.createElement)("span",{className:"customize-control-title"},Object(n.createElement)(L.Button,{className:"reset astra-reset",disabled:JSON.stringify(this.state.value)===JSON.stringify(this.defaultValue),onClick:function(){var t=JSON.parse(JSON.stringify(e.defaultValue));e.setState({value:t}),e.props.control.setting.set(t)}},Object(n.createElement)(L.Dashicon,{icon:"image-rotate"})))}},{key:"renderSettings",value:function(t){var e=this;return Object(n.createElement)(Ot,{color:void 0!==this.state.value[t]&&this.state.value[t]?this.state.value[t]:"",onChangeComplete:function(r,n){return e.handleChangeComplete(r,t)},backgroundType:"color",allowGradient:!1,allowImage:!1})}},{key:"handleChangeComplete",value:function(t,e){var r;r="string"==typeof t||t instanceof String?t:void 0!==t.rgb&&void 0!==t.rgb.a&&1!==t.rgb.a?"rgba("+t.rgb.r+","+t.rgb.g+","+t.rgb.b+","+t.rgb.a+")":t.hex,this.updateValues(r,e)}},{key:"render",value:function(){var t=this.props.control.params,e=t.defaultValue,r=t.label,a=t.description,o=t.responsive,i=(t.value,"#RRGGBB"),s=null,c=null,l=null,u=null;return e&&(i="#"!==e.substring(0,1)?"#"+e:e,defaultValueAttr=" data-default-color="+i),r&&(s=Object(n.createElement)("span",{className:"customize-control-title"},r)),a&&(c=Object(n.createElement)("span",{className:"description customize-control-description"},a)),o&&(l=Object(n.createElement)("ul",{className:"ast-responsive-btns"},Object(n.createElement)("li",{className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"})))),u=Object(n.createElement)(n.Fragment,null,Object(n.createElement)("div",{className:"ast-color-picker-alpha color-picker-hex ast-responsive-color desktop active"},this.renderReset("desktop"),this.renderSettings("desktop")),Object(n.createElement)("div",{className:"ast-color-picker-alpha color-picker-hex ast-responsive-color tablet"},this.renderReset("tablet"),this.renderSettings("tablet")),Object(n.createElement)("div",{className:"ast-color-picker-alpha color-picker-hex ast-responsive-color mobile"},this.renderReset("mobile"),this.renderSettings("mobile")))),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,s,c),l,Object(n.createElement)("div",{className:"customize-control-content"},u))}},{key:"updateValues",value:function(t,e){var r=function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?Lt(Object(r),!0).forEach((function(e){A()(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):Lt(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},this.state.value);r[e]=t,this.setState({value:r}),this.props.control.setting.set(r)}}]),r}(n.Component);It.propTypes={control:m.a.object.isRequired};var Bt=It;function Mt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var Vt=function(t){l()(r,t);var e=Mt(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.state={value:a},n.onSelectChange=n.onSelectChange.bind(z()(n)),n}return s()(r,[{key:"onSelectChange",value:function(){this.updateValues(event.target.value)}},{key:"render",value:function(){var t=this,e=this.props.control.params,r=e.label,a=e.name,o=e.choices,i=null;r&&(i=Object(n.createElement)("span",{className:"customize-control-title"},r));var s=Object.entries(o).map((function(t){return Object(n.createElement)("option",{key:t[0],value:t[0]},t[1])}));return Object(n.createElement)(n.Fragment,null,i,Object(n.createElement)("div",{className:"customize-control-content"},Object(n.createElement)("select",{className:"ast-select-input","data-name":a,"data-value":this.state.value,value:this.state.value,onChange:function(){t.onSelectChange()}},s)))}},{key:"updateValues",value:function(t){this.setState({value:t}),this.props.control.setting.set(t)}}]),r}(n.Component);Vt.propTypes={control:m.a.object.isRequired};var Ut=Vt;function Qt(t){jQuery("html").addClass("responsive-background-img-ready");var e=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive-background .customize-control-content .background-container").removeClass("active"),jQuery(".customize-control-ast-responsive-background .customize-control-content .background-container."+e).addClass("active"),jQuery(".customize-control-ast-responsive-background .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-background .ast-responsive-btns li."+e).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var t=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive-background .customize-control-content .background-container").removeClass("active"),jQuery(".customize-control-ast-responsive-background .customize-control-content .background-container."+t).addClass("active"),jQuery(".customize-control-ast-responsive-background .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-background .ast-responsive-btns li."+t).addClass("active")})),t.container.find(".ast-responsive-btns button").on("click",(function(t){var e=jQuery(this).attr("data-device");e="desktop"==e?"tablet":"tablet"==e?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+e+'"]').trigger("click")}))}function Ht(t){jQuery("html").addClass("responsive-background-color-ready");var e=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive-color .customize-control-content .ast-color-picker-alpha").removeClass("active"),jQuery(".customize-control-ast-responsive-color .customize-control-content .ast-color-picker-alpha."+e).addClass("active"),jQuery(".customize-control-ast-responsive-color .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-color .ast-responsive-btns li."+e).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var t=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive-color .customize-control-content .ast-color-picker-alpha").removeClass("active"),jQuery(".customize-control-ast-responsive-color .customize-control-content .ast-responsive-color."+t).addClass("active"),jQuery(".customize-control-ast-responsive-color .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-color .ast-responsive-btns li."+t).addClass("active")})),t.container.find(".ast-responsive-btns button").on("click",(function(t){var e=jQuery(this).attr("data-device");e="desktop"==e?"tablet":"tablet"==e?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+e+'"]').trigger("click")}))}function Ft(t){var e=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive .input-wrapper input").removeClass("active"),jQuery(".customize-control-ast-responsive .input-wrapper input."+e).addClass("active"),jQuery(".customize-control-ast-responsive .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive .ast-responsive-btns li."+e).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var t=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive .input-wrapper input, .customize-control .ast-responsive-btns > li").removeClass("active"),jQuery(".customize-control-ast-responsive .input-wrapper input."+t+", .customize-control .ast-responsive-btns > li."+t).addClass("active")})),t.container.find(".ast-responsive-btns button").on("click",(function(t){var e=jQuery(this).attr("data-device");e="desktop"==e?"tablet":"tablet"==e?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+e+'"]').trigger("click")}))}function Gt(t){var e=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive-slider .input-field-wrapper").removeClass("active"),jQuery(".customize-control-ast-responsive-slider .input-field-wrapper."+e).addClass("active"),jQuery(".customize-control-ast-responsive-slider .ast-responsive-slider-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-slider .ast-responsive-slider-btns li."+e).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var t=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive-slider .input-field-wrapper, .customize-control .ast-responsive-slider-btns > li").removeClass("active"),jQuery(".customize-control-ast-responsive-slider .input-field-wrapper."+t+", .customize-control .ast-responsive-slider-btns > li."+t).addClass("active")})),t.container.find(".ast-responsive-slider-btns button").on("click",(function(t){var e=jQuery(this).attr("data-device");e="desktop"==e?"tablet":"tablet"==e?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+e+'"]').trigger("click")}))}function Yt(t){var e=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper").removeClass("active"),jQuery(".customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper."+e).addClass("active"),jQuery(".customize-control-ast-responsive-spacing .ast-spacing-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-spacing .ast-spacing-responsive-btns li."+e).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var t=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper, .customize-control .ast-spacing-responsive-btns > li").removeClass("active"),jQuery(".customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper."+t+", .customize-control .ast-spacing-responsive-btns > li."+t).addClass("active")})),t.container.find(".ast-spacing-responsive-btns button").on("click",(function(t){var e=jQuery(this).attr("data-device");e="desktop"==e?"tablet":"tablet"==e?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+e+'"]').trigger("click")}))}var Jt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(X,{control:this}),this.container[0])},ready:function(){this.setting._value;this.registerToggleEvents(),this.container.on("ast_settings_changed",this.onOptionChange);var t=0,e=jQuery(".wp-full-overlay-sidebar-content"),r=navigator.userAgent.toLowerCase();if(r.indexOf("firefox")>-1)n=16;else var n=6;jQuery("#customize-controls .wp-full-overlay-sidebar-content .control-section").on("scroll",(function(a){var o=jQuery(this);if(o.hasClass("open")){var i=o.find(".customize-section-title"),s=o.scrollTop();if(s>t)i.removeClass("maybe-sticky").removeClass("is-in-view").removeClass("is-sticky"),o.css("padding-top","");else{var c=o.outerWidth();i.addClass("maybe-sticky").addClass("is-in-view").addClass("is-sticky").width(c-n).css("top",e.css("top")),r.indexOf("firefox")>-1||o.css("padding-top",i.height()),0===s&&(i.removeClass("maybe-sticky").removeClass("is-in-view").removeClass("is-sticky"),o.css("padding-top",""))}t=s}}))},registerToggleEvents:function(){var t=this;jQuery(".wp-full-overlay-sidebar-content, .wp-picker-container").click((function(t){jQuery(t.target).closest(".ast-field-settings-modal").length||jQuery(".ast-adv-toggle-icon.open").trigger("click")})),t.container.on("click",".ast-toggle-desc-wrap .ast-adv-toggle-icon",(function(e){e.preventDefault(),e.stopPropagation();var r=jQuery(this),n=r.closest(".customize-control-ast-settings-group"),a=n.find(".ast-field-settings-modal").data("loaded"),o=n.parents(".control-section");if(r.hasClass("open"))n.find(".ast-field-settings-modal").hide();else{var i=o.find(".ast-adv-toggle-icon.open");if(i.length>0&&i.trigger("click"),a)n.find(".ast-field-settings-modal").show();else{var s=t.params.ast_fields,c=jQuery(astra.customizer.group_modal_tmpl);n.find(".ast-field-settings-wrap").append(c),n.find(".ast-fields-wrap").attr("data-control",t.params.name),t.ast_render_field(n,s,t),n.find(".ast-field-settings-modal").show();var l=jQuery("#customize-footer-actions .active").attr("data-device");"mobile"==l?(jQuery(".ast-responsive-btns .mobile, .ast-responsive-slider-btns .mobile").addClass("active"),jQuery(".ast-responsive-btns .preview-mobile, .ast-responsive-slider-btns .preview-mobile").addClass("active")):"tablet"==l?(jQuery(".ast-responsive-btns .tablet, .ast-responsive-slider-btns .tablet").addClass("active"),jQuery(".ast-responsive-btns .preview-tablet, .ast-responsive-slider-btns .preview-tablet").addClass("active")):(jQuery(".ast-responsive-btns .desktop, .ast-responsive-slider-btns .desktop").addClass("active"),jQuery(".ast-responsive-btns .preview-desktop, .ast-responsive-slider-btns .preview-desktop").addClass("active"))}}r.toggleClass("open")})),t.container.on("click",".ast-toggle-desc-wrap > .customizer-text",(function(t){t.preventDefault(),t.stopPropagation(),jQuery(this).find(".ast-adv-toggle-icon").trigger("click")}))},ast_render_field:function(t,e,r){var n=this,a=t.find(".ast-fields-wrap"),o="",i=[],s=n.isJsonString(r.params.value)?JSON.parse(r.params.value):{};if(void 0!==e.tabs){var c=(c=r.params.name.replace("[","-")).replace("]","");o+='<div id="'+c+'-tabs" class="ast-group-tabs">',o+='<ul class="ast-group-list">';var l=0;_.each(e.tabs,(function(t,e){var r="";0==l&&(r="active"),o+='<li class="'+r+'"><a href="#tab-'+e+'"><span>'+e+"</span></a></li>",l++})),o+="</ul>",o+='<div class="ast-tab-content" >',_.each(e.tabs,(function(t,e){o+='<div id="tab-'+e+'" class="tab">';var r=n.generateFieldHtml(t,s);o+=r.html,_.each(r.controls,(function(t,e){i.push({key:t.key,value:t.value,name:t.name})})),o+="</div>"})),o+="</div></div>",a.html(o),n.renderReactControl(e,n),jQuery("#"+c+"-tabs").tabs()}else{var u=n.generateFieldHtml(e,s);o+=u.html,_.each(u.controls,(function(t,e){i.push({key:t.key,value:t.value,name:t.name})})),a.html(o),n.renderReactControl(e,n)}_.each(i,(function(t,e){switch(t.key){case"ast-responsive-background":Qt(n);break;case"ast-responsive-color":Ht(n);break;case"ast-responsive":Ft(n);break;case"ast-responsive-slider":Gt(n);break;case"ast-responsive-spacing":Yt(n);break;case"ast-font":var r=astra.customizer.settings.google_fonts;n.container.find(".ast-font-family").html(r),n.container.find(".ast-font-family").each((function(){var t=jQuery(this).data("value");jQuery(this).val(t);var e=jQuery(this).data("name");jQuery("select[data-name='"+e+"'] option[value='inherit']").text(jQuery(this).data("inherit"));var r=jQuery(".ast-font-weight[data-connected-control='"+e+"']"),a=AstTypography._getWeightObject(AstTypography._cleanGoogleFonts(t));n.generateDropdownHtml(a,r),r.val(r.data("value"))})),n.container.find(".ast-font-family").selectWoo(),n.container.find(".ast-font-family").on("select2:select",(function(){var t=jQuery(this).val(),e=AstTypography._getWeightObject(AstTypography._cleanGoogleFonts(t)),r=jQuery(this).data("name"),a=jQuery(".ast-font-weight[data-connected-control='"+r+"']");n.generateDropdownHtml(e,a);var o=jQuery(this).parents(".customize-control").attr("id");o=o.replace("customize-control-",""),n.container.trigger("ast_settings_changed",[n,jQuery(this),t,o]);var i=a.parents(".customize-control").attr("id");i=i.replace("customize-control-",""),n.container.trigger("ast_settings_changed",[n,a,a.val(),i])})),n.container.find(".ast-font-weight").on("change",(function(){var t=jQuery(this).val();name=jQuery(this).parents(".customize-control").attr("id"),name=name.replace("customize-control-",""),n.container.trigger("ast_settings_changed",[n,jQuery(this),t,name])}))}})),t.find(".ast-field-settings-modal").data("loaded",!0)},getJS:function(t){},generateFieldHtml:function(t,e){var r="",n=[];_.each(t,(function(t,e){var a=wp.customize.control("astra-settings["+t.name+"]")?wp.customize.control("astra-settings["+t.name+"]").params.value:"",o=t.control,i="customize-control-"+o+"-content",s=wp.template(i),c=a||t.default;t.value=c;var l="",u="";if(t.label=t.title,_.each(t.data_attrs,(function(t,e){l+=" data-"+e+" ='"+t+"'"})),_.each(t.input_attrs,(function(t,e){u+=e+'="'+t+'" '})),t.dataAttrs=l,t.inputAttrs=u,n.push({key:o,value:c,name:t.name}),"ast-responsive"==o){var p=void 0===t.responsive||t.responsive;t.responsive=p}var h=t.name.replace("[","-");h=h.replace("]",""),r+="<li id='customize-control-"+h+"' class='customize-control customize-control-"+t.control+"' >",r+=s(t),r+="</li>"}));var a=new Object;return a.controls=n,a.html=r,a},generateDropdownHtml:function(t,e){var r=e.data("inherit"),n="",a=0,o=(t=jQuery.merge(["inherit"],t),e.val()||"400"),i="";for(astraTypo.inherit=r;a<t.length;a++)0===a&&-1===jQuery.inArray(o,t)?(o=t[0],i=' selected="selected"'):i=t[a]==o?' selected="selected"':"",t[a].includes("italic")||(n+='<option value="'+t[a]+'"'+i+">"+astraTypo[t[a]]+"</option>");e.html(n)},onOptionChange:function(t,e,r,n,a){jQuery(".hidden-field-astra-settings-"+a).val(n),wp.customize.control("astra-settings["+a+"]").setting.set(n)},isJsonString:function(t){try{JSON.parse(t)}catch(t){return!1}return!0},getFinalControlObject:function(t,e){return void 0!==t.choices&&void 0===e.params.choices&&(e.params.choices=t.choices),void 0!==t.inputAttrs&&void 0===e.params.inputAttrs&&(e.params.inputAttrs=t.inputAttrs),void 0!==t.link&&void 0===e.params.link&&(e.params.link=t.link),void 0!==t.units&&void 0===e.params.units&&(e.params.units=t.units),void 0!==t.linked_choices&&void 0===e.params.linked_choices&&(e.params.linked_choices=t.linked_choices),void 0===t.title||void 0!==e.params.label&&""!==e.params.label&&null!==e.params.label||(e.params.label=t.title),void 0===t.responsive||void 0!==e.params.responsive&&""!==e.params.responsive&&null!==e.params.responsive||(e.params.responsive=t.responsive),e},renderReactControl:function(t,e){var r={"ast-background":St,"ast-responsive-background":At,"ast-responsive-color":Bt,"ast-color":Pt,"ast-border":et,"ast-responsive":it,"ast-responsive-slider":ut,"ast-slider":vt,"ast-responsive-spacing":mt,"ast-select":Ut};void 0!==t.tabs?_.each(t.tabs,(function(t,a){_.each(t,(function(t,a){if("ast-font"!==t.control){var o=t.name.replace("[","-"),i="#customize-control-"+(o=o.replace("]","")),s=wp.customize.control("astra-settings["+t.name+"]");s=e.getFinalControlObject(t,s);var c=r[t.control];ReactDOM.render(Object(n.createElement)(c,{control:s,customizer:wp.customize}),jQuery(i)[0])}}))})):_.each(t,(function(t,a){if("ast-font"!==t.control){var o=t.name.replace("[","-"),i="#customize-control-"+(o=o.replace("]","")),s=wp.customize.control("astra-settings["+t.name+"]");s=e.getFinalControlObject(t,s);var c=r[t.control];ReactDOM.render(Object(n.createElement)(c,{control:s,customizer:wp.customize}),jQuery(i)[0])}}))}}),Xt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Pt,{control:this,customizer:wp.customize}),this.container[0])}}),Wt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Bt,{control:this,customizer:wp.customize}),this.container[0])},ready:function(){Ht(this)}}),Zt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(At,{control:this}),this.container[0])},ready:function(){Qt(this)}}),Kt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(St,{control:this}),this.container[0])},ready:function(){jQuery("html").addClass("background-colorpicker-ready")}});function $t(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var te=function(t){l()(r,t);var e=$t(r);function r(){return o()(this,r),e.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var t,e,r=null,a=null,o=this.props.control.params,i=o.label,s=o.description,c=o.value,l=o.choices,u=o.inputAttrs;return i&&(r=Object(n.createElement)("span",{className:"customize-control-title"},i)),s&&(a=Object(n.createElement)("span",{className:"description customize-control-description"},s)),t=Object.values(c).map((function(t){if(l[t])var e=Object(n.createElement)("li",Z()({},u,{key:t,className:"ast-sortable-item","data-value":t}),Object(n.createElement)("i",{className:"dashicons dashicons-menu"}),Object(n.createElement)("i",{className:"dashicons dashicons-visibility visibility"}),l[t]);return e})),e=Object.keys(l).map((function(t){if(Array.isArray(c)&&-1===c.indexOf(t))var e=Object(n.createElement)("li",Z()({},u,{key:t,className:"ast-sortable-item invisible","data-value":t}),Object(n.createElement)("i",{className:"dashicons dashicons-menu"}),Object(n.createElement)("i",{className:"dashicons dashicons-visibility visibility"}),l[t]);return e})),Object(n.createElement)("label",{className:"ast-sortable"},r,a,Object(n.createElement)("ul",{className:"sortable"},t,e))}}]),r}(n.Component);te.propTypes={control:m.a.object.isRequired};var ee=te,re=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(ee,{control:this}),this.container[0])},ready:function(){var t=this;t.sortableContainer=t.container.find("ul.sortable").first(),t.sortableContainer.sortable({stop:function(){t.updateValue()}}).disableSelection().find("li").each((function(){jQuery(this).find("i.visibility").click((function(){jQuery(this).toggleClass("dashicons-visibility-faint").parents("li:eq(0)").toggleClass("invisible")}))})).click((function(){t.updateValue()}))},updateValue:function(){var t=this.params.choices,e=[];this.sortableContainer.find("li").each((function(){jQuery(this).is(".invisible")||e.push(jQuery(this).data("value"))})),jQuery.each(e,(function(r,n){t.hasOwnProperty(n)||e.splice(e.indexOf(n),1)})),this.setting.set(e)}}),ne=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(et,{control:this}),this.container[0])}});function ae(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var oe=function(t){l()(r,t);var e=ae(r);function r(t){var n;return o()(this,r),(n=e.call(this,t)).onLinkClick=n.onLinkClick.bind(z()(n)),n}return s()(r,[{key:"onLinkClick",value:function(){var t=event.target.parentElement.dataset.customizerLinked;switch(event.target.parentElement.dataset.astCustomizerLinkType){case"section":section=wp.customize.section(t),section.expand();break;case"control":wp.customize.control(t).focus()}}},{key:"render",value:function(){var t=this,e=this.props.control.params,r=e.linked,a=e.link_text,o=e.link_type,i=null;return r&&a&&(i=Object(n.createElement)("a",{href:"#",onClick:function(){t.onLinkClick()},className:"customizer-link","data-customizer-linked":r,"data-ast-customizer-link-type":o,dangerouslySetInnerHTML:{__html:a}})),Object(n.createElement)(n.Fragment,null,i)}}]),r}(n.Component);oe.propTypes={control:m.a.object.isRequired};var ie=oe,se=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(ie,{control:this}),this.container[0])}}),ce=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(it,{control:this}),this.container[0])},ready:function(){Ft(this)}}),le=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(ut,{control:this}),this.container[0])},ready:function(){Gt(this)}}),ue=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(vt,{control:this}),this.container[0])}}),pe=r(33),he=r.n(pe);function fe(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var de=function(t){l()(r,t);var e=fe(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.state={value:a},n.onLayoutChange=n.onLayoutChange.bind(z()(n)),n}return s()(r,[{key:"onLayoutChange",value:function(){this.props.control.params.choices.hasOwnProperty(event.target.value)||(event.target.value=this.props.control.params.default),this.setState({value:event.target.value}),this.props.control.setting.set(event.target.value)}},{key:"render",value:function(){var t,e=this,r=this.props.control.params,a=r.label,o=r.description,i=r.id,s=r.choices,c=r.inputAttrs,l=r.choices_titles,u=r.link,p=r.labelStyle,h=null,f=null,d=[];return a&&(h=Object(n.createElement)("span",{className:"customize-control-title"},a)),o&&(f=Object(n.createElement)("span",{className:"description customize-control-description"},o)),c&&void 0!==c&&c.split(" ").map((function(t,e){var r=t.split("=");void 0!==r[1]&&(d[r[0]]=r[1].replace(/"/g,""))})),u&&void 0!==u&&u.split(" ").map((function(t,e){var r=t.split("=");void 0!==r[1]&&(d[r[0]]=r[1].replace(/"/g,""))})),t=Object.entries(s).map((function(t){var r=he()(t,2),a=r[0],o=(r[1],e.state.value===a);return Object(n.createElement)(n.Fragment,{key:a},Object(n.createElement)("input",Z()({},d,{className:"image-select",type:"radio",value:a,name:"_customize-radio-".concat(i),id:i+a,checked:o,onChange:function(){return e.onLayoutChange(a)}})),Object(n.createElement)("label",Z()({htmlFor:i+a},p,{className:"ast-radio-img-svg"}),Object(n.createElement)("span",{dangerouslySetInnerHTML:{__html:s[a]}}),Object(n.createElement)("span",{className:"image-clickable",title:l[a]})))})),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",{className:"customizer-text"},h,f),Object(n.createElement)("div",{id:"input_".concat(i),className:"image"},t))}}]),r}(n.Component);de.propTypes={control:m.a.object.isRequired};var me=de,ge=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(me,{control:this}),this.container[0])}}),be=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(mt,{control:this}),this.container[0])},ready:function(){Yt(this)}}),ve=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Ut,{control:this}),this.container[0])}});function ye(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var _e=function(t){l()(r,t);var e=ye(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.state={value:a},n}return s()(r,[{key:"render",value:function(){var t=this.props.control.params,e=t.description,r=t.label,a=t.connect,o=t.variant,i=t.name,s=t.link,c=null,l=null,u=null,p=[],h=Object(P.__)("Inherit","astra");(r&&(c=Object(n.createElement)("span",{className:"customize-control-title"},r)),e&&(l=Object(n.createElement)("span",{className:"description customize-control-description"},e)),void 0!==s)&&s.split(" ").map((function(t,e){var r=t.split("=");void 0!==r[1]&&(p[r[0]]=r[1].replace(/"/g,""))}));return a&&(u=Object(n.createElement)("select",Z()({},p,{"data-connected-control":a,"data-value":this.state.value,"data-name":i,"data-inherit":h}))),o&&(u=Object(n.createElement)("select",Z()({},p,{"data-connected-variant":o,"data-value":this.state.value,"data-name":i,"data-inherit":h}))),a&&o&&(u=Object(n.createElement)("select",Z()({},p,{"data-connected-control":a,"data-connected-variant":o,"data-value":this.state.value,"data-name":i,"data-inherit":h}))),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,c,l),u)}}]),r}(n.Component);_e.propTypes={control:m.a.object.isRequired};var we=_e,Oe=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(we,{control:this}),this.container[0])},ready:function(){AstTypography.init()}});function ke(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var Ee=function(t){l()(r,t);var e=ke(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return void 0!==a&&""!==a||(a=[]),n.state={value:a},n}return s()(r,[{key:"render",value:function(){var t=this.props.control.params,e=t.description,r=t.label,a=t.connect,o=t.variant,i=t.name,s=t.link,c=t.ast_all_font_weight,l=null,u=null,p=null,h=[],f=Object(P.__)("Inherit","astra"),d=null;(r&&(l=Object(n.createElement)("span",{className:"customize-control-title"},r)),e&&(u=Object(n.createElement)("span",{className:"description customize-control-description"},e)),void 0!==s)&&s.split(" ").map((function(t,e){var r=t.split("=");void 0!==r[1]&&(h[r[0]]=r[1].replace(/"/g,""))}));var m=Object.entries(c).map((function(t){return Object(n.createElement)("option",{key:t[0],value:t[0]},t[1])}));return d="normal"===this.state.value?Object(n.createElement)("option",{key:"normal",value:"normal"},f):Object(n.createElement)("option",{key:"inherit",value:"inherit"},f),a&&(p=Object(n.createElement)("select",Z()({},h,{"data-connected-control":a,"data-value":this.state.value,"data-name":i,"data-inherit":f}),d,m)),o&&(p=Object(n.createElement)("select",Z()({},h,{"data-connected-variant":o,"data-value":this.state.value,"data-name":i,"data-inherit":f}),d,m)),a&&o&&(p=Object(n.createElement)("select",Z()({},h,{"data-connected-control":a,"data-connected-variant":o,"data-value":this.state.value,"data-name":i,"data-inherit":f}),d,m)),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,l,u),p)}},{key:"updateValues",value:function(t){this.setState({value:t}),this.props.control.setting.set(t)}}]),r}(n.Component);Ee.propTypes={control:m.a.object.isRequired};var je=Ee,Ce=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(je,{control:this}),this.container[0])},ready:function(){AstTypography.init()}});function Se(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function xe(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f()(t);if(e){var a=f()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return p()(this,r)}}var Ne=function(t){l()(r,t);var e=xe(r);function r(t){var n;o()(this,r);var a=(n=e.call(this,t)).props.control.setting.get();return n.state={value:a},n.onSelectChange=n.onSelectChange.bind(z()(n)),n.renderSelectHtml=n.renderSelectHtml.bind(z()(n)),n}return s()(r,[{key:"onSelectChange",value:function(t){var e=function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?Se(Object(r),!0).forEach((function(e){A()(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):Se(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},this.state.value);e[t]=event.target.value,this.updateValues(e)}},{key:"renderSelectHtml",value:function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=this.props.control.params.choices,o=Object.entries(a).map((function(t){return Object(n.createElement)("option",{key:t[0],value:t[0]},t[1])}));return Object(n.createElement)("div",{className:"ast-responsive-select-container ".concat(t," ").concat(r)},Object(n.createElement)("select",{className:"ast-select-input","data-value":this.state.value[t],value:this.state.value[t],onChange:function(){e.onSelectChange(t)}},o))}},{key:"render",value:function(){var t=this.props.control.params.label,e=null;t&&(e=Object(n.createElement)("span",{className:"customize-control-title"},t));var r=Object(n.createElement)("ul",{key:"ast-resp-ul",className:"ast-responsive-btns"},Object(n.createElement)("li",{key:"desktop",className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{key:"tablet",className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{key:"mobile",className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"})))),a=Object(n.createElement)(n.Fragment,null,this.renderSelectHtml("desktop","active"),this.renderSelectHtml("tablet"),this.renderSelectHtml("mobile"));return Object(n.createElement)(n.Fragment,null,e,r,Object(n.createElement)("div",{className:"customize-control-content"},Object(n.createElement)("div",{className:"ast-responsive-select-wrapper"},a)))}},{key:"updateValues",value:function(t){this.setState({value:t}),this.props.control.setting.set(t)}}]),r}(n.Component);Ne.propTypes={control:m.a.object.isRequired};var Re=Ne,Te=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Re,{control:this}),this.container[0])},ready:function(){var t=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive-select .customize-control-content .ast-responsive-select-container").removeClass("active"),jQuery(".customize-control-ast-responsive-select .customize-control-content .ast-responsive-select-container."+t).addClass("active"),jQuery(".customize-control-ast-responsive-select .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-select .ast-responsive-btns li."+t).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var t=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive-select .customize-control-content .ast-responsive-select-container").removeClass("active"),jQuery(".customize-control-ast-responsive-select .customize-control-content .ast-responsive-select-container."+t).addClass("active"),jQuery(".customize-control-ast-responsive-select .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-select .ast-responsive-btns li."+t).addClass("active")})),this.container.find(".ast-responsive-btns button").on("click",(function(t){var e=jQuery(this).attr("data-device");e="desktop"==e?"tablet":"tablet"==e?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+e+'"]').trigger("click")}))}});wp.customize.controlConstructor["ast-heading"]=y,wp.customize.controlConstructor["ast-hidden"]=E,wp.customize.controlConstructor["ast-description"]=R,wp.customize.controlConstructor["ast-link"]=U,wp.customize.controlConstructor["ast-divider"]=G,wp.customize.controlConstructor["ast-settings-group"]=Jt,wp.customize.controlConstructor["ast-color"]=Xt,wp.customize.controlConstructor["ast-responsive-color"]=Wt,wp.customize.controlConstructor["ast-responsive-background"]=Zt,wp.customize.controlConstructor["ast-background"]=Kt,wp.customize.controlConstructor["ast-sortable"]=re,wp.customize.controlConstructor["ast-border"]=ne,wp.customize.controlConstructor["ast-customizer-link"]=se,wp.customize.controlConstructor["ast-responsive"]=ce,wp.customize.controlConstructor["ast-responsive-slider"]=le,wp.customize.controlConstructor["ast-slider"]=ue,wp.customize.controlConstructor["ast-radio-image"]=ge,wp.customize.controlConstructor["ast-responsive-spacing"]=be,wp.customize.controlConstructor["ast-select"]=ve,wp.customize.controlConstructor["ast-font-family"]=Oe,wp.customize.controlConstructor["ast-font-weight"]=Ce,wp.customize.controlConstructor["ast-responsive-select"]=Te}]);