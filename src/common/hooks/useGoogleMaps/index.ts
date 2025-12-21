import { useEffect, useState } from "react";

declare global {
    interface Window {
        google?: {
            maps?: {
                places?: any;
                [key: string]: any;
            };
            [key: string]: any;
        };
        initGoogleMaps: () => void;
    }
}

export const useGoogleMaps = (): boolean => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
            setIsLoaded(true);
            return;
        }

        const checkGoogleMaps = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
                setIsLoaded(true);
            }
        };

        const script = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');

        if (script) {
            script.addEventListener("load", checkGoogleMaps);
            checkGoogleMaps();
        } else {
            const intervalId = setInterval(() => {
                if (window.google && window.google.maps && window.google.maps.places) {
                    setIsLoaded(true);
                    clearInterval(intervalId);
                }
            }, 100);

            return () => clearInterval(intervalId);
        }

        return () => {
            if (script) {
                script.removeEventListener("load", checkGoogleMaps);
            }
        };
    }, []);

    return isLoaded;
};
