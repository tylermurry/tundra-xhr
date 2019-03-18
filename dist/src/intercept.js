'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xhrMock = require('xhr-mock');

var _xhrMock2 = _interopRequireDefault(_xhrMock);

var _requestBuilder = require('./requestBuilder');

var _requestBuilder2 = _interopRequireDefault(_requestBuilder);

var _submitRequest = require('./submitRequest');

var _submitRequest2 = _interopRequireDefault(_submitRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable no-underscore-dangle */

var proxyIntercept = function proxyIntercept() {
  var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9091;
  var callback = arguments[1];
  var realXHR = arguments[2];
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', (0, _xhrMock.proxy)(req, res).then(function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(finalResponse) {
                  var builtRequest;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          builtRequest = (0, _requestBuilder2.default)(req, finalResponse);
                          _context.next = 3;
                          return (0, _submitRequest2.default)(builtRequest, port, true, realXHR);

                        case 3:

                          if (callback) callback(builtRequest);

                          return _context.abrupt('return', res);

                        case 5:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, undefined);
                }));

                return function (_x4) {
                  return _ref2.apply(this, arguments);
                };
              }()));

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports.default = function (port, callback) {
  var realXHR = global.XMLHttpRequest;

  _xhrMock2.default.setup();
  _xhrMock2.default.use(proxyIntercept(port, callback, realXHR));
};
//# sourceMappingURL=intercept.js.map