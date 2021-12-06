import Document from "../models/DocumentModel";

const createDocument = (async (req, res) => {
    console.log('createDocument')
    const { pdfname } = req.body;
    let doc_schedule =
      req.files &&
      req.files.doc_schedule &&
      req.files.doc_schedule[0] &&
      req.files.doc_schedule[0].path;
 console.log('doc_schedule',doc_schedule)
 console.log('pdfname',pdfname)

      const document = await Document.create({
        
        pdfdocs:doc_schedule,
        pdfname:pdfname,
      
      });

    //   const notification = {
    //     notifiableId: null,
    //     notificationType: "Test",
    //     title: "Test Report Created",
    //     body: `A test report named ${pdfname} has been created `,
    //     payload: {
    //       type: "Test",
    //       id: test._id,
    //     },
    //   };
    //   CreateNotification(notification);
    await document.save();
    // await res.status(201).json({
    //   message: "Admin Update",
    //   admin,
    // });
    await res.status(201).json({
        document
    });
  });
  const getallDocuments  = async (req, res) => {
  
    try {
        const getAlldocss=await Document.find()
        console.log('getAlldocss',getAlldocss)
        if (getAlldocss) {
         res.status(201).json({
            getAlldocss
         });}
      }catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  
  export{createDocument,getallDocuments}