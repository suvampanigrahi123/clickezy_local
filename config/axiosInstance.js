import axios from 'axios';
import { environment, dev } from '../www/http';
const Instance = axios.create({
  baseURL: dev.baseUrl,
});
export default Instance;
