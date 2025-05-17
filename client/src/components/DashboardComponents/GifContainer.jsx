import {useEffect, useState} from "react";
import '../../styles/Dashboard/GifContainer.css'
import {useDashboardContext} from "../../context/DashboardContext.jsx";
import {useAuth} from "../../context/AuthContext.jsx";


/**
 * This component is used for showing the Gif container where users
 * can send gifs to each other
 *
 *
 * @param showGifs  // State to toggle the pop-up window
 * @param setShowGifs // Set the state to toggle the pop-up window
 * @param setReceivers // Set the recipients of the message
 * @param receivers   // Recipients of a new message
 * @returns {JSX.Element}
 * @constructor
 */




export const GifContainer = ({ showGifs, setShowGifs,
                                 setReceivers, receivers}) => {


    const {groupChat, API_URL, receiver} = useDashboardContext();
    const {user} = useAuth();

    const [gifs, setGifs] = useState([]);  // Array to hold the gifs
    const [gifSearch, setGifSearch] = useState("");  // Search string for gifs
    const [loading, setLoading] = useState(false);  // Set loading state for gifs

    const apiKey = import.meta.env.VITE_GIPHY_API_KEY;  // Get API key from .env
    const limit = 10;  // Limit the gifs to 10

    // This hook is triggered on mount, popularising the gif array with some trending gifs
    useEffect( () => {

        // Set array of gifs to trending
        const setTrendingGifs = async () => {
            // Set loading of gifs
            setLoading(true);
            try {
                const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${limit}`); // Fetch from GiphyAPI
                const data = await response.json();
                setGifs(data.data); // Set the array with the data
                setLoading(false); // Set loading false
            } catch (err) {
                console.log(err); // If error log it
                setLoading(false); // Also set false
            }
        }
        setTrendingGifs();  // Call on mount
    }, [])


    // This function is used for fetching new gifs the user hits enter
    const fetchGifs = async (query) => {
        try {
            setLoading(true); // Set to loading
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=${limit}`); // Fetch grom GiphyAPI
            const data = await response.json();
            setGifs(data.data); // Set array with new gifs
            setLoading(false); // Set loading to false
        } catch (error) {
            console.error("Failed to fetch gifs", error);
        }
    };


    // This function is used for handeling new submits
    const handleSubmit = (e) => {
        e.preventDefault();

        // Make sure the users does not send empty strings before fetching
        if (gifSearch.trim().length > 0)
            fetchGifs(gifSearch);
    }

    // This function is used for sending GIFs to other users
    const sendGif = async (gif) => {
        setShowGifs(false); // Toggle the gif container
        try {
            await fetch(`${API_URL}/messages/gif/${user.id}/${receiver}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gif, groupChat, receivers}),
            });
            setReceivers([]); // Set the recipients of the message to null, since GIF was sent
        } catch (err) {
            console.error("Message send error:", err);
        }
    }


    return (

        <div className={`gifContainer-wrapper ${showGifs ? 'show' : ''}`}>
            {/* Toggle the GIF container based on state */}

            <div className="gifContainer-search">
                <form onSubmit={handleSubmit}>
                    <input
                        type='text'
                        value={gifSearch}
                        onChange={e => setGifSearch(e.target.value)}
                        placeholder='Search for a GIF!'
                    />
                </form>

                {/* Click on X icon then close */}
                <svg onClick={() => setShowGifs(false)}
                     xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                     width="24px" fill="#e3e3e3">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>

            <div className="gifContainer-search-result">


                {/* If the gifs are loading, show loading animation */}
                {loading ? (
                    <>
                        <div  className="loading-gif"/>
                        <div  className="loading-gif"/>
                        <div  className="loading-gif"/>
                        <div  className="loading-gif"/>
                        <div  className="loading-gif"/>
                    </>
                ) : (
                    // For each GIF, print and show
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
                            <p>No gifs found</p>
                    ))
                )}
            </div>
        </div>
    )
}

