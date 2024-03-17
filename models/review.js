const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true
    },
    rating: {  
        type: Number,
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    dateReview: {
        type: Date,
        default: Date.now
    }
})

reviewSchema.virtual('id').get(function () {
    return this._id ? this._id.toHexString() : null;
});

reviewSchema.set('toJSON', {
    virtuals: true,
});

exports.Review = mongoose.model('Review', reviewSchema);
