import { RequestHandler, Router } from 'express';

/**
 * Controller decorator
 * @param baseRoute
 * @returns
 */
declare function Controller(baseRoute?: string): ClassDecorator;
declare const Get: (route: string) => MethodDecorator;
declare const Post: (route: string) => MethodDecorator;
declare const Put: (route: string) => MethodDecorator;
declare const Patch: (route: string) => MethodDecorator;
declare const Delete: (route: string) => MethodDecorator;
/**
 * Middleware decorator
 * @param middleware
 * @returns
 */
declare function Middleware(middleware: RequestHandler): MethodDecorator;

declare const RestDecorators_Controller: typeof Controller;
declare const RestDecorators_Delete: typeof Delete;
declare const RestDecorators_Get: typeof Get;
declare const RestDecorators_Middleware: typeof Middleware;
declare const RestDecorators_Patch: typeof Patch;
declare const RestDecorators_Post: typeof Post;
declare const RestDecorators_Put: typeof Put;
declare namespace RestDecorators {
  export { RestDecorators_Controller as Controller, RestDecorators_Delete as Delete, RestDecorators_Get as Get, RestDecorators_Middleware as Middleware, RestDecorators_Patch as Patch, RestDecorators_Post as Post, RestDecorators_Put as Put };
}

/**
 * WebSocket method decorator
 * @param route
 * @returns
 */
declare function WebSocket(route: string): MethodDecorator;

declare const WebSocketDecorators_WebSocket: typeof WebSocket;
declare namespace WebSocketDecorators {
  export { WebSocketDecorators_WebSocket as WebSocket };
}

interface ControllerInstance$1 {
    [key: string]: unknown;
}
interface ControllerConstructor$1 {
    new (...args: any[]): ControllerInstance$1;
    prototype: ControllerInstance$1;
}
declare function registerControllers(router: Router, Controller: ControllerConstructor$1): void;

interface ControllerInstance {
    [key: string]: unknown;
}
interface ControllerConstructor {
    new (...args: any[]): ControllerInstance;
    prototype: ControllerInstance;
}
declare function registerWebSocketControllers(router: Router, Controller: ControllerConstructor, existingInstance?: ControllerInstance): void;

declare const Rest: typeof RestDecorators;
declare const WebSocketNS: typeof WebSocketDecorators;

export { Controller, Delete, Get, Middleware, Patch, Post, Put, Rest, WebSocket, WebSocketNS, registerControllers, registerWebSocketControllers };
