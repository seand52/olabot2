import server from './server.js';

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

const port = parseInt(server.config.API_PORT);
const host = server.config.API_HOST;

await server.listen({ host, port });
