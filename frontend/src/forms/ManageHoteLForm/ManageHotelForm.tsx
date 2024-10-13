import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: string[];
    imageFiles: FileList;
    imageUrls: string[];
    adultCount: number;
    childCount: number;
};

type Props = {
    hotel?: HotelType;
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit, reset, watch } = formMethods;

    // Watch for changes in form state to avoid accessing undefined properties
    const facilities = watch("facilities") || [];
    const imageUrls = watch("imageUrls") || [];
    const imageFiles = watch("imageFiles");

    useEffect(() => {
        if (hotel) {
            reset(hotel); // Only reset when hotel data exists
        }
    }, [hotel, reset]);

    const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
        const formData = new FormData();

        // Append hotel ID if it's an edit operation
        if (hotel) {
            formData.append("hotelId", hotel._id);
        }

        // Append basic hotel data to FormData
        formData.append("name", formDataJson.name);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("description", formDataJson.description);
        formData.append("type", formDataJson.type);
        formData.append("pricePerNight", formDataJson.pricePerNight.toString());
        formData.append("starRating", formDataJson.starRating.toString());
        formData.append("adultCount", formDataJson.adultCount.toString());
        formData.append("childCount", formDataJson.childCount.toString());

        // Safely append facilities if they exist
        facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility);
        });

        // Safely append image URLs if they exist
        imageUrls.forEach((url, index) => {
            formData.append(`imageUrls[${index}]`, url);
        });

        // Safely append image files if they exist
        if (imageFiles) {
            Array.from(imageFiles).forEach((imageFile) => {
                formData.append("imageFiles", imageFile);
            });
        }

        // Call the onSave handler with the constructed FormData
        onSave(formData);
    });

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={onSubmit}>
                <DetailsSection />
                <TypeSection />
                <GuestsSection />
                <ImagesSection />
                <span className="flex justify-end">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
                    >
                        Save
                    </button>
                </span>
            </form>
        </FormProvider>
    );
};

export default ManageHotelForm;
