const mongosse=require("mongoose")
const mongoURI="mongodb://localhost:27017/inotebook?readPreference=primary&tls=false&directConnection=true"


const connectToMongo=()=>{
    mongosse.connect(mongoURI,()=>{
        console.log("mongosse connected")
    })

}

module.exports = connectToMongo;