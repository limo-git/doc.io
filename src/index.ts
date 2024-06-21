export * from "./lib/config"
export * from "./lib/markdown"
export * from "./app/api/routes/route"
export * from "./app/apiref/page"
export * from "./app/main/[slug]/page"
export * from "./app/main/page"
export * from "./components/swagger-doc"
import { deploy } from './deploy';

deploy().catch(error => {
  console.error('Deployment failed:', error.message);
});


