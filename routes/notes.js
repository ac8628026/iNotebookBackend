const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// route  1 ; all notes fetch
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some internal server error occured ");


    }
}
)

// route  2 ; add notes 
router.post('/addnote', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {


        const { title, description, tag } = req.body;
        //for error if then return bad req
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some internal server error occured ");


    }

})
//ROUTE 3 : update a note 
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    // creat new note
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};
    //find note
    let note=await Note.findById(req.params.id);
    if(!note){res.status(404).send("not found")}

    //allow to user for his notes
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("not allowed");
    }
    note=await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
   res.json({note});
})
//ROUTE 4 : delete a note 
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    // creat new note
    const newNote={};
    
    //find note
    let note=await Note.findById(req.params.id);
    if(!note){res.status(404).send("not found")}

    //allow to user for his notes
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("not allowed");
    }
    note=await Note.findByIdAndDelete(req.params.id)
     res.json({"Success": "note is successfully delete"});
})

module.exports = router