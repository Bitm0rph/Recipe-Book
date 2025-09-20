// Note: When we create a promise using new keyword, then we take resolve and reject as parameters
// But in this case we have to catch errors using 'catch'

const asyncHandler = (fn) => {
    (req,res,next) => {
        Promise
        .resolve(fn(req,res,next))
        // .reject((err) => next(err)) // This is wrong
        .catch((err) => next(err))
    }
}

export {asyncHandler}


// using try-catch

// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }