import DoctorCategory from '../models/DoctorCategoryModel'
import moment from 'moment'

const createdoctorcategory = async (req, res) => {
  const { title } = req.body
  console.log('req.body', req.body)
  try {
    const DoctorCategoryExists = await DoctorCategory.findOne({ title })

    if (DoctorCategoryExists) {
      res.status(400)
      throw new Error('DoctorCategory already exists for this State')
    }
  
    const doctorCategory = new DoctorCategory({
        title
    })
    console.log('DoctorCategory', doctorCategory)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const doctorCategorycreated = await doctorCategory.save()
    console.log('doctorCategorycreated', doctorCategorycreated)
    if (doctorCategorycreated) {
      res.status(201).json({
        doctorCategorycreated,
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const editdoctorcategory = async (req, res) => {
  const { title ,id} = req.body
  console.log('req.body', req.body)
  try {
    const doctorCategory = await DoctorCategory.findOne({_id:id})
    console.log('doctorCategory', doctorCategory)
    doctorCategory.title = title
    await doctorCategory.save()
    console.log('doctorCategory', doctorCategory)

    res.status(201).json({
      message: 'DoctorCategory Updated Successfully',
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}

const doctorcategorylogs = async (req, res) => {
    try {
      console.log('req.query.searchString', req.query.searchString)
      const searchParam = req.query.searchString
        ? { $text: { $search: req.query.searchString } }
        : {}
      const status_filter = req.query.status ? { status: req.query.status } : {}
  
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
  
        let sort =
        req.query.sort == "asc"
          ? { createdAt: -1 }
          : req.query.sort == "des"
          ? { createdAt: 1 }
          : { createdAt: 1 };

      const doctorCategory = await DoctorCategory.paginate(
        {
          ...searchParam,
          ...status_filter,
          ...dateFilter,
        },
        {
          page: req.query.page,
          limit: req.query.perPage,
          lean: true,
          sort: sort,
         
        }
      )
      await res.status(200).json({
        doctorCategory,
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: err.toString(),
      })
    }
  }
  

  const getdoctorcategorydetails = async (req, res) => {
    try {
      const doctorCategory = await DoctorCategory.findOne({ _id: req.params.id });
      await res.status(201).json({
        doctorCategory
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  const gettalldoctorcategorys = async (req, res) => {
    try {
      const getAlldoctorCategory = await DoctorCategory.find()
      console.log('getAlldoctorCategory', getAlldoctorCategory)
      if (getAlldoctorCategory) {
        res.status(201).json({
          getAlldoctorCategory,
        })
      }
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      })
    }
  }
export {   createdoctorcategory,
    editdoctorcategory,
    doctorcategorylogs,
    getdoctorcategorydetails,
    gettalldoctorcategorys
  }
