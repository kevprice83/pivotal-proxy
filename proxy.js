var http = require('http');
var httpProxy = require('./node_modules/http-proxy/lib/http-proxy');

var caCert =
  '-----BEGIN CERTIFICATE-----\n' +
  'MIIEFTCCAv2gAwIBAgIJAPHUVaDuxEyTMA0GCSqGSIb3DQEBBQUAMIGgMQswCQYD\n' +
  'VQQGEwJVUzELMAkGA1UECAwCTlkxETAPBgNVBAcMCE1lbHZpbGxlMRkwFwYDVQQK\n' +
  'DBBQaXZvdGFsIFBheW1lbnRzMQwwCgYDVQQLDANERVYxIDAeBgNVBAMMF1Bpdm90\n' +
  'YWwgUGF5bWVudHMgREVWIENBMSYwJAYJKoZIhvcNAQkBFhdub2NAcGl2b3RhbHBh\n' +
  'eW1lbnRzLmNvbTAeFw0xMjEwMjIxODU4MThaFw0yMjEwMjAxODU4MThaMIGgMQsw\n' +
  'CQYDVQQGEwJVUzELMAkGA1UECAwCTlkxETAPBgNVBAcMCE1lbHZpbGxlMRkwFwYD\n' +
  'VQQKDBBQaXZvdGFsIFBheW1lbnRzMQwwCgYDVQQLDANERVYxIDAeBgNVBAMMF1Bp\n' +
  'dm90YWwgUGF5bWVudHMgREVWIENBMSYwJAYJKoZIhvcNAQkBFhdub2NAcGl2b3Rh\n' +
  'bHBheW1lbnRzLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMJR\n' +
  '2nx+cFZwulBXr9hH628g35L2DNHc+5+B9BRFTRUseTwO7EZzLHWYZjJtt1ycJmpo\n' +
  'fZNir3ZBaKaeMajAfnBuSlcCQPe0vXVczKdMkZfvQ+QqquozndPEqb78aCJcZKOV\n' +
  'N3z7WuqI66bEkhU3WuDX77rdB8sPn/HXD1mvZSFSvg2JPwPOxblVxyk+vo29u3xN\n' +
  'M6LPEJGctoLsaJF9j7jY3MJimqihLyCfVMYAu4xeK0rUBPVdLH30j71hAukYxV0n\n' +
  'p1pK/i7JBk5J2CffTj0vsyP8wtg48JT9nysXyZcCf0uj4YnwwmzsWmGMuHkpQAWf\n' +
  'TCaDwktDvno7/fjAcZ8CAwEAAaNQME4wHQYDVR0OBBYEFK0NPXLCys947ADaJRnY\n' +
  'IvxMxe0cMB8GA1UdIwQYMBaAFK0NPXLCys947ADaJRnYIvxMxe0cMAwGA1UdEwQF\n' +
  'MAMBAf8wDQYJKoZIhvcNAQEFBQADggEBAL2H/J/42LkReb5uK9W1Eydfzvmkgbln\n' +
  'zWccN4QLte59wNpdFBFb6qnxLGt/WaOzu2aFVo+cK2MXWyVKidcdUQx0Lu0qg1Pp\n' +
  'C+dz51rGW91TCxQaocNABDAUdEYNcXxD/BvMpi05iPIUwyczdcPqz3iN6lkl3eP7\n' +
  'FLiV1c5R69ZWnvb9dT/yPQfyhLlZxgQdHes1hHBIkn7PChAuVZ14QzxQuBIx2sQp\n' +
  '3AxVOirAq5FIRY+MvsrznnTEXlKOOSvB9M6db83fBWcQ0vD7jzPicVGxsbsinQk3\n' +
  'IYXkwx7OxbbtDkCMZfSiYPyosf85hh6zr2uhtlduSniHpigqD+sMuBA=\n' +
  '-----END CERTIFICATE-----';

  var clientKey =
  '-----BEGIN RSA PRIVATE KEY-----\n' +
  'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCmzPKHsh/NL0bk\n' +
  'rKQQFcQjL30pTDet/S0CXpvSLB3EPgT9T8i6hlDHFsD3HySgg6szcsxj3OqVrKGP\n' +
  'S3N2o/HDjA7TKqdrJS7pegKtzbZA2/NfpdunoxAsG0lZcqnIeQsNUgE3wouBnXxH\n' +
  'f+j3h68zk6F5mFkv84Rw8RdCcOK/aBiz5gedAXaIC5PkJNM6IIEsIxZy/A4HlknV\n' +
  'muvqTyoiG6ANQykCb87WxVkYrWK05vNQr24T+VcCi5+vPYHImbTKxHYI9IMG7f3/\n' +
  'AtHcafUGLtum/8YAq7VreRyKiCxHtjZ3A0M2Y9OZmA5Spzumco3pIlkAXVv3duu9\n' +
  'd1zs++tDAgMBAAECggEBAJSVxQZz+jhBgRl7YLqjaREe4JPFPWRUP5/4vz295tZF\n' +
  'mRQ92kWuGI8BCewZZftGz18JSGE9Dgs+uLx5LeXlrRvQy/P37yNXAC8jbPd+ZHfq\n' +
  'dyYhDUaLz4A63mA78FqQ2POItWUCfFt9+pOGsfSufbeoLxOuTuSUPMqPOXUKMjLm\n' +
  'C8cBh+IRxEDt+zuvWIvZJ1gAgTXUa8FRoJhrSv8+oCAan1o92SxK3Ngo0FYZryJb\n' +
  'XZF0buyktNDyeSML1kfOOGlvkClkoDam0gou3MH8cTDyqm3fZjYPMgmFsOZOQXNJ\n' +
  '0Hju2p/6m5p+KqiI40a4nqga+vNdfewjdnbsDm9Wn8ECgYEA0f1RRgC+tQq5/qw+\n' +
  'jutST88OhLVSdEXBOFxZlXdFVQcVyHVObuRAl1841kynduTLgbNxE7ae8iGrNkMy\n' +
  'VZ6vpNd8fEEvxVIFetlas1gRq7v6xXJ/KplsbmP1KLwX6DkKAlyu6IvwmLn+yjQX\n' +
  '8iDy6gMjbpDej1ChpnfToQrMpusCgYEAy1kV9nGCB+bdupJg2soJKqz6FAUG0fLQ\n' +
  '8Bpl5OZyN54AWrz+5ybiXipCXbi8ztYT1OfwUJKN50Pyc5s0glKxdX4Kzks6sTQh\n' +
  'xzdnS4oBTsqZR3kqGSAdgxWDhVIC/btOnBrA4K2wjXK39NxUZ8e2qHArsz5c9Wh4\n' +
  'roVIOHCE5wkCgYBKL3U0BvVY3lZBS7a6JRaqTVsytSBRJYeSksWvUTi0RlGCxTaV\n' +
  'ZJwRHjnlM6WCEmh3BN7w+PaEUjK7c9fnea1RzjMTbrAixMxcz0cEzxtHEZ0RflbA\n' +
  'xP0SrsugvXqwtt37YaUFUNMKEcOayfafutY2qC8vU4zdEr5ZIkIoxbjxSwKBgQCI\n' +
  'vYE9VZrhAWg8283xkkaTwfnwmGi7qZLCwp2eTTClIcSPP+QRQF6cf8JdD6s3U1HG\n' +
  'q6k4JTTzPQe+obGvqTfYEEfn7UKsgqfsNN9rNoQmnapxG5MpjiUKTt9AOaP1R41W\n' +
  '/86Px3yfwXLeX4MKvoufvL5GLDuKcxQkF1A3U8KrMQKBgH3ZHUghETh/voAY7RcG\n' +
  '1SPkjGrULm6e7UTxma2IZyXYq56p3Vy3I5hC2RtLEnrVvMzsGt14eQ6Mvw4yETOX\n' +
  'aoqhxQa8Kss6u5w3w3pf0Pht4pds+PFgXsuLzk2FUvSRxgZQExWG7lbVtEiOD07q\n' +
  'XUC2zCBwFFcZoqoGPwpmGtXn\n' +
  '-----END RSA PRIVATE KEY-----\n';

  var clientCert =
  '-----BEGIN CERTIFICATE-----\n' +
  'MIIEPzCCAyegAwIBAgICAK0wDQYJKoZIhvcNAQELBQAwgaAxCzAJBgNVBAYTAlVT\n' +
  'MQswCQYDVQQIDAJOWTERMA8GA1UEBwwITWVsdmlsbGUxGTAXBgNVBAoMEFBpdm90\n' +
  'YWwgUGF5bWVudHMxDDAKBgNVBAsMA0RFVjEgMB4GA1UEAwwXUGl2b3RhbCBQYXlt\n' +
  'ZW50cyBERVYgQ0ExJjAkBgkqhkiG9w0BCQEWF25vY0BwaXZvdGFscGF5bWVudHMu\n' +
  'Y29tMB4XDTE2MDMyNTE4MTQzM1oXDTE4MDMyNTE4MTQzM1owgaYxCzAJBgNVBAYT\n' +
  'AlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRYwFAYDVQQHDA1TYW4gRnJhbmNpc2Nv\n' +
  'MQ8wDQYDVQQKDAYzU2NhbGUxDDAKBgNVBAsMA0RFVjEjMCEGA1UEAwwaM3NjYWxl\n' +
  'QHBpdm90YWxwYXltZW50cy5jb20xJjAkBgkqhkiG9w0BCQEWF25vY0BwaXZvdGFs\n' +
  'cGF5bWVudHMuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApszy\n' +
  'h7IfzS9G5KykEBXEIy99KUw3rf0tAl6b0iwdxD4E/U/IuoZQxxbA9x8koIOrM3LM\n' +
  'Y9zqlayhj0tzdqPxw4wO0yqnayUu6XoCrc22QNvzX6Xbp6MQLBtJWXKpyHkLDVIB\n' +
  'N8KLgZ18R3/o94evM5OheZhZL/OEcPEXQnDiv2gYs+YHnQF2iAuT5CTTOiCBLCMW\n' +
  'cvwOB5ZJ1Zrr6k8qIhugDUMpAm/O1sVZGK1itObzUK9uE/lXAoufrz2ByJm0ysR2\n' +
  'CPSDBu39/wLR3Gn1Bi7bpv/GAKu1a3kciogsR7Y2dwNDNmPTmZgOUqc7pnKN6SJZ\n' +
  'AF1b93brvXdc7PvrQwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQf\n' +
  'Fh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQU/I1Tnk1W\n' +
  'LCD4xIv9HlDJNqpJfVwwHwYDVR0jBBgwFoAUrQ09csLKz3jsANolGdgi/EzF7Rww\n' +
  'DQYJKoZIhvcNAQELBQADggEBAFRwvdny6FvR+dlnKOcSOY19Vcxdc/A30nB72gUj\n' +
  'VnjTHNVu+riumfiIcyT81zJ+89+EEWCzoa1amSInHbNCaMClcoSotcdo68OZDbfW\n' +
  '4cWUDjwfCL9qKdr1hnieLwnlHR6DtxZgdGeeNYhjqvE5Ky21jyhj3p9UAjWeOdzS\n' +
  'eU1EToEfrextI58NkSa/Pqnhrk4LeSBmgRTuwdVlFZEYsZDiPO/68olZhyUZNaic\n' +
  'vvepRVlk+xOZtSORiYZGO83gynvAnFxJOvtD170spZeUR0rvobZdnnS7RJoB+3wc\n' +
  'xITEKP3+qQDP+caXlTxPn8KIZifKPQgcBZu7NwKusG4bGdA=\n' +
  '-----END CERTIFICATE-----\n';

  // var appData = require('./application_CA.xml');

  var proxy = httpProxy.createServer();

  // https://github.com/nodejitsu/node-http-proxy/issues/734
// proxy.on('proxyRes', function(proxyRes, req, res) {
//   if (res.shouldKeepAlive) {
//     proxyRes.headers.connection = 'keep-alive';
//   }
// });

var httpServer = http.createServer(function(req, res) {
  var options = {
    target: {
      host: 'applink.service.preproduction.pivotalpayments.com',
      port: 443,
      protocol: 'https:',
      key: clientKey,
      cert: clientCert,
      ca: caCert,
      // body: appData,
    },
    changeOrigin: true
  };

  proxy.web(req, res, options, function(err) {
    console.log('oh nooooo: ' + err.toString());

    if (!res.headersSent) {
      res.statusCode = 502;
      res.end('bad gateway');
    }
  });
});

httpServer.listen(8080, function() {
  console.log('proxy server on port 8080');
});