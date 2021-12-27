"use strict"

/**
 *
 * Helpers & Utilities
 *
 */

function noop(a, b, c) {
  /* NO OPERATIOn */
  console.log("noop")
}

function isObject(value) {
  let type = typeof value
  return value != null && (type == "object" || type == "function")
}

function isArray(value) {
  return Array.isArray(value)
}

function isNil(value) {
  return value === undefined || value === null
}

const validSelectors = [".", "#", "[", ":"]

function selectoDomElement(selector) {
  if (isObject(selector) && selector.selectedBy) return selector

  let el, prefix
  let element = selector

  if (/* Check if selector is an ACTUAL htmlNODE */ false) {
  } else if (validSelectors.includes(selector.charAt(0))) {
    element = selector.substring(1)
    prefix = selector.charAt(0)
  }

  switch (prefix) {
    // Class name selector
    case ".": {
      el = document.getElementsByClassName(element)
      break
    }
    // ID selector
    case "#": {
      el = document.getElementById(element)
      break
    }
    // Attribute selector
    case "[": {
    }
    // Index / nth selector
    case ":": {
    }

    // Element Selector
    default: {
      el = document.getElementsByTagName(element)
      break
    }
  }

  if (!el) throw Error(`Selected '${selector}' element doesn't exist`)

  if (el.length !== undefined) {
    for (const element of el) {
      element.selectedBy = selector
    }
  } else if (el) {
    el.selectedBy = selector
  }

  return el
}

/**
 *
 * C U R R Y .js
 *
 */

;(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : ((global = global || self), (global.$ = factory()))
})(this, function () {
  "use strict"

  let element

  /**
   *
   * @param {String} selector Selects an existing element in the DOM
   * @returns Instance of curry for function chaining
   *
   * The selector currently accepts this syntax:
   * `.test`  Class selector
   * `#id`    Id selector
   * `h1`     Native HTML elemenets
   */

  const $ = (selector) => {
    if (!selector) throw Error("Selector must contain a string.")

    element = selectoDomElement(selector)

    /**
     * This chained function attaches an event listener to the selected element.
     * Then executes provided callback when event is triggered.
     *
     * @param {String} event        Event name
     * @param {String} which        Optional selector
     * @param {Function} callback   Function to execute when event is triggered
     */

    $.on = (event, callback) => {
      const bindListener = (item) => {
        item.addEventListener(event, (e) => {
          callback({
            event: e,
            e: e,
            self: item,
          })
        })
      }

      // Is HTML collection
      if (element.length !== undefined) {
        for (const item of element) {
          bindListener(item)
        }
      } else {
        bindListener(element)
      }
    }

    /**
     *
     * @returns HTML Node(s) of the selected element
     */

    $.get = () => {
      if (!element || element.length === 0) return undefined
      if (element.length === 1) return element[0]

      return element
    }

    /**
     * Function takes in styles which are then applied to the selected element.
     * Offers 2 different syntaxes
     *
     * css('backgroundColor', 'red')
     * css({
     *  backgroundColor: 'red'
     * })
     *
     * @param {String | Object} property
     * @param {String | undefined} style
     */

    $.css = (property, style) => {
      if (!property) throw Error("No style entered")

      // If property && style are a string, it's a singular style addition
      if (typeof property === "string" && typeof style === "string") {
        element.style[property] = style
      }

      // If property is an object and style is undefined, we assign inline style
      if (isObject(property)) {
        Object.entries(property).map(([key, value]) => {
          element.style[key] = value
        })
      }
    }

    // TODO
    // $.click = (which, callback) => {
    // };

    // $.text = (str) => {
    // };

    // $.addClass = (which, className) => {};
    // $.remClass = (which, className) => {};
    // $.togClass = (which, className, altClassName = null) => {};

    return $
  }

  return $
})
