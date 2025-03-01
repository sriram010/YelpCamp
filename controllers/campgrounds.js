const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/show', {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createNewCampground = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, {limit: 1});
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.features[0].geometry;
    newCampground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newCampground.author = req.user._id;
    console.log(newCampground);
    await newCampground.save();
    req.flash('success', 'Successfuly made a new campground');
    res.redirect(`/campground/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
        }).populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found');
        res.redirect('/campground');
    }
    res.render('campgrounds/show_one', {campground});
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
}

module.exports.editCampground = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated the campground');
    res.redirect(`/campground/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the campground')
    res.redirect('/campground');
}