var express = require('express'),
    router = express.Router()

// Require controller modules.
var book_controller = require('../controllers/bookController')
var author_controller = require('../controllers/authorController')
var genre_controller = require('../controllers/genreController')
var book_instance_controller = require('../controllers/bookinstanceController')

/// BOOK ROUTER //

// GET catalog home page.
router.get('/', book_controller.index);

// GET request for creating a Book. NOTE this must come before routes that display book (uses id).
router.get('/book/create', book_controller.book_create_get)

// POST request for creating a Book.
router.post('/book/create', book_controller.book_create_post)

// GET request to delete Book
router.get('/book/:id/delete', book_controller.book_delete_get)

// POST request for one book.
router.get('/book/:id/delete', book_controller.book_delete_post)

// GET request to update Book.
router.get('/book/:id/update', book_controller.book_update_get)

// POST requset to update Book.
router.post('/book/:id/update', book_controller.book_update_post)

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail)

// GET request for list of all Book items.
router.get('/books', book_controller.book_list)

/// AUTHOR ROUTES ///

// GET request for creating a Author. NOTE This must come befor route for id (i.e. display author).
router.get('/author/:id/create', author_controller.author_create_get)

// POST request for creating Author.
router.post('/author/:id/create', author_controller.author_create_post)

// GET request to delete Author
router.get('/author/:id/delete', author_controller.author_delete_get)

// POST request to delete Author
router.post('/author/:id/delete', author_controller.author_delete_post)

// GET request to update Author
router.get('/author/:id/update', author_controller.author_update_get)

// POST request to update Author
router.post('/author/:id/update', author_controller.author_update_post)

// GET request for one Author
router.get('/author/:id', author_controller.author_detail)

// POST request for list of all Authors
router.get('/authors', author_controller.author_list)

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE this must come before route that displays Genre (suse id).
router.get('/genre/:id/create', genre_controller.genre_create_get)

// POST reqquest for creating a Genre.
router.post('/genre/:id/create', genre_controller.genre_create_post)

// GET request to update a Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get)

// POST request to update a Genre
router.post('/genre/:id/update', genre_controller.genre_update_post)

// GET request to delete
router.get('/genre/:id/delete', genre_controller.genre_delete_get)

// POST request to delete
router.post('/genre/:id/delete', genre_controller.genre_delete_post)

// GET request for one Author
router.get('/genre/:id', genre_controller.genre_detail)

// GET request a list of all Genres
router.get('/genres', genre_controller.genre_list)

/// BOOKINSTACE ROUTES ///

// GET resquest for creating BookIsntance
router.get('/bookinstance/:id/create', book_instance_controller.bookinstance_create_get)

// POST request for creating BookInstance
router.post('/bookinstance/:id/create', book_instance_controller.bookinstance_create_post)

// GET resquest to update BookInstance
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_create_get)

// POST request to update BookInstance
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post)

// GET resquest to delete BookInstance
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_create_get)

// POST request to delete BookInstance
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post)

// GET resquest for one BookInstance
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail)

// GET resquest for list of all BookInstance
router.get('/bookinstances', book_instance_controller.bookinstance_list)


module.exports = router