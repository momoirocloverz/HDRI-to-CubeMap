import { Vector3 as V3 } from 'three'
import { procRenderer, procCamera } from '../components/process'
import { mainScene, mainCamera, renderer } from '../components/base';
import { updateMaterial } from '../materials/sphereMat'
const renderCatch = {
  blobs: [],
  names: [],
  packed: [],
  zipping: false,
  progNow: 0,
  progTotal: 0,
  canvas: document.createElement('canvas'),
}


const calcAngle = () => {
  const direction = new V3
  mainCamera.getWorldDirection(direction);
  const angle = direction.multiply(new V3(1, 0, 1)).angleTo(new V3(0, 0, -1));
  if (direction.x < 0) {
    return angle;
  } else {
    return -angle;
  }
}
const packBlobsSep = (callback = href => { }, progress = prog => { }) => {
  const { names, blobs, } = renderCatch;
  renderCatch.packed = [false, false, false, false, false, false];
  console.log(blobs);

  zip.createWriter(new zip.BlobWriter(), writer => {
    const nester = (startIndex = 0, endIndex = 5, callback = () => { }) => {
      console.log('startIndex0:', startIndex);
      writer.add(names[startIndex], new zip.BlobReader(blobs[startIndex]), () => {
        renderCatch.packed[startIndex] = true;
        console.log('startIndex:', startIndex);

        renderCatch.progNow++;
        const { progNow, progTotal } = renderCatch
        progress({ progNow, progTotal });

        if (startIndex >= endIndex) {
          callback();
        } else {
          nester(startIndex + 1, endIndex, callback);
        }
      });
    }
    nester(0, 5, () => {
      console.log(renderCatch.packed);
      writer.close(blob => {
        callback(URL.createObjectURL(blob));
      });
    });
  });
}



const storeBlobsSep = (name, callback = href => { }, progress = prog => { }) => {
  procRenderer.domElement.toBlob(blob => {
    renderCatch.blobs.push(blob);
    renderCatch.names.push(`${name}.png`)
    renderCatch.progNow++;
    const { progNow, progTotal } = renderCatch;
    progress({ progNow, progTotal })
    console.log('blob', blob)
    if (renderCatch.blobs.length === 6) {
      packBlobsSep(callback, progress);
    }
  });

}
const procRenderSep = (size = 64, callback = (href) => { }, progress = prog => {}) => {
  renderCatch.blobs = [];
  renderCatch.names = [];
  renderCatch.progTotal = 12;
  procRenderer.setSize(size, size);
  procCamera.rotation.set(0, 0, 0);

  const angle = calcAngle();
  procCamera.rotateY(angle);

  //+x
  updateMaterial();
  procCamera.rotateY(-Math.PI / 2);
  procRenderer.render(mainScene, procCamera);
  storeBlobsSep('xp', callback, progress);
  //-x
  updateMaterial();
  procCamera.rotateY(Math.PI);
  procRenderer.render(mainScene, procCamera);
  storeBlobsSep('xn', callback, progress);
  //+y
  updateMaterial();
  procCamera.rotateY(-Math.PI / 2);
  procCamera.rotateX(Math.PI / 2);
  procRenderer.render(mainScene, procCamera);
  storeBlobsSep('yp', callback, progress);
  //-y
  updateMaterial();
  procCamera.rotateX(-Math.PI);
  procRenderer.render(mainScene, procCamera);
  storeBlobsSep('yn', callback, progress);
  //+z
  updateMaterial();
  procCamera.rotateX(Math.PI / 2);
  procRenderer.render(mainScene, procCamera);
  storeBlobsSep('zp', callback, progress);
  //-z
  updateMaterial();
  procCamera.rotateY(Math.PI);
  procRenderer.render(mainScene, procCamera);
  storeBlobsSep('zn', callback, progress);

  // packBlobs(callback);
}
const procRenderUnity = (size = 64, callback = href => { }, progress = prog => {}) => {
  const {canvas} = renderCatch;
  canvas.width = size*4;
  canvas.height = size*3;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);

  procRenderer.setSize(size, size);
  procCamera.rotation.set(0, 0, 0);

  const angle = calcAngle();
  procCamera.rotateY(angle);

  updateMaterial();
  procRenderer.render(mainScene, procCamera);
  ctx.drawImage(procRenderer.domElement,size,size);

  updateMaterial();
  procCamera.rotateY(-Math.PI / 2);
  procRenderer.render(mainScene, procCamera);
  ctx.drawImage(procRenderer.domElement,size*2,size);

  updateMaterial();
  procCamera.rotateY(-Math.PI / 2);
  procRenderer.render(mainScene, procCamera);
  ctx.drawImage(procRenderer.domElement,size*3,size);

  updateMaterial();
  procCamera.rotateY(-Math.PI / 2);
  procRenderer.render(mainScene, procCamera);
  ctx.drawImage(procRenderer.domElement,0,size);

  updateMaterial();
  procCamera.rotateY(-Math.PI / 2);
  procCamera.rotateX(Math.PI/2);
  procRenderer.render(mainScene, procCamera);
  ctx.drawImage(procRenderer.domElement,size,0);

  updateMaterial();
  procCamera.rotateX(-Math.PI);
  procRenderer.render(mainScene, procCamera);
  ctx.drawImage(procRenderer.domElement,size,size*2);

  // document.body.appendChild(canvas);
  console.log('zip start')
  canvas.toBlob(blob=>{
    console.log('blob created')
    zip.createWriter(new zip.BlobWriter(), writer => {
      writer.add('StandardCubeMap.png', new zip.BlobReader(blob),()=>{
        writer.close(blob => {
          console.log('zip end')
          callback(URL.createObjectURL(blob));
        });
      });
    });
  });
}
const procRenderUE4 = (size = 64, callback = href => { }, progress = prog => {}) => {
  const {canvas} = renderCatch;
  canvas.width = size*6;
  canvas.height = size*1;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);

  procRenderer.setSize(size, size);
  procCamera.rotation.set(0, 0, 0);

  const angle = calcAngle();
  procCamera.rotateY(angle);

  updateMaterial();
  procCamera.rotateY(Math.PI/2);
  procCamera.rotateX(-Math.PI/2);
  procRenderer.render(mainScene, procCamera);
  ctx.drawImage(procRenderer.domElement,0,0);

  updateMaterial();
  procCamera.rotateY(-Math.PI);
  procRenderer.render(mainScene, procCamera);
  ctx.drawImage(procRenderer.domElement,size,0);

  updateMaterial();
  procCamera.rotateY(-Math.PI);
  procRenderer.render(mainScene, procCamera);
  ctx.drawImage(procRenderer.domElement,size,0);
}


export { procRenderSep,procRenderUnity,procRenderUE4 }

