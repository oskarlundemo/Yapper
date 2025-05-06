import {useEffect, useState} from "react";
import '../../styles/Dashboard/GifContainer.css'

export const GifContainer = ({ showGifs, setShowGifs, groupChat, API_URL, setReceivers, receivers, sender, receiver }) => {
    const [gifs, setGifs] = useState([]);
    const [gifSearch, setGifSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
    const limit = 10;

    useEffect( () => {
        const setTrendingGifs = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${limit}`);
                const data = await response.json();
                setGifs(data.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        }
        setTrendingGifs();
    }, [])


    const fetchGifs = async (query) => {
        try {
            setLoading(true);
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=${limit}`);
            const data = await response.json();
            setGifs(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch gifs", error);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (gifSearch.trim().length > 0)
            fetchGifs(gifSearch);
    }

    const sendGif = async (gif) => {
        setShowGifs(false);
        console.log(receivers);
        try {
            await fetch(`${API_URL}/messages/gif/${sender}/${receiver}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gif, groupChat, receivers}),
            });
            setReceivers([]);
        } catch (err) {
            console.error("Message send error:", err);
        }
    }

    return (
        <div className={`gifContainer-wrapper ${showGifs ? 'show' : ''}`}>
            <div className="gifContainer-search">
                <form onSubmit={handleSubmit}>
                    <input
                        type='text'
                        value={gifSearch}
                        onChange={e => setGifSearch(e.target.value)}
                        placeholder='Search for a GIF!'
                    />
                </form>

                <svg onClick={() => setShowGifs(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>

            </div>

            <div className="gifContainer-search-result">


                {loading ? (
                    <>
                        <div  className="loading-gif"/>
                        <div  className="loading-gif"/>
                        <div  className="loading-gif"/>
                        <div  className="loading-gif"/>
                        <div  className="loading-gif"/>

                    </>
                ) : (
                    (gifs.length > 0 ? (
                            gifs.map((gif, index) => (
                                <img
                                    onClick={() => sendGif(gif)}
                                    key={index}
                                    src={gif.images.fixed_height.url}
                                    alt={gif.title}
                                />
                            ))
                        ) : (
                            <p>No gifs found 😔</p>
                        ))
                )}
            </div>
        </div>
    )
}

