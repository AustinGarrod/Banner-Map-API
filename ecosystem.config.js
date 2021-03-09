module.exports = {
  apps: {
    name: "banner-map-api",
    script: "npm start"
  },
  deploy: {
    production: {
      user: "ubuntu",
      host: " ec2-3-96-56-4.ca-central-1.compute.amazonaws.com",
      ref: "origin/master",
      repo: "git@github.com:AustinGarrod/Banner-Map-API.git",
      path: "/var/www/Banner-Map-API",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js",
    }
  }
};
