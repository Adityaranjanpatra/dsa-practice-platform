const mongoose = require('mongoose');
const Problem = require('./problem.model');


const {Schema} = mongoose;

const submissionSchema=new Schema({
    problemId:{
        type:Schema.Types.ObjectId,
        ref:'Problem',
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    language:{
        type:String,
        enum:['cpp','java','javascript'],
        required:true
    },
    code:{
        type:String,
        required:true
    },
    runtime:{
        type:Number,
        default:0
    },
    memory:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:['Pending','Accepted','Wrong Answer','Time Limit Exceeded','Runtime Error','Compilation Error'],
        required:true
    },
    errorMessage:{
        type:String,
        default:""
    },
    testCasePassed:{
        type:Number,
        default:0
    },
    totalTestCases:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});

submissionSchema.index({  userId: 1, problemId:1 });

const Submission=mongoose.model('Submission',submissionSchema);

module.exports=Submission;