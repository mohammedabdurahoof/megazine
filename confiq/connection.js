const mongoClient = require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect=function(done){
    const url='mongodb://mohammedabdurahoof527:aB-8943485194@ac-pmfimly-shard-00-00.paqexqg.mongodb.net:27017,ac-pmfimly-shard-00-01.paqexqg.mongodb.net:27017,ac-pmfimly-shard-00-02.paqexqg.mongodb.net:27017/?ssl=true&replicaSet=atlas-fux4aj-shard-0&authSource=admin&retryWrites=true&w=majority'
    const dbname='megazin'

    mongoClient.connect(url,{ useUnifiedTopology: true },(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    
    })

    
}

module.exports.get=function(){
    return state.db
}