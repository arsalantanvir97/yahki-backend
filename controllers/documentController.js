import Document from "../models/DocumentModel";

const createDocument = async (req, res) => {
  console.log("createDocument");
  const { pdfname } = req.body;
  let doc_schedule =
    req.files &&
    req.files.doc_schedule &&
    req.files.doc_schedule[0] &&
    req.files.doc_schedule[0].path;
  let pdfimage =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  console.log("doc_schedule", doc_schedule);
  console.log("pdfname", pdfname);

  const document = await Document.create({
    pdfimage: pdfimage,
    pdfdocs: doc_schedule,
    pdfname: pdfname
  });
  await document.save();

  await res.status(201).json({
    document
  });
};
const getallDocuments = async (req, res) => {
  try {
    const getAlldocss = await Document.find();
    console.log("getAlldocss", getAlldocss);
    if (getAlldocss) {
      res.status(201).json({
        getAlldocss
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const editDocument = async (req, res) => {
  const { pdfname, documentid } = req.body;
  console.log("req.body", req.body);
  let doc_schedule =
    req.files &&
    req.files.doc_schedule &&
    req.files.doc_schedule[0] &&
    req.files.doc_schedule[0].path;
  let pdfimage =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  try {
    const document = await Document.findOne({ _id: documentid });
    console.log("document", document);
    document.pdfimage = pdfimage ? pdfimage : document.pdfimage;
    document.pdfname = pdfname ? pdfname : document.pdfname;
    document.pdfdocs = doc_schedule ? doc_schedule : document.pdfdocs;
    await document.save();
    console.log("document", document);

    res.status(201).json({
      message: "Document Updated Successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const documentlogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              pdfname: {
                $regex: `${req.query.searchString}`,
                $options: "i"
              }
            }
          ]
        }
      : {};
    const status_filter = req.query.status ? { status: req.query.status } : {};

    const from = req.query.from;
    const to = req.query.to;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day")
        }
      };

    let sort =
      req.query.sort == "asc"
        ? { createdAt: -1 }
        : req.query.sort == "des"
        ? { createdAt: 1 }
        : { createdAt: 1 };

    const document = await Document.paginate(
      {
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: sort
      }
    );
    await res.status(200).json({
      document
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createDocument, getallDocuments, editDocument, documentlogs };
