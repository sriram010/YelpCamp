const mongoose = require('mongoose');
const Review = require('./reviews');
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = {toJSON: {virtuals: true}};

const CampgroundSchema = new Schema({
    name: String,
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
    description: String,
    location: String,
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<a href="/campground/${this._id}">${this.name}</a>`;
})

CampgroundSchema.post('findOneAndDelete', async(doc) => {
    if (doc){
        await Review.deleteMany({_id: {$in: doc.reviews}});
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);