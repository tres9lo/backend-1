const dbconfig = require('../db/dbconfig');
const itemModel = require('../models/itemModel');
const multer = require('multer');

exports.postFoundItem = async (req, res) => {   
 
    try{
        const{type, owner, code, image, location, user_id } = req.body;
        if(!type ||  !owner || !code || !image || !location || !user_id){
            return res.status(400).json({ status: "failed", message: "All fields are required"});
        }
         
        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path;
            
        }
        const newItem = await itemModel.create({
            type,
            owner,
            code,
            image: imagePath,
            location,
            user_id
        });

        res.status(200).json({ status: "success", message: "Item added successfully", data: newItem});
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message});
    }   
}

exports.getFoundItems = async (req, res) => {
    try {
        const items = await itemModel.find();
        res.status(200).json({ status: "success", data: items});
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message});
    }
}
    exports.getFoundItem = async (req, res) => {
        try {
            const item = await itemModel.findById(req.params.id);
            res.status(200).json({ status: "success", data: item});

} catch (error) {
    res.status(500).json({ status: "failed", message: error.message});
}
}



exports.updateFoundItem = async (req, res) => {
    try {
        const item = await itemModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json({ status: "success", message: "Item updated successfully", data: item});
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message});
    }
}


exports.PostLostItem = async (req, res) => {
    try{
       
        const{type, ownernames, code, user_id} = req.body;
        if(!type ||  !ownernames || !code || !user_id){
            return res.status(400).json({ status: "failed", message: "All fields are required"});
        }
        const newLostItem = await itemModel.create({
            type,
            ownernames,
            code,
            user_id
        });

        res.status(200).json({ status: "success", message: "Item added successfully", data: newLostItem});

    } catch(error){
        res.status(500).json({ status: "failed", message: error.message});
    }
}
  //getting all lost items based on the user_id

    exports.getLostItems = async (req, res) => {
        try {
            const items = await itemModel.find({user_id: req.params.user_id});
            res.status(200).json({ status: "success", data: items});
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message});
        }

}
 exports.getLostItem = async (req, res) => {
        try {
            const item = await itemModel.findById(req.params.id);
            res.status(200).json({ status: "success", data: item});


} catch(error){
    res.status(500).json({ status: "failed", message: error.message});
}
}

exports.updateLostItem = async (req, res) => {
    try {
        const item = await itemModel.findByIdAndUpdate
        (req.params.id, req.body, {new: true});
        res.status(200).json({ status: "success", message: "Item updated successfully", data: item});
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message});
    }
}

