const express = require('express');
const router = express.Router({mergeParams: true});
const {validateReviewSchema} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReviewSchema, catchAsync(reviews.createReview));

router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;