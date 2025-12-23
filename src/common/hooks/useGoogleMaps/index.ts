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

        let existingScript = document.querySelector(
            'script[src*="maps.googleapis.com/maps/api/js"]'
        ) as HTMLScriptElement;

        if (existingScript) {
            existingScript.addEventListener("load", checkGoogleMaps);
            checkGoogleMaps();
            return () => {
                existingScript.removeEventListener("load", checkGoogleMaps);
            };
        }

        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = checkGoogleMaps;

        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return isLoaded;
};
