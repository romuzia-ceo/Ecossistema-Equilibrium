import React, { useState, useEffect } from 'react';

const videos = [
    'https://storage.googleapis.com/aistudio-hosting-project-prod.appspot.com/assets/b6a2f211-2c9e-4522-827c-3b2a2a072d56?GoogleAccessId=aistudio-hosting-project-prod%40appspot.gserviceaccount.com&Expires=4102444800&Signature=oH1iM3p2PqT8z%2B3zD6X4BvF2%2B9Y8%2BRJq3z%2B5kY2V6yU%2Bt4Vq5z%2B3z%2B8z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3-src',
    'https://storage.googleapis.com/aistudio-hosting-project-prod.appspot.com/assets/3e680295-88f5-4206-8d5f-3665a395b03e?GoogleAccessId=aistudio-hosting-project-prod%40appspot.gserviceaccount.com&Expires=4102444800&Signature=oH1iM3p2PqT8z%2B3zD6X4BvF2%2B9Y8%2BRJq3z%2B5kY2V6yU%2Bt4Vq5z%2B3z%2B8z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2B3z%2-src',
];

const VideoCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
        }, 7000); // Change video every 7 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {videos.map((videoSrc, index) => (
                <video
                    key={videoSrc}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            ))}
        </div>
    );
};

export default VideoCarousel;
