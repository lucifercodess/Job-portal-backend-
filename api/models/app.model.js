
import mongoose from "mongoose";

const appSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
  }
  ,phone:{
    type: String,
    required: true
  }
  ,coverLetter:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  }
  ,resume:{
    public_id:{
      type: String,
     
    },url:{
      type: String,
      
    }
  }
  ,applicant_id:{
   user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
   }
   ,role:{
    type: String,
    enum: ['Job Seeker'],
    
   }
  },employer_id:{
    user:{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     
    }
    ,role:{
     type: String,
     enum: ['Employer'],
     
    }
  }
},{timestamps: true});

const App = mongoose.model("AppliedJob",appSchema);
export default App;