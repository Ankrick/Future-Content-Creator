const { GoogleGenAI, Modality, createUserContent, createPartFromUri } = require("@google/genai");
const { InferenceClient } =  require("@huggingface/inference");
// const OpenAI = require("openai");
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ai = new GoogleGenAI({});
// const client = new InferenceClient(process.env.HF_TOKEN);
const Stores = require("../models/Stores");
const mongoose = require('mongoose')



const StoreController = {
    index : async (req, res) => {
        try {
            // Get stores for the authenticated user only
            let stores = await Stores.find({ userId: req.user._id }).sort({createdAt : -1});
            return res.json(stores);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    create : async (req, res) => {
        try {
            const {businessName, coreOffering, uniqueSellingProposition, targetAudience, businessMission} = req.body;

            const store = await Stores.create({
                businessName,
                coreOffering,
                uniqueSellingProposition,
                targetAudience,
                businessMission,
                userId: req.user._id  // Associate store with authenticated user
            });

            return res.json(store);

        }catch(e){
            return res.status(500).json({ msg : e.message})
        }
    },
    show : async (req, res) => {
        try{
            let id  = req.params.id;
            if(!mongoose.Types.ObjectId.isValid(id)){
                return res.status(400).json({msg: 'bad request'})
            }
            // Only allow user to view their own stores
            let store = await Stores.findOne({ _id: id, userId: req.user._id });
            if(!store) {
                return res.status(404).json({msg: 'store not found'})
            }
            return res.json({store});
        }catch(e){
            return res.status(500).json({msg: 'server error'})
        }
    },
    destory : async(req, res) => {
        try{
            let id  = req.params.id;
            if(!mongoose.Types.ObjectId.isValid(id)){
                return res.status(400).json({msg: 'bad request'})
            }
            // Only allow user to delete their own stores
            let store = await Stores.findOneAndDelete({ _id: id, userId: req.user._id });

            if(!store) {
                return res.status(404).json({msg: 'store not found'})
            }
            return res.json({store});
        }catch(e){
            return res.status(500).json({msg: 'server error'})
        }
    },
    destoryAll : async(req, res) => {
        try{
            // Only delete stores belonging to the authenticated user
            let store = await Stores.deleteMany({ userId: req.user._id });
            if(!store) {
                return res.status(404).json({msg: 'stores not found'})
            }
            return res.json({store});
        }catch(e){
            return res.status(500).json({msg: 'server error'})
        }
    },
    update : async(req, res) => {
        try{
            let id  = req.params.id;
            if(!mongoose.Types.ObjectId.isValid(id)){
                return res.status(400).json({msg: 'bad request'})
            }
            // Only allow user to update their own stores
            let store = await Stores.findOneAndUpdate(
                { _id: id, userId: req.user._id }, 
                { ...req.body },
                { new: true } // Return updated document
            );

            if(!store) {
                return res.status(404).json({msg: 'store not found'})
            }
            return res.json(store);
        }catch(e){
            return res.status(500).json({msg: 'server error'});
        }
    }
}

module.exports = StoreController;












