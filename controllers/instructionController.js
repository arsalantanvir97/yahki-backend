import EattoliveText from "../models/EattoliveTextModel";
import Instruction from "../models/InstructionModel";
import InstructionText from "../models/InstructionTextModel";

const createinstruction = async (req, res) => {
  const { videotitle, description } = req.body;
  let ad_video =
    req.files &&
    req.files.ad_video &&
    req.files.ad_video[0] &&
    req.files.ad_video[0].path;
  console.log("ad_video", ad_video);

  const instruction = await Instruction.create({
    videouri: ad_video,
    videotitle,
    description
  });
  await instruction.save();

  await res.status(201).json({
    instruction
  });
};
const getallinstructions = async (req, res) => {
  try {
    const getallinstructions = await Instruction.find().lean();
    const instructiontext = await InstructionText.findOne().lean();

    console.log("getallinstructions", getallinstructions);
    if (getallinstructions) {
      res.status(201).json({
        getallinstructions,
        instructiontext
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const editinstruction = async (req, res) => {
  const { videotitle, description, id } = req.body;
  let ad_video =
    req.files &&
    req.files.ad_video &&
    req.files.ad_video[0] &&
    req.files.ad_video[0].path;
  console.log("ad_video", ad_video);
  try {
    const instruction = await Instruction.findOne({ _id: id });
    console.log("instruction", instruction);
    instruction.videotitle = videotitle ? videotitle : instruction.videotitle;
    instruction.description = description
      ? description
      : instruction.description;
    instruction.videouri = ad_video ? ad_video : instruction.videouri;
    await instruction.save();
    console.log("instruction", instruction);

    res.status(201).json({
      message: "Instruction Updated Successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const instructionlogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              videotitle: {
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

    const instruction = await Instruction.paginate(
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
    const editinstruction=await InstructionText.findOne().lean()
    await res.status(200).json({
      instruction,
      editinstruction
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const editinstructiontext = async function (req, res) {
  const { text } = req.body;
  let editinstruction;
  try {
    editinstruction = await InstructionText.findOne();
    if (editinstruction) {
      editinstruction.text = text;
    } else {
      instructionn = await InstructionText.create({
        text
      });
    }
    await editinstruction.save();
    res.status(201).json({
      editinstruction
    });
  } catch (error) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const editeattolivetext = async function (req, res) {
  const { text } = req.body;
  let editeattolive;
  try {
    editeattolive = await EattoliveText.findOne();
    if (editeattolive) {
      editeattolive.text = text;
    } else {
      eattoliven = await EattoliveText.create({
        text
      });
    }
    await editeattolive.save();
    res.status(201).json({
      editeattolive
    });
  } catch (error) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  createinstruction,
  getallinstructions,
  editeattolivetext,
  editinstruction,
  instructionlogs,
  editinstructiontext
};
