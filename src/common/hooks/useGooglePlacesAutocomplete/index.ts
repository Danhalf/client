import { useState, useCallback, useMemo } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export interface AddressSuggestion {
    description: string;
    placeId: string;
    structuredFormatting?: {
        mainText: string;
        secondaryText: string;
    };
}

export interface ParsedAddress {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    formattedAddress: string;
}

export const useGooglePlacesAutocomplete = () => {
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const places = useMapsLibrary("places");
    const autocompleteService = useMemo(() => {
        if (!places) return null;
        return new places.AutocompleteService();
    }, [places]);

    const completeMethod = useCallback(
        (event: { query: string }) => {
            if (!autocompleteService || !event.query.trim()) {
                setSuggestions([]);
                return;
            }

            autocompleteService.getPlacePredictions(
                {
                    input: event.query,
                    types: ["address"],
                    componentRestrictions: { country: "us" },
                },
                (predictions, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                        const formattedSuggestions: AddressSuggestion[] = predictions.map(
                            (prediction) => ({
                                description: prediction.description,
                                placeId: prediction.place_id,
                                structuredFormatting: prediction.structured_formatting
                                    ? {
                                          mainText: prediction.structured_formatting.main_text,
                                          secondaryText:
                                              prediction.structured_formatting.secondary_text || "",
                                      }
                                    : undefined,
                            })
                        );
                        setSuggestions(formattedSuggestions);
                    } else {
                        setSuggestions([]);
                    }
                }
            );
        },
        [autocompleteService]
    );

    const getPlaceDetails = useCallback(
        (placeId: string): Promise<ParsedAddress | null> => {
            return new Promise((resolve) => {
                if (!places) {
                    resolve(null);
                    return;
                }

                const placesService = new places.PlacesService(document.createElement("div"));

                placesService.getDetails(
                    {
                        placeId: placeId,
                        fields: ["address_components", "formatted_address"],
                    },
                    (place, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                            let streetNumber = "";
                            let route = "";
                            let city = "";
                            let state = "";
                            let zipCode = "";

                            place.address_components?.forEach((component) => {
                                const types = component.types;
                                if (types.includes("street_number")) {
                                    streetNumber = component.long_name;
                                }
                                if (types.includes("route")) {
                                    route = component.long_name;
                                }
                                if (types.includes("locality")) {
                                    city = component.long_name;
                                }
                                if (types.includes("administrative_area_level_1")) {
                                    state = component.short_name;
                                }
                                if (types.includes("postal_code")) {
                                    zipCode = component.long_name;
                                }
                            });

                            const streetAddress = `${streetNumber} ${route}`.trim();

                            resolve({
                                streetAddress: streetAddress || place.formatted_address || "",
                                city: city,
                                state: state,
                                zipCode: zipCode,
                                formattedAddress: place.formatted_address || "",
                            });
                        } else {
                            resolve(null);
                        }
                    }
                );
            });
        },
        [places]
    );

    return {
        suggestions,
        completeMethod,
        getPlaceDetails,
    };
};
