const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');




router.get('/', async (req, res) => {
  // Gets all Products and its connected Category and Tag Data
  try {
    const allProducts = await Product.findAll({
      include: [{model: Category},{model: Tag, through: ProductTag}],
    });
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/:id', async (req, res) => {
  // Gets an individual Product by ID and its connected Category and Tag Data
  try {
    const productById = await Product.findByPk(req.params.id, {
      include: [{model: Category},{model: Tag, through: ProductTag}],
    });
    if (!productById) {
      res.status(404).json({ message: 'No products found with that id!'});
      return;
    }
    res.status(200).json(productById);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/', (req, res) => {
  //Creates a New Product

  /* req.body should look like this...
    {
      "product_name": "Basketball",
      "price": 200.00,
      "stock": 3,
      "tagIds": [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // If there's associated product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // If there's no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


router.put('/:id', (req, res) => {
 //Updates a Product by its ID 
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // Figures out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // Runs both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // Deletes a Product by its ID
  try {
    const removeProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(removeProduct);
  } catch (err) {
    res.status(500).json(err);    
  }
});

module.exports = router;
