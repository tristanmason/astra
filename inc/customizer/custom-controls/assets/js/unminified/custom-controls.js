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

!function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=102)}([function(e,t){!function(){e.exports=this.wp.element}()},function(e,t){function r(t){return e.exports=r=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},r(t)}e.exports=r},function(e,t){e.exports=function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}},function(e,t,r){e.exports=r(47)()},function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t){function r(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}e.exports=function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}},function(e,t,r){var n=r(45);e.exports=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&n(e,t)}},function(e,t,r){var n=r(46),a=r(2);e.exports=function(e,t){return!t||"object"!==n(t)&&"function"!=typeof t?a(e):t}},function(e,t){!function(){e.exports=this.wp.i18n}()},function(e,t){!function(){e.exports=this.wp.components}()},function(e,t){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}},function(e,t){function r(){return e.exports=r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},r.apply(this,arguments)}e.exports=r},function(e,t){!function(){e.exports=this.React}()},function(e,t,r){var n;
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/!function(){"use strict";var r={}.hasOwnProperty;function a(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var o=typeof n;if("string"===o||"number"===o)e.push(n);else if(Array.isArray(n)&&n.length){var i=a.apply(null,n);i&&e.push(i)}else if("object"===o)for(var s in n)r.call(n,s)&&n[s]&&e.push(s)}}return e.join(" ")}e.exports?(a.default=a,e.exports=a):void 0===(n=function(){return a}.apply(t,[]))||(e.exports=n)}()},function(e,t,r){var n=r(23),a=r(27);function o(t,r){return delete e.exports[t],e.exports[t]=r,r}e.exports={Parser:n,Tokenizer:r(24),ElementType:r(15),DomHandler:a,get FeedHandler(){return o("FeedHandler",r(54))},get Stream(){return o("Stream",r(65))},get WritableStream(){return o("WritableStream",r(30))},get ProxyHandler(){return o("ProxyHandler",r(72))},get DomUtils(){return o("DomUtils",r(29))},get CollectingHandler(){return o("CollectingHandler",r(73))},DefaultHandler:a,get RssHandler(){return o("RssHandler",this.FeedHandler)},parseDOM:function(e,t){var r=new a(t);return new n(r,t).end(e),r.dom},parseFeed:function(t,r){var a=new e.exports.FeedHandler(r);return new n(a,r).end(t),a.dom},createDomStream:function(e,t,r){var o=new a(e,t,r);return new n(o,t)},EVENTS:{attribute:2,cdatastart:0,cdataend:0,text:1,processinginstruction:2,comment:1,commentend:0,closetag:1,opentag:2,opentagname:1,error:1,end:0}}},function(e,t){e.exports={Text:"text",Directive:"directive",Comment:"comment",Script:"script",Style:"style",Tag:"tag",CDATA:"cdata",Doctype:"doctype",isTag:function(e){return"tag"===e.type||"script"===e.type||"style"===e.type}}},function(e,t){"function"==typeof Object.create?e.exports=function(e,t){t&&(e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}))}:e.exports=function(e,t){if(t){e.super_=t;var r=function(){};r.prototype=t.prototype,e.prototype=new r,e.prototype.constructor=e}}},function(e,t,r){var n=r(87),a=r(88),o=r(36),i=r(89);e.exports=function(e,t){return n(e)||a(e,t)||o(e,t)||i()}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){return e.filter((function(e){return!(0,n.default)(e)})).map((function(e,r){var n=void 0;return"function"!=typeof t||null!==(n=t(e,r))&&!n?(0,a.default)(e,r,t):n}))};var n=o(r(49)),a=o(r(22));function o(e){return e&&e.__esModule?e:{default:e}}},function(e){e.exports=JSON.parse('{"Aacute":"Á","aacute":"á","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"Â","acirc":"â","acute":"´","Acy":"А","acy":"а","AElig":"Æ","aelig":"æ","af":"⁡","Afr":"𝔄","afr":"𝔞","Agrave":"À","agrave":"à","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"𝔸","aopf":"𝕒","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"\'","ApplyFunction":"⁡","approx":"≈","approxeq":"≊","Aring":"Å","aring":"å","Ascr":"𝒜","ascr":"𝒶","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"𝔅","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"𝔹","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"¦","bscr":"𝒷","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"Ç","ccedil":"ç","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"¸","Cedilla":"¸","cemptyv":"⦲","cent":"¢","centerdot":"·","CenterDot":"·","cfr":"𝔠","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"®","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"𝕔","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"©","COPY":"©","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"𝒞","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"°","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"𝔇","dfr":"𝔡","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"𝔻","dopf":"𝕕","Dot":"¨","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"𝒟","dscr":"𝒹","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"É","eacute":"é","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"Ê","ecirc":"ê","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"𝔈","efr":"𝔢","eg":"⪚","Egrave":"È","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"𝔼","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"𝔉","ffr":"𝔣","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"𝔽","fopf":"𝕗","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"𝔊","gfr":"𝔤","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"𝔾","gopf":"𝕘","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"½","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"𝒽","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"Í","iacute":"í","ic":"⁣","Icirc":"Î","icirc":"î","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"¡","iff":"⇔","ifr":"𝔦","Ifr":"ℑ","Igrave":"Ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"⁣","InvisibleTimes":"⁢","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"𝕀","iopf":"𝕚","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"¿","iscr":"𝒾","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"Ï","iuml":"ï","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"𝔍","jfr":"𝔧","jmath":"ȷ","Jopf":"𝕁","jopf":"𝕛","Jscr":"𝒥","jscr":"𝒿","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"𝔎","kfr":"𝔨","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"𝕂","kopf":"𝕜","Kscr":"𝒦","kscr":"𝓀","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"«","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"𝔏","lfr":"𝔩","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"𝕃","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"¯","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","mfr":"𝔪","mho":"℧","micro":"µ","midast":"*","midcir":"⫰","mid":"∣","middot":"·","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"𝕄","mopf":"𝕞","mp":"∓","mscr":"𝓂","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","nexist":"∄","nexists":"∄","Nfr":"𝔑","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"⁠","NonBreakingSpace":" ","nopf":"𝕟","Nopf":"ℕ","Not":"⫬","not":"¬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"𝒩","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"Ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"Ó","oacute":"ó","oast":"⊛","Ocirc":"Ô","ocirc":"ô","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"𝔒","ofr":"𝔬","ogon":"˛","Ograve":"Ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"𝕆","oopf":"𝕠","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"𝒪","oscr":"ℴ","Oslash":"Ø","oslash":"ø","osol":"⊘","Otilde":"Õ","otilde":"õ","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"Ö","ouml":"ö","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"¶","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"𝔓","pfr":"𝔭","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","Poincareplane":"ℌ","pointint":"⨕","popf":"𝕡","Popf":"ℙ","pound":"£","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"𝒫","pscr":"𝓅","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"𝔔","qfr":"𝔮","qint":"⨌","qopf":"𝕢","Qopf":"ℚ","qprime":"⁗","Qscr":"𝒬","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\\"","QUOT":"\\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"»","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"®","REG":"®","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"𝓇","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"𝔖","sfr":"𝔰","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"­","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"𝕊","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"𝒮","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"¹","sup2":"²","sup3":"³","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"ß","Tab":"\\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"𝔗","tfr":"𝔱","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"Þ","thorn":"þ","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"×","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"𝕋","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"𝒯","tscr":"𝓉","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"Ú","uacute":"ú","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"Û","ucirc":"û","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"𝔘","ufr":"𝔲","Ugrave":"Ù","ugrave":"ù","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"¨","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"𝕌","uopf":"𝕦","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"𝒰","uscr":"𝓊","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"Ü","uuml":"ü","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"𝕍","vopf":"𝕧","vprop":"∝","vrtri":"⊳","Vscr":"𝒱","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"𝔚","wfr":"𝔴","Wopf":"𝕎","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","Wscr":"𝒲","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"𝔛","xfr":"𝔵","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"𝕏","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"𝒳","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"Ý","yacute":"ý","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"¥","Yfr":"𝔜","yfr":"𝔶","YIcy":"Ї","yicy":"ї","Yopf":"𝕐","yopf":"𝕪","Yscr":"𝒴","yscr":"𝓎","YUcy":"Ю","yucy":"ю","yuml":"ÿ","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"​","Zeta":"Ζ","zeta":"ζ","zfr":"𝔷","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","Zopf":"ℤ","Zscr":"𝒵","zscr":"𝓏","zwj":"‍","zwnj":"‌"}')},function(e){e.exports=JSON.parse('{"amp":"&","apos":"\'","gt":">","lt":"<","quot":"\\""}')},function(e,t,r){var n=r(37).Symbol;e.exports=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,r){return o.default[e.type](e,t,r)};var n,a=r(50),o=(n=a)&&n.__esModule?n:{default:n}},function(e,t,r){var n=r(24),a={input:!0,option:!0,optgroup:!0,select:!0,button:!0,datalist:!0,textarea:!0},o={tr:{tr:!0,th:!0,td:!0},th:{th:!0},td:{thead:!0,th:!0,td:!0},body:{head:!0,link:!0,script:!0},li:{li:!0},p:{p:!0},h1:{p:!0},h2:{p:!0},h3:{p:!0},h4:{p:!0},h5:{p:!0},h6:{p:!0},select:a,input:a,output:a,button:a,datalist:a,textarea:a,option:{option:!0},optgroup:{optgroup:!0}},i={__proto__:null,area:!0,base:!0,basefont:!0,br:!0,col:!0,command:!0,embed:!0,frame:!0,hr:!0,img:!0,input:!0,isindex:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},s={__proto__:null,math:!0,svg:!0},c={__proto__:null,mi:!0,mo:!0,mn:!0,ms:!0,mtext:!0,"annotation-xml":!0,foreignObject:!0,desc:!0,title:!0},l=/\s|\//;function u(e,t){this._options=t||{},this._cbs=e||{},this._tagname="",this._attribname="",this._attribvalue="",this._attribs=null,this._stack=[],this._foreignContext=[],this.startIndex=0,this.endIndex=null,this._lowerCaseTagNames="lowerCaseTags"in this._options?!!this._options.lowerCaseTags:!this._options.xmlMode,this._lowerCaseAttributeNames="lowerCaseAttributeNames"in this._options?!!this._options.lowerCaseAttributeNames:!this._options.xmlMode,this._options.Tokenizer&&(n=this._options.Tokenizer),this._tokenizer=new n(this._options,this),this._cbs.onparserinit&&this._cbs.onparserinit(this)}r(16)(u,r(52).EventEmitter),u.prototype._updatePosition=function(e){null===this.endIndex?this._tokenizer._sectionStart<=e?this.startIndex=0:this.startIndex=this._tokenizer._sectionStart-e:this.startIndex=this.endIndex+1,this.endIndex=this._tokenizer.getAbsoluteIndex()},u.prototype.ontext=function(e){this._updatePosition(1),this.endIndex--,this._cbs.ontext&&this._cbs.ontext(e)},u.prototype.onopentagname=function(e){if(this._lowerCaseTagNames&&(e=e.toLowerCase()),this._tagname=e,!this._options.xmlMode&&e in o)for(var t;(t=this._stack[this._stack.length-1])in o[e];this.onclosetag(t));!this._options.xmlMode&&e in i||(this._stack.push(e),e in s?this._foreignContext.push(!0):e in c&&this._foreignContext.push(!1)),this._cbs.onopentagname&&this._cbs.onopentagname(e),this._cbs.onopentag&&(this._attribs={})},u.prototype.onopentagend=function(){this._updatePosition(1),this._attribs&&(this._cbs.onopentag&&this._cbs.onopentag(this._tagname,this._attribs),this._attribs=null),!this._options.xmlMode&&this._cbs.onclosetag&&this._tagname in i&&this._cbs.onclosetag(this._tagname),this._tagname=""},u.prototype.onclosetag=function(e){if(this._updatePosition(1),this._lowerCaseTagNames&&(e=e.toLowerCase()),(e in s||e in c)&&this._foreignContext.pop(),!this._stack.length||e in i&&!this._options.xmlMode)this._options.xmlMode||"br"!==e&&"p"!==e||(this.onopentagname(e),this._closeCurrentTag());else{var t=this._stack.lastIndexOf(e);if(-1!==t)if(this._cbs.onclosetag)for(t=this._stack.length-t;t--;)this._cbs.onclosetag(this._stack.pop());else this._stack.length=t;else"p"!==e||this._options.xmlMode||(this.onopentagname(e),this._closeCurrentTag())}},u.prototype.onselfclosingtag=function(){this._options.xmlMode||this._options.recognizeSelfClosing||this._foreignContext[this._foreignContext.length-1]?this._closeCurrentTag():this.onopentagend()},u.prototype._closeCurrentTag=function(){var e=this._tagname;this.onopentagend(),this._stack[this._stack.length-1]===e&&(this._cbs.onclosetag&&this._cbs.onclosetag(e),this._stack.pop())},u.prototype.onattribname=function(e){this._lowerCaseAttributeNames&&(e=e.toLowerCase()),this._attribname=e},u.prototype.onattribdata=function(e){this._attribvalue+=e},u.prototype.onattribend=function(){this._cbs.onattribute&&this._cbs.onattribute(this._attribname,this._attribvalue),this._attribs&&!Object.prototype.hasOwnProperty.call(this._attribs,this._attribname)&&(this._attribs[this._attribname]=this._attribvalue),this._attribname="",this._attribvalue=""},u.prototype._getInstructionName=function(e){var t=e.search(l),r=t<0?e:e.substr(0,t);return this._lowerCaseTagNames&&(r=r.toLowerCase()),r},u.prototype.ondeclaration=function(e){if(this._cbs.onprocessinginstruction){var t=this._getInstructionName(e);this._cbs.onprocessinginstruction("!"+t,"!"+e)}},u.prototype.onprocessinginstruction=function(e){if(this._cbs.onprocessinginstruction){var t=this._getInstructionName(e);this._cbs.onprocessinginstruction("?"+t,"?"+e)}},u.prototype.oncomment=function(e){this._updatePosition(4),this._cbs.oncomment&&this._cbs.oncomment(e),this._cbs.oncommentend&&this._cbs.oncommentend()},u.prototype.oncdata=function(e){this._updatePosition(1),this._options.xmlMode||this._options.recognizeCDATA?(this._cbs.oncdatastart&&this._cbs.oncdatastart(),this._cbs.ontext&&this._cbs.ontext(e),this._cbs.oncdataend&&this._cbs.oncdataend()):this.oncomment("[CDATA["+e+"]]")},u.prototype.onerror=function(e){this._cbs.onerror&&this._cbs.onerror(e)},u.prototype.onend=function(){if(this._cbs.onclosetag)for(var e=this._stack.length;e>0;this._cbs.onclosetag(this._stack[--e]));this._cbs.onend&&this._cbs.onend()},u.prototype.reset=function(){this._cbs.onreset&&this._cbs.onreset(),this._tokenizer.reset(),this._tagname="",this._attribname="",this._attribs=null,this._stack=[],this._cbs.onparserinit&&this._cbs.onparserinit(this)},u.prototype.parseComplete=function(e){this.reset(),this.end(e)},u.prototype.write=function(e){this._tokenizer.write(e)},u.prototype.end=function(e){this._tokenizer.end(e)},u.prototype.pause=function(){this._tokenizer.pause()},u.prototype.resume=function(){this._tokenizer.resume()},u.prototype.parseChunk=u.prototype.write,u.prototype.done=u.prototype.end,e.exports=u},function(e,t,r){e.exports=ve;var n=r(25),a=r(19),o=r(26),i=r(20),s=0,c=s++,l=s++,u=s++,h=s++,p=s++,d=s++,f=s++,m=s++,v=s++,b=s++,g=s++,y=s++,w=s++,O=s++,E=s++,j=s++,_=s++,C=s++,k=s++,x=s++,z=s++,S=s++,M=s++,N=s++,R=s++,D=s++,P=s++,H=s++,A=s++,T=s++,V=s++,L=s++,B=s++,I=s++,q=s++,U=s++,F=s++,Q=s++,Y=s++,G=s++,W=s++,X=s++,J=s++,Z=s++,K=s++,$=s++,ee=s++,te=s++,re=s++,ne=s++,ae=s++,oe=s++,ie=s++,se=s++,ce=s++,le=0,ue=le++,he=le++,pe=le++;function de(e){return" "===e||"\n"===e||"\t"===e||"\f"===e||"\r"===e}function fe(e,t,r){var n=e.toLowerCase();return e===n?function(e){e===n?this._state=t:(this._state=r,this._index--)}:function(a){a===n||a===e?this._state=t:(this._state=r,this._index--)}}function me(e,t){var r=e.toLowerCase();return function(n){n===r||n===e?this._state=t:(this._state=u,this._index--)}}function ve(e,t){this._state=c,this._buffer="",this._sectionStart=0,this._index=0,this._bufferOffset=0,this._baseState=c,this._special=ue,this._cbs=t,this._running=!0,this._ended=!1,this._xmlMode=!(!e||!e.xmlMode),this._decodeEntities=!(!e||!e.decodeEntities)}ve.prototype._stateText=function(e){"<"===e?(this._index>this._sectionStart&&this._cbs.ontext(this._getSection()),this._state=l,this._sectionStart=this._index):this._decodeEntities&&this._special===ue&&"&"===e&&(this._index>this._sectionStart&&this._cbs.ontext(this._getSection()),this._baseState=c,this._state=ae,this._sectionStart=this._index)},ve.prototype._stateBeforeTagName=function(e){"/"===e?this._state=p:"<"===e?(this._cbs.ontext(this._getSection()),this._sectionStart=this._index):">"===e||this._special!==ue||de(e)?this._state=c:"!"===e?(this._state=E,this._sectionStart=this._index+1):"?"===e?(this._state=_,this._sectionStart=this._index+1):(this._state=this._xmlMode||"s"!==e&&"S"!==e?u:V,this._sectionStart=this._index)},ve.prototype._stateInTagName=function(e){("/"===e||">"===e||de(e))&&(this._emitToken("onopentagname"),this._state=m,this._index--)},ve.prototype._stateBeforeCloseingTagName=function(e){de(e)||(">"===e?this._state=c:this._special!==ue?"s"===e||"S"===e?this._state=L:(this._state=c,this._index--):(this._state=d,this._sectionStart=this._index))},ve.prototype._stateInCloseingTagName=function(e){(">"===e||de(e))&&(this._emitToken("onclosetag"),this._state=f,this._index--)},ve.prototype._stateAfterCloseingTagName=function(e){">"===e&&(this._state=c,this._sectionStart=this._index+1)},ve.prototype._stateBeforeAttributeName=function(e){">"===e?(this._cbs.onopentagend(),this._state=c,this._sectionStart=this._index+1):"/"===e?this._state=h:de(e)||(this._state=v,this._sectionStart=this._index)},ve.prototype._stateInSelfClosingTag=function(e){">"===e?(this._cbs.onselfclosingtag(),this._state=c,this._sectionStart=this._index+1):de(e)||(this._state=m,this._index--)},ve.prototype._stateInAttributeName=function(e){("="===e||"/"===e||">"===e||de(e))&&(this._cbs.onattribname(this._getSection()),this._sectionStart=-1,this._state=b,this._index--)},ve.prototype._stateAfterAttributeName=function(e){"="===e?this._state=g:"/"===e||">"===e?(this._cbs.onattribend(),this._state=m,this._index--):de(e)||(this._cbs.onattribend(),this._state=v,this._sectionStart=this._index)},ve.prototype._stateBeforeAttributeValue=function(e){'"'===e?(this._state=y,this._sectionStart=this._index+1):"'"===e?(this._state=w,this._sectionStart=this._index+1):de(e)||(this._state=O,this._sectionStart=this._index,this._index--)},ve.prototype._stateInAttributeValueDoubleQuotes=function(e){'"'===e?(this._emitToken("onattribdata"),this._cbs.onattribend(),this._state=m):this._decodeEntities&&"&"===e&&(this._emitToken("onattribdata"),this._baseState=this._state,this._state=ae,this._sectionStart=this._index)},ve.prototype._stateInAttributeValueSingleQuotes=function(e){"'"===e?(this._emitToken("onattribdata"),this._cbs.onattribend(),this._state=m):this._decodeEntities&&"&"===e&&(this._emitToken("onattribdata"),this._baseState=this._state,this._state=ae,this._sectionStart=this._index)},ve.prototype._stateInAttributeValueNoQuotes=function(e){de(e)||">"===e?(this._emitToken("onattribdata"),this._cbs.onattribend(),this._state=m,this._index--):this._decodeEntities&&"&"===e&&(this._emitToken("onattribdata"),this._baseState=this._state,this._state=ae,this._sectionStart=this._index)},ve.prototype._stateBeforeDeclaration=function(e){this._state="["===e?S:"-"===e?C:j},ve.prototype._stateInDeclaration=function(e){">"===e&&(this._cbs.ondeclaration(this._getSection()),this._state=c,this._sectionStart=this._index+1)},ve.prototype._stateInProcessingInstruction=function(e){">"===e&&(this._cbs.onprocessinginstruction(this._getSection()),this._state=c,this._sectionStart=this._index+1)},ve.prototype._stateBeforeComment=function(e){"-"===e?(this._state=k,this._sectionStart=this._index+1):this._state=j},ve.prototype._stateInComment=function(e){"-"===e&&(this._state=x)},ve.prototype._stateAfterComment1=function(e){this._state="-"===e?z:k},ve.prototype._stateAfterComment2=function(e){">"===e?(this._cbs.oncomment(this._buffer.substring(this._sectionStart,this._index-2)),this._state=c,this._sectionStart=this._index+1):"-"!==e&&(this._state=k)},ve.prototype._stateBeforeCdata1=fe("C",M,j),ve.prototype._stateBeforeCdata2=fe("D",N,j),ve.prototype._stateBeforeCdata3=fe("A",R,j),ve.prototype._stateBeforeCdata4=fe("T",D,j),ve.prototype._stateBeforeCdata5=fe("A",P,j),ve.prototype._stateBeforeCdata6=function(e){"["===e?(this._state=H,this._sectionStart=this._index+1):(this._state=j,this._index--)},ve.prototype._stateInCdata=function(e){"]"===e&&(this._state=A)},ve.prototype._stateAfterCdata1=function(e){this._state="]"===e?T:H},ve.prototype._stateAfterCdata2=function(e){">"===e?(this._cbs.oncdata(this._buffer.substring(this._sectionStart,this._index-2)),this._state=c,this._sectionStart=this._index+1):"]"!==e&&(this._state=H)},ve.prototype._stateBeforeSpecial=function(e){"c"===e||"C"===e?this._state=B:"t"===e||"T"===e?this._state=J:(this._state=u,this._index--)},ve.prototype._stateBeforeSpecialEnd=function(e){this._special!==he||"c"!==e&&"C"!==e?this._special!==pe||"t"!==e&&"T"!==e?this._state=c:this._state=ee:this._state=Q},ve.prototype._stateBeforeScript1=me("R",I),ve.prototype._stateBeforeScript2=me("I",q),ve.prototype._stateBeforeScript3=me("P",U),ve.prototype._stateBeforeScript4=me("T",F),ve.prototype._stateBeforeScript5=function(e){("/"===e||">"===e||de(e))&&(this._special=he),this._state=u,this._index--},ve.prototype._stateAfterScript1=fe("R",Y,c),ve.prototype._stateAfterScript2=fe("I",G,c),ve.prototype._stateAfterScript3=fe("P",W,c),ve.prototype._stateAfterScript4=fe("T",X,c),ve.prototype._stateAfterScript5=function(e){">"===e||de(e)?(this._special=ue,this._state=d,this._sectionStart=this._index-6,this._index--):this._state=c},ve.prototype._stateBeforeStyle1=me("Y",Z),ve.prototype._stateBeforeStyle2=me("L",K),ve.prototype._stateBeforeStyle3=me("E",$),ve.prototype._stateBeforeStyle4=function(e){("/"===e||">"===e||de(e))&&(this._special=pe),this._state=u,this._index--},ve.prototype._stateAfterStyle1=fe("Y",te,c),ve.prototype._stateAfterStyle2=fe("L",re,c),ve.prototype._stateAfterStyle3=fe("E",ne,c),ve.prototype._stateAfterStyle4=function(e){">"===e||de(e)?(this._special=ue,this._state=d,this._sectionStart=this._index-5,this._index--):this._state=c},ve.prototype._stateBeforeEntity=fe("#",oe,ie),ve.prototype._stateBeforeNumericEntity=fe("X",ce,se),ve.prototype._parseNamedEntityStrict=function(){if(this._sectionStart+1<this._index){var e=this._buffer.substring(this._sectionStart+1,this._index),t=this._xmlMode?i:a;t.hasOwnProperty(e)&&(this._emitPartial(t[e]),this._sectionStart=this._index+1)}},ve.prototype._parseLegacyEntity=function(){var e=this._sectionStart+1,t=this._index-e;for(t>6&&(t=6);t>=2;){var r=this._buffer.substr(e,t);if(o.hasOwnProperty(r))return this._emitPartial(o[r]),void(this._sectionStart+=t+1);t--}},ve.prototype._stateInNamedEntity=function(e){";"===e?(this._parseNamedEntityStrict(),this._sectionStart+1<this._index&&!this._xmlMode&&this._parseLegacyEntity(),this._state=this._baseState):(e<"a"||e>"z")&&(e<"A"||e>"Z")&&(e<"0"||e>"9")&&(this._xmlMode||this._sectionStart+1===this._index||(this._baseState!==c?"="!==e&&this._parseNamedEntityStrict():this._parseLegacyEntity()),this._state=this._baseState,this._index--)},ve.prototype._decodeNumericEntity=function(e,t){var r=this._sectionStart+e;if(r!==this._index){var a=this._buffer.substring(r,this._index),o=parseInt(a,t);this._emitPartial(n(o)),this._sectionStart=this._index}else this._sectionStart--;this._state=this._baseState},ve.prototype._stateInNumericEntity=function(e){";"===e?(this._decodeNumericEntity(2,10),this._sectionStart++):(e<"0"||e>"9")&&(this._xmlMode?this._state=this._baseState:this._decodeNumericEntity(2,10),this._index--)},ve.prototype._stateInHexEntity=function(e){";"===e?(this._decodeNumericEntity(3,16),this._sectionStart++):(e<"a"||e>"f")&&(e<"A"||e>"F")&&(e<"0"||e>"9")&&(this._xmlMode?this._state=this._baseState:this._decodeNumericEntity(3,16),this._index--)},ve.prototype._cleanup=function(){this._sectionStart<0?(this._buffer="",this._bufferOffset+=this._index,this._index=0):this._running&&(this._state===c?(this._sectionStart!==this._index&&this._cbs.ontext(this._buffer.substr(this._sectionStart)),this._buffer="",this._bufferOffset+=this._index,this._index=0):this._sectionStart===this._index?(this._buffer="",this._bufferOffset+=this._index,this._index=0):(this._buffer=this._buffer.substr(this._sectionStart),this._index-=this._sectionStart,this._bufferOffset+=this._sectionStart),this._sectionStart=0)},ve.prototype.write=function(e){this._ended&&this._cbs.onerror(Error(".write() after done!")),this._buffer+=e,this._parse()},ve.prototype._parse=function(){for(;this._index<this._buffer.length&&this._running;){var e=this._buffer.charAt(this._index);this._state===c?this._stateText(e):this._state===l?this._stateBeforeTagName(e):this._state===u?this._stateInTagName(e):this._state===p?this._stateBeforeCloseingTagName(e):this._state===d?this._stateInCloseingTagName(e):this._state===f?this._stateAfterCloseingTagName(e):this._state===h?this._stateInSelfClosingTag(e):this._state===m?this._stateBeforeAttributeName(e):this._state===v?this._stateInAttributeName(e):this._state===b?this._stateAfterAttributeName(e):this._state===g?this._stateBeforeAttributeValue(e):this._state===y?this._stateInAttributeValueDoubleQuotes(e):this._state===w?this._stateInAttributeValueSingleQuotes(e):this._state===O?this._stateInAttributeValueNoQuotes(e):this._state===E?this._stateBeforeDeclaration(e):this._state===j?this._stateInDeclaration(e):this._state===_?this._stateInProcessingInstruction(e):this._state===C?this._stateBeforeComment(e):this._state===k?this._stateInComment(e):this._state===x?this._stateAfterComment1(e):this._state===z?this._stateAfterComment2(e):this._state===S?this._stateBeforeCdata1(e):this._state===M?this._stateBeforeCdata2(e):this._state===N?this._stateBeforeCdata3(e):this._state===R?this._stateBeforeCdata4(e):this._state===D?this._stateBeforeCdata5(e):this._state===P?this._stateBeforeCdata6(e):this._state===H?this._stateInCdata(e):this._state===A?this._stateAfterCdata1(e):this._state===T?this._stateAfterCdata2(e):this._state===V?this._stateBeforeSpecial(e):this._state===L?this._stateBeforeSpecialEnd(e):this._state===B?this._stateBeforeScript1(e):this._state===I?this._stateBeforeScript2(e):this._state===q?this._stateBeforeScript3(e):this._state===U?this._stateBeforeScript4(e):this._state===F?this._stateBeforeScript5(e):this._state===Q?this._stateAfterScript1(e):this._state===Y?this._stateAfterScript2(e):this._state===G?this._stateAfterScript3(e):this._state===W?this._stateAfterScript4(e):this._state===X?this._stateAfterScript5(e):this._state===J?this._stateBeforeStyle1(e):this._state===Z?this._stateBeforeStyle2(e):this._state===K?this._stateBeforeStyle3(e):this._state===$?this._stateBeforeStyle4(e):this._state===ee?this._stateAfterStyle1(e):this._state===te?this._stateAfterStyle2(e):this._state===re?this._stateAfterStyle3(e):this._state===ne?this._stateAfterStyle4(e):this._state===ae?this._stateBeforeEntity(e):this._state===oe?this._stateBeforeNumericEntity(e):this._state===ie?this._stateInNamedEntity(e):this._state===se?this._stateInNumericEntity(e):this._state===ce?this._stateInHexEntity(e):this._cbs.onerror(Error("unknown _state"),this._state),this._index++}this._cleanup()},ve.prototype.pause=function(){this._running=!1},ve.prototype.resume=function(){this._running=!0,this._index<this._buffer.length&&this._parse(),this._ended&&this._finish()},ve.prototype.end=function(e){this._ended&&this._cbs.onerror(Error(".end() after done!")),e&&this.write(e),this._ended=!0,this._running&&this._finish()},ve.prototype._finish=function(){this._sectionStart<this._index&&this._handleTrailingData(),this._cbs.onend()},ve.prototype._handleTrailingData=function(){var e=this._buffer.substr(this._sectionStart);this._state===H||this._state===A||this._state===T?this._cbs.oncdata(e):this._state===k||this._state===x||this._state===z?this._cbs.oncomment(e):this._state!==ie||this._xmlMode?this._state!==se||this._xmlMode?this._state!==ce||this._xmlMode?this._state!==u&&this._state!==m&&this._state!==g&&this._state!==b&&this._state!==v&&this._state!==w&&this._state!==y&&this._state!==O&&this._state!==d&&this._cbs.ontext(e):(this._decodeNumericEntity(3,16),this._sectionStart<this._index&&(this._state=this._baseState,this._handleTrailingData())):(this._decodeNumericEntity(2,10),this._sectionStart<this._index&&(this._state=this._baseState,this._handleTrailingData())):(this._parseLegacyEntity(),this._sectionStart<this._index&&(this._state=this._baseState,this._handleTrailingData()))},ve.prototype.reset=function(){ve.call(this,{xmlMode:this._xmlMode,decodeEntities:this._decodeEntities},this._cbs)},ve.prototype.getAbsoluteIndex=function(){return this._bufferOffset+this._index},ve.prototype._getSection=function(){return this._buffer.substring(this._sectionStart,this._index)},ve.prototype._emitToken=function(e){this._cbs[e](this._getSection()),this._sectionStart=-1},ve.prototype._emitPartial=function(e){this._baseState!==c?this._cbs.onattribdata(e):this._cbs.ontext(e)}},function(e,t,r){var n=r(51);e.exports=function(e){if(e>=55296&&e<=57343||e>1114111)return"�";e in n&&(e=n[e]);var t="";e>65535&&(e-=65536,t+=String.fromCharCode(e>>>10&1023|55296),e=56320|1023&e);return t+=String.fromCharCode(e)}},function(e){e.exports=JSON.parse('{"Aacute":"Á","aacute":"á","Acirc":"Â","acirc":"â","acute":"´","AElig":"Æ","aelig":"æ","Agrave":"À","agrave":"à","amp":"&","AMP":"&","Aring":"Å","aring":"å","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","brvbar":"¦","Ccedil":"Ç","ccedil":"ç","cedil":"¸","cent":"¢","copy":"©","COPY":"©","curren":"¤","deg":"°","divide":"÷","Eacute":"É","eacute":"é","Ecirc":"Ê","ecirc":"ê","Egrave":"È","egrave":"è","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","frac12":"½","frac14":"¼","frac34":"¾","gt":">","GT":">","Iacute":"Í","iacute":"í","Icirc":"Î","icirc":"î","iexcl":"¡","Igrave":"Ì","igrave":"ì","iquest":"¿","Iuml":"Ï","iuml":"ï","laquo":"«","lt":"<","LT":"<","macr":"¯","micro":"µ","middot":"·","nbsp":" ","not":"¬","Ntilde":"Ñ","ntilde":"ñ","Oacute":"Ó","oacute":"ó","Ocirc":"Ô","ocirc":"ô","Ograve":"Ò","ograve":"ò","ordf":"ª","ordm":"º","Oslash":"Ø","oslash":"ø","Otilde":"Õ","otilde":"õ","Ouml":"Ö","ouml":"ö","para":"¶","plusmn":"±","pound":"£","quot":"\\"","QUOT":"\\"","raquo":"»","reg":"®","REG":"®","sect":"§","shy":"­","sup1":"¹","sup2":"²","sup3":"³","szlig":"ß","THORN":"Þ","thorn":"þ","times":"×","Uacute":"Ú","uacute":"ú","Ucirc":"Û","ucirc":"û","Ugrave":"Ù","ugrave":"ù","uml":"¨","Uuml":"Ü","uuml":"ü","Yacute":"Ý","yacute":"ý","yen":"¥","yuml":"ÿ"}')},function(e,t,r){var n=r(15),a=/\s+/g,o=r(28),i=r(53);function s(e,t,r){"object"==typeof e?(r=t,t=e,e=null):"function"==typeof t&&(r=t,t=c),this._callback=e,this._options=t||c,this._elementCB=r,this.dom=[],this._done=!1,this._tagStack=[],this._parser=this._parser||null}var c={normalizeWhitespace:!1,withStartIndices:!1,withEndIndices:!1};s.prototype.onparserinit=function(e){this._parser=e},s.prototype.onreset=function(){s.call(this,this._callback,this._options,this._elementCB)},s.prototype.onend=function(){this._done||(this._done=!0,this._parser=null,this._handleCallback(null))},s.prototype._handleCallback=s.prototype.onerror=function(e){if("function"==typeof this._callback)this._callback(e,this.dom);else if(e)throw e},s.prototype.onclosetag=function(){var e=this._tagStack.pop();this._options.withEndIndices&&e&&(e.endIndex=this._parser.endIndex),this._elementCB&&this._elementCB(e)},s.prototype._createDomElement=function(e){if(!this._options.withDomLvl1)return e;var t;for(var r in t="tag"===e.type?Object.create(i):Object.create(o),e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t},s.prototype._addDomElement=function(e){var t=this._tagStack[this._tagStack.length-1],r=t?t.children:this.dom,n=r[r.length-1];e.next=null,this._options.withStartIndices&&(e.startIndex=this._parser.startIndex),this._options.withEndIndices&&(e.endIndex=this._parser.endIndex),n?(e.prev=n,n.next=e):e.prev=null,r.push(e),e.parent=t||null},s.prototype.onopentag=function(e,t){var r={type:"script"===e?n.Script:"style"===e?n.Style:n.Tag,name:e,attribs:t,children:[]},a=this._createDomElement(r);this._addDomElement(a),this._tagStack.push(a)},s.prototype.ontext=function(e){var t,r=this._options.normalizeWhitespace||this._options.ignoreWhitespace;if(!this._tagStack.length&&this.dom.length&&(t=this.dom[this.dom.length-1]).type===n.Text)r?t.data=(t.data+e).replace(a," "):t.data+=e;else if(this._tagStack.length&&(t=this._tagStack[this._tagStack.length-1])&&(t=t.children[t.children.length-1])&&t.type===n.Text)r?t.data=(t.data+e).replace(a," "):t.data+=e;else{r&&(e=e.replace(a," "));var o=this._createDomElement({data:e,type:n.Text});this._addDomElement(o)}},s.prototype.oncomment=function(e){var t=this._tagStack[this._tagStack.length-1];if(t&&t.type===n.Comment)t.data+=e;else{var r={data:e,type:n.Comment},a=this._createDomElement(r);this._addDomElement(a),this._tagStack.push(a)}},s.prototype.oncdatastart=function(){var e={children:[{data:"",type:n.Text}],type:n.CDATA},t=this._createDomElement(e);this._addDomElement(t),this._tagStack.push(t)},s.prototype.oncommentend=s.prototype.oncdataend=function(){this._tagStack.pop()},s.prototype.onprocessinginstruction=function(e,t){var r=this._createDomElement({name:e,data:t,type:n.Directive});this._addDomElement(r)},e.exports=s},function(e,t){var r=e.exports={get firstChild(){var e=this.children;return e&&e[0]||null},get lastChild(){var e=this.children;return e&&e[e.length-1]||null},get nodeType(){return a[this.type]||a.element}},n={tagName:"name",childNodes:"children",parentNode:"parent",previousSibling:"prev",nextSibling:"next",nodeValue:"data"},a={element:1,text:3,cdata:4,comment:8};Object.keys(n).forEach((function(e){var t=n[e];Object.defineProperty(r,e,{get:function(){return this[t]||null},set:function(e){return this[t]=e,e}})}))},function(e,t,r){var n=e.exports;[r(55),r(60),r(61),r(62),r(63),r(64)].forEach((function(e){Object.keys(e).forEach((function(t){n[t]=e[t].bind(n)}))}))},function(e,t,r){e.exports=s;var n=r(23),a=r(66).Writable,o=r(67).StringDecoder,i=r(31).Buffer;function s(e,t){var r=this._parser=new n(e,t),i=this._decoder=new o;a.call(this,{decodeStrings:!1}),this.once("finish",(function(){r.end(i.end())}))}r(16)(s,a),s.prototype._write=function(e,t,r){e instanceof i&&(e=this._decoder.write(e)),this._parser.write(e),r()}},function(e,t,r){"use strict";(function(e){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
var n=r(69),a=r(70),o=r(71);function i(){return c.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function s(e,t){if(i()<t)throw new RangeError("Invalid typed array length");return c.TYPED_ARRAY_SUPPORT?(e=new Uint8Array(t)).__proto__=c.prototype:(null===e&&(e=new c(t)),e.length=t),e}function c(e,t,r){if(!(c.TYPED_ARRAY_SUPPORT||this instanceof c))return new c(e,t,r);if("number"==typeof e){if("string"==typeof t)throw new Error("If encoding is specified then the first argument must be a string");return h(this,e)}return l(this,e,t,r)}function l(e,t,r,n){if("number"==typeof t)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&t instanceof ArrayBuffer?function(e,t,r,n){if(t.byteLength,r<0||t.byteLength<r)throw new RangeError("'offset' is out of bounds");if(t.byteLength<r+(n||0))throw new RangeError("'length' is out of bounds");t=void 0===r&&void 0===n?new Uint8Array(t):void 0===n?new Uint8Array(t,r):new Uint8Array(t,r,n);c.TYPED_ARRAY_SUPPORT?(e=t).__proto__=c.prototype:e=p(e,t);return e}(e,t,r,n):"string"==typeof t?function(e,t,r){"string"==typeof r&&""!==r||(r="utf8");if(!c.isEncoding(r))throw new TypeError('"encoding" must be a valid string encoding');var n=0|f(t,r),a=(e=s(e,n)).write(t,r);a!==n&&(e=e.slice(0,a));return e}(e,t,r):function(e,t){if(c.isBuffer(t)){var r=0|d(t.length);return 0===(e=s(e,r)).length||t.copy(e,0,0,r),e}if(t){if("undefined"!=typeof ArrayBuffer&&t.buffer instanceof ArrayBuffer||"length"in t)return"number"!=typeof t.length||(n=t.length)!=n?s(e,0):p(e,t);if("Buffer"===t.type&&o(t.data))return p(e,t.data)}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(e,t)}function u(e){if("number"!=typeof e)throw new TypeError('"size" argument must be a number');if(e<0)throw new RangeError('"size" argument must not be negative')}function h(e,t){if(u(t),e=s(e,t<0?0:0|d(t)),!c.TYPED_ARRAY_SUPPORT)for(var r=0;r<t;++r)e[r]=0;return e}function p(e,t){var r=t.length<0?0:0|d(t.length);e=s(e,r);for(var n=0;n<r;n+=1)e[n]=255&t[n];return e}function d(e){if(e>=i())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i().toString(16)+" bytes");return 0|e}function f(e,t){if(c.isBuffer(e))return e.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(e)||e instanceof ArrayBuffer))return e.byteLength;"string"!=typeof e&&(e=""+e);var r=e.length;if(0===r)return 0;for(var n=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return B(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return I(e).length;default:if(n)return B(e).length;t=(""+t).toLowerCase(),n=!0}}function m(e,t,r){var n=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(t>>>=0))return"";for(e||(e="utf8");;)switch(e){case"hex":return S(this,t,r);case"utf8":case"utf-8":return k(this,t,r);case"ascii":return x(this,t,r);case"latin1":case"binary":return z(this,t,r);case"base64":return C(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return M(this,t,r);default:if(n)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}function v(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}function b(e,t,r,n,a){if(0===e.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,isNaN(r)&&(r=a?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(a)return-1;r=e.length-1}else if(r<0){if(!a)return-1;r=0}if("string"==typeof t&&(t=c.from(t,n)),c.isBuffer(t))return 0===t.length?-1:g(e,t,r,n,a);if("number"==typeof t)return t&=255,c.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?a?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):g(e,[t],r,n,a);throw new TypeError("val must be string, number or Buffer")}function g(e,t,r,n,a){var o,i=1,s=e.length,c=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return-1;i=2,s/=2,c/=2,r/=2}function l(e,t){return 1===i?e[t]:e.readUInt16BE(t*i)}if(a){var u=-1;for(o=r;o<s;o++)if(l(e,o)===l(t,-1===u?0:o-u)){if(-1===u&&(u=o),o-u+1===c)return u*i}else-1!==u&&(o-=o-u),u=-1}else for(r+c>s&&(r=s-c),o=r;o>=0;o--){for(var h=!0,p=0;p<c;p++)if(l(e,o+p)!==l(t,p)){h=!1;break}if(h)return o}return-1}function y(e,t,r,n){r=Number(r)||0;var a=e.length-r;n?(n=Number(n))>a&&(n=a):n=a;var o=t.length;if(o%2!=0)throw new TypeError("Invalid hex string");n>o/2&&(n=o/2);for(var i=0;i<n;++i){var s=parseInt(t.substr(2*i,2),16);if(isNaN(s))return i;e[r+i]=s}return i}function w(e,t,r,n){return q(B(t,e.length-r),e,r,n)}function O(e,t,r,n){return q(function(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}(t),e,r,n)}function E(e,t,r,n){return O(e,t,r,n)}function j(e,t,r,n){return q(I(t),e,r,n)}function _(e,t,r,n){return q(function(e,t){for(var r,n,a,o=[],i=0;i<e.length&&!((t-=2)<0);++i)r=e.charCodeAt(i),n=r>>8,a=r%256,o.push(a),o.push(n);return o}(t,e.length-r),e,r,n)}function C(e,t,r){return 0===t&&r===e.length?n.fromByteArray(e):n.fromByteArray(e.slice(t,r))}function k(e,t,r){r=Math.min(e.length,r);for(var n=[],a=t;a<r;){var o,i,s,c,l=e[a],u=null,h=l>239?4:l>223?3:l>191?2:1;if(a+h<=r)switch(h){case 1:l<128&&(u=l);break;case 2:128==(192&(o=e[a+1]))&&(c=(31&l)<<6|63&o)>127&&(u=c);break;case 3:o=e[a+1],i=e[a+2],128==(192&o)&&128==(192&i)&&(c=(15&l)<<12|(63&o)<<6|63&i)>2047&&(c<55296||c>57343)&&(u=c);break;case 4:o=e[a+1],i=e[a+2],s=e[a+3],128==(192&o)&&128==(192&i)&&128==(192&s)&&(c=(15&l)<<18|(63&o)<<12|(63&i)<<6|63&s)>65535&&c<1114112&&(u=c)}null===u?(u=65533,h=1):u>65535&&(u-=65536,n.push(u>>>10&1023|55296),u=56320|1023&u),n.push(u),a+=h}return function(e){var t=e.length;if(t<=4096)return String.fromCharCode.apply(String,e);var r="",n=0;for(;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=4096));return r}(n)}t.Buffer=c,t.SlowBuffer=function(e){+e!=e&&(e=0);return c.alloc(+e)},t.INSPECT_MAX_BYTES=50,c.TYPED_ARRAY_SUPPORT=void 0!==e.TYPED_ARRAY_SUPPORT?e.TYPED_ARRAY_SUPPORT:function(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()&&"function"==typeof e.subarray&&0===e.subarray(1,1).byteLength}catch(e){return!1}}(),t.kMaxLength=i(),c.poolSize=8192,c._augment=function(e){return e.__proto__=c.prototype,e},c.from=function(e,t,r){return l(null,e,t,r)},c.TYPED_ARRAY_SUPPORT&&(c.prototype.__proto__=Uint8Array.prototype,c.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&c[Symbol.species]===c&&Object.defineProperty(c,Symbol.species,{value:null,configurable:!0})),c.alloc=function(e,t,r){return function(e,t,r,n){return u(t),t<=0?s(e,t):void 0!==r?"string"==typeof n?s(e,t).fill(r,n):s(e,t).fill(r):s(e,t)}(null,e,t,r)},c.allocUnsafe=function(e){return h(null,e)},c.allocUnsafeSlow=function(e){return h(null,e)},c.isBuffer=function(e){return!(null==e||!e._isBuffer)},c.compare=function(e,t){if(!c.isBuffer(e)||!c.isBuffer(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var r=e.length,n=t.length,a=0,o=Math.min(r,n);a<o;++a)if(e[a]!==t[a]){r=e[a],n=t[a];break}return r<n?-1:n<r?1:0},c.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},c.concat=function(e,t){if(!o(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return c.alloc(0);var r;if(void 0===t)for(t=0,r=0;r<e.length;++r)t+=e[r].length;var n=c.allocUnsafe(t),a=0;for(r=0;r<e.length;++r){var i=e[r];if(!c.isBuffer(i))throw new TypeError('"list" argument must be an Array of Buffers');i.copy(n,a),a+=i.length}return n},c.byteLength=f,c.prototype._isBuffer=!0,c.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)v(this,t,t+1);return this},c.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)v(this,t,t+3),v(this,t+1,t+2);return this},c.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)v(this,t,t+7),v(this,t+1,t+6),v(this,t+2,t+5),v(this,t+3,t+4);return this},c.prototype.toString=function(){var e=0|this.length;return 0===e?"":0===arguments.length?k(this,0,e):m.apply(this,arguments)},c.prototype.equals=function(e){if(!c.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===c.compare(this,e)},c.prototype.inspect=function(){var e="",r=t.INSPECT_MAX_BYTES;return this.length>0&&(e=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(e+=" ... ")),"<Buffer "+e+">"},c.prototype.compare=function(e,t,r,n,a){if(!c.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===a&&(a=this.length),t<0||r>e.length||n<0||a>this.length)throw new RangeError("out of range index");if(n>=a&&t>=r)return 0;if(n>=a)return-1;if(t>=r)return 1;if(this===e)return 0;for(var o=(a>>>=0)-(n>>>=0),i=(r>>>=0)-(t>>>=0),s=Math.min(o,i),l=this.slice(n,a),u=e.slice(t,r),h=0;h<s;++h)if(l[h]!==u[h]){o=l[h],i=u[h];break}return o<i?-1:i<o?1:0},c.prototype.includes=function(e,t,r){return-1!==this.indexOf(e,t,r)},c.prototype.indexOf=function(e,t,r){return b(this,e,t,r,!0)},c.prototype.lastIndexOf=function(e,t,r){return b(this,e,t,r,!1)},c.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t|=0,isFinite(r)?(r|=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var a=this.length-t;if((void 0===r||r>a)&&(r=a),e.length>0&&(r<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var o=!1;;)switch(n){case"hex":return y(this,e,t,r);case"utf8":case"utf-8":return w(this,e,t,r);case"ascii":return O(this,e,t,r);case"latin1":case"binary":return E(this,e,t,r);case"base64":return j(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return _(this,e,t,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=!0}},c.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function x(e,t,r){var n="";r=Math.min(e.length,r);for(var a=t;a<r;++a)n+=String.fromCharCode(127&e[a]);return n}function z(e,t,r){var n="";r=Math.min(e.length,r);for(var a=t;a<r;++a)n+=String.fromCharCode(e[a]);return n}function S(e,t,r){var n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);for(var a="",o=t;o<r;++o)a+=L(e[o]);return a}function M(e,t,r){for(var n=e.slice(t,r),a="",o=0;o<n.length;o+=2)a+=String.fromCharCode(n[o]+256*n[o+1]);return a}function N(e,t,r){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function R(e,t,r,n,a,o){if(!c.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>a||t<o)throw new RangeError('"value" argument is out of bounds');if(r+n>e.length)throw new RangeError("Index out of range")}function D(e,t,r,n){t<0&&(t=65535+t+1);for(var a=0,o=Math.min(e.length-r,2);a<o;++a)e[r+a]=(t&255<<8*(n?a:1-a))>>>8*(n?a:1-a)}function P(e,t,r,n){t<0&&(t=4294967295+t+1);for(var a=0,o=Math.min(e.length-r,4);a<o;++a)e[r+a]=t>>>8*(n?a:3-a)&255}function H(e,t,r,n,a,o){if(r+n>e.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function A(e,t,r,n,o){return o||H(e,0,r,4),a.write(e,t,r,n,23,4),r+4}function T(e,t,r,n,o){return o||H(e,0,r,8),a.write(e,t,r,n,52,8),r+8}c.prototype.slice=function(e,t){var r,n=this.length;if((e=~~e)<0?(e+=n)<0&&(e=0):e>n&&(e=n),(t=void 0===t?n:~~t)<0?(t+=n)<0&&(t=0):t>n&&(t=n),t<e&&(t=e),c.TYPED_ARRAY_SUPPORT)(r=this.subarray(e,t)).__proto__=c.prototype;else{var a=t-e;r=new c(a,void 0);for(var o=0;o<a;++o)r[o]=this[o+e]}return r},c.prototype.readUIntLE=function(e,t,r){e|=0,t|=0,r||N(e,t,this.length);for(var n=this[e],a=1,o=0;++o<t&&(a*=256);)n+=this[e+o]*a;return n},c.prototype.readUIntBE=function(e,t,r){e|=0,t|=0,r||N(e,t,this.length);for(var n=this[e+--t],a=1;t>0&&(a*=256);)n+=this[e+--t]*a;return n},c.prototype.readUInt8=function(e,t){return t||N(e,1,this.length),this[e]},c.prototype.readUInt16LE=function(e,t){return t||N(e,2,this.length),this[e]|this[e+1]<<8},c.prototype.readUInt16BE=function(e,t){return t||N(e,2,this.length),this[e]<<8|this[e+1]},c.prototype.readUInt32LE=function(e,t){return t||N(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},c.prototype.readUInt32BE=function(e,t){return t||N(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},c.prototype.readIntLE=function(e,t,r){e|=0,t|=0,r||N(e,t,this.length);for(var n=this[e],a=1,o=0;++o<t&&(a*=256);)n+=this[e+o]*a;return n>=(a*=128)&&(n-=Math.pow(2,8*t)),n},c.prototype.readIntBE=function(e,t,r){e|=0,t|=0,r||N(e,t,this.length);for(var n=t,a=1,o=this[e+--n];n>0&&(a*=256);)o+=this[e+--n]*a;return o>=(a*=128)&&(o-=Math.pow(2,8*t)),o},c.prototype.readInt8=function(e,t){return t||N(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},c.prototype.readInt16LE=function(e,t){t||N(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},c.prototype.readInt16BE=function(e,t){t||N(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},c.prototype.readInt32LE=function(e,t){return t||N(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},c.prototype.readInt32BE=function(e,t){return t||N(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},c.prototype.readFloatLE=function(e,t){return t||N(e,4,this.length),a.read(this,e,!0,23,4)},c.prototype.readFloatBE=function(e,t){return t||N(e,4,this.length),a.read(this,e,!1,23,4)},c.prototype.readDoubleLE=function(e,t){return t||N(e,8,this.length),a.read(this,e,!0,52,8)},c.prototype.readDoubleBE=function(e,t){return t||N(e,8,this.length),a.read(this,e,!1,52,8)},c.prototype.writeUIntLE=function(e,t,r,n){(e=+e,t|=0,r|=0,n)||R(this,e,t,r,Math.pow(2,8*r)-1,0);var a=1,o=0;for(this[t]=255&e;++o<r&&(a*=256);)this[t+o]=e/a&255;return t+r},c.prototype.writeUIntBE=function(e,t,r,n){(e=+e,t|=0,r|=0,n)||R(this,e,t,r,Math.pow(2,8*r)-1,0);var a=r-1,o=1;for(this[t+a]=255&e;--a>=0&&(o*=256);)this[t+a]=e/o&255;return t+r},c.prototype.writeUInt8=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,1,255,0),c.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[t]=255&e,t+1},c.prototype.writeUInt16LE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,2,65535,0),c.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):D(this,e,t,!0),t+2},c.prototype.writeUInt16BE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,2,65535,0),c.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):D(this,e,t,!1),t+2},c.prototype.writeUInt32LE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,4,4294967295,0),c.TYPED_ARRAY_SUPPORT?(this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e):P(this,e,t,!0),t+4},c.prototype.writeUInt32BE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,4,4294967295,0),c.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):P(this,e,t,!1),t+4},c.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t|=0,!n){var a=Math.pow(2,8*r-1);R(this,e,t,r,a-1,-a)}var o=0,i=1,s=0;for(this[t]=255&e;++o<r&&(i*=256);)e<0&&0===s&&0!==this[t+o-1]&&(s=1),this[t+o]=(e/i>>0)-s&255;return t+r},c.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t|=0,!n){var a=Math.pow(2,8*r-1);R(this,e,t,r,a-1,-a)}var o=r-1,i=1,s=0;for(this[t+o]=255&e;--o>=0&&(i*=256);)e<0&&0===s&&0!==this[t+o+1]&&(s=1),this[t+o]=(e/i>>0)-s&255;return t+r},c.prototype.writeInt8=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,1,127,-128),c.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),e<0&&(e=255+e+1),this[t]=255&e,t+1},c.prototype.writeInt16LE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,2,32767,-32768),c.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):D(this,e,t,!0),t+2},c.prototype.writeInt16BE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,2,32767,-32768),c.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):D(this,e,t,!1),t+2},c.prototype.writeInt32LE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,4,2147483647,-2147483648),c.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24):P(this,e,t,!0),t+4},c.prototype.writeInt32BE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),c.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):P(this,e,t,!1),t+4},c.prototype.writeFloatLE=function(e,t,r){return A(this,e,t,!0,r)},c.prototype.writeFloatBE=function(e,t,r){return A(this,e,t,!1,r)},c.prototype.writeDoubleLE=function(e,t,r){return T(this,e,t,!0,r)},c.prototype.writeDoubleBE=function(e,t,r){return T(this,e,t,!1,r)},c.prototype.copy=function(e,t,r,n){if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);var a,o=n-r;if(this===e&&r<t&&t<n)for(a=o-1;a>=0;--a)e[a+t]=this[a+r];else if(o<1e3||!c.TYPED_ARRAY_SUPPORT)for(a=0;a<o;++a)e[a+t]=this[a+r];else Uint8Array.prototype.set.call(e,this.subarray(r,r+o),t);return o},c.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===e.length){var a=e.charCodeAt(0);a<256&&(e=a)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!c.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof e&&(e&=255);if(t<0||this.length<t||this.length<r)throw new RangeError("Out of range index");if(r<=t)return this;var o;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(o=t;o<r;++o)this[o]=e;else{var i=c.isBuffer(e)?e:B(new c(e,n).toString()),s=i.length;for(o=0;o<r-t;++o)this[o+t]=i[o%s]}return this};var V=/[^+\/0-9A-Za-z-_]/g;function L(e){return e<16?"0"+e.toString(16):e.toString(16)}function B(e,t){var r;t=t||1/0;for(var n=e.length,a=null,o=[],i=0;i<n;++i){if((r=e.charCodeAt(i))>55295&&r<57344){if(!a){if(r>56319){(t-=3)>-1&&o.push(239,191,189);continue}if(i+1===n){(t-=3)>-1&&o.push(239,191,189);continue}a=r;continue}if(r<56320){(t-=3)>-1&&o.push(239,191,189),a=r;continue}r=65536+(a-55296<<10|r-56320)}else a&&(t-=3)>-1&&o.push(239,191,189);if(a=null,r<128){if((t-=1)<0)break;o.push(r)}else if(r<2048){if((t-=2)<0)break;o.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return o}function I(e){return n.toByteArray(function(e){if((e=function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}(e).replace(V,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function q(e,t,r,n){for(var a=0;a<n&&!(a+r>=t.length||a>=e.length);++a)t[a+r]=e[a];return a}}).call(this,r(32))},function(e,t){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(e){"object"==typeof window&&(r=window)}e.exports=r},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e};t.default=function(e,t){var r=n({},(0,a.default)(e),{key:t});"string"==typeof r.style||r.style instanceof String?r.style=(0,o.default)(r.style):delete r.style;return r};var a=i(r(76)),o=i(r(79));function i(e){return e&&e.__esModule?e:{default:e}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){a.hasOwnProperty(e)||(a[e]=n.test(e));return a[e]};var n=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,a={}},function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}},function(e,t,r){var n=r(35);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}},function(e,t,r){var n=r(93),a="object"==typeof self&&self&&self.Object===Object&&self,o=n||a||Function("return this")();e.exports=o},function(e,t,r){var n=r(96),a=r(99);e.exports=function(e){return"symbol"==typeof e||a(e)&&"[object Symbol]"==n(e)}},function(e,t){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.htmlparser2=t.convertNodeToElement=t.processNodes=void 0;var n=r(18);Object.defineProperty(t,"processNodes",{enumerable:!0,get:function(){return s(n).default}});var a=r(22);Object.defineProperty(t,"convertNodeToElement",{enumerable:!0,get:function(){return s(a).default}});var o=r(14);Object.defineProperty(t,"htmlparser2",{enumerable:!0,get:function(){return s(o).default}});var i=s(r(83));function s(e){return e&&e.__esModule?e:{default:e}}t.default=i.default},function(e,t,r){var n=r(84),a=r(85),o=r(36),i=r(86);e.exports=function(e){return n(e)||a(e)||o(e)||i()}},function(e,t){!function(){e.exports=this.wp.mediaUtils}()},function(e,t){!function(){e.exports=this.ReactDOM}()},function(e,t,r){var n=r(39),a=r(100),o=r(101),i=Math.max,s=Math.min;e.exports=function(e,t,r){var c,l,u,h,p,d,f=0,m=!1,v=!1,b=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function g(t){var r=c,n=l;return c=l=void 0,f=t,h=e.apply(n,r)}function y(e){return f=e,p=setTimeout(O,t),m?g(e):h}function w(e){var r=e-d;return void 0===d||r>=t||r<0||v&&e-f>=u}function O(){var e=a();if(w(e))return E(e);p=setTimeout(O,function(e){var r=t-(e-d);return v?s(r,u-(e-f)):r}(e))}function E(e){return p=void 0,b&&c?g(e):(c=l=void 0,h)}function j(){var e=a(),r=w(e);if(c=arguments,l=this,d=e,r){if(void 0===p)return y(d);if(v)return clearTimeout(p),p=setTimeout(O,t),g(d)}return void 0===p&&(p=setTimeout(O,t)),h}return t=o(t)||0,n(r)&&(m=!!r.leading,u=(v="maxWait"in r)?i(o(r.maxWait)||0,t):u,b="trailing"in r?!!r.trailing:b),j.cancel=function(){void 0!==p&&clearTimeout(p),f=0,c=d=l=p=void 0},j.flush=function(){return void 0===p?h:E(a())},j}},function(e,t){function r(t,n){return e.exports=r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},r(t,n)}e.exports=r},function(e,t){function r(t){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?e.exports=r=function(e){return typeof e}:e.exports=r=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(t)}e.exports=r},function(e,t,r){"use strict";var n=r(48);function a(){}function o(){}o.resetWarningCache=a,e.exports=function(){function e(e,t,r,a,o,i){if(i!==n){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function t(){return e}e.isRequired=e;var r={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:o,resetWarningCache:a};return r.PropTypes=r,r}},function(e,t,r){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return"text"===e.type&&/\r?\n/.test(e.data)&&""===e.data.trim()}},function(e,t,r){"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0});var a=r(14),o=l(r(74)),i=l(r(75)),s=l(r(81)),c=l(r(82));function l(e){return e&&e.__esModule?e:{default:e}}function u(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}t.default=(u(n={},a.ElementType.Text,o.default),u(n,a.ElementType.Tag,i.default),u(n,a.ElementType.Style,s.default),u(n,a.ElementType.Directive,c.default),u(n,a.ElementType.Comment,c.default),u(n,a.ElementType.Script,c.default),u(n,a.ElementType.CDATA,c.default),u(n,a.ElementType.Doctype,c.default),n)},function(e){e.exports=JSON.parse('{"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376}')},function(e,t,r){"use strict";var n,a="object"==typeof Reflect?Reflect:null,o=a&&"function"==typeof a.apply?a.apply:function(e,t,r){return Function.prototype.apply.call(e,t,r)};n=a&&"function"==typeof a.ownKeys?a.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var i=Number.isNaN||function(e){return e!=e};function s(){s.init.call(this)}e.exports=s,s.EventEmitter=s,s.prototype._events=void 0,s.prototype._eventsCount=0,s.prototype._maxListeners=void 0;var c=10;function l(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function u(e){return void 0===e._maxListeners?s.defaultMaxListeners:e._maxListeners}function h(e,t,r,n){var a,o,i,s;if(l(r),void 0===(o=e._events)?(o=e._events=Object.create(null),e._eventsCount=0):(void 0!==o.newListener&&(e.emit("newListener",t,r.listener?r.listener:r),o=e._events),i=o[t]),void 0===i)i=o[t]=r,++e._eventsCount;else if("function"==typeof i?i=o[t]=n?[r,i]:[i,r]:n?i.unshift(r):i.push(r),(a=u(e))>0&&i.length>a&&!i.warned){i.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+i.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=e,c.type=t,c.count=i.length,s=c,console&&console.warn&&console.warn(s)}return e}function p(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function d(e,t,r){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:r},a=p.bind(n);return a.listener=r,n.wrapFn=a,a}function f(e,t,r){var n=e._events;if(void 0===n)return[];var a=n[t];return void 0===a?[]:"function"==typeof a?r?[a.listener||a]:[a]:r?function(e){for(var t=new Array(e.length),r=0;r<t.length;++r)t[r]=e[r].listener||e[r];return t}(a):v(a,a.length)}function m(e){var t=this._events;if(void 0!==t){var r=t[e];if("function"==typeof r)return 1;if(void 0!==r)return r.length}return 0}function v(e,t){for(var r=new Array(t),n=0;n<t;++n)r[n]=e[n];return r}Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return c},set:function(e){if("number"!=typeof e||e<0||i(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");c=e}}),s.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},s.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||i(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},s.prototype.getMaxListeners=function(){return u(this)},s.prototype.emit=function(e){for(var t=[],r=1;r<arguments.length;r++)t.push(arguments[r]);var n="error"===e,a=this._events;if(void 0!==a)n=n&&void 0===a.error;else if(!n)return!1;if(n){var i;if(t.length>0&&(i=t[0]),i instanceof Error)throw i;var s=new Error("Unhandled error."+(i?" ("+i.message+")":""));throw s.context=i,s}var c=a[e];if(void 0===c)return!1;if("function"==typeof c)o(c,this,t);else{var l=c.length,u=v(c,l);for(r=0;r<l;++r)o(u[r],this,t)}return!0},s.prototype.addListener=function(e,t){return h(this,e,t,!1)},s.prototype.on=s.prototype.addListener,s.prototype.prependListener=function(e,t){return h(this,e,t,!0)},s.prototype.once=function(e,t){return l(t),this.on(e,d(this,e,t)),this},s.prototype.prependOnceListener=function(e,t){return l(t),this.prependListener(e,d(this,e,t)),this},s.prototype.removeListener=function(e,t){var r,n,a,o,i;if(l(t),void 0===(n=this._events))return this;if(void 0===(r=n[e]))return this;if(r===t||r.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete n[e],n.removeListener&&this.emit("removeListener",e,r.listener||t));else if("function"!=typeof r){for(a=-1,o=r.length-1;o>=0;o--)if(r[o]===t||r[o].listener===t){i=r[o].listener,a=o;break}if(a<0)return this;0===a?r.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(r,a),1===r.length&&(n[e]=r[0]),void 0!==n.removeListener&&this.emit("removeListener",e,i||t)}return this},s.prototype.off=s.prototype.removeListener,s.prototype.removeAllListeners=function(e){var t,r,n;if(void 0===(r=this._events))return this;if(void 0===r.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==r[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete r[e]),this;if(0===arguments.length){var a,o=Object.keys(r);for(n=0;n<o.length;++n)"removeListener"!==(a=o[n])&&this.removeAllListeners(a);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=r[e]))this.removeListener(e,t);else if(void 0!==t)for(n=t.length-1;n>=0;n--)this.removeListener(e,t[n]);return this},s.prototype.listeners=function(e){return f(this,e,!0)},s.prototype.rawListeners=function(e){return f(this,e,!1)},s.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):m.call(e,t)},s.prototype.listenerCount=m,s.prototype.eventNames=function(){return this._eventsCount>0?n(this._events):[]}},function(e,t,r){var n=r(28),a=e.exports=Object.create(n),o={tagName:"name"};Object.keys(o).forEach((function(e){var t=o[e];Object.defineProperty(a,e,{get:function(){return this[t]||null},set:function(e){return this[t]=e,e}})}))},function(e,t,r){var n=r(27),a=r(29);function o(e,t){this.init(e,t)}function i(e,t){return a.getElementsByTagName(e,t,!0)}function s(e,t){return a.getElementsByTagName(e,t,!0,1)[0]}function c(e,t,r){return a.getText(a.getElementsByTagName(e,t,r,1)).trim()}function l(e,t,r,n,a){var o=c(r,n,a);o&&(e[t]=o)}r(16)(o,n),o.prototype.init=n;var u=function(e){return"rss"===e||"feed"===e||"rdf:RDF"===e};o.prototype.onend=function(){var e,t,r={},a=s(u,this.dom);a&&("feed"===a.name?(t=a.children,r.type="atom",l(r,"id","id",t),l(r,"title","title",t),(e=s("link",t))&&(e=e.attribs)&&(e=e.href)&&(r.link=e),l(r,"description","subtitle",t),(e=c("updated",t))&&(r.updated=new Date(e)),l(r,"author","email",t,!0),r.items=i("entry",t).map((function(e){var t,r={};return l(r,"id","id",e=e.children),l(r,"title","title",e),(t=s("link",e))&&(t=t.attribs)&&(t=t.href)&&(r.link=t),(t=c("summary",e)||c("content",e))&&(r.description=t),(t=c("updated",e))&&(r.pubDate=new Date(t)),r}))):(t=s("channel",a.children).children,r.type=a.name.substr(0,3),r.id="",l(r,"title","title",t),l(r,"link","link",t),l(r,"description","description",t),(e=c("lastBuildDate",t))&&(r.updated=new Date(e)),l(r,"author","managingEditor",t,!0),r.items=i("item",a.children).map((function(e){var t,r={};return l(r,"id","guid",e=e.children),l(r,"title","title",e),l(r,"link","link",e),l(r,"description","description",e),(t=c("pubDate",e))&&(r.pubDate=new Date(t)),r})))),this.dom=r,n.prototype._handleCallback.call(this,a?null:Error("couldn't find root of feed"))},e.exports=o},function(e,t,r){var n=r(15),a=r(56),o=n.isTag;e.exports={getInnerHTML:function(e,t){return e.children?e.children.map((function(e){return a(e,t)})).join(""):""},getOuterHTML:a,getText:function e(t){return Array.isArray(t)?t.map(e).join(""):o(t)||t.type===n.CDATA?e(t.children):t.type===n.Text?t.data:""}}},function(e,t,r){var n=r(15),a=r(57),o={__proto__:null,style:!0,script:!0,xmp:!0,iframe:!0,noembed:!0,noframes:!0,plaintext:!0,noscript:!0};var i={__proto__:null,area:!0,base:!0,basefont:!0,br:!0,col:!0,command:!0,embed:!0,frame:!0,hr:!0,img:!0,input:!0,isindex:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},s=e.exports=function(e,t){Array.isArray(e)||e.cheerio||(e=[e]),t=t||{};for(var r="",a=0;a<e.length;a++){var o=e[a];"root"===o.type?r+=s(o.children,t):n.isTag(o)?r+=c(o,t):o.type===n.Directive?r+=l(o):o.type===n.Comment?r+=p(o):o.type===n.CDATA?r+=h(o):r+=u(o,t)}return r};function c(e,t){"svg"===e.name&&(t={decodeEntities:t.decodeEntities,xmlMode:!0});var r="<"+e.name,n=function(e,t){if(e){var r,n="";for(var o in e)n&&(n+=" "),n+=o,(null!==(r=e[o])&&""!==r||t.xmlMode)&&(n+='="'+(t.decodeEntities?a.encodeXML(r):r)+'"');return n}}(e.attribs,t);return n&&(r+=" "+n),!t.xmlMode||e.children&&0!==e.children.length?(r+=">",e.children&&(r+=s(e.children,t)),i[e.name]&&!t.xmlMode||(r+="</"+e.name+">")):r+="/>",r}function l(e){return"<"+e.data+">"}function u(e,t){var r=e.data||"";return!t.decodeEntities||e.parent&&e.parent.name in o||(r=a.encodeXML(r)),r}function h(e){return"<![CDATA["+e.children[0].data+"]]>"}function p(e){return"\x3c!--"+e.data+"--\x3e"}},function(e,t,r){var n=r(58),a=r(59);t.decode=function(e,t){return(!t||t<=0?a.XML:a.HTML)(e)},t.decodeStrict=function(e,t){return(!t||t<=0?a.XML:a.HTMLStrict)(e)},t.encode=function(e,t){return(!t||t<=0?n.XML:n.HTML)(e)},t.encodeXML=n.XML,t.encodeHTML4=t.encodeHTML5=t.encodeHTML=n.HTML,t.decodeXML=t.decodeXMLStrict=a.XML,t.decodeHTML4=t.decodeHTML5=t.decodeHTML=a.HTML,t.decodeHTML4Strict=t.decodeHTML5Strict=t.decodeHTMLStrict=a.HTMLStrict,t.escape=n.escape},function(e,t,r){var n=s(r(20)),a=c(n);t.XML=d(n,a);var o=s(r(19)),i=c(o);function s(e){return Object.keys(e).sort().reduce((function(t,r){return t[e[r]]="&"+r+";",t}),{})}function c(e){var t=[],r=[];return Object.keys(e).forEach((function(e){1===e.length?t.push("\\"+e):r.push(e)})),r.unshift("["+t.join("")+"]"),new RegExp(r.join("|"),"g")}t.HTML=d(o,i);var l=/[^\0-\x7F]/g,u=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g;function h(e){return"&#x"+e.charCodeAt(0).toString(16).toUpperCase()+";"}function p(e){return"&#x"+(1024*(e.charCodeAt(0)-55296)+e.charCodeAt(1)-56320+65536).toString(16).toUpperCase()+";"}function d(e,t){function r(t){return e[t]}return function(e){return e.replace(t,r).replace(u,p).replace(l,h)}}var f=c(n);t.escape=function(e){return e.replace(f,h).replace(u,p).replace(l,h)}},function(e,t,r){var n=r(19),a=r(26),o=r(20),i=r(25),s=l(o),c=l(n);function l(e){var t=Object.keys(e).join("|"),r=p(e),n=new RegExp("&(?:"+(t+="|#[xX][\\da-fA-F]+|#\\d+")+");","g");return function(e){return String(e).replace(n,r)}}var u=function(){for(var e=Object.keys(a).sort(h),t=Object.keys(n).sort(h),r=0,o=0;r<t.length;r++)e[o]===t[r]?(t[r]+=";?",o++):t[r]+=";";var i=new RegExp("&(?:"+t.join("|")+"|#[xX][\\da-fA-F]+;?|#\\d+;?)","g"),s=p(n);function c(e){return";"!==e.substr(-1)&&(e+=";"),s(e)}return function(e){return String(e).replace(i,c)}}();function h(e,t){return e<t?1:-1}function p(e){return function(t){return"#"===t.charAt(1)?"X"===t.charAt(2)||"x"===t.charAt(2)?i(parseInt(t.substr(3),16)):i(parseInt(t.substr(2),10)):e[t.slice(1,-1)]}}e.exports={XML:s,HTML:u,HTMLStrict:c}},function(e,t){var r=t.getChildren=function(e){return e.children},n=t.getParent=function(e){return e.parent};t.getSiblings=function(e){var t=n(e);return t?r(t):[e]},t.getAttributeValue=function(e,t){return e.attribs&&e.attribs[t]},t.hasAttrib=function(e,t){return!!e.attribs&&hasOwnProperty.call(e.attribs,t)},t.getName=function(e){return e.name}},function(e,t){t.removeElement=function(e){if(e.prev&&(e.prev.next=e.next),e.next&&(e.next.prev=e.prev),e.parent){var t=e.parent.children;t.splice(t.lastIndexOf(e),1)}},t.replaceElement=function(e,t){var r=t.prev=e.prev;r&&(r.next=t);var n=t.next=e.next;n&&(n.prev=t);var a=t.parent=e.parent;if(a){var o=a.children;o[o.lastIndexOf(e)]=t}},t.appendChild=function(e,t){if(t.parent=e,1!==e.children.push(t)){var r=e.children[e.children.length-2];r.next=t,t.prev=r,t.next=null}},t.append=function(e,t){var r=e.parent,n=e.next;if(t.next=n,t.prev=e,e.next=t,t.parent=r,n){if(n.prev=t,r){var a=r.children;a.splice(a.lastIndexOf(n),0,t)}}else r&&r.children.push(t)},t.prepend=function(e,t){var r=e.parent;if(r){var n=r.children;n.splice(n.lastIndexOf(e),0,t)}e.prev&&(e.prev.next=t),t.parent=r,t.prev=e.prev,t.next=e,e.prev=t}},function(e,t,r){var n=r(15).isTag;function a(e,t,r,n){for(var o,i=[],s=0,c=t.length;s<c&&!(e(t[s])&&(i.push(t[s]),--n<=0))&&(o=t[s].children,!(r&&o&&o.length>0&&(o=a(e,o,r,n),i=i.concat(o),(n-=o.length)<=0)));s++);return i}e.exports={filter:function(e,t,r,n){Array.isArray(t)||(t=[t]);"number"==typeof n&&isFinite(n)||(n=1/0);return a(e,t,!1!==r,n)},find:a,findOneChild:function(e,t){for(var r=0,n=t.length;r<n;r++)if(e(t[r]))return t[r];return null},findOne:function e(t,r){for(var a=null,o=0,i=r.length;o<i&&!a;o++)n(r[o])&&(t(r[o])?a=r[o]:r[o].children.length>0&&(a=e(t,r[o].children)));return a},existsOne:function e(t,r){for(var a=0,o=r.length;a<o;a++)if(n(r[a])&&(t(r[a])||r[a].children.length>0&&e(t,r[a].children)))return!0;return!1},findAll:function e(t,r){for(var a=[],o=0,i=r.length;o<i;o++)n(r[o])&&(t(r[o])&&a.push(r[o]),r[o].children.length>0&&(a=a.concat(e(t,r[o].children))));return a}}},function(e,t,r){var n=r(15),a=t.isTag=n.isTag;t.testElement=function(e,t){for(var r in e)if(e.hasOwnProperty(r)){if("tag_name"===r){if(!a(t)||!e.tag_name(t.name))return!1}else if("tag_type"===r){if(!e.tag_type(t.type))return!1}else if("tag_contains"===r){if(a(t)||!e.tag_contains(t.data))return!1}else if(!t.attribs||!e[r](t.attribs[r]))return!1}else;return!0};var o={tag_name:function(e){return"function"==typeof e?function(t){return a(t)&&e(t.name)}:"*"===e?a:function(t){return a(t)&&t.name===e}},tag_type:function(e){return"function"==typeof e?function(t){return e(t.type)}:function(t){return t.type===e}},tag_contains:function(e){return"function"==typeof e?function(t){return!a(t)&&e(t.data)}:function(t){return!a(t)&&t.data===e}}};function i(e,t){return"function"==typeof t?function(r){return r.attribs&&t(r.attribs[e])}:function(r){return r.attribs&&r.attribs[e]===t}}function s(e,t){return function(r){return e(r)||t(r)}}t.getElements=function(e,t,r,n){var a=Object.keys(e).map((function(t){var r=e[t];return t in o?o[t](r):i(t,r)}));return 0===a.length?[]:this.filter(a.reduce(s),t,r,n)},t.getElementById=function(e,t,r){return Array.isArray(t)||(t=[t]),this.findOne(i("id",e),t,!1!==r)},t.getElementsByTagName=function(e,t,r,n){return this.filter(o.tag_name(e),t,r,n)},t.getElementsByTagType=function(e,t,r,n){return this.filter(o.tag_type(e),t,r,n)}},function(e,t){t.removeSubsets=function(e){for(var t,r,n,a=e.length;--a>-1;){for(t=r=e[a],e[a]=null,n=!0;r;){if(e.indexOf(r)>-1){n=!1,e.splice(a,1);break}r=r.parent}n&&(e[a]=t)}return e};var r=1,n=2,a=4,o=8,i=16,s=t.compareDocumentPosition=function(e,t){var s,c,l,u,h,p,d=[],f=[];if(e===t)return 0;for(s=e;s;)d.unshift(s),s=s.parent;for(s=t;s;)f.unshift(s),s=s.parent;for(p=0;d[p]===f[p];)p++;return 0===p?r:(l=(c=d[p-1]).children,u=d[p],h=f[p],l.indexOf(u)>l.indexOf(h)?c===t?a|i:a:c===e?n|o:n)};t.uniqueSort=function(e){var t,r,o=e.length;for(e=e.slice();--o>-1;)t=e[o],(r=e.indexOf(t))>-1&&r<o&&e.splice(o,1);return e.sort((function(e,t){var r=s(e,t);return r&n?-1:r&a?1:0})),e}},function(e,t,r){e.exports=a;var n=r(30);function a(e){n.call(this,new o(this),e)}function o(e){this.scope=e}r(16)(a,n),a.prototype.readable=!0;var i=r(14).EVENTS;Object.keys(i).forEach((function(e){if(0===i[e])o.prototype["on"+e]=function(){this.scope.emit(e)};else if(1===i[e])o.prototype["on"+e]=function(t){this.scope.emit(e,t)};else{if(2!==i[e])throw Error("wrong number of arguments!");o.prototype["on"+e]=function(t,r){this.scope.emit(e,t,r)}}}))},function(e,t){},function(e,t,r){"use strict";var n=r(68).Buffer,a=n.isEncoding||function(e){switch((e=""+e)&&e.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};function o(e){var t;switch(this.encoding=function(e){var t=function(e){if(!e)return"utf8";for(var t;;)switch(e){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return e;default:if(t)return;e=(""+e).toLowerCase(),t=!0}}(e);if("string"!=typeof t&&(n.isEncoding===a||!a(e)))throw new Error("Unknown encoding: "+e);return t||e}(e),this.encoding){case"utf16le":this.text=c,this.end=l,t=4;break;case"utf8":this.fillLast=s,t=4;break;case"base64":this.text=u,this.end=h,t=3;break;default:return this.write=p,void(this.end=d)}this.lastNeed=0,this.lastTotal=0,this.lastChar=n.allocUnsafe(t)}function i(e){return e<=127?0:e>>5==6?2:e>>4==14?3:e>>3==30?4:e>>6==2?-1:-2}function s(e){var t=this.lastTotal-this.lastNeed,r=function(e,t,r){if(128!=(192&t[0]))return e.lastNeed=0,"�";if(e.lastNeed>1&&t.length>1){if(128!=(192&t[1]))return e.lastNeed=1,"�";if(e.lastNeed>2&&t.length>2&&128!=(192&t[2]))return e.lastNeed=2,"�"}}(this,e);return void 0!==r?r:this.lastNeed<=e.length?(e.copy(this.lastChar,t,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):(e.copy(this.lastChar,t,0,e.length),void(this.lastNeed-=e.length))}function c(e,t){if((e.length-t)%2==0){var r=e.toString("utf16le",t);if(r){var n=r.charCodeAt(r.length-1);if(n>=55296&&n<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=e[e.length-2],this.lastChar[1]=e[e.length-1],r.slice(0,-1)}return r}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=e[e.length-1],e.toString("utf16le",t,e.length-1)}function l(e){var t=e&&e.length?this.write(e):"";if(this.lastNeed){var r=this.lastTotal-this.lastNeed;return t+this.lastChar.toString("utf16le",0,r)}return t}function u(e,t){var r=(e.length-t)%3;return 0===r?e.toString("base64",t):(this.lastNeed=3-r,this.lastTotal=3,1===r?this.lastChar[0]=e[e.length-1]:(this.lastChar[0]=e[e.length-2],this.lastChar[1]=e[e.length-1]),e.toString("base64",t,e.length-r))}function h(e){var t=e&&e.length?this.write(e):"";return this.lastNeed?t+this.lastChar.toString("base64",0,3-this.lastNeed):t}function p(e){return e.toString(this.encoding)}function d(e){return e&&e.length?this.write(e):""}t.StringDecoder=o,o.prototype.write=function(e){if(0===e.length)return"";var t,r;if(this.lastNeed){if(void 0===(t=this.fillLast(e)))return"";r=this.lastNeed,this.lastNeed=0}else r=0;return r<e.length?t?t+this.text(e,r):this.text(e,r):t||""},o.prototype.end=function(e){var t=e&&e.length?this.write(e):"";return this.lastNeed?t+"�":t},o.prototype.text=function(e,t){var r=function(e,t,r){var n=t.length-1;if(n<r)return 0;var a=i(t[n]);if(a>=0)return a>0&&(e.lastNeed=a-1),a;if(--n<r||-2===a)return 0;if((a=i(t[n]))>=0)return a>0&&(e.lastNeed=a-2),a;if(--n<r||-2===a)return 0;if((a=i(t[n]))>=0)return a>0&&(2===a?a=0:e.lastNeed=a-3),a;return 0}(this,e,t);if(!this.lastNeed)return e.toString("utf8",t);this.lastTotal=r;var n=e.length-(r-this.lastNeed);return e.copy(this.lastChar,0,n),e.toString("utf8",t,n)},o.prototype.fillLast=function(e){if(this.lastNeed<=e.length)return e.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);e.copy(this.lastChar,this.lastTotal-this.lastNeed,0,e.length),this.lastNeed-=e.length}},function(e,t,r){var n=r(31),a=n.Buffer;function o(e,t){for(var r in e)t[r]=e[r]}function i(e,t,r){return a(e,t,r)}a.from&&a.alloc&&a.allocUnsafe&&a.allocUnsafeSlow?e.exports=n:(o(n,t),t.Buffer=i),o(a,i),i.from=function(e,t,r){if("number"==typeof e)throw new TypeError("Argument must not be a number");return a(e,t,r)},i.alloc=function(e,t,r){if("number"!=typeof e)throw new TypeError("Argument must be a number");var n=a(e);return void 0!==t?"string"==typeof r?n.fill(t,r):n.fill(t):n.fill(0),n},i.allocUnsafe=function(e){if("number"!=typeof e)throw new TypeError("Argument must be a number");return a(e)},i.allocUnsafeSlow=function(e){if("number"!=typeof e)throw new TypeError("Argument must be a number");return n.SlowBuffer(e)}},function(e,t,r){"use strict";t.byteLength=function(e){var t=l(e),r=t[0],n=t[1];return 3*(r+n)/4-n},t.toByteArray=function(e){var t,r,n=l(e),i=n[0],s=n[1],c=new o(function(e,t,r){return 3*(t+r)/4-r}(0,i,s)),u=0,h=s>0?i-4:i;for(r=0;r<h;r+=4)t=a[e.charCodeAt(r)]<<18|a[e.charCodeAt(r+1)]<<12|a[e.charCodeAt(r+2)]<<6|a[e.charCodeAt(r+3)],c[u++]=t>>16&255,c[u++]=t>>8&255,c[u++]=255&t;2===s&&(t=a[e.charCodeAt(r)]<<2|a[e.charCodeAt(r+1)]>>4,c[u++]=255&t);1===s&&(t=a[e.charCodeAt(r)]<<10|a[e.charCodeAt(r+1)]<<4|a[e.charCodeAt(r+2)]>>2,c[u++]=t>>8&255,c[u++]=255&t);return c},t.fromByteArray=function(e){for(var t,r=e.length,a=r%3,o=[],i=0,s=r-a;i<s;i+=16383)o.push(u(e,i,i+16383>s?s:i+16383));1===a?(t=e[r-1],o.push(n[t>>2]+n[t<<4&63]+"==")):2===a&&(t=(e[r-2]<<8)+e[r-1],o.push(n[t>>10]+n[t>>4&63]+n[t<<2&63]+"="));return o.join("")};for(var n=[],a=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=0,c=i.length;s<c;++s)n[s]=i[s],a[i.charCodeAt(s)]=s;function l(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");return-1===r&&(r=t),[r,r===t?0:4-r%4]}function u(e,t,r){for(var a,o,i=[],s=t;s<r;s+=3)a=(e[s]<<16&16711680)+(e[s+1]<<8&65280)+(255&e[s+2]),i.push(n[(o=a)>>18&63]+n[o>>12&63]+n[o>>6&63]+n[63&o]);return i.join("")}a["-".charCodeAt(0)]=62,a["_".charCodeAt(0)]=63},function(e,t){t.read=function(e,t,r,n,a){var o,i,s=8*a-n-1,c=(1<<s)-1,l=c>>1,u=-7,h=r?a-1:0,p=r?-1:1,d=e[t+h];for(h+=p,o=d&(1<<-u)-1,d>>=-u,u+=s;u>0;o=256*o+e[t+h],h+=p,u-=8);for(i=o&(1<<-u)-1,o>>=-u,u+=n;u>0;i=256*i+e[t+h],h+=p,u-=8);if(0===o)o=1-l;else{if(o===c)return i?NaN:1/0*(d?-1:1);i+=Math.pow(2,n),o-=l}return(d?-1:1)*i*Math.pow(2,o-n)},t.write=function(e,t,r,n,a,o){var i,s,c,l=8*o-a-1,u=(1<<l)-1,h=u>>1,p=23===a?Math.pow(2,-24)-Math.pow(2,-77):0,d=n?0:o-1,f=n?1:-1,m=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,i=u):(i=Math.floor(Math.log(t)/Math.LN2),t*(c=Math.pow(2,-i))<1&&(i--,c*=2),(t+=i+h>=1?p/c:p*Math.pow(2,1-h))*c>=2&&(i++,c/=2),i+h>=u?(s=0,i=u):i+h>=1?(s=(t*c-1)*Math.pow(2,a),i+=h):(s=t*Math.pow(2,h-1)*Math.pow(2,a),i=0));a>=8;e[r+d]=255&s,d+=f,s/=256,a-=8);for(i=i<<a|s,l+=a;l>0;e[r+d]=255&i,d+=f,i/=256,l-=8);e[r+d-f]|=128*m}},function(e,t){var r={}.toString;e.exports=Array.isArray||function(e){return"[object Array]"==r.call(e)}},function(e,t,r){function n(e){this._cbs=e||{}}e.exports=n;var a=r(14).EVENTS;Object.keys(a).forEach((function(e){if(0===a[e])e="on"+e,n.prototype[e]=function(){this._cbs[e]&&this._cbs[e]()};else if(1===a[e])e="on"+e,n.prototype[e]=function(t){this._cbs[e]&&this._cbs[e](t)};else{if(2!==a[e])throw Error("wrong number of arguments");e="on"+e,n.prototype[e]=function(t,r){this._cbs[e]&&this._cbs[e](t,r)}}}))},function(e,t,r){function n(e){this._cbs=e||{},this.events=[]}e.exports=n;var a=r(14).EVENTS;Object.keys(a).forEach((function(e){if(0===a[e])e="on"+e,n.prototype[e]=function(){this.events.push([e]),this._cbs[e]&&this._cbs[e]()};else if(1===a[e])e="on"+e,n.prototype[e]=function(t){this.events.push([e,t]),this._cbs[e]&&this._cbs[e](t)};else{if(2!==a[e])throw Error("wrong number of arguments");e="on"+e,n.prototype[e]=function(t,r){this.events.push([e,t,r]),this._cbs[e]&&this._cbs[e](t,r)}}})),n.prototype.onreset=function(){this.events=[],this._cbs.onreset&&this._cbs.onreset()},n.prototype.restart=function(){this._cbs.onreset&&this._cbs.onreset();for(var e=0,t=this.events.length;e<t;e++)if(this._cbs[this.events[e][0]]){var r=this.events[e].length;1===r?this._cbs[this.events[e][0]]():2===r?this._cbs[this.events[e][0]](this.events[e][1]):this._cbs[this.events[e][0]](this.events[e][1],this.events[e][2])}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return e.data}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,r){var c=e.name;if(!(0,s.default)(c))return null;var l=(0,o.default)(e.attribs,t),u=null;-1===i.default.indexOf(c)&&(u=(0,a.default)(e.children,r));return n.default.createElement(c,l,u)};var n=c(r(12)),a=c(r(18)),o=c(r(33)),i=c(r(80)),s=c(r(34));function c(e){return e&&e.__esModule?e:{default:e}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return Object.keys(e).filter((function(e){return(0,o.default)(e)})).reduce((function(t,r){var o=r.toLowerCase(),i=a.default[o]||o;return t[i]=function(e,t){n.default.map((function(e){return e.toLowerCase()})).indexOf(e.toLowerCase())>=0&&(t=e);return t}(i,e[r]),t}),{})};var n=i(r(77)),a=i(r(78)),o=i(r(34));function i(e){return e&&e.__esModule?e:{default:e}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=["allowfullScreen","async","autoplay","capture","checked","controls","default","defer","disabled","formnovalidate","hidden","loop","multiple","muted","novalidate","open","playsinline","readonly","required","reversed","scoped","seamless","selected","itemscope"]},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={accept:"accept","accept-charset":"acceptCharset",accesskey:"accessKey",action:"action",allowfullscreen:"allowFullScreen",allowtransparency:"allowTransparency",alt:"alt",as:"as",async:"async",autocomplete:"autoComplete",autoplay:"autoPlay",capture:"capture",cellpadding:"cellPadding",cellspacing:"cellSpacing",charset:"charSet",challenge:"challenge",checked:"checked",cite:"cite",classid:"classID",class:"className",cols:"cols",colspan:"colSpan",content:"content",contenteditable:"contentEditable",contextmenu:"contextMenu",controls:"controls",controlsList:"controlsList",coords:"coords",crossorigin:"crossOrigin",data:"data",datetime:"dateTime",default:"default",defer:"defer",dir:"dir",disabled:"disabled",download:"download",draggable:"draggable",enctype:"encType",form:"form",formaction:"formAction",formenctype:"formEncType",formmethod:"formMethod",formnovalidate:"formNoValidate",formtarget:"formTarget",frameborder:"frameBorder",headers:"headers",height:"height",hidden:"hidden",high:"high",href:"href",hreflang:"hrefLang",for:"htmlFor","http-equiv":"httpEquiv",icon:"icon",id:"id",inputmode:"inputMode",integrity:"integrity",is:"is",keyparams:"keyParams",keytype:"keyType",kind:"kind",label:"label",lang:"lang",list:"list",loop:"loop",low:"low",manifest:"manifest",marginheight:"marginHeight",marginwidth:"marginWidth",max:"max",maxlength:"maxLength",media:"media",mediagroup:"mediaGroup",method:"method",min:"min",minlength:"minLength",multiple:"multiple",muted:"muted",name:"name",nonce:"nonce",novalidate:"noValidate",open:"open",optimum:"optimum",pattern:"pattern",placeholder:"placeholder",playsinline:"playsInline",poster:"poster",preload:"preload",profile:"profile",radiogroup:"radioGroup",readonly:"readOnly",referrerpolicy:"referrerPolicy",rel:"rel",required:"required",reversed:"reversed",role:"role",rows:"rows",rowspan:"rowSpan",sandbox:"sandbox",scope:"scope",scoped:"scoped",scrolling:"scrolling",seamless:"seamless",selected:"selected",shape:"shape",size:"size",sizes:"sizes",slot:"slot",span:"span",spellcheck:"spellCheck",src:"src",srcdoc:"srcDoc",srclang:"srcLang",srcset:"srcSet",start:"start",step:"step",style:"style",summary:"summary",tabindex:"tabIndex",target:"target",title:"title",type:"type",usemap:"useMap",value:"value",width:"width",wmode:"wmode",wrap:"wrap",about:"about",datatype:"datatype",inlist:"inlist",prefix:"prefix",property:"property",resource:"resource",typeof:"typeof",vocab:"vocab",autocapitalize:"autoCapitalize",autocorrect:"autoCorrect",autosave:"autoSave",color:"color",itemprop:"itemProp",itemscope:"itemScope",itemtype:"itemType",itemid:"itemID",itemref:"itemRef",results:"results",security:"security",unselectable:"unselectable"}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,a=!1,o=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){a=!0,o=e}finally{try{!n&&s.return&&s.return()}finally{if(a)throw o}}return r}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(""===e)return{};return e.split(";").reduce((function(e,t){var r=t.split(/^([^:]+):/).filter((function(e,t){return t>0})).map((function(e){return e.trim().toLowerCase()})),a=n(r,2),o=a[0],i=a[1];return void 0===i||(e[o=o.replace(/^-ms-/,"ms-").replace(/-(.)/g,(function(e,t){return t.toUpperCase()}))]=i),e}),{})}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"]},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var r=void 0;e.children.length>0&&(r=e.children[0].data);var o=(0,a.default)(e.attribs,t);return n.default.createElement("style",o,r)};var n=o(r(12)),a=o(r(33));function o(e){return e&&e.__esModule?e:{default:e}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){return null}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.decodeEntities,o=void 0===r||r,i=t.transform,s=t.preprocessNodes,c=void 0===s?function(e){return e}:s,l=c(n.default.parseDOM(e,{decodeEntities:o}));return(0,a.default)(l,i)};var n=o(r(14)),a=o(r(18));function o(e){return e&&e.__esModule?e:{default:e}}},function(e,t,r){var n=r(35);e.exports=function(e){if(Array.isArray(e))return n(e)}},function(e,t){e.exports=function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(e,t){e.exports=function(e){if(Array.isArray(e))return e}},function(e,t){e.exports=function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var r=[],n=!0,a=!1,o=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){a=!0,o=e}finally{try{n||null==s.return||s.return()}finally{if(a)throw o}}return r}}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(e,t,r){var n=r(91),a=0;e.exports=function(e){var t=++a;return n(e)+t}},function(e,t,r){var n=r(92);e.exports=function(e){return null==e?"":n(e)}},function(e,t,r){var n=r(21),a=r(94),o=r(95),i=r(38),s=n?n.prototype:void 0,c=s?s.toString:void 0;e.exports=function e(t){if("string"==typeof t)return t;if(o(t))return a(t,e)+"";if(i(t))return c?c.call(t):"";var r=t+"";return"0"==r&&1/t==-1/0?"-0":r}},function(e,t,r){(function(t){var r="object"==typeof t&&t&&t.Object===Object&&t;e.exports=r}).call(this,r(32))},function(e,t){e.exports=function(e,t){for(var r=-1,n=null==e?0:e.length,a=Array(n);++r<n;)a[r]=t(e[r],r,e);return a}},function(e,t){var r=Array.isArray;e.exports=r},function(e,t,r){var n=r(21),a=r(97),o=r(98),i=n?n.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":i&&i in Object(e)?a(e):o(e)}},function(e,t,r){var n=r(21),a=Object.prototype,o=a.hasOwnProperty,i=a.toString,s=n?n.toStringTag:void 0;e.exports=function(e){var t=o.call(e,s),r=e[s];try{e[s]=void 0;var n=!0}catch(e){}var a=i.call(e);return n&&(t?e[s]=r:delete e[s]),a}},function(e,t){var r=Object.prototype.toString;e.exports=function(e){return r.call(e)}},function(e,t){e.exports=function(e){return null!=e&&"object"==typeof e}},function(e,t,r){var n=r(37);e.exports=function(){return n.Date.now()}},function(e,t,r){var n=r(39),a=r(38),o=/^\s+|\s+$/g,i=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,c=/^0o[0-7]+$/i,l=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(a(e))return NaN;if(n(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=n(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(o,"");var r=s.test(e);return r||c.test(e)?l(e.slice(2),r?2:8):i.test(e)?NaN:+e}},function(e,t,r){"use strict";r.r(t);wp.customize.astraControl=wp.customize.Control.extend({initialize:function(e,t){var r=t||{};r.params=r.params||{},r.params.type||(r.params.type="astra-basic"),r.params.content||(r.params.content=jQuery("<li></li>"),r.params.content.attr("id","customize-control-"+e.replace(/]/g,"").replace(/\[/g,"-")),r.params.content.attr("class","customize-control customize-control-"+r.params.type)),this.propertyElements=[],wp.customize.Control.prototype.initialize.call(this,e,r)},_setUpSettingRootLinks:function(){var e=this;e.container.find("[data-customize-setting-link]").each((function(){var t=jQuery(this);wp.customize(t.data("customizeSettingLink"),(function(r){var n=new wp.customize.Element(t);e.elements.push(n),n.sync(r),n.set(r())}))}))},_setUpSettingPropertyLinks:function(){var e=this;e.setting&&e.container.find("[data-customize-setting-property-link]").each((function(){var t,r=jQuery(this),n=r.data("customizeSettingPropertyLink");t=new wp.customize.Element(r),e.propertyElements.push(t),t.set(e.setting()[n]),t.bind((function(t){var r=e.setting();t!==r[n]&&((r=_.clone(r))[n]=t,e.setting.set(r))})),e.setting.bind((function(e){e[n]!==t.get()&&t.set(e[n])}))}))},ready:function(){this._setUpSettingRootLinks(),this._setUpSettingPropertyLinks(),wp.customize.Control.prototype.ready.call(this),this.deferred.embedded.done((function(){}))},embed:function(){var e=this,t=e.section();t&&wp.customize.section(t,(function(t){t.expanded()||wp.customize.settings.autofocus.control===e.id?e.actuallyEmbed():t.expanded.bind((function(t){t&&e.actuallyEmbed()}))}))},actuallyEmbed:function(){"resolved"!==this.deferred.embedded.state()&&(this.renderContent(),this.deferred.embedded.resolve(),this.container.trigger("init"))},focus:function(e){this.actuallyEmbed(),wp.customize.Control.prototype.focus.call(this,e)}});var n=r(0),a=r(4),o=r.n(a),i=r(5),s=r.n(i),c=r(6),l=r.n(c),u=r(7),h=r.n(u),p=r(1),d=r.n(p),f=r(3),m=r.n(f);function v(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var b=function(e){l()(r,e);var t=v(r);function r(){return o()(this,r),t.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var e=null,t=null,r=null;return this.props.control.params.caption&&(e=Object(n.createElement)("span",{className:"customize-control-caption"},this.props.control.params.caption)),this.props.control.params.label&&(t=Object(n.createElement)("span",{className:"customize-control-title wp-ui-text-highlight"},this.props.control.params.label)),this.props.control.params.description&&(r=Object(n.createElement)("span",{className:"description customize-control-description"},this.props.control.params.description)),Object(n.createElement)(n.Fragment,null,e,Object(n.createElement)("div",{className:"ast-heading-wrapper wp-ui-highlight"},Object(n.createElement)("label",{className:"customizer-text"},t,r)))}}]),r}(n.Component);b.propTypes={control:m.a.object.isRequired};var g=b,y=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(g,{control:this}),this.container[0])}});function w(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var O=function(e){l()(r,e);var t=w(r);function r(e){var n;return o()(this,r),(n=t.call(this,e)).value=e.control.setting.get(),n.state={value:n.value},n.name=e.control.params.settings.default,n.name=n.name.replace("[","-"),n.name=n.name.replace("]",""),n}return s()(r,[{key:"render",value:function(){var e="hidden-field-".concat(this.name);return Object(n.createElement)("input",{type:"hidden",className:e,"data-name":this.name,value:this.state.value})}}]),r}(n.Component);O.propTypes={control:m.a.object.isRequired};var E=O,j=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(E,{control:this}),this.container[0])}}),C=r(40),k=r.n(C);function x(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var z=function(e){l()(r,e);var t=x(r);function r(){return o()(this,r),t.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var e=null,t=null,r=null;return this.props.control.params.label&&(e=Object(n.createElement)("span",{className:"customize-control-title"},this.props.control.params.label)),this.props.control.params.help&&(t=Object(n.createElement)("span",{className:"ast-description"},k()(this.props.control.params.help))),this.props.control.params.description&&(r=Object(n.createElement)("span",{className:"description customize-control-description"},this.props.control.params.description)),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",{className:"customizer-text"},e,t,r))}}]),r}(n.Component);z.propTypes={control:m.a.object.isRequired};var S=z,M=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(S,{control:this}),this.container[0])}}),N=r(10),R=r.n(N),D=r(2),P=r.n(D),H=r(8),A=r(9);function T(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function V(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?T(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):T(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function L(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var B=function(e){l()(r,e);var t=L(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.state={value:a},n.onUrlChange=n.onUrlChange.bind(P()(n)),n.onCheckboxChange=n.onCheckboxChange.bind(P()(n)),n.onRelChange=n.onRelChange.bind(P()(n)),n}return s()(r,[{key:"onUrlChange",value:function(e){var t=V(V({},this.state.value),{},{url:e});this.setState({value:t}),this.props.control.setting.set(t)}},{key:"onCheckboxChange",value:function(){var e=V(V({},this.state.value),{},{new_tab:event.target.checked});this.setState({value:e}),this.props.control.setting.set(e)}},{key:"onRelChange",value:function(e){var t=V(V({},this.state.value),{},{link_rel:e});this.setState({value:t}),this.props.control.setting.set(t)}},{key:"render",value:function(){var e=this,t=this.props.control.params,r=t.value,a=t.label,o=t.settings,i=this.state.value,s=i.url,c=i.new_tab,l=i.link_rel,u=o.default;u=(u=u.replace("[","-")).replace("]","");var h=null;return a&&(h=Object(n.createElement)("label",null,Object(n.createElement)("span",{className:"customize-control-title"},a))),Object(n.createElement)(n.Fragment,null,h,Object(n.createElement)("div",{className:"customize-control-content"},Object(n.createElement)(A.TextControl,{value:s,className:"ast-link-input",onChange:function(t){e.onUrlChange(t)}})),Object(n.createElement)("div",{className:"customize-control-content ast-link-open-in-new-tab-wrapper"},Object(n.createElement)("input",{type:"checkbox",id:"ast-link-open-in-new-tab",className:"ast-link-open-in-new-tab",name:"ast-link-open-in-new-tab",checked:c,onChange:function(){return e.onCheckboxChange()}}),Object(n.createElement)("label",null,Object(H.__)("Open in a New Tab"))),Object(n.createElement)("div",{className:"customize-control-content"},Object(n.createElement)("label",null,Object(n.createElement)("span",{className:"customize-control-title"},Object(H.__)("Button Link Rel"))),Object(n.createElement)(A.TextControl,{value:l,className:"ast-link-relationship",onChange:function(t){e.onRelChange(t)}})),Object(n.createElement)("input",{type:"hidden",id:"_customize-input-".concat(o.default),className:"customize-link-control-data",name:u,"data-customize-setting-link":o.default,"data-value":JSON.stringify(r)}))}}]),r}(n.Component);B.propTypes={control:m.a.object.isRequired};var I=B,q=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(I,{control:this}),this.container[0])}});function U(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var F=function(e){l()(r,e);var t=U(r);function r(){return o()(this,r),t.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var e=this.props.control.params,t=e.caption,r=e.separator,a=e.label,o=e.description,i=null,s=null,c=null,l=null;return r&&(i=Object(n.createElement)("hr",null)),t&&(s=Object(n.createElement)("span",{className:"customize-control-caption"},t)),a&&(c=Object(n.createElement)("span",{className:"customize-control-title"},a)),o&&(l=Object(n.createElement)("span",{className:"description customize-control-description"},o)),Object(n.createElement)(n.Fragment,null,s,i,Object(n.createElement)("label",{className:"customizer-text"},c,l))}}]),r}(n.Component);F.propTypes={control:m.a.object.isRequired};var Q=F,Y=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Q,{control:this}),this.container[0])}});function G(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var W=function(e){l()(r,e);var t=G(r);function r(){return o()(this,r),t.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var e=null,t=null,r=this.props.control.params,a=r.label,o=r.help,i=r.name;return a&&(e=Object(n.createElement)("span",{className:"customize-control-title"},a)),o&&(t=Object(n.createElement)("span",{className:"ast-description"},o)),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("div",{className:"ast-toggle-desc-wrap"},Object(n.createElement)("label",{className:"customizer-text"},e,t,Object(n.createElement)("span",{className:"ast-adv-toggle-icon dashicons","data-control":i}))),Object(n.createElement)("div",{className:"ast-field-settings-wrap"}))}}]),r}(n.Component);W.propTypes={control:m.a.object.isRequired};var X=W,J=r(11),Z=r.n(J);function K(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function $(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var ee=function(e){l()(r,e);var t=$(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.state={value:a},n.onBorderChange=n.onBorderChange.bind(P()(n)),n.onConnectedClick=n.onConnectedClick.bind(P()(n)),n.onDisconnectedClick=n.onDisconnectedClick.bind(P()(n)),n}return s()(r,[{key:"onBorderChange",value:function(e){var t=this.props.control.params.choices,r=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?K(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):K(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},this.state.value);if(event.target.classList.contains("connected"))for(var n in t)r[n]=event.target.value;else r[e]=event.target.value;this.setState({value:r}),this.props.control.setting.set(r)}},{key:"onConnectedClick",value:function(){for(var e=event.target.parentElement.parentElement.querySelectorAll(".ast-border-input"),t=0;t<e.length;t++)e[t].classList.remove("connected"),e[t].setAttribute("data-element-connect","");event.target.parentElement.classList.remove("disconnected")}},{key:"onDisconnectedClick",value:function(){for(var e=event.target.dataset.elementConnect,t=event.target.parentElement.parentElement.querySelectorAll(".ast-border-input"),r=0;r<t.length;r++)t[r].classList.add("connected"),t[r].setAttribute("data-element-connect",e);event.target.parentElement.classList.add("disconnected")}},{key:"render",value:function(){var e,t=this,r=this.props.control.params,a=r.label,o=r.description,i=r.linked_choices,s=r.id,c=r.choices,l=r.inputAttrs,u=r.name,h=null,p=null,d=null,f=Object(H.__)("Link Values Together","astra");return a&&(h=Object(n.createElement)("span",{className:"customize-control-title"},a)),o&&(p=Object(n.createElement)("span",{className:"description customize-control-description"},o)),i&&(d=Object(n.createElement)("li",{key:s,className:"ast-border-input-item-link"},Object(n.createElement)("span",{className:"dashicons dashicons-admin-links ast-border-connected wp-ui-highlight",onClick:function(){t.onConnectedClick()},"data-element-connect":s,title:f}),Object(n.createElement)("span",{className:"dashicons dashicons-editor-unlink ast-border-disconnected",onClick:function(){t.onDisconnectedClick()},"data-element-connect":s,title:f}))),e=Object.keys(c).map((function(e){if(c[e])var r=Object(n.createElement)("li",Z()({},l,{key:e,className:"ast-border-input-item"}),Object(n.createElement)("input",{type:"number",className:"ast-border-input ast-border-desktop","data-id":e,"data-name":u,onChange:function(){return t.onBorderChange(e)},value:t.state.value[e]}),Object(n.createElement)("span",{className:"ast-border-title"},c[e]));return r})),Object(n.createElement)(n.Fragment,null,h,p,Object(n.createElement)("div",{className:"ast-border-outer-wrapper"},Object(n.createElement)("div",{className:"input-wrapper ast-border-wrapper"},Object(n.createElement)("ul",{className:"ast-border-wrapper desktop active"},d,e))))}}]),r}(n.Component);ee.propTypes={control:m.a.object.isRequired};var te=ee;function re(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ne(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?re(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):re(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function ae(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var oe=function(e){l()(r,e);var t=ae(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.state={value:a},n.renderInputHtml=n.renderInputHtml.bind(P()(n)),n.onInputChange=n.onInputChange.bind(P()(n)),n.onSelectChange=n.onSelectChange.bind(P()(n)),n}return s()(r,[{key:"onInputChange",value:function(e){var t=ne({},this.state.value);t[e]=event.target.value,this.updateValues(t)}},{key:"onSelectChange",value:function(e){var t=ne({},this.state.value);t["".concat(e,"-unit")]=event.target.value,this.updateValues(t)}},{key:"renderInputHtml",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],o=this.props.control.params.units,i=!1;1===o.length&&(i=!0);var s=Object.keys(o).map((function(e){return Object(n.createElement)("option",{key:e,value:e},o[e])}));return!1===a?Object(n.createElement)(n.Fragment,null,Object(n.createElement)("input",{key:e+"input","data-id":e,className:"ast-responsive-input ast-non-reponsive ".concat(e," ").concat(r),type:"number",value:this.state.value[e],onChange:function(){t.onInputChange(e)}}),Object(n.createElement)("select",{key:e+"select",value:this.state.value["".concat(e,"-unit")],className:"ast-responsive-select ".concat(e),"data-id":"".concat(e,"-unit"),disabled:i,onChange:function(){t.onSelectChange(e)}},s)):Object(n.createElement)(n.Fragment,null,Object(n.createElement)("input",{key:e+"input","data-id":e,className:"ast-responsive-input ".concat(e," ").concat(r),type:"number",value:this.state.value[e],onChange:function(){t.onInputChange(e)}}),Object(n.createElement)("select",{key:e+"select",value:this.state.value["".concat(e,"-unit")],className:"ast-responsive-select ".concat(e),"data-id":"".concat(e,"-unit"),disabled:i,onChange:function(){t.onSelectChange(e)}},s))}},{key:"render",value:function(){var e=this.props.control.params,t=e.description,r=e.label,a=e.responsive,o=null,i=null,s=null,c=null;return r&&(o=Object(n.createElement)("span",{className:"customize-control-title"},r),a&&(i=Object(n.createElement)("ul",{key:"ast-resp-ul",className:"ast-responsive-btns"},Object(n.createElement)("li",{key:"desktop",className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{key:"tablet",className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{key:"mobile",className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"})))))),t&&(s=Object(n.createElement)("span",{className:"description customize-control-description"},t)),c=a?Object(n.createElement)(n.Fragment,null,this.renderInputHtml("desktop","active"),this.renderInputHtml("tablet"),this.renderInputHtml("mobile")):Object(n.createElement)(n.Fragment,null,this.renderInputHtml("desktop","active",!1)),Object(n.createElement)("label",{key:"customizer-text",className:"customizer-text"},o,i,s,Object(n.createElement)("div",{className:"input-wrapper ast-responsive-wrapper"},c))}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(n.Component);oe.propTypes={control:m.a.object.isRequired};var ie=oe;function se(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ce(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var le=function(e){l()(r,e);var t=ce(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.state={value:a},n.renderInputHtml=n.renderInputHtml.bind(P()(n)),n.onInputChange=n.onInputChange.bind(P()(n)),n.onResetClick=n.onResetClick.bind(P()(n)),n}return s()(r,[{key:"onResetClick",value:function(){this.updateValues(this.props.control.params.default)}},{key:"onInputChange",value:function(e){var t=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?se(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):se(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},this.state.value);t[e]=event.target.value,this.updateValues(t)}},{key:"renderInputHtml",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=this.props.control.params,o=(a.inputAttrs,a.suffix),i=null;return o&&(i=Object(n.createElement)("span",{className:"ast-range-unit"},o)),Object(n.createElement)("div",{className:"input-field-wrapper ".concat(e," ").concat(r)},Object(n.createElement)("input",{type:"range",value:this.state.value[e],"data-reset_value":this.props.control.params.default[e],onChange:function(){t.onInputChange(e)}}),Object(n.createElement)("div",{className:"astra_range_value"},Object(n.createElement)("input",{type:"number","data-id":e,className:"ast-responsive-range-value-input",value:this.state.value[e],onChange:function(){t.onInputChange(e)}}),i))}},{key:"render",value:function(){var e,t,r=this,a=this.props.control.params,o=a.description,i=a.label,s=Object(H.__)("Back to default","astra"),c=null,l=null,u=null;return i&&(c=Object(n.createElement)("span",{className:"customize-control-title"},i),l=Object(n.createElement)("ul",{key:"ast-resp-ul",className:"ast-responsive-slider-btns"},Object(n.createElement)("li",{className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop active","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"}))))),o&&(u=Object(n.createElement)("span",{className:"description customize-control-description"},o)),e=Object(n.createElement)(n.Fragment,null,this.renderInputHtml("desktop","active"),this.renderInputHtml("tablet"),this.renderInputHtml("mobile")),t=Object(n.createElement)("div",{className:"ast-responsive-slider-reset",onClick:function(){r.onResetClick()}},Object(n.createElement)("span",{className:"dashicons dashicons-image-rotate ast-control-tooltip",title:s})),Object(n.createElement)("label",{key:"customizer-text"},c,l,u,Object(n.createElement)("div",{className:"wrapper"},e,t))}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(n.Component);le.propTypes={control:m.a.object.isRequired};var ue=le;function he(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function pe(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?he(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):he(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function de(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var fe=function(e){l()(r,e);var t=de(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return void 0!==a&&""!==a||(a=n.props.control.params.value),n.state={value:a},n.renderInputHtml=n.renderInputHtml.bind(P()(n)),n.renderResponsiveInput=n.renderResponsiveInput.bind(P()(n)),n.onUnitChange=n.onUnitChange.bind(P()(n)),n.updateValues=n.updateValues.bind(P()(n)),n.onSpacingChange=n.onSpacingChange.bind(P()(n)),n.onConnectedClick=n.onConnectedClick.bind(P()(n)),n.onDisconnectedClick=n.onDisconnectedClick.bind(P()(n)),n}return s()(r,[{key:"onConnectedClick",value:function(){for(var e=event.target.parentElement.parentElement.querySelectorAll(".ast-spacing-input"),t=0;t<e.length;t++)e[t].classList.remove("connected"),e[t].setAttribute("data-element-connect","");event.target.parentElement.classList.remove("disconnected")}},{key:"onDisconnectedClick",value:function(){for(var e=event.target.dataset.elementConnect,t=event.target.parentElement.parentElement.querySelectorAll(".ast-spacing-input"),r=0;r<t.length;r++)t[r].classList.add("connected"),t[r].setAttribute("data-element-connect",e);event.target.parentElement.classList.add("disconnected")}},{key:"onSpacingChange",value:function(e,t){var r=this.props.control.params.choices,n=pe({},this.state.value),a=pe({},n[e]);if(event.target.classList.contains("connected"))for(var o in r)a[o]=event.target.value;else a[t]=event.target.value;n[e]=a,this.updateValues(n)}},{key:"onUnitChange",value:function(e,t){var r=pe({},this.state.value);r["".concat(e,"-unit")]=t,this.updateValues(r)}},{key:"renderResponsiveInput",value:function(e){var t=this;return Object(n.createElement)("input",{key:e,type:"hidden",onChange:function(){return t.onUnitChange(e,"")},className:"ast-spacing-unit-input ast-spacing-".concat(e,"-unit"),"data-device":"".concat(e),value:this.state.value["".concat(e,"-unit")]})}},{key:"renderInputHtml",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=this.props.control.params,o=a.linked_choices,i=a.id,s=a.choices,c=a.inputAttrs,l=a.unit_choices,u=Object(H.__)("Link Values Together","astra"),h=null,p=null,d=null;return o&&(h=Object(n.createElement)("li",{key:"connect-disconnect"+e,className:"ast-spacing-input-item-link"},Object(n.createElement)("span",{key:"connect"+e,className:"dashicons dashicons-admin-links ast-spacing-connected wp-ui-highlight",onClick:function(){t.onConnectedClick()},"data-element-connect":i,title:u}),Object(n.createElement)("span",{key:"disconnect"+e,className:"dashicons dashicons-editor-unlink ast-spacing-disconnected",onClick:function(){t.onDisconnectedClick()},"data-element-connect":i,title:u}))),p=Object.keys(s).map((function(r){return Object(n.createElement)("li",Z()({key:r},c,{className:"ast-spacing-input-item"}),Object(n.createElement)("input",{type:"number",className:"ast-spacing-input ast-spacing-".concat(e),"data-id":r,value:t.state.value[e][r],onChange:function(){return t.onSpacingChange(e,r)}}),Object(n.createElement)("span",{className:"ast-spacing-title"},s[r]))})),l&&void 0!==l&&(d=Object.values(l).map((function(r){var a="";return t.state.value["".concat(e,"-unit")]===r&&(a="active"),Object(n.createElement)("li",{key:r,className:"single-unit ".concat(a),onClick:function(){return t.onUnitChange(e,r)},"data-unit":r},Object(n.createElement)("span",{className:"unit-text"},r))}))),Object(n.createElement)("ul",{key:e,className:"ast-spacing-wrapper ".concat(e," ").concat(r)},h,p,Object(n.createElement)("ul",{key:"responsive-units",className:"ast-spacing-responsive-units ast-spacing-".concat(e,"-responsive-units")},d))}},{key:"render",value:function(){var e,t,r=this.props.control.params,a=r.label,o=r.description,i=null,s=null;return a&&(i=Object(n.createElement)("span",{className:"customize-control-title"},a)),o&&(s=Object(n.createElement)("span",{className:"description customize-control-description"},o)),e=Object(n.createElement)(n.Fragment,null,this.renderInputHtml("desktop","active"),this.renderInputHtml("tablet"),this.renderInputHtml("mobile")),t=Object(n.createElement)(n.Fragment,null,Object(n.createElement)("div",{className:"unit-input-wrapper ast-spacing-unit-wrapper"},this.renderResponsiveInput("desktop"),this.renderResponsiveInput("tablet"),this.renderResponsiveInput("mobile")),Object(n.createElement)("ul",{key:"ast-spacing-responsive-btns",className:"ast-spacing-responsive-btns"},Object(n.createElement)("li",{key:"desktop",className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop active","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{key:"tablet",className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{key:"mobile",className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"}))))),Object(n.createElement)("label",{key:"ast-spacing-responsive",className:"ast-spacing-responsive"},i,s,Object(n.createElement)("div",{className:"ast-spacing-responsive-outer-wrapper"},Object(n.createElement)("div",{className:"input-wrapper ast-spacing-responsive-wrapper"},e),Object(n.createElement)("div",{className:"ast-spacing-responsive-units-screen-wrap"},t)))}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(n.Component);fe.propTypes={control:m.a.object.isRequired};var me=fe;function ve(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var be=function(e){l()(r,e);var t=ve(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.state={value:a},n.updateValues=n.updateValues.bind(P()(n)),n}return s()(r,[{key:"render",value:function(){var e=this,t=this.props.control.params,r=t.label,a=t.description,o=t.suffix,i=t.link,s=t.inputAttrs,c=t.name,l=null,u=null,h=null,p=[],d=Object(H.__)("Back to default","astra");(r&&(l=Object(n.createElement)("label",null,Object(n.createElement)("span",{className:"customize-control-title"},r))),a&&(u=Object(n.createElement)("span",{className:"description customize-control-description"},a)),o&&(h=Object(n.createElement)("span",{className:"ast-range-unit"},o)),void 0!==s)&&s.split(" ").map((function(e,t){var r=e.split("=");void 0!==r[1]&&(p[r[0]]=r[1].replace(/"/g,""))}));void 0!==i&&i.split(" ").map((function(e,t){var r=e.split("=");void 0!==r[1]&&(p[r[0]]=r[1].replace(/"/g,""))}));return Object(n.createElement)("label",null,l,u,Object(n.createElement)("div",{className:"wrapper"},Object(n.createElement)("input",Z()({},p,{type:"range",value:this.state.value,"data-reset_value":this.props.control.params.default,onChange:function(){return e.updateValues(event.target.value)}})),Object(n.createElement)("div",{className:"astra_range_value"},Object(n.createElement)("input",Z()({},p,{type:"number","data-name":c,className:"value ast-range-value-input",value:this.state.value,onChange:function(){return e.updateValues(event.target.value)}})),h),Object(n.createElement)("div",{className:"ast-slider-reset",onClick:function(){e.updateValues(e.props.control.params.default)}},Object(n.createElement)("span",{className:"dashicons dashicons-image-rotate ast-control-tooltip",title:d}))))}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(n.Component);be.propTypes={control:m.a.object.isRequired};var ge=be,ye=r(41),we=r.n(ye),Oe=r(42);function Ee(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var je=function(e){l()(r,e);var t=Ee(r);function r(e){var n;return o()(this,r),(n=t.call(this,e)).onChangeComplete=n.onChangeComplete.bind(P()(n)),n.onPaletteChangeComplete=n.onPaletteChangeComplete.bind(P()(n)),n.onChangeGradientComplete=n.onChangeGradientComplete.bind(P()(n)),n.renderImageSettings=n.renderImageSettings.bind(P()(n)),n.onRemoveImage=n.onRemoveImage.bind(P()(n)),n.onSelectImage=n.onSelectImage.bind(P()(n)),n.open=n.open.bind(P()(n)),n.state={isVisible:!1,refresh:!1,color:n.props.color,modalCanClose:!0,backgroundType:n.props.backgroundType,supportGradient:void 0!==A.__experimentalGradientPicker},n.props.allowImage&&(n.state.backgroundImage=n.props.backgroundImage,n.state.media=n.props.media,n.state.backgroundAttachment=n.props.backgroundAttachment,n.state.backgroundPosition=n.props.backgroundPosition,n.state.backgroundRepeat=n.props.backgroundRepeat,n.state.backgroundSize=n.props.backgroundSize),n}return s()(r,[{key:"render",value:function(){var e=this,t=this.state,r=t.refresh,a=t.modalCanClose,o=t.isVisible,i=t.supportGradient,s=t.backgroundType,c=t.color,l=this.props,u=l.allowGradient,h=l.allowImage,p=function(){a&&!0===o&&e.setState({isVisible:!1})},d=!(!u||!i),f=[{name:"color",title:Object(H.__)("Color","astra"),className:"astra-color-background"}];if(d){var m={name:"gradient",title:Object(H.__)("Gradient","astra"),className:"astra-image-background"};f.push(m)}if(h){var v={name:"image",title:Object(H.__)("Image","astra"),className:"astra-image-background"};f.push(v)}var b=[],g=0;return we()(astColorPalette.colors).forEach((function(e){var t={};Object.assign(t,{name:g+"_"+e}),Object.assign(t,{color:e}),b.push(t),g++})),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("div",{className:"color-button-wrap"},Object(n.createElement)(A.Button,{className:o?"astra-color-icon-indicate open":"astra-color-icon-indicate",onClick:function(){o?p():(!0===r?e.setState({refresh:!1}):e.setState({refresh:!0}),e.setState({isVisible:!0}))}},("color"===s||"gradient"===s)&&Object(n.createElement)(A.ColorIndicator,{className:"astra-advanced-color-indicate",colorValue:this.props.color}),"image"===s&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(A.ColorIndicator,{className:"astra-advanced-color-indicate",colorValue:"#ffffff"}),Object(n.createElement)(A.Dashicon,{icon:"format-image"})))),Object(n.createElement)("div",{className:"astra-color-picker-wrap"},Object(n.createElement)(n.Fragment,null,o&&Object(n.createElement)("div",{className:"astra-popover-color",onClose:p},1<f.length&&Object(n.createElement)(A.TabPanel,{className:"astra-popover-tabs astra-background-tabs",activeClass:"active-tab",initialTabName:s,tabs:f},(function(t){var a;return t.name&&("gradient"===t.name&&(a=Object(n.createElement)(n.Fragment,null,Object(n.createElement)(A.__experimentalGradientPicker,{value:c&&c.includes("gradient")?c:"",onChange:function(t){return e.onChangeGradientComplete(t)}}))),"image"===t.name?a=e.renderImageSettings():"color"===t.name&&(a=Object(n.createElement)(n.Fragment,null,r&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(A.ColorPicker,{color:c,onChangeComplete:function(t){return e.onChangeComplete(t)}})),!r&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(A.ColorPicker,{color:c,onChangeComplete:function(t){return e.onChangeComplete(t)}})),Object(n.createElement)(A.ColorPalette,{colors:b,value:c,clearable:!1,disableCustomColors:!0,className:"ast-color-palette",onChange:function(t){return e.onPaletteChangeComplete(t)}})))),Object(n.createElement)("div",null,a)})),1===f.length&&Object(n.createElement)(n.Fragment,null,r&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(A.ColorPicker,{color:c,onChangeComplete:function(t){return e.onChangeComplete(t)}})),!r&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(A.ColorPicker,{color:c,onChangeComplete:function(t){return e.onChangeComplete(t)}})),Object(n.createElement)(A.ColorPalette,{colors:b,value:c,clearable:!1,disableCustomColors:!0,className:"ast-color-palette",onChange:function(t){return e.onPaletteChangeComplete(t)}}))))))}},{key:"onChangeGradientComplete",value:function(e){var t;t=void 0===e?"":e,this.setState({color:t}),this.setState({backgroundType:"gradient"}),this.props.onChangeComplete(t,"gradient")}},{key:"onChangeComplete",value:function(e){var t;t=void 0!==e.rgb&&void 0!==e.rgb.a&&1!==e.rgb.a?"rgba("+e.rgb.r+","+e.rgb.g+","+e.rgb.b+","+e.rgb.a+")":e.hex,this.setState({color:t}),this.setState({backgroundType:"color"}),this.props.onChangeComplete(e,"color")}},{key:"onPaletteChangeComplete",value:function(e){this.setState({color:e}),!0===this.state.refresh?this.setState({refresh:!1}):this.setState({refresh:!0}),this.props.onChangeComplete(e,"color")}},{key:"onSelectImage",value:function(e){this.setState({modalCanClose:!0}),this.setState({media:e}),this.setState({backgroundType:"image"}),this.props.onSelectImage(e,"image")}},{key:"onRemoveImage",value:function(){this.setState({modalCanClose:!0}),this.setState({media:""}),this.props.onSelectImage("")}},{key:"open",value:function(e){this.setState({modalCanClose:!1}),e()}},{key:"onChangeImageOptions",value:function(e,t,r){this.setState(R()({},e,r)),this.setState({backgroundType:"image"}),this.props.onChangeImageOptions(t,r,"image")}},{key:"toggleMoreSettings",value:function(){var e=event.target.parentElement.parentElement,t=e.querySelector(".more-settings"),r=e.querySelector(".media-position-setting"),n=t.dataset.direction;t.dataset.id;"down"===n?(t.setAttribute("data-direction","up"),e.querySelector(".message").innerHTML=Object(H.__)("Less Settings"),e.querySelector(".icon").innerHTML="↑"):(t.setAttribute("data-direction","down"),e.querySelector(".message").innerHTML=Object(H.__)("More Settings"),e.querySelector(".icon").innerHTML="↓"),r.classList.contains("hide-settings")?r.classList.remove("hide-settings"):r.classList.add("hide-settings")}},{key:"renderImageSettings",value:function(){var e=this,t=this.state,r=t.media,a=t.backgroundImage,o=t.backgroundPosition,i=t.backgroundAttachment,s=t.backgroundRepeat,c=t.backgroundSize;return Object(n.createElement)(n.Fragment,null,(r.url||a)&&Object(n.createElement)("img",{src:r.url?r.url:a,width:"200",height:"200"}),Object(n.createElement)(Oe.MediaUpload,{title:Object(H.__)("Select Background Image","astra"),onSelect:function(t){return e.onSelectImage(t)},allowedTypes:["image"],value:void 0!==r&&r?r:"",render:function(t){var o=t.open;return Object(n.createElement)(A.Button,{className:"upload-button button-add-media",isDefault:!0,onClick:function(){return e.open(o)}},r||a?Object(H.__)("Replace image","astra"):Object(H.__)("Select Background Image","astra"))}}),(r||a)&&Object(n.createElement)(n.Fragment,null,Object(n.createElement)(A.Button,{className:"ast-bg-img-remove",onClick:this.onRemoveImage,isLink:!0,isDestructive:!0},Object(H.__)("Remove Image","astra")),Object(n.createElement)("a",{href:"#",className:"more-settings",onClick:this.toggleMoreSettings,"data-direction":"down","data-id":"desktop"},Object(n.createElement)("span",{className:"message"}," ",Object(H.__)("More Settings")," "),Object(n.createElement)("span",{className:"icon"}," ↓ ")),Object(n.createElement)("div",{className:"media-position-setting hide-settings"},Object(n.createElement)(A.SelectControl,{label:Object(H.__)("Image Position"),value:o,onChange:function(t){return e.onChangeImageOptions("backgroundPosition","background-position",t)},options:[{value:"left top",label:Object(H.__)("Left Top","astra")},{value:"left center",label:Object(H.__)("Left Center","astra")},{value:"left bottom",label:Object(H.__)("Left Bottom","astra")},{value:"right top",label:Object(H.__)("Right Top","astra")},{value:"right center",label:Object(H.__)("Right Center","astra")},{value:"right bottom",label:Object(H.__)("Right Bottom","astra")},{value:"center top",label:Object(H.__)("Center Top","astra")},{value:"center center",label:Object(H.__)("Center Center","astra")},{value:"center bottom",label:Object(H.__)("Center Bottom","astra")}]}),Object(n.createElement)(A.SelectControl,{label:Object(H.__)("Attachment","astra"),value:i,onChange:function(t){return e.onChangeImageOptions("backgroundAttachment","background-attachment",t)},options:[{value:"fixed",label:Object(H.__)("Fixed","astra")},{value:"scroll",label:Object(H.__)("Scroll","astra")}]}),Object(n.createElement)(A.SelectControl,{label:Object(H.__)("Repeat","astra"),value:s,onChange:function(t){return e.onChangeImageOptions("backgroundRepeat","background-repeat",t)},options:[{value:"no-repeat",label:Object(H.__)("No Repeat","astra")},{value:"repeat",label:Object(H.__)("Repeat All","astra")},{value:"repeat-x",label:Object(H.__)("Repeat Horizontally","astra")},{value:"repeat-y",label:Object(H.__)("Repeat Vertically","astra")}]}),Object(n.createElement)(A.SelectControl,{label:Object(H.__)("Size","astra"),value:c,onChange:function(t){return e.onChangeImageOptions("backgroundSize","background-size",t)},options:[{value:"auto",label:Object(H.__)("Auto","astra")},{value:"cover",label:Object(H.__)("Cover","astra")},{value:"contain",label:Object(H.__)("Contain","astra")}]}))))}}]),r}(n.Component);je.propTypes={color:m.a.string,usePalette:m.a.bool,palette:m.a.string,presetColors:m.a.object,onChangeComplete:m.a.func,onPaletteChangeComplete:m.a.func,onChange:m.a.func,customizer:m.a.object};var _e=je;function Ce(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ke(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Ce(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ce(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function xe(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var ze=function(e){l()(r,e);var t=xe(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.defaultValue=n.props.control.params.default,n.onSelectImage=n.onSelectImage.bind(P()(n)),n.state={value:a},n.updateBackgroundType(),n}return s()(r,[{key:"updateBackgroundType",value:function(){var e=ke({},this.state.value);void 0!==this.state.value["background-type"]&&""!==this.state.value["background-type"]||(void 0!==this.state.value["background-color"]&&(e["background-type"]="color",this.updateValues(e),this.state.value["background-color"].includes("gradient")&&(e["background-type"]="gradient",this.updateValues(e))),void 0!==this.state.value["background-image"]&&(e["background-type"]="image",this.updateValues(e)))}},{key:"renderReset",value:function(){var e=this;return Object(n.createElement)("span",{className:"customize-control-title"},Object(n.createElement)(A.Button,{className:"reset astra-reset",disabled:JSON.stringify(this.state.value)===JSON.stringify(this.defaultValue),onClick:function(){var t=JSON.parse(JSON.stringify(e.defaultValue));e.updateValues(t)}},Object(n.createElement)(A.Dashicon,{icon:"image-rotate"})))}},{key:"onSelectImage",value:function(e,t){var r=ke({},this.state.value);r["background-media"]=e.id,r["background-image"]=e.url,r["background-type"]=t,this.updateValues(r)}},{key:"onChangeImageOptions",value:function(e,t,r){var n=ke({},this.state.value);n[e]=t,n["background-type"]=r,this.updateValues(n)}},{key:"renderSettings",value:function(){var e=this;return Object(n.createElement)(n.Fragment,null,Object(n.createElement)(_e,{color:void 0!==this.state.value["background-color"]&&this.state.value["background-color"]?this.state.value["background-color"]:"",onChangeComplete:function(t,r){return e.handleChangeComplete(t,r)},media:void 0!==this.state.value["background-media"]&&this.state.value["background-media"]?this.state.value["background-media"]:"",backgroundImage:void 0!==this.state.value["background-image"]&&this.state.value["background-image"]?this.state.value["background-image"]:"",backgroundAttachment:void 0!==this.state.value["background-attachment"]&&this.state.value["background-attachment"]?this.state.value["background-attachment"]:"",backgroundPosition:void 0!==this.state.value["background-position"]&&this.state.value["background-position"]?this.state.value["background-position"]:"",backgroundRepeat:void 0!==this.state.value["background-repeat"]&&this.state.value["background-repeat"]?this.state.value["background-repeat"]:"",backgroundSize:void 0!==this.state.value["background-size"]&&this.state.value["background-size"]?this.state.value["background-size"]:"",onSelectImage:function(t,r){return e.onSelectImage(t,r)},onChangeImageOptions:function(t,r,n){return e.onChangeImageOptions(t,r,n)},backgroundType:void 0!==this.state.value["background-type"]&&this.state.value["background-type"]?this.state.value["background-type"]:"color",allowGradient:!0,allowImage:!0}))}},{key:"handleChangeComplete",value:function(e,t){var r;r="string"==typeof e||e instanceof String?e:void 0!==e.rgb&&void 0!==e.rgb.a&&1!==e.rgb.a?"rgba("+e.rgb.r+","+e.rgb.g+","+e.rgb.b+","+e.rgb.a+")":e.hex;var n=ke({},this.state.value);n["background-color"]=r,n["background-type"]=t,this.updateValues(n)}},{key:"render",value:function(){var e,t=this.props.control.params,r=t.defaultValue,a=t.label,o=t.description,i="#RRGGBB",s=null,c=null;return r&&(i="#"!==r.substring(0,1)?"#"+r:r,defaultValueAttr=" data-default-color="+i),s=a&&""!==a&&void 0!==a?Object(n.createElement)("span",{className:"customize-control-title"},a):Object(n.createElement)("span",{className:"customize-control-title"},Object(H.__)("Background","astra")),o&&(c=Object(n.createElement)("span",{className:"description customize-control-description"},o)),e=Object(n.createElement)("div",{className:"background-wrapper"},Object(n.createElement)("div",{className:"background-container"},this.renderReset(),this.renderSettings())),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,s,c),Object(n.createElement)("div",{className:"customize-control-content"},e))}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(n.Component);ze.propTypes={control:m.a.object.isRequired};var Se=ze;function Me(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Ne(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Me(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Me(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Re(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var De=function(e){l()(r,e);var t=Re(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.defaultValue=n.props.control.params.default,n.onSelectImage=n.onSelectImage.bind(P()(n)),n.state={value:a},n}return s()(r,[{key:"componentDidMount",value:function(){for(var e=0,t=["desktop","mobile","tablet"];e<t.length;e++){var r=t[e];this.updateBackgroundType(r)}}},{key:"updateBackgroundType",value:function(e){var t=Ne({},this.state.value);if(void 0===this.state.value[e]["background-type"]||""===this.state.value[e]["background-type"]){var r=Ne({},t[e]);void 0!==this.state.value[e]["background-color"]&&(r["background-type"]="color",t[e]=r,this.updateValues(t),this.state.value[e]["background-color"].includes("gradient")&&(r["background-type"]="gradient",t[e]=r,this.updateValues(t))),void 0!==this.state.value[e]["background-image"]&&(r["background-type"]="image",t[e]=r,this.updateValues(t))}}},{key:"renderReset",value:function(e){var t=this;return Object(n.createElement)("span",{className:"customize-control-title"},Object(n.createElement)(n.Fragment,null,Object(n.createElement)(A.Button,{className:"reset astra-reset",disabled:JSON.stringify(this.state.value)===JSON.stringify(this.defaultValue),onClick:function(){var e=JSON.parse(JSON.stringify(t.defaultValue));t.updateValues(e)}},Object(n.createElement)(A.Dashicon,{icon:"image-rotate"}))))}},{key:"onSelectImage",value:function(e,t,r){var n=Ne({},this.state.value),a=Ne({},n[t]);a["background-image"]=e.url,a["background-media"]=e.id,a["background-type"]=r,n[t]=a,this.updateValues(n)}},{key:"onChangeImageOptions",value:function(e,t,r,n){var a=Ne({},this.state.value),o=Ne({},a[r]);o[e]=t,o["background-type"]=n,a[r]=o,this.updateValues(a)}},{key:"renderSettings",value:function(e){var t=this;return Object(n.createElement)(n.Fragment,null,Object(n.createElement)(_e,{color:void 0!==this.state.value[e]["background-color"]&&this.state.value[e]["background-color"]?this.state.value[e]["background-color"]:"",onChangeComplete:function(r,n){return t.handleChangeComplete(r,e,n)},media:void 0!==this.state.value[e]["background-media"]&&this.state.value[e]["background-media"]?this.state.value[e]["background-media"]:"",backgroundImage:void 0!==this.state.value[e]["background-image"]&&this.state.value[e]["background-image"]?this.state.value[e]["background-image"]:"",backgroundAttachment:void 0!==this.state.value[e]["background-attachment"]&&this.state.value[e]["background-attachment"]?this.state.value[e]["background-attachment"]:"",backgroundPosition:void 0!==this.state.value[e]["background-position"]&&this.state.value[e]["background-position"]?this.state.value[e]["background-position"]:"",backgroundRepeat:void 0!==this.state.value[e]["background-repeat"]&&this.state.value[e]["background-repeat"]?this.state.value[e]["background-repeat"]:"",backgroundSize:void 0!==this.state.value[e]["background-size"]&&this.state.value[e]["background-size"]?this.state.value[e]["background-size"]:"",onSelectImage:function(r,n){return t.onSelectImage(r,e,n)},onChangeImageOptions:function(r,n,a){return t.onChangeImageOptions(r,n,e,a)},backgroundType:void 0!==this.state.value[e]["background-type"]&&this.state.value[e]["background-type"]?this.state.value[e]["background-type"]:"color",allowGradient:!0,allowImage:!0}))}},{key:"handleChangeComplete",value:function(e,t,r){var n;n="string"==typeof e||e instanceof String?e:void 0!==e.rgb&&void 0!==e.rgb.a&&1!==e.rgb.a?"rgba("+e.rgb.r+","+e.rgb.g+","+e.rgb.b+","+e.rgb.a+")":e.hex;var a=Ne({},this.state.value),o=Ne({},a[t]);o["background-color"]=n,o["background-type"]=r,a[t]=o,this.updateValues(a)}},{key:"render",value:function(){var e,t,r=this.props.control.params,a=r.defaultValue,o=r.label,i=r.description,s="#RRGGBB",c=null,l=null;return a&&(s="#"!==a.substring(0,1)?"#"+a:a,defaultValueAttr=" data-default-color="+s),c=o&&""!==o&&void 0!==o?Object(n.createElement)("span",{className:"customize-control-title"},o):Object(n.createElement)("span",{className:"customize-control-title"},Object(H.__)("Background","astra")),i&&(l=Object(n.createElement)("span",{className:"description customize-control-description"},i)),e=Object(n.createElement)("ul",{className:"ast-responsive-btns"},Object(n.createElement)("li",{className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"})))),t=Object(n.createElement)("div",{className:"background-wrapper"},Object(n.createElement)("div",{className:"background-container desktop active"},this.renderReset("desktop"),this.renderSettings("desktop")),Object(n.createElement)("div",{className:"background-container tablet"},this.renderReset("tablet"),this.renderSettings("tablet")),Object(n.createElement)("div",{className:"background-container mobile"},this.renderReset("mobile"),this.renderSettings("mobile"))),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,c,l),Object(n.createElement)("div",{className:"customize-control-content"},e,t))}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(n.Component);De.propTypes={control:m.a.object.isRequired};var Pe=De;function He(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var Ae=function(e){l()(r,e);var t=He(r);function r(e){var n;o()(this,r),(n=t.call(this,e)).handleChangeComplete=n.handleChangeComplete.bind(P()(n)),n.updateValues=n.updateValues.bind(P()(n)),n.renderReset=n.renderReset.bind(P()(n));var a=n.props.control.setting.get();return n.defaultValue=n.props.control.params.default,n.state={value:a},n}return s()(r,[{key:"renderReset",value:function(){var e=this;return Object(n.createElement)("span",{className:"customize-control-title"},Object(n.createElement)(n.Fragment,null,Object(n.createElement)(A.Button,{className:"reset astra-reset",disabled:JSON.stringify(this.state.value)===JSON.stringify(this.defaultValue),onClick:function(){var t=JSON.parse(JSON.stringify(e.defaultValue));e.updateValues(t)}},Object(n.createElement)(A.Dashicon,{icon:"image-rotate"}))))}},{key:"handleChangeComplete",value:function(e){var t;t="string"==typeof e||e instanceof String?e:void 0!==e.rgb&&void 0!==e.rgb.a&&1!==e.rgb.a?"rgba("+e.rgb.r+","+e.rgb.g+","+e.rgb.b+","+e.rgb.a+")":e.hex,this.updateValues(t)}},{key:"render",value:function(){var e=this,t=null,r=this.props.control.params.label;return r&&(t=Object(n.createElement)("span",{className:"customize-control-title"},r)),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,t),Object(n.createElement)("div",{className:"ast-color-picker-alpha color-picker-hex"},this.renderReset(),Object(n.createElement)(_e,{color:void 0!==this.state.value&&this.state.value?this.state.value:"",onChangeComplete:function(t,r){return e.handleChangeComplete(t)},backgroundType:"color",allowGradient:!1,allowImage:!1})))}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(n.Component);Ae.propTypes={control:m.a.object.isRequired};var Te=Ae;function Ve(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Le(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var Be=function(e){l()(r,e);var t=Le(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.defaultValue=n.props.control.params.default,n.state={value:a},n}return s()(r,[{key:"renderReset",value:function(e){var t=this;return Object(n.createElement)("span",{className:"customize-control-title"},Object(n.createElement)(A.Button,{className:"reset astra-reset",disabled:JSON.stringify(this.state.value)===JSON.stringify(this.defaultValue),onClick:function(){var e=JSON.parse(JSON.stringify(t.defaultValue));t.setState({value:e}),t.props.control.setting.set(e)}},Object(n.createElement)(A.Dashicon,{icon:"image-rotate"})))}},{key:"renderSettings",value:function(e){var t=this;return Object(n.createElement)(_e,{color:void 0!==this.state.value[e]&&this.state.value[e]?this.state.value[e]:"",onChangeComplete:function(r,n){return t.handleChangeComplete(r,e)},backgroundType:"color",allowGradient:!1,allowImage:!1})}},{key:"handleChangeComplete",value:function(e,t){var r;r="string"==typeof e||e instanceof String?e:void 0!==e.rgb&&void 0!==e.rgb.a&&1!==e.rgb.a?"rgba("+e.rgb.r+","+e.rgb.g+","+e.rgb.b+","+e.rgb.a+")":e.hex,this.updateValues(r,t)}},{key:"render",value:function(){var e=this.props.control.params,t=e.defaultValue,r=e.label,a=e.description,o=e.responsive,i=(e.value,"#RRGGBB"),s=null,c=null,l=null,u=null;return t&&(i="#"!==t.substring(0,1)?"#"+t:t,defaultValueAttr=" data-default-color="+i),r&&(s=Object(n.createElement)("span",{className:"customize-control-title"},r)),a&&(c=Object(n.createElement)("span",{className:"description customize-control-description"},a)),o&&(l=Object(n.createElement)("ul",{className:"ast-responsive-btns"},Object(n.createElement)("li",{className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"})))),u=Object(n.createElement)(n.Fragment,null,Object(n.createElement)("div",{className:"ast-color-picker-alpha color-picker-hex ast-responsive-color desktop active"},this.renderReset("desktop"),this.renderSettings("desktop")),Object(n.createElement)("div",{className:"ast-color-picker-alpha color-picker-hex ast-responsive-color tablet"},this.renderReset("tablet"),this.renderSettings("tablet")),Object(n.createElement)("div",{className:"ast-color-picker-alpha color-picker-hex ast-responsive-color mobile"},this.renderReset("mobile"),this.renderSettings("mobile")))),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,s,c),l,Object(n.createElement)("div",{className:"customize-control-content"},u))}},{key:"updateValues",value:function(e,t){var r=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Ve(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ve(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},this.state.value);r[t]=e,this.setState({value:r}),this.props.control.setting.set(r)}}]),r}(n.Component);Be.propTypes={control:m.a.object.isRequired};var Ie=Be;function qe(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var Ue=function(e){l()(r,e);var t=qe(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.state={value:a},n.onSelectChange=n.onSelectChange.bind(P()(n)),n}return s()(r,[{key:"onSelectChange",value:function(){this.updateValues(event.target.value)}},{key:"render",value:function(){var e=this,t=this.props.control.params,r=t.label,a=t.name,o=t.choices,i=null;r&&(i=Object(n.createElement)("span",{className:"customize-control-title"},r));var s=Object.entries(o).map((function(e){return Object(n.createElement)("option",{key:e[0],value:e[0]},e[1])}));return Object(n.createElement)(n.Fragment,null,i,Object(n.createElement)("div",{className:"customize-control-content"},Object(n.createElement)("select",{className:"ast-select-input","data-name":a,"data-value":this.state.value,value:this.state.value,onChange:function(){e.onSelectChange()}},s)))}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(n.Component);Ue.propTypes={control:m.a.object.isRequired};var Fe=Ue;function Qe(e,t){jQuery("html").addClass("responsive-background-img-ready");var r=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive-background .customize-control-content .background-container").removeClass("active"),jQuery(".customize-control-ast-responsive-background .customize-control-content .background-container."+r).addClass("active"),jQuery(".customize-control-ast-responsive-background .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-background .ast-responsive-btns li."+r).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var e=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive-background .customize-control-content .background-container").removeClass("active"),jQuery(".customize-control-ast-responsive-background .customize-control-content .background-container."+e).addClass("active"),jQuery(".customize-control-ast-responsive-background .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-background .ast-responsive-btns li."+e).addClass("active")})),e.container.find(".ast-responsive-btns button").on("click",(function(e){var t=jQuery(this).attr("data-device");t="desktop"==t?"tablet":"tablet"==t?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+t+'"]').trigger("click")})),t&&jQuery(document).mouseup((function(e){var r=jQuery(t);r.is(e.target)||0!==r.has(e.target).length||r.find(".components-button.astra-color-icon-indicate.open").click()}))}function Ye(e,t){jQuery("html").addClass("responsive-background-color-ready");var r=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive-color .customize-control-content .ast-color-picker-alpha").removeClass("active"),jQuery(".customize-control-ast-responsive-color .customize-control-content .ast-color-picker-alpha."+r).addClass("active"),jQuery(".customize-control-ast-responsive-color .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-color .ast-responsive-btns li."+r).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var e=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive-color .customize-control-content .ast-color-picker-alpha").removeClass("active"),jQuery(".customize-control-ast-responsive-color .customize-control-content .ast-responsive-color."+e).addClass("active"),jQuery(".customize-control-ast-responsive-color .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-color .ast-responsive-btns li."+e).addClass("active")})),e.container.find(".ast-responsive-btns button").on("click",(function(e){var t=jQuery(this).attr("data-device");t="desktop"==t?"tablet":"tablet"==t?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+t+'"]').trigger("click")})),t&&jQuery(document).mouseup((function(e){var r=jQuery(t);r.is(e.target)||0!==r.has(e.target).length||r.find(".components-button.astra-color-icon-indicate.open").click()}))}function Ge(e){var t=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive .input-wrapper input").removeClass("active"),jQuery(".customize-control-ast-responsive .input-wrapper input."+t).addClass("active"),jQuery(".customize-control-ast-responsive .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive .ast-responsive-btns li."+t).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var e=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive .input-wrapper input, .customize-control .ast-responsive-btns > li").removeClass("active"),jQuery(".customize-control-ast-responsive .input-wrapper input."+e+", .customize-control .ast-responsive-btns > li."+e).addClass("active")})),e.container.find(".ast-responsive-btns button").on("click",(function(e){var t=jQuery(this).attr("data-device");t="desktop"==t?"tablet":"tablet"==t?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+t+'"]').trigger("click")}))}function We(e){var t=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive-slider .input-field-wrapper").removeClass("active"),jQuery(".customize-control-ast-responsive-slider .input-field-wrapper."+t).addClass("active"),jQuery(".customize-control-ast-responsive-slider .ast-responsive-slider-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-slider .ast-responsive-slider-btns li."+t).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var e=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive-slider .input-field-wrapper, .customize-control .ast-responsive-slider-btns > li").removeClass("active"),jQuery(".customize-control-ast-responsive-slider .input-field-wrapper."+e+", .customize-control .ast-responsive-slider-btns > li."+e).addClass("active")})),e.container.find(".ast-responsive-slider-btns button").on("click",(function(e){var t=jQuery(this).attr("data-device");t="desktop"==t?"tablet":"tablet"==t?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+t+'"]').trigger("click")}))}function Xe(e){var t=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper").removeClass("active"),jQuery(".customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper."+t).addClass("active"),jQuery(".customize-control-ast-responsive-spacing .ast-spacing-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-spacing .ast-spacing-responsive-btns li."+t).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var e=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper, .customize-control .ast-spacing-responsive-btns > li").removeClass("active"),jQuery(".customize-control-ast-responsive-spacing .input-wrapper .ast-spacing-wrapper."+e+", .customize-control .ast-spacing-responsive-btns > li."+e).addClass("active")})),e.container.find(".ast-spacing-responsive-btns button").on("click",(function(e){var t=jQuery(this).attr("data-device");t="desktop"==t?"tablet":"tablet"==t?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+t+'"]').trigger("click")}))}var Je=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(X,{control:this}),this.container[0])},ready:function(){this.setting._value;this.registerToggleEvents(),this.container.on("ast_settings_changed",this.onOptionChange);var e=0,t=jQuery(".wp-full-overlay-sidebar-content"),r=navigator.userAgent.toLowerCase();if(r.indexOf("firefox")>-1)n=16;else var n=6;jQuery("#customize-controls .wp-full-overlay-sidebar-content .control-section").on("scroll",(function(a){var o=jQuery(this);if(o.hasClass("open")){var i=o.find(".customize-section-title"),s=o.scrollTop();if(s>e)i.removeClass("maybe-sticky").removeClass("is-in-view").removeClass("is-sticky"),o.css("padding-top","");else{var c=o.outerWidth();i.addClass("maybe-sticky").addClass("is-in-view").addClass("is-sticky").width(c-n).css("top",t.css("top")),r.indexOf("firefox")>-1||o.css("padding-top",i.height()),0===s&&(i.removeClass("maybe-sticky").removeClass("is-in-view").removeClass("is-sticky"),o.css("padding-top",""))}e=s}}))},registerToggleEvents:function(){var e=this;jQuery(".wp-full-overlay-sidebar-content, .wp-picker-container").click((function(e){jQuery(e.target).closest(".ast-field-settings-modal").length||jQuery(".ast-adv-toggle-icon.open").trigger("click")})),e.container.on("click",".ast-toggle-desc-wrap .ast-adv-toggle-icon",(function(t){t.preventDefault(),t.stopPropagation();var r=jQuery(this),n=r.closest(".customize-control-ast-settings-group"),a=n.find(".ast-field-settings-modal").data("loaded"),o=n.parents(".control-section");if(r.hasClass("open"))n.find(".ast-field-settings-modal").hide();else{var i=o.find(".ast-adv-toggle-icon.open");if(i.length>0&&i.trigger("click"),a)n.find(".ast-field-settings-modal").show();else{var s=e.params.ast_fields,c=jQuery(astra.customizer.group_modal_tmpl);n.find(".ast-field-settings-wrap").append(c),n.find(".ast-fields-wrap").attr("data-control",e.params.name),e.ast_render_field(n,s,e),n.find(".ast-field-settings-modal").show();var l=jQuery("#customize-footer-actions .active").attr("data-device");"mobile"==l?(jQuery(".ast-responsive-btns .mobile, .ast-responsive-slider-btns .mobile").addClass("active"),jQuery(".ast-responsive-btns .preview-mobile, .ast-responsive-slider-btns .preview-mobile").addClass("active")):"tablet"==l?(jQuery(".ast-responsive-btns .tablet, .ast-responsive-slider-btns .tablet").addClass("active"),jQuery(".ast-responsive-btns .preview-tablet, .ast-responsive-slider-btns .preview-tablet").addClass("active")):(jQuery(".ast-responsive-btns .desktop, .ast-responsive-slider-btns .desktop").addClass("active"),jQuery(".ast-responsive-btns .preview-desktop, .ast-responsive-slider-btns .preview-desktop").addClass("active"))}}r.toggleClass("open")})),e.container.on("click",".ast-toggle-desc-wrap > .customizer-text",(function(e){e.preventDefault(),e.stopPropagation(),jQuery(this).find(".ast-adv-toggle-icon").trigger("click")}))},ast_render_field:function(e,t,r){var n=this,a=e.find(".ast-fields-wrap"),o="",i=[],s=n.isJsonString(r.params.value)?JSON.parse(r.params.value):{};if(void 0!==t.tabs){var c=(c=r.params.name.replace("[","-")).replace("]","");o+='<div id="'+c+'-tabs" class="ast-group-tabs">',o+='<ul class="ast-group-list">';var l=0;_.each(t.tabs,(function(e,t){var r="";0==l&&(r="active"),o+='<li class="'+r+'"><a href="#tab-'+t+'"><span>'+t+"</span></a></li>",l++})),o+="</ul>",o+='<div class="ast-tab-content" >',_.each(t.tabs,(function(e,t){o+='<div id="tab-'+t+'" class="tab">';var r=n.generateFieldHtml(e,s);o+=r.html,_.each(r.controls,(function(e,t){i.push({key:e.key,value:e.value,name:e.name})})),o+="</div>"})),o+="</div></div>",a.html(o),n.renderReactControl(t,n),jQuery("#"+c+"-tabs").tabs()}else{var u=n.generateFieldHtml(t,s);o+=u.html,_.each(u.controls,(function(e,t){i.push({key:e.key,value:e.value,name:e.name})})),a.html(o),n.renderReactControl(t,n)}_.each(i,(function(e,t){switch(e.key){case"ast-color":!function(e){jQuery(document).mouseup((function(t){var r=jQuery(e);r.is(t.target)||0!==r.has(t.target).length||r.find(".components-button.astra-color-icon-indicate.open").click()}))}("#customize-control-"+e.name);break;case"ast-responsive-background":Qe(n,"#customize-control-"+e.name);break;case"ast-responsive-color":Ye(n,"#customize-control-"+e.name);break;case"ast-responsive":Ge(n);break;case"ast-responsive-slider":We(n);break;case"ast-responsive-spacing":Xe(n);break;case"ast-font":var r=astra.customizer.settings.google_fonts;n.container.find(".ast-font-family").html(r),n.container.find(".ast-font-family").each((function(){var e=jQuery(this).data("value");jQuery(this).val(e);var t=jQuery(this).data("name");jQuery("select[data-name='"+t+"'] option[value='inherit']").text(jQuery(this).data("inherit"));var r=jQuery(".ast-font-weight[data-connected-control='"+t+"']"),a=AstTypography._getWeightObject(AstTypography._cleanGoogleFonts(e));n.generateDropdownHtml(a,r),r.val(r.data("value"))})),n.container.find(".ast-font-family").selectWoo(),n.container.find(".ast-font-family").on("select2:select",(function(){var e=jQuery(this).val(),t=AstTypography._getWeightObject(AstTypography._cleanGoogleFonts(e)),r=jQuery(this).data("name"),a=jQuery(".ast-font-weight[data-connected-control='"+r+"']");n.generateDropdownHtml(t,a);var o=jQuery(this).parents(".customize-control").attr("id");o=o.replace("customize-control-",""),n.container.trigger("ast_settings_changed",[n,jQuery(this),e,o]);var i=a.parents(".customize-control").attr("id");i=i.replace("customize-control-",""),n.container.trigger("ast_settings_changed",[n,a,a.val(),i])})),n.container.find(".ast-font-weight").on("change",(function(){var e=jQuery(this).val();name=jQuery(this).parents(".customize-control").attr("id"),name=name.replace("customize-control-",""),n.container.trigger("ast_settings_changed",[n,jQuery(this),e,name])}))}})),e.find(".ast-field-settings-modal").data("loaded",!0)},getJS:function(e){},generateFieldHtml:function(e,t){var r="",n=[];_.each(e,(function(e,t){var a=wp.customize.control("astra-settings["+e.name+"]")?wp.customize.control("astra-settings["+e.name+"]").params.value:"",o=e.control,i="customize-control-"+o+"-content",s=wp.template(i),c=a||e.default;e.value=c;var l="",u="";if(e.label=e.title,_.each(e.data_attrs,(function(e,t){l+=" data-"+t+" ='"+e+"'"})),_.each(e.input_attrs,(function(e,t){u+=t+'="'+e+'" '})),e.dataAttrs=l,e.inputAttrs=u,n.push({key:o,value:c,name:e.name}),"ast-responsive"==o){var h=void 0===e.responsive||e.responsive;e.responsive=h}var p=e.name.replace("[","-");p=p.replace("]",""),r+="<li id='customize-control-"+p+"' class='customize-control customize-control-"+e.control+"' >",r+=s(e),r+="</li>"}));var a=new Object;return a.controls=n,a.html=r,a},generateDropdownHtml:function(e,t){var r=t.data("inherit"),n="",a=0,o=(e=jQuery.merge(["inherit"],e),t.val()||"400"),i="";for(astraTypo.inherit=r;a<e.length;a++)0===a&&-1===jQuery.inArray(o,e)?(o=e[0],i=' selected="selected"'):i=e[a]==o?' selected="selected"':"",e[a].includes("italic")||(n+='<option value="'+e[a]+'"'+i+">"+astraTypo[e[a]]+"</option>");t.html(n)},onOptionChange:function(e,t,r,n,a){jQuery(".hidden-field-astra-settings-"+a).val(n),wp.customize.control("astra-settings["+a+"]").setting.set(n)},isJsonString:function(e){try{JSON.parse(e)}catch(e){return!1}return!0},getFinalControlObject:function(e,t){return void 0!==e.choices&&void 0===t.params.choices&&(t.params.choices=e.choices),void 0!==e.inputAttrs&&void 0===t.params.inputAttrs&&(t.params.inputAttrs=e.inputAttrs),void 0!==e.link&&void 0===t.params.link&&(t.params.link=e.link),void 0!==e.units&&void 0===t.params.units&&(t.params.units=e.units),void 0!==e.linked_choices&&void 0===t.params.linked_choices&&(t.params.linked_choices=e.linked_choices),void 0===e.title||void 0!==t.params.label&&""!==t.params.label&&null!==t.params.label||(t.params.label=e.title),void 0===e.responsive||void 0!==t.params.responsive&&""!==t.params.responsive&&null!==t.params.responsive||(t.params.responsive=e.responsive),t},renderReactControl:function(e,t){var r={"ast-background":Se,"ast-responsive-background":Pe,"ast-responsive-color":Ie,"ast-color":Te,"ast-border":te,"ast-responsive":ie,"ast-responsive-slider":ue,"ast-slider":ge,"ast-responsive-spacing":me,"ast-select":Fe};void 0!==e.tabs?_.each(e.tabs,(function(e,a){_.each(e,(function(e,a){if("ast-font"!==e.control){var o=e.name.replace("[","-"),i="#customize-control-"+(o=o.replace("]","")),s=wp.customize.control("astra-settings["+e.name+"]");s=t.getFinalControlObject(e,s);var c=r[e.control];ReactDOM.render(Object(n.createElement)(c,{control:s,customizer:wp.customize}),jQuery(i)[0])}}))})):_.each(e,(function(e,a){if("ast-font"!==e.control){var o=e.name.replace("[","-"),i="#customize-control-"+(o=o.replace("]","")),s=wp.customize.control("astra-settings["+e.name+"]");s=t.getFinalControlObject(e,s);var c=r[e.control];ReactDOM.render(Object(n.createElement)(c,{control:s,customizer:wp.customize}),jQuery(i)[0])}}))}}),Ze=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Te,{control:this,customizer:wp.customize}),this.container[0])},ready:function(){var e=this;jQuery(document).mouseup((function(t){var r=jQuery(e.container);r.is(t.target)||0!==r.has(t.target).length||r.find(".components-button.astra-color-icon-indicate.open").click()}))}}),Ke=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Ie,{control:this,customizer:wp.customize}),this.container[0])},ready:function(){Ye(this);var e=this;jQuery(document).mouseup((function(t){var r=jQuery(e.container);r.is(t.target)||0!==r.has(t.target).length||r.find(".components-button.astra-color-icon-indicate.open").click()}))}}),$e=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Pe,{control:this}),this.container[0])},ready:function(){Qe(this,"");var e=this;jQuery(document).mouseup((function(t){var r=jQuery(e.container);r.is(t.target)||0!==r.has(t.target).length||r.find(".components-button.astra-color-icon-indicate.open").click()}))}}),et=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Se,{control:this}),this.container[0])},ready:function(){jQuery("html").addClass("background-colorpicker-ready")}});function tt(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var rt=function(e){l()(r,e);var t=tt(r);function r(){return o()(this,r),t.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var e,t,r=null,a=null,o=this.props.control.params,i=o.label,s=o.description,c=o.value,l=o.choices,u=o.inputAttrs;return i&&(r=Object(n.createElement)("span",{className:"customize-control-title"},i)),s&&(a=Object(n.createElement)("span",{className:"description customize-control-description"},s)),e=Object.values(c).map((function(e){if(l[e])var t=Object(n.createElement)("li",Z()({},u,{key:e,className:"ast-sortable-item","data-value":e}),Object(n.createElement)("i",{className:"dashicons dashicons-menu"}),Object(n.createElement)("i",{className:"dashicons dashicons-visibility visibility"}),l[e]);return t})),t=Object.keys(l).map((function(e){if(Array.isArray(c)&&-1===c.indexOf(e))var t=Object(n.createElement)("li",Z()({},u,{key:e,className:"ast-sortable-item invisible","data-value":e}),Object(n.createElement)("i",{className:"dashicons dashicons-menu"}),Object(n.createElement)("i",{className:"dashicons dashicons-visibility visibility"}),l[e]);return t})),Object(n.createElement)("label",{className:"ast-sortable"},r,a,Object(n.createElement)("ul",{className:"sortable"},e,t))}}]),r}(n.Component);rt.propTypes={control:m.a.object.isRequired};var nt=rt,at=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(nt,{control:this}),this.container[0])},ready:function(){var e=this;e.sortableContainer=e.container.find("ul.sortable").first(),e.sortableContainer.sortable({stop:function(){e.updateValue()}}).disableSelection().find("li").each((function(){jQuery(this).find("i.visibility").click((function(){jQuery(this).toggleClass("dashicons-visibility-faint").parents("li:eq(0)").toggleClass("invisible")}))})).click((function(){e.updateValue()}))},updateValue:function(){var e=[];this.sortableContainer.find("li").each((function(){jQuery(this).is(".invisible")||e.push(jQuery(this).data("value"))})),this.setting.set(e)}}),ot=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(te,{control:this}),this.container[0])}});function it(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var st=function(e){l()(r,e);var t=it(r);function r(e){var n;return o()(this,r),(n=t.call(this,e)).onLinkClick=n.onLinkClick.bind(P()(n)),n}return s()(r,[{key:"onLinkClick",value:function(){var e=event.target.parentElement.dataset.customizerLinked;switch(event.target.parentElement.dataset.astCustomizerLinkType){case"section":section=wp.customize.section(e),section.expand();break;case"control":wp.customize.control(e).focus()}}},{key:"render",value:function(){var e=this,t=this.props.control.params,r=t.linked,a=t.link_text,o=t.link_type,i=null;return r&&a&&(i=Object(n.createElement)("a",{href:"#",onClick:function(){e.onLinkClick()},className:"customizer-link","data-customizer-linked":r,"data-ast-customizer-link-type":o,dangerouslySetInnerHTML:{__html:a}})),Object(n.createElement)(n.Fragment,null,i)}}]),r}(n.Component);st.propTypes={control:m.a.object.isRequired};var ct=st,lt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(ct,{control:this}),this.container[0])}}),ut=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(ie,{control:this}),this.container[0])},ready:function(){Ge(this)}}),ht=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(ue,{control:this}),this.container[0])},ready:function(){We(this)}}),pt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(ge,{control:this}),this.container[0])}}),dt=r(17),ft=r.n(dt);function mt(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var vt=function(e){l()(r,e);var t=mt(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.state={value:a},n.onLayoutChange=n.onLayoutChange.bind(P()(n)),n}return s()(r,[{key:"onLayoutChange",value:function(){this.setState({value:event.target.value}),this.props.control.setting.set(event.target.value)}},{key:"render",value:function(){var e,t=this,r=this.props.control.params,a=r.label,o=r.description,i=r.id,s=r.choices,c=r.inputAttrs,l=r.choices_titles,u=r.link,h=r.labelStyle,p=null,d=null,f=[];return a&&(p=Object(n.createElement)("span",{className:"customize-control-title"},a)),o&&(d=Object(n.createElement)("span",{className:"description customize-control-description"},o)),c&&void 0!==c&&c.split(" ").map((function(e,t){var r=e.split("=");void 0!==r[1]&&(f[r[0]]=r[1].replace(/"/g,""))})),u&&void 0!==u&&u.split(" ").map((function(e,t){var r=e.split("=");void 0!==r[1]&&(f[r[0]]=r[1].replace(/"/g,""))})),e=Object.entries(s).map((function(e){var r=ft()(e,2),a=r[0],o=(r[1],t.state.value===a);return Object(n.createElement)(n.Fragment,{key:a},Object(n.createElement)("input",Z()({},f,{className:"image-select",type:"radio",value:a,name:"_customize-radio-".concat(i),id:i+a,checked:o,onChange:function(){return t.onLayoutChange(a)}})),Object(n.createElement)("label",Z()({htmlFor:i+a},h,{className:"ast-radio-img-svg"}),Object(n.createElement)("span",{dangerouslySetInnerHTML:{__html:s[a]}}),Object(n.createElement)("span",{className:"image-clickable",title:l[a]})))})),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",{className:"customizer-text"},p,d),Object(n.createElement)("div",{id:"input_".concat(i),className:"image"},e))}}]),r}(n.Component);vt.propTypes={control:m.a.object.isRequired};var bt=vt,gt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(bt,{control:this}),this.container[0])}}),yt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(me,{control:this}),this.container[0])},ready:function(){Xe(this)}}),wt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Fe,{control:this}),this.container[0])}});function Ot(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var Et=function(e){l()(r,e);var t=Ot(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.state={value:a},n}return s()(r,[{key:"render",value:function(){var e=this.props.control.params,t=e.description,r=e.label,a=e.connect,o=e.variant,i=e.name,s=e.link,c=null,l=null,u=null,h=[],p=Object(H.__)("Inherit","astra");(r&&(c=Object(n.createElement)("span",{className:"customize-control-title"},r)),t&&(l=Object(n.createElement)("span",{className:"description customize-control-description"},t)),void 0!==s)&&s.split(" ").map((function(e,t){var r=e.split("=");void 0!==r[1]&&(h[r[0]]=r[1].replace(/"/g,""))}));return a&&(u=Object(n.createElement)("select",Z()({},h,{"data-connected-control":a,"data-value":this.state.value,"data-name":i,"data-inherit":p}))),o&&(u=Object(n.createElement)("select",Z()({},h,{"data-connected-variant":o,"data-value":this.state.value,"data-name":i,"data-inherit":p}))),a&&o&&(u=Object(n.createElement)("select",Z()({},h,{"data-connected-control":a,"data-connected-variant":o,"data-value":this.state.value,"data-name":i,"data-inherit":p}))),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,c,l),u)}}]),r}(n.Component);Et.propTypes={control:m.a.object.isRequired};var jt=Et,_t=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(jt,{control:this}),this.container[0])},ready:function(){AstTypography.init()}});function Ct(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var kt=function(e){l()(r,e);var t=Ct(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return void 0!==a&&""!==a||(a=[]),n.state={value:a},n}return s()(r,[{key:"render",value:function(){var e=this.props.control.params,t=e.description,r=e.label,a=e.connect,o=e.variant,i=e.name,s=e.link,c=e.ast_all_font_weight,l=null,u=null,h=null,p=[],d=Object(H.__)("Inherit","astra"),f=null;(r&&(l=Object(n.createElement)("span",{className:"customize-control-title"},r)),t&&(u=Object(n.createElement)("span",{className:"description customize-control-description"},t)),void 0!==s)&&s.split(" ").map((function(e,t){var r=e.split("=");void 0!==r[1]&&(p[r[0]]=r[1].replace(/"/g,""))}));var m=Object.entries(c).map((function(e){return Object(n.createElement)("option",{key:e[0],value:e[0]},e[1])}));return f="normal"===this.state.value?Object(n.createElement)("option",{key:"normal",value:"normal"},d):Object(n.createElement)("option",{key:"inherit",value:"inherit"},d),a&&(h=Object(n.createElement)("select",Z()({},p,{"data-connected-control":a,"data-value":this.state.value,"data-name":i,"data-inherit":d}),f,m)),o&&(h=Object(n.createElement)("select",Z()({},p,{"data-connected-variant":o,"data-value":this.state.value,"data-name":i,"data-inherit":d}),f,m)),a&&o&&(h=Object(n.createElement)("select",Z()({},p,{"data-connected-control":a,"data-connected-variant":o,"data-value":this.state.value,"data-name":i,"data-inherit":d}),f,m)),Object(n.createElement)(n.Fragment,null,Object(n.createElement)("label",null,l,u),h)}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(n.Component);kt.propTypes={control:m.a.object.isRequired};var xt=kt,zt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(xt,{control:this}),this.container[0])},ready:function(){AstTypography.init()}});function St(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Mt(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var Nt=function(e){l()(r,e);var t=Mt(r);function r(e){var n;o()(this,r);var a=(n=t.call(this,e)).props.control.setting.get();return n.state={value:a},n.onSelectChange=n.onSelectChange.bind(P()(n)),n.renderSelectHtml=n.renderSelectHtml.bind(P()(n)),n}return s()(r,[{key:"onSelectChange",value:function(e){var t=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?St(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):St(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},this.state.value);t[e]=event.target.value,this.updateValues(t)}},{key:"renderSelectHtml",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=this.props.control.params.choices,o=Object.entries(a).map((function(e){return Object(n.createElement)("option",{key:e[0],value:e[0]},e[1])}));return Object(n.createElement)("div",{className:"ast-responsive-select-container ".concat(e," ").concat(r)},Object(n.createElement)("select",{className:"ast-select-input","data-value":this.state.value[e],value:this.state.value[e],onChange:function(){t.onSelectChange(e)}},o))}},{key:"render",value:function(){var e=this.props.control.params.label,t=null;e&&(t=Object(n.createElement)("span",{className:"customize-control-title"},e));var r=Object(n.createElement)("ul",{key:"ast-resp-ul",className:"ast-responsive-btns"},Object(n.createElement)("li",{key:"desktop",className:"desktop active"},Object(n.createElement)("button",{type:"button",className:"preview-desktop","data-device":"desktop"},Object(n.createElement)("i",{className:"dashicons dashicons-desktop"}))),Object(n.createElement)("li",{key:"tablet",className:"tablet"},Object(n.createElement)("button",{type:"button",className:"preview-tablet","data-device":"tablet"},Object(n.createElement)("i",{className:"dashicons dashicons-tablet"}))),Object(n.createElement)("li",{key:"mobile",className:"mobile"},Object(n.createElement)("button",{type:"button",className:"preview-mobile","data-device":"mobile"},Object(n.createElement)("i",{className:"dashicons dashicons-smartphone"})))),a=Object(n.createElement)(n.Fragment,null,this.renderSelectHtml("desktop","active"),this.renderSelectHtml("tablet"),this.renderSelectHtml("mobile"));return Object(n.createElement)(n.Fragment,null,t,r,Object(n.createElement)("div",{className:"customize-control-content"},Object(n.createElement)("div",{className:"ast-responsive-select-wrapper"},a)))}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(n.Component);Nt.propTypes={control:m.a.object.isRequired};var Rt=Nt,Dt=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Rt,{control:this}),this.container[0])},ready:function(){var e=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-responsive-select .customize-control-content .ast-responsive-select-container").removeClass("active"),jQuery(".customize-control-ast-responsive-select .customize-control-content .ast-responsive-select-container."+e).addClass("active"),jQuery(".customize-control-ast-responsive-select .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-select .ast-responsive-btns li."+e).addClass("active"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var e=jQuery(this).attr("data-device");jQuery(".customize-control-ast-responsive-select .customize-control-content .ast-responsive-select-container").removeClass("active"),jQuery(".customize-control-ast-responsive-select .customize-control-content .ast-responsive-select-container."+e).addClass("active"),jQuery(".customize-control-ast-responsive-select .ast-responsive-btns li").removeClass("active"),jQuery(".customize-control-ast-responsive-select .ast-responsive-btns li."+e).addClass("active")})),this.container.find(".ast-responsive-btns button").on("click",(function(e){var t=jQuery(this).attr("data-device");t="desktop"==t?"tablet":"tablet"==t?"mobile":"desktop",jQuery('.wp-full-overlay-footer .devices button[data-device="'+t+'"]').trigger("click")}))}}),Pt=r(12),Ht=r.n(Pt),At=r(43),Tt=r.n(At),Vt=wp.i18n.__,Lt=function(e){return"section-footer-builder"===e.control.params.section||"section-header-builder"===e.control.params.section?Object(n.createElement)(Ht.a.Fragment,null,Object(n.createElement)("span",{className:"ast-customize-control-title"}),Object(n.createElement)("span",{className:"ast-customize-control-description"},Object(n.createElement)("span",{className:"button button-secondary ahfb-builder-hide-button ahfb-builder-tab-toggle"},Object(n.createElement)("span",{className:"ast-builder-hide-action"}," ",Object(n.createElement)("span",{className:"dashicons dashicons-arrow-down-alt2"})," ",Vt("Hide Builder","astra-builder")," "),Object(n.createElement)("span",{className:"ast-builder-show-action"}," ",Object(n.createElement)("span",{className:"dashicons dashicons-arrow-up-alt2"})," ",Vt("Show Builder","astra-builder")," ")))):Object(n.createElement)(Ht.a.Fragment,null,Object(n.createElement)("div",{className:"ahfb-compontent-tabs nav-tab-wrapper wp-clearfix"},Object(n.createElement)("a",{href:"#",className:"nav-tab ahfb-general-tab ahfb-compontent-tabs-button "+("general"===e.tab?"nav-tab-active":""),"data-tab":"general"},Object(n.createElement)("span",null,Vt("General","astra-builder"))),Object(n.createElement)("a",{href:"#",className:"nav-tab ahfb-design-tab ahfb-compontent-tabs-button "+("design"===e.tab?"nav-tab-active":""),"data-tab":"design"},Object(n.createElement)("span",null,Vt("Design","astra-builder")))))},Bt=wp.customize.astraControl.extend({renderContent:function(){Tt.a.render(Object(n.createElement)(Lt,{control:this,tab:wp.customize.state("astra-customizer-tab").get(),customizer:wp.customize}),this.container[0])}});
/**!
 * Sortable 1.10.1
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function It(e){return(It="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function qt(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Ut(){return(Ut=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function Ft(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),n.forEach((function(t){qt(e,t,r[t])}))}return e}function Qt(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}function Yt(e){if("undefined"!=typeof window&&window.navigator)return!!navigator.userAgent.match(e)}var Gt=Yt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),Wt=Yt(/Edge/i),Xt=Yt(/firefox/i),Jt=Yt(/safari/i)&&!Yt(/chrome/i)&&!Yt(/android/i),Zt=Yt(/iP(ad|od|hone)/i),Kt=Yt(/chrome/i)&&Yt(/android/i),$t={capture:!1,passive:!1};function er(e,t,r){e.addEventListener(t,r,!Gt&&$t)}function tr(e,t,r){e.removeEventListener(t,r,!Gt&&$t)}function rr(e,t){if(t){if(">"===t[0]&&(t=t.substring(1)),e)try{if(e.matches)return e.matches(t);if(e.msMatchesSelector)return e.msMatchesSelector(t);if(e.webkitMatchesSelector)return e.webkitMatchesSelector(t)}catch(e){return!1}return!1}}function nr(e){return e.host&&e!==document&&e.host.nodeType?e.host:e.parentNode}function ar(e,t,r,n){if(e){r=r||document;do{if(null!=t&&(">"===t[0]?e.parentNode===r&&rr(e,t):rr(e,t))||n&&e===r)return e;if(e===r)break}while(e=nr(e))}return null}var or,ir=/\s+/g;function sr(e,t,r){if(e&&t)if(e.classList)e.classList[r?"add":"remove"](t);else{var n=(" "+e.className+" ").replace(ir," ").replace(" "+t+" "," ");e.className=(n+(r?" "+t:"")).replace(ir," ")}}function cr(e,t,r){var n=e&&e.style;if(n){if(void 0===r)return document.defaultView&&document.defaultView.getComputedStyle?r=document.defaultView.getComputedStyle(e,""):e.currentStyle&&(r=e.currentStyle),void 0===t?r:r[t];t in n||-1!==t.indexOf("webkit")||(t="-webkit-"+t),n[t]=r+("string"==typeof r?"":"px")}}function lr(e,t){var r="";if("string"==typeof e)r=e;else do{var n=cr(e,"transform");n&&"none"!==n&&(r=n+" "+r)}while(!t&&(e=e.parentNode));var a=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix;return a&&new a(r)}function ur(e,t,r){if(e){var n=e.getElementsByTagName(t),a=0,o=n.length;if(r)for(;a<o;a++)r(n[a],a);return n}return[]}function hr(){return Gt?document.documentElement:document.scrollingElement}function pr(e,t,r,n,a){if(e.getBoundingClientRect||e===window){var o,i,s,c,l,u,h;if(e!==window&&e!==hr()?(i=(o=e.getBoundingClientRect()).top,s=o.left,c=o.bottom,l=o.right,u=o.height,h=o.width):(i=0,s=0,c=window.innerHeight,l=window.innerWidth,u=window.innerHeight,h=window.innerWidth),(t||r)&&e!==window&&(a=a||e.parentNode,!Gt))do{if(a&&a.getBoundingClientRect&&("none"!==cr(a,"transform")||r&&"static"!==cr(a,"position"))){var p=a.getBoundingClientRect();i-=p.top+parseInt(cr(a,"border-top-width")),s-=p.left+parseInt(cr(a,"border-left-width")),c=i+o.height,l=s+o.width;break}}while(a=a.parentNode);if(n&&e!==window){var d=lr(a||e),f=d&&d.a,m=d&&d.d;d&&(c=(i/=m)+(u/=m),l=(s/=f)+(h/=f))}return{top:i,left:s,bottom:c,right:l,width:h,height:u}}}function dr(e,t,r){for(var n=gr(e,!0),a=pr(e)[t];n;){var o=pr(n)[r];if(!("top"===r||"left"===r?a>=o:a<=o))return n;if(n===hr())break;n=gr(n,!1)}return!1}function fr(e,t,r){for(var n=0,a=0,o=e.children;a<o.length;){if("none"!==o[a].style.display&&o[a]!==En.ghost&&o[a]!==En.dragged&&ar(o[a],r.draggable,e,!1)){if(n===t)return o[a];n++}a++}return null}function mr(e,t){for(var r=e.lastElementChild;r&&(r===En.ghost||"none"===cr(r,"display")||t&&!rr(r,t));)r=r.previousElementSibling;return r||null}function vr(e,t){var r=0;if(!e||!e.parentNode)return-1;for(;e=e.previousElementSibling;)"TEMPLATE"===e.nodeName.toUpperCase()||e===En.clone||t&&!rr(e,t)||r++;return r}function br(e){var t=0,r=0,n=hr();if(e)do{var a=lr(e),o=a.a,i=a.d;t+=e.scrollLeft*o,r+=e.scrollTop*i}while(e!==n&&(e=e.parentNode));return[t,r]}function gr(e,t){if(!e||!e.getBoundingClientRect)return hr();var r=e,n=!1;do{if(r.clientWidth<r.scrollWidth||r.clientHeight<r.scrollHeight){var a=cr(r);if(r.clientWidth<r.scrollWidth&&("auto"==a.overflowX||"scroll"==a.overflowX)||r.clientHeight<r.scrollHeight&&("auto"==a.overflowY||"scroll"==a.overflowY)){if(!r.getBoundingClientRect||r===document.body)return hr();if(n||t)return r;n=!0}}}while(r=r.parentNode);return hr()}function yr(e,t){return Math.round(e.top)===Math.round(t.top)&&Math.round(e.left)===Math.round(t.left)&&Math.round(e.height)===Math.round(t.height)&&Math.round(e.width)===Math.round(t.width)}function wr(e,t){return function(){if(!or){var r=arguments,n=this;1===r.length?e.call(n,r[0]):e.apply(n,r),or=setTimeout((function(){or=void 0}),t)}}}function Or(e,t,r){e.scrollLeft+=t,e.scrollTop+=r}function Er(e){var t=window.Polymer,r=window.jQuery||window.Zepto;return t&&t.dom?t.dom(e).cloneNode(!0):r?r(e).clone(!0)[0]:e.cloneNode(!0)}var jr="Sortable"+(new Date).getTime();function _r(){var e,t=[];return{captureAnimationState:function(){(t=[],this.options.animation)&&[].slice.call(this.el.children).forEach((function(e){if("none"!==cr(e,"display")&&e!==En.ghost){t.push({target:e,rect:pr(e)});var r=Ft({},t[t.length-1].rect);if(e.thisAnimationDuration){var n=lr(e,!0);n&&(r.top-=n.f,r.left-=n.e)}e.fromRect=r}}))},addAnimationState:function(e){t.push(e)},removeAnimationState:function(e){t.splice(function(e,t){for(var r in e)if(e.hasOwnProperty(r))for(var n in t)if(t.hasOwnProperty(n)&&t[n]===e[r][n])return Number(r);return-1}(t,{target:e}),1)},animateAll:function(r){var n=this;if(!this.options.animation)return clearTimeout(e),void("function"==typeof r&&r());var a=!1,o=0;t.forEach((function(e){var t=0,r=e.target,i=r.fromRect,s=pr(r),c=r.prevFromRect,l=r.prevToRect,u=e.rect,h=lr(r,!0);h&&(s.top-=h.f,s.left-=h.e),r.toRect=s,r.thisAnimationDuration&&yr(c,s)&&!yr(i,s)&&(u.top-s.top)/(u.left-s.left)==(i.top-s.top)/(i.left-s.left)&&(t=function(e,t,r,n){return Math.sqrt(Math.pow(t.top-e.top,2)+Math.pow(t.left-e.left,2))/Math.sqrt(Math.pow(t.top-r.top,2)+Math.pow(t.left-r.left,2))*n.animation}(u,c,l,n.options)),yr(s,i)||(r.prevFromRect=i,r.prevToRect=s,t||(t=n.options.animation),n.animate(r,u,s,t)),t&&(a=!0,o=Math.max(o,t),clearTimeout(r.animationResetTimer),r.animationResetTimer=setTimeout((function(){r.animationTime=0,r.prevFromRect=null,r.fromRect=null,r.prevToRect=null,r.thisAnimationDuration=null}),t),r.thisAnimationDuration=t)})),clearTimeout(e),a?e=setTimeout((function(){"function"==typeof r&&r()}),o):"function"==typeof r&&r(),t=[]},animate:function(e,t,r,n){if(n){cr(e,"transition",""),cr(e,"transform","");var a=lr(this.el),o=a&&a.a,i=a&&a.d,s=(t.left-r.left)/(o||1),c=(t.top-r.top)/(i||1);e.animatingX=!!s,e.animatingY=!!c,cr(e,"transform","translate3d("+s+"px,"+c+"px,0)"),function(e){e.offsetWidth}(e),cr(e,"transition","transform "+n+"ms"+(this.options.easing?" "+this.options.easing:"")),cr(e,"transform","translate3d(0,0,0)"),"number"==typeof e.animated&&clearTimeout(e.animated),e.animated=setTimeout((function(){cr(e,"transition",""),cr(e,"transform",""),e.animated=!1,e.animatingX=!1,e.animatingY=!1}),n)}}}}var Cr=[],kr={initializeByDefault:!0},xr={mount:function(e){for(var t in kr)kr.hasOwnProperty(t)&&!(t in e)&&(e[t]=kr[t]);Cr.push(e)},pluginEvent:function(e,t,r){var n=this;this.eventCanceled=!1,r.cancel=function(){n.eventCanceled=!0};var a=e+"Global";Cr.forEach((function(n){t[n.pluginName]&&(t[n.pluginName][a]&&t[n.pluginName][a](Ft({sortable:t},r)),t.options[n.pluginName]&&t[n.pluginName][e]&&t[n.pluginName][e](Ft({sortable:t},r)))}))},initializePlugins:function(e,t,r,n){for(var a in Cr.forEach((function(n){var a=n.pluginName;if(e.options[a]||n.initializeByDefault){var o=new n(e,t,e.options);o.sortable=e,o.options=e.options,e[a]=o,Ut(r,o.defaults)}})),e.options)if(e.options.hasOwnProperty(a)){var o=this.modifyOption(e,a,e.options[a]);void 0!==o&&(e.options[a]=o)}},getEventProperties:function(e,t){var r={};return Cr.forEach((function(n){"function"==typeof n.eventProperties&&Ut(r,n.eventProperties.call(t[n.pluginName],e))})),r},modifyOption:function(e,t,r){var n;return Cr.forEach((function(a){e[a.pluginName]&&a.optionListeners&&"function"==typeof a.optionListeners[t]&&(n=a.optionListeners[t].call(e[a.pluginName],r))})),n}};function zr(e){var t=e.sortable,r=e.rootEl,n=e.name,a=e.targetEl,o=e.cloneEl,i=e.toEl,s=e.fromEl,c=e.oldIndex,l=e.newIndex,u=e.oldDraggableIndex,h=e.newDraggableIndex,p=e.originalEvent,d=e.putSortable,f=e.extraEventProperties;if(t=t||r&&r[jr]){var m,v=t.options,b="on"+n.charAt(0).toUpperCase()+n.substr(1);!window.CustomEvent||Gt||Wt?(m=document.createEvent("Event")).initEvent(n,!0,!0):m=new CustomEvent(n,{bubbles:!0,cancelable:!0}),m.to=i||r,m.from=s||r,m.item=a||r,m.clone=o,m.oldIndex=c,m.newIndex=l,m.oldDraggableIndex=u,m.newDraggableIndex=h,m.originalEvent=p,m.pullMode=d?d.lastPutMode:void 0;var g=Ft({},f,xr.getEventProperties(n,t));for(var y in g)m[y]=g[y];r&&r.dispatchEvent(m),v[b]&&v[b].call(t,m)}}var Sr=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.evt,a=Qt(r,["evt"]);xr.pluginEvent.bind(En)(e,t,Ft({dragEl:Nr,parentEl:Rr,ghostEl:Dr,rootEl:Pr,nextEl:Hr,lastDownEl:Ar,cloneEl:Tr,cloneHidden:Vr,dragStarted:Zr,putSortable:Fr,activeSortable:En.active,originalEvent:n,oldIndex:Lr,oldDraggableIndex:Ir,newIndex:Br,newDraggableIndex:qr,hideGhostForTarget:gn,unhideGhostForTarget:yn,cloneNowHidden:function(){Vr=!0},cloneNowShown:function(){Vr=!1},dispatchSortableEvent:function(e){Mr({sortable:t,name:e,originalEvent:n})}},a))};function Mr(e){zr(Ft({putSortable:Fr,cloneEl:Tr,targetEl:Nr,rootEl:Pr,oldIndex:Lr,oldDraggableIndex:Ir,newIndex:Br,newDraggableIndex:qr},e))}var Nr,Rr,Dr,Pr,Hr,Ar,Tr,Vr,Lr,Br,Ir,qr,Ur,Fr,Qr,Yr,Gr,Wr,Xr,Jr,Zr,Kr,$r,en,tn,rn=!1,nn=!1,an=[],on=!1,sn=!1,cn=[],ln=!1,un=[],hn="undefined"!=typeof document,pn=Zt,dn=Wt||Gt?"cssFloat":"float",fn=hn&&!Kt&&!Zt&&"draggable"in document.createElement("div"),mn=function(){if(hn){if(Gt)return!1;var e=document.createElement("x");return e.style.cssText="pointer-events:auto","auto"===e.style.pointerEvents}}(),vn=function(e,t){var r=cr(e),n=parseInt(r.width)-parseInt(r.paddingLeft)-parseInt(r.paddingRight)-parseInt(r.borderLeftWidth)-parseInt(r.borderRightWidth),a=fr(e,0,t),o=fr(e,1,t),i=a&&cr(a),s=o&&cr(o),c=i&&parseInt(i.marginLeft)+parseInt(i.marginRight)+pr(a).width,l=s&&parseInt(s.marginLeft)+parseInt(s.marginRight)+pr(o).width;if("flex"===r.display)return"column"===r.flexDirection||"column-reverse"===r.flexDirection?"vertical":"horizontal";if("grid"===r.display)return r.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(a&&i.float&&"none"!==i.float){var u="left"===i.float?"left":"right";return!o||"both"!==s.clear&&s.clear!==u?"horizontal":"vertical"}return a&&("block"===i.display||"flex"===i.display||"table"===i.display||"grid"===i.display||c>=n&&"none"===r[dn]||o&&"none"===r[dn]&&c+l>n)?"vertical":"horizontal"},bn=function(e){function t(e,r){return function(n,a,o,i){var s=n.options.group.name&&a.options.group.name&&n.options.group.name===a.options.group.name;if(null==e&&(r||s))return!0;if(null==e||!1===e)return!1;if(r&&"clone"===e)return e;if("function"==typeof e)return t(e(n,a,o,i),r)(n,a,o,i);var c=(r?n:a).options.group.name;return!0===e||"string"==typeof e&&e===c||e.join&&e.indexOf(c)>-1}}var r={},n=e.group;n&&"object"==It(n)||(n={name:n}),r.name=n.name,r.checkPull=t(n.pull,!0),r.checkPut=t(n.put),r.revertClone=n.revertClone,e.group=r},gn=function(){!mn&&Dr&&cr(Dr,"display","none")},yn=function(){!mn&&Dr&&cr(Dr,"display","")};hn&&document.addEventListener("click",(function(e){if(nn)return e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.stopImmediatePropagation&&e.stopImmediatePropagation(),nn=!1,!1}),!0);var wn=function(e){if(Nr){e=e.touches?e.touches[0]:e;var t=(a=e.clientX,o=e.clientY,an.some((function(e){if(!mr(e)){var t=pr(e),r=e[jr].options.emptyInsertThreshold,n=a>=t.left-r&&a<=t.right+r,s=o>=t.top-r&&o<=t.bottom+r;return r&&n&&s?i=e:void 0}})),i);if(t){var r={};for(var n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);r.target=r.rootEl=t,r.preventDefault=void 0,r.stopPropagation=void 0,t[jr]._onDragOver(r)}}var a,o,i},On=function(e){Nr&&Nr.parentNode[jr]._isOutsideThisEl(e.target)};function En(e,t){if(!e||!e.nodeType||1!==e.nodeType)throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));this.el=e,this.options=t=Ut({},t),e[jr]=this;var r={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(e.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return vn(e,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(e,t){e.setData("Text",t.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:!1!==En.supportPointer&&"PointerEvent"in window,emptyInsertThreshold:5};for(var n in xr.initializePlugins(this,e,r),r)!(n in t)&&(t[n]=r[n]);for(var a in bn(t),this)"_"===a.charAt(0)&&"function"==typeof this[a]&&(this[a]=this[a].bind(this));this.nativeDraggable=!t.forceFallback&&fn,this.nativeDraggable&&(this.options.touchStartThreshold=1),t.supportPointer?er(e,"pointerdown",this._onTapStart):(er(e,"mousedown",this._onTapStart),er(e,"touchstart",this._onTapStart)),this.nativeDraggable&&(er(e,"dragover",this),er(e,"dragenter",this)),an.push(this.el),t.store&&t.store.get&&this.sort(t.store.get(this)||[]),Ut(this,_r())}function jn(e,t,r,n,a,o,i,s){var c,l,u=e[jr],h=u.options.onMove;return!window.CustomEvent||Gt||Wt?(c=document.createEvent("Event")).initEvent("move",!0,!0):c=new CustomEvent("move",{bubbles:!0,cancelable:!0}),c.to=t,c.from=e,c.dragged=r,c.draggedRect=n,c.related=a||t,c.relatedRect=o||pr(t),c.willInsertAfter=s,c.originalEvent=i,e.dispatchEvent(c),h&&(l=h.call(u,c,i)),l}function _n(e){e.draggable=!1}function Cn(){ln=!1}function kn(e){for(var t=e.tagName+e.className+e.src+e.href+e.textContent,r=t.length,n=0;r--;)n+=t.charCodeAt(r);return n.toString(36)}function xn(e){return setTimeout(e,0)}function zn(e){return clearTimeout(e)}En.prototype={constructor:En,_isOutsideThisEl:function(e){this.el.contains(e)||e===this.el||(Kr=null)},_getDirection:function(e,t){return"function"==typeof this.options.direction?this.options.direction.call(this,e,t,Nr):this.options.direction},_onTapStart:function(e){if(e.cancelable){var t=this,r=this.el,n=this.options,a=n.preventOnFilter,o=e.type,i=e.touches&&e.touches[0]||e.pointerType&&"touch"===e.pointerType&&e,s=(i||e).target,c=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||s,l=n.filter;if(function(e){un.length=0;var t=e.getElementsByTagName("input"),r=t.length;for(;r--;){var n=t[r];n.checked&&un.push(n)}}(r),!Nr&&!(/mousedown|pointerdown/.test(o)&&0!==e.button||n.disabled||c.isContentEditable||(s=ar(s,n.draggable,r,!1))&&s.animated||Ar===s)){if(Lr=vr(s),Ir=vr(s,n.draggable),"function"==typeof l){if(l.call(this,e,s,this))return Mr({sortable:t,rootEl:c,name:"filter",targetEl:s,toEl:r,fromEl:r}),Sr("filter",t,{evt:e}),void(a&&e.cancelable&&e.preventDefault())}else if(l&&(l=l.split(",").some((function(n){if(n=ar(c,n.trim(),r,!1))return Mr({sortable:t,rootEl:n,name:"filter",targetEl:s,fromEl:r,toEl:r}),Sr("filter",t,{evt:e}),!0}))))return void(a&&e.cancelable&&e.preventDefault());n.handle&&!ar(c,n.handle,r,!1)||this._prepareDragStart(e,i,s)}}},_prepareDragStart:function(e,t,r){var n,a=this,o=a.el,i=a.options,s=o.ownerDocument;if(r&&!Nr&&r.parentNode===o){var c=pr(r);if(Pr=o,Rr=(Nr=r).parentNode,Hr=Nr.nextSibling,Ar=r,Ur=i.group,En.dragged=Nr,Qr={target:Nr,clientX:(t||e).clientX,clientY:(t||e).clientY},Xr=Qr.clientX-c.left,Jr=Qr.clientY-c.top,this._lastX=(t||e).clientX,this._lastY=(t||e).clientY,Nr.style["will-change"]="all",n=function(){Sr("delayEnded",a,{evt:e}),En.eventCanceled?a._onDrop():(a._disableDelayedDragEvents(),!Xt&&a.nativeDraggable&&(Nr.draggable=!0),a._triggerDragStart(e,t),Mr({sortable:a,name:"choose",originalEvent:e}),sr(Nr,i.chosenClass,!0))},i.ignore.split(",").forEach((function(e){ur(Nr,e.trim(),_n)})),er(s,"dragover",wn),er(s,"mousemove",wn),er(s,"touchmove",wn),er(s,"mouseup",a._onDrop),er(s,"touchend",a._onDrop),er(s,"touchcancel",a._onDrop),Xt&&this.nativeDraggable&&(this.options.touchStartThreshold=4,Nr.draggable=!0),Sr("delayStart",this,{evt:e}),!i.delay||i.delayOnTouchOnly&&!t||this.nativeDraggable&&(Wt||Gt))n();else{if(En.eventCanceled)return void this._onDrop();er(s,"mouseup",a._disableDelayedDrag),er(s,"touchend",a._disableDelayedDrag),er(s,"touchcancel",a._disableDelayedDrag),er(s,"mousemove",a._delayedDragTouchMoveHandler),er(s,"touchmove",a._delayedDragTouchMoveHandler),i.supportPointer&&er(s,"pointermove",a._delayedDragTouchMoveHandler),a._dragStartTimer=setTimeout(n,i.delay)}}},_delayedDragTouchMoveHandler:function(e){var t=e.touches?e.touches[0]:e;Math.max(Math.abs(t.clientX-this._lastX),Math.abs(t.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){Nr&&_n(Nr),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var e=this.el.ownerDocument;tr(e,"mouseup",this._disableDelayedDrag),tr(e,"touchend",this._disableDelayedDrag),tr(e,"touchcancel",this._disableDelayedDrag),tr(e,"mousemove",this._delayedDragTouchMoveHandler),tr(e,"touchmove",this._delayedDragTouchMoveHandler),tr(e,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(e,t){t=t||"touch"==e.pointerType&&e,!this.nativeDraggable||t?this.options.supportPointer?er(document,"pointermove",this._onTouchMove):er(document,t?"touchmove":"mousemove",this._onTouchMove):(er(Nr,"dragend",this),er(Pr,"dragstart",this._onDragStart));try{document.selection?xn((function(){document.selection.empty()})):window.getSelection().removeAllRanges()}catch(e){}},_dragStarted:function(e,t){if(rn=!1,Pr&&Nr){Sr("dragStarted",this,{evt:t}),this.nativeDraggable&&er(document,"dragover",On);var r=this.options;!e&&sr(Nr,r.dragClass,!1),sr(Nr,r.ghostClass,!0),En.active=this,e&&this._appendGhost(),Mr({sortable:this,name:"start",originalEvent:t})}else this._nulling()},_emulateDragOver:function(){if(Yr){this._lastX=Yr.clientX,this._lastY=Yr.clientY,gn();for(var e=document.elementFromPoint(Yr.clientX,Yr.clientY),t=e;e&&e.shadowRoot&&(e=e.shadowRoot.elementFromPoint(Yr.clientX,Yr.clientY))!==t;)t=e;if(Nr.parentNode[jr]._isOutsideThisEl(e),t)do{if(t[jr]){if(t[jr]._onDragOver({clientX:Yr.clientX,clientY:Yr.clientY,target:e,rootEl:t})&&!this.options.dragoverBubble)break}e=t}while(t=t.parentNode);yn()}},_onTouchMove:function(e){if(Qr){var t=this.options,r=t.fallbackTolerance,n=t.fallbackOffset,a=e.touches?e.touches[0]:e,o=Dr&&lr(Dr),i=Dr&&o&&o.a,s=Dr&&o&&o.d,c=pn&&tn&&br(tn),l=(a.clientX-Qr.clientX+n.x)/(i||1)+(c?c[0]-cn[0]:0)/(i||1),u=(a.clientY-Qr.clientY+n.y)/(s||1)+(c?c[1]-cn[1]:0)/(s||1);if(!En.active&&!rn){if(r&&Math.max(Math.abs(a.clientX-this._lastX),Math.abs(a.clientY-this._lastY))<r)return;this._onDragStart(e,!0)}if(Dr){o?(o.e+=l-(Gr||0),o.f+=u-(Wr||0)):o={a:1,b:0,c:0,d:1,e:l,f:u};var h="matrix(".concat(o.a,",").concat(o.b,",").concat(o.c,",").concat(o.d,",").concat(o.e,",").concat(o.f,")");cr(Dr,"webkitTransform",h),cr(Dr,"mozTransform",h),cr(Dr,"msTransform",h),cr(Dr,"transform",h),Gr=l,Wr=u,Yr=a}e.cancelable&&e.preventDefault()}},_appendGhost:function(){if(!Dr){var e=this.options.fallbackOnBody?document.body:Pr,t=pr(Nr,!0,pn,!0,e),r=this.options;if(pn){for(tn=e;"static"===cr(tn,"position")&&"none"===cr(tn,"transform")&&tn!==document;)tn=tn.parentNode;tn!==document.body&&tn!==document.documentElement?(tn===document&&(tn=hr()),t.top+=tn.scrollTop,t.left+=tn.scrollLeft):tn=hr(),cn=br(tn)}sr(Dr=Nr.cloneNode(!0),r.ghostClass,!1),sr(Dr,r.fallbackClass,!0),sr(Dr,r.dragClass,!0),cr(Dr,"transition",""),cr(Dr,"transform",""),cr(Dr,"box-sizing","border-box"),cr(Dr,"margin",0),cr(Dr,"top",t.top),cr(Dr,"left",t.left),cr(Dr,"width",t.width),cr(Dr,"height",t.height),cr(Dr,"opacity","0.8"),cr(Dr,"position",pn?"absolute":"fixed"),cr(Dr,"zIndex","100000"),cr(Dr,"pointerEvents","none"),En.ghost=Dr,e.appendChild(Dr),cr(Dr,"transform-origin",Xr/parseInt(Dr.style.width)*100+"% "+Jr/parseInt(Dr.style.height)*100+"%")}},_onDragStart:function(e,t){var r=this,n=e.dataTransfer,a=r.options;Sr("dragStart",this,{evt:e}),En.eventCanceled?this._onDrop():(Sr("setupClone",this),En.eventCanceled||((Tr=Er(Nr)).draggable=!1,Tr.style["will-change"]="",this._hideClone(),sr(Tr,this.options.chosenClass,!1),En.clone=Tr),r.cloneId=xn((function(){Sr("clone",r),En.eventCanceled||(r.options.removeCloneOnHide||Pr.insertBefore(Tr,Nr),r._hideClone(),Mr({sortable:r,name:"clone"}))})),!t&&sr(Nr,a.dragClass,!0),t?(nn=!0,r._loopId=setInterval(r._emulateDragOver,50)):(tr(document,"mouseup",r._onDrop),tr(document,"touchend",r._onDrop),tr(document,"touchcancel",r._onDrop),n&&(n.effectAllowed="move",a.setData&&a.setData.call(r,n,Nr)),er(document,"drop",r),cr(Nr,"transform","translateZ(0)")),rn=!0,r._dragStartId=xn(r._dragStarted.bind(r,t,e)),er(document,"selectstart",r),Zr=!0,Jt&&cr(document.body,"user-select","none"))},_onDragOver:function(e){var t,r,n,a,o=this.el,i=e.target,s=this.options,c=s.group,l=En.active,u=Ur===c,h=s.sort,p=Fr||l,d=this,f=!1;if(!ln){if(void 0!==e.preventDefault&&e.cancelable&&e.preventDefault(),i=ar(i,s.draggable,o,!0),z("dragOver"),En.eventCanceled)return f;if(Nr.contains(e.target)||i.animated&&i.animatingX&&i.animatingY||d._ignoreWhileAnimating===i)return M(!1);if(nn=!1,l&&!s.disabled&&(u?h||(n=!Pr.contains(Nr)):Fr===this||(this.lastPutMode=Ur.checkPull(this,l,Nr,e))&&c.checkPut(this,l,Nr,e))){if(a="vertical"===this._getDirection(e,i),t=pr(Nr),z("dragOverValid"),En.eventCanceled)return f;if(n)return Rr=Pr,S(),this._hideClone(),z("revert"),En.eventCanceled||(Hr?Pr.insertBefore(Nr,Hr):Pr.appendChild(Nr)),M(!0);var m=mr(o,s.draggable);if(!m||function(e,t,r){var n=pr(mr(r.el,r.options.draggable));return t?e.clientX>n.right+10||e.clientX<=n.right&&e.clientY>n.bottom&&e.clientX>=n.left:e.clientX>n.right&&e.clientY>n.top||e.clientX<=n.right&&e.clientY>n.bottom+10}(e,a,this)&&!m.animated){if(m===Nr)return M(!1);if(m&&o===e.target&&(i=m),i&&(r=pr(i)),!1!==jn(Pr,o,Nr,t,i,r,e,!!i))return S(),o.appendChild(Nr),Rr=o,N(),M(!0)}else if(i.parentNode===o){r=pr(i);var v,b,g,y=Nr.parentNode!==o,w=!function(e,t,r){var n=r?e.left:e.top,a=r?e.right:e.bottom,o=r?e.width:e.height,i=r?t.left:t.top,s=r?t.right:t.bottom,c=r?t.width:t.height;return n===i||a===s||n+o/2===i+c/2}(Nr.animated&&Nr.toRect||t,i.animated&&i.toRect||r,a),O=a?"top":"left",E=dr(i,"top","top")||dr(Nr,"top","top"),j=E?E.scrollTop:void 0;if(Kr!==i&&(b=r[O],on=!1,sn=!w&&s.invertSwap||y),0!==(v=function(e,t,r,n,a,o,i,s){var c=n?e.clientY:e.clientX,l=n?r.height:r.width,u=n?r.top:r.left,h=n?r.bottom:r.right,p=!1;if(!i)if(s&&en<l*a){if(!on&&(1===$r?c>u+l*o/2:c<h-l*o/2)&&(on=!0),on)p=!0;else if(1===$r?c<u+en:c>h-en)return-$r}else if(c>u+l*(1-a)/2&&c<h-l*(1-a)/2)return function(e){return vr(Nr)<vr(e)?1:-1}(t);if((p=p||i)&&(c<u+l*o/2||c>h-l*o/2))return c>u+l/2?1:-1;return 0}(e,i,r,a,w?1:s.swapThreshold,null==s.invertedSwapThreshold?s.swapThreshold:s.invertedSwapThreshold,sn,Kr===i))){var _=vr(Nr);do{_-=v,g=Rr.children[_]}while(g&&("none"===cr(g,"display")||g===Dr))}if(0===v||g===i)return M(!1);Kr=i,$r=v;var C=i.nextElementSibling,k=!1,x=jn(Pr,o,Nr,t,i,r,e,k=1===v);if(!1!==x)return 1!==x&&-1!==x||(k=1===x),ln=!0,setTimeout(Cn,30),S(),k&&!C?o.appendChild(Nr):i.parentNode.insertBefore(Nr,k?C:i),E&&Or(E,0,j-E.scrollTop),Rr=Nr.parentNode,void 0===b||sn||(en=Math.abs(b-pr(i)[O])),N(),M(!0)}if(o.contains(Nr))return M(!1)}return!1}function z(s,c){Sr(s,d,Ft({evt:e,isOwner:u,axis:a?"vertical":"horizontal",revert:n,dragRect:t,targetRect:r,canSort:h,fromSortable:p,target:i,completed:M,onMove:function(r,n){return jn(Pr,o,Nr,t,r,pr(r),e,n)},changed:N},c))}function S(){z("dragOverAnimationCapture"),d.captureAnimationState(),d!==p&&p.captureAnimationState()}function M(t){return z("dragOverCompleted",{insertion:t}),t&&(u?l._hideClone():l._showClone(d),d!==p&&(sr(Nr,Fr?Fr.options.ghostClass:l.options.ghostClass,!1),sr(Nr,s.ghostClass,!0)),Fr!==d&&d!==En.active?Fr=d:d===En.active&&Fr&&(Fr=null),p===d&&(d._ignoreWhileAnimating=i),d.animateAll((function(){z("dragOverAnimationComplete"),d._ignoreWhileAnimating=null})),d!==p&&(p.animateAll(),p._ignoreWhileAnimating=null)),(i===Nr&&!Nr.animated||i===o&&!i.animated)&&(Kr=null),s.dragoverBubble||e.rootEl||i===document||(Nr.parentNode[jr]._isOutsideThisEl(e.target),!t&&wn(e)),!s.dragoverBubble&&e.stopPropagation&&e.stopPropagation(),f=!0}function N(){Br=vr(Nr),qr=vr(Nr,s.draggable),Mr({sortable:d,name:"change",toEl:o,newIndex:Br,newDraggableIndex:qr,originalEvent:e})}},_ignoreWhileAnimating:null,_offMoveEvents:function(){tr(document,"mousemove",this._onTouchMove),tr(document,"touchmove",this._onTouchMove),tr(document,"pointermove",this._onTouchMove),tr(document,"dragover",wn),tr(document,"mousemove",wn),tr(document,"touchmove",wn)},_offUpEvents:function(){var e=this.el.ownerDocument;tr(e,"mouseup",this._onDrop),tr(e,"touchend",this._onDrop),tr(e,"pointerup",this._onDrop),tr(e,"touchcancel",this._onDrop),tr(document,"selectstart",this)},_onDrop:function(e){var t=this.el,r=this.options;Br=vr(Nr),qr=vr(Nr,r.draggable),Sr("drop",this,{evt:e}),Rr=Nr&&Nr.parentNode,Br=vr(Nr),qr=vr(Nr,r.draggable),En.eventCanceled||(rn=!1,sn=!1,on=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),zn(this.cloneId),zn(this._dragStartId),this.nativeDraggable&&(tr(document,"drop",this),tr(t,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),Jt&&cr(document.body,"user-select",""),e&&(Zr&&(e.cancelable&&e.preventDefault(),!r.dropBubble&&e.stopPropagation()),Dr&&Dr.parentNode&&Dr.parentNode.removeChild(Dr),(Pr===Rr||Fr&&"clone"!==Fr.lastPutMode)&&Tr&&Tr.parentNode&&Tr.parentNode.removeChild(Tr),Nr&&(this.nativeDraggable&&tr(Nr,"dragend",this),_n(Nr),Nr.style["will-change"]="",Zr&&!rn&&sr(Nr,Fr?Fr.options.ghostClass:this.options.ghostClass,!1),sr(Nr,this.options.chosenClass,!1),Mr({sortable:this,name:"unchoose",toEl:Rr,newIndex:null,newDraggableIndex:null,originalEvent:e}),Pr!==Rr?(Br>=0&&(Mr({rootEl:Rr,name:"add",toEl:Rr,fromEl:Pr,originalEvent:e}),Mr({sortable:this,name:"remove",toEl:Rr,originalEvent:e}),Mr({rootEl:Rr,name:"sort",toEl:Rr,fromEl:Pr,originalEvent:e}),Mr({sortable:this,name:"sort",toEl:Rr,originalEvent:e})),Fr&&Fr.save()):Br!==Lr&&Br>=0&&(Mr({sortable:this,name:"update",toEl:Rr,originalEvent:e}),Mr({sortable:this,name:"sort",toEl:Rr,originalEvent:e})),En.active&&(null!=Br&&-1!==Br||(Br=Lr,qr=Ir),Mr({sortable:this,name:"end",toEl:Rr,originalEvent:e}),this.save())))),this._nulling()},_nulling:function(){Sr("nulling",this),Pr=Nr=Rr=Dr=Hr=Tr=Ar=Vr=Qr=Yr=Zr=Br=qr=Lr=Ir=Kr=$r=Fr=Ur=En.dragged=En.ghost=En.clone=En.active=null,un.forEach((function(e){e.checked=!0})),un.length=Gr=Wr=0},handleEvent:function(e){switch(e.type){case"drop":case"dragend":this._onDrop(e);break;case"dragenter":case"dragover":Nr&&(this._onDragOver(e),function(e){e.dataTransfer&&(e.dataTransfer.dropEffect="move");e.cancelable&&e.preventDefault()}(e));break;case"selectstart":e.preventDefault()}},toArray:function(){for(var e,t=[],r=this.el.children,n=0,a=r.length,o=this.options;n<a;n++)ar(e=r[n],o.draggable,this.el,!1)&&t.push(e.getAttribute(o.dataIdAttr)||kn(e));return t},sort:function(e){var t={},r=this.el;this.toArray().forEach((function(e,n){var a=r.children[n];ar(a,this.options.draggable,r,!1)&&(t[e]=a)}),this),e.forEach((function(e){t[e]&&(r.removeChild(t[e]),r.appendChild(t[e]))}))},save:function(){var e=this.options.store;e&&e.set&&e.set(this)},closest:function(e,t){return ar(e,t||this.options.draggable,this.el,!1)},option:function(e,t){var r=this.options;if(void 0===t)return r[e];var n=xr.modifyOption(this,e,t);r[e]=void 0!==n?n:t,"group"===e&&bn(r)},destroy:function(){Sr("destroy",this);var e=this.el;e[jr]=null,tr(e,"mousedown",this._onTapStart),tr(e,"touchstart",this._onTapStart),tr(e,"pointerdown",this._onTapStart),this.nativeDraggable&&(tr(e,"dragover",this),tr(e,"dragenter",this)),Array.prototype.forEach.call(e.querySelectorAll("[draggable]"),(function(e){e.removeAttribute("draggable")})),this._onDrop(),an.splice(an.indexOf(this.el),1),this.el=e=null},_hideClone:function(){if(!Vr){if(Sr("hideClone",this),En.eventCanceled)return;cr(Tr,"display","none"),this.options.removeCloneOnHide&&Tr.parentNode&&Tr.parentNode.removeChild(Tr),Vr=!0}},_showClone:function(e){if("clone"===e.lastPutMode){if(Vr){if(Sr("showClone",this),En.eventCanceled)return;Pr.contains(Nr)&&!this.options.group.revertClone?Pr.insertBefore(Tr,Nr):Hr?Pr.insertBefore(Tr,Hr):Pr.appendChild(Tr),this.options.group.revertClone&&this.animate(Nr,Tr),cr(Tr,"display",""),Vr=!1}}else this._hideClone()}},hn&&er(document,"touchmove",(function(e){(En.active||rn)&&e.cancelable&&e.preventDefault()})),En.utils={on:er,off:tr,css:cr,find:ur,is:function(e,t){return!!ar(e,t,e,!1)},extend:function(e,t){if(e&&t)for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e},throttle:wr,closest:ar,toggleClass:sr,clone:Er,index:vr,nextTick:xn,cancelNextTick:zn,detectDirection:vn,getChild:fr},En.get=function(e){return e[jr]},En.mount=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];t[0].constructor===Array&&(t=t[0]),t.forEach((function(e){if(!e.prototype||!e.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(e));e.utils&&(En.utils=Ft({},En.utils,e.utils)),xr.mount(e)}))},En.create=function(e,t){return new En(e,t)},En.version="1.10.1";var Sn,Mn,Nn,Rn,Dn,Pn,Hn=[],An=!1;function Tn(){Hn.forEach((function(e){clearInterval(e.pid)})),Hn=[]}function Vn(){clearInterval(Pn)}var Ln=wr((function(e,t,r,n){if(t.scroll){var a,o=(e.touches?e.touches[0]:e).clientX,i=(e.touches?e.touches[0]:e).clientY,s=t.scrollSensitivity,c=t.scrollSpeed,l=hr(),u=!1;Mn!==r&&(Mn=r,Tn(),Sn=t.scroll,a=t.scrollFn,!0===Sn&&(Sn=gr(r,!0)));var h=0,p=Sn;do{var d=p,f=pr(d),m=f.top,v=f.bottom,b=f.left,g=f.right,y=f.width,w=f.height,O=void 0,E=void 0,j=d.scrollWidth,_=d.scrollHeight,C=cr(d),k=d.scrollLeft,x=d.scrollTop;d===l?(O=y<j&&("auto"===C.overflowX||"scroll"===C.overflowX||"visible"===C.overflowX),E=w<_&&("auto"===C.overflowY||"scroll"===C.overflowY||"visible"===C.overflowY)):(O=y<j&&("auto"===C.overflowX||"scroll"===C.overflowX),E=w<_&&("auto"===C.overflowY||"scroll"===C.overflowY));var z=O&&(Math.abs(g-o)<=s&&k+y<j)-(Math.abs(b-o)<=s&&!!k),S=E&&(Math.abs(v-i)<=s&&x+w<_)-(Math.abs(m-i)<=s&&!!x);if(!Hn[h])for(var M=0;M<=h;M++)Hn[M]||(Hn[M]={});Hn[h].vx==z&&Hn[h].vy==S&&Hn[h].el===d||(Hn[h].el=d,Hn[h].vx=z,Hn[h].vy=S,clearInterval(Hn[h].pid),0==z&&0==S||(u=!0,Hn[h].pid=setInterval(function(){n&&0===this.layer&&En.active._onTouchMove(Dn);var t=Hn[this.layer].vy?Hn[this.layer].vy*c:0,r=Hn[this.layer].vx?Hn[this.layer].vx*c:0;"function"==typeof a&&"continue"!==a.call(En.dragged.parentNode[jr],r,t,e,Dn,Hn[this.layer].el)||Or(Hn[this.layer].el,r,t)}.bind({layer:h}),24))),h++}while(t.bubbleScroll&&p!==l&&(p=gr(p,!1)));An=u}}),30),Bn=function(e){var t=e.originalEvent,r=e.putSortable,n=e.dragEl,a=e.activeSortable,o=e.dispatchSortableEvent,i=e.hideGhostForTarget,s=e.unhideGhostForTarget;if(t){var c=r||a;i();var l=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:t,u=document.elementFromPoint(l.clientX,l.clientY);s(),c&&!c.el.contains(u)&&(o("spill"),this.onSpill({dragEl:n,putSortable:r}))}};function In(){}function qn(){}In.prototype={startIndex:null,dragStart:function(e){var t=e.oldDraggableIndex;this.startIndex=t},onSpill:function(e){var t=e.dragEl,r=e.putSortable;this.sortable.captureAnimationState(),r&&r.captureAnimationState();var n=fr(this.sortable.el,this.startIndex,this.options);n?this.sortable.el.insertBefore(t,n):this.sortable.el.appendChild(t),this.sortable.animateAll(),r&&r.animateAll()},drop:Bn},Ut(In,{pluginName:"revertOnSpill"}),qn.prototype={onSpill:function(e){var t=e.dragEl,r=e.putSortable||this.sortable;r.captureAnimationState(),t.parentNode&&t.parentNode.removeChild(t),r.animateAll()},drop:Bn},Ut(qn,{pluginName:"removeOnSpill"});En.mount(new function(){function e(){for(var e in this.defaults={scroll:!0,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0},this)"_"===e.charAt(0)&&"function"==typeof this[e]&&(this[e]=this[e].bind(this))}return e.prototype={dragStarted:function(e){var t=e.originalEvent;this.sortable.nativeDraggable?er(document,"dragover",this._handleAutoScroll):this.options.supportPointer?er(document,"pointermove",this._handleFallbackAutoScroll):t.touches?er(document,"touchmove",this._handleFallbackAutoScroll):er(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(e){var t=e.originalEvent;this.options.dragOverBubble||t.rootEl||this._handleAutoScroll(t)},drop:function(){this.sortable.nativeDraggable?tr(document,"dragover",this._handleAutoScroll):(tr(document,"pointermove",this._handleFallbackAutoScroll),tr(document,"touchmove",this._handleFallbackAutoScroll),tr(document,"mousemove",this._handleFallbackAutoScroll)),Vn(),Tn(),clearTimeout(or),or=void 0},nulling:function(){Dn=Mn=Sn=An=Pn=Nn=Rn=null,Hn.length=0},_handleFallbackAutoScroll:function(e){this._handleAutoScroll(e,!0)},_handleAutoScroll:function(e,t){var r=this,n=(e.touches?e.touches[0]:e).clientX,a=(e.touches?e.touches[0]:e).clientY,o=document.elementFromPoint(n,a);if(Dn=e,t||Wt||Gt||Jt){Ln(e,this.options,o,t);var i=gr(o,!0);!An||Pn&&n===Nn&&a===Rn||(Pn&&Vn(),Pn=setInterval((function(){var o=gr(document.elementFromPoint(n,a),!0);o!==i&&(i=o,Tn()),Ln(e,r.options,o,t)}),10),Nn=n,Rn=a)}else{if(!this.options.bubbleScroll||gr(o,!0)===hr())return void Tn();Ln(e,this.options,gr(o,!1),!1)}}},Ut(e,{pluginName:"scroll",initializeByDefault:!0})}),En.mount(qn,In);var Un=En,Fn=r(13),Qn=r.n(Fn);var Yn=function(e,t){if(!e)throw new Error("Invariant failed")},Gn=function(e,t){return(Gn=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */var Wn=function(){return(Wn=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var a in t=arguments[r])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e}).apply(this,arguments)};function Xn(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,a,o=r.call(e),i=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)i.push(n.value)}catch(e){a={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(a)throw a.error}}return i}function Jn(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(Xn(arguments[t]));return e}function Zn(e){null!==e.parentElement&&e.parentElement.removeChild(e)}function Kn(e){e.forEach((function(e){return Zn(e.element)}))}function $n(e){e.forEach((function(e){var t,r,n,a;t=e.parentElement,r=e.element,n=e.oldIndex,a=t.children[n]||null,t.insertBefore(r,a)}))}function ea(e,t){var r=na(e),n={parentElement:e.from},a=[];switch(r){case"normal":a=[{element:e.item,newIndex:e.newIndex,oldIndex:e.oldIndex,parentElement:e.from}];break;case"swap":a=[Wn({element:e.item,oldIndex:e.oldIndex,newIndex:e.newIndex},n),Wn({element:e.swapItem,oldIndex:e.newIndex,newIndex:e.oldIndex},n)];break;case"multidrag":a=e.oldIndicies.map((function(t,r){return Wn({element:t.multiDragElement,oldIndex:t.index,newIndex:e.newIndicies[r].index},n)}))}return function(e,t){return e.map((function(e){return Wn(Wn({},e),{item:t[e.oldIndex]})})).sort((function(e,t){return e.oldIndex-t.oldIndex}))}(a,t)}function ta(e,t){var r=Jn(t);return e.concat().reverse().forEach((function(e){return r.splice(e.oldIndex,1)})),r}function ra(e,t){var r=Jn(t);return e.forEach((function(e){return r.splice(e.newIndex,0,e.item)})),r}function na(e){return e.oldIndicies&&e.oldIndicies.length>0?"multidrag":e.swapItem?"swap":"normal"}function aa(e){e.list,e.setList,e.children,e.tag,e.style,e.className,e.clone,e.onAdd,e.onChange,e.onChoose,e.onClone,e.onEnd,e.onFilter,e.onRemove,e.onSort,e.onStart,e.onUnchoose,e.onUpdate,e.onMove,e.onSpill,e.onSelect,e.onDeselect;return function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(n=Object.getOwnPropertySymbols(e);a<n.length;a++)t.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(r[n[a]]=e[n[a]])}return r}(e,["list","setList","children","tag","style","className","clone","onAdd","onChange","onChoose","onClone","onEnd","onFilter","onRemove","onSort","onStart","onUnchoose","onUpdate","onMove","onSpill","onSelect","onDeselect"])}var oa={dragging:null},ia=function(e){function t(t){var r=e.call(this,t)||this;r.ref=Object(Pt.createRef)();var n=Jn(t.list).map((function(e){return Wn(Wn({},e),{chosen:!1,selected:!1})}));return t.setList(n,r.sortable,oa),Yn(!t.plugins,'\nPlugins prop is no longer supported.\nInstead, mount it with "Sortable.mount(new MultiDrag())"\nPlease read the updated README.md at https://github.com/SortableJS/react-sortablejs.\n      '),r}return function(e,t){function r(){this.constructor=e}Gn(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}(t,e),t.prototype.componentDidMount=function(){if(null!==this.ref.current){var e=this.makeOptions();Un.create(this.ref.current,e)}},t.prototype.render=function(){var e=this.props,t=e.tag,r={style:e.style,className:e.className,id:e.id},n=t&&null!==t?t:"div";return Object(Pt.createElement)(n,Wn({ref:this.ref},r),this.getChildren())},t.prototype.getChildren=function(){var e=this.props,t=e.children,r=e.dataIdAttr,n=e.selectedClass,a=void 0===n?"sortable-selected":n,o=e.chosenClass,i=void 0===o?"sortable-chosen":o,s=(e.dragClass,e.fallbackClass,e.ghostClass,e.swapClass,e.filter),c=void 0===s?"sortable-filter":s,l=e.list;if(!t||null==t)return null;var u=r||"data-id";return Pt.Children.map(t,(function(e,t){var r,n,o,s=l[t],h=e.props.className,p="string"==typeof c&&((r={})[c.replace(".","")]=!!s.filtered,r),d=Qn()(h,Wn(((n={})[a]=s.selected,n[i]=s.chosen,n),p));return Object(Pt.cloneElement)(e,((o={})[u]=e.key,o.className=d,o))}))},Object.defineProperty(t.prototype,"sortable",{get:function(){var e=this.ref.current;if(null===e)return null;var t=Object.keys(e).find((function(e){return e.includes("Sortable")}));return t?e[t]:null},enumerable:!0,configurable:!0}),t.prototype.makeOptions=function(){var e=this,t=aa(this.props);["onAdd","onChoose","onDeselect","onEnd","onRemove","onSelect","onSpill","onStart","onUnchoose","onUpdate"].forEach((function(r){return t[r]=e.prepareOnHandlerPropAndDOM(r)})),["onChange","onClone","onFilter","onSort"].forEach((function(r){return t[r]=e.prepareOnHandlerProp(r)}));return Wn(Wn({},t),{onMove:function(t,r){var n=e.props.onMove,a=t.willInsertAfter||-1;if(!n)return a;var o=n(t,r,e.sortable,oa);return void 0!==o&&o}})},t.prototype.prepareOnHandlerPropAndDOM=function(e){var t=this;return function(r){t.callOnHandlerProp(r,e),t[e](r)}},t.prototype.prepareOnHandlerProp=function(e){var t=this;return function(r){t.callOnHandlerProp(r,e)}},t.prototype.callOnHandlerProp=function(e,t){var r=this.props[t];r&&r(e,this.sortable,oa)},t.prototype.onAdd=function(e){var t=this.props,r=t.list,n=t.setList,a=ea(e,Jn(oa.dragging.props.list));Kn(a),n(ra(a,r),this.sortable,oa)},t.prototype.onRemove=function(e){var t=this,r=this.props,n=r.list,a=r.setList,o=na(e),i=ea(e,n);$n(i);var s=Jn(n);if("clone"!==e.pullMode)s=ta(i,s);else{var c=i;switch(o){case"multidrag":c=i.map((function(t,r){return Wn(Wn({},t),{element:e.clones[r]})}));break;case"normal":c=i.map((function(t,r){return Wn(Wn({},t),{element:e.clone})}));break;case"swap":default:Yn(!0,'mode "'+o+'" cannot clone. Please remove "props.clone" from <ReactSortable/> when using the "'+o+'" plugin')}Kn(c),i.forEach((function(r){var n=r.oldIndex,a=t.props.clone(r.item,e);s.splice(n,1,a)}))}a(s=s.map((function(e){return Wn(Wn({},e),{selected:!1})})),this.sortable,oa)},t.prototype.onUpdate=function(e){var t=this.props,r=t.list,n=t.setList,a=ea(e,r);return Kn(a),$n(a),n(function(e,t){return ra(e,ta(e,t))}(a,r),this.sortable,oa)},t.prototype.onStart=function(e){oa.dragging=this},t.prototype.onEnd=function(e){oa.dragging=null},t.prototype.onChoose=function(e){var t=this.props,r=t.list,n=t.setList,a=Jn(r);a[e.oldIndex].chosen=!0,n(a,this.sortable,oa)},t.prototype.onUnchoose=function(e){var t=this.props,r=t.list,n=t.setList,a=Jn(r);a[e.oldIndex].chosen=!1,n(a,this.sortable,oa)},t.prototype.onSpill=function(e){var t=this.props,r=t.removeOnSpill,n=t.revertOnSpill;r&&!n&&Zn(e.item)},t.prototype.onSelect=function(e){var t=this.props,r=t.list,n=t.setList,a=Jn(r).map((function(e){return Wn(Wn({},e),{selected:!1})}));e.newIndicies.forEach((function(t){var r=t.index;if(-1===r)return console.log('"'+e.type+'" had indice of "'+t.index+"\", which is probably -1 and doesn't usually happen here."),void console.log(e);a[r].selected=!0})),n(a,this.sortable,oa)},t.prototype.onDeselect=function(e){var t=this.props,r=t.list,n=t.setList,a=Jn(r).map((function(e){return Wn(Wn({},e),{selected:!1})}));e.newIndicies.forEach((function(e){var t=e.index;-1!==t&&(a[t].selected=!0)})),n(a,this.sortable,oa)},t.defaultProps={clone:function(e){return e}},t}(Pt.Component);function sa(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var ca=wp.components,la=ca.Dashicon,ua=ca.Button,ha=function(e){l()(r,e);var t=sa(r);function r(){var e;return o()(this,r),(e=t.apply(this,arguments)).choices=AstraBuilderCustomizerData&&AstraBuilderCustomizerData.choices&&AstraBuilderCustomizerData.choices[e.props.controlParams.group]?AstraBuilderCustomizerData.choices[e.props.controlParams.group]:[],e}return s()(r,[{key:"render",value:function(){var e=this;return Object(n.createElement)("div",{className:"ahfb-builder-item","data-id":this.props.item,"data-section":void 0!==this.choices[this.props.item]&&void 0!==this.choices[this.props.item].section?this.choices[this.props.item].section:"",key:this.props.item,onClick:function(){e.props.focusItem(void 0!==e.choices[e.props.item]&&void 0!==e.choices[e.props.item].section?e.choices[e.props.item].section:"")}},Object(n.createElement)("span",{className:"ahfb-builder-item-text"},void 0!==this.choices[this.props.item]&&void 0!==this.choices[this.props.item].name?this.choices[this.props.item].name:""),Object(n.createElement)(ua,{className:"ahfb-builder-item-icon",onClick:function(t){t.stopPropagation(),e.props.removeItem(e.props.item)}},Object(n.createElement)(la,{icon:"no-alt"})))}}]),r}(wp.element.Component);function pa(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var da=wp.components,fa=da.ButtonGroup,ma=da.Dashicon,va=da.Popover,ba=da.Button,ga=wp.element,ya=ga.Component,wa=ga.Fragment,Oa=function(e){l()(r,e);var t=pa(r);function r(){var e;return o()(this,r),(e=t.apply(this,arguments)).addItem=e.addItem.bind(P()(e)),e.state={isVisible:!1},e}return s()(r,[{key:"addItem",value:function(e,t,r){var n=this.props,a=n.setList,o=n.list;this.setState({isVisible:!1});var i=o;i.push({id:e}),a(i)}},{key:"render",value:function(){var e=this,t=this.props,r=t.controlParams,a=t.location,o=t.choices,i=(t.row,t.column,t.id);return Object(n.createElement)("div",{className:Qn()("ahfb-builder-add-item","astra-settings[header-desktop-items]"!==r.group&&"astra-settings[footer-desktop-items]"!==r.group||"right"!==a?null:"center-on-left","astra-settings[header-desktop-items]"!==r.group&&"astra-settings[footer-desktop-items]"!==r.group||"left"!==a?null:"center-on-right","astra-settings[header-desktop-items]"!==r.group&&"astra-settings[footer-desktop-items]"!==r.group||"left_center"!==a?null:"right-center-on-right","astra-settings[header-desktop-items]"!==r.group&&"astra-settings[footer-desktop-items]"!==r.group||"right_center"!==a?null:"left-center-on-left"),key:i},this.state.isVisible&&Object(n.createElement)(va,{position:"top",className:"ahfb-popover-add-builder",onClose:function(){!0===e.state.isVisible&&e.setState({isVisible:!1})}},Object(n.createElement)("div",{className:"ahfb-popover-builder-list"},Object(n.createElement)(fa,{className:"ahfb-radio-container-control"},Object.keys(o).map((function(t){return function(t,a,i){var s=!0;return r.rows.map((function(r){Object.keys(e.props.settings[r]).map((function(n){e.props.settings[r][n].includes(t)&&(s=!1)}))})),Object(n.createElement)(wa,{key:t},s&&Object(n.createElement)(ba,{isTertiary:!0,className:"builder-add-btn",onClick:function(){e.addItem(t,e.props.row,e.props.column)}},Object(n.createElement)("span",{className:"add-btn-icon"}," ",Object(n.createElement)(ma,{icon:void 0!==o[t]&&void 0!==o[t].icon?o[t].icon:""})," "),Object(n.createElement)("span",{className:"add-btn-title"},void 0!==o[t]&&void 0!==o[t].name?o[t].name:"")))}(t)}))))),Object(n.createElement)(ba,{className:"ahfb-builder-item-add-icon dashicon dashicons-plus-alt2",onClick:function(){e.setState({isVisible:!0})}}))}}]),r}(ya);function Ea(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var ja=wp.element,_a=ja.Component,Ca=ja.Fragment,ka=function(e){l()(r,e);var t=Ea(r);function r(){return o()(this,r),t.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var e=this,t=this.props.zone.replace(this.props.row+"_",""),r=void 0!==this.props.items&&null!=this.props.items&&null!=this.props.items.length&&this.props.items.length>0?this.props.items:[],a=[];r.length>0&&r.map((function(e){a.push({id:e})}));var o=void 0!==this.props.centerItems&&null!=this.props.centerItems&&null!=this.props.centerItems.length&&this.props.centerItems.length>0?this.props.centerItems:[],i=[];o.length>0&&o.map((function(e){i.push({id:e})}));var s=function(r,a,o){var i=o.replace("_","-");return Object(n.createElement)(Ca,null,Object(n.createElement)(ia,{animation:100,onStart:function(){return e.props.showDrop()},onEnd:function(){return e.props.hideDrop()},group:e.props.controlParams.group,className:"ahfb-builder-drop ahfb-builder-sortable-panel ahfb-builder-drop-"+t+o,list:r,setList:function(t){return e.props.onUpdate(e.props.row,e.props.zone+o,t)}},a.length>0&&a.map((function(t,r){return Object(n.createElement)(ha,{removeItem:function(t){return e.props.removeItem(t,e.props.row,e.props.zone+o)},focusItem:function(t){return e.props.focusItem(t)},key:t,index:r,item:t,controlParams:e.props.controlParams})}))),Object(n.createElement)(Oa,{row:e.props.row,list:r,settings:e.props.settings,column:e.props.zone+o,setList:function(t){return e.props.onAddItem(e.props.row,e.props.zone+o,t)},key:t,location:t+o,id:"add"+i+"-"+t,controlParams:e.props.controlParams,choices:e.props.choices}))};return"footer"===this.props.mode?Object(n.createElement)("div",{className:"ahfb-builder-area ahfb-builder-area-".concat(t),"data-location":this.props.zone},Object(n.createElement)("p",{className:"ahfb-small-label"},this.props.controlParams.zones[this.props.row][this.props.zone]),s(a,r,"")):Object(n.createElement)("div",{className:"ahfb-builder-area ahfb-builder-area-".concat(t),"data-location":this.props.zone},Object(n.createElement)("p",{className:"ahfb-small-label"},this.props.controlParams.zones[this.props.row][this.props.zone]),"astra-settings[header-desktop-items]"===this.props.controlParams.group&&"right"===t&&s(i,o,"_center"),s(a,r,""),"astra-settings[header-desktop-items]"===this.props.controlParams.group&&"left"===t&&s(i,o,"_center"))}}]),r}(_a);function xa(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var za=wp.i18n.__,Sa=wp.components,Ma=Sa.Dashicon,Na=Sa.Button,Ra=function(e){l()(r,e);var t=xa(r);function r(){return o()(this,r),t.apply(this,arguments)}return s()(r,[{key:"render",value:function(){var e=this,t="no-center-items",r=-1!==this.props.controlParams.group.indexOf("header")?"header":"footer",a=[],o="",i=0,s=!0;if("footer"===r&&(o="ast-grid-row-layout-".concat(this.props.layout[this.props.row].layout.desktop),i=this.props.layout[this.props.row].column-1,Object.keys(this.props.controlParams.zones[this.props.row]).map((function(t,r){i<r&&(e.props.items[t]=[])}))),"astra-settings[header-desktop-items]"===this.props.controlParams.group&&void 0!==this.props.items[this.props.row+"_center"]&&null!=this.props.items[this.props.row+"_center"]&&null!=this.props.items[this.props.row+"_center"].length&&this.props.items[this.props.row+"_center"].length>0&&(t="has-center-items"),"popup"===this.props.row&&(t="popup-vertical-group"),this.props.controlParams.hasOwnProperty("status"))switch(this.props.row){case"above":this.props.controlParams.status.above||(s=!1,"ahfb-grid-disabled");break;case"primary":this.props.controlParams.status.primary||(s=!1,"ahfb-grid-disabled");break;case"below":this.props.controlParams.status.below||(s=!1,"ahfb-grid-disabled")}return Object(n.createElement)("div",{className:"ahfb-builder-areas ahfb-builder-mode-".concat(r," ").concat(t),"data-row":this.props.row},Object(n.createElement)(Na,{className:"ahfb-row-actions",onClick:function(){return e.props.focusPanel(e.props.row+"-"+r)}},Object(n.createElement)(Ma,{icon:"admin-generic"}),"popup"===this.props.row?za("Off Canvas","astra-builder"):this.props.row+" "+r),Object(n.createElement)("div",{className:"ahfb-builder-group ahfb-builder-group-horizontal ".concat(o),"data-setting":this.props.row},Object.keys(this.props.controlParams.zones[this.props.row]).map((function(t,o){if(!("footer"===r&&i<o)&&(e.props.row+"_left_center"!==t&&e.props.row+"_right_center"!==t||"footer"===r))return"astra-settings[header-desktop-items]"===e.props.controlParams.group&&e.props.row+"_left"===t&&"footer"!==r&&(a=e.props.items[e.props.row+"_left_center"]),"astra-settings[header-desktop-items]"===e.props.controlParams.group&&e.props.row+"_right"===t&&"footer"!==r&&(a=e.props.items[e.props.row+"_right_center"]),s&&Object(n.createElement)(ka,{removeItem:function(t,r,n){return e.props.removeItem(t,r,n)},focusItem:function(t){return e.props.focusItem(t)},hideDrop:function(){return e.props.hideDrop()},showDrop:function(){return e.props.showDrop()},onUpdate:function(t,r,n){return e.props.onUpdate(t,r,n)},zone:t,row:e.props.row,choices:e.props.choices,key:t,items:e.props.items[t],centerItems:a,controlParams:e.props.controlParams,onAddItem:function(t,r,n){return e.props.onAddItem(t,r,n)},settings:e.props.settings,mode:r})}))))}}]),r}(wp.element.Component);function Da(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Pa(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Da(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Da(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Ha(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var Aa=function(e){l()(r,e);var t=Ha(r);function r(){var e;o()(this,r),(e=t.apply(this,arguments)).updatePresetSettings=e.updatePresetSettings.bind(P()(e)),e.updateRowLayout=e.updateRowLayout.bind(P()(e)),e.updateValues=e.updateValues.bind(P()(e)),e.onDragEnd=e.onDragEnd.bind(P()(e)),e.onAddItem=e.onAddItem.bind(P()(e)),e.onDragStart=e.onDragStart.bind(P()(e)),e.onDragStop=e.onDragStop.bind(P()(e)),e.removeItem=e.removeItem.bind(P()(e)),e.focusPanel=e.focusPanel.bind(P()(e)),e.focusItem=e.focusItem.bind(P()(e));var n=e.props.control.setting.get(),a={};e.defaultValue=e.props.control.params.default?Pa(Pa({},a),e.props.control.params.default):a,n=n?Pa(Pa({},e.defaultValue),n):e.defaultValue;var i={};return e.controlParams=e.props.control.params.input_attrs?Pa(Pa({},i),e.props.control.params.input_attrs):i,e.choices=AstraBuilderCustomizerData&&AstraBuilderCustomizerData.choices&&AstraBuilderCustomizerData.choices[e.controlParams.group]?AstraBuilderCustomizerData.choices[e.controlParams.group]:[],e.state={value:n,layout:e.controlParams.layouts},e.updatePresetSettings(),e.updateRowLayout(),e}return s()(r,[{key:"updateRowLayout",value:function(){var e=this;document.addEventListener("AstraBuilderChangeRowLayout",(function(t){if("astra-settings[footer-desktop-items]"===e.controlParams.group&&""!==t.detail.type){var r=e.controlParams;r.layouts[t.detail.type]&&(r.layouts[t.detail.type]={column:t.detail.columns,layout:t.detail.layout},e.setState({layout:r.layouts}),e.updateValues(r))}}))}},{key:"updatePresetSettings",value:function(){var e=this;document.addEventListener("AstraBuilderPresetSettingsUpdate",(function(t){e.controlParams.group===t.detail.id&&(e.setState({value:t.detail.grid_layout}),e.updateValues(t.detail.grid_layout))}))}},{key:"onDragStart",value:function(){var e,t=document.querySelectorAll(".ahfb-builder-area");for(e=0;e<t.length;++e)t[e].classList.add("ahfb-dragging-dropzones")}},{key:"onDragStop",value:function(){var e,t=document.querySelectorAll(".ahfb-builder-area");for(e=0;e<t.length;++e)t[e].classList.remove("ahfb-dragging-dropzones")}},{key:"removeItem",value:function(e,t,r){var n=this.state.value,a=n[t],o=[];a[r].length>0&&a[r].map((function(t){e!==t&&o.push(t)})),"astra-settings[header-desktop-items]"===this.controlParams.group&&t+"_center"===r&&0===o.length&&(a[t+"_left_center"].length>0&&(a[t+"_left_center"].map((function(e){n[t][t+"_left"].push(e)})),n[t][t+"_left_center"]=[]),a[t+"_right_center"].length>0&&(a[t+"_right_center"].map((function(e){n[t][t+"_right"].push(e)})),n[t][t+"_right_center"]=[])),a[r]=o,n[t][r]=o,this.setState({value:n}),this.updateValues(n);var i=new CustomEvent("AstraBuilderRemovedBuilderItem",{detail:this.controlParams.group});document.dispatchEvent(i)}},{key:"onDragEnd",value:function(e,t,r){var n=this.state.value,a=n[e],o=[];r.length>0&&r.map((function(e){o.push(e.id)})),this.arraysEqual(a[t],o)||("astra-settings[header-desktop-items]"===this.controlParams.group&&e+"_center"===t&&0===o.length&&(a[e+"_left_center"].length>0&&(a[e+"_left_center"].map((function(t){n[e][e+"_left"].push(t)})),n[e][e+"_left_center"]=[]),a[e+"_right_center"].length>0&&(a[e+"_right_center"].map((function(t){n[e][e+"_right"].push(t)})),n[e][e+"_right_center"]=[])),a[t]=o,n[e][t]=o,this.setState({value:n}),this.updateValues(n))}},{key:"onAddItem",value:function(e,t,r){this.onDragEnd(e,t,r);var n=new CustomEvent("AstraBuilderRemovedBuilderItem",{detail:this.controlParams.group});document.dispatchEvent(n)}},{key:"arraysEqual",value:function(e,t){if(e===t)return!0;if(null==e||null==t)return!1;if(e.length!=t.length)return!1;for(var r=0;r<e.length;++r)if(e[r]!==t[r])return!1;return!0}},{key:"focusPanel",value:function(e){e="section-"+e+"-builder",void 0!==this.props.customizer.section(e)&&this.props.customizer.section(e).focus()}},{key:"focusItem",value:function(e){void 0!==this.props.customizer.section(e)&&this.props.customizer.section(e).focus()}},{key:"render",value:function(){var e=this;return Object(n.createElement)("div",{className:"ahfb-control-field ahfb-builder-items"},this.controlParams.rows.includes("popup")&&Object(n.createElement)(Ra,{showDrop:function(){return e.onDragStart()},focusPanel:function(t){return e.focusPanel(t)},focusItem:function(t){return e.focusItem(t)},removeItem:function(t,r,n){return e.removeItem(t,r,n)},onAddItem:function(t,r,n){return e.onAddItem(t,r,n)},hideDrop:function(){return e.onDragStop()},onUpdate:function(t,r,n){return e.onDragEnd(t,r,n)},key:"popup",row:"popup",controlParams:this.controlParams,choices:this.choices,items:this.state.value.popup,settings:this.state.value,layout:this.state.layout}),Object(n.createElement)("div",{className:"ahfb-builder-row-items"},this.controlParams.rows.map((function(t){if("popup"!==t)return Object(n.createElement)(Ra,{showDrop:function(){return e.onDragStart()},focusPanel:function(t){return e.focusPanel(t)},focusItem:function(t){return e.focusItem(t)},removeItem:function(t,r,n){return e.removeItem(t,r,n)},hideDrop:function(){return e.onDragStop()},onUpdate:function(t,r,n){return e.onDragEnd(t,r,n)},onAddItem:function(t,r,n){return e.onAddItem(t,r,n)},key:t,row:t,controlParams:e.controlParams,choices:e.choices,customizer:e.props.customizer,items:e.state.value[t],settings:e.state.value,layout:e.state.layout})}))))}},{key:"updateValues",value:function(e){this.props.control.setting.set(Pa(Pa(Pa({},this.props.control.setting.get()),e),{},{flag:!this.props.control.setting.get().flag}))}}]),r}(wp.element.Component);Aa.propTypes={control:m.a.object.isRequired,customizer:m.a.func.isRequired};var Ta=Aa,Va=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Ta,{control:this,customizer:wp.customize}),this.container[0])}});function La(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var Ba=wp.i18n.__,Ia=wp.element,qa=Ia.Component,Ua=Ia.Fragment,Fa=wp.components,Qa=Fa.Button,Ya=Fa.Dashicon,Ga=Fa.Tooltip,Wa=Fa.ButtonGroup,Xa=function(e){l()(r,e);var t=La(r);function r(e){var n;return o()(this,r),(n=t.call(this,e)).state={view:"desktop"},n.linkResponsiveButtons(),n}return s()(r,[{key:"render",value:function(){var e=this.state.view,t={desktop:{tooltip:Ba("Desktop","astra-builder"),icon:"desktop"},tablet:{tooltip:Ba("Tablet","astra-builder"),icon:"tablet"},mobile:{tooltip:Ba("Mobile","astra-builder"),icon:"smartphone"}};return Object(n.createElement)(Ua,null,Object(n.createElement)("div",{className:"ahfb-responsive-control-bar"},this.props.controlLabel&&Object(n.createElement)("span",{className:"customize-control-title"},this.props.controlLabel),!this.props.hideResponsive&&Object(n.createElement)("div",{className:"floating-controls"},this.props.tooltip&&Object(n.createElement)(Wa,null,Object.keys(t).map((function(r){return Object(n.createElement)(Ga,{key:r,text:t[r].tooltip},Object(n.createElement)(Qa,{isTertiary:!0,className:(r===e?"active-device ":"")+r,onClick:function(){var e=new CustomEvent("AstraChangedRepsonsivePreview",{detail:r});document.dispatchEvent(e)}},Object(n.createElement)(Ya,{icon:t[r].icon})))}))),!this.props.tooltip&&Object(n.createElement)(Wa,null,Object.keys(t).map((function(r){return Object(n.createElement)(Qa,{isTertiary:!0,className:(r===e?"active-device ":"")+r,onClick:function(){var e=new CustomEvent("AstraChangedRepsonsivePreview",{detail:r});document.dispatchEvent(e)}},Object(n.createElement)(Ya,{icon:t[r].icon}))}))))),Object(n.createElement)("div",{className:"ahfb-responsive-controls-content"},this.props.children))}},{key:"changeViewType",value:function(e){this.setState({view:e}),wp.customize.previewedDevice(e),this.props.onChange(e)}},{key:"linkResponsiveButtons",value:function(){var e=this;document.addEventListener("AstraChangedRepsonsivePreview",(function(t){e.changeViewType(t.detail)}))}}]),r}(qa);Xa.propTypes={onChange:m.a.func,controlLabel:m.a.object},Xa.defaultProps={tooltip:!0};var Ja=Xa,Za={logo:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 50 30"},Object(n.createElement)("path",{d:"M24.23 9.074a.793.793 0 10-.001-1.585.793.793 0 00.001 1.585M26.336 7.551a.915.915 0 100-1.83.915.915 0 000 1.83M27.524 22.051h-5.055a.701.701 0 01-.577-1.1l2.586-3.743a.701.701 0 011.162.012l2.47 3.743a.702.702 0 01-.586 1.088m3.077-.962l-3.594-5.936v-3.315h.088a.941.941 0 000-1.884h-4.189a.942.942 0 000 1.884h.087v3.315l-3.594 5.936a1.901 1.901 0 001.703 2.749h7.796a1.902 1.902 0 001.703-2.749"}),Object(n.createElement)("path",{d:"M35.058.79l.109.004.109.007.108.01.107.012.106.015.105.017.105.02.103.023.103.025.102.027.1.03.1.033.098.034.098.037.096.04.095.041.094.044.092.046.092.048.089.051.089.052.087.055.086.056.084.059.083.06.082.062.079.065.079.066.076.068.075.069.073.072.072.073.069.075.068.076.066.079.065.079.062.082.06.083.059.084.056.086.055.087.052.089.051.089.048.092.046.092.044.094.041.095.04.096.037.098.034.098.033.1.03.1.027.102.025.103.023.103.02.105.017.105.015.106.012.107.01.108.007.109.004.109.001.11v19.896l-.001.11-.004.109-.007.109-.01.108-.012.107-.015.106-.017.105-.02.105-.023.103-.025.103-.027.102-.03.1-.033.1-.034.098-.037.098-.04.096-.041.095-.044.094-.046.092-.048.092-.051.089-.052.089-.055.087-.056.086-.059.084-.06.083-.062.082-.065.079-.066.079-.068.076-.069.075-.072.073-.073.072-.075.069-.076.068-.079.066-.079.065-.082.062-.083.06-.084.059-.086.056-.087.055-.089.052-.089.051-.092.048-.092.046-.094.044-.095.041-.096.04-.098.037-.098.034-.1.033-.1.03-.102.027-.103.025-.103.023-.105.02-.105.017-.106.015-.107.012-.108.01-.109.007-.109.004-.11.001H15.052l-.11-.001-.109-.004-.109-.007-.108-.01-.107-.012-.106-.015-.105-.017-.105-.02-.103-.023-.103-.025-.102-.027-.1-.03-.1-.033-.098-.034-.098-.037-.096-.04-.095-.041-.094-.044-.092-.046-.092-.048-.089-.051-.089-.052-.087-.055-.086-.056-.084-.059-.083-.06-.082-.062-.079-.065-.079-.066-.076-.068-.075-.069-.073-.072-.072-.073-.069-.075-.068-.076-.066-.079-.065-.079-.062-.082-.06-.083-.059-.084-.056-.086-.055-.087-.052-.089-.051-.089-.048-.092-.046-.092-.044-.094-.041-.095-.04-.096-.037-.098-.034-.098-.033-.1-.03-.1-.027-.102-.025-.103-.023-.103-.02-.105-.017-.105-.015-.106-.012-.107-.01-.108-.007-.109-.004-.109-.001-.11V5.052l.001-.11.004-.109.007-.109.01-.108.012-.107.015-.106.017-.105.02-.105.023-.103.025-.103.027-.102.03-.1.033-.1.034-.098.037-.098.04-.096.041-.095.044-.094.046-.092.048-.092.051-.089.052-.089.055-.087.056-.086.059-.084.06-.083.062-.082.065-.079.066-.079.068-.076.069-.075.072-.073.073-.072.075-.069.076-.068.079-.066.079-.065.082-.062.083-.06.084-.059.086-.056.087-.055.089-.052.089-.051.092-.048.092-.046.094-.044.095-.041.096-.04.098-.037.098-.034.1-.033.1-.03.102-.027.103-.025.103-.023.105-.02.105-.017.106-.015.107-.012.108-.01.109-.007.109-.004.11-.001h19.896l.11.001zM15.061 2.289l-.081.001-.071.002-.071.005-.07.006-.069.008-.069.01-.068.011-.068.013-.067.014-.066.017-.065.017-.065.02-.065.021-.063.022-.063.024-.062.025-.062.027-.06.028-.06.03-.059.031-.058.033-.058.034-.056.035-.056.037-.055.038-.054.039-.053.041-.051.041-.051.043-.05.045-.049.045-.047.047-.047.047-.045.049-.045.05-.043.051-.041.051-.041.053-.039.054-.038.055-.037.056-.035.056-.034.058-.033.058-.031.059-.03.06-.028.06-.027.062-.025.062-.024.063-.022.063-.021.065-.02.065-.017.065-.017.066-.014.067-.013.068-.011.068-.01.069-.008.069-.006.07-.005.071-.002.071-.001.081v19.878l.001.081.002.071.005.071.006.07.008.069.01.069.011.068.013.068.014.067.017.066.017.065.02.065.021.065.022.063.024.063.025.062.027.062.028.06.03.06.031.059.033.058.034.058.035.056.037.056.038.055.039.054.041.053.042.051.042.051.045.05.045.049.047.047.047.047.049.045.05.045.051.043.051.041.053.041.054.039.055.038.056.037.056.035.058.034.058.033.059.031.06.03.06.028.062.027.062.025.063.024.063.022.065.021.065.02.065.017.066.017.067.014.068.013.068.011.069.01.069.008.07.006.071.005.071.002.081.001h19.878l.081-.001.071-.002.071-.005.07-.006.069-.008.069-.01.068-.011.068-.013.067-.014.066-.017.065-.017.065-.02.065-.021.063-.022.063-.024.062-.025.062-.027.06-.028.06-.03.059-.031.058-.033.058-.034.056-.035.056-.037.055-.038.054-.039.053-.041.051-.042.051-.042.05-.045.049-.045.047-.047.047-.047.045-.049.045-.05.042-.051.042-.051.041-.053.039-.054.038-.055.037-.056.035-.056.034-.058.033-.058.031-.059.03-.06.028-.06.027-.062.025-.062.024-.063.022-.063.021-.065.02-.065.017-.065.017-.066.014-.067.013-.068.011-.068.01-.069.008-.069.006-.07.005-.071.002-.071.001-.081V5.061l-.001-.081-.002-.071-.005-.071-.006-.07-.008-.069-.01-.069-.011-.068-.013-.068-.014-.067-.017-.066-.017-.065-.02-.065-.021-.065-.022-.063-.024-.063-.025-.062-.027-.062-.028-.06-.03-.06-.031-.059-.033-.058-.034-.058-.035-.056-.037-.056-.038-.055-.039-.054-.041-.053-.041-.051-.043-.051-.045-.05-.045-.049-.047-.047-.047-.047-.049-.045-.05-.045-.051-.042-.051-.042-.053-.041-.054-.039-.055-.038-.056-.037-.056-.035-.058-.034-.058-.033-.059-.031-.06-.03-.06-.028-.062-.027-.062-.025-.063-.024-.063-.022-.065-.021-.065-.02-.065-.017-.066-.017-.067-.014-.068-.013-.068-.011-.069-.01-.069-.008-.07-.006-.071-.005-.071-.002-.081-.001H15.061z"})),logoTitleTag:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 50 30"},Object(n.createElement)("path",{d:"M9.984 10.805a.56.56 0 100-1.122.56.56 0 000 1.122M11.475 9.727a.648.648 0 100-1.295.648.648 0 000 1.295M12.316 19.991H8.737c-.4 0-.636-.45-.408-.779l1.831-2.649a.496.496 0 01.822.009l1.748 2.649a.496.496 0 01-.414.77m2.178-.681l-2.544-4.202v-2.346h.062a.667.667 0 000-1.333H9.047a.667.667 0 100 1.333h.061v2.346L6.565 19.31a1.346 1.346 0 001.205 1.946h5.518c1 0 1.651-1.051 1.206-1.946"}),Object(n.createElement)("path",{d:"M17.649 4.942l.077.003.077.005.076.006.076.009.075.011.075.012.074.014.073.016.072.018.072.019.072.022.07.022.07.025.069.026.068.028.067.029.067.032.065.032.065.034.063.036.063.037.062.038.06.04.06.042.059.043.057.044.057.045.055.047.054.048.053.049.052.051.051.052.049.053.048.054.047.055.045.057.045.057.042.059.042.06.04.06.038.062.037.063.036.064.034.064.033.066.031.066.029.067.028.068.026.069.025.07.023.071.021.071.019.072.018.072.016.074.014.074.013.074.01.075.009.076.007.076.005.077.002.078.001.078v14.082l-.001.078-.002.078-.005.077-.007.076-.009.076-.01.075-.013.074-.014.074-.016.074-.018.072-.019.072-.021.071-.023.071-.025.07-.026.069-.028.068-.029.067-.031.066-.033.066-.034.064-.036.064-.037.063-.038.062-.04.06-.042.06-.042.059-.045.057-.045.057-.047.055-.048.054-.049.053-.051.052-.052.051-.053.049-.054.048-.055.047-.057.045-.057.044-.059.043-.06.042-.06.04-.062.038-.063.037-.063.036-.065.034-.065.032-.067.032-.067.029-.068.028-.069.026-.07.025-.07.022-.072.022-.072.019-.072.018-.073.016-.074.014-.075.012-.075.011-.076.009-.076.006-.077.005-.077.003-.078.001H3.488l-.078-.001-.077-.003-.077-.005-.077-.006-.075-.009-.076-.011-.074-.012-.074-.014-.073-.016-.073-.018-.072-.019-.071-.022-.071-.022-.069-.025-.069-.026-.068-.028-.068-.029-.066-.032-.066-.032-.064-.034-.064-.036-.063-.037-.061-.038-.061-.04-.06-.042-.058-.043-.058-.044-.056-.045-.056-.047-.054-.048-.053-.049-.052-.051-.05-.052-.05-.053-.048-.054-.047-.055-.045-.057-.044-.057-.043-.059-.041-.06-.04-.06-.039-.062-.037-.063-.036-.064-.034-.064-.032-.066-.031-.066-.03-.067-.028-.068-.026-.069-.024-.07-.023-.071-.022-.071-.019-.072-.018-.072-.016-.074-.014-.074-.012-.074-.011-.075-.008-.076-.007-.076-.005-.077-.003-.078-.001-.078V7.959l.001-.078.003-.078.005-.077.007-.076.008-.076.011-.075.012-.074.014-.074.016-.074.018-.072.019-.072.022-.071.023-.071.024-.07.026-.069.028-.068.03-.067.031-.066.032-.066.034-.064.036-.064.037-.063.039-.062.04-.06.041-.06.043-.059.044-.057.045-.057.047-.055.048-.054.05-.053.05-.052.052-.051.053-.049.054-.048.056-.047.056-.045.058-.044.058-.043.06-.042.061-.04.061-.038.063-.037.064-.036.064-.034.066-.032.066-.032.068-.029.068-.028.069-.026.069-.025.071-.022.071-.022.072-.019.073-.018.073-.016.074-.014.074-.012.076-.011.075-.009.077-.006.077-.005.077-.003.078-.001h14.083l.078.001zM3.497 6.441h-.049l-.039.002-.039.002-.039.004-.038.004-.038.005-.037.007-.037.007-.037.008-.036.009-.036.009-.035.011-.036.011-.034.013-.035.013-.034.014-.033.014-.034.016-.032.016-.033.017-.032.018-.031.019-.032.019-.03.02-.03.021-.03.022-.029.022-.028.023-.029.024-.027.024-.027.025-.026.026-.026.026-.025.027-.024.027-.024.028-.023.029-.022.029-.022.03-.02.03-.021.03-.019.031-.019.032-.018.032-.017.032-.016.033-.016.033-.014.034-.014.034-.013.034-.013.035-.011.035-.011.036-.009.036-.009.036-.008.037-.007.037-.006.037-.006.038-.004.038-.003.038-.003.039-.001.04-.001.049v14.064l.001.049.001.04.003.039.003.038.004.038.006.038.006.037.007.037.008.037.009.036.009.036.011.036.011.035.013.035.013.034.014.034.014.034.016.033.016.033.017.032.018.032.019.032.019.031.021.03.02.03.022.03.022.029.023.029.024.028.024.027.025.027.026.026.026.026.027.025.028.024.028.024.028.023.029.022.03.022.03.021.03.02.032.019.031.019.032.018.033.017.032.016.034.016.033.014.034.014.035.013.034.013.036.011.035.011.036.009.036.009.037.008.037.007.037.007.038.005.038.004.039.004.039.002.039.002H17.61l.04-.002.039-.002.038-.004.038-.004.038-.005.038-.007.037-.007.036-.008.036-.009.036-.009.036-.011.035-.011.035-.013.034-.013.034-.014.034-.014.033-.016.033-.016.032-.017.032-.018.032-.019.031-.019.03-.02.031-.021.029-.022.029-.022.029-.023.028-.024.027-.024.027-.025.026-.026.026-.026.025-.027.024-.027.024-.028.023-.029.022-.029.022-.03.021-.03.02-.03.019-.031.019-.032.018-.032.017-.032.016-.033.016-.033.015-.034.014-.034.013-.034.012-.035.011-.035.011-.036.01-.036.009-.036.007-.037.008-.037.006-.037.005-.038.004-.038.004-.038.002-.039.002-.04V7.919l-.002-.04-.002-.039-.004-.038-.004-.038-.005-.038-.006-.037-.008-.037-.007-.037-.009-.036-.01-.036-.011-.036-.011-.035-.012-.035-.013-.034-.014-.034-.015-.034-.016-.033-.016-.033-.017-.032-.018-.032-.019-.032-.019-.031-.02-.03-.021-.03-.022-.03-.022-.029-.023-.029-.024-.028-.024-.027-.025-.027-.026-.026-.026-.026-.027-.025-.027-.024-.028-.024-.029-.023-.029-.022-.029-.022-.031-.021-.03-.02-.031-.019-.032-.019-.032-.018-.032-.017-.033-.016-.033-.016-.034-.014-.034-.014-.034-.013-.035-.013-.035-.011-.036-.011-.036-.009-.036-.009-.036-.008-.037-.007-.038-.007-.038-.005-.038-.004-.038-.004-.039-.002-.04-.002H3.497z"}),Object(n.createElement)("path",{d:"M27.867 8.104V9.47h-2.146v5.749h-1.602V9.47h-2.146V8.104h5.894z"}),Object(n.createElement)("path",{d:"M28.893 8.104H30.495V15.219H28.893z"}),Object(n.createElement)("path",{d:"M37.415 8.104V9.47H35.27v5.749h-1.602V9.47h-2.146V8.104h5.893zM43.196 13.844v1.375h-4.754V8.104h1.602v5.74h3.152zM44.223 15.219V8.104h4.805v1.345h-3.204v1.397h2.844v1.314h-2.844v1.714h3.44v1.345h-5.041z"}),Object(n.createElement)("path",{d:"M25.779 17.216v.881h-1.385v3.713H23.36v-3.713h-1.386v-.881h3.805zM28.975 21.81a11.73 11.73 0 00-.163-.491c-.059-.168-.118-.336-.175-.504h-1.79c-.058.168-.116.336-.176.504-.06.168-.114.332-.162.491h-1.074c.172-.495.336-.953.49-1.373.155-.419.306-.815.454-1.186.148-.371.294-.724.438-1.057.143-.334.293-.66.447-.978h.988a37.492 37.492 0 011.339 3.221c.155.42.318.878.491 1.373h-1.107zm-1.24-3.554a6.44 6.44 0 01-.099.272l-.153.398-.189.497c-.068.181-.138.371-.209.57h1.306a26.56 26.56 0 00-.394-1.067c-.06-.15-.112-.283-.156-.398a17.567 17.567 0 00-.106-.272zM32.753 18.011c-.481 0-.83.134-1.044.401-.214.268-.321.633-.321 1.097 0 .226.026.43.079.614.053.183.133.341.239.474.106.132.238.235.398.308.159.073.344.109.556.109.115 0 .214-.002.295-.006.082-.005.154-.014.216-.027v-1.598h1.034v2.274a3.832 3.832 0 01-.597.156 5.256 5.256 0 01-1.014.083c-.345 0-.657-.053-.938-.159a1.961 1.961 0 01-.719-.464 2.073 2.073 0 01-.461-.749 2.953 2.953 0 01-.162-1.015c0-.384.059-.724.179-1.021.119-.296.283-.546.49-.752.208-.205.452-.361.733-.467.28-.106.58-.159.898-.159a3.606 3.606 0 011.037.142 2.132 2.132 0 01.488.209l-.299.829a2.586 2.586 0 00-.487-.196 2.077 2.077 0 00-.6-.083zM38.235 20.921v.889h-3.069v-4.594H36.2v3.705h2.035z"}),Object(n.createElement)("path",{d:"M38.898 17.216H39.932V21.810000000000002H38.898z"}),Object(n.createElement)("path",{d:"M44.076 21.81a23.18 23.18 0 00-.961-1.558 15.8 15.8 0 00-1.101-1.452v3.01h-1.021v-4.594h.842c.146.146.307.325.484.537a23.033 23.033 0 011.087 1.428c.181.259.352.507.511.746v-2.711h1.027v4.594h-.868zM46.005 21.81v-4.594h3.102v.868h-2.068v.902h1.836v.848h-1.836v1.107h2.221v.869h-3.255z"})),logoTitle:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 50 30"},Object(n.createElement)("path",{d:"M10.005 10.805a.56.56 0 100-1.122.56.56 0 000 1.122M11.496 9.727a.648.648 0 100-1.295.648.648 0 000 1.295M12.337 19.991H8.759a.497.497 0 01-.409-.779l1.831-2.649a.496.496 0 01.822.009l1.748 2.649a.496.496 0 01-.414.77m2.178-.681l-2.544-4.202v-2.346h.062a.667.667 0 000-1.333H9.068a.667.667 0 100 1.333h.062v2.346L6.586 19.31a1.346 1.346 0 001.205 1.946h5.518c1 0 1.651-1.051 1.206-1.946"}),Object(n.createElement)("path",{d:"M17.67 4.942l.077.003.077.005.076.006.076.009.075.011.075.012.074.014.073.016.073.018.072.019.071.022.07.022.07.025.069.026.068.028.067.029.067.032.065.032.065.034.063.036.063.037.062.038.061.04.059.042.059.043.057.044.057.045.055.047.054.048.053.049.052.051.051.052.049.053.048.054.047.055.046.057.044.057.042.059.042.06.04.06.038.062.037.063.036.064.034.064.033.066.031.066.029.067.028.068.026.069.025.07.023.071.021.071.019.072.018.072.016.074.014.074.013.074.01.075.009.076.007.076.005.077.003.078.001.078v14.082l-.001.078-.003.078-.005.077-.007.076-.009.076-.01.075-.013.074-.014.074-.016.074-.018.072-.019.072-.021.071-.023.071-.025.07-.026.069-.028.068-.029.067-.031.066-.033.066-.034.064-.036.064-.037.063-.038.062-.04.06-.042.06-.042.059-.044.057-.046.057-.047.055-.048.054-.049.053-.051.052-.052.051-.053.049-.054.048-.055.047-.057.045-.057.044-.059.043-.059.042-.061.04-.062.038-.063.037-.063.036-.065.034-.065.032-.067.032-.067.029-.068.028-.069.026-.07.025-.07.022-.071.022-.072.019-.073.018-.073.016-.074.014-.075.012-.075.011-.076.009-.076.006-.077.005-.077.003-.078.001H3.509l-.078-.001-.077-.003-.077-.005-.077-.006-.075-.009-.076-.011-.074-.012-.074-.014-.073-.016-.073-.018-.072-.019-.071-.022-.071-.022-.069-.025-.069-.026-.068-.028-.068-.029-.066-.032-.066-.032-.064-.034-.064-.036-.063-.037-.061-.038-.061-.04-.06-.042-.058-.043-.058-.044-.056-.045-.056-.047-.054-.048-.053-.049-.052-.051-.05-.052-.05-.053-.048-.054-.047-.055-.045-.057-.044-.057-.043-.059-.041-.06-.04-.06-.039-.062-.037-.063-.036-.064-.034-.064-.032-.066-.031-.066-.03-.067-.028-.068-.026-.069-.024-.07-.023-.071-.021-.071-.02-.072-.018-.072-.016-.074-.014-.074-.012-.074-.011-.075-.008-.076-.007-.076-.005-.077-.003-.078-.001-.078V7.959l.001-.078.003-.078.005-.077.007-.076.008-.076.011-.075.012-.074.014-.074.016-.074.018-.072.02-.072.021-.071.023-.071.024-.07.026-.069.028-.068.03-.067.031-.066.032-.066.034-.064.036-.064.037-.063.039-.062.04-.06.041-.06.043-.059.044-.057.045-.057.047-.055.048-.054.05-.053.05-.052.052-.051.053-.049.054-.048.056-.047.056-.045.058-.044.058-.043.06-.042.061-.04.061-.038.063-.037.064-.036.064-.034.066-.032.066-.032.068-.029.068-.028.069-.026.069-.025.071-.022.071-.022.072-.019.073-.018.073-.016.074-.014.074-.012.076-.011.075-.009.077-.006.077-.005.077-.003.078-.001h14.083l.078.001zM3.518 6.441h-.049l-.039.002-.039.002-.039.004-.038.004-.038.005-.037.007-.037.007-.037.008-.036.009-.036.009-.035.011-.035.011-.035.013-.035.013-.034.014-.033.014-.034.016-.032.016-.033.017-.032.018-.031.019-.031.019-.031.02-.03.021-.03.022-.029.022-.028.023-.028.024-.028.024-.027.025-.026.026-.026.026-.025.027-.024.027-.024.028-.023.029-.022.029-.022.03-.02.03-.021.03-.019.031-.019.032-.018.032-.017.032-.016.033-.015.033-.015.034-.014.034-.013.034-.012.035-.012.035-.01.036-.01.036-.009.036-.008.037-.007.037-.006.037-.006.038-.004.038-.003.038-.003.039-.001.04-.001.049v14.064l.001.049.001.04.003.039.003.038.004.038.006.038.006.037.007.037.008.037.009.036.01.036.01.036.012.035.012.035.013.034.014.034.015.034.015.033.016.033.017.032.018.032.019.032.019.031.021.03.02.03.022.03.022.029.023.029.024.028.024.027.025.027.026.026.026.026.027.025.028.024.028.024.028.023.029.022.03.022.03.021.031.02.031.019.031.019.032.018.033.017.032.016.034.016.033.014.034.014.035.013.035.013.035.011.035.011.036.009.036.009.037.008.037.007.037.007.038.005.038.004.039.004.039.002.039.002h14.163l.039-.002.039-.002.038-.004.039-.004.037-.005.038-.007.037-.007.036-.008.036-.009.036-.009.036-.011.035-.011.035-.013.034-.013.034-.014.034-.014.033-.016.033-.016.032-.017.032-.018.032-.019.031-.019.031-.02.03-.021.029-.022.029-.022.029-.023.028-.024.027-.024.027-.025.027-.026.025-.026.025-.027.024-.027.024-.028.023-.029.022-.029.022-.03.021-.03.02-.03.02-.031.018-.032.018-.032.017-.032.017-.033.015-.033.015-.034.014-.034.013-.034.012-.035.011-.035.011-.036.01-.036.009-.036.008-.037.007-.037.006-.037.005-.038.005-.038.003-.038.002-.039.002-.04.001-.049V7.968l-.001-.049-.002-.04-.002-.039-.003-.038-.005-.038-.005-.038-.006-.037-.007-.037-.008-.037-.009-.036-.01-.036-.011-.036-.011-.035-.012-.035-.013-.034-.014-.034-.015-.034-.015-.033-.017-.033-.017-.032-.018-.032-.018-.032-.02-.031-.02-.03-.021-.03-.022-.03-.022-.029-.023-.029-.024-.028-.024-.027-.025-.027-.025-.026-.027-.026-.027-.025-.027-.024-.028-.024-.029-.023-.029-.022-.029-.022-.03-.021-.031-.02-.031-.019-.032-.019-.032-.018-.032-.017-.033-.016-.033-.016-.034-.014-.034-.014-.034-.013-.035-.013-.035-.011-.036-.011-.036-.009-.036-.009-.036-.008-.037-.007-.038-.007-.037-.005-.039-.004-.038-.004-.039-.002-.039-.002H3.518z"}),Object(n.createElement)("path",{d:"M28.058 11.442v1.366h-2.146v5.75H24.31v-5.75h-2.145v-1.366h5.893z"}),Object(n.createElement)("path",{d:"M29.085 11.442H30.687V18.557000000000002H29.085z"}),Object(n.createElement)("path",{d:"M37.607 11.442v1.366h-2.146v5.75h-1.602v-5.75h-2.146v-1.366h5.894zM43.387 17.182v1.376h-4.754v-7.116h1.602v5.74h3.152zM44.414 18.558v-7.116h4.805v1.345h-3.203v1.397h2.844v1.314h-2.844v1.715h3.439v1.345h-5.041z"})),titleLogo:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 50 30"},Object(n.createElement)("path",{d:"M39.066 10.805a.56.56 0 10-.001-1.121.56.56 0 00.001 1.121M40.557 9.727a.647.647 0 100-1.295.647.647 0 000 1.295M41.398 19.991h-3.579c-.4 0-.636-.45-.408-.779l1.83-2.649a.497.497 0 01.823.009l1.748 2.649a.496.496 0 01-.414.77m2.177-.681l-2.543-4.202v-2.346h.061a.667.667 0 000-1.333h-2.965a.666.666 0 100 1.333h.062v2.346l-2.544 4.202a1.347 1.347 0 001.206 1.946h5.518c1 0 1.651-1.051 1.205-1.946"}),Object(n.createElement)("path",{d:"M46.73 4.942l.077.003.077.005.077.006.075.009.076.011.074.012.074.014.073.016.073.018.072.019.071.022.071.022.069.025.069.026.068.028.068.029.066.032.066.032.064.034.064.036.063.037.061.038.061.04.06.042.058.043.058.044.056.045.056.047.054.048.053.049.052.051.05.052.05.053.048.054.047.055.045.057.044.057.043.059.041.06.04.06.039.062.037.063.036.064.034.064.032.066.031.066.03.067.028.068.026.069.024.07.023.071.021.071.02.072.018.072.016.074.014.074.012.074.011.075.008.076.007.076.005.077.003.078.001.078v14.082l-.001.078-.003.078-.005.077-.007.076-.008.076-.011.075-.012.074-.014.074-.016.074-.018.072-.02.072-.021.071-.023.071-.024.07-.026.069-.028.068-.03.067-.031.066-.032.066-.034.064-.036.064-.037.063-.039.062-.04.06-.041.06-.043.059-.044.057-.045.057-.047.055-.048.054-.05.053-.05.052-.052.051-.053.049-.054.048-.056.047-.056.045-.058.044-.058.043-.06.042-.061.04-.061.038-.063.037-.064.036-.064.034-.066.032-.066.032-.068.029-.068.028-.069.026-.069.025-.071.022-.071.022-.072.019-.073.018-.073.016-.074.014-.074.012-.076.011-.075.009-.077.006-.077.005-.077.003-.078.001H32.569l-.078-.001-.077-.003-.077-.005-.076-.006-.076-.009-.075-.011-.075-.012-.074-.014-.073-.016-.073-.018-.071-.019-.072-.022-.07-.022-.07-.025-.069-.026-.068-.028-.067-.029-.067-.032-.065-.032-.065-.034-.063-.036-.063-.037-.062-.038-.06-.04-.06-.042-.059-.043-.057-.044-.057-.045-.055-.047-.054-.048-.053-.049-.052-.051-.051-.052-.049-.053-.048-.054-.047-.055-.045-.057-.045-.057-.042-.059-.042-.06-.04-.06-.038-.062-.037-.063-.036-.064-.034-.064-.033-.066-.031-.066-.029-.067-.028-.068-.026-.069-.025-.07-.023-.071-.021-.071-.019-.072-.018-.072-.016-.074-.014-.074-.013-.074-.01-.075-.009-.076-.007-.076-.005-.077-.002-.078-.001-.078V7.959l.001-.078.002-.078.005-.077.007-.076.009-.076.01-.075.013-.074.014-.074.016-.074.018-.072.019-.072.021-.071.023-.071.025-.07.026-.069.028-.068.029-.067.031-.066.033-.066.034-.064.036-.064.037-.063.038-.062.04-.06.042-.06.042-.059.045-.057.045-.057.047-.055.048-.054.049-.053.051-.052.052-.051.053-.049.054-.048.055-.047.057-.045.057-.044.059-.043.06-.042.06-.04.062-.038.063-.037.063-.036.065-.034.065-.032.067-.032.067-.029.068-.028.069-.026.07-.025.07-.022.072-.022.071-.019.073-.018.073-.016.074-.014.075-.012.075-.011.076-.009.076-.006.077-.005.077-.003.078-.001h14.083l.078.001zM32.579 6.441h-.05l-.039.002-.039.002-.038.004-.038.004-.038.005-.038.007-.037.007-.036.008-.036.009-.036.009-.036.011-.035.011-.035.013-.034.013-.034.014-.034.014-.033.016-.033.016-.032.017-.032.018-.032.019-.031.019-.031.02-.03.021-.029.022-.029.022-.029.023-.028.024-.027.024-.027.025-.026.026-.026.026-.025.027-.024.027-.024.028-.023.029-.022.029-.022.03-.021.03-.02.03-.019.031-.019.032-.018.032-.017.032-.016.033-.016.033-.015.034-.014.034-.013.034-.012.035-.011.035-.011.036-.01.036-.009.036-.008.037-.007.037-.006.037-.005.038-.004.038-.004.038-.002.039-.002.04V22.081l.002.04.002.039.004.038.004.038.005.038.006.037.007.037.008.037.009.036.01.036.011.036.011.035.012.035.013.034.014.034.015.034.016.033.016.033.017.032.018.032.019.032.019.031.02.03.021.03.022.03.022.029.023.029.024.028.024.027.025.027.026.026.026.026.027.025.027.024.028.024.029.023.029.022.029.022.03.021.031.02.031.019.032.019.032.018.032.017.033.016.033.016.034.014.034.014.034.013.035.013.035.011.036.011.036.009.036.009.036.008.037.007.038.007.038.005.038.004.038.004.039.002.039.002h14.163l.039-.002.039-.002.039-.004.038-.004.038-.005.037-.007.037-.007.037-.008.036-.009.036-.009.035-.011.036-.011.034-.013.035-.013.034-.014.033-.014.034-.016.032-.016.033-.017.032-.018.031-.019.031-.019.031-.02.03-.021.03-.022.029-.022.028-.023.028-.024.028-.024.027-.025.026-.026.026-.026.025-.027.024-.027.024-.028.023-.029.022-.029.022-.03.02-.03.021-.03.019-.031.019-.032.018-.032.017-.032.016-.033.016-.033.014-.034.014-.034.013-.034.013-.035.011-.035.011-.036.009-.036.009-.036.008-.037.007-.037.006-.037.006-.038.004-.038.003-.038.003-.039.001-.04.001-.049V7.968l-.001-.049-.001-.04-.003-.039-.003-.038-.004-.038-.006-.038-.006-.037-.007-.037-.008-.037-.009-.036-.009-.036-.011-.036-.011-.035-.013-.035-.013-.034-.014-.034-.014-.034-.016-.033-.016-.033-.017-.032-.018-.032-.019-.032-.019-.031-.021-.03-.02-.03-.022-.03-.022-.029-.023-.029-.024-.028-.024-.027-.025-.027-.026-.026-.026-.026-.027-.025-.028-.024-.028-.024-.028-.023-.029-.022-.03-.022-.03-.021-.031-.02-.031-.019-.031-.019-.032-.018-.033-.017-.032-.016-.034-.016-.033-.014-.034-.014-.035-.013-.034-.013-.036-.011-.035-.011-.036-.009-.036-.009-.037-.008-.037-.007-.037-.007-.038-.005-.038-.004-.039-.004-.039-.002-.039-.002H32.579z"}),Object(n.createElement)("path",{d:"M6.37 11.442v1.366H4.224v5.75H2.622v-5.75H.476v-1.366H6.37z"}),Object(n.createElement)("path",{d:"M7.396 11.442H8.998V18.557000000000002H7.396z"}),Object(n.createElement)("path",{d:"M15.918 11.442v1.366h-2.146v5.75h-1.601v-5.75h-2.146v-1.366h5.893zM21.699 17.182v1.376h-4.754v-7.116h1.602v5.74h3.152zM22.725 18.558v-7.116h4.805v1.345h-3.203v1.397h2.844v1.314h-2.844v1.715h3.44v1.345h-5.042z"})),titleTagLogo:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 50 30"},Object(n.createElement)("path",{d:"M39.066 10.805a.56.56 0 10-.001-1.121.56.56 0 00.001 1.121M40.557 9.727a.647.647 0 100-1.295.647.647 0 000 1.295M41.398 19.991h-3.579c-.4 0-.636-.45-.408-.779l1.83-2.649a.497.497 0 01.823.009l1.748 2.649a.496.496 0 01-.414.77m2.177-.681l-2.543-4.202v-2.346h.061a.667.667 0 000-1.333h-2.965a.666.666 0 100 1.333h.062v2.346l-2.544 4.202a1.347 1.347 0 001.206 1.946h5.518c1 0 1.651-1.051 1.205-1.946"}),Object(n.createElement)("path",{d:"M46.73 4.942l.077.003.077.005.077.006.075.009.076.011.074.012.074.014.073.016.073.018.072.019.071.022.071.022.069.025.069.026.068.028.068.029.066.032.066.032.064.034.064.036.063.037.061.038.061.04.06.042.058.043.058.044.056.045.056.047.054.048.053.049.052.051.05.052.05.053.048.054.047.055.045.057.044.057.043.059.041.06.04.06.039.062.037.063.036.064.034.064.032.066.031.066.03.067.028.068.026.069.024.07.023.071.021.071.02.072.018.072.016.074.014.074.012.074.011.075.008.076.007.076.005.077.003.078.001.078v14.082l-.001.078-.003.078-.005.077-.007.076-.008.076-.011.075-.012.074-.014.074-.016.074-.018.072-.02.072-.021.071-.023.071-.024.07-.026.069-.028.068-.03.067-.031.066-.032.066-.034.064-.036.064-.037.063-.039.062-.04.06-.041.06-.043.059-.044.057-.045.057-.047.055-.048.054-.05.053-.05.052-.052.051-.053.049-.054.048-.056.047-.056.045-.058.044-.058.043-.06.042-.061.04-.061.038-.063.037-.064.036-.064.034-.066.032-.066.032-.068.029-.068.028-.069.026-.069.025-.071.022-.071.022-.072.019-.073.018-.073.016-.074.014-.074.012-.076.011-.075.009-.077.006-.077.005-.077.003-.078.001H32.569l-.078-.001-.077-.003-.077-.005-.076-.006-.076-.009-.075-.011-.075-.012-.074-.014-.073-.016-.073-.018-.071-.019-.072-.022-.07-.022-.07-.025-.069-.026-.068-.028-.067-.029-.067-.032-.065-.032-.065-.034-.063-.036-.063-.037-.062-.038-.06-.04-.06-.042-.059-.043-.057-.044-.057-.045-.055-.047-.054-.048-.053-.049-.052-.051-.051-.052-.049-.053-.048-.054-.047-.055-.045-.057-.045-.057-.042-.059-.042-.06-.04-.06-.038-.062-.037-.063-.036-.064-.034-.064-.033-.066-.031-.066-.029-.067-.028-.068-.026-.069-.025-.07-.023-.071-.021-.071-.019-.072-.018-.072-.016-.074-.014-.074-.013-.074-.01-.075-.009-.076-.007-.076-.005-.077-.002-.078-.001-.078V7.959l.001-.078.002-.078.005-.077.007-.076.009-.076.01-.075.013-.074.014-.074.016-.074.018-.072.019-.072.021-.071.023-.071.025-.07.026-.069.028-.068.029-.067.031-.066.033-.066.034-.064.036-.064.037-.063.038-.062.04-.06.042-.06.042-.059.045-.057.045-.057.047-.055.048-.054.049-.053.051-.052.052-.051.053-.049.054-.048.055-.047.057-.045.057-.044.059-.043.06-.042.06-.04.062-.038.063-.037.063-.036.065-.034.065-.032.067-.032.067-.029.068-.028.069-.026.07-.025.07-.022.072-.022.071-.019.073-.018.073-.016.074-.014.075-.012.075-.011.076-.009.076-.006.077-.005.077-.003.078-.001h14.083l.078.001zM32.579 6.441h-.05l-.039.002-.039.002-.038.004-.038.004-.038.005-.038.007-.037.007-.036.008-.036.009-.036.009-.036.011-.035.011-.035.013-.034.013-.034.014-.034.014-.033.016-.033.016-.032.017-.032.018-.032.019-.031.019-.031.02-.03.021-.029.022-.029.022-.029.023-.028.024-.027.024-.027.025-.026.026-.026.026-.025.027-.024.027-.024.028-.023.029-.022.029-.022.03-.021.03-.02.03-.019.031-.019.032-.018.032-.017.032-.016.033-.016.033-.015.034-.014.034-.013.034-.012.035-.011.035-.011.036-.01.036-.009.036-.008.037-.007.037-.006.037-.005.038-.004.038-.004.038-.002.039-.002.04V22.081l.002.04.002.039.004.038.004.038.005.038.006.037.007.037.008.037.009.036.01.036.011.036.011.035.012.035.013.034.014.034.015.034.016.033.016.033.017.032.018.032.019.032.019.031.02.03.021.03.022.03.022.029.023.029.024.028.024.027.025.027.026.026.026.026.027.025.027.024.028.024.029.023.029.022.029.022.03.021.031.02.031.019.032.019.032.018.032.017.033.016.033.016.034.014.034.014.034.013.035.013.035.011.036.011.036.009.036.009.036.008.037.007.038.007.038.005.038.004.038.004.039.002.039.002h14.163l.039-.002.039-.002.039-.004.038-.004.038-.005.037-.007.037-.007.037-.008.036-.009.036-.009.035-.011.036-.011.034-.013.035-.013.034-.014.033-.014.034-.016.032-.016.033-.017.032-.018.031-.019.031-.019.031-.02.03-.021.03-.022.029-.022.028-.023.028-.024.028-.024.027-.025.026-.026.026-.026.025-.027.024-.027.024-.028.023-.029.022-.029.022-.03.02-.03.021-.03.019-.031.019-.032.018-.032.017-.032.016-.033.016-.033.014-.034.014-.034.013-.034.013-.035.011-.035.011-.036.009-.036.009-.036.008-.037.007-.037.006-.037.006-.038.004-.038.003-.038.003-.039.001-.04.001-.049V7.968l-.001-.049-.001-.04-.003-.039-.003-.038-.004-.038-.006-.038-.006-.037-.007-.037-.008-.037-.009-.036-.009-.036-.011-.036-.011-.035-.013-.035-.013-.034-.014-.034-.014-.034-.016-.033-.016-.033-.017-.032-.018-.032-.019-.032-.019-.031-.021-.03-.02-.03-.022-.03-.022-.029-.023-.029-.024-.028-.024-.027-.025-.027-.026-.026-.026-.026-.027-.025-.028-.024-.028-.024-.028-.023-.029-.022-.03-.022-.03-.021-.031-.02-.031-.019-.031-.019-.032-.018-.033-.017-.032-.016-.034-.016-.033-.014-.034-.014-.035-.013-.034-.013-.036-.011-.035-.011-.036-.009-.036-.009-.037-.008-.037-.007-.037-.007-.038-.005-.038-.004-.039-.004-.039-.002-.039-.002H32.579z"}),Object(n.createElement)("path",{d:"M6.37 8.104V9.47H4.224v5.749H2.622V9.47H.476V8.104H6.37z"}),Object(n.createElement)("path",{d:"M7.396 8.104H8.998V15.219H7.396z"}),Object(n.createElement)("path",{d:"M15.918 8.104V9.47h-2.146v5.749h-1.601V9.47h-2.146V8.104h5.893zM21.699 13.844v1.375h-4.754V8.104h1.602v5.74h3.152zM22.725 15.219V8.104h4.805v1.345h-3.203v1.397h2.844v1.314h-2.844v1.714h3.44v1.345h-5.042z"}),Object(n.createElement)("path",{d:"M4.282 17.216v.881H2.897v3.713H1.863v-3.713H.477v-.881h3.805zM7.477 21.81a10.389 10.389 0 00-.162-.491c-.06-.168-.118-.336-.176-.504h-1.79c-.057.168-.116.336-.175.504-.06.168-.114.332-.163.491H3.937a85.2 85.2 0 01.491-1.373c.155-.419.306-.815.454-1.186.148-.371.294-.724.438-1.057.143-.334.292-.66.447-.978h.988a37.492 37.492 0 011.339 3.221c.155.42.318.878.49 1.373H7.477zm-1.239-3.554a5.468 5.468 0 01-.1.272l-.152.398a56.25 56.25 0 00-.398 1.067h1.306a26.56 26.56 0 00-.394-1.067c-.06-.15-.112-.283-.156-.398l-.106-.272zM11.256 18.011c-.482 0-.83.134-1.044.401-.214.268-.322.633-.322 1.097 0 .226.027.43.08.614.053.183.133.341.239.474.106.132.238.235.397.308.159.073.345.109.557.109.115 0 .213-.002.295-.006.082-.005.154-.014.216-.027v-1.598h1.034v2.274a3.832 3.832 0 01-.597.156 5.256 5.256 0 01-1.014.083c-.345 0-.658-.053-.938-.159a1.953 1.953 0 01-1.18-1.213 2.953 2.953 0 01-.163-1.015c0-.384.06-.724.179-1.021a2.21 2.21 0 01.491-.752c.208-.205.452-.361.733-.467.28-.106.58-.159.898-.159a3.594 3.594 0 011.037.142 2.132 2.132 0 01.487.209l-.298.829a2.614 2.614 0 00-.487-.196 2.077 2.077 0 00-.6-.083zM16.738 20.921v.889h-3.069v-4.594h1.034v3.705h2.035z"}),Object(n.createElement)("path",{d:"M17.401 17.216H18.435V21.810000000000002H17.401z"}),Object(n.createElement)("path",{d:"M22.579 21.81a23.197 23.197 0 00-.962-1.558 15.615 15.615 0 00-1.1-1.452v3.01h-1.021v-4.594h.842c.146.146.307.325.484.537.177.212.357.438.54.679.183.241.366.491.547.749.181.259.351.507.51.746v-2.711h1.028v4.594h-.868zM24.508 21.81v-4.594h3.102v.868h-2.068v.902h1.836v.848h-1.836v1.107h2.22v.869h-3.254z"})),topLogoTitleTag:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 50 30"},Object(n.createElement)("path",{d:"M24.55 5.112a.463.463 0 100-.925.463.463 0 000 .925M25.78 4.223a.536.536 0 10-.001-1.071.536.536 0 00.001 1.071M26.474 12.691h-2.952a.41.41 0 01-.337-.642l1.51-2.186a.41.41 0 01.679.007l1.442 2.186a.41.41 0 01-.342.635m1.797-.562l-2.099-3.466V6.726h.051a.55.55 0 100-1.099h-2.446a.55.55 0 100 1.099h.051v1.937l-2.099 3.466a1.11 1.11 0 00.994 1.606h4.554a1.11 1.11 0 00.994-1.606"}),Object(n.createElement)("path",{d:"M30.874.274l.064.003.063.004.063.005.063.007.062.009.061.01.061.012.061.013.06.015.059.016.059.017.058.019.058.021.057.021.056.023.055.024.055.026.054.027.053.028.053.029.052.031.051.032.05.033.049.034.048.035.048.037.046.037.046.039.045.04.043.04.043.042.042.043.041.044.039.044.039.046.038.046.036.048.035.048.034.05.033.05.032.051.031.051.029.053.028.053.027.054.026.055.024.056.023.056.022.057.02.057.019.058.017.059.016.059.015.06.013.061.012.061.01.061.009.062.007.063.006.063.004.063.002.064.001.064v11.62l-.001.064-.002.064-.004.064-.006.063-.007.062-.009.062-.01.062-.012.061-.013.06-.015.06-.016.06-.017.058-.019.058-.02.058-.022.057-.023.056-.024.056-.026.054-.027.054-.028.054-.029.052-.031.052-.032.051-.033.05-.034.049-.035.049-.036.047-.038.047-.039.045-.039.045-.041.044-.042.043-.043.041-.043.041-.045.04-.046.038-.046.038-.048.036-.048.036-.049.034-.05.033-.051.031-.052.031-.053.029-.053.029-.054.026-.055.026-.055.024-.056.023-.057.022-.058.02-.058.019-.059.018-.059.016-.06.014-.061.014-.061.011-.061.01-.062.009-.063.007-.063.006-.063.004-.064.002-.064.001H19.19l-.064-.001-.064-.002-.063-.004-.063-.006-.063-.007-.062-.009-.061-.01-.061-.011-.061-.014-.06-.014-.059-.016-.059-.018-.058-.019-.058-.02-.057-.022-.056-.023-.055-.024-.055-.026-.054-.026-.053-.029-.053-.029-.052-.031-.051-.031-.05-.033-.049-.034-.048-.036-.048-.036-.046-.038-.046-.038-.045-.04-.043-.041-.043-.041-.042-.043-.041-.044-.039-.045-.039-.045-.038-.047-.036-.047-.035-.049-.034-.049-.033-.05-.032-.051-.031-.052-.029-.052-.028-.054-.027-.054-.026-.054-.024-.056-.023-.056-.022-.057-.02-.058-.019-.058-.017-.058-.016-.06-.015-.06-.013-.06-.012-.061-.01-.062-.009-.062-.007-.062-.006-.063-.004-.064-.002-.064-.001-.064V2.763l.001-.064.002-.064.004-.063.006-.063.007-.063.009-.062.01-.061.012-.061.013-.061.015-.06.016-.059.017-.059.019-.058.02-.057.022-.057.023-.056.024-.056.026-.055.027-.054.028-.053.029-.053.031-.051.032-.051.033-.05.034-.05.035-.048.036-.048.038-.046.039-.046.039-.044.041-.044.042-.043.043-.042.043-.04.045-.04.046-.039.046-.037.048-.037.048-.035.049-.034.05-.033.051-.032.052-.031.053-.029.053-.028.054-.027.055-.026.055-.024.056-.023.057-.021.058-.021.058-.019.059-.017.059-.016.06-.015.061-.013.061-.012.061-.01.062-.009.063-.007.063-.005.063-.004.064-.003.064-.001h11.62l.064.001zM19.2 1.773l-.036.001-.026.001-.025.001-.026.003-.024.003-.025.003-.024.004-.024.005-.024.005-.024.006-.023.006-.023.007-.023.007-.023.008-.022.009-.022.009-.022.009-.022.01-.021.011-.021.011-.021.012-.02.012-.021.013-.02.013-.019.013-.02.015-.019.014-.018.015-.019.016-.018.016-.017.016-.018.017-.016.017-.017.018-.016.017-.015.019-.015.019-.015.019-.014.019-.013.02-.014.02-.012.02-.012.02-.012.021-.011.021-.011.022-.01.021-.01.022-.009.022-.008.023-.008.022-.008.023-.006.023-.007.023-.005.024-.006.024-.004.024-.004.024-.004.025-.003.025-.002.025-.001.025-.001.026-.001.036v11.601l.001.035.001.026.001.026.002.025.003.025.004.024.004.025.004.024.006.024.005.023.007.023.006.023.008.023.008.023.008.022.009.022.01.022.01.022.011.021.011.021.012.021.012.021.012.02.014.02.013.02.014.019.015.019.015.019.015.018.016.018.017.018.016.017.018.017.017.016.018.016.019.015.018.015.019.015.02.014.019.014.02.013.021.013.02.012.021.011.021.012.021.01.022.01.022.01.022.009.022.008.023.008.023.008.023.007.023.006.024.006.024.005.024.005.024.004.025.003.024.003.026.002.025.002.026.001H30.836l.026-.001.025-.002.026-.002.024-.003.025-.003.024-.004.024-.005.024-.005.024-.006.023-.006.023-.007.023-.008.023-.008.022-.008.022-.009.022-.01.022-.01.021-.01.021-.012.021-.011.02-.012.021-.013.02-.013.019-.014.02-.014.019-.015.018-.015.019-.015.018-.016.017-.016.018-.017.016-.017.017-.018.016-.018.015-.018.015-.019.015-.019.014-.019.013-.02.014-.02.012-.02.012-.021.012-.021.011-.021.011-.021.01-.022.01-.022.009-.022.008-.022.008-.023.008-.023.006-.023.007-.023.005-.023.006-.024.004-.024.004-.025.004-.024.003-.025.002-.025.001-.026.001-.026.001-.035V2.773l-.001-.036-.001-.026-.001-.025-.002-.025-.003-.025-.004-.025-.004-.024-.004-.024-.006-.024-.005-.023-.007-.024-.006-.023-.008-.023-.008-.022-.008-.023-.009-.022-.01-.022-.01-.021-.011-.022-.011-.021-.012-.021-.012-.02-.012-.02-.014-.02-.013-.02-.014-.019-.015-.019-.015-.019-.015-.019-.016-.017-.017-.018-.016-.017-.018-.017-.017-.016-.018-.016-.019-.016-.018-.015-.019-.014-.02-.015-.019-.013-.02-.013-.021-.013-.02-.012-.021-.012-.021-.011-.021-.011-.022-.01-.022-.009-.022-.009-.022-.009-.023-.008-.023-.007-.023-.007-.023-.006-.024-.006-.024-.005-.024-.005-.024-.004-.025-.003-.024-.003-.026-.003-.025-.001-.026-.001-.036-.001H19.2z"}),Object(n.createElement)("path",{d:"M18.613 18.217v1.125h-1.768v4.738h-1.32v-4.738h-1.768v-1.125h4.856z"}),Object(n.createElement)("path",{d:"M19.459 18.217H20.779V24.08H19.459z"}),Object(n.createElement)("path",{d:"M26.48 18.217v1.125h-1.768v4.738h-1.319v-4.738h-1.768v-1.125h4.855zM31.243 22.946v1.134h-3.917v-5.863h1.32v4.729h2.597zM32.089 24.08v-5.863h3.96v1.108h-2.64v1.151h2.343v1.083h-2.343v1.413h2.834v1.108h-4.154z"}),Object(n.createElement)("path",{d:"M16.893 25.725v.726h-1.142v3.059h-.852v-3.059h-1.141v-.726h3.135zM19.526 29.51a9.526 9.526 0 00-.134-.404c-.049-.139-.098-.277-.145-.415h-1.475l-.144.415c-.05.138-.094.273-.134.404h-.885c.142-.408.277-.785.404-1.131a40.258 40.258 0 01.735-1.849c.118-.275.241-.543.368-.805h.814a28.892 28.892 0 01.729 1.677c.122.305.247.631.375.977.127.346.262.723.404 1.131h-.912zm-1.022-2.928a4.547 4.547 0 01-.082.224l-.125.328a36.184 36.184 0 00-.328.879h1.076c-.058-.164-.115-.32-.169-.469-.055-.15-.107-.286-.156-.41a26.237 26.237 0 01-.128-.328 28.526 28.526 0 00-.088-.224zM22.639 26.38c-.397 0-.684.11-.86.331-.177.22-.265.521-.265.904 0 .185.022.354.065.505.044.151.11.281.197.39.087.11.197.194.328.254s.284.09.459.09c.094 0 .175-.001.243-.005.067-.004.126-.011.177-.022v-1.316h.852v1.873c-.102.04-.266.083-.491.129a4.369 4.369 0 01-.836.068 2.18 2.18 0 01-.773-.131 1.623 1.623 0 01-.593-.383 1.71 1.71 0 01-.379-.617 2.426 2.426 0 01-.134-.835c0-.317.049-.598.147-.842.099-.244.234-.45.405-.62.171-.169.372-.297.603-.385.231-.087.478-.131.74-.131a2.957 2.957 0 01.855.118 1.804 1.804 0 01.402.172l-.246.683a2.274 2.274 0 00-.402-.162 1.725 1.725 0 00-.494-.068zM27.156 28.778v.732h-2.529v-3.785h.852v3.053h1.677z"}),Object(n.createElement)("path",{d:"M27.702 25.725H28.554000000000002V29.51H27.702z"}),Object(n.createElement)("path",{d:"M31.968 29.51a19.313 19.313 0 00-.792-1.284 13.158 13.158 0 00-.906-1.196v2.48h-.842v-3.785h.694c.12.12.253.267.399.442.146.175.294.361.445.56.151.198.301.404.451.617.149.213.289.418.42.615v-2.234h.847v3.785h-.716zM33.558 29.51v-3.785h2.556v.715H34.41v.743h1.513v.699H34.41v.912h1.83v.716h-2.682z"})),topLogoTitle:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 50 30"},Object(n.createElement)("path",{d:"M24.455 6.271a.561.561 0 100-1.123.561.561 0 000 1.123M25.946 5.193a.648.648 0 10-.001-1.295.648.648 0 00.001 1.295M26.787 15.456h-3.579a.496.496 0 01-.408-.778l1.83-2.65a.497.497 0 01.823.009l1.748 2.649a.496.496 0 01-.414.77m2.178-.681l-2.544-4.201V8.227h.062a.666.666 0 100-1.333h-2.966a.667.667 0 000 1.333h.062v2.347l-2.543 4.201a1.347 1.347 0 001.205 1.947h5.518c1 0 1.651-1.052 1.206-1.947"}),Object(n.createElement)("path",{d:"M32.119.407l.078.003.077.005.076.007.076.009.075.01.074.012.074.015.074.016.072.017.072.02.071.021.071.023.07.024.069.027.068.028.067.029.066.031.066.033.064.034.064.035.063.037.062.039.06.04.06.041.059.043.057.044.057.046.055.047.054.048.053.049.052.051.051.051.049.053.048.055.047.055.045.056.044.058.043.059.042.059.04.061.038.062.037.062.036.064.034.065.032.065.032.067.029.067.028.068.026.069.025.07.022.07.022.071.019.072.018.073.016.073.014.074.012.075.011.075.009.076.006.076.005.077.003.077.001.078v14.083l-.001.078-.003.077-.005.077-.006.076-.009.076-.011.075-.012.075-.014.074-.016.073-.018.073-.019.072-.022.071-.022.07-.025.07-.026.069-.028.068-.029.067-.032.067-.032.065-.034.065-.036.064-.037.062-.038.062-.04.061-.042.059-.043.059-.044.058-.045.056-.047.055-.048.055-.049.053-.051.051-.052.051-.053.049-.054.049-.055.046-.057.046-.057.044-.059.043-.06.041-.06.04-.062.039-.063.037-.064.035-.064.034-.066.033-.066.031-.067.029-.068.028-.069.027-.07.024-.071.023-.071.021-.072.02-.072.017-.074.016-.074.015-.074.012-.075.011-.076.008-.076.007-.077.005-.078.003-.078.001H17.959l-.078-.001-.078-.003-.077-.005-.076-.007-.076-.008-.075-.011-.074-.012-.074-.015-.074-.016-.072-.017-.072-.02-.071-.021-.071-.023-.07-.024-.069-.027-.068-.028-.067-.029-.066-.031-.066-.033-.064-.034-.064-.035-.063-.037-.062-.039-.06-.04-.06-.041-.059-.043-.057-.044-.057-.046-.055-.046-.054-.049-.053-.049-.052-.051-.051-.051-.049-.053-.048-.055-.047-.055-.045-.056-.044-.058-.043-.059-.042-.059-.04-.061-.038-.062-.037-.062-.036-.064-.034-.065-.032-.065-.032-.067-.029-.067-.028-.068-.026-.069-.025-.07-.022-.07-.022-.071-.019-.072-.018-.073-.016-.073-.014-.074-.012-.075-.011-.075-.009-.076-.006-.076-.005-.077-.003-.077-.001-.078V3.424l.001-.078.003-.077.005-.077.006-.076.009-.076.011-.075.012-.075.014-.074.016-.073.018-.073.019-.072.022-.071.022-.07.025-.07.026-.069.028-.068.029-.067.032-.067.032-.065.034-.065.036-.064.037-.062.038-.062.04-.061.042-.059.043-.059.044-.058.045-.056.047-.055.048-.055.049-.053.051-.051.052-.051.053-.049.054-.048.055-.047.057-.046.057-.044.059-.043.06-.041.06-.04.062-.039.063-.037.064-.035.064-.034.066-.033.066-.031.067-.029.068-.028.069-.027.07-.024.071-.023.071-.021.072-.02.072-.017.074-.016.074-.015.074-.012.075-.01.076-.009.076-.007.077-.005.078-.003.078-.001h14.082l.078.001zM17.968 1.906l-.049.001-.04.001-.039.003-.038.003-.038.005-.038.005-.037.006-.037.007-.037.008-.036.009-.036.01-.036.01-.035.012-.035.012-.034.013-.034.014-.034.015-.033.015-.033.017-.032.017-.032.018-.032.018-.031.02-.03.02-.03.021-.03.021-.029.023-.029.023-.028.023-.027.025-.027.025-.026.025-.026.027-.025.026-.024.028-.024.028-.023.028-.022.029-.022.03-.021.03-.02.031-.019.031-.019.031-.018.032-.017.033-.016.033-.016.033-.014.034-.014.034-.013.034-.013.035-.011.035-.011.035-.009.036-.009.037-.008.036-.007.037-.007.038-.005.037-.004.038-.004.039-.002.039-.002.039v14.163l.002.039.002.039.004.039.004.038.005.037.007.038.007.037.008.036.009.037.009.036.011.035.011.035.013.035.013.034.014.034.014.034.016.033.016.033.017.033.018.032.019.031.019.031.02.031.021.03.022.03.022.029.023.028.024.028.024.028.025.027.026.026.026.025.027.025.027.025.028.023.029.023.029.023.03.021.03.021.03.02.031.02.032.018.032.018.032.017.033.017.033.015.034.015.034.014.034.013.035.012.035.012.036.01.036.01.036.009.037.008.037.007.037.006.038.005.038.005.038.003.039.003.04.001.049.001h14.064l.049-.001.04-.001.039-.003.038-.003.038-.005.038-.005.037-.006.037-.007.037-.008.036-.009.036-.01.036-.01.035-.012.035-.012.034-.013.034-.014.034-.015.033-.015.033-.017.032-.017.032-.018.032-.018.031-.02.03-.02.03-.021.03-.021.029-.023.029-.023.028-.023.027-.025.027-.025.026-.025.026-.027.025-.026.024-.028.024-.028.023-.028.022-.029.022-.03.021-.03.02-.031.019-.031.019-.031.018-.032.017-.033.016-.033.016-.033.014-.034.014-.034.013-.034.013-.035.011-.035.011-.035.009-.036.009-.037.008-.036.007-.037.007-.038.005-.037.004-.038.004-.039.002-.039.002-.039V3.384l-.002-.039-.002-.039-.004-.039-.004-.038-.005-.037-.007-.038-.007-.037-.008-.036-.009-.037-.009-.036-.011-.035-.011-.035-.013-.035-.013-.034-.014-.034-.014-.034-.016-.033-.016-.033-.017-.033-.018-.032-.019-.031-.019-.031-.02-.031-.021-.03-.022-.029-.022-.03-.023-.028-.024-.028-.024-.028-.025-.026-.026-.027-.026-.025-.027-.025-.027-.025-.028-.023-.029-.023-.029-.023-.03-.021-.03-.021-.03-.02-.031-.02-.032-.018-.032-.018-.032-.017-.033-.017-.033-.015-.034-.015-.034-.014-.034-.013-.035-.012-.035-.012-.036-.01-.036-.01-.036-.009-.037-.008-.037-.007-.037-.006-.038-.005-.038-.005-.038-.003-.039-.003-.04-.001-.049-.001H17.968z"}),Object(n.createElement)("path",{d:"M17.248 22.408v1.366h-2.146v5.75h-1.601v-5.75h-2.146v-1.366h5.893z"}),Object(n.createElement)("path",{d:"M18.275 22.408H19.877V29.523000000000003H18.275z"}),Object(n.createElement)("path",{d:"M26.797 22.408v1.366h-2.146v5.75h-1.602v-5.75h-2.146v-1.366h5.894zM32.577 28.148v1.376h-4.753v-7.116h1.601v5.74h3.152zM33.604 29.524v-7.116h4.805v1.345h-3.203v1.397h2.844v1.314h-2.844v1.715h3.439v1.345h-5.041z"})),topTitleLogo:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 50 30"},Object(n.createElement)("path",{d:"M24.455 15.239a.561.561 0 100-1.123.561.561 0 000 1.123M25.946 14.161a.648.648 0 10-.001-1.295.648.648 0 00.001 1.295M26.787 24.424h-3.579a.496.496 0 01-.408-.778l1.83-2.65a.497.497 0 01.823.009l1.748 2.649a.496.496 0 01-.414.77m2.178-.681l-2.544-4.201v-2.347h.062a.666.666 0 100-1.333h-2.966a.667.667 0 000 1.333h.062v2.347l-2.543 4.201a1.347 1.347 0 001.205 1.947h5.518c1 0 1.651-1.052 1.206-1.947"}),Object(n.createElement)("path",{d:"M32.119 9.375l.078.003.077.005.076.007.076.009.075.01.074.012.074.015.074.016.072.017.072.02.071.021.071.023.07.024.069.027.068.028.067.029.066.031.066.033.064.034.064.035.063.037.062.039.06.04.06.041.059.043.057.044.057.046.055.047.054.048.053.049.052.051.051.051.049.053.048.055.047.055.045.056.044.058.043.059.042.059.04.061.038.062.037.062.036.064.034.065.032.065.032.067.029.067.028.068.026.069.025.07.022.07.022.071.019.072.018.073.016.073.014.074.012.075.011.075.009.076.006.076.005.077.003.077.001.078v14.083l-.001.078-.003.077-.005.077-.006.076-.009.076-.011.075-.012.075-.014.074-.016.073-.018.073-.019.072-.022.071-.022.07-.025.07-.026.069-.028.068-.029.067-.032.067-.032.065-.034.065-.036.064-.037.062-.038.062-.04.061-.042.059-.043.059-.044.058-.045.056-.047.055-.048.055-.049.053-.051.051-.052.051-.053.049-.054.049-.055.046-.057.046-.057.044-.059.043-.06.041-.06.04-.062.039-.063.037-.064.035-.064.034-.066.033-.066.031-.067.029-.068.028-.069.027-.07.024-.071.023-.071.021-.072.02-.072.017-.074.016-.074.015-.074.012-.075.011-.076.008-.076.007-.077.005-.078.003-.078.001H17.959l-.078-.001-.078-.003-.077-.005-.076-.007-.076-.008-.075-.011-.074-.012-.074-.015-.074-.016-.072-.017-.072-.02-.071-.021-.071-.023-.07-.024-.069-.027-.068-.028-.067-.029-.066-.031-.066-.033-.064-.034-.064-.035-.063-.037-.062-.039-.06-.04-.06-.041-.059-.043-.057-.044-.057-.046-.055-.046-.054-.049-.053-.049-.052-.051-.051-.051-.049-.053-.048-.055-.047-.055-.045-.056-.044-.058-.043-.059-.042-.059-.04-.061-.038-.062-.037-.062-.036-.064-.034-.065-.032-.065-.032-.067-.029-.067-.028-.068-.026-.069-.025-.07-.022-.07-.022-.071-.019-.072-.018-.073-.016-.073-.014-.074-.012-.075-.011-.075-.009-.076-.006-.076-.005-.077-.003-.077-.001-.078V12.392l.001-.078.003-.077.005-.077.006-.076.009-.076.011-.075.012-.075.014-.074.016-.073.018-.073.019-.072.022-.071.022-.07.025-.07.026-.069.028-.068.029-.067.032-.067.032-.065.034-.065.036-.064.037-.062.038-.062.04-.061.042-.059.043-.059.044-.058.045-.056.047-.055.048-.055.049-.053.051-.051.052-.051.053-.049.054-.048.055-.047.057-.046.057-.044.059-.043.06-.041.06-.04.062-.039.063-.037.064-.035.064-.034.066-.033.066-.031.067-.029.068-.028.069-.027.07-.024.071-.023.071-.021.072-.02.072-.017.074-.016.074-.015.074-.012.075-.01.076-.009.076-.007.077-.005.078-.003.078-.001h14.082l.078.001zm-14.151 1.499l-.049.001-.04.001-.039.003-.038.003-.038.005-.038.005-.037.006-.037.007-.037.008-.036.009-.036.01-.036.01-.035.012-.035.012-.034.013-.034.014-.034.015-.033.015-.033.017-.032.017-.032.018-.032.018-.031.02-.03.02-.03.021-.03.021-.029.023-.029.023-.028.023-.027.025-.027.025-.026.025-.026.027-.025.026-.024.028-.024.028-.023.028-.022.029-.022.03-.021.03-.02.031-.019.031-.019.031-.018.032-.017.033-.016.033-.016.033-.014.034-.014.034-.013.034-.013.035-.011.035-.011.035-.009.036-.009.037-.008.036-.007.037-.007.038-.005.037-.004.038-.004.039-.002.039-.002.039V26.515l.002.039.002.039.004.039.004.038.005.037.007.038.007.037.008.036.009.037.009.036.011.035.011.035.013.035.013.034.014.034.014.034.016.033.016.033.017.033.018.032.019.031.019.031.02.031.021.03.022.03.022.029.023.028.024.028.024.028.025.026.026.027.026.025.027.025.027.025.028.023.029.023.029.023.03.021.03.021.03.02.031.02.032.018.032.018.032.017.033.017.033.015.034.015.034.014.034.013.035.012.035.012.036.01.036.01.036.009.037.008.037.007.037.006.038.005.038.005.038.003.039.003.04.001.049.001h14.064l.049-.001.04-.001.039-.003.038-.003.038-.005.038-.005.037-.006.037-.007.037-.008.036-.009.036-.01.036-.01.035-.012.035-.012.034-.013.034-.014.034-.015.033-.015.033-.017.032-.017.032-.018.032-.018.031-.02.03-.02.03-.021.03-.021.029-.023.029-.023.028-.023.027-.025.027-.025.026-.025.026-.027.025-.026.024-.028.024-.028.023-.028.022-.029.022-.03.021-.03.02-.031.019-.031.019-.031.018-.032.017-.033.016-.033.016-.033.014-.034.014-.034.013-.034.013-.035.011-.035.011-.035.009-.036.009-.037.008-.036.007-.037.007-.038.005-.037.004-.038.004-.039.002-.039.002-.039V12.352l-.002-.039-.002-.039-.004-.039-.004-.038-.005-.037-.007-.038-.007-.037-.008-.036-.009-.037-.009-.036-.011-.035-.011-.035-.013-.035-.013-.034-.014-.034-.014-.034-.016-.033-.016-.033-.017-.033-.018-.032-.019-.031-.019-.031-.02-.031-.021-.03-.022-.03-.022-.029-.023-.028-.024-.028-.024-.028-.025-.026-.026-.027-.026-.025-.027-.025-.027-.025-.028-.023-.029-.023-.029-.023-.03-.021-.03-.021-.03-.02-.031-.02-.032-.018-.032-.018-.032-.017-.033-.017-.033-.015-.034-.015-.034-.014-.034-.013-.035-.012-.035-.012-.036-.01-.036-.01-.036-.009-.037-.008-.037-.007-.037-.006-.038-.005-.038-.005-.038-.003-.039-.003-.04-.001-.049-.001H17.968z"}),Object(n.createElement)("path",{d:"M17.248.447v1.365h-2.146v5.75h-1.601v-5.75h-2.146V.447h5.893z"}),Object(n.createElement)("path",{d:"M18.275 0.447H19.877V7.562H18.275z"}),Object(n.createElement)("path",{d:"M26.797.447v1.365h-2.146v5.75h-1.602v-5.75h-2.146V.447h5.894zM32.577 6.186v1.376h-4.753V.447h1.601v5.739h3.152zM33.604 7.562V.447h4.805v1.345h-3.203v1.396h2.844v1.314h-2.844v1.715h3.439v1.345h-5.041z"})),topTitleTagLogo:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 50 30"},Object(n.createElement)("path",{d:"M24.55 18.025a.463.463 0 100-.925.463.463 0 000 .925M25.78 17.135a.535.535 0 100-1.07.535.535 0 000 1.07M26.474 25.604h-2.952a.41.41 0 01-.337-.643l1.51-2.186a.41.41 0 01.679.008l1.442 2.185a.41.41 0 01-.342.636m1.797-.562l-2.099-3.467v-1.936h.051a.55.55 0 100-1.1h-2.446a.55.55 0 100 1.1h.051v1.936l-2.099 3.467a1.11 1.11 0 00.994 1.606h4.554a1.11 1.11 0 00.994-1.606"}),Object(n.createElement)("path",{d:"M30.874 13.187l.064.002.063.004.063.006.063.007.062.009.061.01.061.012.061.013.06.014.059.017.059.017.058.019.058.02.057.022.056.023.055.024.055.026.054.027.053.028.053.029.052.031.051.032.05.033.049.034.048.035.048.036.046.038.046.039.045.039.043.041.043.042.042.042.041.044.039.045.039.046.038.046.036.048.035.048.034.049.033.05.032.051.031.052.029.053.028.053.027.054.026.055.024.055.023.056.022.057.02.058.019.058.017.059.016.059.015.06.013.06.012.061.01.062.009.062.007.063.006.063.004.063.002.064.001.064v11.62l-.001.064-.002.064-.004.063-.006.063-.007.063-.009.062-.01.061-.012.061-.013.061-.015.06-.016.059-.017.059-.019.058-.02.058-.022.056-.023.057-.024.055-.026.055-.027.054-.028.053-.029.053-.031.052-.032.05-.033.051-.034.049-.035.048-.036.048-.038.046-.039.046-.039.045-.041.043-.042.043-.043.042-.043.041-.045.039-.046.039-.046.037-.048.037-.048.035-.049.034-.05.033-.051.032-.052.031-.053.029-.053.028-.054.027-.055.026-.055.024-.056.023-.057.022-.058.02-.058.019-.059.017-.059.016-.06.015-.061.013-.061.012-.061.01-.062.009-.063.007-.063.006-.063.004-.064.002-.064.001H19.19l-.064-.001-.064-.002-.063-.004-.063-.006-.063-.007-.062-.009-.061-.01-.061-.012-.061-.013-.06-.015-.059-.016-.059-.017-.058-.019-.058-.02-.057-.022-.056-.023-.055-.024-.055-.026-.054-.027-.053-.028-.053-.029-.052-.031-.051-.032-.05-.033-.049-.034-.048-.035-.048-.037-.046-.037-.046-.039-.045-.039-.043-.041-.043-.042-.042-.043-.041-.043-.039-.045-.039-.046-.038-.046-.036-.048-.035-.048-.034-.049-.033-.051-.032-.05-.031-.052-.029-.053-.028-.053-.027-.054-.026-.055-.024-.055-.023-.057-.022-.056-.02-.058-.019-.058-.017-.059-.016-.059-.015-.06-.013-.061-.012-.061-.01-.061-.009-.062-.007-.063-.006-.063-.004-.063-.002-.064-.001-.064v-11.62l.001-.064.002-.064.004-.063.006-.063.007-.063.009-.062.01-.062.012-.061.013-.06.015-.06.016-.059.017-.059.019-.058.02-.058.022-.057.023-.056.024-.055.026-.055.027-.054.028-.053.029-.053.031-.052.032-.051.033-.05.034-.049.035-.048.036-.048.038-.046.039-.046.039-.045.041-.044.042-.042.043-.042.043-.041.045-.039.046-.039.046-.038.048-.036.048-.035.049-.034.05-.033.051-.032.052-.031.053-.029.053-.028.054-.027.055-.026.055-.024.056-.023.057-.022.058-.02.058-.019.059-.017.059-.017.06-.014.061-.013.061-.012.061-.01.062-.009.063-.007.063-.006.063-.004.064-.002.064-.001h11.62l.064.001zM19.2 14.686h-.036l-.026.001-.025.002-.026.002-.024.003-.025.004-.024.004-.024.004-.024.005-.024.006-.023.007-.023.006-.023.008-.023.008-.022.008-.022.009-.022.01-.022.01-.021.011-.021.011-.021.011-.02.013-.021.012-.02.013-.019.014-.02.014-.019.015-.018.015-.019.015-.018.016-.017.017-.018.016-.016.018-.017.017-.016.018-.015.018-.015.019-.015.019-.014.02-.014.019-.013.02-.012.02-.012.021-.012.021-.011.021-.011.021-.01.022-.01.022-.009.022-.008.022-.008.023-.008.023-.006.023-.007.023-.005.024-.006.023-.004.025-.004.024-.004.024-.003.025-.002.025-.001.026-.001.026-.001.035v11.601l.001.036.001.026.001.025.002.026.003.024.004.025.004.024.004.024.006.024.005.024.007.023.006.023.008.023.008.022.008.023.009.022.01.022.01.021.011.022.011.021.012.021.012.02.012.021.013.02.014.019.014.02.015.019.015.018.015.019.016.018.017.017.016.017.018.017.017.017.018.016.019.015.018.015.019.015.02.014.019.013.02.014.021.012.02.012.021.012.021.011.021.011.022.01.022.01.022.009.022.008.023.008.023.007.023.007.023.007.024.005.024.006.024.004.024.004.025.004.024.003.026.002.025.001.026.001.036.001h11.6l.036-.001.026-.001.025-.001.026-.002.024-.003.025-.004.024-.004.024-.004.024-.006.024-.005.023-.007.023-.007.023-.007.023-.008.022-.008.022-.009.022-.01.022-.01.021-.011.021-.011.021-.012.02-.012.021-.012.02-.014.019-.013.02-.014.019-.015.018-.015.019-.015.018-.016.017-.017.018-.017.016-.017.017-.017.016-.018.015-.019.015-.018.015-.019.014-.02.014-.019.013-.02.012-.021.012-.02.012-.021.011-.021.011-.022.01-.021.01-.022.009-.022.008-.023.008-.022.008-.023.006-.023.007-.023.005-.024.006-.024.004-.024.004-.024.004-.025.003-.024.002-.026.001-.025.001-.026.001-.036V15.685l-.001-.035-.001-.026-.001-.026-.002-.025-.003-.025-.004-.024-.004-.024-.004-.025-.006-.023-.005-.024-.007-.023-.006-.023-.008-.023-.008-.023-.008-.022-.009-.022-.01-.022-.01-.022-.011-.021-.011-.021-.012-.021-.012-.021-.012-.02-.013-.02-.014-.019-.014-.02-.015-.019-.015-.019-.015-.018-.016-.018-.017-.017-.016-.018-.018-.016-.017-.017-.018-.016-.019-.015-.018-.015-.019-.015-.02-.014-.019-.014-.02-.013-.021-.012-.02-.013-.021-.011-.021-.011-.021-.011-.022-.01-.022-.01-.022-.009-.022-.008-.023-.008-.023-.008-.023-.006-.023-.007-.024-.006-.024-.005-.024-.004-.024-.004-.025-.004-.024-.003-.026-.002-.025-.002-.026-.001H19.2z"}),Object(n.createElement)("path",{d:"M18.613.297v1.125h-1.768v4.737h-1.32V1.422h-1.768V.297h4.856z"}),Object(n.createElement)("path",{d:"M19.459 0.297H20.779V6.16H19.459z"}),Object(n.createElement)("path",{d:"M26.48.297v1.125h-1.768v4.737h-1.319V1.422h-1.768V.297h4.855zM31.243 5.026v1.133h-3.917V.297h1.32v4.729h2.597zM32.089 6.159V.297h3.96v1.108h-2.64v1.15h2.343v1.083h-2.343v1.413h2.834v1.108h-4.154z"}),Object(n.createElement)("path",{d:"M16.893 7.804v.726h-1.142v3.059h-.852V8.53h-1.141v-.726h3.135zM19.526 11.589a9.526 9.526 0 00-.134-.404 34.118 34.118 0 01-.145-.415h-1.475c-.047.138-.095.277-.144.415-.05.138-.094.273-.134.404h-.885c.142-.408.277-.784.404-1.13.128-.346.252-.672.374-.978.122-.306.242-.596.361-.871.118-.275.241-.544.368-.806h.814a28.966 28.966 0 01.729 1.677c.122.306.247.632.375.978.127.346.262.722.404 1.13h-.912zm-1.022-2.927a4.96 4.96 0 01-.082.224l-.125.327a45.295 45.295 0 00-.328.88h1.076l-.169-.47a19.504 19.504 0 00-.156-.41 34.949 34.949 0 01-.128-.327l-.088-.224zM22.639 8.459c-.397 0-.684.111-.86.331-.177.22-.265.522-.265.904 0 .186.022.354.065.505.044.151.11.281.197.391a.886.886 0 00.328.254c.131.06.284.09.459.09.094 0 .175-.002.243-.006.067-.003.126-.011.177-.021V9.59h.852v1.874a3.3 3.3 0 01-.491.128 4.29 4.29 0 01-.836.068c-.284 0-.542-.043-.773-.131a1.621 1.621 0 01-.593-.382 1.718 1.718 0 01-.379-.617 2.432 2.432 0 01-.134-.836c0-.317.049-.597.147-.841.099-.244.234-.451.405-.62.171-.17.372-.298.603-.385.231-.088.478-.131.74-.131a2.963 2.963 0 01.855.117 1.681 1.681 0 01.402.172l-.246.683a2.2 2.2 0 00-.402-.161 1.69 1.69 0 00-.494-.069zM27.156 10.857v.732h-2.529V7.804h.852v3.053h1.677z"}),Object(n.createElement)("path",{d:"M27.702 7.804H28.554000000000002V11.589H27.702z"}),Object(n.createElement)("path",{d:"M31.968 11.589a19.04 19.04 0 00-.792-1.283 13.173 13.173 0 00-.906-1.197v2.48h-.842V7.804h.694c.12.12.253.268.399.442.146.175.294.362.445.56.151.199.301.405.451.618.149.213.289.417.42.614V7.804h.847v3.785h-.716zM33.558 11.589V7.804h2.556v.716H34.41v.742h1.513v.7H34.41v.912h1.83v.715h-2.682z"})),topTitleLogoTag:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 50 30"},Object(n.createElement)("path",{d:"M24.55 12.52a.463.463 0 100-.925.463.463 0 000 .925M25.78 11.63a.535.535 0 100-1.07.535.535 0 000 1.07M26.474 20.099h-2.952a.41.41 0 01-.337-.643l1.51-2.185a.41.41 0 01.679.007l1.442 2.186a.41.41 0 01-.342.635m1.797-.562l-2.099-3.467v-1.936h.051a.55.55 0 100-1.1h-2.446a.55.55 0 000 1.1h.051v1.936l-2.099 3.467a1.11 1.11 0 00.994 1.606h4.554a1.11 1.11 0 00.994-1.606"}),Object(n.createElement)("path",{d:"M30.874 7.682l.064.002.063.004.063.006.063.007.062.009.061.01.061.012.061.013.06.015.059.016.059.017.058.019.058.02.057.022.056.023.055.024.055.026.054.027.053.028.053.029.052.031.051.032.05.033.049.034.048.035.048.037.046.037.046.039.045.039.043.041.043.042.042.043.041.043.039.045.039.046.038.046.036.048.035.048.034.049.033.051.032.05.031.052.029.053.028.053.027.054.026.055.024.055.023.057.022.056.02.058.019.058.017.059.016.059.015.06.013.061.012.061.01.061.009.062.007.063.006.063.004.063.002.064.001.064v11.62l-.001.064-.002.064-.004.063-.006.063-.007.063-.009.062-.01.062-.012.061-.013.06-.015.06-.016.059-.017.059-.019.058-.02.058-.022.057-.023.056-.024.055-.026.055-.027.054-.028.053-.029.053-.031.052-.032.051-.033.05-.034.049-.035.048-.036.048-.038.046-.039.046-.039.045-.041.044-.042.042-.043.042-.043.041-.045.039-.046.039-.046.038-.048.036-.048.035-.049.034-.05.033-.051.032-.052.031-.053.029-.053.028-.054.027-.055.026-.055.024-.056.023-.057.022-.058.02-.058.019-.059.017-.059.017-.06.014-.061.013-.061.012-.061.01-.062.009-.063.007-.063.006-.063.004-.064.002-.064.001H19.19l-.064-.001-.064-.002-.063-.004-.063-.006-.063-.007-.062-.009-.061-.01-.061-.012-.061-.013-.06-.014-.059-.017-.059-.017-.058-.019-.058-.02-.057-.022-.056-.023-.055-.024-.055-.026-.054-.027-.053-.028-.053-.029-.052-.031-.051-.032-.05-.033-.049-.034-.048-.035-.048-.036-.046-.038-.046-.039-.045-.039-.043-.041-.043-.042-.042-.042-.041-.044-.039-.045-.039-.046-.038-.046-.036-.048-.035-.048-.034-.049-.033-.05-.032-.051-.031-.052-.029-.053-.028-.053-.027-.054-.026-.055-.024-.055-.023-.056-.022-.057-.02-.058-.019-.058-.017-.059-.016-.059-.015-.06-.013-.06-.012-.061-.01-.062-.009-.062-.007-.063-.006-.063-.004-.063-.002-.064-.001-.064v-11.62l.001-.064.002-.064.004-.063.006-.063.007-.063.009-.062.01-.061.012-.061.013-.061.015-.06.016-.059.017-.059.019-.058.02-.058.022-.056.023-.057.024-.055.026-.055.027-.054.028-.053.029-.053.031-.052.032-.05.033-.051.034-.049.035-.048.036-.048.038-.046.039-.046.039-.045.041-.043.042-.043.043-.042.043-.041.045-.039.046-.039.046-.037.048-.037.048-.035.049-.034.05-.033.051-.032.052-.031.053-.029.053-.028.054-.027.055-.026.055-.024.056-.023.057-.022.058-.02.058-.019.059-.017.059-.016.06-.015.061-.013.061-.012.061-.01.062-.009.063-.007.063-.006.063-.004.064-.002.064-.001h11.62l.064.001zM19.2 9.181l-.036.001-.026.001-.025.001-.026.003-.024.002-.025.004-.024.004-.024.004-.024.006-.024.005-.023.007-.023.007-.023.007-.023.008-.022.008-.022.009-.022.01-.022.01-.021.011-.021.011-.021.012-.02.012-.021.012-.02.014-.019.013-.02.014-.019.015-.018.015-.019.016-.018.015-.017.017-.018.017-.016.017-.017.017-.016.018-.015.019-.015.018-.015.019-.014.02-.013.019-.014.02-.012.021-.012.02-.012.021-.011.021-.011.022-.01.021-.01.022-.009.022-.008.023-.008.022-.008.023-.006.023-.007.023-.005.024-.006.024-.004.024-.004.024-.004.025-.003.024-.002.026-.001.025-.001.026-.001.036v11.601l.001.035.001.026.001.026.002.025.003.025.004.024.004.024.004.025.006.023.005.024.007.023.006.023.008.023.008.023.008.022.009.022.01.022.01.022.011.021.011.021.012.021.012.021.012.02.014.02.013.019.014.02.015.019.015.019.015.018.016.018.017.017.016.018.018.016.017.017.018.016.019.015.018.015.019.015.02.014.019.014.02.013.021.012.02.013.021.011.021.011.021.011.022.01.022.01.022.009.022.008.023.008.023.008.023.006.023.007.024.006.024.005.024.004.024.004.025.004.024.003.026.002.025.002.026.001H30.836l.026-.001.025-.002.026-.002.024-.003.025-.004.024-.004.024-.004.024-.005.024-.006.023-.007.023-.006.023-.008.023-.008.022-.008.022-.009.022-.01.022-.01.021-.011.021-.011.021-.011.02-.013.021-.012.02-.013.019-.014.02-.014.019-.015.018-.015.019-.015.018-.016.017-.017.018-.016.016-.018.017-.017.016-.018.015-.018.015-.019.015-.019.014-.02.013-.019.014-.02.012-.02.012-.021.012-.021.011-.021.011-.021.01-.022.01-.022.009-.022.008-.022.008-.023.008-.023.006-.023.007-.023.005-.024.006-.023.004-.025.004-.024.004-.024.003-.025.002-.025.001-.026.001-.026.001-.035V10.181l-.001-.036-.001-.026-.001-.025-.002-.026-.003-.024-.004-.025-.004-.024-.004-.024-.006-.024-.005-.024-.007-.023-.006-.023-.008-.023-.008-.022-.008-.023-.009-.022-.01-.022-.01-.021-.011-.022-.011-.021-.012-.021-.012-.02-.012-.021-.014-.02-.013-.019-.014-.02-.015-.019-.015-.018-.015-.019-.016-.018-.017-.017-.016-.017-.018-.017-.017-.017-.018-.015-.019-.016-.018-.015-.019-.015-.02-.014-.019-.013-.02-.014-.021-.012-.02-.012-.021-.012-.021-.011-.021-.011-.022-.01-.022-.01-.022-.009-.022-.008-.023-.008-.023-.007-.023-.007-.023-.007-.024-.005-.024-.006-.024-.004-.024-.004-.025-.004-.024-.002-.026-.003-.025-.001-.026-.001-.036-.001H19.2z"}),Object(n.createElement)("path",{d:"M18.613.297v1.125h-1.768v4.737h-1.32V1.422h-1.768V.297h4.856z"}),Object(n.createElement)("path",{d:"M19.459 0.297H20.779V6.16H19.459z"}),Object(n.createElement)("path",{d:"M26.48.297v1.125h-1.768v4.737h-1.319V1.422h-1.768V.297h4.855zM31.243 5.026v1.133h-3.917V.297h1.32v4.729h2.597zM32.089 6.159V.297h3.96v1.108h-2.64v1.15h2.343v1.083h-2.343v1.413h2.834v1.108h-4.154z"}),Object(n.createElement)("path",{d:"M16.893 25.935v.726h-1.142v3.059h-.852v-3.059h-1.141v-.726h3.135zM19.526 29.72a9.526 9.526 0 00-.134-.404c-.049-.139-.098-.277-.145-.416h-1.475a34.18 34.18 0 01-.144.416c-.05.138-.094.273-.134.404h-.885c.142-.408.277-.785.404-1.131a33.985 33.985 0 01.735-1.849c.118-.275.241-.543.368-.805h.814a28.892 28.892 0 01.729 1.676c.122.306.247.632.375.978.127.346.262.723.404 1.131h-.912zm-1.022-2.928a4.547 4.547 0 01-.082.224l-.125.328a44.432 44.432 0 00-.328.879h1.076l-.169-.47a19.3 19.3 0 00-.156-.409 26.237 26.237 0 01-.128-.328 28.526 28.526 0 00-.088-.224zM22.639 26.59c-.397 0-.684.11-.86.33-.177.221-.265.522-.265.904 0 .186.022.355.065.506.044.151.11.281.197.39a.886.886 0 00.328.254c.131.06.284.09.459.09.094 0 .175-.001.243-.005.067-.004.126-.011.177-.022v-1.316h.852v1.873c-.102.04-.266.083-.491.129a4.369 4.369 0 01-.836.068 2.18 2.18 0 01-.773-.131 1.623 1.623 0 01-.593-.383 1.71 1.71 0 01-.379-.617 2.428 2.428 0 01-.134-.836c0-.316.049-.597.147-.841.099-.244.234-.45.405-.62.171-.169.372-.297.603-.385.231-.087.478-.131.74-.131a2.957 2.957 0 01.855.118 1.69 1.69 0 01.402.172l-.246.682a2.353 2.353 0 00-.402-.161 1.725 1.725 0 00-.494-.068zM27.156 28.988v.732h-2.529v-3.785h.852v3.053h1.677z"}),Object(n.createElement)("path",{d:"M27.702 25.935H28.554000000000002V29.72H27.702z"}),Object(n.createElement)("path",{d:"M31.968 29.72a19.059 19.059 0 00-.792-1.284 13.158 13.158 0 00-.906-1.196v2.48h-.842v-3.785h.694c.12.12.253.267.399.442.146.175.294.361.445.56.151.198.301.404.451.617.149.213.289.418.42.615v-2.234h.847v3.785h-.716zM33.558 29.72v-3.785h2.556v.715H34.41v.743h1.513v.699H34.41v.912h1.83v.716h-2.682z"})),px:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{d:"M2.896 6.603h1.419v.92h.027c.21-.394.504-.677.88-.848a2.926 2.926 0 011.223-.256c.534 0 1.001.094 1.399.283.399.188.73.447.993.775.263.329.46.712.591 1.15.132.438.197.907.197 1.407 0 .455-.059.898-.177 1.327a3.455 3.455 0 01-.539 1.137 2.699 2.699 0 01-.913.789c-.368.197-.802.295-1.302.295-.219 0-.438-.019-.657-.059a2.855 2.855 0 01-.631-.19 2.51 2.51 0 01-.558-.336 1.823 1.823 0 01-.427-.479h-.027v3.391H2.896V6.603zm5.231 3.404c0-.306-.039-.604-.118-.894a2.418 2.418 0 00-.355-.768 1.829 1.829 0 00-.592-.539 1.603 1.603 0 00-.814-.204c-.631 0-1.107.219-1.427.657-.319.438-.479 1.021-.479 1.748 0 .342.041.66.125.953.083.294.208.546.374.756.167.21.366.377.598.499.232.123.502.184.809.184.341 0 .63-.07.867-.21.237-.14.432-.322.585-.545a2.21 2.21 0 00.328-.763 3.86 3.86 0 00.099-.874zM12.714 9.823l-2.353-3.22h1.814l1.42 2.09 1.485-2.09h1.735l-2.313 3.141 2.602 3.654h-1.801l-1.721-2.51-1.67 2.51h-1.761l2.563-3.575z"}))),em:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{d:"M6.248 9.402a2.401 2.401 0 00-.152-.683 1.704 1.704 0 00-.867-.967 1.56 1.56 0 00-.69-.151c-.263 0-.502.046-.716.138a1.633 1.633 0 00-.552.381 1.886 1.886 0 00-.368.572 2.002 2.002 0 00-.152.71h3.497zm-3.497.986c0 .263.038.517.112.762.075.245.186.46.335.644.149.184.338.331.565.44.228.11.5.165.815.165.438 0 .791-.095 1.058-.283.268-.188.467-.471.598-.848h1.42a2.824 2.824 0 01-1.104 1.716 2.99 2.99 0 01-.914.446c-.337.101-.69.152-1.058.152-.534 0-1.007-.088-1.419-.263a2.95 2.95 0 01-1.045-.736 3.12 3.12 0 01-.644-1.131 4.577 4.577 0 01-.217-1.445c0-.482.077-.94.23-1.374.153-.434.372-.815.657-1.143a3.13 3.13 0 011.032-.782c.403-.193.859-.29 1.367-.29a3.04 3.04 0 011.439.336c.425.223.778.519 1.058.887.281.368.484.791.611 1.268.127.478.16.971.099 1.479H2.751zM8.889 6.602h1.42v.947h.039c.114-.167.237-.32.368-.46a2.022 2.022 0 01.999-.585c.211-.057.451-.086.723-.086.412 0 .795.092 1.15.276.355.184.607.469.756.855a3.01 3.01 0 01.881-.828c.333-.202.749-.303 1.248-.303.719 0 1.277.176 1.676.526.399.351.598.938.598 1.761v4.693h-1.498v-3.97c0-.271-.009-.519-.027-.742a1.512 1.512 0 00-.151-.579.856.856 0 00-.374-.374c-.167-.088-.395-.132-.684-.132-.508 0-.876.158-1.104.473-.228.316-.342.763-.342 1.341v3.983h-1.498V9.034c0-.473-.085-.83-.256-1.071-.171-.241-.484-.362-.94-.362-.193 0-.379.04-.559.119a1.385 1.385 0 00-.473.341 1.703 1.703 0 00-.328.552 2.084 2.084 0 00-.125.75v4.035H8.889V6.602z"}))),percent:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("path",{fillRule:"nonzero",d:"M5.689 7.831c0 .246.017.476.053.69.035.215.092.401.17.559.079.158.182.283.309.375a.775.775 0 00.467.138.803.803 0 00.473-.138.978.978 0 00.315-.375 2.11 2.11 0 00.178-.559c.039-.214.059-.444.059-.69 0-.219-.015-.433-.046-.644a1.995 1.995 0 00-.164-.565 1.076 1.076 0 00-.316-.401.794.794 0 00-.499-.151.797.797 0 00-.5.151 1.02 1.02 0 00-.308.401 1.992 1.992 0 00-.152.565 5.253 5.253 0 00-.039.644zm1.012 2.616c-.394 0-.732-.07-1.012-.21a1.899 1.899 0 01-.684-.566 2.316 2.316 0 01-.381-.828 4.148 4.148 0 01-.118-1.012c0-.35.042-.685.125-1.005.083-.32.215-.598.394-.835.18-.236.408-.425.684-.565.276-.14.606-.21.992-.21s.716.07.992.21c.276.14.504.329.684.565.179.237.311.515.394.835.083.32.125.655.125 1.005 0 .36-.039.697-.118 1.012a2.3 2.3 0 01-.382.828 1.887 1.887 0 01-.683.566c-.28.14-.618.21-1.012.21zm5.586 1.722c0 .245.017.475.053.69.035.214.092.401.17.558.079.158.182.283.309.375a.775.775 0 00.467.138.803.803 0 00.473-.138.978.978 0 00.315-.375c.079-.157.138-.344.178-.558.039-.215.059-.445.059-.69 0-.219-.015-.434-.046-.644a1.992 1.992 0 00-.164-.566 1.065 1.065 0 00-.316-.4.795.795 0 00-.499-.152.798.798 0 00-.5.152 1.01 1.01 0 00-.308.4 1.99 1.99 0 00-.152.566c-.026.21-.039.425-.039.644zm1.012 2.615c-.394 0-.732-.07-1.012-.21a1.885 1.885 0 01-.683-.565 2.317 2.317 0 01-.382-.828 4.16 4.16 0 01-.118-1.012c0-.351.042-.686.125-1.006.083-.32.215-.598.394-.834.18-.237.408-.425.684-.566.276-.14.606-.21.992-.21s.716.07.992.21c.276.141.504.329.684.566.179.236.311.514.394.834.083.32.125.655.125 1.006 0 .359-.039.696-.118 1.012a2.332 2.332 0 01-.381.828 1.897 1.897 0 01-.684.565c-.28.14-.618.21-1.012.21zm-1.341-9.7h.999l-5.086 9.832H6.846l5.112-9.832z"})),rem:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{d:"M.731 7.079H1.94v1.13h.023c.038-.158.111-.313.22-.463.11-.151.241-.289.396-.413.154-.124.326-.224.514-.3.189-.075.381-.113.577-.113.151 0 .254.004.311.012l.175.022v1.244a5.951 5.951 0 00-.277-.04 2.393 2.393 0 00-.277-.017 1.424 1.424 0 00-1.119.514c-.143.17-.256.379-.339.628a2.712 2.712 0 00-.125.859v2.781H.731V7.079zM8.519 9.486a2.057 2.057 0 00-.13-.587 1.534 1.534 0 00-.294-.492 1.433 1.433 0 00-.452-.339 1.327 1.327 0 00-.593-.13c-.226 0-.432.039-.616.118-.185.08-.343.189-.475.328-.132.14-.238.304-.317.492a1.727 1.727 0 00-.13.61h3.007zm-3.007.848c0 .226.032.445.096.656.064.211.161.395.289.554.128.158.29.284.486.378.196.095.429.142.701.142.376 0 .68-.081.91-.243.229-.162.401-.405.514-.73h1.221a2.422 2.422 0 01-.95 1.476 2.597 2.597 0 01-.785.384c-.291.087-.594.13-.91.13-.46 0-.867-.075-1.221-.226a2.535 2.535 0 01-.899-.633 2.69 2.69 0 01-.554-.972 3.964 3.964 0 01-.186-1.244c0-.414.066-.808.198-1.181.131-.373.32-.701.565-.983.245-.283.54-.507.887-.673A2.692 2.692 0 017.05 6.92c.459 0 .872.096 1.237.289.366.192.669.446.91.763.242.316.417.68.526 1.09.109.411.138.835.085 1.272H5.512zM10.791 7.079h1.221v.813h.034c.098-.143.203-.275.317-.395a1.722 1.722 0 01.859-.503c.18-.049.388-.074.621-.074.355 0 .684.079.989.238.306.158.522.403.65.734.219-.301.471-.538.758-.712.286-.173.644-.26 1.074-.26.618 0 1.098.151 1.441.452.343.302.514.807.514 1.515v4.036h-1.288V9.509c0-.234-.008-.447-.023-.639a1.292 1.292 0 00-.13-.497.737.737 0 00-.322-.322c-.143-.076-.339-.113-.588-.113-.437 0-.754.135-.95.407-.195.271-.293.655-.293 1.153v3.425h-1.289V9.17c0-.407-.074-.714-.221-.921-.146-.208-.416-.311-.808-.311a1.192 1.192 0 00-.887.395 1.48 1.48 0 00-.283.475 1.815 1.815 0 00-.107.644v3.471h-1.289V7.079z"}))),vh:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{d:"M3.271 6.603H4.9l1.722 5.218h.026l1.656-5.218h1.551l-2.431 6.795H5.742L3.271 6.603zM10.762 4.014h1.499v3.483h.026c.184-.307.458-.563.821-.769a2.425 2.425 0 011.216-.309c.745 0 1.332.193 1.761.578.43.386.644.964.644 1.735v4.666h-1.498V9.127c-.017-.535-.131-.923-.342-1.164-.21-.241-.538-.361-.985-.361-.254 0-.482.046-.684.138a1.484 1.484 0 00-.512.381c-.141.162-.25.353-.329.572a2.035 2.035 0 00-.118.696v4.009h-1.499V4.014z"}))),vw:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{d:"M1.621 6.603h1.63l1.722 5.218h.026l1.656-5.218h1.551l-2.432 6.795H4.092L1.621 6.603zM8.495 6.603h1.59l1.328 5.073h.026l1.275-5.073h1.512l1.222 5.073h.026l1.38-5.073h1.525l-2.129 6.795h-1.538L13.45 8.351h-.026l-1.249 5.047h-1.577L8.495 6.603z"}))),none:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("path",{d:"M17.401 4.69L15.31 2.599 2.599 15.31l2.091 2.091L17.401 4.69z"}),Object(n.createElement)("path",{d:"M4.69 2.599L2.599 4.69 15.31 17.401l2.091-2.091L4.69 2.599z"})),solid:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("path",{d:"M18.988 11.478V8.522H1.012v2.956h17.976z"})),dashed:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("path",{d:"M12.512 11.478V8.522H7.488v2.956h5.024zM14.004 8.522v2.956h4.984V8.522h-4.984zM1.012 8.522v2.956H6.05V8.522H1.012z"})),dotted:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("circle",{cx:"2.503",cy:"10",r:"1.487"}),Object(n.createElement)("circle",{cx:"17.486",cy:"10",r:"1.487"}),Object(n.createElement)("circle",{cx:"12.447",cy:"10",r:"1.487"}),Object(n.createElement)("circle",{cx:"7.455",cy:"10",r:"1.487"})),double:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("path",{d:"M1.02 6.561v2.957h17.968V6.561H1.02zM1.012 10.586v2.956H18.98v-2.956H1.012z"})),lowercase:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{d:"M9.1 13.181c0 .184.024.315.072.394.048.079.142.118.283.118h.157a.953.953 0 00.211-.026v1.038a3.222 3.222 0 01-.204.06 3.035 3.035 0 01-.743.111c-.306 0-.561-.061-.762-.184-.202-.122-.333-.337-.394-.644-.298.289-.664.5-1.098.631a4.303 4.303 0 01-1.255.197c-.307 0-.6-.041-.881-.125a2.302 2.302 0 01-.742-.368 1.764 1.764 0 01-.513-.617 1.904 1.904 0 01-.19-.874c0-.421.076-.763.23-1.026.153-.262.354-.468.604-.617.25-.149.53-.257.841-.322.311-.066.625-.116.94-.152.272-.052.53-.089.776-.111a3.6 3.6 0 00.65-.112c.189-.053.337-.134.447-.243.11-.11.164-.274.164-.493a.765.765 0 00-.138-.473.931.931 0 00-.341-.283 1.5 1.5 0 00-.454-.131 3.61 3.61 0 00-.473-.033c-.421 0-.767.088-1.038.263-.272.175-.425.447-.46.815H3.29c.027-.438.132-.802.316-1.091.184-.289.418-.522.703-.697.285-.175.607-.298.966-.368s.727-.105 1.104-.105c.333 0 .662.035.986.105.324.07.615.184.874.342.258.158.466.361.624.611.158.25.237.554.237.914v3.496zm-1.499-1.893a1.822 1.822 0 01-.841.27 10.7 10.7 0 00-.999.138 3.18 3.18 0 00-.46.111c-.149.048-.28.114-.394.197a.874.874 0 00-.27.329c-.065.136-.098.3-.098.493 0 .166.048.307.144.42.097.114.213.204.349.27.136.066.285.112.447.138.162.026.309.039.44.039.166 0 .346-.022.539-.065.193-.044.374-.119.545-.224.171-.105.314-.239.427-.401.114-.162.171-.361.171-.598v-1.117zM10.756 5.308h1.498v3.47h.026c.106-.167.233-.316.382-.447.149-.132.313-.243.492-.335a2.62 2.62 0 01.566-.211c.197-.048.392-.072.584-.072.535 0 1.002.094 1.4.283.399.188.73.446.993.775.262.329.46.712.591 1.15.132.438.197.907.197 1.406 0 .456-.059.899-.177 1.328a3.475 3.475 0 01-.539 1.137 2.713 2.713 0 01-.914.789c-.368.197-.801.295-1.301.295-.228 0-.458-.015-.69-.046a2.614 2.614 0 01-.664-.177c-.21-.088-.4-.202-.571-.342a1.645 1.645 0 01-.427-.552h-.027v.933h-1.419V5.308zm5.231 5.993c0-.306-.04-.604-.118-.894a2.44 2.44 0 00-.355-.768 1.818 1.818 0 00-.592-.539 1.604 1.604 0 00-.815-.204c-.631 0-1.106.219-1.426.657-.32.438-.479 1.021-.479 1.748 0 .342.041.66.124.953.084.294.209.546.375.756.166.21.366.377.598.499.232.123.502.184.808.184.342 0 .631-.07.868-.21.236-.14.431-.322.585-.545a2.21 2.21 0 00.328-.763 3.86 3.86 0 00.099-.874z"}))),uppercase:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{d:"M4.789 5.308h1.748l3.614 9.384H8.39l-.881-2.484H3.763l-.88 2.484H1.187l3.602-9.384zm-.579 5.651h2.866L5.669 6.924H5.63l-1.42 4.035zM12.688 9.238h2.681c.394 0 .723-.112.986-.335.263-.224.394-.546.394-.967 0-.473-.118-.806-.355-.998-.236-.193-.578-.29-1.025-.29h-2.681v2.59zm-1.643-3.93h4.561c.841 0 1.516.193 2.024.578.508.386.762.968.762 1.748 0 .473-.116.879-.348 1.216-.232.337-.563.598-.993.782v.026c.579.123 1.017.397 1.315.822.298.425.447.957.447 1.597 0 .368-.066.712-.197 1.031a2.11 2.11 0 01-.618.828c-.281.233-.64.417-1.078.553-.438.135-.959.203-1.564.203h-4.311V5.308zm1.643 8.044h2.905c.499 0 .887-.13 1.163-.388.276-.259.414-.624.414-1.098 0-.464-.138-.821-.414-1.071-.276-.25-.664-.374-1.163-.374h-2.905v2.931z"}))),capitalize:Object(n.createElement)("svg",{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{d:"M5.393 5.216h1.748l3.615 9.384H8.995l-.881-2.484H4.368L3.487 14.6H1.792l3.601-9.384zm-.578 5.651H7.68L6.274 6.832h-.04l-1.419 4.035zM11.479 5.216h1.498v3.47h.026c.105-.167.232-.316.381-.447a2.38 2.38 0 01.493-.335 2.62 2.62 0 01.566-.211c.197-.048.392-.072.584-.072.535 0 1.001.094 1.4.283.399.188.73.446.993.775.262.329.46.712.591 1.15.131.438.197.907.197 1.406 0 .456-.059.899-.177 1.328a3.475 3.475 0 01-.539 1.137 2.713 2.713 0 01-.914.789c-.368.197-.801.295-1.301.295-.228 0-.458-.015-.69-.046a2.614 2.614 0 01-.664-.177 2.278 2.278 0 01-.571-.342 1.66 1.66 0 01-.428-.552h-.026v.933h-1.419V5.216zm5.231 5.993c0-.306-.04-.604-.119-.894a2.416 2.416 0 00-.354-.768 1.818 1.818 0 00-.592-.539 1.604 1.604 0 00-.815-.204c-.631 0-1.106.219-1.426.657-.32.438-.48 1.021-.48 1.748 0 .342.042.66.125.953.084.294.208.546.375.756.166.21.366.377.598.499.232.123.502.184.808.184.342 0 .631-.07.868-.21.236-.14.431-.322.585-.545.153-.224.262-.478.328-.763a3.86 3.86 0 00.099-.874z"}))),menu:Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 84.2 81"},Object(n.createElement)("path",{className:"st0",d:"M0.3,77.4V4c0-2,1.6-3.5,3.5-3.5h76.9c2,0,3.5,1.6,3.5,3.5v73.5c0,2-1.6,3.5-3.5,3.5H3.9\r C1.9,81,0.4,79.4,0.3,77.4z M3.9,2.2C2.9,2.2,2.1,3,2.1,4v73.5c0,1,0.8,1.8,1.8,1.8h76.9c1,0,1.8-0.8,1.8-1.8V4\r c0-1-0.8-1.8-1.8-1.8H3.9z"}),Object(n.createElement)("g",null,Object(n.createElement)("path",{className:"st0",d:"M14.8,28.4c0-1.2,0.8-2.1,1.8-2.1h50.9c1,0,1.8,0.9,1.8,2.1v-0.6c0,1.2-0.8,2.1-1.8,2.1H16.6\r c-1,0-1.8-0.9-1.8-2.1V28.4L14.8,28.4z"})),Object(n.createElement)("g",null,Object(n.createElement)("path",{className:"st0",d:"M14.8,40.8c0-1.2,0.8-2.1,1.8-2.1h50.9c1,0,1.8,0.9,1.8,2.1v-0.6c0,1.2-0.8,2.1-1.8,2.1H16.6\r c-1,0-1.8-0.9-1.8-2.1V40.8L14.8,40.8z"})),Object(n.createElement)("g",null,Object(n.createElement)("path",{className:"st0",d:"M14.8,53.2c0-1.2,0.8-2.1,1.8-2.1h50.9c1,0,1.8,0.9,1.8,2.1v-0.6c0,1.2-0.8,2.1-1.8,2.1H16.6\r c-1,0-1.8-0.9-1.8-2.1V53.2L14.8,53.2z"}))),menu2:Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 84.2 81"},Object(n.createElement)("path",{className:"st0",d:"M0.1,77.2V3.8c0-2,1.6-3.5,3.5-3.5h76.9c2,0,3.5,1.6,3.5,3.5v73.5c0,2-1.6,3.5-3.5,3.5H3.7\r C1.7,80.8,0.2,79.2,0.1,77.2z M3.7,2c-1,0-1.8,0.8-1.8,1.8v73.5c0,1,0.8,1.8,1.8,1.8h76.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8H3.7z"}),Object(n.createElement)("g",null,Object(n.createElement)("g",null,Object(n.createElement)("path",{className:"st0",d:"M14.7,56c0-1.2,0.8-2.1,1.8-2.1h50.8c1,0,1.8,0.9,1.8,2.1v3.5c0,1.2-0.8,2.1-1.8,2.1H16.5\r c-1,0-1.8-0.9-1.8-2.1L14.7,56L14.7,56z"})),Object(n.createElement)("g",null,Object(n.createElement)("path",{className:"st0",d:"M14.7,38.5c0-1.2,0.8-2.1,1.8-2.1h50.8c1,0,1.8,0.9,1.8,2.1V42c0,1.2-0.8,2.1-1.8,2.1H16.5\r c-1,0-1.8-0.9-1.8-2.1L14.7,38.5L14.7,38.5z"})),Object(n.createElement)("g",null,Object(n.createElement)("path",{className:"st0",d:"M14.7,21.1c0-1.2,0.8-2.1,1.8-2.1h50.8c1,0,1.8,0.9,1.8,2.1v3.5c0,1.2-0.8,2.1-1.8,2.1H16.5\r c-1,0-1.8-0.9-1.8-2.1L14.7,21.1L14.7,21.1z"})))),menu3:Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 84.2 81"},Object(n.createElement)("g",null,Object(n.createElement)("path",{className:"st0",d:"M0.3,77.4V4c0-2,1.6-3.5,3.5-3.5h76.9c2,0,3.5,1.6,3.5,3.5v73.5c0,2-1.6,3.5-3.5,3.5H3.9\r C1.9,81,0.4,79.4,0.3,77.4z M3.9,2.2C2.9,2.2,2.1,3,2.1,4v73.5c0,1,0.8,1.8,1.8,1.8h76.9c1,0,1.8-0.8,1.8-1.8V4\r c0-1-0.8-1.8-1.8-1.8H3.9z"})),Object(n.createElement)("circle",{className:"st0",cx:"42.1",cy:"21.5",r:"6.4"}),Object(n.createElement)("circle",{className:"st0",cx:"42.1",cy:"40.5",r:"6.4"}),Object(n.createElement)("circle",{className:"st0",cx:"42.1",cy:"59.5",r:"6.4"})),unlocked:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M5 12h14c.276 0 .525.111.707.293S20 12.724 20 13v7c0 .276-.111.525-.293.707S19.276 21 19 21H5c-.276 0-.525-.111-.707-.293S4 20.276 4 20v-7c0-.276.111-.525.293-.707S4.724 12 5 12zm3-2V7a3.988 3.988 0 011.169-2.831 3.983 3.983 0 012.821-1.174 3.985 3.985 0 012.652 1 4.052 4.052 0 011.28 2.209 1 1 0 101.958-.408 6.051 6.051 0 00-1.912-3.299A5.963 5.963 0 0011.995.995c-1.657.002-3.157.676-4.241 1.762S5.998 5.344 6 7v3H5a2.997 2.997 0 00-3 3v7a2.997 2.997 0 003 3h14a2.997 2.997 0 003-3v-7a2.997 2.997 0 00-3-3z"})),locked:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M5 12h14c.276 0 .525.111.707.293S20 12.724 20 13v7c0 .276-.111.525-.293.707S19.276 21 19 21H5c-.276 0-.525-.111-.707-.293S4 20.276 4 20v-7c0-.276.111-.525.293-.707S4.724 12 5 12zm13-2V7c0-1.657-.673-3.158-1.757-4.243S13.657 1 12 1s-3.158.673-4.243 1.757S6 5.343 6 7v3H5a2.997 2.997 0 00-3 3v7a2.997 2.997 0 003 3h14a2.997 2.997 0 003-3v-7a2.997 2.997 0 00-3-3zM8 10V7c0-1.105.447-2.103 1.172-2.828S10.895 3 12 3s2.103.447 2.828 1.172S16 5.895 16 7v3z"})),fullwidth:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5",clipRule:"evenodd",viewBox:"0 0 50 40"},Object(n.createElement)("path",{fill:"#fff",stroke:"#9a9a9a",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"}),Object(n.createElement)("path",{fill:"#cdcdcd",d:"M1.19 1.153H48.809999999999995V12.969000000000001H1.19z"}),Object(n.createElement)("path",{fill:"#ccc",fillRule:"nonzero",d:"M37.149 34.831H2.714c-.411 0-.749.433-.749.959s.338.959.749.959h34.435c.411 0 .749-.433.749-.959s-.338-.959-.749-.959zM47.038 30.979H2.924a.964.964 0 00-.959.959c0 .527.433.959.959.959h44.114a.963.963 0 00.959-.959.964.964 0 00-.959-.959z"}),Object(n.createElement)("path",{fill:"#cdcdcd",fillRule:"nonzero",d:"M47.038 27.128H2.924a.964.964 0 00-.959.959c0 .526.433.959.959.959h44.114a.964.964 0 00.959-.959.964.964 0 00-.959-.959zM47.038 23.277H2.924a.964.964 0 00-.959.959c0 .526.433.959.959.959h44.114a.964.964 0 00.959-.959.964.964 0 00-.959-.959z"}),Object(n.createElement)("path",{fill:"#ccc",fillRule:"nonzero",d:"M47.038 19.426H2.924a.964.964 0 00-.959.959c0 .526.433.959.959.959h44.114a.964.964 0 00.959-.959.964.964 0 00-.959-.959zM47.038 15.575H2.924a.964.964 0 00-.959.959c0 .526.433.959.959.959h44.114a.964.964 0 00.959-.959.964.964 0 00-.959-.959z"}),Object(n.createElement)("path",{fill:"none",stroke:"#9a9a9a",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"})),normal:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5",clipRule:"evenodd",viewBox:"0 0 50 40"},Object(n.createElement)("path",{fill:"#fff",stroke:"#9a9a9a",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"}),Object(n.createElement)("path",{fill:"#cdcdcd",d:"M7.49 3.877H42.521V13.879000000000001H7.49z"}),Object(n.createElement)("path",{fill:"#ccc",fillRule:"nonzero",d:"M34.237 34.498H8.049c-.313 0-.57.41-.57.908 0 .497.257.907.57.907h26.188c.313 0 .57-.41.57-.907 0-.498-.257-.908-.57-.908zM41.776 30.855H8.226c-.4 0-.729.409-.729.907 0 .498.329.907.729.907h33.55c.399 0 .729-.409.729-.907 0-.498-.33-.907-.729-.907z"}),Object(n.createElement)("path",{fill:"#cdcdcd",fillRule:"nonzero",d:"M41.776 27.211H8.226c-.4 0-.729.41-.729.908 0 .497.329.907.729.907h33.55c.399 0 .729-.41.729-.907 0-.498-.33-.908-.729-.908zM41.776 23.568H8.226c-.4 0-.729.41-.729.907 0 .498.329.908.729.908h33.55c.399 0 .729-.41.729-.908 0-.497-.33-.907-.729-.907z"}),Object(n.createElement)("path",{fill:"#ccc",fillRule:"nonzero",d:"M41.776 19.925H8.226c-.4 0-.729.409-.729.907 0 .498.329.907.729.907h33.55c.399 0 .729-.409.729-.907 0-.498-.33-.907-.729-.907zM41.776 16.281H8.226c-.4 0-.729.41-.729.907 0 .498.329.908.729.908h33.55c.399 0 .729-.41.729-.908 0-.497-.33-.907-.729-.907z"})),narrow:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5",clipRule:"evenodd",viewBox:"0 0 50 40"},Object(n.createElement)("path",{fill:"#fff",stroke:"#9a9a9a",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"}),Object(n.createElement)("path",{fill:"#cdcdcd",d:"M12.511 3.877H37.497V13.879000000000001H12.511z"}),Object(n.createElement)("path",{fill:"#ccc",fillRule:"nonzero",d:"M31.588 34.498H12.91c-.223 0-.407.41-.407.908 0 .497.184.907.407.907h18.678c.224 0 .407-.41.407-.907 0-.498-.183-.908-.407-.908zM36.965 30.855H13.036c-.285 0-.52.409-.52.907 0 .498.235.907.52.907h23.929c.285 0 .52-.409.52-.907 0-.498-.235-.907-.52-.907z"}),Object(n.createElement)("path",{fill:"#cdcdcd",fillRule:"nonzero",d:"M36.965 27.211H13.036c-.285 0-.52.41-.52.908 0 .497.235.907.52.907h23.929c.285 0 .52-.41.52-.907 0-.498-.235-.908-.52-.908zM36.965 23.568H13.036c-.285 0-.52.41-.52.907 0 .498.235.908.52.908h23.929c.285 0 .52-.41.52-.908 0-.497-.235-.907-.52-.907z"}),Object(n.createElement)("path",{fill:"#ccc",fillRule:"nonzero",d:"M36.965 19.925H13.036c-.285 0-.52.409-.52.907 0 .498.235.907.52.907h23.929c.285 0 .52-.409.52-.907 0-.498-.235-.907-.52-.907zM36.965 16.281H13.036c-.285 0-.52.41-.52.907 0 .498.235.908.52.908h23.929c.285 0 .52-.41.52-.908 0-.497-.235-.907-.52-.907z"})),rightsidebar:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5",clipRule:"evenodd",viewBox:"0 0 50 40"},Object(n.createElement)("path",{fill:"#fff",stroke:"#9a9a9a",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"}),Object(n.createElement)("path",{fill:"#cdcdcd",d:"M7.516 3.855H30.216V13.857000000000001H7.516z"}),Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{fill:"#ccc",d:"M7.874 34.421h16.987c.202 0 .369.409.369.907 0 .498-.167.907-.369.907H7.874c-.202 0-.369-.409-.369-.907 0-.498.167-.907.369-.907zM7.98 30.777h21.76c.26 0 .473.41.473.908 0 .497-.213.907-.473.907H7.98c-.26 0-.473-.41-.473-.907 0-.498.213-.908.473-.908z"}),Object(n.createElement)("path",{fill:"#cdcdcd",d:"M7.98 27.134h21.76c.26 0 .473.41.473.907 0 .498-.213.907-.473.907H7.98c-.26 0-.473-.409-.473-.907 0-.497.213-.907.473-.907zM7.98 23.491h21.76c.26 0 .473.409.473.907 0 .498-.213.907-.473.907H7.98c-.26 0-.473-.409-.473-.907 0-.498.213-.907.473-.907z"}),Object(n.createElement)("path",{fill:"#ccc",d:"M7.98 19.847h21.76c.26 0 .473.41.473.907 0 .498-.213.908-.473.908H7.98c-.26 0-.473-.41-.473-.908 0-.497.213-.907.473-.907zM7.98 16.204h21.76c.26 0 .473.409.473.907 0 .498-.213.907-.473.907H7.98c-.26 0-.473-.409-.473-.907 0-.498.213-.907.473-.907z"})),Object(n.createElement)("path",{fill:"#e5e5e5",d:"M32.602 3.892H42.492999999999995V36.143H32.602z"})),leftsidebar:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5",clipRule:"evenodd",viewBox:"0 0 50 40"},Object(n.createElement)("path",{fill:"#fff",stroke:"#9a9a9a",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"}),Object(n.createElement)("path",{fill:"#cdcdcd",d:"M19.784 3.855H42.483999999999995V13.857000000000001H19.784z"}),Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{fill:"#ccc",d:"M37.131 34.421H20.145c-.203 0-.37.409-.37.907 0 .498.167.907.37.907h16.986c.202 0 .369-.409.369-.907 0-.498-.167-.907-.369-.907zM42.02 30.777H20.26c-.26 0-.473.41-.473.908 0 .497.213.907.473.907h21.76c.26 0 .473-.41.473-.907 0-.498-.213-.908-.473-.908z"}),Object(n.createElement)("path",{fill:"#cdcdcd",d:"M42.02 27.134H20.26c-.26 0-.473.41-.473.907 0 .498.213.907.473.907h21.76c.26 0 .473-.409.473-.907 0-.497-.213-.907-.473-.907zM42.02 23.491H20.26c-.26 0-.473.409-.473.907 0 .498.213.907.473.907h21.76c.26 0 .473-.409.473-.907 0-.498-.213-.907-.473-.907z"}),Object(n.createElement)("path",{fill:"#ccc",d:"M42.02 19.847H20.26c-.26 0-.473.41-.473.907 0 .498.213.908.473.908h21.76c.26 0 .473-.41.473-.908 0-.497-.213-.907-.473-.907zM42.02 16.204H20.26c-.26 0-.473.409-.473.907 0 .498.213.907.473.907h21.76c.26 0 .473-.409.473-.907 0-.498-.213-.907-.473-.907z"})),Object(n.createElement)("path",{fill:"#e5e5e5",d:"M7.507 3.892H17.398V36.143H7.507z"})),abovecontent:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5",clipRule:"evenodd",viewBox:"0 0 50 40"},Object(n.createElement)("path",{fill:"#fff",stroke:"#9a9a9a",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"}),Object(n.createElement)("path",{fill:"#cdcdcd",d:"M1.19 1.153H48.809999999999995V12.969000000000001H1.19z"}),Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{fill:"#ccc",d:"M34.26 34.831H8.054c-.312 0-.569.433-.569.959s.257.959.569.959H34.26c.313 0 .57-.433.57-.959s-.257-.959-.57-.959zM41.785 30.979H8.215c-.401 0-.73.433-.73.959 0 .527.329.959.73.959h33.57c.401 0 .73-.432.73-.959 0-.526-.329-.959-.73-.959z"}),Object(n.createElement)("path",{fill:"#cdcdcd",d:"M41.785 27.128H8.215c-.401 0-.73.433-.73.959s.329.959.73.959h33.57c.401 0 .73-.433.73-.959s-.329-.959-.73-.959zM41.785 23.277H8.215c-.401 0-.73.433-.73.959s.329.959.73.959h33.57c.401 0 .73-.433.73-.959s-.329-.959-.73-.959z"}),Object(n.createElement)("path",{fill:"#ccc",d:"M41.785 19.426H8.215c-.401 0-.73.433-.73.959s.329.959.73.959h33.57c.401 0 .73-.433.73-.959s-.329-.959-.73-.959zM41.785 15.575H8.215c-.401 0-.73.433-.73.959s.329.959.73.959h33.57c.401 0 .73-.433.73-.959s-.329-.959-.73-.959z"})),Object(n.createElement)("path",{fill:"#fff",fillRule:"nonzero",d:"M38.103 6.869H11.897c-.312 0-.569.433-.569.959 0 .527.257.959.569.959h26.206c.312 0 .569-.432.569-.959 0-.526-.257-.959-.569-.959zM31.143 4.758H18.857c-.147 0-.267.269-.267.595 0 .327.12.595.267.595h12.286c.147 0 .267-.268.267-.595 0-.326-.12-.595-.267-.595z"}),Object(n.createElement)("path",{fill:"none",stroke:"#9a9a9a",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"})),incontent:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5",clipRule:"evenodd",viewBox:"0 0 50 40"},Object(n.createElement)("path",{fill:"#fff",stroke:"#9a9a9a",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"}),Object(n.createElement)("g",{fillRule:"nonzero"},Object(n.createElement)("path",{fill:"#ccc",d:"M34.26 32.335H8.054c-.312 0-.569.433-.569.959s.257.959.569.959H34.26c.313 0 .57-.433.57-.959s-.257-.959-.57-.959zM41.785 28.484H8.215c-.401 0-.73.433-.73.959s.329.959.73.959h33.57c.401 0 .73-.433.73-.959s-.329-.959-.73-.959z"}),Object(n.createElement)("path",{fill:"#cdcdcd",d:"M41.785 24.632H8.215c-.401 0-.73.433-.73.959 0 .527.329.959.73.959h33.57c.401 0 .73-.432.73-.959 0-.526-.329-.959-.73-.959zM41.785 20.781H8.215c-.401 0-.73.433-.73.959s.329.959.73.959h33.57c.401 0 .73-.433.73-.959s-.329-.959-.73-.959z"}),Object(n.createElement)("path",{fill:"#ccc",d:"M41.785 16.93H8.215c-.401 0-.73.433-.73.959s.329.959.73.959h33.57c.401 0 .73-.433.73-.959s-.329-.959-.73-.959zM41.785 13.079H8.215c-.401 0-.73.433-.73.959s.329.959.73.959h33.57c.401 0 .73-.433.73-.959s-.329-.959-.73-.959z"}),Object(n.createElement)("path",{fill:"#9a9a9a",d:"M34.26 7.888H8.054c-.312 0-.569.433-.569.959s.257.959.569.959H34.26c.313 0 .57-.433.57-.959s-.257-.959-.57-.959zM19.303 5.747H7.736c-.138 0-.251.265-.251.586 0 .321.113.586.251.586h11.567c.138 0 .252-.265.252-.586 0-.321-.114-.586-.252-.586z"})),Object(n.createElement)("path",{fill:"none",stroke:"#9a9a9a",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"})),search:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"26",height:"28",viewBox:"0 0 26 28"},Object(n.createElement)("path",{d:"M18 13c0-3.859-3.141-7-7-7s-7 3.141-7 7 3.141 7 7 7 7-3.141 7-7zm8 13c0 1.094-.906 2-2 2a1.96 1.96 0 01-1.406-.594l-5.359-5.344a10.971 10.971 0 01-6.234 1.937c-6.078 0-11-4.922-11-11s4.922-11 11-11 11 4.922 11 11c0 2.219-.672 4.406-1.937 6.234l5.359 5.359c.359.359.578.875.578 1.406z"})),search2:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M16.041 15.856a.995.995 0 00-.186.186A6.97 6.97 0 0111 18c-1.933 0-3.682-.782-4.95-2.05S4 12.933 4 11s.782-3.682 2.05-4.95S9.067 4 11 4s3.682.782 4.95 2.05S18 9.067 18 11a6.971 6.971 0 01-1.959 4.856zm5.666 4.437l-3.675-3.675A8.967 8.967 0 0020 11c0-2.485-1.008-4.736-2.636-6.364S13.485 2 11 2 6.264 3.008 4.636 4.636 2 8.515 2 11s1.008 4.736 2.636 6.364S8.515 20 11 20a8.967 8.967 0 005.618-1.968l3.675 3.675a.999.999 0 101.414-1.414z"})),dot:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("circle",{cx:"10",cy:"10",r:"4.942"})),vline:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("path",{fillRule:"nonzero",d:"M9.022 1.068H10.977V18.931H9.022z"})),slash:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("path",{fillRule:"nonzero",d:"M6.115 18.935l5.804-17.87h1.966l-5.79 17.87h-1.98z"})),dash:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 20 20"},Object(n.createElement)("path",{fillRule:"nonzero",d:"M3.851 8.065H16.148V11.934H3.851z"})),drag:Object(n.createElement)("svg",{width:"18",height:"18",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 18 18"},Object(n.createElement)("path",{d:"M13,8c0.6,0,1-0.4,1-1s-0.4-1-1-1s-1,0.4-1,1S12.4,8,13,8z M5,6C4.4,6,4,6.4,4,7s0.4,1,1,1s1-0.4,1-1S5.6,6,5,6z M5,10\r c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S5.6,10,5,10z M13,10c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S13.6,10,13,10z M9,6\r C8.4,6,8,6.4,8,7s0.4,1,1,1s1-0.4,1-1S9.6,6,9,6z M9,10c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S9.6,10,9,10z"}))};Za.row=Object(n.createElement)("svg",{viewBox:"0 0 120.5 81",xmlns:"http://www.w3.org/2000/svg"},Object(n.createElement)("path",{d:"M116.7,80.8H3.8c-2,0-3.5-1.6-3.5-3.5V3.8c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,79.2,118.7,80.8,116.7,80.8z M3.8,2C2.8,2,2,2.8,2,3.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{d:"M108,55.3H12.5c-1.7,0-3,1.3-3,3V70c0,1.7,1.4,3,3,3H108c1.7,0,3-1.3,3-3V58.3C111.1,56.6,109.7,55.3,108,55.3z"}),Object(n.createElement)("rect",{x:"0.6",y:"48",width:"119.3",height:"1"})),Za.collapserow=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M116.7,80.8H3.8c-2,0-3.5-1.6-3.5-3.5V3.7c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,79.2,118.7,80.8,116.7,80.8z M3.8,2C2.8,2,2,2.8,2,3.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8C116.7,2,3.8,2,3.8,2z"}),Object(n.createElement)("path",{className:"st0",d:"M106.8,47.7H13.6c-1.7,0-3,1.3-3,3v4.8c0,1.7,1.4,3,3,3h93.3c1.7,0,3-1.3,3-3v-4.8\r C109.8,49,108.5,47.7,106.8,47.7z"}),Object(n.createElement)("path",{className:"st0",d:"M106.8,62H13.6c-1.7,0-3,1.3-3,3v4.8c0,1.7,1.4,3,3,3h93.3c1.7,0,3-1.3,3-3V65C109.8,63.3,108.5,62,106.8,62z"}),Object(n.createElement)("rect",{x:"0.6",y:"41.2",className:"st0",width:"119.3",height:"1"})),Za.collapserowthree=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M0.3,77.4V4c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5c0,2-1.6,3.5-3.5,3.5H3.9\r C1.9,81,0.4,79.4,0.3,77.4z M3.9,2.2C2.9,2.2,2.1,3,2.1,4v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V4\r c0-1-0.8-1.8-1.8-1.8H3.9z"}),Object(n.createElement)("rect",{x:"0.7",y:"39.2",className:"st0",width:"119.3",height:"1"}),Object(n.createElement)("path",{className:"st0",d:"M9.6,68.8c0-1.2,0.8-2.1,1.8-2.1h97.9c1,0,1.8,0.9,1.8,2.1v3.4c0,1.2-0.8,2.1-1.8,2.1H11.4\r c-1,0-1.8-0.9-1.8-2.1V68.8L9.6,68.8z"}),Object(n.createElement)("path",{className:"st0",d:"M9.6,57.6c0-1.2,0.8-2.1,1.8-2.1h97.9c1,0,1.8,0.9,1.8,2.1v3.4c0,1.2-0.8,2.1-1.8,2.1H11.4\r c-1,0-1.8-0.9-1.8-2.1V57.6L9.6,57.6z"}),Object(n.createElement)("path",{className:"st0",d:"M9.6,46.4c0-1.2,0.8-2.1,1.8-2.1h97.9c1,0,1.8,0.9,1.8,2.1v3.4c0,1.2-0.8,2.1-1.8,2.1H11.4\r c-1,0-1.8-0.9-1.8-2.1V46.4L9.6,46.4z"})),Za.collapserowfour=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M116.7,81.8H3.8c-2,0-3.5-1.6-3.5-3.5V4.7c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,80.2,118.7,81.8,116.7,81.8z M3.8,3C2.8,3,2,3.8,2,4.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V4.8\r c0-1-0.8-1.8-1.8-1.8C116.7,3,3.8,3,3.8,3z"}),Object(n.createElement)("g",null,Object(n.createElement)("path",{className:"st0",d:"M103,36.7H17.4c-1.5,0-2.7,1.3-2.7,3v0.8c0,1.7,1.3,3,2.7,3H103c1.5,0,2.7-1.3,2.7-3v-0.8\r C105.7,38,104.5,36.7,103,36.7z"}),Object(n.createElement)("path",{className:"st0",d:"M103,47.3H17.4c-1.5,0-2.7,1.3-2.7,3v0.8c0,1.7,1.3,3,2.7,3H103c1.5,0,2.7-1.3,2.7-3v-0.8\r C105.7,48.7,104.5,47.3,103,47.3z"}),Object(n.createElement)("path",{className:"st0",d:"M103,58H17.4c-1.5,0-2.7,1.3-2.7,3v0.8c0,1.7,1.3,3,2.7,3H103c1.5,0,2.7-1.3,2.7-3V61\r C105.7,59.3,104.5,58,103,58z"}),Object(n.createElement)("path",{className:"st0",d:"M103,68.6H17.4c-1.5,0-2.7,1.3-2.7,3v0.8c0,1.7,1.3,3,2.7,3H103c1.5,0,2.7-1.3,2.7-3v-0.8\r C105.7,70,104.5,68.6,103,68.6z"})),Object(n.createElement)("g",null,Object(n.createElement)("rect",{x:"0.6",y:"31.7",className:"st0",width:"119.3",height:"1"}))),Za.collapserowfive=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M116.7,80.8H3.8c-2,0-3.5-1.6-3.5-3.5V3.7c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,79.2,118.7,80.8,116.7,80.8z M3.8,2C2.8,2,2,2.8,2,3.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8C116.7,2,3.8,2,3.8,2z"}),Object(n.createElement)("g",null,Object(n.createElement)("path",{className:"st0",d:"M101.4,24.5H19.1c-1.4,0-2.6,1.3-2.6,3v0.8c0,1.7,1.3,3,2.6,3h82.4c1.4,0,2.6-1.3,2.6-3v-0.8\r C104,25.8,102.9,24.5,101.4,24.5z"}),Object(n.createElement)("path",{className:"st0",d:"M101.4,11.8H19.1c-1.4,0-2.6,1.3-2.6,3v0.8c0,1.7,1.3,3,2.6,3h82.4c1.4,0,2.6-1.3,2.6-3v-0.8\r C104,13.1,102.9,11.8,101.4,11.8z"}),Object(n.createElement)("path",{className:"st0",d:"M101.4,37.1H19.1c-1.4,0-2.6,1.3-2.6,3v0.8c0,1.7,1.3,3,2.6,3h82.4c1.4,0,2.6-1.3,2.6-3v-0.8\r C104,38.5,102.9,37.1,101.4,37.1z"}),Object(n.createElement)("path",{className:"st0",d:"M101.4,49.7H19.1c-1.4,0-2.6,1.3-2.6,3v0.8c0,1.7,1.3,3,2.6,3h82.4c1.4,0,2.6-1.3,2.6-3v-0.8\r C104,51,102.9,49.7,101.4,49.7z"}),Object(n.createElement)("path",{className:"st0",d:"M101.4,62.4H19.1c-1.4,0-2.6,1.3-2.6,3v0.8c0,1.7,1.3,3,2.6,3h82.4c1.4,0,2.6-1.3,2.6-3v-0.8\r C104,63.8,102.9,62.4,101.4,62.4z"}))),Za.collapserowsix=Object(n.createElement)("svg",{viewBox:"0 0 60 30",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"1.414"},Object(n.createElement)("rect",{x:"0.000",y:"0.000",width:"60.000",height:"4.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"0.000",y:"5.000",width:"60.000",height:"4.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"0.000",y:"10.000",width:"60.000",height:"4.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"0.000",y:"15.000",width:"60.000",height:"4.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"0.000",y:"20.000",width:"60.000",height:"4.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"0.000",y:"25.000",width:"60.000",height:"4.000",fill:"#d5dadf"})),Za.twocol=Object(n.createElement)("svg",{viewBox:"0 0 120.5 81",xmlns:"http://www.w3.org/2000/svg",x:"0px",y:"0px"},Object(n.createElement)("path",{className:"st0",d:"M116.7,80.8H3.8c-2,0-3.5-1.6-3.5-3.5V3.8c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,79.2,118.7,80.8,116.7,80.8z M3.8,1.9C2.8,1.9,2,2.8,2,3.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M54.7,55.3H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h42.2c1.7,0,3-1.3,3-3V58.3\r C57.7,56.6,56.4,55.3,54.7,55.3z"}),Object(n.createElement)("path",{className:"st0",d:"M108,55.3H65.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h42.3c1.7,0,3-1.3,3-3V58.3\r C111.1,56.6,109.7,55.3,108,55.3z"}),Object(n.createElement)("rect",{x:"0.6",y:"47.9",className:"st0",width:"119.3",height:"1"})),Za.grid=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M116.7,80.8H3.8c-2,0-3.5-1.6-3.5-3.5V3.7c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,79.2,118.7,80.8,116.7,80.8z M3.8,2C2.8,2,2,2.8,2,3.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8C116.7,2,3.8,2,3.8,2z"}),Object(n.createElement)("path",{className:"st0",d:"M55.7,43.7H12.5c-1.7,0-3,1.3-3,3v7.8c0,1.7,1.4,3,3,3h43.3c1.7,0,3-1.3,3-3v-7.8C58.7,45,57.4,43.7,55.7,43.7\r z"}),Object(n.createElement)("path",{className:"st0",d:"M107.7,43.7H64.5c-1.7,0-3,1.3-3,3v7.8c0,1.7,1.4,3,3,3h43.3c1.7,0,3-1.3,3-3v-7.8\r C110.7,45,109.4,43.7,107.7,43.7z"}),Object(n.createElement)("path",{className:"st0",d:"M55.7,59.7H12.5c-1.7,0-3,1.3-3,3v7.8c0,1.7,1.4,3,3,3h43.3c1.7,0,3-1.3,3-3v-7.8C58.7,61,57.4,59.7,55.7,59.7\r z"}),Object(n.createElement)("path",{className:"st0",d:"M107.7,59.7H64.5c-1.7,0-3,1.3-3,3v7.8c0,1.7,1.4,3,3,3h43.3c1.7,0,3-1.3,3-3v-7.8\r C110.7,61,109.4,59.7,107.7,59.7z"}),Object(n.createElement)("g",null,Object(n.createElement)("rect",{x:"0.6",y:"38.2",className:"st0",width:"119.3",height:"1"}))),Za.threecol=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M116.7,80.8H3.8c-2,0-3.5-1.6-3.5-3.5V3.8c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,79.1,118.7,80.8,116.7,80.8z M3.8,1.9C2.8,1.9,2,2.6,2,3.6v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.6\r c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M37.7,55.1H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h25.3c1.7,0,3-1.3,3-3V58.1\r C40.7,56.6,39.4,55.1,37.7,55.1z"}),Object(n.createElement)("path",{className:"st0",d:"M72.9,55.1H47.6c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h25.3c1.7,0,3-1.3,3-3V58.1\r C75.9,56.6,74.5,55.1,72.9,55.1z"}),Object(n.createElement)("path",{className:"st0",d:"M108,55.1H82.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3H108c1.7,0,3-1.3,3-3V58.1\r C111.1,56.6,109.7,55.1,108,55.1z"}),Object(n.createElement)("rect",{x:"0.6",y:"48",className:"st0",width:"119.3",height:"1"})),Za.threegrid=Object(n.createElement)("svg",{viewBox:"0 0 60 30",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"1.414"},Object(n.createElement)("rect",{x:"0.000",y:"0.000",width:"18.500",height:"14.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"20.500",y:"0.000",width:"19.000",height:"14.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"41.500",y:"0.000",width:"18.500",height:"14.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"0.000",y:"16.000",width:"18.500",height:"14.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"20.500",y:"16.000",width:"19.000",height:"14.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"41.500",y:"16.000",width:"18.500",height:"14.000",fill:"#d5dadf"})),Za.lastrow=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M0.3,77.4V4c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5c0,2-1.6,3.5-3.5,3.5H3.9\r C1.9,81,0.4,79.4,0.3,77.4z M3.9,2.2C2.9,2.2,2.1,3,2.1,4v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V4\r c0-1-0.8-1.8-1.8-1.8H3.9z"}),Object(n.createElement)("rect",{x:"0.7",y:"43.2",className:"st0",width:"119.3",height:"1"}),Object(n.createElement)("path",{className:"st0",d:"M9.6,65.8c0-1.2,0.8-2.1,1.8-2.1h97.9c1,0,1.8,0.9,1.8,2.1v6.4c0,1.2-0.8,2.1-1.8,2.1H11.4\r c-1,0-1.8-0.9-1.8-2.1V65.8L9.6,65.8z"}),Object(n.createElement)("path",{className:"st0",d:"M38.5,52.6c0-1.2,0.8-2.1,1.8-2.1h69c1,0,1.8,0.9,1.8,2.1V59c0,1.2-0.8,2.1-1.8,2.1h-69c-1,0-1.8-0.9-1.8-2.1\r V52.6L38.5,52.6z"}),Object(n.createElement)("path",{className:"st0",d:"M9.6,52.6c0-1.2,0.8-2.1,1.8-2.1h20.9c1,0,1.8,0.9,1.8,2.1v6.4c0,1.2-0.8,2.1-1.8,2.1H11.4\r c-1,0-1.8-0.9-1.8-2.1V52.6L9.6,52.6z"})),Za.firstrow=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M0.3,77.4V4c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5c0,2-1.6,3.5-3.5,3.5H3.9\r C1.9,81,0.4,79.4,0.3,77.4z M3.9,2.2C2.9,2.2,2.1,3,2.1,4v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V4\r c0-1-0.8-1.8-1.8-1.8H3.9z"}),Object(n.createElement)("rect",{x:"0.7",y:"43.2",className:"st0",width:"119.3",height:"1"}),Object(n.createElement)("path",{className:"st0",d:"M111.1,57.9c0,1.2-0.8,2.1-1.8,2.1H11.4c-1,0-1.8-0.9-1.8-2.1v-6.4c0-1.2,0.8-2.1,1.8-2.1h97.9\r c1,0,1.8,0.9,1.8,2.1V57.9L111.1,57.9z"}),Object(n.createElement)("g",null,Object(n.createElement)("path",{className:"st0",d:"M58.2,72.1c0,1.2-0.8,2.1-1.8,2.1h-45c-1,0-1.8-0.9-1.8-2.1v-6.4c0-1.2,0.8-2.1,1.8-2.1h45\r c1,0,1.8,0.9,1.8,2.1V72.1L58.2,72.1z"})),Object(n.createElement)("g",null,Object(n.createElement)("path",{className:"st0",d:"M111.1,72.1c0,1.2-0.8,2.1-1.8,2.1h-45c-1,0-1.8-0.9-1.8-2.1v-6.4c0-1.2,0.8-2.1,1.8-2.1h45\r c1,0,1.8,0.9,1.8,2.1V72.1L111.1,72.1z"}))),Za.twoleftgolden=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M116.7,80.8H3.8c-2,0-3.5-1.6-3.5-3.5V3.7c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,79.2,118.7,80.8,116.7,80.8z M3.8,2C2.8,2,2,2.8,2,3.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M81.7,55.4H45h-4.9H12.4c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7H45h36.7c1.7,0,3-1.3,3-3V58.4\r C84.8,56.6,83.4,55.4,81.7,55.4z"}),Object(n.createElement)("path",{className:"st0",d:"M108.1,55.4H93.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h14.3c1.7,0,3-1.3,3-3V58.4\r C111.1,56.6,109.7,55.4,108.1,55.4z"}),Object(n.createElement)("rect",{x:"0.6",y:"48",className:"st0",width:"119.3",height:"1"})),Za.tworightgolden=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M0.3,77.3V3.8c0-1.9,1.5-3.5,3.5-3.5h112.9c1.9,0,3.5,1.5,3.5,3.5v73.5c0,1.9-1.5,3.5-3.5,3.5H3.8\r C1.8,80.8,0.2,79.1,0.3,77.3z M3.8,1.9C2.8,1.9,2,2.7,2,3.7v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.7\r c0-1-0.8-1.8-1.8-1.8C116.7,1.9,3.8,1.9,3.8,1.9z"}),Object(n.createElement)("path",{className:"st0",d:"M35.8,58.3V70c0,1.7,1.3,3,3,3h36.7h4.9h27.7c1.6,0,3-1.3,3-3V58.3c0-1.7-1.3-3-3-3H80.4h-4.9H38.8\r C37.1,55.3,35.7,56.5,35.8,58.3z"}),Object(n.createElement)("path",{className:"st0",d:"M9.4,58.3V70c0,1.7,1.3,3,3,3h14.3c1.6,0,3-1.3,3-3V58.3c0-1.7-1.3-3-3-3H12.4C10.8,55.3,9.4,56.5,9.4,58.3z"}),Object(n.createElement)("rect",{x:"0.6",y:"47.9",className:"st0",width:"119.3",height:"1"})),Za.lefthalf=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M116.7,80.8H3.8c-2,0-3.5-1.6-3.5-3.5V3.8c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,79.1,118.7,80.8,116.7,80.8z M3.8,2C2.8,2,2,2.8,2,3.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M65.7,55.1H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h53.3c1.7,0,3-1.3,3-3V58.1\r C68.7,56.5,67.4,55.1,65.7,55.1z"}),Object(n.createElement)("path",{className:"st0",d:"M108,55.1H96.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3H108c1.7,0,3-1.3,3-3V58.1\r C111.1,56.5,109.7,55.1,108,55.1z"}),Object(n.createElement)("path",{className:"st0",d:"M87.1,55.1H75.9c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h11.3c1.7,0,3-1.3,3-3V58.1\r C90.1,56.5,88.8,55.1,87.1,55.1z"}),Object(n.createElement)("rect",{x:"0.6",y:"48",className:"st0",width:"119.3",height:"1"})),Za.righthalf=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M0.3,77.2V3.7c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5c0,2-1.6,3.5-3.5,3.5H3.9\r C1.9,80.8,0.4,79.2,0.3,77.2z M3.9,2c-1,0-1.8,0.8-1.8,1.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8H3.9z"}),Object(n.createElement)("path",{className:"st0",d:"M54.9,55.2h53.2c1.7,0,3,1.3,3,3V70c0,1.7-1.4,3-3,3H54.9c-1.7,0-3-1.3-3-3V58.2\r C51.9,56.6,53.2,55.2,54.9,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M12.6,55.2h11.3c1.7,0,3,1.3,3,3V70c0,1.7-1.4,3-3,3H12.6c-1.7,0-3-1.3-3-3V58.2C9.5,56.6,10.9,55.2,12.6,55.2\r z"}),Object(n.createElement)("path",{className:"st0",d:"M33.5,55.2h11.3c1.7,0,3,1.3,3,3V70c0,1.7-1.4,3-3,3H33.5c-1.7,0-3-1.3-3-3V58.2\r C30.5,56.6,31.8,55.2,33.5,55.2z"}),Object(n.createElement)("rect",{x:"0.7",y:"48",className:"st0",width:"119.3",height:"1"})),Za.centerhalf=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M0.3,77.3V3.8c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5c0,2-1.6,3.5-3.5,3.5H3.9\r C1.9,80.8,0.4,79.1,0.3,77.3z M3.9,1.9c-1,0-1.8,0.8-1.8,1.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8H3.9z"}),Object(n.createElement)("path",{className:"st0",d:"M36.7,55.2H84c1.7,0,3,1.3,3,3v11.7c0,1.7-1.4,3-3,3H36.7c-1.7,0-3-1.3-3-3V58.2\r C33.7,56.5,35.1,55.2,36.7,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M12.6,55.2h14.3c1.7,0,3,1.3,3,3v11.7c0,1.7-1.4,3-3,3H12.6c-1.7,0-3-1.3-3-3V58.2\r C9.5,56.5,10.9,55.2,12.6,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M93.9,55.2h14.2c1.7,0,3,1.3,3,3v11.7c0,1.7-1.4,3-3,3H93.9c-1.7,0-3-1.3-3-3V58.2\r C90.9,56.5,92.2,55.2,93.9,55.2z"}),Object(n.createElement)("rect",{x:"0.7",y:"47.9",className:"st0",width:"119.3",height:"1"})),Za.widecenter=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M0.3,77.4V4c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5c0,2-1.6,3.5-3.5,3.5H3.9\r C1.9,81,0.4,79.4,0.3,77.4z M3.9,2.2C2.9,2.2,2.1,3,2.1,4v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V4\r c0-1-0.8-1.8-1.8-1.8H3.9z"}),Object(n.createElement)("path",{className:"st0",d:"M32.7,55.5H88c1.7,0,3,1.3,3,3v11.7c0,1.7-1.4,3-3,3H32.7c-1.7,0-3-1.3-3-3V58.5\r C29.7,56.8,31.1,55.5,32.7,55.5z"}),Object(n.createElement)("path",{className:"st0",d:"M12.6,55.5h10.3c1.7,0,3,1.3,3,3v11.7c0,1.7-1.4,3-3,3H12.6c-1.7,0-3-1.3-3-3V58.5\r C9.5,56.8,10.9,55.5,12.6,55.5z"}),Object(n.createElement)("path",{className:"st0",d:"M97.9,55.5h10.2c1.7,0,3,1.3,3,3v11.7c0,1.7-1.4,3-3,3H97.9c-1.7,0-3-1.3-3-3V58.5\r C94.9,56.8,96.2,55.5,97.9,55.5z"}),Object(n.createElement)("rect",{x:"0.7",y:"48.2",className:"st0",width:"119.3",height:"1"})),Za.exwidecenter=Object(n.createElement)("svg",{viewBox:"0 0 60 30",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"1.414"},Object(n.createElement)("rect",{x:"0.000",y:"0.000",width:"7.200",height:"30.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"9.200",y:"0.000",width:"41.600",height:"30.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"52.800",y:"0.000",width:"7.200",height:"30.000",fill:"#d5dadf"})),Za.fourcol=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M116.7-715.4H3.8c-2,0-3.5-1.6-3.5-3.5v-73.5c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3-717,118.7-715.4,116.7-715.4z M3.8-794.2c-1,0-1.8,0.8-1.8,1.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8\r v-73.5c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M52.7-740.9H45h-4.9H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7H45h7.7c1.7,0,3-1.3,3-3v-11.8\r C55.7-739.6,54.4-740.9,52.7-740.9z"}),Object(n.createElement)("path",{className:"st0",d:"M108-740.9h-7.7h-4.9H67.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7h4.9h7.7c1.7,0,3-1.3,3-3v-11.8\r C111.1-739.6,109.7-740.9,108-740.9z"}),Object(n.createElement)("rect",{x:"0.6",y:"-748.2",className:"st0",width:"119.3",height:"1"}),Object(n.createElement)("path",{className:"st0",d:"M116.7-715.4H3.8c-2,0-3.5-1.6-3.5-3.5v-73.5c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3-717,118.7-715.4,116.7-715.4z M3.8-794.2c-1,0-1.8,0.8-1.8,1.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8\r v-73.5c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M52.7-740.9H45h-4.9H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7H45h7.7c1.7,0,3-1.3,3-3v-11.8\r C55.7-739.6,54.4-740.9,52.7-740.9z"}),Object(n.createElement)("path",{className:"st0",d:"M108-740.9h-7.7h-4.9H67.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7h4.9h7.7c1.7,0,3-1.3,3-3v-11.8\r C111.1-739.6,109.7-740.9,108-740.9z"}),Object(n.createElement)("rect",{x:"0.6",y:"-748.2",className:"st0",width:"119.3",height:"1"}),Object(n.createElement)("path",{className:"st0",d:"M116.7,80.8H3.8c-2,0-3.5-1.6-3.5-3.5V3.7c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,79.2,118.7,80.8,116.7,80.8z M3.8,2C2.8,2,2,2.8,2,3.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M29.7,55.2H12.5c-1.7,0-3,1.3-3,3V70c0,1.7,1.4,3,3,3h17.3c1.7,0,3-1.3,3-3V58.2\r C32.7,56.5,31.4,55.2,29.7,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M55.8,55.2H38.6c-1.7,0-3,1.3-3,3V70c0,1.7,1.4,3,3,3h17.3c1.7,0,3-1.3,3-3V58.2\r C58.8,56.5,57.5,55.2,55.8,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M81.9,55.2H64.7c-1.7,0-3,1.3-3,3V70c0,1.7,1.4,3,3,3H82c1.7,0,3-1.3,3-3V58.2C84.9,56.5,83.6,55.2,81.9,55.2z\r "}),Object(n.createElement)("path",{className:"st0",d:"M108,55.2H90.8c-1.7,0-3,1.3-3,3V70c0,1.7,1.4,3,3,3h17.3c1.7,0,3-1.3,3-3V58.2C111,56.5,109.7,55.2,108,55.2z\r "}),Object(n.createElement)("rect",{x:"0.6",y:"48",className:"st0",width:"119.3",height:"1"})),Za.lfourforty=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M116.7-715.4H3.8c-2,0-3.5-1.6-3.5-3.5v-73.5c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3-717,118.7-715.4,116.7-715.4z M3.8-794.2c-1,0-1.8,0.8-1.8,1.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8\r v-73.5c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M52.7-740.9H45h-4.9H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7H45h7.7c1.7,0,3-1.3,3-3v-11.8\r C55.7-739.6,54.4-740.9,52.7-740.9z"}),Object(n.createElement)("path",{className:"st0",d:"M108-740.9h-7.7h-4.9H67.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7h4.9h7.7c1.7,0,3-1.3,3-3v-11.8\r C111.1-739.6,109.7-740.9,108-740.9z"}),Object(n.createElement)("rect",{x:"0.6",y:"-748.2",className:"st0",width:"119.3",height:"1"}),Object(n.createElement)("path",{className:"st0",d:"M116.7-715.4H3.8c-2,0-3.5-1.6-3.5-3.5v-73.5c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3-717,118.7-715.4,116.7-715.4z M3.8-794.2c-1,0-1.8,0.8-1.8,1.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8\r v-73.5c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M52.7-740.9H45h-4.9H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7H45h7.7c1.7,0,3-1.3,3-3v-11.8\r C55.7-739.6,54.4-740.9,52.7-740.9z"}),Object(n.createElement)("path",{className:"st0",d:"M108-740.9h-7.7h-4.9H67.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7h4.9h7.7c1.7,0,3-1.3,3-3v-11.8\r C111.1-739.6,109.7-740.9,108-740.9z"}),Object(n.createElement)("rect",{x:"0.6",y:"-748.2",className:"st0",width:"119.3",height:"1"}),Object(n.createElement)("path",{className:"st0",d:"M116.7,80.8H3.8c-2,0-3.5-1.6-3.5-3.5V3.7c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,79.2,118.7,80.8,116.7,80.8z M3.8,2C2.8,2,2,2.8,2,3.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M50.7,55.2H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h38.3c1.7,0,3-1.3,3-3V58.2\r C53.7,56.6,52.4,55.2,50.7,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M69.6,55.2h-9.2c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h9.3c1.7,0,3-1.3,3-3V58.2\r C72.6,56.6,71.3,55.2,69.6,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M88.9,55.2h-9.2c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3H89c1.7,0,3-1.3,3-3V58.2\r C91.9,56.6,90.6,55.2,88.9,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M108,55.2h-9.2c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h9.3c1.7,0,3-1.3,3-3V58.2C111,56.6,109.7,55.2,108,55.2\r z"}),Object(n.createElement)("rect",{x:"0.6",y:"48",className:"st0",width:"119.3",height:"1"})),Za.rfourforty=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M116.7-715.4H3.8c-2,0-3.5-1.6-3.5-3.5v-73.5c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3-717,118.7-715.4,116.7-715.4z M3.8-794.2c-1,0-1.8,0.8-1.8,1.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8\r v-73.5c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M52.7-740.9H45h-4.9H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7H45h7.7c1.7,0,3-1.3,3-3v-11.8\r C55.7-739.6,54.4-740.9,52.7-740.9z"}),Object(n.createElement)("path",{className:"st0",d:"M108-740.9h-7.7h-4.9H67.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7h4.9h7.7c1.7,0,3-1.3,3-3v-11.8\r C111.1-739.6,109.7-740.9,108-740.9z"}),Object(n.createElement)("rect",{x:"0.6",y:"-748.2",className:"st0",width:"119.3",height:"1"}),Object(n.createElement)("path",{className:"st0",d:"M116.7-715.4H3.8c-2,0-3.5-1.6-3.5-3.5v-73.5c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3-717,118.7-715.4,116.7-715.4z M3.8-794.2c-1,0-1.8,0.8-1.8,1.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8\r v-73.5c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M52.7-740.9H45h-4.9H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7H45h7.7c1.7,0,3-1.3,3-3v-11.8\r C55.7-739.6,54.4-740.9,52.7-740.9z"}),Object(n.createElement)("path",{className:"st0",d:"M108-740.9h-7.7h-4.9H67.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7h4.9h7.7c1.7,0,3-1.3,3-3v-11.8\r C111.1-739.6,109.7-740.9,108-740.9z"}),Object(n.createElement)("rect",{x:"0.6",y:"-748.2",className:"st0",width:"119.3",height:"1"}),Object(n.createElement)("path",{className:"st0",d:"M0.3,77.3V3.8c0-1.9,1.5-3.5,3.5-3.5h112.9c1.9,0,3.5,1.5,3.5,3.5v73.5c0,1.9-1.5,3.5-3.5,3.5H3.8\r C1.8,80.8,0.2,79.2,0.3,77.3z M3.8,2C2.8,2,2,2.8,2,3.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M66.7,58.2V70c0,1.7,1.3,3,3,3H108c1.6,0,3-1.3,3-3V58.2c0-1.7-1.3-3-3-3H69.8C68.1,55.2,66.8,56.6,66.7,58.2z\r "}),Object(n.createElement)("path",{className:"st0",d:"M47.8,58.2V70c0,1.7,1.3,3,3,3h9.3c1.6,0,3-1.3,3-3V58.2c0-1.7-1.3-3-3-3h-9.2C49.2,55.2,47.9,56.6,47.8,58.2z\r "}),Object(n.createElement)("path",{className:"st0",d:"M28.5,58.2V70c0,1.7,1.3,3,3,3h9.3c1.6,0,3-1.3,3-3V58.2c0-1.7-1.3-3-3-3h-9.2C29.9,55.2,28.6,56.6,28.5,58.2z\r "}),Object(n.createElement)("path",{className:"st0",d:"M9.4,58.2V70c0,1.7,1.3,3,3,3h9.3c1.6,0,3-1.3,3-3V58.2c0-1.7-1.3-3-3-3h-9.2C10.8,55.2,9.5,56.6,9.4,58.2z"}),Object(n.createElement)("rect",{x:"0.6",y:"48",className:"st0",width:"119.3",height:"1"})),Za.fivecol=Object(n.createElement)("svg",{x:"0px",y:"0px",viewBox:"0 0 120.5 81"},Object(n.createElement)("path",{className:"st0",d:"M116.7-526.1H3.8c-2,0-3.5-1.6-3.5-3.5v-73.5c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3-527.7,118.7-526.1,116.7-526.1z M3.8-604.9c-1,0-1.8,0.8-1.8,1.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8\r v-73.5c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M52.7-551.6H45h-4.9H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7H45h7.7c1.7,0,3-1.3,3-3v-11.8\r C55.7-550.3,54.4-551.6,52.7-551.6z"}),Object(n.createElement)("path",{className:"st0",d:"M108-551.6h-7.7h-4.9H67.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7h4.9h7.7c1.7,0,3-1.3,3-3v-11.8\r C111.1-550.3,109.7-551.6,108-551.6z"}),Object(n.createElement)("rect",{x:"0.6",y:"-558.9",className:"st0",width:"119.3",height:"1"}),Object(n.createElement)("path",{className:"st0",d:"M116.7-526.1H3.8c-2,0-3.5-1.6-3.5-3.5v-73.5c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3-527.7,118.7-526.1,116.7-526.1z M3.8-604.9c-1,0-1.8,0.8-1.8,1.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8\r v-73.5c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M52.7-551.6H45h-4.9H12.5c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7H45h7.7c1.7,0,3-1.3,3-3v-11.8\r C55.7-550.3,54.4-551.6,52.7-551.6z"}),Object(n.createElement)("path",{className:"st0",d:"M108-551.6h-7.7h-4.9H67.8c-1.7,0-3,1.3-3,3v11.8c0,1.7,1.4,3,3,3h27.7h4.9h7.7c1.7,0,3-1.3,3-3v-11.8\r C111.1-550.3,109.7-551.6,108-551.6z"}),Object(n.createElement)("rect",{x:"0.6",y:"-558.9",className:"st0",width:"119.3",height:"1"}),Object(n.createElement)("path",{className:"st0",d:"M116.7,80.8H3.8c-2,0-3.5-1.6-3.5-3.5V3.8c0-2,1.6-3.5,3.5-3.5h112.9c2,0,3.5,1.6,3.5,3.5v73.5\r C120.3,79.2,118.7,80.8,116.7,80.8z M3.8,2C2.8,2,2,2.8,2,3.8v73.5c0,1,0.8,1.8,1.8,1.8h112.9c1,0,1.8-0.8,1.8-1.8V3.8\r c0-1-0.8-1.8-1.8-1.8H3.8z"}),Object(n.createElement)("path",{className:"st0",d:"M23.7,55.2H12.5c-1.7,0-3,1.3-3,3V70c0,1.7,1.4,3,3,3h11.3c1.7,0,3-1.3,3-3V58.2C26.7,56.6,25.4,55.2,23.7,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M44.7,55.2H33.5c-1.7,0-3,1.3-3,3V70c0,1.7,1.4,3,3,3h11.3c1.7,0,3-1.3,3-3V58.2C47.7,56.6,46.4,55.2,44.7,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M65.8,55.2H54.6c-1.7,0-3,1.3-3,3V70c0,1.7,1.4,3,3,3h11.3c1.7,0,3-1.3,3-3V58.2C68.8,56.6,67.5,55.2,65.8,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M86.8,55.2H75.6c-1.7,0-3,1.3-3,3V70c0,1.7,1.4,3,3,3h11.3c1.7,0,3-1.3,3-3V58.2C89.8,56.6,88.5,55.2,86.8,55.2z"}),Object(n.createElement)("path",{className:"st0",d:"M107.8,55.2H96.6c-1.7,0-3,1.3-3,3V70c0,1.7,1.4,3,3,3h11.3c1.7,0,3-1.3,3-3V58.2\r C110.8,56.6,109.5,55.2,107.8,55.2z"}),Object(n.createElement)("rect",{x:"0.6",y:"48",className:"st0",width:"119.3",height:"1"})),Za.sixcol=Object(n.createElement)("svg",{viewBox:"0 0 60 30",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"1.414"},Object(n.createElement)("rect",{x:"0.000",y:"0.000",width:"8.350",height:"30.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"10.330",y:"0.000",width:"8.350",height:"30.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"20.660",y:"0.000",width:"8.350",height:"30.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"30.990",y:"0.000",width:"8.350",height:"30.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"41.320",y:"0.000",width:"8.350",height:"30.000",fill:"#d5dadf"}),Object(n.createElement)("rect",{x:"51.650",y:"0.000",width:"8.350",height:"30.000",fill:"#d5dadf"})),Za.aligntop=Object(n.createElement)("svg",{width:"20px",height:"20px",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"1.414"},Object(n.createElement)("path",{d:"M17.294,17.287l-14.588,0l0,-14.574l14.588,0c0,4.858 0,9.716 0,14.574Zm-13.738,-0.85l12.888,0l0,-12.874l-12.888,0c0,4.291 0,8.583 0,12.874Z",fillRule:"nonzero"}),Object(n.createElement)("rect",{x:"4.489",y:"4.545",width:"11.022",height:"2.512"})),Za.alignmiddle=Object(n.createElement)("svg",{width:"20px",height:"20px",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"1.414"},Object(n.createElement)("path",{d:"M17.294,17.287l-14.588,0l0,-14.574l14.588,0c0,4.858 0,9.716 0,14.574Zm-13.738,-0.85l12.888,0l0,-12.874l-12.888,0c0,4.291 0,8.583 0,12.874Z",fillRule:"nonzero"}),Object(n.createElement)("rect",{x:"4.489",y:"8.744",width:"11.022",height:"2.512"})),Za.alignbottom=Object(n.createElement)("svg",{width:"20px",height:"20px",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"1.414"},Object(n.createElement)("path",{d:"M17.294,17.287l-14.588,0l0,-14.574l14.588,0c0,4.858 0,9.716 0,14.574Zm-13.738,-0.85l12.888,0l0,-12.874l-12.888,0c0,4.291 0,8.583 0,12.874Z",fillRule:"nonzero"}),Object(n.createElement)("rect",{x:"4.489",y:"12.802",width:"11.022",height:"2.512"})),Za.outlinetop=Object(n.createElement)("svg",{width:"20px",height:"20px",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"1.414"},Object(n.createElement)("rect",{x:"2.714",y:"5.492",width:"1.048",height:"9.017",fill:"#555d66"}),Object(n.createElement)("rect",{x:"16.265",y:"5.498",width:"1.023",height:"9.003",fill:"#555d66"}),Object(n.createElement)("rect",{x:"5.518",y:"2.186",width:"8.964",height:"2.482",fill:"#272b2f"}),Object(n.createElement)("rect",{x:"5.487",y:"16.261",width:"9.026",height:"1.037",fill:"#555d66"})),Za.outlineright=Object(n.createElement)("svg",{width:"20px",height:"20px",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"1.414"},Object(n.createElement)("rect",{x:"2.714",y:"5.492",width:"1.046",height:"9.017",fill:"#555d66"}),Object(n.createElement)("rect",{x:"15.244",y:"5.498",width:"2.518",height:"9.003",fill:"#272b2f"}),Object(n.createElement)("rect",{x:"5.518",y:"2.719",width:"8.964",height:"0.954",fill:"#555d66"}),Object(n.createElement)("rect",{x:"5.487",y:"16.308",width:"9.026",height:"0.99",fill:"#555d66"})),Za.outlinebottom=Object(n.createElement)("svg",{width:"20px",height:"20px",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"1.414"},Object(n.createElement)("rect",{x:"2.714",y:"5.492",width:"1",height:"9.017",fill:"#555d66"}),Object(n.createElement)("rect",{x:"16.261",y:"5.498",width:"1.027",height:"9.003",fill:"#555d66"}),Object(n.createElement)("rect",{x:"5.518",y:"2.719",width:"8.964",height:"0.968",fill:"#555d66"}),Object(n.createElement)("rect",{x:"5.487",y:"15.28",width:"9.026",height:"2.499",fill:"#272b2f"})),Za.outlineleft=Object(n.createElement)("svg",{width:"20px",height:"20px",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",clipRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"1.414"},Object(n.createElement)("rect",{x:"2.202",y:"5.492",width:"2.503",height:"9.017",fill:"#272b2f"}),Object(n.createElement)("rect",{x:"16.276",y:"5.498",width:"1.012",height:"9.003",fill:"#555d66"}),Object(n.createElement)("rect",{x:"5.518",y:"2.719",width:"8.964",height:"0.966",fill:"#555d66"}),Object(n.createElement)("rect",{x:"5.487",y:"16.303",width:"9.026",height:"0.995",fill:"#555d66"})),Za.boxed=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5",clipRule:"evenodd",viewBox:"0 0 50 40"},Object(n.createElement)("path",{fill:"#CDCDCD",stroke:"#9A9A9A",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"}),Object(n.createElement)("path",{fill:"#fff",d:"M12.185 4.013H37.816V35.987H12.185z"}),Object(n.createElement)("path",{fill:"#CDCDCD",d:"M14.224 6.006H35.783V14.636000000000001H14.224z"}),Object(n.createElement)("path",{fill:"#CCC",fillRule:"nonzero",d:"M30.684 32.428H14.568c-.192 0-.351.353-.351.783 0 .429.159.783.351.783h16.116c.194 0 .352-.354.352-.783 0-.43-.158-.783-.352-.783zM35.324 29.284H14.677c-.246 0-.449.353-.449.783 0 .43.203.782.449.782h20.647c.246 0 .449-.352.449-.782 0-.43-.203-.783-.449-.783z"}),Object(n.createElement)("path",{fill:"#CDCDCD",fillRule:"nonzero",d:"M35.324 26.14H14.677c-.246 0-.449.354-.449.784 0 .428.203.782.449.782h20.647c.246 0 .449-.354.449-.782 0-.43-.203-.784-.449-.784zM35.324 22.997H14.677c-.246 0-.449.353-.449.782 0 .43.203.784.449.784h20.647c.246 0 .449-.354.449-.784 0-.429-.203-.782-.449-.782z"}),Object(n.createElement)("path",{fill:"#CCC",fillRule:"nonzero",d:"M35.324 19.853H14.677c-.246 0-.449.353-.449.783 0 .43.203.783.449.783h20.647c.246 0 .449-.353.449-.783 0-.43-.203-.783-.449-.783zM35.324 16.709H14.677c-.246 0-.449.354-.449.783 0 .429.203.783.449.783h20.647c.246 0 .449-.354.449-.783 0-.429-.203-.783-.449-.783z"})),Za.gridUnboxed=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5",clipRule:"evenodd",viewBox:"0 0 50 40"},Object(n.createElement)("path",{fill:"#fff",stroke:"#9A9A9A",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"}),Object(n.createElement)("path",{fill:"#CDCDCD",d:"M4.555 4.68H22.976V11.581H4.555z"}),Object(n.createElement)("path",{fill:"#CCC",fillRule:"nonzero",d:"M18.62 25.807H4.849c-.164 0-.3.283-.3.627 0 .343.136.626.3.626H18.62c.165 0 .3-.283.3-.626 0-.344-.135-.627-.3-.627zM22.584 23.294H4.942c-.21 0-.383.282-.383.626 0 .343.173.625.383.625h17.642c.21 0 .383-.282.383-.625 0-.344-.173-.626-.383-.626z"}),Object(n.createElement)("path",{fill:"#CDCDCD",fillRule:"nonzero",d:"M22.584 20.78H4.942c-.21 0-.383.282-.383.626 0 .343.173.626.383.626h17.642c.21 0 .383-.283.383-.626 0-.344-.173-.626-.383-.626zM22.584 18.266H4.942c-.21 0-.383.283-.383.626s.173.626.383.626h17.642c.21 0 .383-.283.383-.626s-.173-.626-.383-.626z"}),Object(n.createElement)("path",{fill:"#CCC",fillRule:"nonzero",d:"M22.584 15.753H4.942c-.21 0-.383.282-.383.625 0 .344.173.626.383.626h17.642c.21 0 .383-.282.383-.626 0-.343-.173-.625-.383-.625zM22.584 13.238H4.942c-.21 0-.383.283-.383.626 0 .344.173.627.383.627h17.642c.21 0 .383-.283.383-.627 0-.343-.173-.626-.383-.626z"}),Object(n.createElement)("g",null,Object(n.createElement)("path",{fill:"#CDCDCD",d:"M27.234 4.665H45.621V11.565999999999999H27.234z"}),Object(n.createElement)("path",{fill:"#CCC",fillRule:"nonzero",d:"M41.273 25.792H27.528c-.164 0-.3.283-.3.627 0 .343.136.626.3.626h13.745c.165 0 .299-.283.299-.626 0-.344-.134-.627-.299-.627zM45.23 23.279H27.621c-.21 0-.383.282-.383.626 0 .343.173.625.383.625H45.23c.209 0 .382-.282.382-.625 0-.344-.173-.626-.382-.626z"}),Object(n.createElement)("path",{fill:"#CDCDCD",fillRule:"nonzero",d:"M45.23 20.765H27.621c-.21 0-.383.283-.383.626s.173.626.383.626H45.23c.209 0 .382-.283.382-.626s-.173-.626-.382-.626zM45.23 18.251H27.621c-.21 0-.383.283-.383.626 0 .344.173.626.383.626H45.23c.209 0 .382-.282.382-.626 0-.343-.173-.626-.382-.626z"}),Object(n.createElement)("path",{fill:"#CCC",fillRule:"nonzero",d:"M45.23 15.738H27.621c-.21 0-.383.282-.383.625 0 .344.173.626.383.626H45.23c.209 0 .382-.282.382-.626 0-.343-.173-.625-.382-.625zM45.23 13.223H27.621c-.21 0-.383.283-.383.626 0 .344.173.627.383.627H45.23c.209 0 .382-.283.382-.627 0-.343-.173-.626-.382-.626z"})),Object(n.createElement)("g",null,Object(n.createElement)("path",{fill:"#CDCDCD",d:"M4.555 30.385H22.976V37.286H4.555z"}),Object(n.createElement)("path",{fill:"#CDCDCD",d:"M27.234 30.37H45.621V37.271H27.234z"}))),Za.gridBoxed=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5",clipRule:"evenodd",viewBox:"0 0 50 40"},Object(n.createElement)("path",{fill:"#CDCDCD",stroke:"#9A9A9A",strokeWidth:"1",d:"M49.007 2.918a1.9 1.9 0 00-1.898-1.898H2.891A1.9 1.9 0 00.993 2.918v34.164a1.9 1.9 0 001.898 1.898h44.218a1.9 1.9 0 001.898-1.898V2.918z"}),Object(n.createElement)("path",{fill:"#fff",d:"M4.415 4.606H23.453V28.356H4.415z"}),Object(n.createElement)("path",{fill:"#CDCDCD",d:"M5.929 6.087H21.942999999999998V12.497H5.929z"}),Object(n.createElement)("path",{fill:"#CCC",fillRule:"nonzero",d:"M18.156 25.712H6.185c-.143 0-.261.263-.261.582 0 .318.118.581.261.581h11.971c.143 0 .261-.263.261-.581 0-.319-.118-.582-.261-.582zM21.602 23.377H6.266c-.183 0-.334.262-.334.581 0 .32.151.582.334.582h15.336c.182 0 .333-.262.333-.582 0-.319-.151-.581-.333-.581z"}),Object(n.createElement)("path",{fill:"#CDCDCD",fillRule:"nonzero",d:"M21.602 21.042H6.266c-.183 0-.334.263-.334.582 0 .318.151.581.334.581h15.336c.182 0 .333-.263.333-.581 0-.319-.151-.582-.333-.582zM21.602 18.707H6.266c-.183 0-.334.263-.334.581 0 .319.151.582.334.582h15.336c.182 0 .333-.263.333-.582 0-.318-.151-.581-.333-.581z"}),Object(n.createElement)("path",{fill:"#CCC",fillRule:"nonzero",d:"M21.602 16.372H6.266c-.183 0-.334.262-.334.581 0 .32.151.582.334.582h15.336c.182 0 .333-.262.333-.582 0-.319-.151-.581-.333-.581zM21.602 14.037H6.266c-.183 0-.334.262-.334.581 0 .319.151.582.334.582h15.336c.182 0 .333-.263.333-.582 0-.319-.151-.581-.333-.581z"}),Object(n.createElement)("g",null,Object(n.createElement)("path",{fill:"#fff",d:"M26.548 4.592H45.586V28.342H26.548z"}),Object(n.createElement)("path",{fill:"#CDCDCD",d:"M28.062 6.073H44.076V12.483H28.062z"}),Object(n.createElement)("path",{fill:"#CCC",fillRule:"nonzero",d:"M40.289 25.698H28.318c-.143 0-.261.263-.261.582 0 .319.118.581.261.581h11.971c.143 0 .261-.262.261-.581 0-.319-.118-.582-.261-.582zM43.735 23.363H28.399c-.183 0-.333.262-.333.582 0 .319.15.581.333.581h15.336c.183 0 .333-.262.333-.581 0-.32-.15-.582-.333-.582z"}),Object(n.createElement)("path",{fill:"#CDCDCD",fillRule:"nonzero",d:"M43.735 21.028H28.399c-.183 0-.333.263-.333.582 0 .318.15.581.333.581h15.336c.183 0 .333-.263.333-.581 0-.319-.15-.582-.333-.582zM43.735 18.693H28.399c-.183 0-.333.263-.333.581 0 .32.15.582.333.582h15.336c.183 0 .333-.262.333-.582 0-.318-.15-.581-.333-.581z"}),Object(n.createElement)("path",{fill:"#CCC",fillRule:"nonzero",d:"M43.735 16.358H28.399c-.183 0-.333.262-.333.582 0 .319.15.581.333.581h15.336c.183 0 .333-.262.333-.581 0-.32-.15-.582-.333-.582zM43.735 14.023H28.399c-.183 0-.333.263-.333.581 0 .319.15.582.333.582h15.336c.183 0 .333-.263.333-.582 0-.318-.15-.581-.333-.581z"})),Object(n.createElement)("g",null,Object(n.createElement)("path",{fill:"#fff",d:"M4.415 31.302H23.453V38.488H4.415z"}),Object(n.createElement)("path",{fill:"#CDCDCD",d:"M5.929 32.783H21.942999999999998V38.492000000000004H5.929z"}),Object(n.createElement)("g",null,Object(n.createElement)("path",{fill:"#fff",d:"M26.548 31.288H45.586V38.485H26.548z"}),Object(n.createElement)("path",{fill:"#CDCDCD",d:"M28.062 32.769H44.076V38.485H28.062z"})))),Za.shoppingBag=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M19 5H5l1.5-2h11zm2.794.392L18.8 1.4A1 1 0 0018 1H6a1 1 0 00-.8.4L2.206 5.392A.978.978 0 002 6v14a2.997 2.997 0 003 3h14a2.997 2.997 0 003-3V6a.997.997 0 00-.189-.585L21.8 5.4zM4 7h16v13c0 .276-.111.525-.293.707S19.276 21 19 21H5c-.276 0-.525-.111-.707-.293S4 20.276 4 20zm11 3c0 .829-.335 1.577-.879 2.121S12.829 13 12 13s-1.577-.335-2.121-.879S9 10.829 9 10a1 1 0 00-2 0c0 1.38.561 2.632 1.464 3.536S10.62 15 12 15s2.632-.561 3.536-1.464S17 11.38 17 10a1 1 0 00-2 0z"})),Za.shoppingCart=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M11 21c0-.552-.225-1.053-.586-1.414a1.996 1.996 0 00-2.828 0 1.996 1.996 0 000 2.828 1.996 1.996 0 002.828 0c.361-.361.586-.862.586-1.414zm11 0c0-.552-.225-1.053-.586-1.414a1.996 1.996 0 00-2.828 0 1.996 1.996 0 000 2.828 1.996 1.996 0 002.828 0c.361-.361.586-.862.586-1.414zM7.221 7h14.57l-1.371 7.191A1 1 0 0119.4 15H9.666a1.016 1.016 0 01-.626-.203.99.99 0 01-.379-.603zM1 2h3.18l.848 4.239C5.136 6.676 5.53 7 6 7h1.221l-.4-2H6a1 1 0 00-.971 1.239L6.7 14.586A3.009 3.009 0 009.694 17H19.4a2.97 2.97 0 001.995-.727 3.02 3.02 0 00.985-1.683l1.602-8.402A1 1 0 0023 5H6.82L5.98.804A1 1 0 005 0H1a1 1 0 000 2z"})),Za.checkbox=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},Object(n.createElement)("path",{d:"M0 0v16h16V0H0zm15 15H1V1h14v14z"}),Object(n.createElement)("path",{d:"M2.5 8L4 6.5 6.5 9 12 3.5 13.5 5l-7 7z"})),Za.checkbox_alt=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},Object(n.createElement)("path",{d:"M14 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM7 12.414L3.293 8.707l1.414-1.414L7 9.586l4.793-4.793 1.414 1.414L7 12.414z"})),Za.check=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},Object(n.createElement)("path",{d:"M14 2.5L5.5 11 2 7.5.5 9l5 5 10-10z"})),Za.shield_check=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},Object(n.createElement)("path",{d:"M13.739 3.061l-5.5-3a.497.497 0 00-.478 0l-5.5 3A.5.5 0 002 3.5v4c0 2.2.567 3.978 1.735 5.437.912 1.14 2.159 2.068 4.042 3.01a.502.502 0 00.448 0c1.883-.942 3.13-1.87 4.042-3.01 1.167-1.459 1.735-3.238 1.735-5.437v-4a.5.5 0 00-.261-.439zM6.5 11.296L3.704 8.5l.796-.795 2 2 5-5 .796.795-5.795 5.795z"})),Za.disc=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},Object(n.createElement)("path",{d:"M5 8a3 3 0 116 0 3 3 0 01-6 0z"})),Za.arrowUp=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M5.707 12.707L11 7.414V19a1 1 0 002 0V7.414l5.293 5.293a.999.999 0 101.414-1.414l-7-7A1.008 1.008 0 0012 4a.997.997 0 00-.707.293l-7 7a.999.999 0 101.414 1.414z"})),Za.arrowUp2=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"26",height:"28",viewBox:"0 0 26 28"},Object(n.createElement)("path",{d:"M25.172 15.172c0 .531-.219 1.031-.578 1.406l-1.172 1.172c-.375.375-.891.594-1.422.594s-1.047-.219-1.406-.594L16 13.172v11C16 25.297 15.062 26 14 26h-2c-1.062 0-2-.703-2-1.828v-11L5.406 17.75a1.96 1.96 0 01-2.812 0l-1.172-1.172c-.375-.375-.594-.875-.594-1.406s.219-1.047.594-1.422L11.594 3.578C11.953 3.203 12.469 3 13 3s1.047.203 1.422.578L24.594 13.75c.359.375.578.891.578 1.422z"})),Za.chevronUp=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M18.707 14.293l-6-6a.999.999 0 00-1.414 0l-6 6a.999.999 0 101.414 1.414L12 10.414l5.293 5.293a.999.999 0 101.414-1.414z"})),Za.chevronUp2=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"28",height:"28",viewBox:"0 0 28 28"},Object(n.createElement)("path",{d:"M26.297 20.797l-2.594 2.578a.99.99 0 01-1.406 0L14 15.078l-8.297 8.297a.99.99 0 01-1.406 0l-2.594-2.578a1.009 1.009 0 010-1.422L13.297 7.797a.99.99 0 011.406 0l11.594 11.578a1.009 1.009 0 010 1.422z"})),Za.account=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M21 21v-2c0-1.38-.561-2.632-1.464-3.536S17.38 14 16 14H8c-1.38 0-2.632.561-3.536 1.464S3 17.62 3 19v2a1 1 0 002 0v-2c0-.829.335-1.577.879-2.121S7.171 16 8 16h8c.829 0 1.577.335 2.121.879S19 18.171 19 19v2a1 1 0 002 0zM17 7c0-1.38-.561-2.632-1.464-3.536S13.38 2 12 2s-2.632.561-3.536 1.464S7 5.62 7 7s.561 2.632 1.464 3.536S10.62 12 12 12s2.632-.561 3.536-1.464S17 8.38 17 7zm-2 0c0 .829-.335 1.577-.879 2.121S12.829 10 12 10s-1.577-.335-2.121-.879S9 7.829 9 7s.335-1.577.879-2.121S11.171 4 12 4s1.577.335 2.121.879S15 6.171 15 7z"})),Za.account2=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"28",height:"28",viewBox:"0 0 28 28"},Object(n.createElement)("path",{d:"M23.797 20.922c-.406-2.922-1.594-5.516-4.25-5.875-1.375 1.5-3.359 2.453-5.547 2.453s-4.172-.953-5.547-2.453c-2.656.359-3.844 2.953-4.25 5.875C6.375 23.985 9.953 26 14 26s7.625-2.016 9.797-5.078zM20 10c0-3.313-2.688-6-6-6s-6 2.688-6 6 2.688 6 6 6 6-2.688 6-6zm8 4c0 7.703-6.25 14-14 14-7.734 0-14-6.281-14-14C0 6.266 6.266 0 14 0s14 6.266 14 14z"})),Za.account3=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"28",height:"28",viewBox:"0 0 28 28"},Object(n.createElement)("path",{d:"M14 0c7.734 0 14 6.266 14 14 0 7.688-6.234 14-14 14-7.75 0-14-6.297-14-14C0 6.266 6.266 0 14 0zm9.672 21.109C25.125 19.109 26 16.656 26 14c0-6.609-5.391-12-12-12S2 7.391 2 14c0 2.656.875 5.109 2.328 7.109C4.89 18.312 6.25 16 9.109 16a6.979 6.979 0 009.782 0c2.859 0 4.219 2.312 4.781 5.109zM20 11c0-3.313-2.688-6-6-6s-6 2.688-6 6 2.688 6 6 6 6-2.688 6-6z"})),Za.hours=Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M14 8.5v7c0 .281-.219.5-.5.5h-5a.494.494 0 01-.5-.5v-1c0-.281.219-.5.5-.5H12V8.5c0-.281.219-.5.5-.5h1c.281 0 .5.219.5.5zm6.5 5.5c0-4.688-3.813-8.5-8.5-8.5S3.5 9.313 3.5 14s3.813 8.5 8.5 8.5 8.5-3.813 8.5-8.5zm3.5 0c0 6.625-5.375 12-12 12S0 20.625 0 14 5.375 2 12 2s12 5.375 12 12z"}));var Ka=Za,$a=(r(90),{behance:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"32",height:"28",viewBox:"0 0 32 28"},Object(n.createElement)("path",{d:"M28.875 5.297h-7.984v1.937h7.984V5.297zm-3.937 6.656c-1.875 0-3.125 1.172-3.25 3.047h6.375c-.172-1.891-1.156-3.047-3.125-3.047zm.25 9.141c1.188 0 2.719-.641 3.094-1.859h3.453c-1.062 3.266-3.266 4.797-6.672 4.797-4.5 0-7.297-3.047-7.297-7.484 0-4.281 2.953-7.547 7.297-7.547 4.469 0 6.937 3.516 6.937 7.734 0 .25-.016.5-.031.734H21.688c0 2.281 1.203 3.625 3.5 3.625zm-20.86-.782h4.625c1.766 0 3.203-.625 3.203-2.609 0-2.016-1.203-2.812-3.109-2.812H4.328v5.422zm0-8.39h4.391c1.547 0 2.641-.672 2.641-2.344 0-1.813-1.406-2.25-2.969-2.25H4.329v4.594zM0 3.969h9.281c3.375 0 6.297.953 6.297 4.875 0 1.984-.922 3.266-2.688 4.109 2.422.688 3.594 2.516 3.594 4.984 0 4-3.359 5.719-6.937 5.719H0V3.968z"})),dribbble:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M16 23.438c-.156-.906-.75-4.031-2.188-7.781-.016 0-.047.016-.063.016 0 0-6.078 2.125-8.047 6.406-.094-.078-.234-.172-.234-.172a10.297 10.297 0 006.531 2.344c1.422 0 2.766-.297 4-.812zm-2.891-9.485a29.025 29.025 0 00-.828-1.734C7 13.797 1.937 13.672 1.765 13.672c-.016.109-.016.219-.016.328 0 2.625 1 5.031 2.625 6.844 2.797-4.984 8.328-6.766 8.328-6.766.141-.047.281-.078.406-.125zm-1.671-3.312a61.656 61.656 0 00-3.813-5.906 10.267 10.267 0 00-5.656 7.156c.266 0 4.547.047 9.469-1.25zm10.687 4.984c-.219-.063-3.078-.969-6.391-.453 1.344 3.703 1.891 6.719 2 7.328a10.293 10.293 0 004.391-6.875zM9.547 4.047c-.016 0-.016 0-.031.016 0 0 .016-.016.031-.016zm9.219 2.265a10.17 10.17 0 00-9.188-2.265c.156.203 2.094 2.75 3.844 5.969 3.859-1.437 5.313-3.656 5.344-3.703zm3.484 7.579a10.273 10.273 0 00-2.328-6.406c-.031.031-1.672 2.406-5.719 4.062.234.484.469.984.688 1.484.078.172.141.359.219.531 3.531-.453 7.016.313 7.141.328zM24 14c0 6.625-5.375 12-12 12S0 20.625 0 14 5.375 2 12 2s12 5.375 12 12z"})),facebook:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M19.5 2C21.984 2 24 4.016 24 6.5v15c0 2.484-2.016 4.5-4.5 4.5h-2.938v-9.297h3.109l.469-3.625h-3.578v-2.312c0-1.047.281-1.75 1.797-1.75L20.265 9V5.766c-.328-.047-1.469-.141-2.781-.141-2.766 0-4.672 1.687-4.672 4.781v2.672H9.687v3.625h3.125V26H4.499a4.502 4.502 0 01-4.5-4.5v-15c0-2.484 2.016-4.5 4.5-4.5h15z"})),facebookAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M17 3v2h-2c-.552 0-1.053.225-1.414.586S13 6.448 13 7v3a1 1 0 001 1h2.719l-.5 2H14a1 1 0 00-1 1v7h-2v-7a1 1 0 00-1-1H8v-2h2a1 1 0 001-1V7c0-1.105.447-2.103 1.172-2.828S13.895 3 15 3zm1-2h-3c-1.657 0-3.158.673-4.243 1.757S9 5.343 9 7v2H7a1 1 0 00-1 1v4a1 1 0 001 1h2v7a1 1 0 001 1h4a1 1 0 001-1v-7h2c.466 0 .858-.319.97-.757l1-4A1 1 0 0018 9h-3V7h3a1 1 0 001-1V2a1 1 0 00-1-1z"})),facebookAlt2:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"28",viewBox:"0 0 16 28"},Object(n.createElement)("path",{d:"M14.984.187v4.125h-2.453c-1.922 0-2.281.922-2.281 2.25v2.953h4.578l-.609 4.625H10.25v11.859H5.469V14.14H1.485V9.515h3.984V6.109C5.469 2.156 7.891 0 11.422 0c1.687 0 3.141.125 3.563.187z"})),github:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M12 2c6.625 0 12 5.375 12 12 0 5.297-3.437 9.797-8.203 11.391-.609.109-.828-.266-.828-.578 0-.391.016-1.687.016-3.297 0-1.125-.375-1.844-.812-2.219 2.672-.297 5.484-1.313 5.484-5.922 0-1.313-.469-2.375-1.234-3.219.125-.313.531-1.531-.125-3.187-1-.313-3.297 1.234-3.297 1.234a11.28 11.28 0 00-6 0S6.704 6.656 5.704 6.969c-.656 1.656-.25 2.875-.125 3.187-.766.844-1.234 1.906-1.234 3.219 0 4.594 2.797 5.625 5.469 5.922-.344.313-.656.844-.766 1.609-.688.313-2.438.844-3.484-1-.656-1.141-1.844-1.234-1.844-1.234-1.172-.016-.078.734-.078.734.781.359 1.328 1.75 1.328 1.75.703 2.141 4.047 1.422 4.047 1.422 0 1 .016 1.937.016 2.234 0 .313-.219.688-.828.578C3.439 23.796.002 19.296.002 13.999c0-6.625 5.375-12 12-12zM4.547 19.234c.031-.063-.016-.141-.109-.187-.094-.031-.172-.016-.203.031-.031.063.016.141.109.187.078.047.172.031.203-.031zm.484.532c.063-.047.047-.156-.031-.25-.078-.078-.187-.109-.25-.047-.063.047-.047.156.031.25.078.078.187.109.25.047zm.469.703c.078-.063.078-.187 0-.297-.063-.109-.187-.156-.266-.094-.078.047-.078.172 0 .281s.203.156.266.109zm.656.656c.063-.063.031-.203-.063-.297-.109-.109-.25-.125-.313-.047-.078.063-.047.203.063.297.109.109.25.125.313.047zm.891.391c.031-.094-.063-.203-.203-.25-.125-.031-.266.016-.297.109s.063.203.203.234c.125.047.266 0 .297-.094zm.984.078c0-.109-.125-.187-.266-.172-.141 0-.25.078-.25.172 0 .109.109.187.266.172.141 0 .25-.078.25-.172zm.906-.156c-.016-.094-.141-.156-.281-.141-.141.031-.234.125-.219.234.016.094.141.156.281.125s.234-.125.219-.219z"})),githubAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M8.713 18.042c-1.268.38-2.06.335-2.583.17a2.282 2.282 0 01-.614-.302c-.411-.284-.727-.675-1.119-1.172-.356-.451-.85-1.107-1.551-1.476a2.694 2.694 0 00-.604-.232 1 1 0 10-.485 1.941c.074.023.155.06.155.06.252.133.487.404.914.946.366.464.856 1.098 1.553 1.579.332.229.711.426 1.149.564 1.015.321 2.236.296 3.76-.162a1 1 0 10-.575-1.915zM17 22v-3.792a4.377 4.377 0 00-.292-1.942c.777-.171 1.563-.427 2.297-.823 2.083-1.124 3.496-3.242 3.496-6.923a6.408 6.408 0 00-1.379-3.981 6.044 6.044 0 00-.293-3.933 1 1 0 00-.634-.564c-.357-.106-1.732-.309-4.373 1.362a14.24 14.24 0 00-6.646-.002C6.537-.267 5.163-.064 4.806.042a.998.998 0 00-.635.565 6.044 6.044 0 00-.292 3.932A6.414 6.414 0 002.5 8.556c0 3.622 1.389 5.723 3.441 6.859.752.416 1.56.685 2.357.867a4.395 4.395 0 00-.299 1.88L8 22a1 1 0 002 0v-3.87l-.002-.069a2.357 2.357 0 01.661-1.816 1 1 0 00-.595-1.688c-.34-.042-.677-.094-1.006-.159-.79-.156-1.518-.385-2.147-.733-1.305-.723-2.391-2.071-2.41-5.042.013-1.241.419-2.319 1.224-3.165a1 1 0 00.212-1.04 4.045 4.045 0 01-.14-2.392c.491.107 1.354.416 2.647 1.282a1 1 0 00.825.133 12.229 12.229 0 016.47.002.994.994 0 00.818-.135c1.293-.866 2.156-1.175 2.647-1.282a4.041 4.041 0 01-.141 2.392c-.129.352-.058.755.213 1.04a4.419 4.419 0 011.224 3.06c0 3.075-1.114 4.445-2.445 5.163-.623.336-1.343.555-2.123.7-.322.06-.651.106-.983.143a1 1 0 00-.608 1.689 2.36 2.36 0 01.662 1.837l-.003.078V22a1 1 0 002 0z"})),facebook_group:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"30",height:"28",viewBox:"0 0 30 28"},Object(n.createElement)("path",{d:"M9.266 14a5.532 5.532 0 00-4.141 2H3.031C1.468 16 0 15.25 0 13.516 0 12.25-.047 8 1.937 8c.328 0 1.953 1.328 4.062 1.328.719 0 1.406-.125 2.078-.359A7.624 7.624 0 007.999 10c0 1.422.453 2.828 1.266 4zM26 23.953C26 26.484 24.328 28 21.828 28H8.172C5.672 28 4 26.484 4 23.953 4 20.422 4.828 15 9.406 15c.531 0 2.469 2.172 5.594 2.172S20.063 15 20.594 15C25.172 15 26 20.422 26 23.953zM10 4c0 2.203-1.797 4-4 4S2 6.203 2 4s1.797-4 4-4 4 1.797 4 4zm11 6c0 3.313-2.688 6-6 6s-6-2.688-6-6 2.688-6 6-6 6 2.688 6 6zm9 3.516C30 15.25 28.531 16 26.969 16h-2.094a5.532 5.532 0 00-4.141-2A7.066 7.066 0 0022 10a7.6 7.6 0 00-.078-1.031A6.258 6.258 0 0024 9.328C26.109 9.328 27.734 8 28.062 8c1.984 0 1.937 4.25 1.937 5.516zM28 4c0 2.203-1.797 4-4 4s-4-1.797-4-4 1.797-4 4-4 4 1.797 4 4z"})),instagram:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 32 32"},Object(n.createElement)("path",{d:"M21.138.242c3.767.007 3.914.038 4.65.144 1.52.219 2.795.825 3.837 1.821a6.243 6.243 0 011.349 1.848c.442.899.659 1.75.758 3.016.021.271.031 4.592.031 8.916s-.009 8.652-.03 8.924c-.098 1.245-.315 2.104-.743 2.986a6.6 6.6 0 01-4.303 3.522c-.685.177-1.304.26-2.371.31-.381.019-4.361.024-8.342.024s-7.959-.012-8.349-.029c-.921-.044-1.639-.136-2.288-.303a6.64 6.64 0 01-4.303-3.515c-.436-.904-.642-1.731-.751-3.045-.031-.373-.039-2.296-.039-8.87 0-2.215-.002-3.866 0-5.121.006-3.764.037-3.915.144-4.652.219-1.518.825-2.795 1.825-3.833a6.302 6.302 0 011.811-1.326C4.939.603 5.78.391 7.13.278 7.504.247 9.428.24 16.008.24h5.13zm-5.139 4.122c-3.159 0-3.555.014-4.796.07-1.239.057-2.084.253-2.824.541-.765.297-1.415.695-2.061 1.342S5.273 7.613 4.975 8.378c-.288.74-.485 1.586-.541 2.824-.056 1.241-.07 1.638-.07 4.798s.014 3.556.07 4.797c.057 1.239.253 2.084.541 2.824.297.765.695 1.415 1.342 2.061s1.296 1.046 2.061 1.343c.74.288 1.586.484 2.825.541 1.241.056 1.638.07 4.798.07s3.556-.014 4.797-.07c1.239-.057 2.085-.253 2.826-.541.765-.297 1.413-.696 2.06-1.343s1.045-1.296 1.343-2.061c.286-.74.482-1.586.541-2.824.056-1.241.07-1.637.07-4.797s-.015-3.557-.07-4.798c-.058-1.239-.255-2.084-.541-2.824-.298-.765-.696-1.415-1.343-2.061s-1.295-1.045-2.061-1.342c-.742-.288-1.588-.484-2.827-.541-1.241-.056-1.636-.07-4.796-.07zm-1.042 2.097h1.044c3.107 0 3.475.011 4.702.067 1.135.052 1.75.241 2.16.401.543.211.93.463 1.337.87s.659.795.871 1.338c.159.41.349 1.025.401 2.16.056 1.227.068 1.595.068 4.701s-.012 3.474-.068 4.701c-.052 1.135-.241 1.75-.401 2.16-.211.543-.463.93-.871 1.337s-.794.659-1.337.87c-.41.16-1.026.349-2.16.401-1.227.056-1.595.068-4.702.068s-3.475-.012-4.702-.068c-1.135-.052-1.75-.242-2.161-.401-.543-.211-.931-.463-1.338-.87s-.659-.794-.871-1.337c-.159-.41-.349-1.025-.401-2.16-.056-1.227-.067-1.595-.067-4.703s.011-3.474.067-4.701c.052-1.135.241-1.75.401-2.16.211-.543.463-.931.871-1.338s.795-.659 1.338-.871c.41-.16 1.026-.349 2.161-.401 1.073-.048 1.489-.063 3.658-.065v.003zm1.044 3.563a5.977 5.977 0 10.001 11.953 5.977 5.977 0 00-.001-11.953zm0 2.097a3.879 3.879 0 110 7.758 3.879 3.879 0 010-7.758zm6.211-3.728a1.396 1.396 0 100 2.792 1.396 1.396 0 000-2.792v.001z"})),instagramAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M7 1c-1.657 0-3.158.673-4.243 1.757S1 5.343 1 7v10c0 1.657.673 3.158 1.757 4.243S5.343 23 7 23h10c1.657 0 3.158-.673 4.243-1.757S23 18.657 23 17V7c0-1.657-.673-3.158-1.757-4.243S18.657 1 17 1zm0 2h10c1.105 0 2.103.447 2.828 1.172S21 5.895 21 7v10c0 1.105-.447 2.103-1.172 2.828S18.105 21 17 21H7c-1.105 0-2.103-.447-2.828-1.172S3 18.105 3 17V7c0-1.105.447-2.103 1.172-2.828S5.895 3 7 3zm9.989 8.223a5.054 5.054 0 00-1.194-2.567 4.962 4.962 0 00-3.009-1.644 4.904 4.904 0 00-1.477-.002c-1.366.202-2.521.941-3.282 1.967s-1.133 2.347-.93 3.712.941 2.521 1.967 3.282 2.347 1.133 3.712.93 2.521-.941 3.282-1.967 1.133-2.347.93-3.712zm-1.978.294c.122.82-.1 1.609-.558 2.227s-1.15 1.059-1.969 1.18-1.609-.1-2.227-.558-1.059-1.15-1.18-1.969.1-1.609.558-2.227 1.15-1.059 1.969-1.18a2.976 2.976 0 012.688.984c.375.428.63.963.72 1.543zM17.5 7.5a1 1 0 100-2 1 1 0 000 2z"})),linkedin:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M3.703 22.094h3.609V11.25H3.703v10.844zM7.547 7.906c-.016-1.062-.781-1.875-2.016-1.875s-2.047.812-2.047 1.875c0 1.031.781 1.875 2 1.875H5.5c1.266 0 2.047-.844 2.047-1.875zm9.141 14.188h3.609v-6.219c0-3.328-1.781-4.875-4.156-4.875-1.937 0-2.797 1.078-3.266 1.828h.031V11.25H9.297s.047 1.016 0 10.844h3.609v-6.062c0-.313.016-.641.109-.875.266-.641.859-1.313 1.859-1.313 1.297 0 1.813.984 1.813 2.453v5.797zM24 6.5v15c0 2.484-2.016 4.5-4.5 4.5h-15A4.502 4.502 0 010 21.5v-15C0 4.016 2.016 2 4.5 2h15C21.984 2 24 4.016 24 6.5z"})),linkedinAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M16 7c-1.933 0-3.684.785-4.95 2.05S9 12.067 9 14v7a1 1 0 001 1h4a1 1 0 001-1v-7c0-.276.111-.525.293-.707S15.724 13 16 13s.525.111.707.293.293.431.293.707v7a1 1 0 001 1h4a1 1 0 001-1v-7c0-1.933-.785-3.684-2.05-4.95S17.933 7 16 7zm0 2c1.381 0 2.63.559 3.536 1.464S21 12.619 21 14v6h-2v-6a2.997 2.997 0 00-5.121-2.121A2.997 2.997 0 0013 14v6h-2v-6c0-1.381.559-2.63 1.464-3.536S14.619 9 16 9zM2 8a1 1 0 00-1 1v12a1 1 0 001 1h4a1 1 0 001-1V9a1 1 0 00-1-1zm1 2h2v10H3zm4-6a2.997 2.997 0 00-5.121-2.121 2.997 2.997 0 000 4.242 2.997 2.997 0 004.242 0A2.997 2.997 0 007 4zM5 4c0 .276-.111.525-.293.707S4.276 5 4 5s-.525-.111-.707-.293S3 4.276 3 4s.111-.525.293-.707S3.724 3 4 3s.525.111.707.293S5 3.724 5 4z"})),medium:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 32 32"},Object(n.createElement)("path",{d:"M0 0v32h32V0zm26.584 7.581l-1.716 1.645a.5.5 0 00-.191.486v-.003 12.089a.502.502 0 00.189.481l.001.001 1.676 1.645v.361h-8.429v-.36l1.736-1.687c.171-.171.171-.22.171-.48v-9.773l-4.827 12.26h-.653L8.92 11.986v8.217a1.132 1.132 0 00.311.943l2.259 2.739v.361H5.087v-.36l2.26-2.74a1.09 1.09 0 00.289-.949l.001.007v-9.501a.83.83 0 00-.27-.702L7.366 10 5.358 7.581v-.36h6.232l4.817 10.564L20.642 7.22h5.941z"})),patreon:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"33",height:"32",viewBox:"0 0 33 32"},Object(n.createElement)("path",{d:"M21.37.033c-6.617 0-12.001 5.383-12.001 11.999 0 6.597 5.383 11.963 12.001 11.963 6.597 0 11.963-5.367 11.963-11.963C33.333 5.415 27.966.033 21.37.033zM.004 31.996h5.859V.033H.004z"})),pinterest:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M19.5 2C21.984 2 24 4.016 24 6.5v15c0 2.484-2.016 4.5-4.5 4.5H8.172c.516-.734 1.359-2 1.687-3.281 0 0 .141-.531.828-3.266.422.797 1.625 1.484 2.906 1.484 3.813 0 6.406-3.484 6.406-8.141 0-3.516-2.984-6.797-7.516-6.797-5.641 0-8.484 4.047-8.484 7.422 0 2.031.781 3.844 2.438 4.531.266.109.516 0 .594-.297.047-.203.172-.734.234-.953.078-.297.047-.406-.172-.656-.469-.578-.781-1.297-.781-2.344 0-3 2.25-5.672 5.844-5.672 3.187 0 4.937 1.937 4.937 4.547 0 3.422-1.516 6.312-3.766 6.312-1.234 0-2.172-1.031-1.875-2.297.359-1.5 1.047-3.125 1.047-4.203 0-.969-.516-1.781-1.594-1.781-1.266 0-2.281 1.313-2.281 3.063 0 0 0 1.125.375 1.891-1.297 5.5-1.531 6.469-1.531 6.469-.344 1.437-.203 3.109-.109 3.969H4.5A4.502 4.502 0 010 21.5v-15C0 4.016 2.016 2 4.5 2h15z"})),pinterestAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},Object(n.createElement)("path",{d:"M8 0C3.588 0 0 3.587 0 8s3.587 8 8 8 8-3.588 8-8-3.588-8-8-8zm0 14.931a6.959 6.959 0 01-2.053-.309c.281-.459.706-1.216.862-1.816.084-.325.431-1.647.431-1.647.225.431.888.797 1.587.797 2.091 0 3.597-1.922 3.597-4.313 0-2.291-1.869-4.003-4.272-4.003-2.991 0-4.578 2.009-4.578 4.194 0 1.016.541 2.281 1.406 2.684.131.063.2.034.231-.094.022-.097.141-.566.194-.787a.213.213 0 00-.047-.2c-.287-.347-.516-.988-.516-1.581 0-1.528 1.156-3.009 3.128-3.009 1.703 0 2.894 1.159 2.894 2.819 0 1.875-.947 3.175-2.178 3.175-.681 0-1.191-.563-1.025-1.253.197-.825.575-1.713.575-2.306 0-.531-.284-.975-.878-.975-.697 0-1.253.719-1.253 1.684 0 .612.206 1.028.206 1.028s-.688 2.903-.813 3.444c-.141.6-.084 1.441-.025 1.988a6.922 6.922 0 01-4.406-6.45 6.93 6.93 0 116.931 6.931z"})),reddit:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M14.672 17.641a.293.293 0 010 .406c-.766.766-2.234.828-2.672.828s-1.906-.063-2.672-.828a.293.293 0 010-.406.267.267 0 01.406 0c.484.484 1.531.656 2.266.656s1.781-.172 2.266-.656a.267.267 0 01.406 0zm-4.109-2.438c0 .656-.547 1.203-1.203 1.203s-1.203-.547-1.203-1.203a1.203 1.203 0 012.406 0zm5.281 0c0 .656-.547 1.203-1.203 1.203s-1.203-.547-1.203-1.203a1.203 1.203 0 012.406 0zm3.359-1.609c0-.875-.719-1.594-1.609-1.594a1.62 1.62 0 00-1.141.484c-1.094-.75-2.562-1.234-4.172-1.281l.844-3.797 2.672.609c.016.656.547 1.188 1.203 1.188S18.203 8.656 18.203 8 17.656 6.797 17 6.797a1.2 1.2 0 00-1.078.672l-2.953-.656c-.156-.047-.297.063-.328.203l-.938 4.188c-1.609.063-3.063.547-4.141 1.297a1.603 1.603 0 00-2.765 1.094c0 .641.375 1.188.906 1.453-.047.234-.078.5-.078.75 0 2.547 2.859 4.609 6.391 4.609s6.406-2.063 6.406-4.609a3.09 3.09 0 00-.094-.766c.516-.266.875-.812.875-1.437zM24 6.5v15c0 2.484-2.016 4.5-4.5 4.5h-15A4.502 4.502 0 010 21.5v-15C0 4.016 2.016 2 4.5 2h15C21.984 2 24 4.016 24 6.5z"})),redditAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},Object(n.createElement)("path",{d:"M4 10a1 1 0 112 0 1 1 0 01-2 0zm6 0a1 1 0 112 0 1 1 0 01-2 0zm.049 2.137a.593.593 0 11.735.933c-.717.565-1.81.93-2.783.93s-2.066-.365-2.784-.93a.593.593 0 11.735-.933c.413.325 1.23.675 2.049.675s1.636-.35 2.049-.675zM16 8a2 2 0 00-3.748-.972c-1.028-.562-2.28-.926-3.645-1.01L9.8 3.338l2.284.659a1.5 1.5 0 10.094-1.209l-2.545-.735a.593.593 0 00-.707.329L7.305 6.023c-1.33.094-2.551.453-3.557 1.004a2 2 0 10-2.555 2.802A3.661 3.661 0 001 10.999c0 2.761 3.134 5 7 5s7-2.239 7-5c0-.403-.067-.795-.193-1.17A2 2 0 0016 7.999zm-2.5-5.062a.563.563 0 110 1.126.563.563 0 010-1.126zM1 8a1 1 0 011.904-.427 5.292 5.292 0 00-1.276 1.355A1.001 1.001 0 011 8zm7 6.813c-3.21 0-5.813-1.707-5.813-3.813S4.789 7.187 8 7.187c3.21 0 5.813 1.707 5.813 3.813S11.211 14.813 8 14.813zm6.372-5.885a5.276 5.276 0 00-1.276-1.355C13.257 7.235 13.601 7 14 7a1.001 1.001 0 01.372 1.928z"})),rss:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M8 20c0-1.109-.891-2-2-2s-2 .891-2 2 .891 2 2 2 2-.891 2-2zm5.484 1.469a9.468 9.468 0 00-8.953-8.953c-.141-.016-.281.047-.375.141S4 12.876 4 13.016v2c0 .266.203.484.469.5 3.203.234 5.781 2.812 6.016 6.016a.498.498 0 00.5.469h2c.141 0 .266-.063.359-.156s.156-.234.141-.375zm6 .015C19.218 13.359 12.64 6.781 4.515 6.515a.38.38 0 00-.359.141.508.508 0 00-.156.359v2c0 .266.219.484.484.5 6.484.234 11.766 5.516 12 12a.51.51 0 00.5.484h2a.509.509 0 00.359-.156.4.4 0 00.141-.359zM24 6.5v15c0 2.484-2.016 4.5-4.5 4.5h-15A4.502 4.502 0 010 21.5v-15C0 4.016 2.016 2 4.5 2h15C21.984 2 24 4.016 24 6.5z"})),rssAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M4 12c2.209 0 4.208.894 5.657 2.343S12 17.791 12 20a1 1 0 002 0c0-2.761-1.12-5.263-2.929-7.071S6.761 10 4 10a1 1 0 000 2zm0-7c4.142 0 7.891 1.678 10.607 4.393S19 15.858 19 20a1 1 0 002 0c0-4.694-1.904-8.946-4.979-12.021S8.694 3 4 3a1 1 0 000 2zm3 14c0-.552-.225-1.053-.586-1.414a1.996 1.996 0 00-2.828 0 1.996 1.996 0 000 2.828 1.996 1.996 0 002.828 0C6.775 20.053 7 19.552 7 19z"})),tumblr:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"17",height:"28",viewBox:"0 0 17 28"},Object(n.createElement)("path",{d:"M14.75 20.766L16 24.469c-.469.703-2.594 1.5-4.5 1.531-5.672.094-7.812-4.031-7.812-6.937v-8.5H1.063V7.204C5.001 5.782 5.954 2.22 6.172.188c.016-.125.125-.187.187-.187h3.813v6.625h5.203v3.937h-5.219v8.094c0 1.094.406 2.609 2.5 2.562.688-.016 1.609-.219 2.094-.453z"})),twitter:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"26",height:"28",viewBox:"0 0 26 28"},Object(n.createElement)("path",{d:"M25.312 6.375a10.85 10.85 0 01-2.531 2.609c.016.219.016.438.016.656 0 6.672-5.078 14.359-14.359 14.359-2.859 0-5.516-.828-7.75-2.266.406.047.797.063 1.219.063 2.359 0 4.531-.797 6.266-2.156a5.056 5.056 0 01-4.719-3.5c.313.047.625.078.953.078.453 0 .906-.063 1.328-.172a5.048 5.048 0 01-4.047-4.953v-.063a5.093 5.093 0 002.281.641 5.044 5.044 0 01-2.25-4.203c0-.938.25-1.797.688-2.547a14.344 14.344 0 0010.406 5.281 5.708 5.708 0 01-.125-1.156 5.045 5.045 0 015.047-5.047 5.03 5.03 0 013.687 1.594 9.943 9.943 0 003.203-1.219 5.032 5.032 0 01-2.219 2.781c1.016-.109 2-.391 2.906-.781z"})),twitterAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M20.833 5.262a6.685 6.685 0 01-.616.696.997.997 0 00-.278.908c.037.182.06.404.061.634 0 5.256-2.429 8.971-5.81 10.898-2.647 1.509-5.938 1.955-9.222 1.12a12.682 12.682 0 003.593-1.69 1 1 0 00-.156-1.741c-2.774-1.233-4.13-2.931-4.769-4.593-.417-1.084-.546-2.198-.52-3.227.021-.811.138-1.56.278-2.182.394.343.803.706 1.235 1.038a11.59 11.59 0 007.395 2.407c.543-.015.976-.457.976-1V7.519a3.459 3.459 0 011.196-2.674c.725-.631 1.636-.908 2.526-.846s1.753.463 2.384 1.188a1 1 0 001.033.304c.231-.067.463-.143.695-.228zm1.591-3.079a9.884 9.884 0 01-2.287 1.205 5.469 5.469 0 00-3.276-1.385 5.465 5.465 0 00-3.977 1.332A5.464 5.464 0 0011 7.507a9.589 9.589 0 01-5.15-1.97 9.87 9.87 0 01-2.034-2.116 1 1 0 00-1.729.172s-.132.299-.285.76a13.57 13.57 0 00-.357 1.29 13.224 13.224 0 00-.326 2.571c-.031 1.227.12 2.612.652 3.996.683 1.775 1.966 3.478 4.147 4.823A10.505 10.505 0 011.045 18a1 1 0 00-.53 1.873c4.905 2.725 10.426 2.678 14.666.261C19.221 17.833 22 13.434 22 7.5a5.565 5.565 0 00-.023-.489 8.626 8.626 0 001.996-3.781 1 1 0 00-1.55-1.047z"})),vimeo:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"28",height:"28",viewBox:"0 0 28 28"},Object(n.createElement)("path",{d:"M26.703 8.094c-.109 2.469-1.844 5.859-5.187 10.172C18.047 22.75 15.141 25 12.735 25c-1.484 0-2.734-1.375-3.75-4.109-.688-2.5-1.375-5.016-2.063-7.531-.75-2.734-1.578-4.094-2.453-4.094-.187 0-.844.391-1.984 1.188L1.282 8.923c1.25-1.109 2.484-2.234 3.719-3.313 1.656-1.469 2.922-2.203 3.766-2.281 1.984-.187 3.187 1.156 3.656 4.047.484 3.125.844 5.078 1.031 5.828.578 2.594 1.188 3.891 1.875 3.891.531 0 1.328-.828 2.406-2.516 1.062-1.687 1.625-2.969 1.703-3.844.141-1.453-.422-2.172-1.703-2.172-.609 0-1.234.141-1.891.406 1.25-4.094 3.641-6.078 7.172-5.969 2.609.078 3.844 1.781 3.687 5.094z"})),vk:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"31",height:"28",viewBox:"0 0 31 28"},Object(n.createElement)("path",{d:"M29.953 8.125c.234.641-.5 2.141-2.344 4.594-3.031 4.031-3.359 3.656-.859 5.984 2.406 2.234 2.906 3.313 2.984 3.453 0 0 1 1.75-1.109 1.766l-4 .063c-.859.172-2-.609-2-.609-1.5-1.031-2.906-3.703-4-3.359 0 0-1.125.359-1.094 2.766.016.516-.234.797-.234.797s-.281.297-.828.344h-1.797c-3.953.25-7.438-3.391-7.438-3.391S3.421 16.595.078 8.736c-.219-.516.016-.766.016-.766s.234-.297.891-.297l4.281-.031c.406.063.688.281.688.281s.25.172.375.5c.703 1.75 1.609 3.344 1.609 3.344 1.563 3.219 2.625 3.766 3.234 3.437 0 0 .797-.484.625-4.375-.063-1.406-.453-2.047-.453-2.047-.359-.484-1.031-.625-1.328-.672-.234-.031.156-.594.672-.844.766-.375 2.125-.391 3.734-.375 1.266.016 1.625.094 2.109.203 1.484.359.984 1.734.984 5.047 0 1.062-.203 2.547.562 3.031.328.219 1.141.031 3.141-3.375 0 0 .938-1.625 1.672-3.516.125-.344.391-.484.391-.484s.25-.141.594-.094l4.5-.031c1.359-.172 1.578.453 1.578.453z"})),whatsapp:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M15.391 15.219c.266 0 2.812 1.328 2.922 1.516.031.078.031.172.031.234 0 .391-.125.828-.266 1.188-.359.875-1.813 1.437-2.703 1.437-.75 0-2.297-.656-2.969-.969-2.234-1.016-3.625-2.75-4.969-4.734-.594-.875-1.125-1.953-1.109-3.031v-.125c.031-1.031.406-1.766 1.156-2.469.234-.219.484-.344.812-.344.187 0 .375.047.578.047.422 0 .5.125.656.531.109.266.906 2.391.906 2.547 0 .594-1.078 1.266-1.078 1.625 0 .078.031.156.078.234.344.734 1 1.578 1.594 2.141.719.688 1.484 1.141 2.359 1.578a.681.681 0 00.344.109c.469 0 1.25-1.516 1.656-1.516zM12.219 23.5c5.406 0 9.812-4.406 9.812-9.812s-4.406-9.812-9.812-9.812-9.812 4.406-9.812 9.812c0 2.063.656 4.078 1.875 5.75l-1.234 3.641 3.781-1.203a9.875 9.875 0 005.391 1.625zm0-21.594C18.719 1.906 24 7.187 24 13.687s-5.281 11.781-11.781 11.781c-1.984 0-3.953-.5-5.703-1.469L0 26.093l2.125-6.328a11.728 11.728 0 01-1.687-6.078c0-6.5 5.281-11.781 11.781-11.781z"})),wordpress:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"28",height:"28",viewBox:"0 0 28 28"},Object(n.createElement)("path",{d:"M1.984 14c0-1.734.375-3.391 1.047-4.891l5.734 15.703c-4.016-1.953-6.781-6.062-6.781-10.813zm20.125-.609c0 1.031-.422 2.219-.922 3.891l-1.188 4-4.344-12.906s.719-.047 1.375-.125c.641-.078.562-1.031-.078-.984-1.953.141-3.203.156-3.203.156s-1.172-.016-3.156-.156c-.656-.047-.734.938-.078.984.609.063 1.25.125 1.25.125l1.875 5.125-2.625 7.875-4.375-13s.719-.047 1.375-.125c.641-.078.562-1.031-.078-.984-1.937.141-3.203.156-3.203.156-.219 0-.484-.016-.766-.016a11.966 11.966 0 0110.031-5.422c3.125 0 5.969 1.203 8.109 3.156h-.156c-1.172 0-2.016 1.016-2.016 2.125 0 .984.578 1.813 1.188 2.812.469.797.984 1.828.984 3.313zm-7.906 1.656l3.703 10.109a.59.59 0 00.078.172c-1.25.438-2.578.688-3.984.688-1.172 0-2.312-.172-3.391-.5zm10.328-6.813A11.98 11.98 0 0126.015 14c0 4.438-2.406 8.297-5.984 10.375l3.672-10.594c.609-1.75.922-3.094.922-4.312 0-.438-.031-.844-.094-1.234zM14 0c7.719 0 14 6.281 14 14s-6.281 14-14 14S0 21.719 0 14 6.281 0 14 0zm0 27.359c7.359 0 13.359-6 13.359-13.359S21.359.641 14 .641.641 6.641.641 14s6 13.359 13.359 13.359z"})),xing:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"22",height:"28",viewBox:"0 0 22 28"},Object(n.createElement)("path",{d:"M9.328 10.422s-.156.266-4.016 7.125c-.203.344-.469.719-1.016.719H.562c-.219 0-.391-.109-.484-.266s-.109-.359 0-.562l3.953-7c.016 0 .016 0 0-.016L1.515 6.063c-.109-.203-.125-.422-.016-.578.094-.156.281-.234.5-.234h3.734c.562 0 .844.375 1.031.703a773.586 773.586 0 002.562 4.469zM21.922.391c.109.156.109.375 0 .578l-8.25 14.594c-.016 0-.016.016 0 .016l5.25 9.609c.109.203.109.422.016.578-.109.156-.281.234-.5.234h-3.734c-.562 0-.859-.375-1.031-.703-5.297-9.703-5.297-9.719-5.297-9.719s.266-.469 8.297-14.719c.203-.359.438-.703 1-.703h3.766c.219 0 .391.078.484.234z"})),youtube:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"28",height:"28",viewBox:"0 0 28 28"},Object(n.createElement)("path",{d:"M11.109 17.625l7.562-3.906-7.562-3.953v7.859zM14 4.156c5.891 0 9.797.281 9.797.281.547.063 1.75.063 2.812 1.188 0 0 .859.844 1.109 2.781.297 2.266.281 4.531.281 4.531v2.125s.016 2.266-.281 4.531c-.25 1.922-1.109 2.781-1.109 2.781-1.062 1.109-2.266 1.109-2.812 1.172 0 0-3.906.297-9.797.297-7.281-.063-9.516-.281-9.516-.281-.625-.109-2.031-.078-3.094-1.188 0 0-.859-.859-1.109-2.781C-.016 17.327 0 15.062 0 15.062v-2.125s-.016-2.266.281-4.531C.531 6.469 1.39 5.625 1.39 5.625 2.452 4.5 3.656 4.5 4.202 4.437c0 0 3.906-.281 9.797-.281z"})),youtubeAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M21.563 6.637c.287 1.529.448 3.295.437 5.125a27.145 27.145 0 01-.437 5.021c-.057.208-.15.403-.272.575a1.743 1.743 0 01-.949.675c-.604.161-2.156.275-3.877.341-2.23.086-4.465.086-4.465.086s-2.235 0-4.465-.085c-1.721-.066-3.273-.179-3.866-.338a1.854 1.854 0 01-.566-.268 1.763 1.763 0 01-.67-.923c-.285-1.526-.444-3.286-.433-5.11-.021-1.54.121-3.292.437-5.06.057-.208.15-.403.272-.575.227-.321.558-.565.949-.675.604-.161 2.156-.275 3.877-.341C9.765 5 12 5 12 5s2.235 0 4.466.078c1.719.06 3.282.163 3.856.303.219.063.421.165.598.299.307.232.538.561.643.958zm1.947-.46a3.762 3.762 0 00-1.383-2.093 3.838 3.838 0 00-1.249-.625c-.898-.22-2.696-.323-4.342-.38C14.269 3 12 3 12 3s-2.272 0-4.541.087c-1.642.063-3.45.175-4.317.407a3.77 3.77 0 00-2.064 1.45 3.863 3.863 0 00-.602 1.339A29.155 29.155 0 000 11.764a29.2 29.2 0 00.477 5.502.878.878 0 00.021.088 3.76 3.76 0 001.451 2.048c.357.252.757.443 1.182.561.879.235 2.686.347 4.328.41 2.269.087 4.541.087 4.541.087s2.272 0 4.541-.087c1.642-.063 3.449-.175 4.317-.407a3.767 3.767 0 002.063-1.45c.27-.381.47-.811.587-1.267.006-.025.012-.05.015-.071.34-1.884.496-3.765.476-5.44a29.214 29.214 0 00-.477-5.504l-.012-.057zm-12.76 7.124v-3.102l2.727 1.551zm-.506 2.588l5.75-3.27a1 1 0 000-1.739l-5.75-3.27a1 1 0 00-1.495.869v6.54a1 1 0 001.494.869z"})),email:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},Object(n.createElement)("path",{d:"M15 2H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zM5.831 9.773l-3 2.182a.559.559 0 01-.785-.124.563.563 0 01.124-.786l3-2.182a.563.563 0 01.662.91zm8.124 2.058a.563.563 0 01-.785.124l-3-2.182a.563.563 0 01.662-.91l3 2.182a.563.563 0 01.124.786zm-.124-6.876l-5.5 4a.562.562 0 01-.662 0l-5.5-4a.563.563 0 01.662-.91L8 7.804l5.169-3.759a.563.563 0 01.662.91z"})),emailAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"28",height:"28",viewBox:"0 0 28 28"},Object(n.createElement)("path",{d:"M28 11.094V23.5c0 1.375-1.125 2.5-2.5 2.5h-23A2.507 2.507 0 010 23.5V11.094c.469.516 1 .969 1.578 1.359 2.594 1.766 5.219 3.531 7.766 5.391 1.313.969 2.938 2.156 4.641 2.156h.031c1.703 0 3.328-1.188 4.641-2.156 2.547-1.844 5.172-3.625 7.781-5.391a9.278 9.278 0 001.563-1.359zM28 6.5c0 1.75-1.297 3.328-2.672 4.281-2.438 1.687-4.891 3.375-7.313 5.078-1.016.703-2.734 2.141-4 2.141h-.031c-1.266 0-2.984-1.437-4-2.141-2.422-1.703-4.875-3.391-7.297-5.078-1.109-.75-2.688-2.516-2.688-3.938 0-1.531.828-2.844 2.5-2.844h23c1.359 0 2.5 1.125 2.5 2.5z"})),emailAlt2:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M3 7.921l8.427 5.899c.34.235.795.246 1.147 0L21 7.921V18c0 .272-.11.521-.295.705S20.272 19 20 19H4c-.272 0-.521-.11-.705-.295S3 18.272 3 18zM1 5.983V18c0 .828.34 1.579.88 2.12S3.172 21 4 21h16c.828 0 1.579-.34 2.12-.88S23 18.828 23 18V6.012v-.03a2.995 2.995 0 00-.88-2.102A2.998 2.998 0 0020 3H4c-.828 0-1.579.34-2.12.88A2.995 2.995 0 001 5.983zm19.894-.429L12 11.779 3.106 5.554a.999.999 0 01.188-.259A.994.994 0 014 5h16a1.016 1.016 0 01.893.554z"})),phone:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"28",viewBox:"0 0 12 28"},Object(n.createElement)("path",{d:"M7.25 22c0-.688-.562-1.25-1.25-1.25s-1.25.562-1.25 1.25.562 1.25 1.25 1.25 1.25-.562 1.25-1.25zm3.25-2.5v-11c0-.266-.234-.5-.5-.5H2c-.266 0-.5.234-.5.5v11c0 .266.234.5.5.5h8c.266 0 .5-.234.5-.5zm-3-13.25A.246.246 0 007.25 6h-2.5c-.141 0-.25.109-.25.25s.109.25.25.25h2.5c.141 0 .25-.109.25-.25zM12 6v16c0 1.094-.906 2-2 2H2c-1.094 0-2-.906-2-2V6c0-1.094.906-2 2-2h8c1.094 0 2 .906 2 2z"})),phoneAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},Object(n.createElement)("path",{d:"M7 1a2.997 2.997 0 00-3 3v16a2.997 2.997 0 003 3h10a2.997 2.997 0 003-3V4a2.997 2.997 0 00-3-3zm0 2h10c.276 0 .525.111.707.293S18 3.724 18 4v16c0 .276-.111.525-.293.707S17.276 21 17 21H7c-.276 0-.525-.111-.707-.293S6 20.276 6 20V4c0-.276.111-.525.293-.707S6.724 3 7 3zm5 16a1 1 0 100-2 1 1 0 000 2z"})),phoneAlt2:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M20 18.641c0-.078 0-.172-.031-.25-.094-.281-2.375-1.437-2.812-1.687-.297-.172-.656-.516-1.016-.516-.688 0-1.703 2.047-2.312 2.047-.313 0-.703-.281-.984-.438-2.063-1.156-3.484-2.578-4.641-4.641-.156-.281-.438-.672-.438-.984 0-.609 2.047-1.625 2.047-2.312 0-.359-.344-.719-.516-1.016-.25-.438-1.406-2.719-1.687-2.812-.078-.031-.172-.031-.25-.031-.406 0-1.203.187-1.578.344-1.031.469-1.781 2.438-1.781 3.516 0 1.047.422 2 .781 2.969 1.25 3.422 4.969 7.141 8.391 8.391.969.359 1.922.781 2.969.781 1.078 0 3.047-.75 3.516-1.781.156-.375.344-1.172.344-1.578zM24 6.5v15c0 2.484-2.016 4.5-4.5 4.5h-15A4.502 4.502 0 010 21.5v-15C0 4.016 2.016 2 4.5 2h15C21.984 2 24 4.016 24 6.5z"})),google_reviews:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M12 12.281h11.328c.109.609.187 1.203.187 2C23.515 21.125 18.921 26 11.999 26c-6.641 0-12-5.359-12-12s5.359-12 12-12c3.234 0 5.953 1.188 8.047 3.141L16.78 8.282c-.891-.859-2.453-1.859-4.781-1.859-4.094 0-7.438 3.391-7.438 7.578s3.344 7.578 7.438 7.578c4.75 0 6.531-3.406 6.813-5.172h-6.813v-4.125z"})),yelp:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M12.078 20.609v1.984c-.016 4.406-.016 4.562-.094 4.766-.125.328-.406.547-.797.625-1.125.187-4.641-1.109-5.375-1.984a1.107 1.107 0 01-.266-.562.882.882 0 01.063-.406c.078-.219.219-.391 3.359-4.109 0 0 .016 0 .938-1.094.313-.391.875-.516 1.391-.328.516.203.797.641.781 1.109zM9.75 16.688c-.031.547-.344.953-.812 1.094l-1.875.609c-4.203 1.344-4.344 1.375-4.562 1.375-.344-.016-.656-.219-.844-.562-.125-.25-.219-.672-.266-1.172-.172-1.531.031-3.828.484-4.547.219-.344.531-.516.875-.5.234 0 .422.094 4.953 1.937 0 0-.016.016 1.313.531.469.187.766.672.734 1.234zm12.906 4.64c-.156 1.125-2.484 4.078-3.547 4.5-.359.141-.719.109-.984-.109-.187-.141-.375-.422-2.875-4.484l-.734-1.203c-.281-.438-.234-1 .125-1.437.344-.422.844-.562 1.297-.406 0 0 .016.016 1.859.625 4.203 1.375 4.344 1.422 4.516 1.563.281.219.406.547.344.953zm-10.5-9.875c.078 1.625-.609 1.828-.844 1.906-.219.063-.906.266-1.781-1.109-5.75-9.078-5.906-9.344-5.906-9.344-.078-.328.016-.688.297-.969.859-.891 5.531-2.203 6.75-1.891.391.094.672.344.766.703.063.391.625 8.813.719 10.703zM22.5 13.141c.031.391-.109.719-.406.922-.187.125-.375.187-5.141 1.344-.766.172-1.188.281-1.422.359l.016-.031c-.469.125-1-.094-1.297-.562s-.281-.984 0-1.359c0 0 .016-.016 1.172-1.594 2.562-3.5 2.688-3.672 2.875-3.797.297-.203.656-.203 1.016-.031 1.016.484 3.063 3.531 3.187 4.703v.047z"})),trip_advisor:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"36",height:"28",viewBox:"0 0 36 28"},Object(n.createElement)("path",{d:"M10.172 15.578c0 .812-.656 1.469-1.453 1.469a1.467 1.467 0 01-1.469-1.469 1.46 1.46 0 012.922 0zm18.031-.015c0 .812-.656 1.469-1.469 1.469s-1.469-.656-1.469-1.469.656-1.453 1.469-1.453 1.469.641 1.469 1.453zm-16.25.015a3.028 3.028 0 00-3.016-3.016 3.018 3.018 0 00-3.016 3.016 3.008 3.008 0 003.016 3.016 3.018 3.018 0 003.016-3.016zm18.016-.015a3.018 3.018 0 00-3.016-3.016 3.028 3.028 0 00-3.016 3.016 3.018 3.018 0 003.016 3.016 3.008 3.008 0 003.016-3.016zm-16.688.015c0 2.406-1.937 4.359-4.344 4.359s-4.359-1.953-4.359-4.359c0-2.391 1.953-4.344 4.359-4.344s4.344 1.953 4.344 4.344zm18.032-.015a4.348 4.348 0 01-4.359 4.344 4.344 4.344 0 010-8.688 4.347 4.347 0 014.359 4.344zm-15.063.046A7.222 7.222 0 009.031 8.39c-3.969 0-7.203 3.234-7.203 7.219s3.234 7.219 7.203 7.219a7.222 7.222 0 007.219-7.219zm10.438-8.953c-2.578-1.125-5.484-1.734-8.687-1.734s-6.391.609-8.953 1.719c4.953.016 8.953 4.016 8.953 8.969a8.95 8.95 0 018.687-8.953zm7.484 8.953c0-3.984-3.219-7.219-7.203-7.219s-7.219 3.234-7.219 7.219 3.234 7.219 7.219 7.219 7.203-3.234 7.203-7.219zm-4.156-8.843H36c-.938 1.094-1.625 2.562-1.797 3.578a8.921 8.921 0 011.719 5.266c0 4.953-4.016 8.953-8.953 8.953a8.927 8.927 0 01-6.953-3.297s-.734.875-2.016 2.797c-.219-.453-1.328-2.031-2-2.812a8.927 8.927 0 01-6.969 3.313c-4.937 0-8.953-4-8.953-8.953 0-1.969.641-3.781 1.719-5.266C1.625 9.329.938 7.861 0 6.767h5.703C8.766 4.72 13.219 3.439 18 3.439s8.953 1.281 12.016 3.328z"})),imdb:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"28",viewBox:"0 0 24 28"},Object(n.createElement)("path",{d:"M14.406 12.453v2.844c0 .562.109 1.078-.594 1.062v-4.828c.688 0 .594.359.594.922zm4.938 1.5v1.891c0 .313.094.828-.359.828a.236.236 0 01-.219-.141c-.125-.297-.063-2.547-.063-2.578 0-.219-.063-.734.281-.734.422 0 .359.422.359.734zM2.812 17.641h1.906v-7.375H2.812v7.375zm6.782 0h1.656v-7.375H8.766l-.438 3.453a123.605 123.605 0 00-.5-3.453H5.359v7.375h1.672v-4.875l.703 4.875h1.188l.672-4.984v4.984zm6.64-4.766c0-.469.016-.969-.078-1.406-.25-1.297-1.813-1.203-2.828-1.203h-1.422v7.375c4.969 0 4.328.344 4.328-4.766zm4.953 3.078v-2.078c0-1-.047-1.734-1.281-1.734-.516 0-.859.156-1.203.531v-2.406h-1.828v7.375h1.719l.109-.469c.328.391.688.562 1.203.562 1.141 0 1.281-.875 1.281-1.781zM24 4.5v19c0 1.375-1.125 2.5-2.5 2.5h-19A2.507 2.507 0 010 23.5v-19C0 3.125 1.125 2 2.5 2h19C22.875 2 24 3.125 24 4.5z"})),telegram:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 32 32"},Object(n.createElement)("path",{d:"M26.07 3.996a2.987 2.987 0 00-.952.23l.019-.007h-.004c-.285.113-1.64.683-3.7 1.547l-7.382 3.109c-5.297 2.23-10.504 4.426-10.504 4.426l.062-.024s-.359.118-.734.375c-.234.15-.429.339-.582.56l-.004.007c-.184.27-.332.683-.277 1.11.09.722.558 1.155.894 1.394.34.242.664.355.664.355h.008l4.883 1.645c.219.703 1.488 4.875 1.793 5.836.18.574.355.933.574 1.207.106.14.23.257.379.351.071.042.152.078.238.104l.008.002-.05-.012c.015.004.027.016.038.02.04.011.067.015.118.023.773.234 1.394-.246 1.394-.246l.035-.028 2.883-2.625 4.832 3.707.11.047c1.007.442 2.027.196 2.566-.238.543-.437.754-.996.754-.996l.035-.09 3.734-19.129c.106-.472.133-.914.016-1.343a1.818 1.818 0 00-.774-1.043l-.007-.004a1.852 1.852 0 00-1.071-.269h.005zm-.101 2.05c-.004.063.008.056-.02.177v.011l-3.699 18.93c-.016.027-.043.086-.117.145-.078.062-.14.101-.465-.028l-5.91-4.531-3.57 3.254.75-4.79 9.656-9c.398-.37.265-.448.265-.448.028-.454-.601-.133-.601-.133l-12.176 7.543-.004-.02-5.851-1.972a.237.237 0 00.032-.013l-.002.001.032-.016.031-.011s5.211-2.196 10.508-4.426c2.652-1.117 5.324-2.242 7.379-3.11a807.312 807.312 0 013.66-1.53c.082-.032.043-.032.102-.032z"})),telegramAlt:Object(n.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"28",height:"28",viewBox:"0 0 28 28"},Object(n.createElement)("path",{d:"M18.578 20.422l2.297-10.828c.203-.953-.344-1.328-.969-1.094l-13.5 5.203c-.922.359-.906.875-.156 1.109l3.453 1.078 8.016-5.047c.375-.25.719-.109.438.141l-6.484 5.859-.25 3.563c.359 0 .516-.156.703-.344l1.687-1.625 3.5 2.578c.641.359 1.094.172 1.266-.594zM28 14c0 7.734-6.266 14-14 14S0 21.734 0 14 6.266 0 14 0s14 6.266 14 14z"}))});function eo(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var to=wp.i18n.__,ro=(wp.blockEditor.MediaUpload,wp.components),no=(ro.ButtonGroup,ro.Dashicon),ao=ro.Tooltip,oo=ro.TextControl,io=ro.Button,so=(ro.TabPanel,ro.RangeControl,ro.Placeholder,wp.element),co=so.Component,lo=(so.Fragment,function(e){l()(r,e);var t=eo(r);function r(){var e;return o()(this,r),(e=t.apply(this,arguments)).state={open:!1},e}return s()(r,[{key:"render",value:function(){var e=this;return Object(n.createElement)("div",{className:"ahfb-sorter-item","data-id":this.props.item.id,key:this.props.item.id},Object(n.createElement)("div",{className:"ahfb-sorter-item-panel-header",onClick:function(){e.setState({open:!e.state.open})}},Object(n.createElement)(ao,{text:to("Toggle Item Visiblity","astra-builder")},Object(n.createElement)(io,{className:"ahfb-sorter-visiblity"},$a[this.props.item.id])),Object(n.createElement)("span",{className:"ahfb-sorter-title"},void 0!==this.props.item.label&&""!==this.props.item.label?this.props.item.label:to("Social Item","astra-builder")),Object(n.createElement)(io,{className:"ahfb-sorter-item-expand ".concat(this.props.item.enabled?"item-is-visible":"item-is-hidden"),onClick:function(t){t.stopPropagation(),e.props.toggleEnabled(!e.props.item.enabled,e.props.index)}},Object(n.createElement)(no,{icon:"visibility"})),Object(n.createElement)(io,{className:"ahfb-sorter-item-remove",isDestructive:!0,onClick:function(){e.props.removeItem(e.props.index)}},Object(n.createElement)(no,{icon:"no-alt"}))),this.state.open&&Object(n.createElement)("div",{className:"ahfb-sorter-item-panel-content"},Object(n.createElement)(oo,{label:to("Label","astra-builder"),value:this.props.item.label?this.props.item.label:"",onChange:function(t){e.props.onChangeLabel(t,e.props.index)}}),Object(n.createElement)(oo,{label:to("URL","astra-builder"),value:this.props.item.url?this.props.item.url:"",onChange:function(t){e.props.onChangeURL(t,e.props.index)}})))}}]),r}(co));function uo(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ho(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?uo(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):uo(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function po(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var fo=wp.i18n.__,mo=wp.components,vo=mo.ButtonGroup,bo=mo.Dashicon,go=(mo.Tooltip,mo.Popover),yo=mo.Button,wo=mo.SelectControl,Oo=wp.element,Eo=Oo.Component,jo=Oo.Fragment,_o=function(e){l()(r,e);var t=po(r);function r(){var e;o()(this,r),(e=t.apply(this,arguments)).updateValues=e.updateValues.bind(P()(e)),e.onDragEnd=e.onDragEnd.bind(P()(e)),e.onDragStart=e.onDragStart.bind(P()(e)),e.onDragStop=e.onDragStop.bind(P()(e)),e.removeItem=e.removeItem.bind(P()(e)),e.saveArrayUpdate=e.saveArrayUpdate.bind(P()(e)),e.toggleEnableItem=e.toggleEnableItem.bind(P()(e)),e.onChangeIcon=e.onChangeIcon.bind(P()(e)),e.onChangeLabel=e.onChangeLabel.bind(P()(e)),e.onChangeURL=e.onChangeURL.bind(P()(e)),e.onChangeAttachment=e.onChangeAttachment.bind(P()(e)),e.onChangeWidth=e.onChangeWidth.bind(P()(e)),e.onChangeSource=e.onChangeSource.bind(P()(e)),e.addItem=e.addItem.bind(P()(e));var n=e.props.control.setting.get(),a={items:[{id:"facebook",enabled:!0,source:"icon",url:"",imageid:"",width:24,icon:"facebook",label:"Facebook"},{id:"twitter",enabled:!0,source:"icon",url:"",imageid:"",width:24,icon:"twitter",label:"Twitter"}]};e.defaultValue=e.props.control.params.default?ho(ho({},a),e.props.control.params.default):a,n=n?ho(ho({},e.defaultValue),n):e.defaultValue;var i={group:"social_item_group",options:[{value:"facebook",label:fo("Facebook","astra-builder")},{value:"twitter",label:fo("Twitter","astra-builder")},{value:"instagram",label:fo("Instagram","astra-builder")},{value:"youtube",label:fo("YouTube","astra-builder")},{value:"facebook_group",label:fo("Facebook Group","astra-builder")},{value:"vimeo",label:fo("Vimeo","astra-builder")},{value:"pinterest",label:fo("Pinterest","astra-builder")},{value:"linkedin",label:fo("Linkedin","astra-builder")},{value:"medium",label:fo("Medium","astra-builder")},{value:"wordpress",label:fo("WordPress","astra-builder")},{value:"reddit",label:fo("Reddit","astra-builder")},{value:"patreon",label:fo("Patreon","astra-builder")},{value:"github",label:fo("GitHub","astra-builder")},{value:"dribbble",label:fo("Dribbble","astra-builder")},{value:"behance",label:fo("Behance","astra-builder")},{value:"vk",label:fo("VK","astra-builder")},{value:"xing",label:fo("Xing","astra-builder")},{value:"rss",label:fo("RSS","astra-builder")},{value:"email",label:fo("Email","astra-builder")},{value:"phone",label:fo("Phone","astra-builder")},{value:"whatsapp",label:fo("WhatsApp","astra-builder")},{value:"google_reviews",label:fo("Google Reviews","astra-builder")},{value:"telegram",label:fo("Telegram","astra-builder")},{value:"yelp",label:fo("Yelp","astra-builder")},{value:"trip_advisor",label:fo("Trip Advisor","astra-builder")},{value:"imdb",label:fo("IMDB","astra-builder")}].sort((function(e,t){return e.value<t.value?-1:e.value>t.value?1:0}))};e.controlParams=e.props.control.params.input_attrs?ho(ho({},i),e.props.control.params.input_attrs):i;var s=[];return e.controlParams.options.map((function(e){n.items.some((function(t){return t.id===e.value}))||s.push(e)})),e.state={value:n,isVisible:!1,control:void 0!==s[0]&&void 0!==s[0].value?s[0].value:""},e}return s()(r,[{key:"onDragStart",value:function(){var e,t=document.querySelectorAll(".ahfb-builder-area");for(e=0;e<t.length;++e)t[e].classList.add("ahfb-dragging-dropzones")}},{key:"onDragStop",value:function(){var e,t=document.querySelectorAll(".ahfb-builder-area");for(e=0;e<t.length;++e)t[e].classList.remove("ahfb-dragging-dropzones")}},{key:"saveArrayUpdate",value:function(e,t){var r=this.state.value,n=r.items.map((function(r,n){return t===n&&(r=ho(ho({},r),e)),r}));r.items=n,this.setState({value:r}),this.updateValues(r)}},{key:"toggleEnableItem",value:function(e,t){this.saveArrayUpdate({enabled:e},t)}},{key:"onChangeLabel",value:function(e,t){this.saveArrayUpdate({label:e},t)}},{key:"onChangeIcon",value:function(e,t){this.saveArrayUpdate({icon:e},t)}},{key:"onChangeURL",value:function(e,t){this.saveArrayUpdate({url:e},t)}},{key:"onChangeAttachment",value:function(e,t){this.saveArrayUpdate({imageid:e},t)}},{key:"onChangeWidth",value:function(e,t){this.saveArrayUpdate({width:e},t)}},{key:"onChangeSource",value:function(e,t){this.saveArrayUpdate({source:e},t)}},{key:"removeItem",value:function(e){var t=this.state.value,r=t.items,n=[];r.length>0&&r.map((function(t,r){e!==r&&n.push(t)})),t.items=n,this.setState({value:t}),this.updateValues(t)}},{key:"addItem",value:function(){var e=this.state.control;if(this.setState({isVisible:!1}),e){var t=this.state.value,r=t.items,n=this.controlParams.options.filter((function(t){return t.value===e})),a={id:e,enabled:!0,source:"icon",url:"",imageid:"",width:24,icon:e,label:n[0].label};r.push(a),t.items=r;var o=[];this.controlParams.options.map((function(e){r.some((function(t){return t.id===e.value}))||o.push(e)})),this.setState({control:void 0!==o[0]&&void 0!==o[0].value?o[0].value:""}),this.setState({value:t}),this.updateValues(t)}}},{key:"onDragEnd",value:function(e){var t=this.state.value,r=t.items,n=[];e.length>0&&e.map((function(e){r.filter((function(t){t.id===e.id&&n.push(t)}))})),this.arraysEqual(r,n)||(r.items=n,t.items=n,this.setState({value:t}),this.updateValues(t))}},{key:"arraysEqual",value:function(e,t){if(e===t)return!0;if(null==e||null==t)return!1;if(e.length!=t.length)return!1;for(var r=0;r<e.length;++r)if(e[r]!==t[r])return!1;return!0}},{key:"render",value:function(){var e=this,t=void 0!==this.state.value&&null!=this.state.value.items&&null!=this.state.value.items.length&&this.state.value.items.length>0?this.state.value.items:[],r=[];t.length>0&&t.map((function(e){r.push({id:e.id})}));var a=[];this.controlParams.options.map((function(e){r.some((function(t){return t.id===e.value}))||a.push(e)}));return Object(n.createElement)("div",{className:"ahfb-control-field ahfb-sorter-items"},Object(n.createElement)("div",{className:"ahfb-sorter-row"},Object(n.createElement)(ia,{animation:100,onStart:function(){return e.onDragStop()},onEnd:function(){return e.onDragStop()},group:this.controlParams.group,className:"ahfb-sorter-drop ahfb-sorter-sortable-panel ahfb-sorter-drop-".concat(this.controlParams.group),handle:".ahfb-sorter-item-panel-header",list:r,setList:function(t){return e.onDragEnd(t)}},t.length>0&&t.map((function(t,r){return Object(n.createElement)(lo,{removeItem:function(t){return e.removeItem(t)},toggleEnabled:function(t,r){return e.toggleEnableItem(t,r)},onChangeLabel:function(t,r){return e.onChangeLabel(t,r)},onChangeSource:function(t,r){return e.onChangeSource(t,r)},onChangeWidth:function(t,r){return e.onChangeWidth(t,r)},onChangeURL:function(t,r){return e.onChangeURL(t,r)},onChangeAttachment:function(t,r){return e.onChangeAttachment(t,r)},onChangeIcon:function(t,r){return e.onChangeIcon(t,r)},key:t.id,index:r,item:t,controlParams:e.controlParams})})))),void 0!==a[0]&&void 0!==a[0].value&&Object(n.createElement)("div",{className:"ahfb-social-add-area"},Object(n.createElement)(wo,{value:this.state.control,options:a,onChange:function(t){e.setState({control:t})}}),this.state.isVisible&&Object(n.createElement)(go,{position:"top right",className:"ahfb-popover-color ahfb-popover-social",onClose:function(){!0===e.state.isVisible&&e.setState({isVisible:!1})}},Object(n.createElement)("div",{className:"ahfb-popover-social-list"},Object(n.createElement)(vo,{className:"ahfb-radio-container-control"},a.map((function(t,r){return Object(n.createElement)(jo,null,Object(n.createElement)(yo,{isTertiary:!0,className:"social-radio-btn",onClick:function(){e.setState({control:a[r].value}),e.state.control=a[r].value,e.addItem()}},a[r].label&&a[r].label))}))))),Object(n.createElement)(yo,{className:"ahfb-sorter-add-item",isPrimary:!0,onClick:function(){e.addItem()}},fo("Add Social Icon","astra-builder"),Object(n.createElement)(bo,{icon:"plus"}))))}},{key:"updateValues",value:function(e){this.props.control.setting.set(ho(ho(ho({},this.props.control.setting.get()),e),{},{flag:!this.props.control.setting.get().flag}))}}]),r}(Eo);_o.propTypes={control:m.a.object.isRequired};var Co=_o,ko=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Co,{control:this}),this.container[0])}}),xo=r(44),zo=r.n(xo);function So(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Mo(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?So(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):So(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function No(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}wp.i18n.__;var Ro=function(e){l()(r,e);var t=No(r);function r(e){var n;o()(this,r),(n=t.call(this,e)).updateValues=n.updateValues.bind(P()(n)),n.triggerChangeIfDirty=n.triggerChangeIfDirty.bind(P()(n)),n.onInit=n.onInit.bind(P()(n));var a=e.control.setting.get();n.state={value:a,editor:{},restoreTextMode:!1};var i={id:"header_html",toolbar1:"bold,italic,bullist,numlist,blockquote,link",toolbar2:""};return n.controlParams=n.props.control.params.input_attrs?Mo(Mo({},i),n.props.control.params.input_attrs):i,n.defaultValue=e.control.params.default||"",n}return s()(r,[{key:"componentDidMount",value:function(){window.tinymce.get(this.controlParams.id)&&(this.setState({restoreTextMode:window.tinymce.get(this.controlParams.id).isHidden()}),window.wp.oldEditor.remove(this.controlParams.id)),window.wp.oldEditor.initialize(this.controlParams.id,{tinymce:{wpautop:!0,toolbar1:this.controlParams.toolbar1,toolbar2:this.controlParams.toolbar2},quicktags:!0,mediaButtons:!0});var e=window.tinymce.get(this.controlParams.id);e.initialized?this.onInit():e.on("init",this.onInit),e.addButton("ast_placeholders",{type:"menubutton",text:"Tags",icon:!1,menu:[{text:"Copyright",icon:!1,value:"[copyright]",onclick:function(){e.insertContent(this.value())}},{text:"Current Year",icon:!1,value:"[current_year]",onclick:function(){e.insertContent(this.value())}},{text:"Site Title",icon:!1,value:"[site_title]",onclick:function(){e.insertContent(this.value())}},{text:"Theme Author",icon:!1,value:"[theme_author]",onclick:function(){e.insertContent(this.value())}}]})}},{key:"onInit",value:function(){var e=window.tinymce.get(this.controlParams.id);this.state.restoreTextMode&&window.switchEditors.go(this.controlParams.id,"html"),e.on("NodeChange",zo()(this.triggerChangeIfDirty,250)),this.setState({editor:e})}},{key:"triggerChangeIfDirty",value:function(){this.updateValues(window.wp.oldEditor.getContent(this.controlParams.id))}},{key:"render",value:function(){var e=this;return Object(n.createElement)("div",{className:"ahfb-control-field ast-html-editor"},this.props.control.params.label&&Object(n.createElement)("span",{className:"customize-control-title"},this.props.control.params.label),Object(n.createElement)("textarea",{className:"ahfb-control-tinymce-editor wp-editor-area",id:this.controlParams.id,value:this.state.value,onChange:function(t){var r=t.target.value;e.updateValues(r)}}),this.props.control.params.description&&Object(n.createElement)("span",{className:"customize-control-description"},this.props.control.params.description))}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(wp.element.Component);Ro.propTypes={control:m.a.object.isRequired,customizer:m.a.func.isRequired};var Do=Ro,Po=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Do,{control:this,customizer:wp.customize}),this.container[0])}});function Ho(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Ao(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Ho(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ho(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function To(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var Vo=wp.i18n.__,Lo=wp.components,Bo=Lo.ButtonGroup,Io=Lo.Dashicon,qo=Lo.Tooltip,Uo=Lo.Button,Fo=wp.element,Qo=Fo.Component,Yo=Fo.Fragment,Go=function(e){l()(r,e);var t=To(r);function r(){var e;o()(this,r),(e=t.apply(this,arguments)).updateValues=e.updateValues.bind(P()(e));var n=e.props.control.setting.get(),a={layout:{standard:{tooltip:Vo("Background Fullwidth, Content Contained","astra-builder"),name:Vo("Standard","astra-builder"),icon:""},fullwidth:{tooltip:Vo("Background & Content Fullwidth","astra-builder"),name:Vo("Fullwidth","astra-builder"),icon:""},contained:{tooltip:Vo("Background & Content Contained","astra-builder"),name:Vo("Contained","astra-builder"),icon:""}},responsive:!0};e.controlParams=e.props.control.params.input_attrs?Ao(Ao({},a),e.props.control.params.input_attrs):a;var i,s={mobile:"",tablet:"",desktop:"standard"},c="standard";return e.controlParams.responsive?(i=s,e.defaultValue=e.props.control.params.default?Ao(Ao({},i),e.props.control.params.default):i):(i=c,e.defaultValue=e.props.control.params.default?e.props.control.params.default:i),n=e.controlParams.responsive?n?Ao(Ao({},JSON.parse(JSON.stringify(e.defaultValue))),n):JSON.parse(JSON.stringify(e.defaultValue)):n||e.defaultValue,e.state={currentDevice:"desktop",value:n},e}return s()(r,[{key:"render",value:function(){var e=this,t=Object(n.createElement)(Yo,null,"desktop"!==this.state.currentDevice&&Object(n.createElement)(qo,{text:Vo("Reset Device Values","astra-builder")},Object(n.createElement)(Uo,{className:"reset ahfb-reset",disabled:this.state.value[this.state.currentDevice]===this.defaultValue[this.state.currentDevice],onClick:function(){var t=e.state.value;t[e.state.currentDevice]=e.defaultValue[e.state.currentDevice],e.setState(t),e.updateValues(t)}},Object(n.createElement)(Io,{icon:"image-rotate"}))),this.props.control.params.label&&this.props.control.params.label),r=Object(n.createElement)(Yo,null,Object(n.createElement)(qo,{text:Vo("Reset Values","astra-builder")},Object(n.createElement)(Uo,{className:"reset ahfb-reset",disabled:this.state.value===this.defaultValue,onClick:function(){var t=e.defaultValue;e.setState({value:e.defaultValue}),e.updateValues(t)}},Object(n.createElement)(Io,{icon:"image-rotate"}))),this.props.control.params.label&&this.props.control.params.label);return Object(n.createElement)("div",{className:"ahfb-control-field ahfb-icon-set-control".concat(this.controlParams.class?" "+this.controlParams.class:"")},this.controlParams.responsive&&Object(n.createElement)(Ja,{onChange:function(t){return e.setState({currentDevice:t})},controlLabel:t},Object(n.createElement)(Bo,{className:"ahfb-radio-container-control"},Object.keys(this.controlParams.layout).map((function(t){return Object(n.createElement)(Yo,null,e.controlParams.layout[t].tooltip&&Object(n.createElement)(qo,{text:e.controlParams.layout[t].tooltip},Object(n.createElement)(Uo,{isTertiary:!0,className:(t===e.state.value[e.state.currentDevice]?"active-radio ":"")+"kt-ratio-"+t+(e.controlParams.layout[t].icon&&e.controlParams.layout[t].name?" btn-flex-col":""),onClick:function(){var r=e.state.value;r[e.state.currentDevice]=t,e.setState(r),e.updateValues(r)}},e.controlParams.layout[t].icon&&Object(n.createElement)("span",{className:"ahfb-icon-set"},Ka[e.controlParams.layout[t].icon]),e.controlParams.layout[t].dashicon&&Object(n.createElement)("span",{className:"ahfb-icon-set ahfb-set-dashicon"},Object(n.createElement)(Io,{icon:e.controlParams.layout[t].dashicon})),e.controlParams.layout[t].name&&e.controlParams.layout[t].name)),!e.controlParams.layout[t].tooltip&&Object(n.createElement)(Uo,{isTertiary:!0,className:(t===e.state.value[e.state.currentDevice]?"active-radio ":"")+"ast-radio-img-svg ast-radio-"+t+(e.controlParams.layout[t].icon&&e.controlParams.layout[t].name?" btn-flex-col":""),onClick:function(){var r=e.state.value;r[e.state.currentDevice]=t,e.setState(r),e.updateValues(r)}},e.controlParams.layout[t].icon&&Object(n.createElement)("span",{className:"ahfb-icon-set"},Ka[e.controlParams.layout[t].icon]),e.controlParams.layout[t].dashicon&&Object(n.createElement)("span",{className:"ahfb-icon-set ahfb-set-dashicon"},Object(n.createElement)(Io,{icon:e.controlParams.layout[t].dashicon})),e.controlParams.layout[t].name&&e.controlParams.layout[t].name))})))),!this.controlParams.responsive&&Object(n.createElement)(Yo,null,Object(n.createElement)("div",{className:"ahfb-responsive-control-bar"},Object(n.createElement)("span",{className:"customize-control-title"},r)),Object(n.createElement)(Bo,{className:"ahfb-radio-container-control"},Object.keys(this.controlParams.layout).map((function(t){return Object(n.createElement)(Yo,null,e.controlParams.layout[t].tooltip&&Object(n.createElement)(qo,{text:e.controlParams.layout[t].tooltip},Object(n.createElement)(Uo,{isTertiary:!0,className:(t===e.state.value?"active-radio ":"")+"ast-radio-img-svg ast-radio-"+t+(e.controlParams.layout[t].icon&&e.controlParams.layout[t].name?" btn-flex-col":""),onClick:function(){var r=e.state.value;r=t,e.setState({value:t}),e.updateValues(r)}},e.controlParams.layout[t].icon&&Object(n.createElement)("span",{className:"ahfb-icon-set"},Ka[e.controlParams.layout[t].icon]),e.controlParams.layout[t].name&&e.controlParams.layout[t].name)),!e.controlParams.layout[t].tooltip&&Object(n.createElement)(Uo,{isTertiary:!0,className:(t===e.state.value?"active-radio ":"")+"ast-radio-img-svg ast-radio-"+t+(e.controlParams.layout[t].icon&&e.controlParams.layout[t].name?" btn-flex-col":""),onClick:function(){var r=e.state.value;r=t,e.setState({value:t}),e.updateValues(r)}},e.controlParams.layout[t].icon&&Object(n.createElement)("span",{className:"ahfb-icon-set"},Ka[e.controlParams.layout[t].icon]),e.controlParams.layout[t].name&&e.controlParams.layout[t].name))})))))}},{key:"updateValues",value:function(e){this.controlParams.responsive?this.props.control.setting.set(Ao(Ao(Ao({},this.props.control.setting.get()),e),{},{flag:!this.props.control.setting.get().flag})):this.props.control.setting.set(e)}}]),r}(Qo);Go.propTypes={control:m.a.object.isRequired};var Wo=Go,Xo=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Wo,{control:this}),this.container[0])}});function Jo(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Zo(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Jo(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Jo(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Ko(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}wp.i18n.__;var $o=wp.components,ei=($o.ButtonGroup,$o.Dashicon),ti=($o.Tooltip,$o.Button),ri=wp.element,ni=ri.Component,ai=ri.Fragment,oi=function(e){l()(r,e);var t=Ko(r);function r(){var e;o()(this,r),(e=t.apply(this,arguments)).linkRemovingItem=e.linkRemovingItem.bind(P()(e)),e.onDragEnd=e.onDragEnd.bind(P()(e)),e.onDragStart=e.onDragStart.bind(P()(e)),e.onUpdate=e.onUpdate.bind(P()(e)),e.onDragStop=e.onDragStop.bind(P()(e)),e.focusPanel=e.focusPanel.bind(P()(e));var n={},a={};return e.controlParams=e.props.control.params.input_attrs?Zo(Zo({},a),e.props.control.params.input_attrs):a,void 0!==e.props.customizer.control(e.controlParams.group)&&(n=e.props.customizer.control(e.controlParams.group).setting.get()),e.choices=AstraBuilderCustomizerData&&AstraBuilderCustomizerData.choices&&AstraBuilderCustomizerData.choices[e.controlParams.group]?AstraBuilderCustomizerData.choices[e.controlParams.group]:[],e.state={settings:n},e.linkRemovingItem(),e}return s()(r,[{key:"onUpdate",value:function(){if(void 0!==this.props.customizer.control(this.controlParams.group)){var e=this.props.customizer.control(this.controlParams.group).setting.get();this.setState({settings:e})}}},{key:"onDragStart",value:function(){var e,t=document.querySelectorAll(".ahfb-builder-area");for(e=0;e<t.length;++e)t[e].classList.add("ahfb-dragging-dropzones")}},{key:"onDragStop",value:function(){var e,t=document.querySelectorAll(".ahfb-builder-area");for(e=0;e<t.length;++e)t[e].classList.remove("ahfb-dragging-dropzones")}},{key:"focusPanel",value:function(e){void 0!==this.props.customizer.section(this.choices[e].section)&&this.props.customizer.section(this.choices[e].section).focus()}},{key:"onDragEnd",value:function(e){null!=e.length&&0===e.length&&this.onUpdate()}},{key:"render",value:function(){var e=this;return Object(n.createElement)("div",{className:"ahfb-control-field ahfb-available-items"},Object(n.createElement)("div",{className:"ahfb-available-items-pool-"},Object.keys(this.choices).map((function(t){return function(t,r){var a=!0;e.controlParams.zones.map((function(r){Object.keys(e.state.settings[r]).map((function(n){e.state.settings[r][n].includes(t)&&(a=!1)}))}));var o=[{id:t}];return Object(n.createElement)(ai,{key:t},a&&"available"===r&&Object(n.createElement)(ia,{animation:10,onStart:function(){return e.onDragStart()},onEnd:function(){return e.onDragStop()},group:{name:e.controlParams.group,put:!1},className:"ahfb-builder-item-start ahfb-move-item",list:o,setList:function(t){return e.onDragEnd(t)}},Object(n.createElement)("div",{className:"ahfb-builder-item","data-id":t,"data-section":void 0!==e.choices[t]&&void 0!==e.choices[t].section?e.choices[t].section:"",key:t},Object(n.createElement)("span",{className:"ahfb-builder-item-icon ahfb-move-icon"},Ka.drag),void 0!==e.choices[t]&&void 0!==e.choices[t].name?e.choices[t].name:"")),!a&&"links"===r&&Object(n.createElement)("div",{className:"ahfb-builder-item-start"},Object(n.createElement)(ti,{className:"ahfb-builder-item","data-id":t,onClick:function(){return e.focusPanel(t)},"data-section":void 0!==e.choices[t]&&void 0!==e.choices[t].section?e.choices[t].section:"",key:t},void 0!==e.choices[t]&&void 0!==e.choices[t].name?e.choices[t].name:"",Object(n.createElement)("span",{className:"ahfb-builder-item-icon"},Object(n.createElement)(ei,{icon:"arrow-right-alt2"})))))}(t,"links")}))))}},{key:"linkRemovingItem",value:function(){var e=this;document.addEventListener("AstraBuilderRemovedBuilderItem",(function(t){t.detail===e.controlParams.group&&e.onUpdate()}))}}]),r}(ni);oi.propTypes={control:m.a.object.isRequired,customizer:m.a.func.isRequired};var ii=oi,si=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(ii,{control:this,customizer:wp.customize}),this.container[0])}});function ci(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}wp.i18n.__;var li=wp.element.Component,ui=wp.components.ToggleControl,hi=function(e){l()(r,e);var t=ci(r);function r(e){var n;o()(this,r),n=t.call(this,e);var a=e.control.setting.get();return n.state={value:a},n.defaultValue=e.control.params.default||"",n.updateValues=n.updateValues.bind(P()(n)),n}return s()(r,[{key:"render",value:function(){var e=this;return Object(n.createElement)("div",{className:"ahfb-control-field ahfb-switch-control"},Object(n.createElement)(ui,{label:this.props.control.params.label?this.props.control.params.label:void 0,checked:this.state.value,onChange:function(t){e.updateValues(t)}}))}},{key:"updateValues",value:function(e){this.setState({value:e}),this.props.control.setting.set(e)}}]),r}(li);hi.propTypes={control:m.a.object.isRequired};var pi=hi,di=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(pi,{control:this}),this.container[0])}});function fi(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function mi(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?fi(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):fi(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function vi(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}wp.i18n.__;var bi=wp.components,gi=(bi.ButtonGroup,bi.Dashicon),yi=(bi.Tooltip,bi.Button),wi=wp.element,Oi=wi.Component,Ei=(wi.Fragment,function(e){l()(r,e);var t=vi(r);function r(){var e;o()(this,r),(e=t.apply(this,arguments)).focusPanel=e.focusPanel.bind(P()(e));var n={section:""};return e.controlParams=e.props.control.params.input_attrs?mi(mi({},n),e.props.control.params.input_attrs):n,e}return s()(r,[{key:"focusPanel",value:function(e){void 0!==this.props.customizer.section(e)&&this.props.customizer.section(e).focus()}},{key:"render",value:function(){var e=this;return Object(n.createElement)("div",{className:"ahfb-control-field ahfb-available-items"},Object(n.createElement)("div",{className:"ahfb-builder-item-start"},Object(n.createElement)(yi,{className:"ahfb-builder-item",onClick:function(){return e.focusPanel(e.controlParams.section)},"data-section":this.controlParams.section},this.controlParams.label?this.controlParams.label:"",Object(n.createElement)("span",{className:"ahfb-builder-item-icon"},Object(n.createElement)(gi,{icon:"arrow-right-alt2"})))))}}]),r}(Oi));Ei.propTypes={control:m.a.object.isRequired,customizer:m.a.func.isRequired};var ji=Ei,_i=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(ji,{control:this,customizer:wp.customize}),this.container[0])}});function Ci(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ki(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Ci(Object(r),!0).forEach((function(t){R()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ci(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function xi(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d()(e);if(t){var a=d()(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return h()(this,r)}}var zi=wp.i18n.__,Si=wp.components,Mi=Si.ButtonGroup,Ni=Si.Dashicon,Ri=Si.Tooltip,Di=Si.Button,Pi=wp.element,Hi=Pi.Component,Ai=Pi.Fragment,Ti=function(e){l()(r,e);var t=xi(r);function r(){var e;o()(this,r),(e=t.apply(this,arguments)).updateValues=e.updateValues.bind(P()(e)),e.onFooterUpdate=e.onFooterUpdate.bind(P()(e)),e.onColumnUpdate();var n=e.props.control.setting.get(),a={desktop:{5:{"5-equal":{icon:"fivecol"}},4:{"4-equal":{icon:"fourcol"},"4-lheavy":{icon:"lfourforty"},"4-rheavy":{icon:"rfourforty"}},3:{"3-equal":{icon:"threecol"},"3-lheavy":{icon:"lefthalf"},"3-rheavy":{icon:"righthalf"},"3-cheavy":{icon:"centerhalf"},"3-cwide":{icon:"widecenter"}},2:{"2-equal":{icon:"twocol"},"2-lheavy":{icon:"twoleftgolden"},"2-rheavy":{icon:"tworightgolden"}},1:{full:{icon:"row"}}},tablet:{5:{"5-equal":{tooltip:zi("Equal Width Columns","astra-builder"),icon:"fivecol"},full:{tooltip:zi("Collapse to Rows","astra-builder"),icon:"collapserowfive"}},4:{"4-equal":{tooltip:zi("Equal Width Columns","astra-builder"),icon:"fourcol"},"2-equal":{tooltip:zi("Two Column Grid","astra-builder"),icon:"grid"},full:{tooltip:zi("Collapse to Rows","astra-builder"),icon:"collapserowfour"}},3:{"3-equal":{tooltip:zi("Equal Width Columns","astra-builder"),icon:"threecol"},"3-lheavy":{tooltip:zi("Left Heavy 50/25/25","astra-builder"),icon:"lefthalf"},"3-rheavy":{tooltip:zi("Right Heavy 25/25/50","astra-builder"),icon:"righthalf"},"3-cheavy":{tooltip:zi("Center Heavy 25/50/25","astra-builder"),icon:"centerhalf"},"3-cwide":{tooltip:zi("Wide Center 20/60/20","astra-builder"),icon:"widecenter"},"3-firstrow":{tooltip:zi("First Row, Next Columns 100 - 50/50","astra-builder"),icon:"firstrow"},"3-lastrow":{tooltip:zi("Last Row, Previous Columns 50/50 - 100","astra-builder"),icon:"lastrow"},full:{tooltip:zi("Collapse to Rows","astra-builder"),icon:"collapserowthree"}},2:{"2-equal":{tooltip:zi("Equal Width Columns","astra-builder"),icon:"twocol"},"2-lheavy":{tooltip:zi("Left Heavy 66/33","astra-builder"),icon:"twoleftgolden"},"2-rheavy":{tooltip:zi("Right Heavy 33/66","astra-builder"),icon:"tworightgolden"},full:{tooltip:zi("Collapse to Rows","astra-builder"),icon:"collapserow"}},1:{full:{tooltip:zi("Single Row","astra-builder"),icon:"row"}}},mobile:{5:{"5-equal":{icon:"fivecol"},full:{icon:"collapserowfive"}},4:{"4-equal":{icon:"fourcol"},"2-equal":{icon:"grid"},full:{icon:"collapserowfour"}},3:{"3-equal":{icon:"threecol"},"3-lheavy":{icon:"lefthalf"},"3-rheavy":{icon:"righthalf"},"3-cheavy":{icon:"centerhalf"},"3-cwide":{icon:"widecenter"},"3-firstrow":{icon:"firstrow"},"3-lastrow":{icon:"lastrow"},full:{icon:"collapserowthree"}},2:{"2-equal":{icon:"twocol"},"2-lheavy":{icon:"twoleftgolden"},"2-rheavy":{icon:"tworightgolden"},full:{icon:"collapserow"}},1:{full:{icon:"row"}}},responsive:!0};e.controlParams=e.props.control.params.input_attrs?ki(ki({},a),e.props.control.params.input_attrs):a;var i,s={mobile:"row",tablet:"",desktop:"equal"},c="equal",l=e.props.control.id.replace("astra-settings[","").replace("-footer-layout]","");e.type=l,e.footer_type="hb"===e.type?"primary":"hba"===e.type?"above":"below",e.controlParams.responsive?(i=s,e.defaultValue=e.props.control.params.default?ki(ki({},i),e.props.control.params.default):i):(i=c,e.defaultValue=e.props.control.params.default?e.props.control.params.default:i),n=e.controlParams.responsive?n?ki(ki({},JSON.parse(JSON.stringify(e.defaultValue))),n):JSON.parse(JSON.stringify(e.defaultValue)):n||e.defaultValue;var u=0;return u=parseInt(e.props.customizer.control("astra-settings["+e.type+"-footer-column]").setting.get(),10),e.state={currentDevice:"desktop",columns:u,value:n,is_updated:!1},e}return s()(r,[{key:"render",value:function(){var e=this,t=Object(n.createElement)(Ai,null,"desktop"!==this.state.currentDevice&&Object(n.createElement)(Ri,{text:zi("Reset Device Values","astra-builder")},Object(n.createElement)(Di,{className:"reset ahfb-reset",disabled:this.state.value[this.state.currentDevice]===this.defaultValue[this.state.currentDevice],onClick:function(){var t=e.state.value;t[e.state.currentDevice]=e.defaultValue[e.state.currentDevice],e.setState({value:t}),e.updateValues()}},Object(n.createElement)(Ni,{icon:"image-rotate"}))),this.props.control.params.label&&this.props.control.params.label),r=(Object(n.createElement)(Ai,null,Object(n.createElement)(Ri,{text:zi("Reset Values","astra-builder")},Object(n.createElement)(Di,{className:"reset ahfb-reset",disabled:this.state.value===this.defaultValue,onClick:function(){e.defaultValue;e.setState({value:e.defaultValue}),e.updateValues()}},Object(n.createElement)(Ni,{icon:"image-rotate"}))),this.props.control.params.label&&this.props.control.params.label),{});return r="desktop"!==this.state.currentDevice?this.controlParams.mobile[this.state.columns]:this.controlParams.desktop[this.state.columns],Object(n.createElement)("div",{className:"ahfb-control-field ahfb-radio-icon-control ahfb-row-layout-control"},this.controlParams.responsive&&Object(n.createElement)(Ja,{onChange:function(t){return e.setState({currentDevice:t})},controlLabel:t},Object(n.createElement)(Mi,{className:"ahfb-radio-container-control"},Object.keys(r).map((function(t,a){return Object(n.createElement)(Di,{key:a,isTertiary:!0,className:(t===e.state.value[e.state.currentDevice]?"active-radio ":"")+"ast-radio-img-svg ahfb-btn-item-"+a,onClick:function(){var r=e.state.value;r[e.state.currentDevice]=t,e.setState({value:r}),e.updateValues()}},r[t].icon&&Object(n.createElement)("span",{className:"ahfb-radio-icon"},Ka[r[t].icon]),r[t].dashicon&&Object(n.createElement)("span",{className:"ahfb-radio-icon ahfb-radio-dashicon"},Object(n.createElement)(Ni,{icon:r[t].dashicon})),r[t].name&&r[t].name)})))))}},{key:"onFooterUpdate",value:function(){var e=parseInt(this.props.customizer.control("astra-settings["+this.type+"-footer-column]").setting.get(),10),t=this.state.value;if(this.state.columns!==e){this.setState({columns:e});var r={1:"full",2:"2-equal",3:"3-equal",4:"4-equal",5:"5-equal"};t.desktop=r[e],t.tablet=r[e],t.mobile="full",this.setState({value:t}),this.updateValues()}}},{key:"onColumnUpdate",value:function(){var e=this;document.addEventListener("AstraBuilderChangeRowLayout",(function(t){t.detail.columns&&e.onFooterUpdate()}))}},{key:"updateValues",value:function(){var e=new CustomEvent("AstraBuilderChangeRowLayout",{detail:{columns:wp.customize.value("astra-settings["+this.type+"-footer-column]").get(),layout:this.state.value,type:this.footer_type}}),t=this.state.value;document.dispatchEvent(e),this.props.control.setting.set(ki(ki(ki({},this.props.control.setting.get()),t),{},{flag:!this.props.control.setting.get().flag}))}}]),r}(Hi);Ti.propTypes={control:m.a.object.isRequired};var Vi=Ti,Li=wp.customize.astraControl.extend({renderContent:function(){ReactDOM.render(Object(n.createElement)(Vi,{control:this,customizer:wp.customize}),this.container[0])},ready:function(){var e=jQuery(".wp-full-overlay-footer .devices button.active").attr("data-device");jQuery(".customize-control-ast-row-layout .ahfb-responsive-control-bar .components-button."+e).trigger("click"),jQuery(".wp-full-overlay-footer .devices button").on("click",(function(){var e=jQuery(this).attr("data-device");jQuery(".customize-control-ast-row-layout .ahfb-responsive-control-bar .components-button."+e).trigger("click")}))}});!function(e,t){var r=e(window),n=e("body"),a=function(){var r=e(".control-section.ahfb-header-builder-active"),a=e(".control-section.ahfb-footer-builder-active");n.hasClass("ahfb-header-builder-is-active")||n.hasClass("ahfb-footer-builder-is-active")?n.hasClass("ahfb-footer-builder-is-active")&&0<a.length&&!a.hasClass("ahfb-builder-hide")?t.previewer.container.css("bottom",a.outerHeight()+"px"):n.hasClass("ahfb-header-builder-is-active")&&0<r.length&&!r.hasClass("ahfb-builder-hide")?t.previewer.container.css({bottom:r.outerHeight()+"px"}):t.previewer.container.css("bottom",""):t.previewer.container.css("bottom","")},o=function(e){var r=e.id.includes("-header-")?"header":"footer",o=t.section("section-"+r+"-builder");if(o){i.registerControlsBySection(o);var c=o.contentContainer,l=t.section("section-"+r+"-builder-layout");i.registerControlsBySection(l),e.expanded.bind((function(e){_.each(o.controls(),(function(e){s(e.id),"resolved"!==e.deferred.embedded.state()&&(e.renderContent(),e.deferred.embedded.resolve(),e.container.trigger("init"))})),_.each(l.controls(),(function(e){s(e.id),"resolved"!==e.deferred.embedded.state()&&(e.renderContent(),e.deferred.embedded.resolve(),e.container.trigger("init"))})),e?(n.addClass("ahfb-"+r+"-builder-is-active"),c.addClass("ahfb-"+r+"-builder-active")):(n.removeClass("ahfb-"+r+"-builder-is-active"),c.removeClass("ahfb-"+r+"-builder-active")),a()})),c.on("click",".ahfb-builder-tab-toggle",(function(e){e.preventDefault(),c.toggleClass("ahfb-builder-hide"),a()}))}},i={addPanel:function(e,r){if(!t.panel(e)){var n,a=t.panelConstructor[r.type]||t.Panel;n=_.extend({params:r},r),t.panel.add(new a(e,n))}},addSection:function(e,r){if(t.section(e)){if(!e.startsWith("sidebar-widgets-"))return;t.section.remove(e)}var n,a=t.sectionConstructor[r.type]||t.Section;n=_.extend({params:r},r),t.section.add(new a(e,n))},addSubControl:function(e){var t=AstraBuilderCustomizerData.js_configs.sub_controls[e];if(t)for(var r=0;r<t.length;r++){var n=t[r];i.addControl(n.id,n)}},addControl:function(e,r){if(!t.control(e)){var n,a=t.controlConstructor[r.type]||t.Control;n=_.extend({params:r},r),t.control.add(new a(e,n)),this.addControlContext(r.section,e),"ast-settings-group"===r.type&&this.addSubControl(e)}},addControlContext:function(t,r){!function(t){var r=e(".ahfb-builder-drop .ahfb-builder-item");e.each(r,(function(r,n){e(n).attr("data-section")===t&&e(n).addClass("active-builder-item")}))}(t),s(r)},AddDummyControl:function(e){var r={section:e},n=t.controlConstructor["ast-dummy"],a=_.extend({params:r},r);t.control.add(new n(e+"-ast-dummy",a))},registerControlsBySection:function(e){var t=AstraBuilderCustomizerData.js_configs.controls[e.id];if(t)for(var r=0;r<t.length;r++){var n=t[r];this.addControl(n.id,n)}}};function s(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=r||AstraBuilderCustomizerData.contexts[e];if(n){var a=function(e){switch(e){case"ast_selected_device":return t.previewedDevice;case"ast_selected_tab":return t.state("astra-customizer-tab");default:return t(e)}},o=function(e){var t=function(){var e=!1,t=n.relation;return"OR"!==t&&(t="AND",e=!0),_.each(n,(function(r,n){var o=!1,i=a(r.setting);if(void 0!==i){var s=r.operator,c=r.value,l=i.get();switch(null!=s&&"="!=s||(s="=="),s){case"in":o=0<=c.indexOf(l);break;default:o=c==l}}switch(t){case"OR":e=e||o;break;default:e=e&&o}})),e},r=function(){e.active.set(t())};_.each(n,(function(e,t){var n=a(e.setting);void 0!==n&&n.bind(r)})),e.active.validate=t,r()};t.control(e,o)}}t.bind("ready",(function(){wp.customize.controlConstructor["ast-dummy"]=wp.customize.astraControl.extend({renderContent:function(){}}),setTimeout((function(){if(AstraBuilderCustomizerData&&AstraBuilderCustomizerData.js_configs){var e=AstraBuilderCustomizerData.js_configs.panels,r=AstraBuilderCustomizerData.js_configs.sections;setTimeout((function(){for(var t=0;t<e.length;t++){var r=e[t];i.addPanel(r.id,r)}}),1),setTimeout((function(){for(var e=0;e<r.length;e++){var n=r[e];i.addSection(n.id,n),i.registerControlsBySection(t.section(n.id))}}),2),setTimeout((function(){t.panel("panel-header-builder-group",o),t.panel("panel-footer-builder-group",o)}),3)}}),1),t.previewer.bind("ready",(function(r){if(AstraBuilderCustomizerData&&AstraBuilderCustomizerData.contexts){var n=AstraBuilderCustomizerData.contexts.wp_defaults;setTimeout((function(){for(var e=0,t=Object.entries(n);e<t.length;e++){var r=ft()(t[e],2);s(r[0],r[1])}}),1)}t.section.each((function(t){t.expanded.bind((function(){e(".ahfb-builder-drop .ahfb-builder-item").removeClass("active-builder-item")}))}))})),t.state.create("astra-customizer-tab"),t.state("astra-customizer-tab").set("general"),e("#customize-theme-controls").on("click",".ahfb-build-tabs-button:not(.ahfb-nav-tabs-button)",(function(r){r.preventDefault(),t.previewedDevice.set(e(this).attr("data-device"))})),e("#customize-theme-controls").on("click",".ahfb-compontent-tabs-button:not(.ahfb-nav-tabs-button)",(function(r){r.preventDefault(),t.state("astra-customizer-tab").set(e(this).attr("data-tab"))}));t.state("astra-customizer-tab").bind((function(){var r=t.state("astra-customizer-tab").get();e(".ahfb-compontent-tabs-button:not(.ahfb-nav-tabs-button)").removeClass("nav-tab-active").filter(".ahfb-"+r+"-tab").addClass("nav-tab-active")})),e("#customize-theme-controls").on("click","customize-section-back",(function(e){t.state("astra-customizer-tab").set("general")})),r.on("resize",a),t("astra-settings[hba-footer-column]",(function(e){e.bind((function(e){var r=new CustomEvent("AstraBuilderChangeRowLayout",{detail:{columns:e,layout:t.value("astra-settings[hba-footer-layout]").get(),type:"above"}});document.dispatchEvent(r)}))})),t("astra-settings[hb-footer-column]",(function(e){e.bind((function(e){var r=new CustomEvent("AstraBuilderChangeRowLayout",{detail:{columns:e,layout:t.value("astra-settings[hb-footer-layout]").get(),type:"primary"}});document.dispatchEvent(r)}))})),t("astra-settings[hbb-footer-column]",(function(e){e.bind((function(e){var r=new CustomEvent("AstraBuilderChangeRowLayout",{detail:{columns:e,layout:t.value("astra-settings[hbb-footer-layout]").get(),type:"below"}});document.dispatchEvent(r)}))}))}))}(jQuery,wp.customize),wp.customize.controlConstructor["ast-heading"]=y,wp.customize.controlConstructor["ast-hidden"]=j,wp.customize.controlConstructor["ast-description"]=M,wp.customize.controlConstructor["ast-link"]=q,wp.customize.controlConstructor["ast-divider"]=Y,wp.customize.controlConstructor["ast-settings-group"]=Je,wp.customize.controlConstructor["ast-color"]=Ze,wp.customize.controlConstructor["ast-responsive-color"]=Ke,wp.customize.controlConstructor["ast-responsive-background"]=$e,wp.customize.controlConstructor["ast-background"]=et,wp.customize.controlConstructor["ast-sortable"]=at,wp.customize.controlConstructor["ast-border"]=ot,wp.customize.controlConstructor["ast-customizer-link"]=lt,wp.customize.controlConstructor["ast-responsive"]=ut,wp.customize.controlConstructor["ast-responsive-slider"]=ht,wp.customize.controlConstructor["ast-slider"]=pt,wp.customize.controlConstructor["ast-radio-image"]=gt,wp.customize.controlConstructor["ast-responsive-spacing"]=yt,wp.customize.controlConstructor["ast-select"]=wt,wp.customize.controlConstructor["ast-font-family"]=_t,wp.customize.controlConstructor["ast-font-weight"]=zt,wp.customize.controlConstructor["ast-responsive-select"]=Dt,wp.customize.controlConstructor["ast-builder-header-control"]=Bt,wp.customize.controlConstructor["ast-builder"]=Va,wp.customize.controlConstructor["ast-social-icons"]=ko,wp.customize.controlConstructor["ast-html-editor"]=Po,wp.customize.controlConstructor["ast-icon-set"]=Xo,wp.customize.controlConstructor["ast-draggable-items"]=si,wp.customize.controlConstructor["ast-switch-toggle"]=di,wp.customize.controlConstructor["ast-header-type-button"]=_i,wp.customize.controlConstructor["ast-row-layout"]=Li}]);