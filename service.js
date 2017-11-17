var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Who\'s Home',
  description: 'Node.js app that checks a Unifi Controller for specific MAC addresses, or device names to tell who is home',
  script: 'E:\\Software\\SDK\\Node.js\\whoshome\\bin\\www',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();