const Listing = require("../models/listing")


module.exports.index =  async(req,res)=>{
    let allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
};


module.exports.renderNewForm = (req,res)=>{
       res.render("listings/new.ejs")
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    let data  =await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!data){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    }
    console.log(data);
    res.render("listings/show.ejs",{data});
}

module.exports.createListing = async(req,res)=>{
        let url=req.file.path;
        let filename = req.file.filename;
        let listing = req.body;
        listing.owner = req.user._id;
        listing.image = {url,filename};
        await Listing.insertOne(listing);
        
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
}


module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    let data  =await Listing.findById(id);

    let originalImageUrl = data.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")

    res.render("listings/edit.ejs",{data,originalImageUrl});
}


module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let data = req.body;
    let listing =  await Listing.findByIdAndUpdate(id,data);

    if( typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
     req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}