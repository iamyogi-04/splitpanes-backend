const router = require('express').Router();
const postdb = require('../models/Post')
const multer = require('multer');

//multer settings
const FileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        const array1 = file.originalname.split('.');  // yogesh.jpg -> ['yogesh', 'jpg']
        cb(null, file.fieldname + '-' + Date.now() + '.' + array1[array1.length - 1])   // fieldname-> images , path-> \\public\\images\\name.jpg, filename-> image1222.jpg -> req.file
    }  // images-1215157512.jpg
})
const upload = multer({ storage: FileStorage })

// /api/v1/posts
router.get('/posts', async function (req, res) {
    const post = await postdb.find();
    res.json(post)
})

// uploading post or image 
router.post('/posts', upload.single('image'), async function (req, res) {
    const { title} = req.body;
    console.log(req.file)
    const image = "/images/" + req.file.filename ;

    try {
         // /images/images-15151.jpg
        const post = postdb({ title,  image})
        const savedpost = await post.save();
        res.json(savedpost);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error creating post");
    }
})
//update the post 
router.put('/posts/:id', upload.single('image'), async function (req, res){
    const { title} = req.body;
    console.log(req.file)
    const image = "./images/" + req.file.filename ;
    try {
        const newpost = {};
        if(title){
            newpost.title = title;
        }if(image){
            newpost.image = image;
        }
        let post = await postdb.findById(req.params.id);
        post = await postdb.findByIdAndUpdate(req.params.id, {$set: newpost}, {new: true});
        res.json(newpost);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error updating post");
    }
})
//delete the file
router.delete("/posts/:id", async function (req, res) {
    try {
      let post = await postdb.findById(req.params.id);
      post = await postdb.findByIdAndDelete(req.params.id);
      res.json({ success: "deleted the file" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error occurred deleting the post");
    }
  });

module.exports = router