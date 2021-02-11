/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var mongoose = require('mongoose')
const { Schema } = mongoose

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new Schema({
  title: {type: String, required: true},
  comments: [String],
  commentcount: {type: Number, default: 0}
})

let Book = mongoose.model('Book', bookSchema)

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, allBooks) => {
        if(!err) {
          res.json(allBooks)
        }
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title) {
        res.send('missing required field title')
      } else {
        let book = Book({
          title: title
        })
        
        book.save((err, newBook) => {
          if(!err) {
            let response = {
              _id: newBook._id,
              title: newBook.title
            }
            res.json(response)
          }
        })
      }

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, noBooks) => {
        if(!err) {
          res.send('complete delete successful')
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, book) => {
        if(!err && book !== null) {
          res.json(book)
        } else {
          res.send('no book exists')
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if(!comment) {
        res.send('missing required field comment')
      } else {
        Book.findById(bookid, (err, book) => {
          if(!err && book !== null) {
            book.comments.push(comment)
            book.commentcount ++ 

            book.save((err, updatedBook) => {
              if(!err) {
                res.json(updatedBook)
              }
            })
          } else {
            res.send('no book exists')
          }
        })
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndRemove(bookid, (err, removed) => {
          if(!err && removed !== null) {
            res.send('delete successful')
          } else {
            res.send('no book exists')
          }
        })
    });
  
};
