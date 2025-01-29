const formatHTTPLoggerResponse = (
    req,
    res,
    responseBody // object or array sent with res.send()
  ) => {
  
    return {
        
      request: {


        headers: req.headers,
        host: req.headers.host,
        baseUrl: req.baseUrl,
        url: req.url,

        
        method: req?.method,
        body: req?.body,
        params: req?.params,
        query: req?.query,

        /*
        clientIp:
          req?.headers[HTTPHeaders.ForwardedFor] ?? req?.socket?.remoteAddress,
          */

      },
      response: {
        headers: res.getHeaders(),
        statusCode: res?.statusCode,
        body: responseBody,
      }
    };
  };
  
  module.exports = formatHTTPLoggerResponse;