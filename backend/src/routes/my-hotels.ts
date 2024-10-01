import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { HotelType } from "../models/hotel";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// api/my-hotels

router.post("/",
    verifyToken, [
        body("name").notEmpty().withMessage('name is required'),
        body("city").notEmpty().withMessage('city is required'),
        body("country").notEmpty().withMessage('country is required'),
        body("description").notEmpty().withMessage('description is required'),
        body("type").notEmpty().withMessage('hotel type is required'),
        body("pricePerNight").notEmpty().isNumeric().withMessage('price per night is required and must be number'),
        body("facilities").notEmpty().isArray().withMessage('facilities are required'),
    ],
    upload.array("imageFiles" ,6),
async (req: Request,res: Response) =>{
    try{
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body;

        //1-upload images to cloudinary

        //async function uploadImages(imageFiles: Express.Multer.File[]) 
            const uploadPromises = imageFiles.map(async (image) => {
              const b64 = Buffer.from(image.buffer).toString("base64");
              let dataURI = "data:" + image.mimetype + ";base64," + b64;
              const res = await cloudinary.v2.uploader.upload(dataURI);
              return res.url;
            });
          
        const imageUrls = await Promise.all(uploadPromises);
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId=req.userId;

        //return imageUrls;

        //2-if upload was successful , add URLs to the new hotel
        //3-save he new hotl in our database

        const hotel = new Hotel(newHotel);
        await hotel.save();

        //4-return a 201 status

        res.status(201).send(hotel);

    }catch(e){
        console.log("Error creating hotel: ", e);
        res.status(500).json({message: "soething went wrong"});
    }

})

router.get("/",verifyToken, async(req: Request,res: Response) => {
    const hotels = await Hotel.find({userId: req.userId});
    res.json(hotels);

    try{
        const hotels = await Hotel.find({userId: req.userId});
        res.json(hotels);
    } catch(error) {
        res.status(500).json({message: "Error fetching Hotels"});
    }
})

export default router;