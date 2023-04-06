import Tag from '../models/TagModel'
import moment from 'moment'

const createtag = async (req, res) => {
  const { title } = req.body
  console.log('req.body', req.body)
  try {
    const TagExists = await Tag.findOne({ title })

    if (TagExists) {
      res.status(400)
      throw new Error('Tag already exists for this State')
    }
  
    const tag = new Tag({
        title
    })
    console.log('tag', tag)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const tagcreated = await tag.save()
    console.log('tagcreated', tagcreated)
    if (tagcreated) {
      res.status(201).json({
        tagcreated,
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const edittag = async (req, res) => {
  const { title ,id} = req.body
  console.log('req.body', req.body)
  try {
    const tag = await Tag.findOne({_id:id})
    console.log('tag', tag)
    tag.title = title
    await tag.save()
    console.log('tag', tag)

    res.status(201).json({
      message: 'Tag Updated Successfully',
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}

const taglogs = async (req, res) => {
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

      const tag = await Tag.paginate(
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
        tag,
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: err.toString(),
      })
    }
  }
  

  const gettagdetails = async (req, res) => {
    try {
      const tag = await Tag.findOne({ _id: req.params.id });
      await res.status(201).json({
        tag
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  const gettalltags = async (req, res) => {
    try {
      const getAllTags = await Tag.find()
      console.log('getAllTags', getAllTags)
      if (getAllTags) {
        res.status(201).json({
          getAllTags,
        })
      }
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      })
    }
  }
export { createtag,
    edittag,
    taglogs,
    gettalltags,
    gettagdetails}
