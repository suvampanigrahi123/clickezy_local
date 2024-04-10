import { useEffect, useState } from 'react'

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(getWindowSize());
    function getWindowSize() {
        if (typeof window !== 'undefined') {
            const { innerWidth, innerHeight } = window;
            return { innerWidth, innerHeight };
        }
    }

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    return windowSize;

}



export default useWindowSize