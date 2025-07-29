const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listing/index.ejs", { alllistings });
  }


module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listing/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, '..' ,filename)
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    await newListing.save();
    req.flash("success", "new Listing created");
    res.redirect("/listings");
}


module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listing/edit.ejs", { listing , originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
   }
    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
  }


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletdListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted");
    console.log(deletdListing);
    res.redirect("/listings");
}

// search
module.exports.searchListings = async (req, res) => {
  const country = req.query.country;
  if (!country) {
    req.flash("error" , "Nothing found");
    return res.redirect("/listings");
  }
  const listings = await Listing.find({
    country: { $regex: country, $options: "i" }, 
  });
  res.render("listing/index", { alllistings: listings  }); 
};