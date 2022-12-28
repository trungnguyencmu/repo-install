(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common/http'), require('@angular/core'), require('rxjs/operators'), require('rxjs'), require('spark-md5'), require('@angular/forms'), require('@ng-bootstrap/ng-bootstrap'), require('@angular/common'), require('@angular/platform-browser')) :
    typeof define === 'function' && define.amd ? define('sakani-upload-files', ['exports', '@angular/common/http', '@angular/core', 'rxjs/operators', 'rxjs', 'spark-md5', '@angular/forms', '@ng-bootstrap/ng-bootstrap', '@angular/common', '@angular/platform-browser'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["sakani-upload-files"] = {}, global.ng.common.http, global.ng.core, global.rxjs.operators, global.rxjs, global.SparkMD5, global.ng.forms, global.i3, global.ng.common, global.ng.platformBrowser));
})(this, (function (exports, i1, i0, operators, rxjs, SparkMD5, i1$2, i3, i10, i1$1) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i1__namespace = /*#__PURE__*/_interopNamespace(i1);
    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var SparkMD5__namespace = /*#__PURE__*/_interopNamespace(SparkMD5);
    var i1__namespace$2 = /*#__PURE__*/_interopNamespace(i1$2);
    var i3__namespace = /*#__PURE__*/_interopNamespace(i3);
    var i10__namespace = /*#__PURE__*/_interopNamespace(i10);
    var i1__namespace$1 = /*#__PURE__*/_interopNamespace(i1$1);

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function () { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }
    function __classPrivateFieldIn(state, receiver) {
        if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function"))
            throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
    }

    var JsonApi = /** @class */ (function () {
        function JsonApi() {
            this.relationships = {};
        }
        JsonApi.buildFromObject = function (type, object) {
            var obj = new type();
            Object.keys(obj).forEach(function (key) {
                if (object && object[key] != null) {
                    obj[key] = object[key];
                }
            });
            return obj;
        };
        JsonApi.parseJsonApi = function (type, data, included) {
            var obj = new type();
            if (Object.keys(obj).length === 0) {
                return new type(data === null || data === void 0 ? void 0 : data.attributes);
            }
            obj.data = data || {};
            obj.included = included || [];
            obj.id = obj.data.id;
            obj.type = obj.data.type;
            Object.keys(obj).forEach(function (key) {
                if (obj.data.attributes[key.toString()] != null) {
                    obj[key] = obj.data.attributes[key];
                }
            });
            if (obj.data.relationships) {
                Object.entries(obj.data.relationships).forEach(function (_a) {
                    var _b = __read(_a, 2), key = _b[0], val = _b[1];
                    if (val.data) {
                        obj[key] = JsonApi.getRelationship(obj, obj.relationships[key], val);
                    }
                });
            }
            return obj;
        };
        JsonApi.getRelationship = function (obj, relationship, val) {
            if (!relationship) {
                return;
            }
            if (relationship.rel === 'has_one') {
                var data = obj.included.find(function (item) {
                    return item.type === val.data.type && item.id === val.data.id;
                });
                return JsonApi.parseJsonApi(relationship.model, data, obj.included);
            }
            if (relationship.rel === 'has_many') {
                var data_1 = [];
                val.data.forEach(function (element) {
                    var matchItem = obj.included.find(function (item) {
                        return element.type === item.type && element.id === item.id;
                    });
                    data_1.push(JsonApi.parseJsonApi(relationship.model, matchItem));
                });
                return data_1;
            }
        };
        return JsonApi;
    }());

    var DirectUpload = /** @class */ (function () {
        function DirectUpload(url, filename, blob_signed_id, presigned_url, public_url, upload_key, headers) {
            this.url = url;
            this.filename = filename;
            this.blob_signed_id = blob_signed_id;
            this.presigned_url = presigned_url;
            this.public_url = public_url;
            this.upload_key = upload_key;
            this.headers = headers;
            this.relationships = {};
        }
        return DirectUpload;
    }());

    var SakaniUploadFilesService = /** @class */ (function () {
        function SakaniUploadFilesService(http) {
            this.http = http;
        }
        SakaniUploadFilesService.prototype.directUpload = function (_a) {
            var auth = _a.auth, file = _a.file, apiUrl = _a.apiUrl, uploader = _a.uploader;
            var headers = new i1.HttpHeaders({
                'Content-Type': 'application/json',
                Authentication: auth,
            });
            var options = { headers: headers };
            var payload = {
                _jsonapi: {
                    data: {
                        type: 'direct_uploads',
                        attributes: {
                            filename: file.data.name,
                            extension: file.data.type,
                            uploader: uploader,
                            content_length: file.data.size,
                        },
                    },
                },
            };
            return this.http
                .post("" + apiUrl, payload, options)
                .pipe(operators.map(function (res) { return JsonApi.parseJsonApi(DirectUpload, res.data); }));
        };
        SakaniUploadFilesService.prototype.directUploadByActiveRecord = function (_a) {
            var auth = _a.auth, file = _a.file, apiUrl = _a.apiUrl, folder = _a.folder;
            var headers = new i1.HttpHeaders({
                'Content-Type': 'application/json',
                Authentication: auth,
            });
            var options = { headers: headers };
            var payload = {
                data: {
                    type: 'direct_uploads',
                    attributes: {
                        filename: file.data.name,
                        content_type: file.data.type,
                        byte_size: file.data.size,
                        checksum: file.checksum,
                        folder: folder,
                    },
                },
            };
            return this.http
                .post("" + apiUrl, payload, options)
                .pipe(operators.map(function (res) { return JsonApi.parseJsonApi(DirectUpload, res.data); }));
        };
        SakaniUploadFilesService.prototype.s3Upload = function (presignedURL, file, headers) {
            return this.http.put(presignedURL, file, { headers: headers });
        };
        return SakaniUploadFilesService;
    }());
    SakaniUploadFilesService.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SakaniUploadFilesService, deps: [{ token: i1__namespace.HttpClient }], target: i0__namespace.ɵɵFactoryTarget.Injectable });
    SakaniUploadFilesService.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SakaniUploadFilesService, providedIn: 'root' });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SakaniUploadFilesService, decorators: [{
                type: i0.Injectable,
                args: [{ providedIn: 'root' }]
            }], ctorParameters: function () { return [{ type: i1__namespace.HttpClient }]; } });

    var FILE_DATA_STATUS = {
        WAITING: 'waiting',
        UPLOADING: 'uploading',
        UPLOADED: 'uploaded',
        ERROR: 'error',
    };
    function ReadAsync(file) {
        var sub = new rxjs.Subject();
        var reader = new FileReader();
        reader.onerror = function (err) { return sub.error(err); };
        reader.onabort = function (err) { return sub.error(err); };
        reader.onload = function () {
            reader.result && sub.next(reader.result);
            sub.complete();
            reader.abort();
        };
        reader.readAsArrayBuffer(file.data);
        return sub.asObservable();
    }
    function GenerateChecksum(data) {
        var spark = new SparkMD5__namespace.ArrayBuffer();
        spark.append(data);
        return btoa(spark.end(true));
    }
    var dataURIToBlob = function (dataURI) {
        var splitDataURI = dataURI.split(',');
        var byteString = splitDataURI[0].indexOf('base64') >= 0
            ? atob(splitDataURI[1])
            : decodeURI(splitDataURI[1]);
        var mimeString = splitDataURI[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    };
    var formatFileSize = function (bytes) {
        if (bytes == 0)
            return 0;
        var k = 1000, i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseInt((bytes / Math.pow(k, i)).toFixed(2));
    };

    var IconRemoveCircleComponent = /** @class */ (function () {
        function IconRemoveCircleComponent() {
            this.color = '#06222B';
        }
        return IconRemoveCircleComponent;
    }());
    IconRemoveCircleComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconRemoveCircleComponent, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
    IconRemoveCircleComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconRemoveCircleComponent, selector: "app-icon-remove-circle", inputs: { color: "color" }, ngImport: i0__namespace, template: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect width=\"24\" height=\"24\" rx=\"12\" fill=\"white\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5.60004 12.0001C5.60004 11.7056 5.83882 11.4668 6.13337 11.4668L17.8667 11.4668C18.1612 11.4668 18.4 11.7056 18.4 12.0001C18.4 12.2947 18.1612 12.5335 17.8667 12.5335L6.13337 12.5335C5.83882 12.5335 5.60004 12.2947 5.60004 12.0001Z\" [attr.fill]=\"color\"/>\n</svg>\n", styles: [""] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconRemoveCircleComponent, decorators: [{
                type: i0.Component,
                args: [{
                        selector: 'app-icon-remove-circle',
                        templateUrl: './icon-remove-circle.component.svg',
                        styleUrls: ['./icon-remove-circle.component.css'],
                    }]
            }], propDecorators: { color: [{
                    type: i0.Input
                }] } });

    var IconErrorComponent = /** @class */ (function () {
        function IconErrorComponent() {
        }
        return IconErrorComponent;
    }());
    IconErrorComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconErrorComponent, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
    IconErrorComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconErrorComponent, selector: "app-icon-error", ngImport: i0__namespace, template: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6.58075 24.1519C6.46502 24.1519 6.35403 24.1059 6.27219 24.024L0.127808 17.8797C0.0459739 17.7978 0 17.6868 0 17.5711V6.7326C0 6.61687 0.0459739 6.50588 0.127808 6.42405L6.27219 0.279663C6.35403 0.197829 6.46502 0.151855 6.58075 0.151855H17.4193C17.535 0.151855 17.646 0.197829 17.7278 0.279663L23.8722 6.42405C23.954 6.50588 24 6.61687 24 6.7326V17.5711C24 17.6868 23.954 17.7978 23.8722 17.8797L17.7278 24.024C17.646 24.1059 17.535 24.1519 17.4193 24.1519H6.58075ZM11.7091 5.75195C11.4913 5.75195 11.2829 5.84078 11.132 5.99792C10.9812 6.15506 10.9009 6.36693 10.9098 6.58458L11.2007 13.7119C11.2182 14.1406 11.5709 14.4792 12 14.4792C12.4292 14.4792 12.7819 14.1406 12.7994 13.7119L13.0903 6.58458C13.0992 6.36693 13.0189 6.15506 12.868 5.99792C12.7172 5.84078 12.5088 5.75195 12.2909 5.75195H11.7091ZM12 18.552C12.6025 18.552 13.0909 18.0635 13.0909 17.461C13.0909 16.8585 12.6025 16.3701 12 16.3701C11.3975 16.3701 10.9091 16.8585 10.9091 17.461C10.9091 18.0635 11.3975 18.552 12 18.552Z\" fill=\"#D05C5C\"/>\n</svg>\n", styles: [""] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconErrorComponent, decorators: [{
                type: i0.Component,
                args: [{
                        selector: 'app-icon-error',
                        templateUrl: './icon-error.component.svg',
                        styleUrls: ['./icon-error.component.css'],
                    }]
            }] });

    var IconResetComponent = /** @class */ (function () {
        function IconResetComponent() {
        }
        return IconResetComponent;
    }());
    IconResetComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconResetComponent, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
    IconResetComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconResetComponent, selector: "app-icon-reset", ngImport: i0__namespace, template: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.8912 3.9806C11.9044 3.53897 12.273 3.19161 12.7147 3.20475C18.3131 3.37138 22.7999 7.96158 22.7999 13.6C22.7999 19.3438 18.1437 24 12.4 24C6.65622 24 2 19.3438 2 13.6C2 10.7219 3.17021 8.11554 5.05885 6.2334C5.37181 5.92153 5.87834 5.9224 6.19022 6.23536C6.50209 6.54831 6.50122 7.05484 6.18826 7.36672C4.58854 8.96093 3.59999 11.1643 3.59999 13.6C3.59999 18.4601 7.53987 22.4 12.4 22.4C17.2601 22.4 21.1999 18.4601 21.1999 13.6C21.1999 8.82929 17.4033 4.945 12.6671 4.80404C12.2254 4.7909 11.8781 4.42223 11.8912 3.9806Z\" fill=\"#06222B\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16.0708 9.25464C15.7089 9.50806 15.2101 9.4201 14.9567 9.05818L11.7446 4.47094C11.4912 4.10902 11.5792 3.61018 11.9411 3.35676L16.5283 0.144747C16.8903 -0.108675 17.3891 -0.0207167 17.6425 0.341206C17.8959 0.703129 17.808 1.20196 17.4461 1.45538L13.5141 4.20854L16.2673 8.14046C16.5207 8.50238 16.4328 9.00121 16.0708 9.25464Z\" fill=\"#06222B\"/>\n</svg>\n", styles: [""] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconResetComponent, decorators: [{
                type: i0.Component,
                args: [{
                        selector: 'app-icon-reset',
                        templateUrl: './icon-reset.component.svg',
                        styleUrls: ['./icon-reset.component.css'],
                    }]
            }] });

    var IconLoadingComponent = /** @class */ (function () {
        function IconLoadingComponent() {
        }
        return IconLoadingComponent;
    }());
    IconLoadingComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconLoadingComponent, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
    IconLoadingComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconLoadingComponent, selector: "app-icon-loading", ngImport: i0__namespace, template: "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"margin: auto; background: none; display: block; shape-rendering: auto;\" width=\"61px\" height=\"61px\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\">\n<g transform=\"rotate(0 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.9166666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(30 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.8333333333333334s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(60 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.75s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(90 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.6666666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(120 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.5833333333333334s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(150 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.5s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(180 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.4166666666666667s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(210 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.3333333333333333s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(240 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.25s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(270 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.16666666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(300 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.08333333333333333s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(330 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"0s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g>\n<!-- [ldio] generated by https://loading.io/ --></svg>\n", styles: [""] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconLoadingComponent, decorators: [{
                type: i0.Component,
                args: [{
                        selector: 'app-icon-loading',
                        templateUrl: './icon-loading.component.svg',
                        styleUrls: ['./icon-loading.component.css'],
                    }]
            }] });

    var IconFileComponent = /** @class */ (function () {
        function IconFileComponent() {
        }
        return IconFileComponent;
    }());
    IconFileComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconFileComponent, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
    IconFileComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconFileComponent, selector: "app-icon-file", ngImport: i0__namespace, template: "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"#000000\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z\"/></svg>\n", styles: [""] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconFileComponent, decorators: [{
                type: i0.Component,
                args: [{
                        selector: 'app-icon-file',
                        templateUrl: './icon-file.component.svg',
                        styleUrls: ['./icon-file.component.css'],
                    }]
            }] });

    var IconUploadPlusComponent = /** @class */ (function () {
        function IconUploadPlusComponent() {
        }
        return IconUploadPlusComponent;
    }());
    IconUploadPlusComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconUploadPlusComponent, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
    IconUploadPlusComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconUploadPlusComponent, selector: "app-icon-upload-plus", ngImport: i0__namespace, template: "<svg width=\"25\" height=\"24\" viewBox=\"0 0 25 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"0.5\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#8A979B\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6.10004 11.9996C6.10004 11.705 6.33882 11.4663 6.63337 11.4663L18.3667 11.4663C18.6612 11.4663 18.9 11.705 18.9 11.9996C18.9 12.2941 18.6612 12.5329 18.3667 12.5329L6.63337 12.5329C6.33882 12.5329 6.10004 12.2941 6.10004 11.9996Z\" fill=\"white\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.5 18.3996C12.2055 18.3996 11.9667 18.1608 11.9667 17.8663L11.9667 6.13294C11.9667 5.83839 12.2055 5.59961 12.5 5.59961C12.7946 5.59961 13.0334 5.83839 13.0334 6.13294L13.0334 17.8663C13.0334 18.1608 12.7946 18.3996 12.5 18.3996Z\" fill=\"white\"/>\n</svg>\n", styles: [""] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: IconUploadPlusComponent, decorators: [{
                type: i0.Component,
                args: [{
                        selector: 'app-icon-upload-plus',
                        templateUrl: './icon-upload-plus.component.svg',
                        styleUrls: ['./icon-upload-plus.component.css'],
                    }]
            }] });

    var SafePipe = /** @class */ (function () {
        function SafePipe(sanitizer) {
            this.sanitizer = sanitizer;
        }
        SafePipe.prototype.transform = function (value, type) {
            switch (type) {
                case 'html':
                    return this.sanitizer.bypassSecurityTrustHtml(value);
                case 'style':
                    return this.sanitizer.bypassSecurityTrustStyle(value);
                case 'script':
                    return this.sanitizer.bypassSecurityTrustScript(value);
                case 'url':
                    return this.sanitizer.bypassSecurityTrustUrl(value);
                case 'resourceUrl':
                    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
                default:
                    throw new Error("Invalid safe type specified: " + type);
            }
        };
        return SafePipe;
    }());
    SafePipe.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SafePipe, deps: [{ token: i1__namespace$1.DomSanitizer }], target: i0__namespace.ɵɵFactoryTarget.Pipe });
    SafePipe.ɵpipe = i0__namespace.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SafePipe, name: "safe" });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SafePipe, decorators: [{
                type: i0.Pipe,
                args: [{
                        name: 'safe',
                    }]
            }], ctorParameters: function () { return [{ type: i1__namespace$1.DomSanitizer }]; } });

    var SakaniUploadFilesComponent = /** @class */ (function () {
        function SakaniUploadFilesComponent(control, formBuilder, SakaniUploadFilesService, modalService) {
            this.control = control;
            this.formBuilder = formBuilder;
            this.SakaniUploadFilesService = SakaniUploadFilesService;
            this.modalService = modalService;
            this.formChanged = new i0.EventEmitter();
            this.isActiveStorage = false;
            this.auth = '';
            this.endpointAPI = '';
            this.required = false;
            this.placeholder = 'Upload [photo type]';
            this.uploading = false;
            this.allowMultiple = false;
            this.label = '';
            this.itemWrapperClass = 'col-12 col-lg-3 col-xxl-2';
            this.allowedExtension = '*'; // 'image/png, image/jpeg'
            this.readonly = false;
            this.processUploadEvent = new i0.EventEmitter();
            this.deleteFileEvent = new i0.EventEmitter();
            this.fileOnClickEvent = new i0.EventEmitter();
            this.fileDataStatus = FILE_DATA_STATUS;
            this.errors = '';
            if (this.control) {
                this.control.valueAccessor = this;
            }
        }
        SakaniUploadFilesComponent.prototype.ngOnInit = function () { };
        SakaniUploadFilesComponent.prototype.ngOnDestroy = function () {
            this.formSubscription.unsubscribe();
        };
        SakaniUploadFilesComponent.prototype.registerOnChange = function (fn) {
            this.formChanged.subscribe(fn);
        };
        SakaniUploadFilesComponent.prototype.registerOnTouched = function (fn) { };
        SakaniUploadFilesComponent.prototype.subscriptionFilesForm = function () {
            var _this = this;
            if (this.formSubscription) {
                this.formSubscription.unsubscribe();
            }
            this.formSubscription = this.filesForm.valueChanges.subscribe(function (val) {
                _this.formChanged.emit(val);
            });
        };
        SakaniUploadFilesComponent.prototype.writeValue = function (controls) {
            if (controls) {
                this.filesForm = this.formBuilder.group(controls);
                this.subscriptionFilesForm();
            }
            else {
                this.filesForm = this.formBuilder.group({});
                this.subscriptionFilesForm();
            }
        };
        SakaniUploadFilesComponent.prototype.handleUploadItem = function (item) {
            var _this = this;
            return rxjs.defer(function () {
                var _a;
                item.status = _this.fileDataStatus.UPLOADING;
                _this.filesForm.patchValue((_a = {}, _a[item.id] = Object.assign({}, item), _a));
                var blob;
                // read file and generate checksum
                return ReadAsync(item).pipe(operators.mergeMap(function (file) {
                    var checksum = GenerateChecksum(file);
                    item.checksum = checksum;
                    blob = file;
                    return _this.isActiveStorage
                        ? _this.SakaniUploadFilesService.directUploadByActiveRecord({
                            auth: _this.auth,
                            file: item,
                            apiUrl: _this.endpointAPI,
                            folder: _this.folder,
                        })
                        : _this.SakaniUploadFilesService.directUpload({
                            auth: _this.auth,
                            file: item,
                            apiUrl: _this.endpointAPI,
                            uploader: _this.uploader,
                        });
                }), operators.mergeMap(function (res) {
                    item.public_url = res === null || res === void 0 ? void 0 : res.public_url;
                    item.signed_blob_id = res === null || res === void 0 ? void 0 : res.blob_signed_id;
                    return rxjs.combineLatest([
                        rxjs.of(res),
                        _this.SakaniUploadFilesService.s3Upload((res === null || res === void 0 ? void 0 : res.presigned_url) || (res === null || res === void 0 ? void 0 : res.url) || '', blob, res === null || res === void 0 ? void 0 : res.headers),
                    ]);
                }), operators.catchError(function (err) {
                    item.status = _this.fileDataStatus.ERROR;
                    return rxjs.of(undefined);
                }), operators.map(function (res) {
                    if (res)
                        return res[0].public_url;
                    return;
                }), operators.finalize(function () {
                    var _a;
                    if (item.status !== _this.fileDataStatus.ERROR) {
                        item.status = _this.fileDataStatus.UPLOADED;
                    }
                    var itemFormValue = _this.filesForm.value[item.id];
                    _this.filesForm.patchValue((_a = {},
                        _a[item.id] = Object.assign(Object.assign({}, itemFormValue), item),
                        _a));
                }), operators.catchError(function (err) {
                    return rxjs.of(undefined);
                }));
            });
        };
        SakaniUploadFilesComponent.prototype.isFileUrlImage = function (type) {
            if (!type) {
                return false;
            }
            return type === null || type === void 0 ? void 0 : type.includes('image');
        };
        SakaniUploadFilesComponent.prototype.handleUploadItems = function (items) {
            var e_1, _a;
            var _this = this;
            var uploadObs = [];
            try {
                for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                    var item = items_1_1.value;
                    var obs = this.handleUploadItem(item);
                    if (obs !== undefined) {
                        uploadObs.push(obs);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            rxjs.forkJoin(uploadObs).subscribe(function (res) {
                var tmpRes = res.filter(function (x) { return x; });
                _this.processUploadEvent.emit(tmpRes);
            });
        };
        SakaniUploadFilesComponent.prototype.addFiles = function (event) {
            var e_2, _a;
            var files = event.target
                .files;
            var fileData = [];
            this.errors = '';
            try {
                for (var _b = __values(Array.from(files)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var file = _c.value;
                    if (this.maxFileSize && file.size > this.maxFileSize) {
                        var maxSize = Math.floor(this.maxFileSize / 1000000);
                        this.errors = this.translateService.instant('ERRORS.FILE_SIZE_TOO_BIG', {
                            maxSize: maxSize,
                        });
                        continue;
                    }
                    else {
                        var tmpFileData = {
                            id: '_' + Math.random().toString(36).substring(2, 9),
                            data: file,
                            status: this.fileDataStatus.WAITING,
                            isRecord: false,
                        };
                        fileData.push(tmpFileData);
                        this.readFile(file, tmpFileData);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.handleUploadItems(fileData);
        };
        SakaniUploadFilesComponent.prototype.readFile = function (file, fileData) {
            var _this = this;
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                var fileContent = reader.result;
                var blob = dataURIToBlob(fileContent);
                _this.addControlForm(Object.assign(Object.assign({}, fileData), { content_type: blob.type, filename: file.name, file_url: URL.createObjectURL(blob) }));
            };
        };
        SakaniUploadFilesComponent.prototype.downloadFile = function (file) {
            if (file && file.file_url) {
                window.open(file.file_url);
            }
        };
        SakaniUploadFilesComponent.prototype.addControlForm = function (fileData) {
            this.filesForm.addControl(fileData.id, this.formBuilder.control(fileData));
        };
        SakaniUploadFilesComponent.prototype.reUpload = function ($event, item) {
            var _this = this;
            $event.stopPropagation();
            var uploadObs = [];
            var obs = this.handleUploadItem(item);
            uploadObs.push(obs);
            rxjs.forkJoin(uploadObs).subscribe(function (res) {
                var tmpRes = res.filter(function (x) { return x; });
                _this.processUploadEvent.emit(tmpRes);
            });
        };
        SakaniUploadFilesComponent.prototype.fileOnClick = function (item) {
            this.fileOnClickEvent.emit(item);
        };
        SakaniUploadFilesComponent.prototype.previewItem = function (item) {
            this.currentPreviewItem = item;
            this.getPreviewImage();
            this.modalService.open(this.previewTpl, {
                centered: true,
                size: 'xl',
            });
        };
        SakaniUploadFilesComponent.prototype.getPreviewImage = function () {
            var _this = this;
            if (!this.currentPreviewItem.file_url) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    _this.currentPreviewItem.file_url = event.target.result;
                };
                reader.readAsDataURL(this.currentPreviewItem.data);
            }
            else {
                return this.currentPreviewItem.file_url;
            }
        };
        Object.defineProperty(SakaniUploadFilesComponent.prototype, "getFormValues", {
            get: function () {
                return Object.values(this.filesForm.value).filter(function (photo) { return !(photo === null || photo === void 0 ? void 0 : photo._destroy); });
            },
            enumerable: false,
            configurable: true
        });
        SakaniUploadFilesComponent.prototype.closePreview = function () {
            this.modalService.dismissAll();
        };
        SakaniUploadFilesComponent.prototype.isInvalid = function (item) {
            return item.status === 'error';
        };
        SakaniUploadFilesComponent.prototype.remove = function ($event, file) {
            var _a;
            $event.stopPropagation();
            if (file.isRecord) {
                this.filesForm.patchValue((_a = {},
                    _a[file.id] = Object.assign(Object.assign({}, file), { isRecord: false, _destroy: true }),
                    _a));
            }
            else {
                this.filesForm.removeControl(file.id);
            }
        };
        return SakaniUploadFilesComponent;
    }());
    SakaniUploadFilesComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SakaniUploadFilesComponent, deps: [{ token: i1__namespace$2.NgControl }, { token: i1__namespace$2.FormBuilder }, { token: SakaniUploadFilesService }, { token: i3__namespace.NgbModal }], target: i0__namespace.ɵɵFactoryTarget.Component });
    SakaniUploadFilesComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: SakaniUploadFilesComponent, selector: "lib-sakani-upload-files", inputs: { translateService: "translateService", isActiveStorage: "isActiveStorage", auth: "auth", endpointAPI: "endpointAPI", required: "required", placeholder: "placeholder", uploading: "uploading", allowMultiple: "allowMultiple", label: "label", itemWrapperClass: "itemWrapperClass", allowedExtension: "allowedExtension", readonly: "readonly", uploader: "uploader", folder: "folder", maxFileSize: "maxFileSize" }, outputs: { processUploadEvent: "processUploadEvent", deleteFileEvent: "deleteFileEvent", fileOnClickEvent: "fileOnClickEvent" }, viewQueries: [{ propertyName: "previewTpl", first: true, predicate: ["preview"], descendants: true }], ngImport: i0__namespace, template: "<div class=\"form-group row\">\n  <ng-container *ngIf=\"getFormValues.length > 0\">\n    <ng-container *ngFor=\"let file of getFormValues; index as i\">\n      <div [className]=\"itemWrapperClass\">\n        <ng-container *ngIf=\"label\">\n          <label class=\"form-label\"\n            >{{ label }}<span *ngIf=\"allowMultiple\">{{ i + 1 }}</span\n            ><span *ngIf=\"required\" class=\"required-field\"> *</span></label\n          >\n        </ng-container>\n        <div\n          *ngIf=\"isFileUrlImage(file.content_type); else fileBlock\"\n          class=\"form-control image-container p-2 d-flex flex-column border-info round bg-white cursor-pointer mb-3\"\n          [ngClass]=\"{\n            invalid: isInvalid(file),\n            valid: !isInvalid(file)\n          }\"\n          (click)=\"previewItem(file)\"\n          [ngStyle]=\"{ 'background-image': 'url(' + file.file_url + ')' }\"\n        >\n          <div\n            class=\"cursor-pointer d-flex justify-content-end align-items-end\"\n            *ngIf=\"!readonly\"\n            appLayoutDirection\n          >\n            <app-icon-remove-circle\n              (click)=\"remove($event, file)\"\n            ></app-icon-remove-circle>\n          </div>\n          <div\n            *ngIf=\"file.status === fileDataStatus.ERROR\"\n            class=\"d-flex flex-row wrap-error cursor-pointer justify-content-center align-items-center gap-3\"\n            (click)=\"reUpload($event, file)\"\n          >\n            <div class=\"cursor-pointer\">\n              <app-icon-error appLayoutDirection></app-icon-error>\n            </div>\n            <div class=\"cursor-pointer\">\n              <app-icon-reset appLayoutDirection></app-icon-reset>\n            </div>\n          </div>\n          <div\n            *ngIf=\"file.status === fileDataStatus.UPLOADING\"\n            class=\"d-flex flex-row wrap-error cursor-pointer justify-content-center align-items-center\"\n          >\n            <app-icon-loading></app-icon-loading>\n          </div>\n        </div>\n        <ng-template #fileBlock>\n          <div\n            class=\"form-control image-container p-2 d-flex flex-column border-info round bg-file cursor-pointer mb-3\"\n          >\n            <div\n              class=\"cursor-pointer d-flex justify-content-end align-items-end\"\n              *ngIf=\"!readonly\"\n              appLayoutDirection\n            >\n              <app-icon-remove-circle\n                (click)=\"remove($event, file)\"\n              ></app-icon-remove-circle>\n            </div>\n            <div\n              class=\"d-flex flex-column h-100 wrap-error cursor-pointer justify-content-center align-items-center\"\n              (click)=\"downloadFile(file)\"\n            >\n              <app-icon-file></app-icon-file>\n              <div\n                *ngIf=\"file.status === fileDataStatus.ERROR\"\n                class=\"d-flex flex-row file-type-error cursor-pointer justify-content-center align-items-center gap-3\"\n                (click)=\"reUpload($event, file)\"\n              >\n                <div class=\"cursor-pointer\">\n                  <app-icon-error appLayoutDirection></app-icon-error>\n                </div>\n                <div class=\"cursor-pointer\">\n                  <app-icon-reset appLayoutDirection></app-icon-reset>\n                </div>\n              </div>\n              <div\n                *ngIf=\"file.status === fileDataStatus.UPLOADING\"\n                class=\"d-flex flex-row file-type-error cursor-pointer justify-content-center align-items-center\"\n              >\n                <app-icon-loading></app-icon-loading>\n              </div>\n              <span class=\"extension-name\"> {{ file.fileName }} </span>\n            </div>\n          </div>\n        </ng-template>\n      </div>\n    </ng-container>\n  </ng-container>\n  <input\n    #files\n    type=\"file\"\n    [multiple]=\"allowMultiple\"\n    [accept]=\"allowedExtension\"\n    class=\"d-none\"\n    onclick=\"this.value=null\"\n    (change)=\"addFiles($event)\"\n  />\n  <div\n    [className]=\"itemWrapperClass\"\n    *ngIf=\"!readonly && (allowMultiple || getFormValues.length === 0)\"\n  >\n    <div\n      class=\"form-control image-container justify-content-center align-items-center p-2 d-flex flex-column border-info round bg-white cursor-pointer d-inline-flex mb-3\"\n      (click)=\"files.click()\"\n    >\n      <ng-container>\n        <app-icon-upload-plus appLayoutDirection></app-icon-upload-plus>\n        <span class=\"text-mid-gray mt-2\">{{ placeholder }}</span>\n      </ng-container>\n    </div>\n  </div>\n  <div class=\"text-danger\" *ngIf=\"errors\">{{ errors }}</div>\n</div>\n<ng-template #preview let-modal>\n  <div class=\"modal-body text-center\">\n    <img\n      class=\"img-fluid\"\n      [src]=\"currentPreviewItem.file_url! | safe : 'url'\"\n    />\n  </div>\n</ng-template>\n", styles: [".h-100{height:100%}.bg-file{background-color:#e6dddd}.text-mid-gray{color:#8a979b}.mt-2{margin-top:.5rem}.multiple-upload i{color:#00aca9;cursor:pointer}.item-name{border-bottom:1px solid;word-break:break-word}.spinner-border{width:1rem;height:1rem;min-width:1rem;min-height:1rem}.image-container{box-sizing:border-box;height:188px;background-size:cover!important}.image-container .wrap-error{height:130px;grid-gap:1rem;gap:1rem}\n"], components: [{ type: IconRemoveCircleComponent, selector: "app-icon-remove-circle", inputs: ["color"] }, { type: IconErrorComponent, selector: "app-icon-error" }, { type: IconResetComponent, selector: "app-icon-reset" }, { type: IconLoadingComponent, selector: "app-icon-loading" }, { type: IconFileComponent, selector: "app-icon-file" }, { type: IconUploadPlusComponent, selector: "app-icon-upload-plus" }], directives: [{ type: i10__namespace.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i10__namespace.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i10__namespace.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i10__namespace.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], pipes: { "safe": SafePipe } });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SakaniUploadFilesComponent, decorators: [{
                type: i0.Component,
                args: [{
                        selector: 'lib-sakani-upload-files',
                        templateUrl: './sakani-upload-files.component.html',
                        styleUrls: ['./sakani-upload-files.component.scss'],
                    }]
            }], ctorParameters: function () { return [{ type: i1__namespace$2.NgControl }, { type: i1__namespace$2.FormBuilder }, { type: SakaniUploadFilesService }, { type: i3__namespace.NgbModal }]; }, propDecorators: { translateService: [{
                    type: i0.Input
                }], isActiveStorage: [{
                    type: i0.Input
                }], auth: [{
                    type: i0.Input
                }], endpointAPI: [{
                    type: i0.Input
                }], required: [{
                    type: i0.Input
                }], placeholder: [{
                    type: i0.Input
                }], uploading: [{
                    type: i0.Input
                }], allowMultiple: [{
                    type: i0.Input
                }], label: [{
                    type: i0.Input
                }], itemWrapperClass: [{
                    type: i0.Input
                }], allowedExtension: [{
                    type: i0.Input
                }], readonly: [{
                    type: i0.Input
                }], uploader: [{
                    type: i0.Input
                }], folder: [{
                    type: i0.Input
                }], maxFileSize: [{
                    type: i0.Input
                }], processUploadEvent: [{
                    type: i0.Output
                }], deleteFileEvent: [{
                    type: i0.Output
                }], fileOnClickEvent: [{
                    type: i0.Output
                }], previewTpl: [{
                    type: i0.ViewChild,
                    args: ['preview']
                }] } });

    var components = [
        IconRemoveCircleComponent,
        IconErrorComponent,
        IconResetComponent,
        IconUploadPlusComponent,
        IconLoadingComponent,
        IconFileComponent,
    ];
    var SakaniMultipleUploadModule = /** @class */ (function () {
        function SakaniMultipleUploadModule() {
        }
        return SakaniMultipleUploadModule;
    }());
    SakaniMultipleUploadModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SakaniMultipleUploadModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    SakaniMultipleUploadModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SakaniMultipleUploadModule, declarations: [SakaniUploadFilesComponent, SafePipe, IconRemoveCircleComponent,
            IconErrorComponent,
            IconResetComponent,
            IconUploadPlusComponent,
            IconLoadingComponent,
            IconFileComponent], imports: [i10.CommonModule,
            i1$2.FormsModule,
            i1$2.ReactiveFormsModule,
            i3.NgbPaginationModule,
            i3.NgbAlertModule], exports: [SakaniUploadFilesComponent, IconRemoveCircleComponent,
            IconErrorComponent,
            IconResetComponent,
            IconUploadPlusComponent,
            IconLoadingComponent,
            IconFileComponent] });
    SakaniMultipleUploadModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SakaniMultipleUploadModule, imports: [[
                i10.CommonModule,
                i1$2.FormsModule,
                i1$2.ReactiveFormsModule,
                i3.NgbPaginationModule,
                i3.NgbAlertModule,
            ]] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: SakaniMultipleUploadModule, decorators: [{
                type: i0.NgModule,
                args: [{
                        declarations: __spreadArray([SakaniUploadFilesComponent, SafePipe], __read(components)),
                        imports: [
                            i10.CommonModule,
                            i1$2.FormsModule,
                            i1$2.ReactiveFormsModule,
                            i3.NgbPaginationModule,
                            i3.NgbAlertModule,
                        ],
                        exports: __spreadArray([SakaniUploadFilesComponent], __read(components)),
                    }]
            }] });

    /*
     * Public API Surface of sakani-upload-files
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.IconErrorComponent = IconErrorComponent;
    exports.IconFileComponent = IconFileComponent;
    exports.IconLoadingComponent = IconLoadingComponent;
    exports.IconRemoveCircleComponent = IconRemoveCircleComponent;
    exports.IconResetComponent = IconResetComponent;
    exports.IconUploadPlusComponent = IconUploadPlusComponent;
    exports.SakaniMultipleUploadModule = SakaniMultipleUploadModule;
    exports.SakaniUploadFilesComponent = SakaniUploadFilesComponent;
    exports.SakaniUploadFilesService = SakaniUploadFilesService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=sakani-upload-files.umd.js.map
