import { useState, useEffect } from "react";

// Vite injects the environment variables into the import.meta.env.
const API_KEY = import.meta.env.VITE_GIPHY_API;

const useFetch = ({ keyword }) => {
  const [gifURL, setGifURL] = useState("");

  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&limit=1&q=${
          keyword.split(" ")[0]
        }`
      );
      const { data } = await response.json();

      //   It's the Null-Conditional Operator It's a syntactic sugar for null checking:
      //   Becomes if str == None: return None else return str.
      setGifURL(data[0]?.images?.downsized.url);
      console.log(gifURL);
    } catch (err) {
      setGifURL(
        "https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284"
      );
    }
  };

  useEffect(() => {
    if (keyword) {
      fetchGifs();
    }
  }, [keyword]);

  return gifURL;
};

export default useFetch;
