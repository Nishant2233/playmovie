import axios from "axios";

export default axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key:"68b80459470104d70104367ac691868b",
  },
});