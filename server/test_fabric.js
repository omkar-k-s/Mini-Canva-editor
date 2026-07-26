const fabric = require('fabric').fabric;
const canvas = new fabric.Canvas(null, { width: 1080, height: 756 });
fabric.util.enlivenObjects([{ 
  type: 'textbox', 
  text: 'Recipient Name', 
  left: 40, top: 280, width: 1000, 
  fontSize: 72, fontWeight: '700', fontFamily: 'Georgia', 
  fill: '#6366f1', textAlign: 'center'
}], (objects) => { 
  objects.forEach(o => canvas.add(o)); 
  
  // SIMULATE USER CHANGING CHAR SPACING
  const textObj = canvas.getObjects()[0];
  textObj.set({ charSpacing: 100 });
  canvas.requestRenderAll();
  
  try { 
    const json = canvas.toJSON(['id', 'name', 'selectable']); 
    console.log('SUCCESS JSON'); 
  } catch (e) { 
    console.error('ERROR JSON:', e.message); 
  } 
});
