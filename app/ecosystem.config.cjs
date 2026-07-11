module.exports = {
  apps: [{
    name: "claiire_app",
    cwd: "/home/claude/claiire/app",
    script: "bash",
    args: ["-c", "flox activate -- npx expo start --dev-client --tunnel"],
    autorestart: false,
    watch: false
  }]
};
