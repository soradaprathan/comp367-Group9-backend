const { Review } = require('../models/review');
const { Order } = require('../models/order');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    let reviewList = [];
    if (req.query.product) {
        // console.log("PRODUCT ID: " + req.query.product);
        reviewList = await Review.find( {'product': req.query.product})
        .populate('user', 'name')
        .populate({
            path: 'product', 
            select: 'name',
            match: { '_id': req.query.product  },
        })
        .sort({ 'dateReview': -1 });
    }else{
        // console.log("Don't have product id");
        reviewList = await Review.find()
        .populate('user', 'name')
        .populate('product', 'name')
        .sort({ 'dateReview': -1 });
    }


    // const reviewList = await Review.find({match: {'product': req.query.product}})
    //     .populate('user', 'name')
    //     .populate({
    //         path: 'product', 
    //         select: 'name',
    //         match: { '_id': req.query.product  },
    //     })
    //     .sort({ 'dateReview': -1 });

    console.log("REVIEW LIST: " );
    console.log(reviewList);
    // console.log("TEST:" );
    // filter2 = { product: req.query.product };
    // const test = await Review.find(filter2)
    //     .sort({ 'dateReview': -1 });
    // console.log(test);

    if (!reviewList) {
        res.status(500).json({ success: false })
    }
    res.send(reviewList);
})

router.get(`/:id`, async (req, res) => {
    const review = await Review.findById(req.params.id)
        .populate('user', 'name')
        .populate('product', 'name');

    if (!review) {
        res.status(500).json({ success: false })
    }
    res.send(review);
})

router.post(`/`, async (req, res) => {

    let review = new Review({

        comment: req.body.comment,
        rating: req.body.rating,
        user: req.body.user,
        product: req.body.product,
        order: req.body.order
    })

    review = await review.save();

    if (!review)
        return res.status(404).send('Review cannot be created!')

    res.send(review);
});

router.put('/:id', async (req, res) => {
    const review = await Review.findByIdAndUpdate(
        req.params.id,
        {
            comment: req.body.comment,
            rating: req.body.rating,
        },
        { new: true }
    )

    if (!review)
        return res.status(404).send('Review cannot be updated!')

    res.send(review);
});

router.delete('/:id', (req, res) => {
    Review.findByIdAndDelete(req.params.id).then(review => {
        if (review) {
            return res.status(200).json({ success: true, message: 'Review deleted successfully.' })
        } else {
            return res.status(404).json({ success: false, message: 'Review not found.' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
});


//http://localhost:3000/api/v1/reviews/get/countbyproductid/65bd727bd288b143b45573a5
router.get(`/get/countbyproductid/:id`, async (req, res) => {

    const positiveReviewCount = await Review.countDocuments({ product: req.params.id, rating: '1' });

    const negativeReviewCount = await Review.countDocuments({ product: req.params.id, rating: '0' });

    res.send({
        recommendCount: positiveReviewCount,
        notRecommendCount: negativeReviewCount
    });

});

router.get(`/get/averagebyproductid/:id`, async (req, res) => {

    // const averageRating = await Review.aggregate([
    //     {
    //         $match: {product: req.params.id}
    //     },
    //     {
    //         $group: {
    //             _id: '$product',
    //             averageRating: {$avg: '$rating'}
    //         }
    //     }
    // ]);

    // console.log("RATING AVG: " + averageRating);

    // res.send(averageRating);

    try {
        const productId = req.params.id;

        // Find all reviews for the given product
        const reviews = await Review.find({ product: productId });

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for the product' });
        }

        // Calculate average rating
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        res.send({ averageRating: averageRating });
    } catch (error) {
        console.error('Error fetching average rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

module.exports = router;

