import { LogLevel, StringUtils, Logger, UrlString, InteractionRequiredAuthError, OIDC_DEFAULT_SCOPES, ResponseMode, AuthToken, Constants } from '@azure/msal-common';
import express from 'express';
import { CryptoProvider, ConfidentialClientApplication } from '@azure/msal-node';
import { randomBytes, scryptSync, createCipheriv, createDecipheriv } from 'crypto';
import axios from 'axios';
import { DefaultAzureCredential } from '@azure/identity';
import { CertificateClient } from '@azure/keyvault-certificates';
import { SecretClient } from '@azure/keyvault-secrets';

function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function (method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure " + obj);
}

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
var AppStages;
(function (AppStages) {
  AppStages["SIGN_IN"] = "sign_in";
  AppStages["SIGN_OUT"] = "sign_out";
  AppStages["ACQUIRE_TOKEN"] = "acquire_token";
})(AppStages || (AppStages = {}));
/**
 * String constants related to AAD Authority
 */
var AADAuthorityConstants = {
  COMMON: "common",
  ORGANIZATIONS: "organizations",
  CONSUMERS: "consumers"
};
/**
 * String constants related credential type
 */
var KeyVaultCredentialTypes;
(function (KeyVaultCredentialTypes) {
  KeyVaultCredentialTypes["SECRET"] = "clientSecret";
  KeyVaultCredentialTypes["CERTIFICATE"] = "clientCertificate";
})(KeyVaultCredentialTypes || (KeyVaultCredentialTypes = {}));
var OIDC_SCOPES = ["openid", "profile", "email", "offline_access"];
/**
 * Request headers used by App Service authentication
 */
var AppServiceAuthenticationHeaders = {
  APP_SERVICE_AUTHENTICATION_HEADER: "X-MSAL-APP-SERVICE-AUTHENTICATION",
  APP_SERVICE_ACCESS_TOKEN_HEADER: "X-MS-TOKEN-AAD-ACCESS-TOKEN",
  APP_SERVICE_ID_TOKEN_HEADER: "X-MS-TOKEN-AAD-ID-TOKEN",
  APP_SERVICE_REFRESH_TOKEN_HEADER: "X-MS-TOKEN-AAD-REFRESH-TOKEN",
  APP_SERVICE_ACCESS_TOKEN_EXPIRES_HEADER: "X-MS-TOKEN-AAD-EXPIRES-ON",
  APP_SERVICE_USER_OID_HEADER: "X-MS-CLIENT-PRINCIPAL-ID",
  APP_SERVICE_USER_UPN_HEADER: "X-MS-CLIENT-PRINCIPAL-NAME",
  APP_SERVICE_IDP_X_HEADER: "X-MS-CLIENT-PRINCIPAL-IDP"
};
/**
 * Endpoints used by App Service authentication
 */
var AppServiceAuthenticationEndpoints = {
  ID_TOKEN_ENDPOINT: "/.auth/me",
  POST_LOGOUT_DEFAULT_ENDPOINT: "/.auth/logout/done",
  POST_LOGIN_DEFAULT_ENDPOINT: "/.auth/login/done",
  AAD_SIGN_IN_ENDPOINT: "/.auth/login/aad",
  AAD_SIGN_OUT_ENDPOINT: "/.auth/logout",
  TOKEN_REFRESH_ENDPOINT: "/.auth/refresh",
  AAD_REDIRECT_ENDPOINT: "/.auth/login/aad/callback"
};
/**
 * Query parameters used by App Service authentication endpoints
 */
var AppServiceAuthenticationQueryParameters = {
  POST_LOGIN_REDIRECT_QUERY_PARAM: "?post_login_redirect_url=",
  POST_LOGOUT_REDIRECT_QUERY_PARAM: "?post_logout_redirect_uri="
};
/**
 * Environment variables used by App Service authentication
 */
var AppServiceEnvironmentVariables = {
  WEBSITE_AUTH_ENABLED: "WEBSITE_AUTH_ENABLED",
  WEBSITE_AUTH_ALLOWED_AUDIENCES: "WEBSITE_AUTH_ALLOWED_AUDIENCES",
  WEBSITE_AUTH_DEFAULT_PROVIDER: "WEBSITE_AUTH_DEFAULT_PROVIDER",
  WEBSITE_AUTH_TOKEN_STORE: "WEBSITE_AUTH_TOKEN_STORE",
  WEBSITE_AUTH_LOGIN_PARAMS: "WEBSITE_AUTH_LOGIN_PARAMS",
  WEBSITE_AUTH_PRESERVE_URL_FRAGMENT: "WEBSITE_AUTH_PRESERVE_URL_FRAGMENT",
  WEBSITE_AUTH_OPENID_ISSUER: "WEBSITE_AUTH_OPENID_ISSUER",
  WEBSITE_AUTH_CLIENT_ID: "WEBSITE_AUTH_CLIENT_ID",
  WEBSITE_HOSTNAME: "WEBSITE_HOSTNAME",
  WEBSITE_SITE_NAME: "WEBSITE_SITE_NAME",
  WEBSITE_AUTH_REQUIRE_HTTPS: "WEBSITE_AUTH_REQUIRE_HTTPS",
  WEBSITE_AUTH_UNAUTHENTICATED_ACTION: "WEBSITE_AUTH_UNAUTHENTICATED_ACTION",
  WEBSITE_AUTH_API_PREFIX: "WEBSITE_AUTH_API_PREFIX",
  MICROSOFT_PROVIDER_AUTHENTICATION_SECRET: "MICROSOFT_PROVIDER_AUTHENTICATION_SECRET"
};
/**
 * Constants used in access control scenarios
 */
var AccessControlConstants = {
  GROUPS: "groups",
  ROLES: "roles",
  CLAIM_NAMES: "_claim_name",
  CLAIM_SOURCES: "_claim_sources",
  PAGINATION_LINK: "@odata.nextLink",
  GRAPH_MEMBERS_ENDPOINT: "https://graph.microsoft.com/v1.0/me/memberOf",
  GRAPH_MEMBER_SCOPES: "User.Read GroupMember.Read.All"
};
/**
 * Various error constants
 */
var ErrorMessages = {
  NOT_PERMITTED: "Not permitted",
  INVALID_TOKEN: "Invalid token",
  CANNOT_DETERMINE_APP_STAGE: "Cannot determine application stage",
  CANNOT_VALIDATE_TOKEN: "Cannot validate token",
  CSRF_TOKEN_MISMATCH: "CSRF token in response does not match to original request",
  INTERACTION_REQUIRED: "interaction_required",
  TOKEN_ACQUISITION_FAILED: "Token acquisition failed",
  TOKEN_RESPONSE_NULL: "Token response is null",
  AUTH_CODE_URL_NOT_OBTAINED: "Authorization code url cannot be obtained",
  TOKEN_NOT_FOUND: "No token found",
  TOKEN_NOT_DECODED: "Token cannot be decoded",
  TOKEN_NOT_VERIFIED: "Token cannot be verified",
  KEYS_NOT_OBTAINED: "Signing keys cannot be obtained",
  STATE_NOT_FOUND: "State not found",
  USER_HAS_NO_ROLE: "User does not have any roles",
  USER_NOT_IN_ROLE: "User does not have this role",
  USER_HAS_NO_GROUP: "User does not have any groups",
  USER_NOT_IN_GROUP: "User does not have this group",
  METHOD_NOT_ALLOWED: "Method not allowed for this route",
  RULE_NOT_FOUND: "No rule found for this route",
  SESSION_NOT_FOUND: "No session found for this request",
  KEY_VAULT_CONFIG_NOT_FOUND: "No coordinates found for Key Vault",
  CANNOT_OBTAIN_CREDENTIALS_FROM_KEY_VAULT: "Cannot obtain credentials from Key Vault",
  SESSION_KEY_NOT_FOUND: "No session key found in session. Cannot encrypt state data",
  AUTH_CODE_REQUEST_OBJECT_NOT_FOUND: "No auth code request object found in session",
  ID_TOKEN_CLAIMS_NOT_FOUND: "No id token claims found in session"
};
/**
 * Various configuration error constants
 */
var ConfigurationErrorMessages = {
  AUTH_ROUTES_NOT_CONFIGURED: "Authentication routes are not defined. Ensure that the application settings are configured properly.",
  NO_PROTECTED_RESOURCE_CONFIGURED: "No protected resource is configured to acquire a token for. Ensure that the application settings are configured properly.",
  NO_ACCESS_MATRIX_CONFIGURED: "No access matrix is configured to control access for. Ensure that the application settings are configured properly.",
  NO_CLIENT_ID: "No clientId provided!",
  INVALID_CLIENT_ID: "Invalid clientId!",
  NO_TENANT_INFO: "No tenant info provided!",
  INVALID_TENANT_INFO: "Invalid tenant info!",
  NO_CLIENT_CREDENTIAL: "No client credential provided!",
  NO_REDIRECT_URI: "No redirect URI provided!",
  NO_UNAUTHORIZED_ROUTE: "No unauthorized route provided!"
};
var DEFAULT_LOGGER_OPTIONS = {
  loggerCallback: function loggerCallback(logLevel, message, containsPii) {
    if (containsPii) {
      return;
    }
    // eslint-disable-next-line no-console
    console.info(message);
  },
  piiLoggingEnabled: false,
  logLevel: LogLevel.Info
};

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var AppType;
(function (AppType) {
  AppType[AppType["WebApp"] = 0] = "WebApp";
})(AppType || (AppType = {}));

var ConfigHelper = /*#__PURE__*/function () {
  function ConfigHelper() {}
  /**
   * Validates the fields in the configuration file
   * @param {AppSettings} appSettings: configuration object
   * @returns {void}
   */
  ConfigHelper.validateAppSettings = function validateAppSettings(appSettings, appType) {
    var _appSettings$authRout, _appSettings$authRout2;
    if (StringUtils.isEmpty(appSettings.appCredentials.clientId)) {
      throw new Error(ConfigurationErrorMessages.NO_CLIENT_ID);
    } else if (!ConfigHelper.isGuid(appSettings.appCredentials.clientId)) {
      throw new Error(ConfigurationErrorMessages.INVALID_CLIENT_ID);
    }
    if (StringUtils.isEmpty(appSettings.appCredentials.tenantId)) {
      throw new Error(ConfigurationErrorMessages.NO_TENANT_INFO);
    } else if (!ConfigHelper.isGuid(appSettings.appCredentials.tenantId) && !Object.values(AADAuthorityConstants).includes(appSettings.appCredentials.tenantId)) {
      throw new Error(ConfigurationErrorMessages.INVALID_TENANT_INFO);
    }
    switch (appType) {
      case AppType.WebApp:
        if (StringUtils.isEmpty((_appSettings$authRout = appSettings.authRoutes) == null ? void 0 : _appSettings$authRout.redirect)) {
          throw new Error(ConfigurationErrorMessages.NO_REDIRECT_URI);
        }
        if (StringUtils.isEmpty((_appSettings$authRout2 = appSettings.authRoutes) == null ? void 0 : _appSettings$authRout2.unauthorized)) {
          throw new Error(ConfigurationErrorMessages.NO_UNAUTHORIZED_ROUTE);
        }
        break;
    }
  }
  /**
   * Verifies if a string is GUID
   * @param {string} guid
   * @returns {boolean}
   */;
  ConfigHelper.isGuid = function isGuid(guid) {
    var regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regexGuid.test(guid);
  }
  /**
   * Util method to get the resource name for a given scope(s)
   * @param {Array} scopes: an array of scopes that the resource is associated with
   * @param {webAppSettings} webAppSettings: application authentication parameters
   * @returns {string}
   */;
  ConfigHelper.getResourceNameFromScopes = function getResourceNameFromScopes(scopes, webAppSettings) {
    var index = Object.values(_extends({}, webAppSettings.protectedResources)).findIndex(function (resource) {
      return JSON.stringify(resource.scopes.sort()) === JSON.stringify(scopes.sort());
    });
    var resourceName = Object.keys(_extends({}, webAppSettings.protectedResources))[index];
    return resourceName;
  }
  /**
   * Util method to get the scopes for a given resource name
   * @param {string} resourceEndpoint: the resource name
   * @param {webAppSettings} webAppSettings: application authentication parameters
   * @returns {string}
   */;
  ConfigHelper.getScopesFromResourceEndpoint = function getScopesFromResourceEndpoint(resourceEndpoint, webAppSettings) {
    var _Object$values$find;
    var scopes = (_Object$values$find = Object.values(_extends({}, webAppSettings.protectedResources)).find(function (resource) {
      return resource.endpoint === resourceEndpoint;
    })) == null ? void 0 : _Object$values$find.scopes;
    return scopes ? scopes : [];
  }
  /**
   * Util method to strip the default OIDC scopes from the scopes array
   * @param {Array} scopesList full list of scopes for this resource
   * @returns
   */;
  ConfigHelper.getEffectiveScopes = function getEffectiveScopes(scopesList) {
    var effectiveScopesList = scopesList.filter(function (scope) {
      return !OIDC_SCOPES.includes(scope);
    });
    return effectiveScopesList;
  };
  return ConfigHelper;
}();

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var BaseAuthClientBuilder = /*#__PURE__*/function () {
  function BaseAuthClientBuilder(appSettings, appType) {
    ConfigHelper.validateAppSettings(appSettings, appType);
    this.appSettings = appSettings;
  }
  var _proto = BaseAuthClientBuilder.prototype;
  _proto.withKeyVaultCredentials = function withKeyVaultCredentials(keyVaultCredential) {
    this.keyVaultCredential = keyVaultCredential;
    return this;
  };
  _proto.withCustomCachePlugin = function withCustomCachePlugin(cachePlugin) {
    this.customCachePlugin = cachePlugin;
    return this;
  };
  return BaseAuthClientBuilder;
}();

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var CryptoUtils = /*#__PURE__*/function () {
  function CryptoUtils(algorithm) {
    if (algorithm === void 0) {
      algorithm = "aes-192-cbc";
    }
    this.algorithm = algorithm;
  }
  var _proto = CryptoUtils.prototype;
  _proto.generateSalt = function generateSalt() {
    return randomBytes(20).toString("hex");
  };
  _proto.createKey = function createKey(password, salt) {
    return scryptSync(password, salt, 24);
  };
  _proto.encryptData = function encryptData(stringifiedData, key) {
    var iv = randomBytes(16);
    var cipher = createCipheriv(this.algorithm, key, iv);
    var encryptedData = cipher.update(stringifiedData, "utf8", "hex");
    return [iv.toString("hex"), encryptedData + cipher["final"]("hex")].join(".");
  };
  _proto.decryptData = function decryptData(encryptedData, key) {
    var _encryptedData$split = encryptedData.split("."),
      iv = _encryptedData$split[0],
      encrypted = _encryptedData$split[1];
    var decipher = createDecipheriv(this.algorithm, key, Buffer.from(iv, "hex"));
    return decipher.update(encrypted, "hex", "utf8") + decipher["final"]("utf8");
  };
  return CryptoUtils;
}();

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var packageName = "@azure-samples/microsoft-identity-express";
var packageVersion = "beta";

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var BaseAuthClient = /*#__PURE__*/function () {
  function BaseAuthClient(appSettings, msalConfig) {
    this.appSettings = appSettings;
    this.msalConfig = msalConfig;
    this.cryptoProvider = new CryptoProvider();
    this.cryptoUtils = new CryptoUtils();
    this.loggerOptions = this.msalConfig.system && this.msalConfig.system.loggerOptions ? this.msalConfig.system.loggerOptions : {
      loggerCallback: function loggerCallback() {
        // allow users to not set loggerCallback
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info
    };
    this.logger = new Logger(this.loggerOptions, packageName, packageVersion);
    this.msalClient = new ConfidentialClientApplication(this.msalConfig);
  }
  var _proto = BaseAuthClient.prototype;
  _proto.getMsalClient = function getMsalClient() {
    return this.msalClient;
  };
  _proto.getMsalConfig = function getMsalConfig() {
    return this.msalConfig;
  };
  _proto.getLogger = function getLogger() {
    return this.logger;
  };
  return BaseAuthClient;
}();

var FetchManager = function FetchManager() {};
/**
 * Calls a resource endpoint
 * @param {string} endpoint
 * @returns {Promise}
 */
FetchManager.callApiEndpoint = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(endpoint) {
    var response;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return axios.get(endpoint);
        case 3:
          response = _context.sent;
          return _context.abrupt("return", response.data);
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          throw _context.t0;
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Calls a resource endpoint with a raw access token
 * using the authorization bearer token scheme
 * @param {string} endpoint
 * @param {string} accessToken
 * @returns {Promise}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
FetchManager.callApiEndpointWithToken = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(endpoint, accessToken) {
    var options, response;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!StringUtils.isEmpty(accessToken)) {
            _context2.next = 2;
            break;
          }
          throw new Error(ErrorMessages.TOKEN_NOT_FOUND);
        case 2:
          options = {
            headers: {
              Authorization: "Bearer " + accessToken
            }
          };
          _context2.prev = 3;
          _context2.next = 6;
          return axios.get(endpoint, options);
        case 6:
          response = _context2.sent;
          return _context2.abrupt("return", response.data);
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](3);
          throw _context2.t0;
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 10]]);
  }));
  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Handles queries against Microsoft Graph that return multiple pages of data
 * @param {string} accessToken: access token required by endpoint
 * @param {string} nextPage: next page link
 * @param {Array} data: stores data from each page
 * @returns {Promise}
 */
FetchManager.handlePagination = /*#__PURE__*/function () {
  var _ref3 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(accessToken, nextPage, data) {
    var graphResponse;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (data === void 0) {
            data = [];
          }
          _context3.prev = 1;
          _context3.next = 4;
          return FetchManager.callApiEndpointWithToken(nextPage, accessToken);
        case 4:
          _context3.next = 6;
          return _context3.sent.data;
        case 6:
          graphResponse = _context3.sent;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
          graphResponse["value"].map(function (v) {
            return data.push(v.id);
          });
          if (!graphResponse[AccessControlConstants.PAGINATION_LINK]) {
            _context3.next = 14;
            break;
          }
          _context3.next = 11;
          return FetchManager.handlePagination(accessToken, graphResponse[AccessControlConstants.PAGINATION_LINK], data);
        case 11:
          return _context3.abrupt("return", _context3.sent);
        case 14:
          return _context3.abrupt("return", data);
        case 15:
          _context3.next = 20;
          break;
        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](1);
          throw _context3.t0;
        case 20:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 17]]);
  }));
  return function (_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var UrlUtils = function UrlUtils() {};
/**
 * Gets the absolute URL from a given request and path string
 * @param {Request} req: express request object
 * @param {string} url: a given URL
 * @returns {string}
 */
UrlUtils.ensureAbsoluteUrl = function (req, url) {
  var urlComponents = new UrlString(url).getUrlComponents();
  if (!urlComponents.Protocol) {
    if (!urlComponents.HostNameAndPort && !url.startsWith("www")) {
      if (!url.startsWith("/")) {
        return req.protocol + "://" + req.get("host") + "/" + url;
      }
      return req.protocol + "://" + req.get("host") + url;
    }
    return req.protocol + "://" + url;
  } else {
    return url;
  }
};
/**
 * Gets the path segment from a given URL
 * @param {string} url: a given URL
 * @returns {string}
 */
UrlUtils.getPathFromUrl = function (url) {
  var urlComponents = new UrlString(url).getUrlComponents();
  return "/" + urlComponents.PathSegments.join("/");
};

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Helper function used to determine if an error thrown by the server requires interaction to resolve
 * @param error
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
function IsAnInteractionRequiredAuthError(error) {
  return InteractionRequiredAuthError.isInteractionRequiredError(error == null ? void 0 : error.errorCode, error == null ? void 0 : error.errorMessage, error == null ? void 0 : error.subError);
}

/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in Express web apps
 */
var MsalWebAppAuthClient = /*#__PURE__*/function (_BaseAuthClient) {
  _inheritsLoose(MsalWebAppAuthClient, _BaseAuthClient);
  /**
   * @param {AppSettings} appSettings
   * @param {Configuration} msalConfig
   * @constructor
   */
  function MsalWebAppAuthClient(appSettings, msalConfig) {
    var _this;
    _this = _BaseAuthClient.call(this, appSettings, msalConfig) || this;
    _this.webAppSettings = appSettings;
    return _this;
  }
  /**
   * Initialize AuthProvider and set default routes and handlers
   * @returns {Router}
   */
  var _proto = MsalWebAppAuthClient.prototype;
  _proto.initialize = function initialize() {
    var _this2 = this;
    var appRouter = express.Router();
    appRouter.use(function (req, res, next) {
      if (!req.session) {
        _this2.logger.error(ErrorMessages.SESSION_NOT_FOUND);
        throw new Error(ErrorMessages.SESSION_NOT_FOUND);
      }
      next();
    });
    appRouter.post(UrlUtils.getPathFromUrl(this.webAppSettings.authRoutes.redirect), this.handleRedirect());
    if (this.webAppSettings.authRoutes.frontChannelLogout) {
      /**
       * Expose front-channel logout route. For more information, visit:
       * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#single-sign-out
       */
      appRouter.get(this.webAppSettings.authRoutes.frontChannelLogout, function (req, res) {
        req.session.destroy(function () {
          res.sendStatus(200);
        });
      });
    }
    return appRouter;
  }
  /**
   * Initiates sign in flow
   * @param {SignInOptions} options: options to modify login request
   * @returns {RequestHandler}
   */;
  _proto.signIn = function signIn(options) {
    var _this3 = this;
    if (options === void 0) {
      options = {
        postLoginRedirect: "/",
        failureRedirect: "/"
      };
    }
    return function (req, res, next) {
      var appState = {
        appStage: AppStages.SIGN_IN,
        redirectTo: options.postLoginRedirect,
        csrfToken: req.session.csrfToken
      };
      var authUrlParams = {
        scopes: OIDC_DEFAULT_SCOPES
      };
      var authCodeParams = {
        scopes: OIDC_DEFAULT_SCOPES
      };
      // get url to sign user in
      return _this3.redirectToAuthCodeUrl(req, res, next, authUrlParams, authCodeParams, appState);
    };
  }
  /**
   * Initiate sign out and destroy the session
   * @param {SignOutOptions} options: options to modify logout request
   * @returns {RequestHandler}
   */;
  _proto.signOut = function signOut(options) {
    var _this4 = this;
    if (options === void 0) {
      options = {
        postLogoutRedirect: "/"
      };
    }
    return /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var _req$session$account, _req$session$account2;
        var postLogoutRedirectUri, logoutUri, tokenCache, account;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              postLogoutRedirectUri = UrlUtils.ensureAbsoluteUrl(req, options.postLogoutRedirect);
              /**
               * Construct a logout URI and redirect the user to end the
               * session with Azure AD/B2C. For more information, visit:
               * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
               * (B2C) https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#send-a-sign-out-request
               */
              logoutUri = _this4.msalConfig.auth.authority + "/oauth2/v2.0/logout?post_logout_redirect_uri=" + postLogoutRedirectUri;
              tokenCache = _this4.msalClient.getTokenCache();
              _context.t1 = (_req$session$account = req.session.account) == null ? void 0 : _req$session$account.homeAccountId;
              if (!_context.t1) {
                _context.next = 8;
                break;
              }
              _context.next = 7;
              return tokenCache.getAccountByHomeId(req.session.account.homeAccountId);
            case 7:
              _context.t1 = _context.sent;
            case 8:
              _context.t0 = _context.t1;
              if (_context.t0) {
                _context.next = 16;
                break;
              }
              _context.t2 = (_req$session$account2 = req.session.account) == null ? void 0 : _req$session$account2.localAccountId;
              if (!_context.t2) {
                _context.next = 15;
                break;
              }
              _context.next = 14;
              return tokenCache.getAccountByLocalId(req.session.account.localAccountId);
            case 14:
              _context.t2 = _context.sent;
            case 15:
              _context.t0 = _context.t2;
            case 16:
              account = _context.t0;
              if (!account) {
                _context.next = 20;
                break;
              }
              _context.next = 20;
              return tokenCache.removeAccount(account);
            case 20:
              req.session.destroy(function () {
                res.redirect(logoutUri);
              });
            case 21:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();
  }
  /**
   * Middleware that handles redirect depending on request state
   * There are basically 2 stages: sign-in and acquire token
   * @returns {RequestHandler}
   */;
  _proto.handleRedirect = function handleRedirect() {
    var _this5 = this;
    return /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res, next) {
        var state, tokenResponse, resourceName, _req$session$protecte, _tokenResponse;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (req.session.key) {
                _context2.next = 3;
                break;
              }
              _this5.logger.error(ErrorMessages.SESSION_KEY_NOT_FOUND);
              return _context2.abrupt("return", next(new Error(ErrorMessages.SESSION_KEY_NOT_FOUND)));
            case 3:
              if (req.session.authorizationCodeRequest) {
                _context2.next = 6;
                break;
              }
              _this5.logger.error(ErrorMessages.AUTH_CODE_REQUEST_OBJECT_NOT_FOUND);
              return _context2.abrupt("return", next(new Error(ErrorMessages.AUTH_CODE_REQUEST_OBJECT_NOT_FOUND)));
            case 6:
              if (!req.body.state) {
                _context2.next = 51;
                break;
              }
              state = JSON.parse(_this5.cryptoUtils.decryptData(_this5.cryptoProvider.base64Decode(req.body.state), Buffer.from(req.session.key, "hex"))); // check if csrfToken matches
              if (!(state.csrfToken === req.session.csrfToken)) {
                _context2.next = 48;
                break;
              }
              _context2.t0 = state.appStage;
              _context2.next = _context2.t0 === AppStages.SIGN_IN ? 12 : _context2.t0 === AppStages.ACQUIRE_TOKEN ? 28 : 44;
              break;
            case 12:
              // token request should have auth code
              req.session.authorizationCodeRequest.code = req.body.code;
              _context2.prev = 13;
              _context2.next = 16;
              return _this5.msalClient.acquireTokenByCode(req.session.authorizationCodeRequest);
            case 16:
              tokenResponse = _context2.sent;
              if (tokenResponse) {
                _context2.next = 19;
                break;
              }
              return _context2.abrupt("return", res.redirect(_this5.webAppSettings.authRoutes.unauthorized));
            case 19:
              req.session.isAuthenticated = true;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              req.session.account = tokenResponse.account; // this won't be null in any web app scenario
              res.redirect(state.redirectTo);
              _context2.next = 27;
              break;
            case 24:
              _context2.prev = 24;
              _context2.t1 = _context2["catch"](13);
              next(_context2.t1);
            case 27:
              return _context2.abrupt("break", 46);
            case 28:
              // get the name of the resource associated with scope
              resourceName = ConfigHelper.getResourceNameFromScopes(req.session.authorizationCodeRequest.scopes, _this5.webAppSettings);
              req.session.authorizationCodeRequest.code = req.body.code;
              _context2.prev = 30;
              _context2.next = 33;
              return _this5.msalClient.acquireTokenByCode(req.session.authorizationCodeRequest);
            case 33:
              _tokenResponse = _context2.sent;
              if (_tokenResponse) {
                _context2.next = 36;
                break;
              }
              return _context2.abrupt("return", res.redirect(_this5.webAppSettings.authRoutes.unauthorized));
            case 36:
              req.session.protectedResources = (_req$session$protecte = {}, _req$session$protecte[resourceName] = {
                accessToken: _tokenResponse.accessToken
              }, _req$session$protecte);
              res.redirect(state.redirectTo);
              _context2.next = 43;
              break;
            case 40:
              _context2.prev = 40;
              _context2.t2 = _context2["catch"](30);
              next(_context2.t2);
            case 43:
              return _context2.abrupt("break", 46);
            case 44:
              next(new Error(ErrorMessages.CANNOT_DETERMINE_APP_STAGE));
              return _context2.abrupt("break", 46);
            case 46:
              _context2.next = 49;
              break;
            case 48:
              res.redirect(_this5.webAppSettings.authRoutes.unauthorized);
            case 49:
              _context2.next = 52;
              break;
            case 51:
              res.redirect(_this5.webAppSettings.authRoutes.unauthorized);
            case 52:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[13, 24], [30, 40]]);
      }));
      return function (_x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      };
    }();
  }
  /**
   * Middleware that gets tokens via acquireToken*
   * @param {TokenRequestOptions} options: options to modify this middleware
   * @returns {RequestHandler}
   */;
  _proto.getToken = function getToken(options) {
    var _this6 = this;
    return /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res, next) {
        var _req$session$protecte2;
        var scopes, resourceName, silentRequest, tokenResponse, appState, authUrlParams, authCodeParams;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (_this6.webAppSettings.protectedResources) {
                _context3.next = 3;
                break;
              }
              _this6.logger.error(ConfigurationErrorMessages.NO_PROTECTED_RESOURCE_CONFIGURED);
              return _context3.abrupt("return", next(new Error(ConfigurationErrorMessages.NO_PROTECTED_RESOURCE_CONFIGURED)));
            case 3:
              // get scopes for token request
              scopes = options.resource.scopes;
              resourceName = ConfigHelper.getResourceNameFromScopes(scopes, _this6.webAppSettings);
              req.session.protectedResources = (_req$session$protecte2 = {}, _req$session$protecte2[resourceName] = _extends({}, _this6.webAppSettings.protectedResources[resourceName], {
                accessToken: undefined
              }), _req$session$protecte2);
              _context3.prev = 6;
              silentRequest = {
                account: req.session.account,
                scopes: scopes
              }; // acquire token silently to be used in resource call
              _context3.next = 10;
              return _this6.msalClient.acquireTokenSilent(silentRequest);
            case 10:
              tokenResponse = _context3.sent;
              if (!(!tokenResponse || StringUtils.isEmpty(tokenResponse.accessToken))) {
                _context3.next = 13;
                break;
              }
              throw new InteractionRequiredAuthError(ErrorMessages.INTERACTION_REQUIRED);
            case 13:
              req.session.protectedResources[resourceName].accessToken = tokenResponse.accessToken;
              next();
              _context3.next = 27;
              break;
            case 17:
              _context3.prev = 17;
              _context3.t0 = _context3["catch"](6);
              if (!(_context3.t0 instanceof InteractionRequiredAuthError || IsAnInteractionRequiredAuthError(_context3.t0))) {
                _context3.next = 26;
                break;
              }
              appState = {
                appStage: AppStages.ACQUIRE_TOKEN,
                redirectTo: req.originalUrl
              };
              authUrlParams = {
                scopes: scopes
              };
              authCodeParams = {
                scopes: scopes
              }; // initiate the first leg of auth code grant to get token
              return _context3.abrupt("return", _this6.redirectToAuthCodeUrl(req, res, next, authUrlParams, authCodeParams, appState));
            case 26:
              next(_context3.t0);
            case 27:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[6, 17]]);
      }));
      return function (_x6, _x7, _x8) {
        return _ref3.apply(this, arguments);
      };
    }();
  }
  /**
   * Check if authenticated in session
   * @returns {RequestHandler}
   */;
  _proto.isAuthenticated = function isAuthenticated() {
    var _this7 = this;
    return function (req, res, next) {
      if (!req.session.isAuthenticated) {
        return res.redirect(_this7.webAppSettings.authRoutes.unauthorized);
      }
      next();
    };
  }
  /**
   * Checks if the user has access for this route, defined in access matrix
   * @param {GuardOptions} options: options to modify this middleware
   * @returns {RequestHandler}
   */;
  _proto.hasAccess = function hasAccess(options) {
    var _this8 = this;
    return /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res, next) {
        var _req$session$account3;
        var checkFor, groups, roles;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (_this8.webAppSettings.accessMatrix) {
                _context4.next = 3;
                break;
              }
              _this8.logger.error(ConfigurationErrorMessages.NO_ACCESS_MATRIX_CONFIGURED);
              return _context4.abrupt("return", next(new Error(ConfigurationErrorMessages.NO_ACCESS_MATRIX_CONFIGURED)));
            case 3:
              if ((_req$session$account3 = req.session.account) != null && _req$session$account3.idTokenClaims) {
                _context4.next = 6;
                break;
              }
              _this8.logger.error(ErrorMessages.ID_TOKEN_CLAIMS_NOT_FOUND);
              return _context4.abrupt("return", next(new Error(ErrorMessages.ID_TOKEN_CLAIMS_NOT_FOUND)));
            case 6:
              checkFor = options.accessRule.hasOwnProperty(AccessControlConstants.GROUPS) ? AccessControlConstants.GROUPS : AccessControlConstants.ROLES;
              _context4.t0 = checkFor;
              _context4.next = _context4.t0 === AccessControlConstants.GROUPS ? 10 : _context4.t0 === AccessControlConstants.ROLES ? 25 : 34;
              break;
            case 10:
              if (req.session.account.idTokenClaims[AccessControlConstants.GROUPS]) {
                _context4.next = 20;
                break;
              }
              if (!(req.session.account.idTokenClaims[AccessControlConstants.CLAIM_NAMES] || req.session.account.idTokenClaims[AccessControlConstants.CLAIM_SOURCES])) {
                _context4.next = 17;
                break;
              }
              _context4.next = 14;
              return _this8.handleOverage(req, res, next, options.accessRule);
            case 14:
              return _context4.abrupt("return", _context4.sent);
            case 17:
              return _context4.abrupt("return", res.redirect(_this8.webAppSettings.authRoutes.unauthorized));
            case 18:
              _context4.next = 23;
              break;
            case 20:
              groups = req.session.account.idTokenClaims[AccessControlConstants.GROUPS];
              if (_this8.checkAccessRule(req.method, options.accessRule, groups, AccessControlConstants.GROUPS)) {
                _context4.next = 23;
                break;
              }
              return _context4.abrupt("return", res.redirect(_this8.webAppSettings.authRoutes.unauthorized));
            case 23:
              next();
              return _context4.abrupt("break", 35);
            case 25:
              if (req.session.account.idTokenClaims[AccessControlConstants.ROLES]) {
                _context4.next = 29;
                break;
              }
              return _context4.abrupt("return", res.redirect(_this8.webAppSettings.authRoutes.unauthorized));
            case 29:
              roles = req.session.account.idTokenClaims[AccessControlConstants.ROLES];
              if (_this8.checkAccessRule(req.method, options.accessRule, roles, AccessControlConstants.ROLES)) {
                _context4.next = 32;
                break;
              }
              return _context4.abrupt("return", res.redirect(_this8.webAppSettings.authRoutes.unauthorized));
            case 32:
              next();
              return _context4.abrupt("break", 35);
            case 34:
              return _context4.abrupt("break", 35);
            case 35:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      return function (_x9, _x10, _x11) {
        return _ref4.apply(this, arguments);
      };
    }();
  }
  // ============== UTILS ===============
  /**
   * This method is used to generate an auth code url request
   * @param {Request} req: express request object
   * @param {Response} res: express response object
   * @param {NextFunction} next: express next function
   * @param {AuthCodeParams} params: modifies auth code url request
   * @returns {Promise}
   */;
  _proto.redirectToAuthCodeUrl =
  /*#__PURE__*/
  function () {
    var _redirectToAuthCodeUrl = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res, next, authUrlParams, authCodeParams, appState) {
      var key, state, response;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            // add session csrfToken for crsf
            req.session.csrfToken = this.cryptoProvider.createNewGuid();
            key = this.cryptoUtils.createKey(req.session.csrfToken, this.cryptoUtils.generateSalt());
            req.session.key = key.toString("hex");
            state = JSON.stringify(_extends({}, appState, {
              csrfToken: req.session.csrfToken
            })); // prepare the request
            req.session.authorizationUrlRequest = _extends({}, authUrlParams, {
              state: this.cryptoProvider.base64Encode(this.cryptoUtils.encryptData(state, key)),
              redirectUri: UrlUtils.ensureAbsoluteUrl(req, this.webAppSettings.authRoutes.redirect),
              responseMode: ResponseMode.FORM_POST
            });
            req.session.authorizationCodeRequest = _extends({}, authCodeParams, {
              redirectUri: UrlUtils.ensureAbsoluteUrl(req, this.webAppSettings.authRoutes.redirect),
              code: ""
            });
            // request an authorization code to exchange for tokens
            _context5.prev = 6;
            _context5.next = 9;
            return this.msalClient.getAuthCodeUrl(req.session.authorizationUrlRequest);
          case 9:
            response = _context5.sent;
            res.redirect(response);
            _context5.next = 16;
            break;
          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](6);
            next(_context5.t0);
          case 16:
          case "end":
            return _context5.stop();
        }
      }, _callee5, this, [[6, 13]]);
    }));
    function redirectToAuthCodeUrl(_x12, _x13, _x14, _x15, _x16, _x17) {
      return _redirectToAuthCodeUrl.apply(this, arguments);
    }
    return redirectToAuthCodeUrl;
  }()
  /**
   * Handles group overage claims by querying MS Graph /memberOf endpoint
   * @param {Request} req: express request object
   * @param {Response} res: express response object
   * @param {NextFunction} next: express next function
   * @param {AccessRule} rule: a given access rule
   * @returns {Promise}
   */
  ;
  _proto.handleOverage =
  /*#__PURE__*/
  function () {
    var _handleOverage = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res, next, rule) {
      var _req$session$account4;
      var newIdTokenClaims, silentRequest, tokenResponse, graphResponse, userGroups;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            if ((_req$session$account4 = req.session.account) != null && _req$session$account4.idTokenClaims) {
              _context6.next = 3;
              break;
            }
            this.logger.error(ErrorMessages.ID_TOKEN_CLAIMS_NOT_FOUND);
            return _context6.abrupt("return", next(new Error(ErrorMessages.ID_TOKEN_CLAIMS_NOT_FOUND)));
          case 3:
            newIdTokenClaims = _extends({}, (_objectDestructuringEmpty(req.session.account.idTokenClaims), req.session.account.idTokenClaims));
            silentRequest = {
              account: req.session.account,
              scopes: AccessControlConstants.GRAPH_MEMBER_SCOPES.split(" ")
            };
            _context6.prev = 5;
            _context6.next = 8;
            return this.msalClient.acquireTokenSilent(silentRequest);
          case 8:
            tokenResponse = _context6.sent;
            if (tokenResponse) {
              _context6.next = 11;
              break;
            }
            return _context6.abrupt("return", res.redirect(this.webAppSettings.authRoutes.unauthorized));
          case 11:
            _context6.prev = 11;
            _context6.next = 14;
            return FetchManager.callApiEndpointWithToken(AccessControlConstants.GRAPH_MEMBERS_ENDPOINT, tokenResponse.accessToken);
          case 14:
            graphResponse = _context6.sent;
            if (!graphResponse.data[AccessControlConstants.PAGINATION_LINK]) {
              _context6.next = 33;
              break;
            }
            _context6.prev = 16;
            _context6.next = 19;
            return FetchManager.handlePagination(tokenResponse.accessToken, graphResponse.data[AccessControlConstants.PAGINATION_LINK]);
          case 19:
            userGroups = _context6.sent;
            req.session.account.idTokenClaims = _extends({}, newIdTokenClaims, {
              groups: userGroups
            });
            if (this.checkAccessRule(req.method, rule, req.session.account.idTokenClaims[AccessControlConstants.GROUPS], AccessControlConstants.GROUPS)) {
              _context6.next = 25;
              break;
            }
            return _context6.abrupt("return", res.redirect(this.webAppSettings.authRoutes.unauthorized));
          case 25:
            return _context6.abrupt("return", next());
          case 26:
            _context6.next = 31;
            break;
          case 28:
            _context6.prev = 28;
            _context6.t0 = _context6["catch"](16);
            next(_context6.t0);
          case 31:
            _context6.next = 39;
            break;
          case 33:
            req.session.account.idTokenClaims = _extends({}, newIdTokenClaims, {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              groups: graphResponse.data["value"].map(function (v) {
                return v.id;
              })
            });
            if (this.checkAccessRule(req.method, rule, req.session.account.idTokenClaims[AccessControlConstants.GROUPS], AccessControlConstants.GROUPS)) {
              _context6.next = 38;
              break;
            }
            return _context6.abrupt("return", res.redirect(this.webAppSettings.authRoutes.unauthorized));
          case 38:
            return _context6.abrupt("return", next());
          case 39:
            _context6.next = 44;
            break;
          case 41:
            _context6.prev = 41;
            _context6.t1 = _context6["catch"](11);
            next(_context6.t1);
          case 44:
            _context6.next = 49;
            break;
          case 46:
            _context6.prev = 46;
            _context6.t2 = _context6["catch"](5);
            // TODO: handle silent token acquisition error
            next(_context6.t2);
          case 49:
          case "end":
            return _context6.stop();
        }
      }, _callee6, this, [[5, 46], [11, 41], [16, 28]]);
    }));
    function handleOverage(_x18, _x19, _x20, _x21) {
      return _handleOverage.apply(this, arguments);
    }
    return handleOverage;
  }()
  /**
   * Checks if the request passes a given access rule
   * @param {string} method: HTTP method for this route
   * @param {AccessRule} rule: access rule for this route
   * @param {Array} creds: user's credentials i.e. roles or groups
   * @param {string} credType: roles or groups
   * @returns {boolean}
   */
  ;
  _proto.checkAccessRule = function checkAccessRule(method, rule, creds, credType) {
    if (rule.methods.includes(method)) {
      switch (credType) {
        case AccessControlConstants.GROUPS:
          if (!rule.groups || rule.groups.filter(function (elem) {
            return creds.includes(elem);
          }).length < 1) {
            return false;
          }
          break;
        case AccessControlConstants.ROLES:
          if (!rule.roles || rule.roles.filter(function (elem) {
            return creds.includes(elem);
          }).length < 1) {
            return false;
          }
          break;
      }
    } else {
      return false;
    }
    return true;
  };
  return MsalWebAppAuthClient;
}(BaseAuthClient);

var AppServiceWebAppAuthClient = /*#__PURE__*/function (_BaseAuthClient) {
  _inheritsLoose(AppServiceWebAppAuthClient, _BaseAuthClient);
  /**
   * @param {AppSettings} appSettings
   * @param {Configuration} msalConfig
   * @constructor
   */
  function AppServiceWebAppAuthClient(appSettings, msalConfig) {
    var _this;
    _this = _BaseAuthClient.call(this, appSettings, msalConfig) || this;
    _this.webAppSettings = appSettings;
    return _this;
  }
  /**
   * Initialize AuthProvider and set default routes and handlers
   * @param {InitializationOptions} options
   * @returns {Router}
   */
  var _proto = AppServiceWebAppAuthClient.prototype;
  _proto.initialize = function initialize() {
    var _this2 = this;
    var appRouter = express.Router();
    // handle redirect
    appRouter.get(UrlUtils.getPathFromUrl(this.webAppSettings.authRoutes.redirect), this.handleRedirect());
    appRouter.post(UrlUtils.getPathFromUrl(this.webAppSettings.authRoutes.redirect), this.handleRedirect());
    appRouter.use(function (req, res, next) {
      if (!req.session) {
        _this2.logger.error(ErrorMessages.SESSION_NOT_FOUND);
        throw new Error(ErrorMessages.SESSION_NOT_FOUND);
      }
      if (!req.session.isAuthenticated) {
        // check headers for id token
        var rawIdToken = req.headers[AppServiceAuthenticationHeaders.APP_SERVICE_ID_TOKEN_HEADER.toLowerCase()];
        if (rawIdToken) {
          var _idTokenClaims$iss;
          // parse the id token
          var idTokenClaims = AuthToken.extractTokenClaims(rawIdToken, _this2.cryptoProvider);
          req.session.isAuthenticated = true;
          req.session.account = {
            tenantId: idTokenClaims.tid,
            homeAccountId: idTokenClaims.oid + "." + idTokenClaims.tid,
            localAccountId: idTokenClaims.oid,
            environment: (_idTokenClaims$iss = idTokenClaims.iss) == null ? void 0 : _idTokenClaims$iss.split("://")[1].split("/")[0],
            username: idTokenClaims.preferred_username,
            name: idTokenClaims.name,
            idTokenClaims: idTokenClaims
          };
        }
      }
      next();
    });
    return appRouter;
  }
  /**
   * Initiates sign in flow
   * @param {SignInOptions} options: options to modify login request
   * @returns {RequestHandler}
   */;
  _proto.signIn = function signIn(options) {
    if (options === void 0) {
      options = {
        postLoginRedirect: "/",
        failureRedirect: "/"
      };
    }
    return function (req, res) {
      var postLoginRedirectUri = UrlUtils.ensureAbsoluteUrl(req, options.postLoginRedirect);
      var loginUri = "https://" + process.env[AppServiceEnvironmentVariables.WEBSITE_HOSTNAME] + AppServiceAuthenticationEndpoints.AAD_SIGN_IN_ENDPOINT + AppServiceAuthenticationQueryParameters.POST_LOGIN_REDIRECT_QUERY_PARAM + postLoginRedirectUri;
      res.redirect(loginUri);
    };
  }
  /**
   * Initiate sign out and destroy the session
   * @param {SignOutOptions} options: options to modify logout request
   * @returns {RequestHandler}
   */;
  _proto.signOut = function signOut(options) {
    if (options === void 0) {
      options = {
        postLogoutRedirect: "/"
      };
    }
    return function (req, res) {
      var postLogoutRedirectUri = UrlUtils.ensureAbsoluteUrl(req, options.postLogoutRedirect);
      var logoutUri = "https://" + process.env[AppServiceEnvironmentVariables.WEBSITE_HOSTNAME] + AppServiceAuthenticationEndpoints.AAD_SIGN_OUT_ENDPOINT + AppServiceAuthenticationQueryParameters.POST_LOGOUT_REDIRECT_QUERY_PARAM + postLogoutRedirectUri;
      req.session.destroy(function () {
        res.redirect(logoutUri);
      });
    };
  }
  /**
   * Middleware that handles redirect depending on request state
   * There are basically 2 stages: sign-in and acquire token
   * @returns {RequestHandler}
   */;
  _proto.handleRedirect = function handleRedirect() {
    return function (req, res, next) {
      next();
    };
  }
  /**
   * Middleware that gets tokens
   * @param {TokenRequestOptions} options: options to modify this middleware
   * @returns {RequestHandler}
   */;
  _proto.getToken = function getToken(options) {
    var _this3 = this;
    return /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res, next) {
        var _req$session$protecte;
        var resourceName, rawAccessToken, accessTokenClaims, scopes, effectiveScopes;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (_this3.webAppSettings.protectedResources) {
                _context.next = 3;
                break;
              }
              _this3.logger.error(ConfigurationErrorMessages.NO_PROTECTED_RESOURCE_CONFIGURED);
              return _context.abrupt("return", next(new Error(ConfigurationErrorMessages.NO_PROTECTED_RESOURCE_CONFIGURED)));
            case 3:
              // get scopes for token request
              resourceName = ConfigHelper.getResourceNameFromScopes(options.resource.scopes, _this3.webAppSettings);
              req.session.protectedResources = (_req$session$protecte = {}, _req$session$protecte[resourceName] = _extends({}, _this3.webAppSettings.protectedResources[resourceName], {
                accessToken: undefined
              }), _req$session$protecte);
              rawAccessToken = req.headers[AppServiceAuthenticationHeaders.APP_SERVICE_ACCESS_TOKEN_HEADER.toLowerCase()];
              if (!rawAccessToken) {
                _context.next = 16;
                break;
              }
              accessTokenClaims = AuthToken.extractTokenClaims(rawAccessToken, _this3.cryptoProvider); // get the name of the resource associated with scope
              scopes = accessTokenClaims == null ? void 0 : accessTokenClaims.scp.split(" ");
              effectiveScopes = ConfigHelper.getEffectiveScopes(scopes);
              if (!options.resource.scopes.every(function (elem) {
                return effectiveScopes.includes(elem);
              })) {
                _context.next = 15;
                break;
              }
              req.session.protectedResources[resourceName].accessToken = rawAccessToken;
              return _context.abrupt("return", next());
            case 15:
              return _context.abrupt("return", next(new Error("No tokens found for given scopes")));
            case 16:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }();
  }
  /**
   * Check if authenticated in session
   * @returns {RequestHandler}
   */;
  _proto.isAuthenticated = function isAuthenticated() {
    var _this4 = this;
    return function (req, res, next) {
      if (!req.session.isAuthenticated) {
        return res.redirect(_this4.webAppSettings.authRoutes.unauthorized);
      }
      next();
    };
  };
  return AppServiceWebAppAuthClient;
}(BaseAuthClient);

var KeyVaultManager = /*#__PURE__*/function () {
  function KeyVaultManager() {}
  var _proto = KeyVaultManager.prototype;
  /**
   * Fetches credentials from Key Vault and updates appSettings
   * @param {AppSettings} appSettings
   * @returns {Promise}
   */
  _proto.getCredentialFromKeyVault =
  /*#__PURE__*/
  function () {
    var _getCredentialFromKeyVault = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(keyVaultCredential) {
      var credential, response, secretResponse, _certificateResponse$, _certificateResponse$2, _secretResponse$value, certificateResponse, _secretResponse;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            credential = new DefaultAzureCredential();
            response = {};
            _context.t0 = keyVaultCredential.credentialType;
            _context.next = _context.t0 === KeyVaultCredentialTypes.SECRET ? 5 : _context.t0 === KeyVaultCredentialTypes.CERTIFICATE ? 16 : 30;
            break;
          case 5:
            _context.prev = 5;
            _context.next = 8;
            return this.getSecretCredential(keyVaultCredential, credential);
          case 8:
            secretResponse = _context.sent;
            response = {
              type: KeyVaultCredentialTypes.SECRET,
              value: secretResponse.value
            };
            _context.next = 15;
            break;
          case 12:
            _context.prev = 12;
            _context.t1 = _context["catch"](5);
            throw _context.t1;
          case 15:
            return _context.abrupt("break", 31);
          case 16:
            _context.prev = 16;
            _context.next = 19;
            return this.getCertificateCredential(keyVaultCredential, credential);
          case 19:
            certificateResponse = _context.sent;
            _context.next = 22;
            return this.getSecretCredential(keyVaultCredential, credential);
          case 22:
            _secretResponse = _context.sent;
            response = {
              type: KeyVaultCredentialTypes.CERTIFICATE,
              value: {
                thumbprint: certificateResponse == null ? void 0 : (_certificateResponse$ = certificateResponse.properties) == null ? void 0 : (_certificateResponse$2 = _certificateResponse$.x509Thumbprint) == null ? void 0 : _certificateResponse$2.toString(),
                privateKey: _secretResponse == null ? void 0 : (_secretResponse$value = _secretResponse.value) == null ? void 0 : _secretResponse$value.split("-----BEGIN CERTIFICATE-----\n")[0]
              }
            };
            _context.next = 29;
            break;
          case 26:
            _context.prev = 26;
            _context.t2 = _context["catch"](16);
            throw _context.t2;
          case 29:
            return _context.abrupt("break", 31);
          case 30:
            return _context.abrupt("break", 31);
          case 31:
            return _context.abrupt("return", response);
          case 32:
          case "end":
            return _context.stop();
        }
      }, _callee, this, [[5, 12], [16, 26]]);
    }));
    function getCredentialFromKeyVault(_x) {
      return _getCredentialFromKeyVault.apply(this, arguments);
    }
    return getCredentialFromKeyVault;
  }()
  /**
   * Gets a certificate credential from Key Vault
   * @param {AppSettings} config
   * @param {DefaultAzureCredential} credential
   * @returns {Promise}
   */
  ;
  _proto.getCertificateCredential =
  /*#__PURE__*/
  function () {
    var _getCertificateCredential = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(keyVaultCredential, credential) {
      var secretClient, keyVaultCertificate;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            // Initialize secretClient with credentials
            secretClient = new CertificateClient(keyVaultCredential.keyVaultUrl, credential);
            _context2.prev = 1;
            _context2.next = 4;
            return secretClient.getCertificate(keyVaultCredential.credentialName);
          case 4:
            keyVaultCertificate = _context2.sent;
            return _context2.abrupt("return", keyVaultCertificate);
          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);
            throw _context2.t0;
          case 11:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 8]]);
    }));
    function getCertificateCredential(_x2, _x3) {
      return _getCertificateCredential.apply(this, arguments);
    }
    return getCertificateCredential;
  }()
  /**
   * Gets a secret credential from Key Vault
   * @param {AppSettings} config
   * @param {DefaultAzureCredential} credential
   * @returns {Promise}
   */
  ;
  _proto.getSecretCredential =
  /*#__PURE__*/
  function () {
    var _getSecretCredential = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(keyVaultCredential, credential) {
      var secretClient, keyVaultSecret;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            // Initialize secretClient with credentials
            secretClient = new SecretClient(keyVaultCredential.keyVaultUrl, credential);
            _context3.prev = 1;
            _context3.next = 4;
            return secretClient.getSecret(keyVaultCredential.credentialName);
          case 4:
            keyVaultSecret = _context3.sent;
            return _context3.abrupt("return", keyVaultSecret);
          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](1);
            throw _context3.t0;
          case 11:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[1, 8]]);
    }));
    function getSecretCredential(_x4, _x5) {
      return _getSecretCredential.apply(this, arguments);
    }
    return getSecretCredential;
  }();
  return KeyVaultManager;
}();

var MsalConfiguration = /*#__PURE__*/function () {
  function MsalConfiguration() {}
  /**
   * Maps the custom configuration object to configuration
   * object expected by MSAL Node ConfidentialClientApplication class
   * @param {AppSettings} appSettings: configuration object
   * @param {ICachePlugin} cachePlugin: custom cache plugin
   * @param {IDistributedPersistence} distributedPersistence: distributed persistence client
   * @returns {Configuration}
   */
  MsalConfiguration.getMsalConfiguration = function getMsalConfiguration(appSettings) {
    return {
      auth: _extends({
        clientId: appSettings.appCredentials.clientId,
        authority: appSettings.b2cPolicies ? Object.entries(appSettings.b2cPolicies)[0][1]["authority"] // the first policy/user-flow is the default authority
        : appSettings.appCredentials.instance ? "https://" + appSettings.appCredentials.instance + "/" + appSettings.appCredentials.tenantId : "https://" + Constants.DEFAULT_AUTHORITY_HOST + "/" + appSettings.appCredentials.tenantId
      }, appSettings.appCredentials.hasOwnProperty("clientSecret") && {
        clientSecret: appSettings.appCredentials.clientSecret
      }, appSettings.appCredentials.hasOwnProperty("clientCertificate") && {
        clientCertificate: appSettings.appCredentials.clientCertificate
      }, {
        knownAuthorities: appSettings.b2cPolicies ? [UrlString.getDomainFromUrl(Object.entries(appSettings.b2cPolicies)[0][1]["authority"])] // in B2C scenarios
        : []
      }),
      system: {
        loggerOptions: appSettings.loggerOptions ? appSettings.loggerOptions : DEFAULT_LOGGER_OPTIONS
      }
    };
  };
  return MsalConfiguration;
}();

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var EnvironmentUtils = /*#__PURE__*/function () {
  function EnvironmentUtils() {}
  EnvironmentUtils.isProduction = function isProduction() {
    return process.env.NODE_ENV === "production";
  };
  EnvironmentUtils.isDevelopment = function isDevelopment() {
    return process.env.NODE_ENV === "development";
  };
  EnvironmentUtils.isAppServiceAuthEnabled = function isAppServiceAuthEnabled() {
    return process.env[AppServiceEnvironmentVariables.WEBSITE_AUTH_ENABLED] === "True";
  };
  return EnvironmentUtils;
}();

var WebAppAuthClientBuilder = /*#__PURE__*/function (_BaseAuthClientBuilde) {
  _inheritsLoose(WebAppAuthClientBuilder, _BaseAuthClientBuilde);
  function WebAppAuthClientBuilder(appSettings) {
    return _BaseAuthClientBuilde.call(this, appSettings, AppType.WebApp) || this;
  }
  var _proto = WebAppAuthClientBuilder.prototype;
  _proto.build = function build() {
    // TODO: throw error if key vault credential is being built
    this.msalConfig = MsalConfiguration.getMsalConfiguration(this.appSettings);
    if (EnvironmentUtils.isAppServiceAuthEnabled()) {
      return new AppServiceWebAppAuthClient(this.appSettings, this.msalConfig);
    } else {
      return new MsalWebAppAuthClient(this.appSettings, this.msalConfig);
    }
  };
  _proto.buildAsync = /*#__PURE__*/function () {
    var _buildAsync = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var keyVaultManager, credential;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            if (!this.keyVaultCredential) {
              _context.next = 7;
              break;
            }
            keyVaultManager = new KeyVaultManager();
            _context.next = 5;
            return keyVaultManager.getCredentialFromKeyVault(this.keyVaultCredential);
          case 5:
            credential = _context.sent;
            this.appSettings.appCredentials[credential.type] = credential.value;
          case 7:
            this.msalConfig = MsalConfiguration.getMsalConfiguration(this.appSettings);
            if (!EnvironmentUtils.isAppServiceAuthEnabled()) {
              _context.next = 12;
              break;
            }
            return _context.abrupt("return", new AppServiceWebAppAuthClient(this.appSettings, this.msalConfig));
          case 12:
            return _context.abrupt("return", new MsalWebAppAuthClient(this.appSettings, this.msalConfig));
          case 13:
            _context.next = 18;
            break;
          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            throw new Error(ErrorMessages.CANNOT_OBTAIN_CREDENTIALS_FROM_KEY_VAULT);
          case 18:
          case "end":
            return _context.stop();
        }
      }, _callee, this, [[0, 15]]);
    }));
    function buildAsync() {
      return _buildAsync.apply(this, arguments);
    }
    return buildAsync;
  }();
  return WebAppAuthClientBuilder;
}(BaseAuthClientBuilder);

export { AppServiceWebAppAuthClient, ConfigHelper, FetchManager, KeyVaultManager, MsalConfiguration, MsalWebAppAuthClient, WebAppAuthClientBuilder, packageVersion };
//# sourceMappingURL=microsoft-identity-express.esm.js.map
