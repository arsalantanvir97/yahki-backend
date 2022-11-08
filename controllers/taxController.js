import Tax from '../models/TaxModel'
import moment from 'moment'

const createTax = async (req, res) => {
  const { state, percent } = req.body
  console.log('req.body', req.body)
  try {
    const TaxExists = await Tax.findOne({ state })

    if (TaxExists) {
      res.status(400)
      throw new Error('Tax already exists for this State')
    }
  
    const tax = new Tax({
        state, percent,
    })
    console.log('tax', tax)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const taxcreated = await tax.save()
    console.log('taxcreated', taxcreated)
    if (taxcreated) {
      res.status(201).json({
        taxcreated,
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const editTax = async (req, res) => {
  const { state, percent,taxid } = req.body
  console.log('req.body', req.body)
  try {
    const tax = await Tax.findOne({_id:taxid})
    console.log('tax', tax)
    tax.state = state
    tax.percent = percent
    await tax.save()
    console.log('tax', tax)

    res.status(201).json({
      message: 'Tax Updated Successfully',
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}

const taxlogs = async (req, res) => {
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

      const tax = await Tax.paginate(
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
        tax,
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: err.toString(),
      })
    }
  }
  const deleteTax = async (req, res) => {
    try {
      await Tax.findByIdAndRemove(req.params.id)
      return res.status(201).json({ message: 'Tax Deleted' })
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      })
    }
  }

  const gettaxdetails = async (req, res) => {
    try {
        const { state } = req.body
      const tax = await Tax.findOne({state:state});
      await res.status(201).json({
        tax
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
export { createTax, editTax, taxlogs,deleteTax,gettaxdetails}
