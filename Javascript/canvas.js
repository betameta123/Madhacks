var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

var x = "black",
    y = 4;

var time = Date.now();
var prevTime = time; 


function init() {
    var view = document.querySelector("input[name=checkbox]");
    var slider2 = document.getElementById('slider2');
    canvas = document.getElementById('can');
    link = document.getElementById('link');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(1,-1);
    ctx.translate(w/2, -h/2);

    function second(checked) {
        if(checked == false) {
            slider2.style.display = "none";
            twoD();
        }
        else {
            slider2.style.display = "inline-block";
            threeD();
        }
        function threeD() {
            var viewAngle = slider2.value*0.02*Math.PI;
            ctx.save();
            ctx.restore();
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(-w, -h, 2*w, 2*h);

            function moveToTx(loc,Tx)
	        {var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.moveTo(res[0],res[1]);}

            function lineToTx(loc,Tx)
            {var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.lineTo(res[0],res[1]);}

            function draw3DAxes(color,TxU,scale) {
                var Tx = mat4.clone(TxU);
                mat4.scale(Tx,Tx,[scale,scale,scale]);
        
                context.strokeStyle=color;
                context.beginPath();
                // Axes
                moveToTx([1.2,0,0],Tx);lineToTx([0,0,0],Tx);lineToTx([0,1.2,0],Tx);
                moveToTx([0,0,0],Tx);lineToTx([0,0,1.2],Tx);
                // Arrowheads
                moveToTx([1.1,.05,0],Tx);lineToTx([1.2,0,0],Tx);lineToTx([1.1,-.05,0],Tx);
                moveToTx([.05,1.1,0],Tx);lineToTx([0,1.2,0],Tx);lineToTx([-.05,1.1,0],Tx);
                  moveToTx([.05,0,1.1],Tx);lineToTx([0,0,1.2],Tx);lineToTx([-.05,0,1.1],Tx);
                // X-label
                moveToTx([1.3,-.05,0],Tx);lineToTx([1.4,.05,0],Tx);
                moveToTx([1.3,.05,0],Tx);lineToTx([1.4,-.05,0],Tx);
                // Y-label
                moveToTx([-.05,1.4,0],Tx);lineToTx([0,1.35,0],Tx);lineToTx([.05,1.4,0],Tx);
                moveToTx([0,1.35,0],Tx);lineToTx([0,1.28,0],Tx);
                // Z-label
                moveToTx([-.05,0,1.3],Tx);
                lineToTx([.05,0,1.3],Tx);
                lineToTx([-.05,0,1.4],Tx);
                lineToTx([.05,0,1.4],Tx);
        
                context.stroke();
            }

            function Curve(t){
                var result = [100.0*Math.cos(2.0*Math.PI*t),80.0*t,100.0*Math.sin(2.0*Math.PI*t)];
                return result;
            }
                        
            function Tangent(t){
                var result = [-200.0*Math.PI*Math.sin(2.0*Math.PI*t),80.0,200*Math.PI*Math.cos(2.0*Math.PI*t)];
                return result;
            }

            var CameraCurve = function(angle) {
                var distance = 120.0;
                var eye = vec3.create();
                eye[0] = distance*Math.sin(viewAngle);
                eye[1] = 100;
                eye[2] = distance*Math.cos(viewAngle);  
                return [eye[0],eye[1],eye[2]];
            }
        
            function drawTrajectory(t_begin,t_end,intervals,C,Tx,color) {
                context.strokeStyle=color;
                context.beginPath();
                moveToTx(C(t_begin),Tx);
                for(var i=1;i<=intervals;i++){
                    var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
                    lineToTx(C(t),Tx);
                }
                context.stroke();
            }
          
            var eyeCamera = CameraCurve(viewAngle);
            var targetCamera = vec3.fromValues(0,0,0); 
            var upCamera = vec3.fromValues(0,100,0); 
            var TlookAtCamera = mat4.create();
            mat4.lookAt(TlookAtCamera, eyeCamera, targetCamera, upCamera);
          
            var eyeObserver = vec3.fromValues(500,300,500);
            var targetObserver = vec3.fromValues(0,50,0); 
            var upObserver = vec3.fromValues(0,1,0); 
            var TlookAtObserver = mat4.create();
            mat4.lookAt(TlookAtObserver, eyeObserver, targetObserver, upObserver);

            var Tviewport = mat4.create();
            mat4.fromTranslation(Tviewport,[200,300,0]); 
                                                                                                                               
            mat4.scale(Tviewport,Tviewport,[100,-100,1]); 
            
            context = ctx;

            var TprojectionCamera = mat4.create();
            mat4.ortho(TprojectionCamera,-100,100,-100,100,-1,1);
        
            var TprojectionObserver = mat4.create();
            mat4.ortho(TprojectionObserver,-120,120,-120,120,-1,1);
            
            var tVP_PROJ_VIEW_Camera = mat4.create();
            mat4.multiply(tVP_PROJ_VIEW_Camera,Tviewport,TprojectionCamera);
            mat4.multiply(tVP_PROJ_VIEW_Camera,tVP_PROJ_VIEW_Camera,TlookAtCamera);
            var tVP_PROJ_VIEW_Observer = mat4.create();
            mat4.multiply(tVP_PROJ_VIEW_Observer,Tviewport,TprojectionObserver);
            mat4.multiply(tVP_PROJ_VIEW_Observer,tVP_PROJ_VIEW_Observer,TlookAtObserver);

            context = ctx;
            mat4.translate(tVP_PROJ_VIEW_Camera, tVP_PROJ_VIEW_Camera, [190, 400, 0]);
            mat4.scale(tVP_PROJ_VIEW_Camera, tVP_PROJ_VIEW_Camera, [-1, -1, 1]);
            draw3DAxes("grey",tVP_PROJ_VIEW_Camera,100.0);
            drawTrajectory(0.0,2.0,100,Curve,tVP_PROJ_VIEW_Camera,"brown");
            link.href = save();
            
        }
        function twoD() {
            function axes() {
                ctx.fillRect(-w, -h, 2*w, 2*h);
                ctx.strokeStyle="black";
                ctx.beginPath();
                // Axes
                ctx.moveTo(120,0);ctx.lineTo(0,0);ctx.lineTo(0,120);
                // Arrowheads
                ctx.moveTo(110,5);ctx.lineTo(120,0);ctx.lineTo(110,-5);
                ctx.moveTo(5,110);ctx.lineTo(0,120);ctx.lineTo(-5,110);
                // X-label
                ctx.moveTo(130,-5);ctx.lineTo(140,5);
                ctx.moveTo(130,5);ctx.lineTo(140,-5);
                // Y-label
                ctx.moveTo(-5,130);ctx.lineTo(0,135);ctx.lineTo(5,130);
                ctx.moveTo(0,135);ctx.lineTo(0,142);
                
                ctx.stroke();
            }
            function fetchData() {
                    fetch("http://localhost:3000/http://localhost:8080")
                    .then((response) => {
                        if (!response.ok) {
                        throw new Error(`HTTP error: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((json) => draw(json))
                    .catch((err) => console.error(`Fetch problem: ${err.message}`));
            }
              
    
            function draw(input) {
                currX = input.x / 10
                currY = input.y / 10
                var d = input.draw;
                console.log(currX + " " + currY + " " + d);

                if(d == 1) {
                    ctx.beginPath();
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(currX, currY);
                    ctx.stroke();
                    ctx.closePath();
                    prevX = currX;
                    prevY = currY;
                    link.href = save();
                }
                fetchData();
            }
            axes();
            fetchData();     
        }
    }
    view.addEventListener('change', function() {
        if (this.checked) {
          console.log("Checkbox is checked..");
          second(true);
        } else {
          console.log("Checkbox is not checked..");
          second(false);
        }
    });
    slider2.addEventListener('input', function() {
        second(true);
    })
    second(view.checked);
}
    function erase() {
        var m = confirm("Want to clear");
        if (m) {
            ctx.clearRect(0, 0, w, h);
            document.getElementById("canvasimg").style.display = "none";
        }
    }
    
    function save() {  
        console.log('hi');
        var dataURL = canvas.toDataURL();
        return dataURL;
       
    }
    