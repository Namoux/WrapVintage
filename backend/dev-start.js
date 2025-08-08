import waitPort from 'wait-port';

const params = {
  host: 'mariadb',
  port: 3306,
  timeout: 10000, // 10 sec max
  output: 'silent',
};

waitPort(params).then(open => {
  if (open) {
    console.log('✅ MariaDB is ready, starting server...');
    import('./src/server.js');
  } else {
    console.error('❌ MariaDB not available in time');
    process.exit(1);
  }
});