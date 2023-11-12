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
            twoD();
        }
        else {
            threeD();
        }
        function threeD() {
            console.log("hi");
            ctx.fillStyle = "green";
            ctx.fillRect(-w/2, h/2, canvas.width, canvas.height);
        }
        function twoD() {
            function axes() {
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
                var draw = input.draw;
                console.log(currX + " " + currY + " " + draw);

                if(draw == 1) {
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
        var dataURL = canvas.toDataURL();
        return dataURL;
       
    }
    