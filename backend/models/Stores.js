const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const StoreSchema = new Schema({
    businessName : {
        type : String,
        required : true,
    },
    coreOffering : {
        type : String,
        required : true,
    },
    uniqueSellingProposition : {
        type : String,
        required : true,
    },
    targetAudience : {
        type : String,
        required : true,
    },
    businessMission : {
        type : String,
        required : true,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    }
}, { timestamps : true });

module.exports = mongoose.model("Stores", StoreSchema);