// const { StatusCodes } = require('http-status-codes')

// const Models = require('../models/index')
// const Errors = require('../errors/index')


// // const createDoctor = async (req, res) => {

// //     const doctor = await Models.Doctor.create({ ...req.body })
// //     const token = doctor.createJWT()

// //     delete doctor.password

// //     return res.status(StatusCodes.CREATED).json({

// //         doctor,
// //         isValid: true,
// //         token
        
// //     })
// // }


// const createDoctor = async (req, res) => {
//     try {
//       const doctor = await Models.Doctor.create({ ...req.body });
//       const token = doctor.createJWT();
  
//       const plainDoctor = doctor.toObject();
//       delete plainDoctor.password;
  
//       return res.status(StatusCodes.CREATED).json({
//         doctor: plainDoctor,
//         isValid: true,
//         token
//       });
  
//     } catch (error) {
//       console.error("❌ Error in createDoctor:", error);
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         isValid: false,
//         message: error.message || "Something went wrong",
//       });
//     }
//   };
  


// const doctorsList = async (req, res) => {

//     let result = Models.Doctor.find({});

    
//     // const page = Number(req.query.page) || 1;
//     // const limit = Number(req.query.limit) || 10;
//     // const skip = (page - 1) * limit;
    
//     // result = result.skip(skip).limit(limit);
    
//     const doctorsList = await result;
    
//     return res.status(StatusCodes.OK).json({

//         doctorsList, 
//         nbHits: doctorsList.length,
//         isValid: true 
    
//     });

// }



// const doctor = async (req, res) => {

//     const { mongoID, email, password } = req.body

//     if(mongoID)
//     {
//         const doctor = await Models.Doctor.findOne({ _id: mongoID })

//         delete doctor.password

//         return res.status(StatusCodes.OK).json({

//             doctor,
//             isValid: true,
//             token: req.body.token
//         })

//     }
  
//     const doctor = await Models.Doctor.findOne({ email })

//     if (!doctor) {

//       throw new Errors.UnauthenticatedError('Email not found')
    
//     }
    
//     const isPasswordCorrect = await doctor.comparePassword(password)
    
//     if (!isPasswordCorrect) {
    
//         throw new Errors.UnauthenticatedError('Password is incorrect')
    
//     }

//     const token = doctor.createJWT()

//     delete doctor.password

//     return res.status(StatusCodes.OK).json({

//         doctor,
//         isValid: true,
//         token

//     })

// }


// const doctorDetail = async (req, res) => {

//     const { doctorID } = req.params

//     const doctor = await Models.Doctor.findOne({ _id: doctorID })

//     delete doctor.password

//     console.log(doctor)

//     return res.status(StatusCodes.OK).json({

//         doctor,
//         isValid: true,
//     })

// }

// module.exports = {
    
//     createDoctor,
//     doctorsList,
//     doctor,
//     doctorDetail
// }

const { StatusCodes } = require('http-status-codes');
const Models = require('../models/index');
const Errors = require('../errors/index');

const createDoctor = async (req, res) => {
  try {
    const { email } = req.body;

    // Check for duplicate email
    const existingDoctor = await Models.Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(StatusCodes.CONFLICT).json({
        isValid: false,
        message: 'Doctor with this email already exists.',
      });
    }

    const doctor = await Models.Doctor.create({ ...req.body });
    const token = doctor.createJWT();

    const plainDoctor = doctor.toObject();
    delete plainDoctor.password;

    return res.status(StatusCodes.CREATED).json({
      doctor: plainDoctor,
      isValid: true,
      token,
    });

  } catch (error) {
    console.error("❌ Error in createDoctor:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      isValid: false,
      message: error.message || "Something went wrong",
    });
  }
};

const doctorsList = async (req, res) => {
  try {
    const doctorsList = await Models.Doctor.find({});
    return res.status(StatusCodes.OK).json({
      doctorsList,
      nbHits: doctorsList.length,
      isValid: true,
    });
  } catch (error) {
    console.error("❌ Error in doctorsList:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      isValid: false,
      message: error.message,
    });
  }
};

const doctor = async (req, res) => {
  try {
    const { mongoID, email, password } = req.body;

    let doctor;

    if (mongoID) {
      doctor = await Models.Doctor.findById(mongoID);
    } else {
      doctor = await Models.Doctor.findOne({ email });
      if (!doctor) {
        throw new Errors.UnauthenticatedError('Email not found');
      }

      const isPasswordCorrect = await doctor.comparePassword(password);
      if (!isPasswordCorrect) {
        throw new Errors.UnauthenticatedError('Password is incorrect');
      }
    }

    if (!doctor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        isValid: false,
        message: 'Doctor not found',
      });
    }

    const token = doctor.createJWT();
    const plainDoctor = doctor.toObject();
    delete plainDoctor.password;

    return res.status(StatusCodes.OK).json({
      doctor: plainDoctor,
      isValid: true,
      token,
    });
  } catch (error) {
    console.error("❌ Error in doctor login:", error);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      isValid: false,
      message: error.message,
    });
  }
};

const doctorDetail = async (req, res) => {
  try {
    const { doctorID } = req.params;
    const doctor = await Models.Doctor.findById(doctorID);

    if (!doctor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        isValid: false,
        message: 'Doctor not found',
      });
    }

    const plainDoctor = doctor.toObject();
    delete plainDoctor.password;

    return res.status(StatusCodes.OK).json({
      doctor: plainDoctor,
      isValid: true,
    });
  } catch (error) {
    console.error("❌ Error in doctorDetail:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      isValid: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDoctor,
  doctorsList,
  doctor,
  doctorDetail,
};
