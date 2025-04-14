import { useState } from "react";
import '../../styles/Dashboard/GifContainer.css'

export const GifContainer = ({ showGifs, setShowGifs }) => {
    const [gifs, setGifs] = useState([]);
    const [gifSearch, setGifSearch] = useState("");


    const fetchGifs = async (query) => {
        const apiKey = 'c52iw3fcSy1QjdnrH3x5n42FAmYOPVE7'; // Replace with your actual key
        const limit = 10;

        try {
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=${limit}`
            );
            const data = await response.json();
            console.log(data.data); // This is an array of GIF objects


            setGifs(data.data);

        } catch (error) {
            console.error("Failed to fetch gifs", error);
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();

        fetchGifs(gifSearch);

        console.log("Searching for GIFs with:", gifSearch);
    }

    return (
        <div className={`gifContainer-wrapper ${showGifs ? 'show' : ''}`}>
            <div className="gifContainer-search">
                <form onSubmit={handleSubmit}>
                    <input
                        type='text'
                        value={gifSearch}
                        onChange={e => setGifSearch(e.target.value)}
                        placeholder='Search for something funny!'
                    />
                </form>
            </div>

            <div className="gifContainer-search-result">
                {gifs.length > 0 ? (
                    gifs.map((gif, index) => (
                        <img
                            key={index}
                            src={gif.images.fixed_height.url}
                            alt={gif.title}
                        />
                    ))
                ) : (
                    <p>No gifs found 😔</p>
                )}
            </div>
        </div>
    )
}

