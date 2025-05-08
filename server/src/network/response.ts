import { ServerResponse } from '@shared/types';
import { FastifyInstance, FastifyReply } from 'fastify';
export enum RESPONSE_STATUS {
  // 1xx= Informational
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLY_HINTS = 103,

  // 2xx= Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207,
  ALREADY_REPORTED = 208,
  IM_USED = 226,

  // 3xx= Redirection
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,

  // 4xx= Client Error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  IM_A_TEAPOT = 418, // This one is a fun Easter egg from the HTTP RFCs
  MISDIRECTED_REQUEST = 421,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  TOO_EARLY = 425,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  // 5xx= Server Error
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE = 507,
  LOOP_DETECTED = 508,
  NOT_EXTENDED = 510,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}

export module response {

  export const OK = (reply: FastifyReply, message: string, data?: any) => {
    //log
    reply.status(RESPONSE_STATUS.OK).send({ message, data } as ServerResponse);
  };
  export const CREATED = (reply: FastifyReply, message: string, data?: any) => {
    //log
    reply.status(RESPONSE_STATUS.CREATED).send({ message, data } as ServerResponse);
  };
  export const BAD_REQUEST = (reply: FastifyReply, message: string, data?: any) => {
    //log
    reply.status(RESPONSE_STATUS.BAD_REQUEST).send({ message, data } as ServerResponse);
  };
  export const CONFLICT = (reply: FastifyReply, message: string, data?: any) => {
    //log
    reply.status(RESPONSE_STATUS.CONFLICT).send({ message, data } as ServerResponse);
  };
  export const UNAUTHORIZED = (reply: FastifyReply, message: string, data?: any) => {
    //log
    reply.status(RESPONSE_STATUS.UNAUTHORIZED).send({ message, data } as ServerResponse);
  };
  export const FORBIDDEN = (reply: FastifyReply, message: string, data?: any) => {
    //log
    reply.status(RESPONSE_STATUS.FORBIDDEN).send({ message, data } as ServerResponse);
  };
  export const NOT_FOUND = (reply: FastifyReply, message: string, data?: any) => {
    //log
    reply.status(RESPONSE_STATUS.NOT_FOUND).send({ message, data } as ServerResponse);
  };
  export const INTERNAL_SERVER_ERROR = (reply: FastifyReply, message: string, data?: any) => {
    //log
    reply.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send({ message, data } as ServerResponse);
  };
  export const TOO_MANY_REQUESTS = (reply: FastifyReply, message: string, data?: any) => {
    //log
    reply.status(RESPONSE_STATUS.TOO_MANY_REQUESTS).send({ message, data } as ServerResponse);
  };

  // Add other status codes as needed
  export const CUSTOM = (reply: FastifyReply, status: RESPONSE_STATUS, message: string, data?: any) => {
    //log
    reply.status(status).send({ message, data } as ServerResponse);
  };
}
