var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

var x = "black",
    y = 2;

var time = Date.now();
var prevTime = time;

function init() {
    canvas = document.getElementById('can');
    link = document.getElementById('link');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    ctx.translate(200, 200);
    ctx.translate(0.1, 0.1)

    var resultFound = false;

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

    fetchData();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function draw(input) {

        console.log(input);

        currX = input.x
        currY = input.y
        currZ = input.z

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.stroke();
        ctx.closePath();

        prevX = currX;
        prevY = currY;
        prevZ = currZ;

        link.href = save();

        fetchData();

    }
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
        console.log(dataURL);
        return dataURL;
       
    }
    