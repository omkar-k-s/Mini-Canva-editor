require('mongoose').connect('mongodb+srv://omkarks2005_db_user:pDlF2COMMSnIN4ZZ@cluster0.yfxh6vn.mongodb.net/minicanva?retryWrites=true&w=majority&appName=Cluster0').then(async () => { 
  const { Project } = require('./src/models/Project.model'); 
  try { 
    await Project.findOneAndUpdate({ _id: '6a6612479a7d0ad99d73ab19' }, { $set: { thumbnail: 'data:image/jpeg;base64,A' } }); 
    console.log('OK'); 
  } catch (e) { 
    console.error('ERROR:', e.message); 
  } 
  process.exit(0); 
})
