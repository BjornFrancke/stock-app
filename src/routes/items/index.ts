import express from "express";


const itemRouter = express.Router()



itemRouter.route('/')
    .get((req, res) => {
        res.send("Get all items")
    })
    .post((req, res) => {
        res.send("Create item")
    })

itemRouter.route('/:itemId')
    .get((req, res) => {
    res.send(`Item ID: ${req.params.itemId}`);
})
    .post((req, res) => {
        res.send(`Item ID: ${req.params.itemId}`)
    })
.put((req, res) => {
    res.send(`Updating item with ID: ${req.params.itemId}`);
})
.delete((req, res) => {
    res.send(`Deleting item with ID: ${req.params.itemId}`);
})

export default itemRouter