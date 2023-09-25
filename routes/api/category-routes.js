const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', async (req, res) => {
  // Gets all Categories and connected Products
  try {
    const allCategories = await Category.findAll({
      include: [{model: Product}],
    });
    res.status(200).json(allCategories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // Gets an individual Category by ID and its connected Products
  try {
    const categoryById = await Category.findByPk(req.params.id, {
      include: [{model: Product}],
    });
    if (!categoryById) {
      res.status(404).json({ message: 'No categories found with that id!'});
      return;
    }
    res.status(200).json(categoryById);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // Creates a New Category
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  //Updates a Category by its ID 
  try {
    const updateCategory = await Category.update(
      req.body,{
        where: {
          id: req.params.id,
        },
      }
    );
    if (!updateCategory) {
      res.status(404).json({ message: 'No categories found with that id!'});
      return;
    }
    res.json(updateCategory);
  } catch (err) {
  res.status(500).json(err);    
  }
});

router.delete('/:id', async (req, res) => {
  // Deletes a Category by its ID
  try {
    const removeCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!removeCategory) {
      res.status(404).json({ message: 'No categories found with that id!'});
      return;
    }
    res.status(200).json(removeCategory);
  } catch (err) {
    res.status(500).json(err);    
  }
});

module.exports = router;
