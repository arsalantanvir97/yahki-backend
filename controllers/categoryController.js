import Category from '../models/CategoryModel.js'
import Product from '../models/ProductModel.js'

const createCategory = async (req, res) => {
  const { categorytitle, description, visible, status } = req.body
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path
  console.log('user_image', user_image)

  const category = await Category.create({
    categorytitle,
   
    description,
    visible,
    categoryimage: user_image,
    
  })
  if (category) {
    //   const notification = {
    //     notifiableId: null,
    //     notificationType: "Service",
    //     title: "Service Created",
    //     body: `A service with id of ${service._id} has been created`,
    //     payload: {
    //       type: "Service",
    //       id: service._id,
    //     },
    //   };
    //   CreateNotification(notification);
    console.log('category', category)
    res.status(201).json({
      category,
    })
  } else {
    res.status(400)
    throw new Error('Invalid Category data')
  }
}
const CategoryLogs = async (req, res) => {
  try {
    console.log('req.query.searchString', req.query.searchString)
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              categorytitle: {
                $regex: `${req.query.searchString}`,
                $options: 'i',
              },
            },
            {
              subcategory: {
                $regex: `${req.query.searchString}`,
                $options: 'i',
              },
            },
          ],
        }
      : {}
    const status_filter = req.query.status ? { status: req.query.status } : {}
    let sort =
    req.query.sort == "asc"
      ? { createdAt: -1 }
      : req.query.sort == "des"
      ? { createdAt: 1 }
      : { createdAt: 1 };
    const from = req.query.from
    const to = req.query.to
    let dateFilter = {}
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf('day'),
          $lte: moment.utc(new Date(to)).endOf('day'),
        },
      }

    const category = await Category.paginate(
      {
        ...searchParam,
        ...status_filter,
        ...dateFilter,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort:sort,
      }
    )
    await res.status(200).json({
      category,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const toggleActiveStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    console.log('category', category)
    category.status = category.status == true ? false : true
    console.log('category', category)

    await category.save()
    console.log('service2', category)

    await res.status(201).json({
      message: category.status ? 'Category Activated' : 'Category Deactivated',
    })
  } catch (err) {
    console.log('error', err)

    res.status(500).json({
      message: err.toString(),
    })
  }
}
const getCategoryDetails = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    await res.status(201).json({
      category,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const editCategory = async (req, res) => {
  const { id, categorytitle, description, visible, status } = req.body
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path
  console.log('user_image', user_image)
  const category = await Category.findOne({ _id: id })
  category.categorytitle = categorytitle
  category.description = description
  category.visible = visible
  category.status = status

  category.categoryimage = user_image ? user_image : category.categoryimage
  await category.save()
  // const notification = {
  //   notifiableId: null,
  //   notificationType: "Service",
  //   title: "Service UPdated",
  //   body: `A service with id of ${service._id} has been updated`,
  //   payload: {
  //     type: "Service",
  //     id: service._id,
  //   },
  // };
  // CreateNotification(notification);
  // await res.status(201).json({
  //   message: "service Update",
  //   service,
  // });
  await res.status(201).json({
    category,
  })
}
const allOfCategories = async (req, res) => {
  try {
    const getAllCategories = await Category.find()
    console.log('getAllCategories', getAllCategories)
    if (getAllCategories) {
      res.status(201).json({
        getAllCategories,
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const getCategoryDetailsanditsProduct = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    const product = await Product.find({category:category._id}).limit(6)

    await res.status(201).json({
      category,product
    })
  } catch (err) {
    console.log('err',err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}
export {
  createCategory,
  CategoryLogs,
  toggleActiveStatus,
  getCategoryDetails,
  editCategory,
  allOfCategories,
  getCategoryDetailsanditsProduct
}
