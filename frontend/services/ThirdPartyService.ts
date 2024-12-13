import axios from "axios";

export const fetchKanyeQuote = async () => {
  const res = await axios.get(`https://api.kanye.rest`);
  return res.data;
};
