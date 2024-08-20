/* eslint-disable no-unused-vars */
const express = require('express');
let success = false;
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require("../models/Notes");
const { validationResult, body } = require('express-validator');
//add a note for specific user login required
router.post('/addnote', fetchuser, [
	body('title', 'title is required').exists(),
	body('description', 'description must be at least 10 characters').isLength({ min: 10 })
], async (req, res) => {
	try {
		//if there is no proper fromat then this error
		const { title, description, tag } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			success = false;
			return res.status(400).json({success, errors: errors.array() });
		}
		const newNote = await Notes.create({
			user: req.user.id,
			title: title,
			description: description,
			tag: tag
		})
		const savedNote = await newNote.save();
		success = true;
		res.json(success);
	}  catch (error) {
		console.error(error);
		
		success = false;
		res.status(500).send(success, "Internal Server Error");
	 }

})

//get the all notes of specific user login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
	const notes = await Notes.find({ user: req.user.id });
	success = true;
	res.json({success ,notes});
})



//update a existing note of a user method:PUT login required
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
	try {
	const {title , description ,tag} = req.body;
	//create a new note object
	const newNote = {};
	if(title){newNote.title = title};
	if(description){newNote.description = description};
	if(tag){newNote.tag = tag};

	//find the note and update it with newNote
          // const note =  Notes.findByIdAndUpdate();
	let note = await Notes.findById(req.params.id);
	if(!note){
		success = false;
		return res.status(404).send(success ,"invalid note")}

	//check if user is updating his note or any other user's note
	if(note.user.toString() !== req.user.id) {
		success = false;
	   return res.status(401).send(success ,"Not Allowed");
	}
	//now note exists and user is authorised
	//now we can update the requested note
	note = await Notes.findByIdAndUpdate(req.params.id ,{$set: newNote},{new:true});
	success = true;
	res.json(success);
}  catch (error) {
	console.error(error);
	
	success = false;
	res.status(500).send(success,"Internal Server Error");
 }
})

//delete a note of a specific user method:DELETE and login is required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
	try {
      let note = await Notes.findByIdAndDelete(req.params.id);
      if(!note){
	success = false;
	return res.status(404).send(success)}

      if(note.user.toString() !== req.user.id) {
	success = false;
	return res.status(401).send(success);
       };
       success = true;
       res.json(success);
}  catch (error) {
	console.error(error);
	
	success = false;
	res.status(500).send(success);
 }
})
module.exports = router;