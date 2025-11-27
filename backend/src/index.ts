import { createServer } from './server';

const port = process.env.PORT || 4000;
const app = createServer();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
