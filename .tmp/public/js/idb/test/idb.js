"use strict";var _runtime=require("regenerator/runtime"),_runtime2=_interopRequireDefault(_runtime),_assert=require("assert"),_assert2=_interopRequireDefault(_assert),_es6Promise=require("es6-promise");function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _asyncToGenerator(e){return function(){var i=e.apply(this,arguments);return new _es6Promise.Promise(function(o,s){return function t(e,r){try{var n=i[e](r),a=n.value}catch(e){return void s(e)}if(!n.done)return _es6Promise.Promise.resolve(a).then(function(e){t("next",e)},function(e){t("throw",e)});o(a)}("next")})}}self.Promise=_es6Promise.Promise,describe("idb interface",function(){beforeEach(function(e){return idb.delete("tmp-db").then(e)}),it("exists on window",function(){(0,_assert2.default)("idb"in self)}),it("has open and delete methods",function(){(0,_assert2.default)("open"in idb),(0,_assert2.default)("delete"in idb)}),it("stuff",_asyncToGenerator(_runtime2.default.mark(function e(){var t,r,n;return _runtime2.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,idb.open("tmp-db",1,function(e){switch(e.oldVersion){case 0:e.createObjectStore("key-val").put("world","hello")}});case 2:return t=e.sent,r=t.transaction("key-val","readwrite"),n=r.objectStore("key-val"),e.t0=n,e.next=8,n.get("hello");case 8:return e.t1=e.sent,e.t0.put.call(e.t0,e.t1,"foo"),e.next=12,r.complete;case 12:return r=t.transaction("key-val"),e.t2=_assert2.default,e.next=16,r.objectStore("key-val").get("foo");case 16:e.t3=e.sent,e.t2.equal.call(e.t2,e.t3,"world"),t.close();case 19:case"end":return e.stop()}},e,void 0)}))),it("lets me itterate over a cursor",_asyncToGenerator(_runtime2.default.mark(function e(){var t,r,n;return _runtime2.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,idb.open("tmp-db",1,function(e){switch(e.oldVersion){case 0:var t=e.createObjectStore("list",{keyPath:""});t.put("a"),t.put("b"),t.put("c"),t.put("d"),t.put("e")}});case 2:return t=e.sent,r=t.transaction("list"),n=[],r.objectStore("list").iterateCursor(function(e){e&&(n.push(e.value),e.continue())}),e.next=8,r.complete;case 8:_assert2.default.equal(n.join(),"a,b,c,d,e"),t.close();case 10:case"end":return e.stop()}},e,void 0)}))),it("rejects rather than throws",_asyncToGenerator(_runtime2.default.mark(function e(){var t,r,n,a,o,s;return _runtime2.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,idb.open("tmp-db",1,function(e){e.createObjectStore("key-val")});case 2:return t=e.sent,n=r=!1,a=t.transaction("key-val"),o=a.objectStore("key-val"),s=void 0,e.next=10,a.complete;case 10:try{s=o.get("hello").catch(function(e){return n=!0})}catch(e){r=!0}return e.next=13,s;case 13:(0,_assert2.default)(!r,"Did not throw"),(0,_assert2.default)(n,"Rejected");case 15:case"end":return e.stop()}},e,void 0)})))});