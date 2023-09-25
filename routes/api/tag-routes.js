const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');


router.get('/', async (req, res) => {
  // Gets all Tags and connected Products
 
  try {
    const allTags = await Tag.findAll({
      include: [{model: Product, through: ProductTag}],
    });
    res.status(200).json(allTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // Gets an individual Tag by ID and its connected Products

  try {
    const tagById = await Tag.findByPk(req.params.id, {
      include: [{model: Product, through: ProductTag}],
    });
    if (!tagById) {
      res.status(404).json({ message: 'No tags found with that id!'});
      return;
    }
    res.status(200).json(tagById);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // Creates a New Tag

  try {
    const newTag = await Tag.create(req.body);
    if (!newTag) {
      res.status(404).json({message: 'No tags found with that id!'})
    }
    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  //Updates a Tag by its ID 

  try {
    const updateTag = await Tag.update(
      req.body,{
        where: {
          id: req.params.id,
        },
      }
    );
    if (!updateTag) {
      res.status(404).json({ message: 'No tags found with that id!'});
      return;
    }
    res.json(updateTag);
  } catch (err) {
  res.status(500).json(err);    
  }
});

router.delete('/:id', async (req, res) => {
  // Deletes a Category by its ID
  
  try {
    const removeTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(removeTag);
  } catch (err) {
    res.status(500).json(err);    
  }
});

module.exports = router;
