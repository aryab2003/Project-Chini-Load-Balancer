const http = require("http");
const httpProxy = require("http-proxy");
const request = require("request");

const proxy = httpProxy.createProxyServer({});
const servers = [
  { target: "http://www.youtube.com", isHealthy: true },
  { target: "http://www.facebook.com", isHealthy: true },
  { target: "https://twitter.com", isHealthy: true },
];

//checking health status of servers
function checkSiteHealth(siteURL, callback) {
  request(siteURL, (error, response) => {
    if (!error && response.statusCode === 200) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

function periodicSiteHealthCheck() {
  const siteToCheck = "http://www.facebook.com";

  checkSiteHealth(siteToCheck, (isHealthy) => {
    if (isHealthy) {
      console.log(`The site ${siteToCheck} is healthy.`);
    } else {
      console.log(`The site ${siteToCheck} is not healthy.`);
    }
  });
}

setInterval(periodicSiteHealthCheck, 30000);

//Round-Robin algo for load balancing among healthy servers
let currentServerIndex = 0;

const server = http.createServer((req, res) => {
  const healthyServers = servers.filter((server) => server.isHealthy);

  if (healthyServers.length === 0) {
    res.writeHead(503, { "Content-Type": "text/plain" });
    res.end("No healthy servers available");
  } else {
    const nextServer = healthyServers[currentServerIndex];
    proxy.web(req, res, { target: nextServer.target });
    currentServerIndex = (currentServerIndex + 1) % healthyServers.length;
  }
});

server.listen(8000);
console.log("Load balancer listening on port 8000");
