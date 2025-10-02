import 'reflect-metadata';
import 'express';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/rest.ts
var rest_exports = {};
__export(rest_exports, {
  Controller: () => Controller,
  Delete: () => Delete,
  Get: () => Get,
  Middleware: () => Middleware,
  Patch: () => Patch,
  Post: () => Post,
  Put: () => Put
});
function Controller(baseRoute = "") {
  return function(target) {
    Reflect.defineMetadata("baseRoute", baseRoute, target);
  };
}
__name(Controller, "Controller");
function createHttpMethodDecorator(method) {
  return function(route) {
    return function(target, propertyKey, descriptor) {
      Reflect.defineMetadata("method", method, target, propertyKey);
      Reflect.defineMetadata("route", route, target, propertyKey);
    };
  };
}
__name(createHttpMethodDecorator, "createHttpMethodDecorator");
var Get = createHttpMethodDecorator("get");
var Post = createHttpMethodDecorator("post");
var Put = createHttpMethodDecorator("put");
var Patch = createHttpMethodDecorator("patch");
var Delete = createHttpMethodDecorator("delete");
function Middleware(middleware) {
  return function(target, propertyKey, descriptor) {
    const middlewares = Reflect.getMetadata("middlewares", target, propertyKey) || [];
    middlewares.push(middleware);
    Reflect.defineMetadata("middlewares", middlewares, target, propertyKey);
  };
}
__name(Middleware, "Middleware");

// src/websocket.ts
var websocket_exports = {};
__export(websocket_exports, {
  WebSocket: () => WebSocket
});
function WebSocket(route) {
  return function(target, propertyKey, descriptor) {
    Reflect.defineMetadata("method", "ws", target, propertyKey);
    Reflect.defineMetadata("route", route, target, propertyKey);
  };
}
__name(WebSocket, "WebSocket");
function registerControllers(router, Controller2) {
  const instance = new Controller2();
  const baseRoute = Reflect.getMetadata("baseRoute", Controller2);
  Object.getOwnPropertyNames(Controller2.prototype).forEach((methodName) => {
    if (methodName === "constructor") return;
    const method = Reflect.getMetadata("method", instance, methodName);
    const route = Reflect.getMetadata("route", instance, methodName);
    const middlewares = Reflect.getMetadata("middlewares", instance, methodName) || [];
    if (method && route) {
      const handler = instance[methodName];
      if (typeof handler === "function") {
        if (method !== "ws") {
          router[method](`${baseRoute}${route}`, ...middlewares, handler.bind(instance));
        }
      }
    }
  });
}
__name(registerControllers, "registerControllers");
function registerWebSocketControllers(router, Controller2, existingInstance) {
  const instance = existingInstance || new Controller2();
  const baseRoute = Reflect.getMetadata("baseRoute", Controller2);
  Object.getOwnPropertyNames(Controller2.prototype).forEach((methodName) => {
    if (methodName === "constructor") return;
    const method = Reflect.getMetadata("method", instance, methodName);
    const route = Reflect.getMetadata("route", instance, methodName);
    if (method === "ws" && route) {
      const handler = instance[methodName];
      if (typeof handler === "function" && typeof router.ws === "function") {
        router.ws(`${baseRoute}${route}`, (ws, req) => {
          try {
            handler.call(instance, ws, req);
          } catch (error) {
            console.error(`WebSocket error in ${Controller2.name}.${methodName}`, error);
            ws.close(1011, error instanceof Error ? error.message : "Internal server error");
          }
        });
      }
    }
  });
}
__name(registerWebSocketControllers, "registerWebSocketControllers");

// src/index.ts
var Rest = rest_exports;
var WebSocketNS = websocket_exports;

export { Controller, Delete, Get, Middleware, Patch, Post, Put, Rest, WebSocket, WebSocketNS, registerControllers, registerWebSocketControllers };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map