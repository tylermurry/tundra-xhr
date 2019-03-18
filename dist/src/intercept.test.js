'use strict';

var _intercept = require('./intercept');

var _intercept2 = _interopRequireDefault(_intercept);

var _submitRequest = require('./submitRequest');

var _submitRequest2 = _interopRequireDefault(_submitRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function makeFakeRequest() {
  // It's not possible to both mock XHR and make a 'fake' real request.
  // Instead, we're calling out to a real URL that will likely always be
  // there and unlikely to change. #tradeoffs

  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest(); // eslint-disable-line no-undef

    xhr.open('GET', 'http://httpstat.us/200');
    xhr.onload = resolve;
    xhr.send();
  });
}

jest.mock('./submitRequest', function () {
  return jest.fn();
});

describe('intercept', function () {
  it('should proxy the request properly', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var callback;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            callback = jest.fn();


            (0, _intercept2.default)(undefined, callback);

            _context.next = 4;
            return makeFakeRequest();

          case 4:

            // Dear future self, please forgive this mortal sin. Fix when able.
            callback.mock.calls[0][0].response.headers.date = 'static date';
            _submitRequest2.default.mock.calls[0][0].response.headers.date = 'static date';

            expect(callback.mock.calls).toMatchSnapshot();
            expect(_submitRequest2.default.mock.calls).toMatchSnapshot();

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
});
//# sourceMappingURL=intercept.test.js.map