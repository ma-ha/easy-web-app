This example uses Redis cache to share login sessions in a stateless cluster of *easy-web-app* nodes.
You can replace the functions by SQL DB or other persistence backend.

# Step 1: Start a Redis server

We need a cache to store the session tokens for user log in.
There are 100 ways to use Redis, I propose to use a docker container in this example.

1st time:

      

others:

    docker start redis

# Step 2: Prepare NPM 

  npm install redis minimist
  npm update

# Step 2: Start Server A

    cd examples/redis-sessions
    node server.js -A

# Step 3: Start Server B

    cd examples/redis-sessions
    node server.js -B

# Step 4: Test the sesssion sync

1. Start session on server A: Open http://localhost:8001/securitydemo in browser
2. Login as 'test1' (no password)
3. Open server B in browser: http://localhost:8002/securitydemo
4. You should still be logged in as 'test1'
5. Log out on server B
6. Reload page on server A, session should be terminated here too




