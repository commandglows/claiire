module.exports = {
  apps: [{
    name: "claiire_site",
    cwd: "/home/claude/claiire/site",
    script: "bash",
    args: ["-lc", "export PORT=3019 && flox activate -- bash -lc 'pnpm dev --port 3019'"],
    env: {
      PORT: 3019
    },
    autorestart: true,
    max_restarts: 3,
    min_uptime: "10s",
    restart_delay: 2000,
    watch: false
  }]
};
