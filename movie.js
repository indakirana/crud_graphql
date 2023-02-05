const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    movie: String,
    actor: String,
    author: String
});
 
module.exports = mongoose.model('Movie', movieSchema);