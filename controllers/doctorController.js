import expressAsyncHandler from "express-async-handler";
import DoctorCategory from "../models/DoctorCategoryModel";
import Doctor from "../models/DoctorModel";

const registerDoctor = expressAsyncHandler(async (req, res) => {
    const { firstname,
        lastname,
        category,
        email,
        phone,
        password } = req.body;

    const DoctorExists = await Doctor.findOne({ email });

    if (DoctorExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const doctor = await Doctor.create({
        firstname,
        lastname,
        category,
        email,
        phone,
        password
    });

    if (doctor) {
        const cat = await DoctorCategory.findOne({ _id: category });
        // console.log('cat',cat)
        cat.doctorcount = cat.doctorcount + 1;
        const updatedcat = cat.save();

        res.status(201).json({
            doctor
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});


const doctorlogs = async (req, res) => {
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

        const doctor = await Doctor.paginate(
            {
                ...searchParam,
                ...status_filter,
                ...dateFilter,
            },
            {
                page: req.query.page,
                limit: req.query.perPage,
                lean: true,
                populate: 'category',
                sort: sort,

            }
        )
        await res.status(200).json({
            doctor,
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
        const doctor = await Doctor.findById(req.params.id)
        console.log('doctor', doctor)
        doctor.status = doctor.status == true ? false : true
        console.log('doctor', doctor)

        await doctor.save()
        console.log('service2', doctor)

        await res.status(201).json({
            message: doctor.status ? 'Doctor Activated' : 'Doctor Deactivated',
        })
    } catch (err) {
        console.log('error', err)

        res.status(500).json({
            message: err.toString(),
        })
    }
}
const getdoctordetails = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ _id: req.params.id }).populate('category');
        await res.status(201).json({
            doctor
        });
    } catch (err) {
        res.status(500).json({
            message: err.toString()
        });
    }
};
const editdoctor = async (req, res) => {
    const { firstname,
        lastname,
        category,
        email,
        phone, id } = req.body
    console.log('req.body', req.body)
    try {
        const doctor = await Doctor.findOne({ _id: id })
        console.log('doctor', doctor)

        doctor.firstname = firstname
        doctor.lastname = lastname
        doctor.category = category
        doctor.email = email
        doctor.phone = phone

        await doctor.save()
        console.log('doctor', doctor)

        res.status(201).json({
            message: 'Doctor Updated Successfully',
        })
    } catch (err) {
        res.status(500).json({
            message: err.toString(),
        })
    }
}
const managetimeslot = async (req, res) => {
    const { timimgslot, id } = req.body
    console.log('req.body', req.body)
    try {
        const doctor = await Doctor.findOne({ _id: id })
        console.log('doctor', doctor)

        doctor.timimgslot = timimgslot
     

        await doctor.save()
        console.log('doctor', doctor)

        res.status(201).json({
            message: 'TimeSlot Updated Successfully',
        })
    } catch (err) {
        res.status(500).json({
            message: err.toString(),
        })
    }
}

const verifyAndREsetPassword = async (req, res) => {
    try {
      console.log("reset");
  
      const { existingpassword, newpassword, confirm_password, id } = req.body;
  
      console.log("req.body", req.body);
      const doctor = await Doctor.findOne({ _id:id });
  
      if (doctor && (await doctor.matchPassword(existingpassword))) {
        console.log("block1");
        if (!comparePassword(newpassword, confirm_password)) {
          console.log("block2");
          return res.status(400).json({ message: "Password does not match" });
        } else {
          console.log("block3");
          doctor.password = newpassword;
          await doctor.save();
          console.log("doctor", doctor);
          res.status(201).json({
            message: 'Password Updated Successfully',
        })
        }
      } else {
        console.log("block4");
  
        return res.status(401).json({ message: "Wrong Password" });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(400).json({ message: error.toString() });
    }
  
    // return updatedadmin
    // await res.status(201).json({
    //   message: "Password Updated",
    // });
  };

export { registerDoctor,verifyAndREsetPassword, managetimeslot,editdoctor, doctorlogs, toggleActiveStatus, getdoctordetails }