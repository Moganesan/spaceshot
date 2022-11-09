import axios from "axios";

const app = axios.create({
  baseURL: "http://localhots:3000/api",
});

export default app;
