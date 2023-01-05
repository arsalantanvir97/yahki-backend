const  extendTimeout= async(req, res, next) =>{
    res.setTimeout(48000000, function () {  console.log('Request has timed out.');
    res.send(408);})
    next()
  }


  export{extendTimeout}